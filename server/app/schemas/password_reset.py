from pydantic import BaseModel


class DataRequest(BaseModel):
    token: str


class PasswordRequest(BaseModel):
    password: str
    token: str
