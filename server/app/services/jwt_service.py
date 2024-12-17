from datetime import datetime, timedelta, timezone

import jwt
from app.core.config import settings


def create_token(data: dict, secret_key: str, expires_delta: timedelta, algorithm: str):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm)


def decode_token(token: str, secret_key: str, algorithm: str):
    try:
        return jwt.decode(token, secret_key, algorithms=[algorithm])
    except jwt.PyJWTError:
        return None


def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=3)):
    return create_token(
        data, settings.SECRET_ACCESS_KEY, expires_delta, settings.ALGORITHM
    )


def decode_access_token(token: str):
    return decode_token(token, settings.SECRET_ACCESS_KEY, settings.ALGORITHM)


def create_password_reset_token(
    data: dict, expires_delta: timedelta = timedelta(minutes=30)
):
    return create_token(
        data, settings.SECRET_PASSWORD_RESET_KEY, expires_delta, settings.ALGORITHM
    )


def decode_password_reset_token(token: str):
    return decode_token(token, settings.SECRET_PASSWORD_RESET_KEY, settings.ALGORITHM)


def create_login_token(data: dict, expires_delta: timedelta = timedelta(minutes=30)):
    return create_token(
        data, settings.SECRET_LOGIN_KEY, expires_delta, settings.ALGORITHM
    )


def decode_login_token(token: str):
    return decode_token(token, settings.SECRET_LOGIN_KEY, settings.ALGORITHM)


def create_registration_token(
    data: dict, expires_delta: timedelta = timedelta(minutes=30)
):
    return create_token(
        data, settings.SECRET_REGISTRATION_KEY, expires_delta, settings.ALGORITHM
    )


def decode_registration_token(token: str):
    return decode_token(token, settings.SECRET_REGISTRATION_KEY, settings.ALGORITHM)
