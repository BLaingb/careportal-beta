from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, StringConstraints
from sqlmodel import SQLModel


class LoginRequest(SQLModel):
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=8)]


class SessionCreate(SQLModel):
    user_id: UUID
    expires_at: datetime


class SessionRead(SQLModel):
    id: str
    user_id: UUID
    expires_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    """Schema for success login response"""

    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for decoded token data"""

    user_id: UUID | None = None


class TokenResponse(BaseModel):
    """Response schema for authentication endpoints"""

    access_token: str
    token_type: str = "bearer"
    expires_at: datetime
    user_id: UUID
