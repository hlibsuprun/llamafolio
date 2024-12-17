from app.core.errors import INTERNAL_SERVER_ERROR
from app.db.database import get_db
from app.schemas.password_reset import *
from app.services.password_reset_service import *
from fastapi import APIRouter, Depends, HTTPException, Response

router = APIRouter()


@router.post("/password_reset")
def password_reset(request: Request, db: Session = Depends(get_db)):
    try:
        return start_password_reset(request, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)


@router.post("/password_reset/data")
async def data(
    data: DataRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        return await password_reset_data(request, response, db, data.token)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)


@router.post("/password_reset/set_password")
async def password(
    data: PasswordRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        return await set_password(request, response, db, data.token)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)


@router.post("/password_reset/complete")
async def complete(
    data: PasswordRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        return await complete_password_reset(request, response, db, data.token)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)
