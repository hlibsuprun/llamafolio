from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr


class LoginVerificationRequest(BaseModel):
    otp_email: str | None = None
    otp_totp: str | None = None


class PasswordVerificationRequest(BaseModel):
    password: str
