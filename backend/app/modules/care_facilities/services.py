from fastapi import BackgroundTasks

from app.core.analytics import PosthogAnalytics
from app.core.config import settings
from app.modules.care_facilities.repository import (
    CareFacilityContactRequestRepository,
    CareFacilityRepository,
)
from app.modules.care_facilities.schemas import (
    CareFacilityContactRequestCreate,
    CareFacilityContactRequestResponse,
    CareFacilityResponse,
    CareFacilitySearchResponse,
    CareType,
)


class CareFacilityService:
    def __init__(
        self,
        repository: CareFacilityRepository,
        contact_request_repository: CareFacilityContactRequestRepository,
        posthog: PosthogAnalytics,
    ):
        self.repository = repository
        self.contact_request_repository = contact_request_repository
        self.posthog = posthog

    async def __analytics_search_facilities_not_found(
        self, zip_code: int, care_type: CareType
    ):
        self.posthog.track_event(
            uid=None,
            event_name="care_facility_search_not_found",
            properties={
                "zip_code": zip_code,
                "care_type": care_type,
            },
        )

    async def __analytics_search_facilities_not_available(
        self, zip_code: int, care_type: CareType, facility_id: int, facility_name: str
    ):
        self.posthog.track_event(
            uid=None,
            event_name="care_facility_search_not_available",
            properties={
                "zip_code": zip_code,
                "care_type": care_type,
                "facility_id": facility_id,
                "facility_name": facility_name,
            },
        )

    async def __analytics_search_facilities_found(
        self, zip_code: int, care_type: CareType, facility_id: int, facility_name: str
    ):
        self.posthog.track_event(
            uid=None,
            event_name="care_facility_search_found",
            properties={
                "zip_code": zip_code,
                "care_type": care_type,
                "facility_id": facility_id,
                "facility_name": facility_name,
            },
        )

    async def find_best_match(
        self,
        zip_code: int | None,
        care_type: CareType,
        background_tasks: BackgroundTasks,
    ) -> CareFacilitySearchResponse | None:
        if not zip_code:
            return None
        facilities = await self.repository.get_by_care_type_and_zip_code(
            care_type, zip_code, settings.ZIP_CODE_RANGE_SEARCH
        )
        available_facility = next((f for f in facilities if f.available_capacity), None)
        if available_facility:
            background_tasks.add_task(
                self.__analytics_search_facilities_found,
                zip_code,
                care_type,
                available_facility.id,
                available_facility.name,
            )
            return available_facility
        elif facilities:  # No available capacity, but facilities found
            background_tasks.add_task(
                self.__analytics_search_facilities_not_available,
                zip_code,
                care_type,
                # Nearest facility
                facilities[0].id,
                facilities[0].name,
            )
            return None
        else:  # No facilities found
            background_tasks.add_task(
                self.__analytics_search_facilities_not_found,
                zip_code,
                care_type,
            )
            return None

    async def get_by_slug(self, slug: str) -> CareFacilityResponse | None:
        return await self.repository.get_by_slug(slug)

    async def create_contact_request(
        self, request: CareFacilityContactRequestCreate
    ) -> CareFacilityContactRequestResponse:
        return self.contact_request_repository.create(request)
