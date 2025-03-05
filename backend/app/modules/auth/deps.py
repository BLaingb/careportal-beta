from typing import Annotated

from fastapi import Depends

from app.core.deps import SessionDep
from app.modules.auth.services import AuthService
from app.modules.auth.users.deps import UserServiceDep


def get_auth_service(session: SessionDep, user_service: UserServiceDep) -> AuthService:
    return AuthService(session, user_service=user_service)


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
