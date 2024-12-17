from app.core.errors import USER_NOT_AUTHENTICATED
from app.db.database import get_db
from app.schemas.login import *
from app.services.login_service import *
from app.services.user_service import is_authenticated
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()


@router.get("/user/check_auth")
def check_auth(
    request: Request,
    db: Session = Depends(get_db),
):
    if is_authenticated(request, db):
        return {"message": "User is authenticated"}
    else:
        raise HTTPException(status_code=401, detail=USER_NOT_AUTHENTICATED)
