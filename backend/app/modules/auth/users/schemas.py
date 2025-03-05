from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import ConfigDict, EmailStr, StringConstraints
from sqlmodel import SQLModel

# Define common string constraints
Name = Annotated[str, StringConstraints(min_length=1, max_length=50)]
Password = Annotated[str, StringConstraints(min_length=8)]


class UserBase(SQLModel):
    first_name: Name
    last_name: Name
    email: EmailStr
    created_at: datetime
    updated_at: datetime | None = None


class UserCreate(UserBase):
    password: Password
    created_at: None = None
    updated_at: None = None


class UserUpdate(SQLModel):
    first_name: Name | None = None
    last_name: Name | None = None
    email: EmailStr | None = None
    password: Password | None = None


class UserRead(UserBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class UserInDB(UserRead):
    """Schema with password hash - for internal use only"""

    hashed_password: str
