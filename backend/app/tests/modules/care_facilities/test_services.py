from uuid import uuid4

import pytest
from fastapi import BackgroundTasks

from app.core.config import settings
from app.modules.care_facilities.repository import CareFacilityRepository
from app.modules.care_facilities.schemas import CareFacilityResponse
from app.modules.care_facilities.services import CareFacilityService
from app.tests.fixtures import db_engine, db_session  # noqa


@pytest.fixture
async def care_facility_repository(db_session):  # noqa: F811
    return CareFacilityRepository(db=db_session)


@pytest.fixture
async def care_facility_service(care_facility_repository):
    return CareFacilityService(repository=care_facility_repository)


@pytest.fixture
def mock_background_tasks():
    return BackgroundTasks()


@pytest.fixture
def facility_response_factory():
    """Factory to create facility response objects for testing"""

    def _create_facility(
        id_val=None,
        name="Test Facility",
        address="123 Test St",
        zip_code=12345,
        available_capacity=True,
        slug="test-facility",
        distance=0,
    ):
        return CareFacilityResponse(
            id=id_val or uuid4(),
            name=name,
            address=address,
            zip_code=zip_code,
            available_capacity=available_capacity,
            slug=slug,
            distance=distance,
        )

    return _create_facility


class TestCareFacilityService:
    async def test_find_best_match_available_facility(
        self,
        care_facility_service,
        mock_background_tasks,
        monkeypatch,
        facility_response_factory,
    ):
        # Create test facilities
        test_facilities = [
            facility_response_factory(
                name="Facility 1", available_capacity=True, distance=5
            ),
            facility_response_factory(
                name="Facility 2", available_capacity=False, distance=3
            ),
            facility_response_factory(
                name="Facility 3", available_capacity=True, distance=10
            ),
        ]

        # Mock the repository method
        async def mock_get_by_care_type_and_zip_code(*_args, **_kwargs):
            return test_facilities

        monkeypatch.setattr(
            care_facility_service.repository,
            "get_by_care_type_and_zip_code",
            mock_get_by_care_type_and_zip_code,
        )

        # Mock the analytics method
        analytics_called = False

        async def mock_analytics_found(*_args, **_kwargs):
            nonlocal analytics_called
            analytics_called = True

        monkeypatch.setattr(
            care_facility_service,
            "_CareFacilityService__analytics_search_facilities_found",
            mock_analytics_found,
        )

        # Call the method
        zip_code = 12345
        care_type = "stationary_care"
        result = await care_facility_service.find_best_match(
            zip_code, care_type, mock_background_tasks
        )

        # Verify results
        assert result is not None
        assert result.name == "Facility 1"  # First available facility
        assert result.available_capacity is True

        # Verify background task was added
        assert len(mock_background_tasks.tasks) == 1

    async def test_find_best_match_no_available_capacity(
        self,
        care_facility_service,
        mock_background_tasks,
        monkeypatch,
        facility_response_factory,
    ):
        # Create test facilities with no available capacity
        test_facilities = [
            facility_response_factory(
                name="Facility 1", available_capacity=False, distance=5
            ),
            facility_response_factory(
                name="Facility 2", available_capacity=False, distance=3
            ),
        ]

        # Mock the repository method
        async def mock_get_by_care_type_and_zip_code(*_args, **_kwargs):
            return test_facilities

        monkeypatch.setattr(
            care_facility_service.repository,
            "get_by_care_type_and_zip_code",
            mock_get_by_care_type_and_zip_code,
        )

        # Mock the analytics method
        analytics_called = False

        async def mock_analytics_not_available(*_args, **_kwargs):
            nonlocal analytics_called
            analytics_called = True

        monkeypatch.setattr(
            care_facility_service,
            "_CareFacilityService__analytics_search_facilities_not_available",
            mock_analytics_not_available,
        )

        # Call the method
        zip_code = 12345
        care_type = "day_care"
        result = await care_facility_service.find_best_match(
            zip_code, care_type, mock_background_tasks
        )

        # Verify results
        assert result is None

        # Verify background task was added
        assert len(mock_background_tasks.tasks) == 1

    async def test_find_best_match_no_facilities_found(
        self, care_facility_service, mock_background_tasks, monkeypatch
    ):
        # Mock the repository method to return empty list
        async def mock_get_by_care_type_and_zip_code(*_args, **_kwargs):
            return []

        monkeypatch.setattr(
            care_facility_service.repository,
            "get_by_care_type_and_zip_code",
            mock_get_by_care_type_and_zip_code,
        )

        # Mock the analytics method
        analytics_called = False

        async def mock_analytics_not_found(*_args, **_kwargs):
            nonlocal analytics_called
            analytics_called = True

        monkeypatch.setattr(
            care_facility_service,
            "_CareFacilityService__analytics_search_facilities_not_found",
            mock_analytics_not_found,
        )

        # Call the method
        zip_code = 99999  # Non-existent zip code
        care_type = "ambulatory_care"
        result = await care_facility_service.find_best_match(
            zip_code, care_type, mock_background_tasks
        )

        # Verify results
        assert result is None

        # Verify background task was added
        assert len(mock_background_tasks.tasks) == 1

    async def test_find_best_match_repository_parameters(
        self, care_facility_service, mock_background_tasks, monkeypatch
    ):
        # Track parameters passed to repository method
        called_with_params = {}

        async def mock_get_by_care_type_and_zip_code(
            care_type, zip_code, zip_code_range
        ):
            nonlocal called_with_params
            called_with_params = {
                "care_type": care_type,
                "zip_code": zip_code,
                "zip_code_range": zip_code_range,
            }
            return []

        monkeypatch.setattr(
            care_facility_service.repository,
            "get_by_care_type_and_zip_code",
            mock_get_by_care_type_and_zip_code,
        )

        # Mock analytics method
        async def mock_analytics(*args, **kwargs):
            pass

        monkeypatch.setattr(
            care_facility_service,
            "_CareFacilityService__analytics_search_facilities_not_found",
            mock_analytics,
        )

        # Call the method
        zip_code = 12345
        care_type = "stationary_care"
        await care_facility_service.find_best_match(
            zip_code, care_type, mock_background_tasks
        )

        # Verify correct parameters were passed
        assert called_with_params["care_type"] == care_type
        assert called_with_params["zip_code"] == zip_code
        assert called_with_params["zip_code_range"] == settings.ZIP_CODE_RANGE_SEARCH

    async def test_analytics_search_facilities_not_found(self, care_facility_service):
        # Since the analytics methods are currently just placeholders with pass statements,
        # we're just testing that they don't raise exceptions
        zip_code = 12345
        zip_code_range = 10
        care_type = "stationary_care"

        # This should not raise an exception
        await care_facility_service._CareFacilityService__analytics_search_facilities_not_found(
            zip_code, zip_code_range, care_type
        )

    async def test_analytics_search_facilities_not_available(
        self, care_facility_service
    ):
        # Testing the analytics method for facilities with no available capacity
        zip_code = 12345
        zip_code_range = 10
        care_type = "day_care"

        # This should not raise an exception
        await care_facility_service._CareFacilityService__analytics_search_facilities_not_available(
            zip_code, zip_code_range, care_type
        )

    async def test_analytics_search_facilities_found(self, care_facility_service):
        # Testing the analytics method for when a facility is found
        zip_code = 12345
        care_type = "ambulatory_care"
        facility_id = 1
        facility_name = "Test Facility"

        # This should not raise an exception
        await care_facility_service._CareFacilityService__analytics_search_facilities_found(
            zip_code, care_type, facility_id, facility_name
        )


def async_mock(return_value=None):
    """Helper function to create an async mock"""

    async def mock(*args, **kwargs):  # noqa: ARG001
        return return_value

    return mock
