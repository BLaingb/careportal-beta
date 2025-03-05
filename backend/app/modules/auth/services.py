import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.core.config import settings
from app.core.security import JWTService
from app.modules.auth.schemas import LoginRequest, TokenResponse
from app.modules.auth.sessions.models import Session as DbSession
from app.modules.auth.users.deps import UserServiceDep
from app.modules.auth.users.schemas import UserCreate, UserRead


class AuthService:
    def __init__(
        self,
        db: Session,
        *,
        user_service: UserServiceDep,
    ):
        self.db = db
        self.user_service = user_service

    def create_session(self, user_id: int) -> DbSession:
        """Create a new session for the user"""
        session = DbSession(
            id=str(uuid.uuid4()),
            user_id=user_id,
            expires_at=datetime.now(timezone.utc)
            + timedelta(days=settings.SESSION_COOKIE_AGE_DAYS),
        )

        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)

        return session

    def create_token_response(self, db_session: DbSession) -> TokenResponse:
        """Create a token response from a session"""
        # Generate JWT token
        access_token = JWTService.create_access_token(
            session_id=db_session.id, user_id=db_session.user_id
        )

        # Create response
        return TokenResponse(
            access_token=access_token,
            expires_at=db_session.expires_at,
            user_id=db_session.user_id,
        )

    async def authenticate_user(self, login_data: LoginRequest) -> TokenResponse:
        # Get user by email
        user = self.user_service.get_user_by_email(login_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        # Verify password
        if not self.user_service.verify_password(
            login_data.password, user.hashed_password
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        # Create session
        db_session = self.create_session(user.id)

        # Create token response
        return self.create_token_response(db_session)

    def create_user(self, user_data: UserCreate) -> UserRead:
        """Create a new user account"""
        return self.user_service.create_user(user_data)

    def delete_session(self, user_id: int) -> None:
        """Delete user's session from database"""
        db_session = self.db.exec(
            select(DbSession).where(DbSession.user_id == user_id)
        ).first()

        if db_session:
            self.db.delete(db_session)
            self.db.commit()
