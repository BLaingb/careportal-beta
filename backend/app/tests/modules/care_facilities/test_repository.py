import pytest

from app.modules.care_facilities.models import CareFacility
from app.modules.care_facilities.repository import CareFacilityRepository
from app.modules.care_facilities.schemas import (
    CareFacilityResponse,
)
from app.tests.fixtures import db_engine, db_session  # noqa


@pytest.fixture
async def care_facility_repository(db_session):  # noqa: F811
    return CareFacilityRepository(db=db_session)


@pytest.fixture
async def sample_facilities(db_session):  # noqa: F811
    """Create sample facilities in the database for testing"""
    facilities = []

    # Create facilities with different care types and zip codes
    facility_data = [
        {
            "name": "Stationary Care Facility",
            "address": "123 Main St",
            "has_stationary_care": True,
            "has_day_care": False,
            "has_ambulatory_care": False,
            "from_zip_code": 10000,
            "to_zip_code": 10100,
            "zip_code": 10050,
            "available_capacity": True,
            "slug": "stationary-care-facility",
        },
        {
            "name": "Day Care Facility",
            "address": "456 Oak Ave",
            "has_stationary_care": False,
            "has_day_care": True,
            "has_ambulatory_care": False,
            "from_zip_code": 10000,
            "to_zip_code": 10100,
            "zip_code": 10075,
            "available_capacity": False,
            "slug": "day-care-facility",
        },
        {
            "name": "Ambulatory Care Facility",
            "address": "789 Pine Rd",
            "has_stationary_care": False,
            "has_day_care": False,
            "has_ambulatory_care": True,
            "from_zip_code": 20000,
            "to_zip_code": 20100,
            "zip_code": 20050,
            "available_capacity": True,
            "slug": "ambulatory-care-facility",
        },
        {
            "name": "Multi-Care Facility",
            "address": "101 Cedar Ln",
            "has_stationary_care": True,
            "has_day_care": True,
            "has_ambulatory_care": True,
            "from_zip_code": 10000,
            "to_zip_code": 10100,
            "zip_code": 10025,
            "available_capacity": True,
            "slug": "multi-care-facility",
        },
    ]

    for data in facility_data:
        facility = CareFacility(**data)
        db_session.add(facility)
        facilities.append(facility)

    db_session.commit()

    # Refresh the facilities to get their IDs
    for facility in facilities:
        db_session.refresh(facility)

    return facilities


class TestCareFacilityRepository:
    async def test_get_by_care_type_and_zip_code_exact_match(
        self, care_facility_repository, sample_facilities
    ):
        # Test finding facilities with exact zip code match
        zip_code = 10050  # Exact match for "Stationary Care Facility"
        care_type = "stationary_care"
        zip_code_range = 0  # Exact match only

        results = await care_facility_repository.get_by_care_type_and_zip_code(
            care_type, zip_code, zip_code_range
        )

        assert len(results) == 1
        assert results[0].name == "Stationary Care Facility"
        assert results[0].distance == 0  # Exact match should have distance 0

    async def test_get_by_care_type_and_zip_code_range(
        self, care_facility_repository, sample_facilities
    ):
        # Test finding facilities within a zip code range
        zip_code = 10000
        care_type = "stationary_care"
        zip_code_range = 100

        results = await care_facility_repository.get_by_care_type_and_zip_code(
            care_type, zip_code, zip_code_range
        )

        # Should find both stationary care facilities
        assert len(results) == 2
        facility_names = {result.name for result in results}
        assert "Stationary Care Facility" in facility_names
        assert "Multi-Care Facility" in facility_names

        # Results should be ordered by distance from the search zip code
        assert results[0].distance < results[1].distance

    async def test_get_by_care_type_and_zip_code_no_results(
        self, care_facility_repository, sample_facilities
    ):
        # Test with a zip code that's out of range
        zip_code = 30000
        care_type = "stationary_care"
        zip_code_range = 100

        results = await care_facility_repository.get_by_care_type_and_zip_code(
            care_type, zip_code, zip_code_range
        )

        assert len(results) == 0

    async def test_get_by_care_type_and_zip_code_multiple_care_types(
        self, care_facility_repository, sample_facilities
    ):
        # Test finding facilities with day care
        zip_code = 10000
        care_type = "day_care"
        zip_code_range = 100

        results = await care_facility_repository.get_by_care_type_and_zip_code(
            care_type, zip_code, zip_code_range
        )

        assert len(results) == 2
        facility_names = {result.name for result in results}
        assert "Day Care Facility" in facility_names
        assert "Multi-Care Facility" in facility_names

    async def test_get_by_care_type_and_zip_code_response_format(
        self, care_facility_repository, sample_facilities
    ):
        # Test that the response format is correct
        zip_code = 10050
        care_type = "stationary_care"
        zip_code_range = 0

        results = await care_facility_repository.get_by_care_type_and_zip_code(
            care_type, zip_code, zip_code_range
        )

        assert len(results) == 1
        facility = results[0]

        # Check that the response has all expected fields
        assert isinstance(facility, CareFacilityResponse)
        assert facility.id is not None
        assert facility.name == "Stationary Care Facility"
        assert facility.address == "123 Main St"
        assert facility.zip_code == 10050
        assert facility.available_capacity is True
        assert facility.slug == "stationary-care-facility"
        assert facility.distance == 0

    async def test_get_stationary_care_by_nearest_zip_code(
        self, care_facility_repository, sample_facilities
    ):
        # Test the convenience method for stationary care
        zip_code = 10000
        zip_code_range = 100

        results = (
            await care_facility_repository.get_stationary_care_by_nearest_zip_code(
                zip_code, zip_code_range
            )
        )

        assert len(results) == 2
        facility_names = {result.name for result in results}
        assert "Stationary Care Facility" in facility_names
        assert "Multi-Care Facility" in facility_names

    async def test_get_day_care_by_nearest_zip_code(
        self, care_facility_repository, sample_facilities
    ):
        # Test the convenience method for day care
        zip_code = 10000
        zip_code_range = 100

        results = await care_facility_repository.get_day_care_by_nearest_zip_code(
            zip_code, zip_code_range
        )

        assert len(results) == 2
        facility_names = {result.name for result in results}
        assert "Day Care Facility" in facility_names
        assert "Multi-Care Facility" in facility_names

    async def test_get_ambulatory_care_by_nearest_zip_code(
        self, care_facility_repository, sample_facilities
    ):
        # Test the convenience method for ambulatory care
        zip_code = 20000
        zip_code_range = 100

        results = (
            await care_facility_repository.get_ambulatory_care_by_nearest_zip_code(
                zip_code, zip_code_range
            )
        )

        assert len(results) == 1
        assert results[0].name == "Ambulatory Care Facility"
