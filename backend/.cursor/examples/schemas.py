from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class EntityBase(BaseModel):
    """Base schema with common Entity attributes"""

    name: str = Field(..., min_length=1, max_length=100)


class EntityCreate(EntityBase):
    """Schema for creating a new Entity"""

    # Add any additional fields required for creation
    # For example, if the Entity model has a 'description' field
    description: str | None = Field(None)


class EntityUpdate(BaseModel):
    """Schema for updating an existing Entity"""

    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = Field(None)


class EntityResponse(EntityBase):
    """Schema for Entity responses"""

    id: UUID
    created_at: datetime
    deleted_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
