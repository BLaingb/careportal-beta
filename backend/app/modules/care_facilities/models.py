from uuid import UUID, uuid4

from sqlmodel import Field, Index, Relationship, SQLModel, String

from .schemas import CareType


class CareFacility(SQLModel, table=True):
    __table_args__ = (
        Index(
            "ix_care_facility_has_stationary_care_zip_code",
            "has_stationary_care",
            "zip_code",
        ),
        Index("ix_care_facility_has_day_care_zip_code", "has_day_care", "zip_code"),
        Index(
            "ix_care_facility_has_ambulatory_care_zip_code",
            "has_ambulatory_care",
            "zip_code",
        ),
    )
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
    image_url: str | None = Field(default=None)

    contact_requests: list["CareFacilityContactRequest"] = Relationship(
        back_populates="care_facility"
    )


class CareFacilityContactRequest(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    care_facility_id: UUID = Field(foreign_key="carefacility.id", nullable=True)
    care_facility: "CareFacility" = Relationship(
        back_populates="contact_requests",
    )
    name: str = Field(max_length=100)
    email: str = Field(max_length=100)
    phone: str = Field(max_length=100)
    care_type: CareType = Field(sa_type=String(length=20))
    message: str = Field(max_length=255, nullable=True)
