from datetime import datetime, timezone
from typing import Generic, TypeVar
from uuid import UUID

from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlmodel import SQLModel, select

TModel = TypeVar("TModel", bound=SQLModel)
TCreateSchema = TypeVar("TCreateSchema", bound=BaseModel)
TUpdateSchema = TypeVar("TUpdateSchema", bound=BaseModel)
TOutputSchema = TypeVar("TOutputSchema", bound=BaseModel)
TID = TypeVar("TID", int, str, UUID)  # Support different ID types


class BaseRepository(Generic[TModel, TCreateSchema, TUpdateSchema, TOutputSchema]):
    def __init__(self, model: type[TModel], db: Session):
        self.model = model
        self.db = db

    def get_all(self) -> list[TModel]:
        statement = select(self.model)
        return self.db.exec(statement).all()

    def get_by_id(self, id: TID) -> TModel:
        """Gets a model instance by its ID"""
        statement = select(self.model).where(self.model.id == id)
        result = self.db.exec(statement)
        model = result.first()
        if not model:
            raise ValueError(f"{self.model.__name__} not found")
        return model

    def create(self, data: TCreateSchema) -> TModel:
        db_data = self.model(**data.model_dump())
        self.db.add(db_data)
        self.db.commit()
        self.db.refresh(db_data)
        return db_data

    def update(self, id: TID, data: TUpdateSchema) -> TModel:
        """Generic update method that handles updated_at if it exists"""
        db_data = self.get_by_id(id)  # Now using the get_by_id method

        update_dict = data.model_dump(exclude_unset=True)

        # Update updated_at if the model has this field
        if hasattr(db_data, "updated_at"):
            update_dict["updated_at"] = datetime.now(timezone.utc)

        for key, value in update_dict.items():
            setattr(db_data, key, value)

        self.db.add(db_data)
        self.db.commit()
        self.db.refresh(db_data)
        return db_data

    def delete(self, id: TID) -> None:
        """Deletes a model instance by its ID"""
        db_data = self.get_by_id(id)
        self.db.delete(db_data)
        self.db.commit()
