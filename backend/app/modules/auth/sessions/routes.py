from fastapi import APIRouter, HTTPException, status
from fastapi.logger import logger

from app.core.deps import CurrentUser
from app.modules.auth.deps import AuthServiceDep
from app.modules.auth.schemas import LoginRequest, TokenResponse
from app.modules.auth.users.schemas import UserCreate

# Create router with security scheme documentation
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=201)
async def signup(
    user_data: UserCreate,
    auth_service: AuthServiceDep,
) -> TokenResponse:
    try:
        # Create user
        user = await auth_service.create_user(user_data)

        # Create session for auto-login
        db_session = auth_service.create_session(user.id)

        # Create token response
        return auth_service.create_token_response(db_session)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"An error occurred while signing up: {e}")
        raise HTTPException(
            status_code=500, detail=f"An error occurred while signing up: {e}"
        )


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    auth_service: AuthServiceDep,
) -> TokenResponse:
    try:
        # Authenticate user and get token response
        return await auth_service.authenticate_user(login_data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"An error occurred while logging in: {e}")
        raise HTTPException(
            status_code=500, detail=f"An error occurred while logging in: {e}"
        )


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    current_user: CurrentUser,
    auth_service: AuthServiceDep,
) -> dict[str, str]:
    try:
        auth_service.delete_session(current_user.id)
        return {"message": "Successfully logged out"}
    except Exception as e:
        logger.error(f"An error occurred while logging out: {e}")
        raise HTTPException(
            status_code=500, detail=f"An error occurred while logging out: {e}"
        )
