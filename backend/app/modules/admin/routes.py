from fastapi import APIRouter

from app.core.deps import AdminAPIKeyDep, SessionDep

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/")
async def admin_endpoint(
    _: AdminAPIKeyDep,
    _session: SessionDep,
):
    """ """
    return {"message": "Hello, world!"}
