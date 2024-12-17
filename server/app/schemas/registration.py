from pydantic import BaseModel, EmailStr


class RegistrationRequest(BaseModel):
    email: EmailStr


class OTPVerificationRequest(BaseModel):
    otp: str


class PasswordRequest(BaseModel):
    password: str
