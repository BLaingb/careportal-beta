from uuid import UUID, uuid4

import pytest
from fastapi import HTTPException

from app.modules.financial.accounts.models import Account, AccountType
from app.modules.financial.accounts.repository import AccountRepository
from app.modules.financial.accounts.schemas import (
    AccountAPIInput,
    AccountUpdate,
)
from app.modules.financial.accounts.services import AccountService
from app.modules.households.models import HouseholdType, MemberRole
from app.modules.households.repository import HouseholdRepository
from app.modules.households.schemas import HouseholdDBCreate
from app.tests.fixtures import db_engine, db_session  # noqa


@pytest.fixture
def mock_household_service():
    """Create a mock household service with async methods"""

    class MockHouseholdService:
        async def verify_access(
            self,
            household_id: UUID,
            user_id: int,
            required_role: MemberRole | None = None,
        ) -> bool:
            # Default implementation - override in specific tests
            return True

    return MockHouseholdService()


@pytest.fixture
async def household_repository(db_session):  # noqa: F811
    return HouseholdRepository(db=db_session)


@pytest.fixture
async def account_repository(db_session):  # noqa: F811
    return AccountRepository(db=db_session)


@pytest.fixture
async def account_service(account_repository, mock_household_service):
    return AccountService(
        account_repository=account_repository,
        household_service=mock_household_service,
    )


class TestAccountService:
    async def test_create_account_success(
        self, account_service, mock_household_service
    ):
        # Setup test data
        household_id = uuid4()
        user_id = uuid4()
        account_data = AccountAPIInput(
            household_id=household_id,
            name="Test Account",
            type=AccountType.BALANCE_TRACKING,
            currency="USD",
            initial_balance=100.00,  # $100.00
        )

        # Mock household service to allow access
        mock_household_service.verify_access = async_mock(return_value=True)

        # Create account
        account = await account_service.create_account(account_data, user_id)

        # Verify the account was created correctly
        assert isinstance(account, Account)
        assert account.name == "Test Account"
        assert account.type == AccountType.BALANCE_TRACKING
        assert account.currency == "USD"
        assert account.current_balance == 10000  # Stored in cents
        assert account.household_id == household_id

    async def test_create_account_no_access(
        self, account_service, mock_household_service
    ):
        # Setup test data
        household_id = uuid4()
        user_id = uuid4()
        account_data = AccountAPIInput(
            household_id=household_id,
            name="Test Account",
            type=AccountType.BALANCE_TRACKING,
            currency="USD",
            initial_balance=100.00,
        )

        # Mock household service to deny access
        mock_household_service.verify_access = async_mock(return_value=False)

        # Attempt to create account
        with pytest.raises(HTTPException) as exc_info:
            await account_service.create_account(account_data, user_id)

        assert exc_info.value.status_code == 403

    async def test_get_account_success(self, account_service, mock_household_service):
        # First create an account
        household_id = uuid4()
        user_id = uuid4()
        account_data = AccountAPIInput(
            household_id=household_id,
            name="Test Account",
            type=AccountType.BALANCE_TRACKING,
            currency="USD",
            initial_balance=100.00,
        )

        mock_household_service.verify_access = async_mock(return_value=True)
        created_account = await account_service.create_account(account_data, user_id)

        # Now try to get it
        account = await account_service.get_account(created_account.id, user_id)

        assert isinstance(account, Account)
        assert account.id == created_account.id
        assert account.name == "Test Account"
        assert account.current_balance == 10000

    async def test_get_account_no_access(self, account_service, mock_household_service):
        # Create account with one user
        household_id = uuid4()
        creator_id = uuid4()
        account_data = AccountAPIInput(
            household_id=household_id,
            name="Test Account",
            type=AccountType.BALANCE_TRACKING,
            currency="USD",
            initial_balance=100.00,
        )

        mock_household_service.verify_access = async_mock(return_value=True)
        created_account = await account_service.create_account(account_data, creator_id)

        # Try to access with different user
        other_user_id = uuid4()
        mock_household_service.verify_access = async_mock(return_value=False)

        with pytest.raises(HTTPException) as exc_info:
            await account_service.get_account(created_account.id, other_user_id)

        assert exc_info.value.status_code == 403
        assert "does not have access" in str(exc_info.value.detail)

    async def test_get_account_not_found(self, account_service):
        non_existent_id = uuid4()
        user_id = uuid4()

        with pytest.raises(HTTPException) as exc_info:
            await account_service.get_account(non_existent_id, user_id)

        assert exc_info.value.status_code == 404
        assert "Account not found" in str(exc_info.value.detail)

    async def test_update_account_success(
        self, account_service, mock_household_service
    ):
        # Create an account first
        household_id = uuid4()
        user_id = uuid4()
        account_data = AccountAPIInput(
            household_id=household_id,
            name="Original Name",
            type=AccountType.BALANCE_TRACKING,
            currency="USD",
            initial_balance=100.00,
        )

        mock_household_service.verify_access = async_mock(return_value=True)
        created_account = await account_service.create_account(account_data, user_id)

        # Update the account
        update_data = AccountUpdate(name="Updated Name")
        updated_account = await account_service.update_account(
            created_account.id, update_data, user_id
        )

        assert updated_account.name == "Updated Name"
        assert updated_account.current_balance == created_account.current_balance

    async def test_update_account_no_admin_access(
        self, account_service, mock_household_service
    ):
        # Create account with admin access
        household_id = uuid4()
        admin_id = uuid4()
        account_data = AccountAPIInput(
            household_id=household_id,
            name="Test Account",
            type=AccountType.BALANCE_TRACKING,
            currency="USD",
            initial_balance=100.00,
        )

        mock_household_service.verify_access = async_mock(return_value=True)
        created_account = await account_service.create_account(account_data, admin_id)

        # Try to update with non-admin user
        non_admin_id = uuid4()
        mock_household_service.verify_access = async_mock(return_value=False)
        update_data = AccountUpdate(name="Malicious Update")

        with pytest.raises(HTTPException) as exc_info:
            await account_service.update_account(
                created_account.id, update_data, non_admin_id
            )

        assert exc_info.value.status_code == 403
        assert "does not have admin access" in str(exc_info.value.detail)

    async def test_delete_account_success(
        self, account_service, mock_household_service
    ):
        # Create an account
        household_id = uuid4()
        admin_id = uuid4()
        account_data = AccountAPIInput(
            household_id=household_id,
            name="Test Account",
            type=AccountType.BALANCE_TRACKING,
            currency="USD",
            initial_balance=100.00,
        )

        mock_household_service.verify_access = async_mock(return_value=True)
        created_account = await account_service.create_account(account_data, admin_id)

        # Delete the account
        await account_service.delete_account(created_account.id, admin_id)

        # Verify account is deleted
        with pytest.raises(HTTPException) as exc_info:
            await account_service.get_account(created_account.id, admin_id)

        assert exc_info.value.status_code == 404

    async def test_delete_account_no_admin_access(
        self, account_service, mock_household_service
    ):
        # Create account with admin access
        household_id = uuid4()
        admin_id = uuid4()
        account_data = AccountAPIInput(
            household_id=household_id,
            name="Test Account",
            type=AccountType.BALANCE_TRACKING,
            currency="USD",
            initial_balance=100.00,
        )

        mock_household_service.verify_access = async_mock(return_value=True)
        created_account = await account_service.create_account(account_data, admin_id)

        # Try to delete with non-admin user
        non_admin_id = uuid4()
        mock_household_service.verify_access = async_mock(return_value=False)

        with pytest.raises(HTTPException) as exc_info:
            await account_service.delete_account(created_account.id, non_admin_id)

        assert exc_info.value.status_code == 403
        assert "does not have admin access" in str(exc_info.value.detail)

    async def test_get_all_for_user(
        self, account_service, mock_household_service, household_repository
    ):
        # Create multiple accounts for the user
        user_id = uuid4()
        household = await household_repository.create(
            HouseholdDBCreate(
                name="Test Household", type=HouseholdType.PERSONAL, user_id=user_id
            )
        )
        mock_household_service.verify_access = async_mock(return_value=True)

        accounts_data = [
            AccountAPIInput(
                household_id=household.id,
                name=f"Account {i}",
                type=AccountType.BALANCE_TRACKING,
                currency="USD",
                initial_balance=100.00 * i,
            )
            for i in range(1, 4)
        ]

        created_accounts = []
        for data in accounts_data:
            account = await account_service.create_account(data, user_id)
            created_accounts.append(account)

        # Get all accounts for user
        user_accounts = await account_service.get_all_for_user(user_id)

        assert len(user_accounts) == len(created_accounts)
        assert {account.id for account in user_accounts} == {
            account.id for account in created_accounts
        }


def async_mock(return_value=None):
    """Helper function to create an async mock"""

    async def mock(*args, **kwargs):  # noqa: ARG001
        return return_value

    return mock
