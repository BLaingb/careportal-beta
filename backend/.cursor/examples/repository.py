from uuid import UUID

from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.mymodule.models import MyModel  # type: ignore
from app.modules.mymodule.schemas import (  # type: ignore
    MyModelCreate,
    MyModelResponse,
    MyModelUpdate,
)


class MyModelRepository(
    BaseRepository[MyModel, MyModelCreate, MyModelUpdate, MyModelResponse]
):
    def __init__(self, db: Session):
        super().__init__(MyModel, db)

    async def list_by_other_id(self, other_id: UUID) -> list[MyModelResponse]:
        """Custom method needed for this specific repository"""
        statement = (
            select(MyModel)
            .where(MyModel.other_id == other_id)
            .where(MyModel.deleted_at.is_(None))
            .order_by(MyModel.name)
        )
        categories = self.db.exec(statement).all()
        return [MyModelResponse.model_validate(c) for c in categories]
