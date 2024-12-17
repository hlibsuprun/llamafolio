from app.core.errors import INVALID_TOKEN, TOKEN_MISSING
from app.services.jwt_service import decode_token
from fastapi import HTTPException


def decode_and_validate_token(
    token: str, expected_field: str, secret_key: str, algorithm: str
) -> dict:
    if not token:
        raise HTTPException(status_code=401, detail=TOKEN_MISSING)

    payload = decode_token(token, secret_key, algorithm)
    if not payload or expected_field not in payload:
        raise HTTPException(status_code=401, detail=INVALID_TOKEN)

    return payload
