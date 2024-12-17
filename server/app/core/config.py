from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    NODE_ENV: str
    CLIENT_URL: str
    POSTGRES_URL: str
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_DB: int
    SECRET_ACCESS_KEY: str
    SECRET_REGISTRATION_KEY: str
    SECRET_LOGIN_KEY: str
    SECRET_PASSWORD_RESET_KEY: str
    ALGORITHM: str
    APP_PASSWORD: str

    class Config:
        env_file = ".env"


settings = Settings()
