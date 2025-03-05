from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

from app.core.deps import AdminAPIKeyDep, SessionDep
from app.modules.households.models import InvitationStatus
from app.modules.households.repository import HouseholdInvitationRepository

router = APIRouter(prefix="/admin", tags=["admin"])


class InvitationExpireResponse(BaseModel):
    expired_count: int
    timestamp: datetime


@router.post("/invitations/expire", response_model=InvitationExpireResponse)
async def cleanup_expired_invitations(
    _: AdminAPIKeyDep,
    session: SessionDep,
) -> InvitationExpireResponse:
    """
    Expire invitations that have passed their expiration date.
    Requires admin API key.
    """
    repository = HouseholdInvitationRepository(session)
    current_time = datetime.now(timezone.utc)

    expired_count = await repository.expire_old_invitations(
        current_time=current_time,
        current_status=InvitationStatus.PENDING,
    )

    return InvitationExpireResponse(
        expired_count=expired_count,
        timestamp=current_time,
    )
