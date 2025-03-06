from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class CareFacility(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=100)
    address: str = Field(max_length=255)
    has_stationary_care: bool = Field(default=False)
    has_day_care: bool = Field(default=False)
    has_ambulatory_care: bool = Field(default=False)
    from_zip_code: int = Field(ge=0, le=99999)
    to_zip_code: int = Field(ge=0, le=99999)
    zip_code: int = Field(ge=0, le=99999, index=True)
    available_capacity: bool = Field(default=False)
    slug: str = Field(unique=True)

    # Compound indexes found in alembic migrations
    # /app/alembic/versions/20250306_140647_427b733280ea_care_facilities_compound_indexes.py
