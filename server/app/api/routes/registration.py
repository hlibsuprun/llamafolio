from app.core.errors import INTERNAL_SERVER_ERROR
from app.db.database import get_db
from app.schemas.registration import *
from app.services.registration_service import *
from fastapi import APIRouter, Depends, HTTPException, Response

router = APIRouter()


@router.post("/registration")
def registration(
    data: RegistrationRequest, response: Response, db: Session = Depends(get_db)
):
    try:
        return start_registration(data.email, response, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)


@router.get("/registration/data")
async def data(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        return await registration_data(request, response, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)


@router.post("/registration/resend_otp")
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


@router.post("/registration/verify_email")
async def verify(
    data: OTPVerificationRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        return await verify_email(request, response, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)


@router.post("/registration/set_password")
async def password(
    data: PasswordRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        return await set_password(request, response, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)


@router.post("/registration/complete")
async def complete(
    data: PasswordRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        return await complete_registration(request, response, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)
