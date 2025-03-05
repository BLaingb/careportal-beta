import pytest

from app.modules.auth.users.repository import UserRepository
from app.modules.auth.users.schemas import UserCreate, UserUpdate
from app.modules.auth.users.services import UserService
from app.tests.fixtures import db_engine, db_session  # noqa


@pytest.fixture
async def user_repository(db_session):  # noqa: F811
    return UserRepository(db=db_session)


@pytest.fixture
async def user_service(user_repository):
    return UserService(repository=user_repository)


class TestUserService:
    async def test_create_user_success(self, user_service):
        user_data = UserCreate(
            email="test@example.com",
            password="password123",
            first_name="Test",
            last_name="User",
        )
        user = await user_service.create_user(user_data)

        # Verify user was created correctly
        assert user.email == "test@example.com"
        assert user.first_name == "Test"
        assert user.last_name == "User"

    async def test_create_user_duplicate_email(self, user_service):
        user_data = UserCreate(
            email="test@example.com",
            password="password123",
            first_name="Test",
            last_name="User",
        )
        await user_service.create_user(user_data)

        # Try to create another user with the same email
        with pytest.raises(ValueError, match="Email already registered"):
            await user_service.create_user(user_data)

    async def test_get_user_by_email_exists(self, user_service):
        # Create a user first
        user_data = UserCreate(
            email="test@example.com",
            password="password123",
            first_name="Test",
            last_name="User",
        )
        await user_service.create_user(user_data)

        # Try to get the user
        user = user_service.get_user_by_email("test@example.com")
        assert user is not None
        assert user.email == "test@example.com"
        assert user.first_name == "Test"
        assert user.last_name == "User"

    async def test_get_user_by_email_not_exists(self, user_service):
        user = user_service.get_user_by_email("nonexistent@example.com")
        assert user is None

    async def test_update_user_success(self, user_service):
        # Create a user first
        user_data = UserCreate(
            email="test@example.com",
            password="password123",
            first_name="Test",
            last_name="User",
        )
        created_user = await user_service.create_user(user_data)

        # Update the user
        update_data = UserUpdate(
            email="newemail@example.com", first_name="Updated", last_name="Name"
        )
        updated_user = await user_service.update_user(created_user.id, update_data)

        assert updated_user.email == "newemail@example.com"
        assert updated_user.first_name == "Updated"
        assert updated_user.last_name == "Name"

    async def test_update_user_duplicate_email(self, user_service):
        # Create two users
        user1 = await user_service.create_user(
            UserCreate(
                email="user1@example.com",
                password="password123",
                first_name="User",
                last_name="One",
            )
        )
        await user_service.create_user(
            UserCreate(
                email="user2@example.com",
                password="password123",
                first_name="User",
                last_name="Two",
            )
        )

        # Try to update user1's email to user2's email
        with pytest.raises(ValueError, match="Email already registered"):
            await user_service.update_user(
                user1.id, UserUpdate(email="user2@example.com")
            )

    def test_verify_password(self, user_service):
        # Generate bcrypt hashes for test passwords
        from passlib.context import CryptContext

        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

        valid_hash = pwd_context.hash("test_password")
        different_hash = pwd_context.hash("different_password")

        # Test correct password
        assert user_service.verify_password("test_password", valid_hash) is True

        # Test incorrect password against valid hash
        assert user_service.verify_password("wrong_password", valid_hash) is False

        # Test correct password against different hash
        assert user_service.verify_password("test_password", different_hash) is False

        # Test empty password
        assert user_service.verify_password("", valid_hash) is False
