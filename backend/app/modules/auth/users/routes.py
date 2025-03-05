from fastapi import APIRouter, HTTPException
from fastapi.logger import logger

from app.core.deps import CurrentUser
from app.modules.auth.users.deps import UserRepositoryDep
from app.modules.auth.users.schemas import UserRead, UserUpdate
from app.modules.auth.users.services import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
async def get_current_user(
    current_user: CurrentUser,
) -> UserRead:
    """Get current authenticated user"""
    return current_user


@router.patch("/me", response_model=UserRead)
async def update_current_user(
    update_data: UserUpdate,
    current_user: CurrentUser,
    repository: UserRepositoryDep,
) -> UserRead:
    """Update current user's data"""
    try:
        user_service = UserService(repository=repository)
        return await user_service.update_user(current_user.id, update_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating user: {e}")
        raise HTTPException(
            status_code=500, detail=f"An error occurred while updating user: {e}"
        )
