from app.models.user import User
from app.services.jwt_service import decode_access_token
from fastapi import HTTPException, Request
from sqlalchemy.orm import Session


def is_email_registered(email: str, db: Session) -> bool:
    return db.query(User).filter(User.email == email).first() is not None


def is_authenticated(request: Request, db: Session) -> bool:
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Access token is missing")

    decoded_token = decode_access_token(token)
    if not decoded_token:
        raise HTTPException(status_code=401, detail="Invalid token")

    id = decoded_token.get("sub")
    if not id:
        raise HTTPException(status_code=401, detail="Invalid token data")

    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return True
