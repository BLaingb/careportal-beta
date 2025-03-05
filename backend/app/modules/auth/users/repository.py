from abc import ABC, abstractmethod
from datetime import datetime, timezone

from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.auth.users.models import User
from app.modules.auth.users.schemas import UserCreate, UserRead, UserUpdate


class AbstractUserRepository(ABC):
    @abstractmethod
    async def get_by_email(self, email: str) -> User | None:
        pass

    @abstractmethod
    def create(self, data: UserCreate) -> User:
        pass

    @abstractmethod
    def update(self, id: int, data: UserUpdate) -> User:
        pass


class UserRepository(BaseRepository[User, UserCreate, UserUpdate, UserRead]):
    def __init__(self, db: Session):
        super().__init__(User, db)

    def get_by_email(self, email: str) -> User | None:
        statement = select(self.model).where(self.model.email == email)
        return self.db.exec(statement).first()

    def create(self, data: UserCreate) -> User:
        """Override create to handle password hashing"""
        from app.modules.auth.users.services import pwd_context  # Avoid circular import

        db_data = self.model(
            first_name=data.first_name,
            last_name=data.last_name,
            email=data.email,
            hashed_password=pwd_context.hash(data.password),
            created_at=datetime.now(timezone.utc),
        )
        self.db.add(db_data)
        self.db.commit()
        self.db.refresh(db_data)
        return db_data

    def update(self, id: int, data: UserUpdate) -> User:
        """Override update to handle password hashing"""
        from app.modules.auth.users.services import pwd_context  # Avoid circular import

        user = self.db.get(self.model, id)
        if not user:
            raise ValueError("User not found")

        update_dict = data.model_dump(exclude_unset=True)

        # Hash password if it's being updated
        if "password" in update_dict:
            update_dict["hashed_password"] = pwd_context.hash(
                update_dict.pop("password")
            )

        # Update timestamp
        update_dict["updated_at"] = datetime.now(timezone.utc)

        for key, value in update_dict.items():
            setattr(user, key, value)

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
