import uuid
from datetime import timedelta
from functools import wraps

from app.core.errors import (
    EMAIL_ALREADY_REGISTERED,
    INVALID_EMAIL,
    INVALID_OTP,
    OTP_NOT_VERIFIED,
    PASSWORD_MISMATCH,
    SESSION_EXPIRED,
)
from app.models.user import User
from app.services.email_service import email_validator, send_otp_email
from app.services.jwt_service import create_access_token, create_registration_token
from app.services.password_service import check_password, hash_password
from app.services.redis_service import delete_data, set_data
from app.services.token_service import get_registration_data_from_token_and_redis
from app.services.user_service import is_email_registered
from fastapi import HTTPException, Request, Response
from sqlalchemy.orm import Session


def registration_required(func):
    @wraps(func)
    async def wrapper(
        request: Request, response: Response, db: Session, *args, **kwargs
    ):
        registration_token = request.cookies.get("registration_token")
        if not registration_token:
            raise HTTPException(status_code=404, detail=SESSION_EXPIRED)

        id, data = get_registration_data_from_token_and_redis(registration_token)
        if not data:
            raise HTTPException(status_code=404, detail=SESSION_EXPIRED)

        if not email_validator(data["email"]):
            raise Exception(INVALID_EMAIL)

        if is_email_registered(data["email"], db):
            raise HTTPException(status_code=400, detail=EMAIL_ALREADY_REGISTERED)

        return await func(request, response, db, *args, **kwargs, data=data, id=id)

    return wrapper


def start_registration(email: str, response: Response, db: Session):
    if not email_validator(email):
        raise Exception(INVALID_EMAIL)

    if is_email_registered(email, db):
        raise HTTPException(status_code=400, detail=EMAIL_ALREADY_REGISTERED)

    registration_id = str(uuid.uuid4())
    otp = str(uuid.uuid4().int)[:6]

    send_otp_email(email, otp)

    registration_token = create_registration_token({"sub": str(registration_id)})

    response.set_cookie(
        key="registration_token",
        value=registration_token,
        httponly=True,
        max_age=1800,
        expires=1800,
        secure=True,
        samesite="None",
    )

    set_data(
        "registration",
        registration_id,
        {"email": email, "otp": otp, "otp_verified": False, "password": None},
    )

    return {"message": "Registration started. OTP sent to email."}


@registration_required
async def registration_data(
    request: Request, response: Response, db: Session, data: dict, id: str
):
    return {
        "email_entered": email_validator(data["email"]),
        "otp_verified": data["otp_verified"],
        "password_is_set": type(data["password"]) is str,
    }


@registration_required
async def resend_otp(
    request: Request, response: Response, db: Session, data: dict, id: str
):
    send_otp_email(data["email"], data["otp"])
    return {"message": "OTP resent successfully."}


@registration_required
async def verify_email(
    request: Request, response: Response, db: Session, data: dict, id: str
):
    body = await request.json()
    otp = body.get("otp")

    if data["otp"] != otp:
        raise HTTPException(status_code=400, detail=INVALID_OTP)

    data["otp_verified"] = True
    set_data(
        "registration",
        id,
        data,
    )

    return {"message": "OTP verified successfully."}


@registration_required
async def set_password(
    request: Request, response: Response, db: Session, data: dict, id: str
):
    body = await request.json()
    password = body.get("password")

    if not data["otp_verified"]:
        raise HTTPException(status_code=400, detail=OTP_NOT_VERIFIED)

    hashed_password = hash_password(password)

    data["password"] = hashed_password
    set_data(
        "registration",
        id,
        data,
    )
    return {"message": "Password set successfully."}


@registration_required
async def complete_registration(
    request: Request, response: Response, db: Session, data: dict, id: str
):
    body = await request.json()
    password = body.get("password")

    if not check_password(password, data["password"]):
        raise HTTPException(status_code=400, detail=PASSWORD_MISMATCH)

    new_user = User(id=uuid.uuid4(), email=data["email"], password=data["password"])
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    delete_data("registration", id)
    response.delete_cookie("registration_token")

    access_token = create_access_token(data={"sub": str(new_user.id)})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=timedelta(days=3),
        expires=timedelta(days=3),
        secure=True,
        samesite="None",
    )

    return {"message": "Registration completed successfully."}
