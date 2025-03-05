import pytest
from sqlmodel import Session as SQLSession, SQLModel, create_engine
from app.modules.auth.users.models import User
from app.modules.auth.sessions.models import Session
from app.modules.households.models import Household, HouseholdMember
from app.modules.financial.accounts.models import Account
from app.modules.financial.categories.models import Category
from app.modules.financial.transactions.models import Transaction
from app.modules.financial.budgeting.models import Budget


@pytest.fixture
async def db_engine():
    """Create a test database engine"""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
    )
    yield engine


@pytest.fixture
async def db_session(db_engine):
    """Create a test database session"""
    with SQLSession(db_engine) as session:
        SQLModel.metadata.create_all(db_engine)
        yield session
        SQLModel.metadata.drop_all(db_engine)
