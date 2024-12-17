from app.core.errors import INTERNAL_SERVER_ERROR
from app.db.database import get_db
from app.schemas.login import *
from app.services.login_service import *
from fastapi import APIRouter, Depends, HTTPException, Response

router = APIRouter()


@router.post("/login")
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    try:
        return start_login(data.email, response, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)


@router.get("/login/data")
async def data(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        return await login_data(request, response, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)


@router.post("/login/resend_otp")
async def resend(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        return await resend_otp(request, response, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)


@router.post("/login/verify")
async def verify(
    data: LoginVerificationRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        return await verify_login(request, response, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)


@router.post("/login/password")
async def password(
    data: LoginVerificationRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        return await verify_password(request, response, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)
