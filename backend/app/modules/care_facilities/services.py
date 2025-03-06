from fastapi import BackgroundTasks

from app.core.config import settings
from app.modules.care_facilities.repository import CareFacilityRepository
from app.modules.care_facilities.schemas import CareType


class CareFacilityService:
    def __init__(self, repository: CareFacilityRepository):
        self.repository = repository

    async def __analytics_search_facilities_not_found(
        self, zip_code: int, zip_code_range: int, care_type: CareType
    ):
        # TODO: Implement posthog analytics
        pass

    async def __analytics_search_facilities_not_available(
        self, zip_code: int, zip_code_range: int, care_type: CareType
    ):
        # TODO: Implement posthog analytics
        pass

    async def __analytics_search_facilities_found(
        self, zip_code: int, care_type: CareType, facility_id: int, facility_name: str
    ):
        # TODO: Implement posthog analytics
        pass

    async def find_best_match(
        self, zip_code: int, care_type: CareType, background_tasks: BackgroundTasks
    ):
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
                settings.ZIP_CODE_RANGE_SEARCH,
                care_type,
            )
            return None
        else:  # No facilities found
            background_tasks.add_task(
                self.__analytics_search_facilities_not_found,
                zip_code,
                settings.ZIP_CODE_RANGE_SEARCH,
                care_type,
            )
            return None
