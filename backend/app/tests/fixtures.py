import pytest
from sqlmodel import Session as SQLSession
from sqlmodel import SQLModel, create_engine

from app.modules.care_facilities.models import CareFacility  # noqa


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
