import uuid
from datetime import timedelta
from functools import wraps

from app.core.config import settings
from app.core.errors import (
    EMAIL_NOT_REGISTERED,
    INVALID_EMAIL,
    PASSWORD_MISMATCH,
    SESSION_EXPIRED,
)
from app.models.user import User
from app.services.email_service import email_validator, send_password_reset_link
from app.services.jwt_service import create_access_token, create_password_reset_token
from app.services.password_service import check_password, hash_password
from app.services.redis_service import delete_data, set_data
from app.services.token_service import (
    get_login_data_from_token_and_redis,
    get_password_reset_data_from_token_and_redis,
)
from app.services.user_service import is_email_registered
from fastapi import HTTPException, Request, Response
from sqlalchemy.orm import Session


def password_reset_required(func):
    @wraps(func)
    async def wrapper(
        request: Request, response: Response, db: Session, token: str, *args, **kwargs
    ):
        id, data = get_password_reset_data_from_token_and_redis(token)
        if not data:
            raise HTTPException(status_code=404, detail=SESSION_EXPIRED)

        if not email_validator(data["email"]):
            raise Exception(INVALID_EMAIL)

        if not is_email_registered(data["email"], db):
            raise HTTPException(status_code=400, detail=EMAIL_NOT_REGISTERED)

        return await func(
            request, response, db, token, *args, **kwargs, data=data, id=id
        )

    return wrapper


def start_password_reset(request: Request, db: Session):
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

    if (
        data["password_reset_token"] is not None
        and data["password_reset_id"] is not None
    ):
        password_reset_id = data["password_reset_id"]
        password_reset_token = data["password_reset_token"]
    else:
        password_reset_id = str(uuid.uuid4())
        password_reset_token = create_password_reset_token({"sub": password_reset_id})
        data["password_reset_id"] = password_reset_id
        data["password_reset_token"] = password_reset_token
        set_data("login", id, data)

    send_password_reset_link(
        data["email"], f"{settings.CLIENT_URL}/reset-password/{password_reset_token}"
    )

    password_reset_data = {"email": data["email"], "password": None}

    set_data(
        "password_reset",
        password_reset_id,
        password_reset_data,
    )

    return {"message": "Password reset started."}


@password_reset_required
async def password_reset_data(
    request: Request, response: Response, db: Session, token: str, data: dict, id: str
):
    return {
        "password_is_set": type(data["password"]) is str,
    }


@password_reset_required
async def set_password(
    request: Request, response: Response, db: Session, token: str, data: dict, id: str
):
    body = await request.json()
    password = body.get("password")

    hashed_password = hash_password(password)

    data["password"] = hashed_password
    set_data(
        "password_reset",
        id,
        data,
    )
    return {"message": "Password set successfully."}


@password_reset_required
async def complete_password_reset(
    request: Request, response: Response, db: Session, token: str, data: dict, id: str
):
    body = await request.json()
    password = body.get("password")

    if not check_password(password, data["password"]):
        raise HTTPException(status_code=400, detail=PASSWORD_MISMATCH)

    user = db.query(User).filter_by(email=data["email"]).first()
    user.password = data["password"]
    db.commit()

    delete_data("password_reset", id)
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

    return {"message": "Password reset completed successfully."}
