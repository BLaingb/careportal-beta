from typing import Annotated

from fastapi import Depends

from app.core.deps import SessionDep
from app.modules.care_facilities.repository import CareFacilityRepository
from app.modules.care_facilities.services import CareFacilityService


def get_care_facility_repository(db: SessionDep) -> CareFacilityRepository:
    return CareFacilityRepository(db)


CareFacilityRepositoryDep = Annotated[
    CareFacilityRepository, Depends(get_care_facility_repository)
]


def get_care_facility_service(
    repository: CareFacilityRepositoryDep,
) -> CareFacilityService:
    return CareFacilityService(repository)


CareFacilityServiceDep = Annotated[
    CareFacilityService, Depends(get_care_facility_service)
]
