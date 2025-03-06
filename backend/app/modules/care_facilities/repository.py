from sqlalchemy.sql import func
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.core.logger import get_logger
from app.modules.care_facilities.models import CareFacility
from app.modules.care_facilities.schemas import (
    CareFacilityCreate,
    CareFacilityResponse,
    CareFacilityUpdate,
    CareType,
)

logger = get_logger(__name__)


class CareFacilityRepository(
    BaseRepository[
        CareFacility, CareFacilityCreate, CareFacilityUpdate, CareFacilityResponse
    ]
):
    def __init__(self, db: Session):
        super().__init__(CareFacility, db)

    async def get_one_by_slug(self, slug: str) -> CareFacilityResponse | None:
        statement = select(CareFacility).where(CareFacility.slug == slug)
        return self.db.exec(statement).first()

    async def get_by_care_type_and_zip_code(
        self, care_type: CareType, zip_code: int, zip_code_range: int
    ) -> list[CareFacilityResponse]:
        care_type_columns = {
            "stationary_care": CareFacility.has_stationary_care,
            "day_care": CareFacility.has_day_care,
            "ambulatory_care": CareFacility.has_ambulatory_care,
        }
        statement = (
            select(
                CareFacility.id,
                CareFacility.name,
                CareFacility.address,
                CareFacility.zip_code,
                CareFacility.available_capacity,
                CareFacility.slug,
                func.abs(CareFacility.zip_code - zip_code).label("distance"),
            )
            .where(
                care_type_columns[care_type] == True,  # noqa: E712
                CareFacility.zip_code.between(
                    zip_code - zip_code_range, zip_code + zip_code_range
                ),
            )
            .order_by("distance")
        )
        try:
            facilities = self.db.exec(statement).all()
            return [
                CareFacilityResponse(
                    id=facility[0],
                    name=facility[1],
                    address=facility[2],
                    zip_code=facility[3],
                    available_capacity=facility[4],
                    slug=facility[5],
                    distance=facility[6],
                )
                for facility in facilities
            ]
        except Exception as e:
            logger.error(f"Error getting facilities: {e}", exc_info=True)
            raise e

    async def get_stationary_care_by_nearest_zip_code(
        self, zip_code: int, zip_code_range: int
    ) -> list[CareFacilityResponse]:
        return await self.get_by_care_type_and_zip_code(
            "stationary_care", zip_code, zip_code_range
        )

    async def get_day_care_by_nearest_zip_code(
        self, zip_code: int, zip_code_range: int
    ) -> list[CareFacilityResponse]:
        return await self.get_by_care_type_and_zip_code(
            "day_care", zip_code, zip_code_range
        )

    async def get_ambulatory_care_by_nearest_zip_code(
        self, zip_code: int, zip_code_range: int
    ) -> list[CareFacilityResponse]:
        return await self.get_by_care_type_and_zip_code(
            "ambulatory_care", zip_code, zip_code_range
        )
