import json

import redis
from app.core.config import settings
from app.core.errors import REDIS_UNAVAILABLE
from fastapi import HTTPException

redis_client = redis.StrictRedis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    decode_responses=True,
)


def set_data(key_prefix: str, unique_id: str, data: dict, ttl: int = 1800):
    try:
        key = f"{key_prefix}:{unique_id}"
        redis_client.setex(key, ttl, json.dumps(data))
    except redis.RedisError as e:
        raise HTTPException(status_code=500, detail=REDIS_UNAVAILABLE) from e


def get_data(key_prefix: str, unique_id: str) -> dict:
    try:
        key = f"{key_prefix}:{unique_id}"
        raw_data = redis_client.get(key)
        return json.loads(raw_data) if raw_data else None
    except redis.RedisError as e:
        raise HTTPException(status_code=500, detail=REDIS_UNAVAILABLE) from e


def delete_data(key_prefix: str, unique_id: str):
    try:
        key = f"{key_prefix}:{unique_id}"
        redis_client.delete(key)
    except redis.RedisError as e:
        raise HTTPException(status_code=500, detail=REDIS_UNAVAILABLE) from e


def fetch_data(key_prefix: str, unique_id: str, error_msg: str) -> dict:
    data = get_data(key_prefix, unique_id)
    if not data:
        raise HTTPException(status_code=404, detail=error_msg)
    return data
