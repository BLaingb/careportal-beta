from collections.abc import Generator
from datetime import datetime, timezone
from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader, HTTPAuthorizationCredentials
from sqlmodel import Session, select

from app.core.config import settings
from app.core.db import engine
from app.core.email import EmailService
from app.core.security import JWTService, oauth2_scheme
from app.modules.auth.sessions.models import Session as DbSession
from app.modules.auth.users.models import User


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(oauth2_scheme)],
    session: SessionDep,
) -> User:
    try:
        # Get token from credentials
        token = JWTService.get_token_from_credentials(credentials)

        # Verify and decode the token
        payload = JWTService.verify_and_decode_token(token)

        # Extract session_id (subject) and user_id from payload
        session_id = payload.get("sub")
        user_id = payload.get("user_id")

        if not session_id or not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

        # Verify the session exists and is valid
        db_session = session.exec(
            select(DbSession)
            .where(DbSession.id == session_id)
            .where(DbSession.expires_at > datetime.now(timezone.utc))
        ).first()

        if not db_session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired or invalid",
            )

        # Get user from session
        user = session.exec(select(User).where(User.id == UUID(user_id))).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}",
        )


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_email_service() -> EmailService:
    return EmailService()


EmailServiceDep = Annotated[EmailService, Depends(get_email_service)]


api_key_header = APIKeyHeader(name="X-Admin-API-Key")


async def validate_admin_api_key(api_key: str = Security(api_key_header)) -> None:
    """Validate the admin API key"""
    if api_key != settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=403,
            detail="Invalid admin API key",
        )


AdminAPIKeyDep = Annotated[None, Depends(validate_admin_api_key)]
