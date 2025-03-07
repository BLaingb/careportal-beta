from typing import Annotated

from fastapi import Depends

from app.core.deps import PostHogDep, SessionDep
from app.modules.care_facilities.repository import (
    CareFacilityContactRequestRepository,
    CareFacilityRepository,
)
from app.modules.care_facilities.services import CareFacilityService


def get_care_facility_repository(db: SessionDep) -> CareFacilityRepository:
    return CareFacilityRepository(db)


CareFacilityRepositoryDep = Annotated[
    CareFacilityRepository, Depends(get_care_facility_repository)
]


def get_care_facility_contact_request_repository(
    db: SessionDep,
) -> CareFacilityContactRequestRepository:
    return CareFacilityContactRequestRepository(db)


CareFacilityContactRequestRepositoryDep = Annotated[
    CareFacilityContactRequestRepository,
    Depends(get_care_facility_contact_request_repository),
]


def get_care_facility_service(
    repository: CareFacilityRepositoryDep,
    contact_request_repository: CareFacilityContactRequestRepositoryDep,
    posthog: PostHogDep,
) -> CareFacilityService:
    return CareFacilityService(repository, contact_request_repository, posthog)


CareFacilityServiceDep = Annotated[
    CareFacilityService, Depends(get_care_facility_service)
]
