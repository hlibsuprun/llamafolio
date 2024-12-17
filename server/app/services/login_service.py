import uuid
from datetime import timedelta
from functools import wraps

from app.core.errors import (
    EMAIL_NOT_REGISTERED,
    INVALID_EMAIL,
    INVALID_OTP,
    INVALID_TOTP,
    PASSWORD_MISMATCH,
    SESSION_EXPIRED,
)
from app.models.user import User
from app.services.email_service import email_validator, send_otp_email
from app.services.jwt_service import create_access_token, create_login_token
from app.services.password_service import check_password
from app.services.redis_service import delete_data, set_data
from app.services.token_service import get_login_data_from_token_and_redis
from app.services.totp_service import verify_totp
from app.services.user_service import is_email_registered
from fastapi import HTTPException, Request, Response
from sqlalchemy.orm import Session


def login_required(func):
    @wraps(func)
    async def wrapper(
        request: Request, response: Response, db: Session, *args, **kwargs
    ):
        login_token = request.cookies.get("login_token")
        if not login_token:
            raise HTTPException(status_code=404, detail=SESSION_EXPIRED)

        id, data = get_login_data_from_token_and_redis(login_token)
        if not data:
            raise HTTPException(status_code=404, detail=SESSION_EXPIRED)

        if not email_validator(data["email"]):
            raise Exception(INVALID_EMAIL)

        if not is_email_registered(data["email"], db):
            raise HTTPException(status_code=400, detail=EMAIL_NOT_REGISTERED)

        return await func(request, response, db, *args, **kwargs, data=data, id=id)

    return wrapper


def start_login(email: str, response: Response, db: Session):
    if not email_validator(email):
        raise Exception(INVALID_EMAIL)

    if not is_email_registered(email, db):
        raise HTTPException(status_code=400, detail=EMAIL_NOT_REGISTERED)

    user = db.query(User).filter(User.email == email).first()

    login_id = str(uuid.uuid4())

    login_token = create_login_token({"sub": login_id})

    response.set_cookie(
        key="login_token",
        value=login_token,
        httponly=True,
        max_age=1800,
        expires=1800,
        secure=True,
        samesite="None",
        domain="localhost",
    )

    login_data = {
        "email": email,
        "otp": None,
        "verified": False,
        "password_reset_id": None,
        "password_reset_token": None,
    }

    if user.is_email_2fa_enabled:
        otp = str(uuid.uuid4().int)[:6]
        login_data["otp"] = otp
        send_otp_email(user.email, otp)

    set_data("login", login_id, login_data)

    return {"message": "Login started."}


@login_required
async def login_data(
    request: Request, response: Response, db: Session, data: dict, id: str
):
    user = db.query(User).filter(User.email == data["email"]).first()

    return {
        "email_entered": email_validator(data["email"]),
        "login_verified": data["verified"],
        "is_email_2fa_enabled": user.is_email_2fa_enabled,
        "is_totp_2fa_enabled": user.is_totp_2fa_enabled,
    }


@login_required
async def resend_otp(
    request: Request, response: Response, db: Session, data: dict, id: str
):
    send_otp_email(data["email"], data["otp"])
    return {"message": "OTP resent successfully."}


@login_required
async def verify_login(
    request: Request, response: Response, db: Session, data: dict, id: str
):
    user = db.query(User).filter(User.email == data["email"]).first()

    body = await request.json()
    if user.is_email_2fa_enabled and data["otp"] != body.get("otp"):
        raise HTTPException(status_code=400, detail=INVALID_OTP)

    if user.is_totp_2fa_enabled and not verify_totp(body.get("totp"), user.totp_secret):
        raise HTTPException(status_code=400, detail=INVALID_TOTP)

    data["verified"] = True
    set_data(
        "login",
        id,
        data,
    )

    return {"message": "Verification successful."}


@login_required
async def verify_password(
    request: Request, response: Response, db: Session, data: dict, id: str
):
    user = db.query(User).filter(User.email == data["email"]).first()

    body = await request.json()
    if not user or not check_password(body.get("password"), user.password):
        raise HTTPException(status_code=400, detail=PASSWORD_MISMATCH)

    delete_data("login", id)
    response.delete_cookie("login_token")

    access_token = create_access_token(data={"sub": str(user.id)})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=timedelta(days=3),
        expires=timedelta(days=3),
        secure=True,
        samesite="None",
    )

    return {"message": "Verification successful."}
