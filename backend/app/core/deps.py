from collections.abc import Generator
from typing import Annotated

from fastapi import Depends, HTTPException, Security
from fastapi.security import APIKeyHeader
from posthog import Posthog
from sqlmodel import Session

from app.core.analytics import PosthogAnalytics
from app.core.config import settings
from app.core.db import engine
from app.core.email import EmailService


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]


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


def get_posthog() -> PosthogAnalytics | None:
    if not settings.POSTHOG_API_KEY or not settings.POSTHOG_HOST:
        return None
    return PosthogAnalytics(
        Posthog(settings.POSTHOG_API_KEY, host=settings.POSTHOG_HOST)
    )


PostHogDep = Annotated[Posthog | None, Depends(get_posthog)]
