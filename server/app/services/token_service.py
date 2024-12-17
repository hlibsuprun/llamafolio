from app.core.config import settings
from app.core.errors import SESSION_EXPIRED
from app.services.redis_service import fetch_data
from app.utils.session_utils import get_data_from_token_and_redis


def get_password_reset_data_from_token_and_redis(token: str):
    return get_data_from_token_and_redis(
        token=token,
        redis_fetcher=fetch_data,
        expected_field="sub",
        error_msg=SESSION_EXPIRED,
        secret_key=settings.SECRET_PASSWORD_RESET_KEY,
        algorithm=settings.ALGORITHM,
        key_prefix="password_reset",
    )


def get_login_data_from_token_and_redis(token: str):
    return get_data_from_token_and_redis(
        token=token,
        redis_fetcher=fetch_data,
        expected_field="sub",
        error_msg=SESSION_EXPIRED,
        secret_key=settings.SECRET_LOGIN_KEY,
        algorithm=settings.ALGORITHM,
        key_prefix="login",
    )


def get_registration_data_from_token_and_redis(token: str):
    return get_data_from_token_and_redis(
        token=token,
        redis_fetcher=fetch_data,
        expected_field="sub",
        error_msg=SESSION_EXPIRED,
        secret_key=settings.SECRET_REGISTRATION_KEY,
        algorithm=settings.ALGORITHM,
        key_prefix="registration",
    )
