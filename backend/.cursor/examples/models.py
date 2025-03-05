# Example models
# This project uses SQLModel, which is a wrapper around SQLAlchemy.
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class Entity(SQLModel, table=True):
    __tablename__ = "entities"

    id: int | None = Field(default=None, primary_key=True)
    name: str
    # Prefer including created_at and updated_at in all models
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
