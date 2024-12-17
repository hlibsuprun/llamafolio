from app.api.routes import login, password_reset, registration, user
from app.core.config import settings
from app.db.database import Base, engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CLIENT_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(registration.router, prefix="/api", tags=["Registration"])
app.include_router(login.router, prefix="/api", tags=["Login"])
app.include_router(password_reset.router, prefix="/api", tags=["Password reset"])
app.include_router(user.router, prefix="/api", tags=["User"])

Base.metadata.create_all(bind=engine)
