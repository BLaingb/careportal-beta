from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from fastapi import HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create an instance of HTTPBearer for dependency injection
oauth2_scheme = HTTPBearer(
    auto_error=True, description="JWT Bearer token authentication"
)


class JWTService:
    """Service for handling JWT tokens"""

    ALGORITHM = "HS256"

    @classmethod
    def create_token(
        cls,
        subject: str | Any,
        expires_delta: timedelta,
        additional_data: dict[str, Any] | None = None,
    ) -> str:
        """
        Create a JWT token with the given subject and expiration time

        Args:
            subject: The subject of the token (usually user_id or session_id)
            expires_delta: How long the token should be valid
            additional_data: Additional data to include in the token payload

        Returns:
            The encoded JWT token
        """
        expire = datetime.now(timezone.utc) + expires_delta

        # Create the payload
        to_encode = {"exp": expire, "sub": str(subject)}

        # Add any additional data
        if additional_data:
            to_encode.update(additional_data)

        # Encode the token
        encoded_jwt = jwt.encode(
            to_encode, settings.SECRET_KEY, algorithm=cls.ALGORITHM
        )
        return encoded_jwt

    @classmethod
    def verify_and_decode_token(cls, token: str) -> dict[str, Any]:
        """
        Verify and decode a JWT token

        This method performs several verification steps:
        1. Validates the token signature using the secret key
        2. Checks if the token has expired
        3. Decodes the payload if verification passes

        Args:
            token: The JWT token to verify and decode

        Returns:
            The decoded token payload

        Raises:
            HTTPException: If the token is invalid, expired, or fails verification
        """
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[cls.ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )

    @classmethod
    def get_token_from_credentials(
        cls, credentials: HTTPAuthorizationCredentials
    ) -> str:
        """
        Extract the JWT token from HTTPAuthorizationCredentials

        Args:
            credentials: The credentials from HTTPBearer

        Returns:
            The JWT token
        """
        return credentials.credentials

    @classmethod
    def create_access_token(cls, session_id: str, user_id: Any) -> str:
        """
        Create an access token for the given session and user

        Args:
            session_id: The session ID
            user_id: The user ID

        Returns:
            The encoded JWT token
        """
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        additional_data = {"user_id": str(user_id)}
        return cls.create_token(session_id, expires_delta, additional_data)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
