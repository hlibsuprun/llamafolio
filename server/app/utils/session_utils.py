from typing import Callable

from app.utils.token_utils import decode_and_validate_token


def get_data_from_token_and_redis(
    token: str,
    redis_fetcher: Callable,
    expected_field: str,
    error_msg: str,
    secret_key: str,
    algorithm: str,
    key_prefix: str,
) -> dict:
    payload = decode_and_validate_token(token, expected_field, secret_key, algorithm)

    id = payload[expected_field]
    redis_data = redis_fetcher(key_prefix, id, error_msg)

    return id, redis_data
