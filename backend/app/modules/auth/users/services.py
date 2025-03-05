from passlib.context import CryptContext

from app.modules.auth.users.models import User
from app.modules.auth.users.repository import UserRepository
from app.modules.auth.users.schemas import UserCreate, UserRead, UserUpdate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserService:
    def __init__(
        self,
        *,
        repository: UserRepository,
    ):
        self.repository = repository

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    def get_user_by_email(self, email: str) -> User | None:
        return self.repository.get_by_email(email)

    async def create_user(self, user_data: UserCreate) -> UserRead:
        # Check if user already exists
        if self.get_user_by_email(user_data.email):
            raise ValueError("Email already registered")

        # Create the user
        user = self.repository.create(user_data)

        # Create personal household for the user

        return user

    async def update_user(self, user_id: int, update_data: UserUpdate) -> UserRead:
        """Update user data"""
        # Check email uniqueness if being updated
        if update_data.email:
            existing_user = self.get_user_by_email(update_data.email)
            if existing_user and existing_user.id != user_id:
                raise ValueError("Email already registered")

        return self.repository.update(user_id, update_data)
