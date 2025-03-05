from typing import Annotated

from fastapi import Depends

from app.core.deps import SessionDep
from app.modules.auth.users.repository import AbstractUserRepository, UserRepository
from app.modules.auth.users.services import UserService


def get_user_repository(
    session: SessionDep,
) -> AbstractUserRepository:
    return UserRepository(session)


UserRepositoryDep = Annotated[AbstractUserRepository, Depends(get_user_repository)]


def get_user_service(
    repository: UserRepositoryDep,
) -> UserService:
    return UserService(repository=repository)


UserServiceDep = Annotated[UserService, Depends(get_user_service)]
