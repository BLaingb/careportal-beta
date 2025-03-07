from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict

CareType = Literal["stationary_care", "day_care", "ambulatory_care"]


class CareFacility(BaseModel):
    name: str
    address: str
    has_stationary_care: bool
    has_day_care: bool
    has_ambulatory_care: bool
    # Normally wouldn't use ints for zip codes, but it's fine for now
    # And makes it easier to search for facilities in a range
    from_zip_code: int
    to_zip_code: int
    zip_code: int
    available_capacity: bool
    slug: str
    image_url: str | None = None


class CareFacilityCreate(CareFacility):
    pass


class CareFacilityUpdate(CareFacility):
    name: str | None = None
    address: str | None = None
    has_stationary_care: bool | None = None
    has_day_care: bool | None = None
    has_ambulatory_care: bool | None = None
    from_zip_code: int | None = None
    to_zip_code: int | None = None
    zip_code: int | None = None
    available_capacity: bool | None = None
    image_url: str | None = None


class CareFacilityResponse(CareFacility):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class CareFacilitySearchResponse(BaseModel):
    id: UUID
    name: str
    address: str
    zip_code: int
    available_capacity: bool
    slug: str
    distance: int

    model_config = ConfigDict(from_attributes=True)


class CareFacilityContactRequestBase(BaseModel):
    name: str
    email: str
    phone: str
    care_type: CareType
    message: str
    care_facility_id: UUID | None = None


class CareFacilityContactRequestCreate(CareFacilityContactRequestBase):
    pass


class CareFacilityContactRequestUpdate(CareFacilityContactRequestBase):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    care_type: CareType | None = None
    care_facility_id: UUID | None = None
    message: str | None = None


class CareFacilityContactRequestResponse(CareFacilityContactRequestBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)
