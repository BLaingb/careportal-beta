from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import JSONResponse

from app.modules.care_facilities.deps import CareFacilityServiceDep
from app.modules.care_facilities.schemas import (
    CareFacilityContactRequestCreate,
    CareFacilityContactRequestResponse,
    CareFacilityResponse,
    CareFacilitySearchResponse,
    CareType,
)

care_facilities_router = APIRouter(prefix="/care-facilities", tags=["care-facilities"])


@care_facilities_router.post("/contact-request")
async def create_care_facility_contact_request(
    request: CareFacilityContactRequestCreate,
    service: CareFacilityServiceDep,
) -> CareFacilityContactRequestResponse:
    return await service.create_contact_request(request)


@care_facilities_router.get("/nearest")
async def get_nearest_care_facilities(
    care_type: CareType,
    background_tasks: BackgroundTasks,
    service: CareFacilityServiceDep,
    zip_code: int | None = None,
) -> CareFacilitySearchResponse | None:
    best_match = await service.find_best_match(zip_code, care_type, background_tasks)
    if not best_match:
        return JSONResponse(status_code=404, content=None)
    return best_match


@care_facilities_router.get("/{slug}")
async def get_care_facility_by_slug(
    slug: str, service: CareFacilityServiceDep
) -> CareFacilityResponse | None:
    facility = await service.get_by_slug(slug)
    if not facility:
        return JSONResponse(status_code=404, content=None)
    return facility
