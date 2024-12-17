import uuid

from app.db.database import Base
from sqlalchemy import UUID, Boolean, Column, String


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    is_email_2fa_enabled = Column(Boolean, default=True)
    is_totp_2fa_enabled = Column(Boolean, default=False)
    totp_secret = Column(String, nullable=True)
    totp_qr_code = Column(String, nullable=True)
