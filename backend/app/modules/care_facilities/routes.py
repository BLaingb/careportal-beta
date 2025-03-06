from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import JSONResponse

from app.modules.care_facilities.deps import CareFacilityServiceDep
from app.modules.care_facilities.schemas import CareType

care_facilities_router = APIRouter(prefix="/care-facilities", tags=["care-facilities"])


@care_facilities_router.get("/nearest")
async def get_nearest_care_facilities(
    zip_code: int,
    care_type: CareType,
    background_tasks: BackgroundTasks,
    service: CareFacilityServiceDep,
):
    best_match = await service.find_best_match(zip_code, care_type, background_tasks)
    if not best_match:
        return JSONResponse(status_code=404, content=None)
    return best_match
