from sqlalchemy import Column, BigInteger, String, DateTime
from sqlalchemy.sql import func
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
