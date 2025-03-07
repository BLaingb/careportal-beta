import os
import secrets
import warnings
from typing import Annotated, Any, Literal

from pydantic import (
    AnyUrl,
    BeforeValidator,
    computed_field,
    model_validator,
)
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Self


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # Use top level .env file (one level above ./backend/)
        env_file="./.env",
        env_ignore_empty=True,
        extra="ignore",
    )
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    FRONTEND_HOST: str = "http://localhost:3000"
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    ENABLE_ADMIN_ROUTES: bool = False
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"

    BACKEND_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ] = []

    ZIP_CODE_RANGE_SEARCH: int = 3_000

    POSTHOG_API_KEY: str | None = None
    POSTHOG_HOST: str | None = None

    @computed_field  # type: ignore[prop-decorator]
    @property
    def all_cors_origins(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS] + [
            self.FRONTEND_HOST
        ]

    PROJECT_NAME: str
    DATABASE_URL: str = "sqlite:///./sql_app.db"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return self.DATABASE_URL

    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    SMTP_PORT: int = 587
    SMTP_HOST: str | None = None
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    # TODO: update type to EmailStr when sqlmodel supports it
    EMAILS_FROM_EMAIL: str | None = None
    EMAILS_FROM_NAME: str | None = None

    @model_validator(mode="after")
    def _set_default_emails_from(self) -> Self:
        if not self.EMAILS_FROM_NAME:
            self.EMAILS_FROM_NAME = self.PROJECT_NAME
        return self

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48

    @computed_field  # type: ignore[prop-decorator]
    @property
    def emails_enabled(self) -> bool:
        return bool(self.SMTP_HOST and self.EMAILS_FROM_EMAIL)

    # TODO: update type to EmailStr when sqlmodel supports it
    EMAIL_TEST_USER: str = "test@example.com"
    # TODO: update type to EmailStr when sqlmodel supports it
    FIRST_SUPERUSER: str
    FIRST_SUPERUSER_PASSWORD: str

    def _check_default_secret(self, var_name: str, value: str | None) -> None:
        if value == "changethis":
            message = (
                f'The value of {var_name} is "changethis", '
                "for security, please change it, at least for deployments."
            )
            if self.ENVIRONMENT == "local":
                warnings.warn(message, stacklevel=1)
            else:
                raise ValueError(message)

    @model_validator(mode="after")
    def _enforce_non_default_secrets(self) -> Self:
        self._check_default_secret("SECRET_KEY", self.SECRET_KEY)
        self._check_default_secret(
            "FIRST_SUPERUSER_PASSWORD", self.FIRST_SUPERUSER_PASSWORD
        )

        return self

    # Cookie settings
    SET_SESSION_COOKIES: bool = False  # Master switch for cookie functionality
    COOKIE_SECURE: bool = True  # Should be False for HTTP in local development
    COOKIE_DOMAIN: str | None = None  # Set to your domain in production
    SESSION_COOKIE_NAME: str = "session_id"
    # Cookie max age in days
    SESSION_COOKIE_AGE_DAYS: int = 7

    @model_validator(mode="after")
    def _set_cookie_settings(self) -> Self:
        # If we're in local development, don't require secure cookies
        if self.ENVIRONMENT == "local":
            self.COOKIE_SECURE = False
            self.COOKIE_DOMAIN = None
        return self

    # Email settings
    MAIL_USERNAME: str = os.getenv("MAIL_USERNAME", "")
    MAIL_PASSWORD: str = os.getenv("MAIL_PASSWORD", "")
    MAIL_FROM: str = os.getenv("MAIL_FROM", "noreply@example.com")
    MAIL_PORT: int = int(os.getenv("MAIL_PORT", "587"))
    MAIL_SERVER: str = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_STARTTLS: bool = os.getenv("MAIL_STARTTLS", "True").lower() == "true"
    MAIL_SSL_TLS: bool = os.getenv("MAIL_SSL_TLS", "False").lower() == "true"
    MAIL_USE_CREDENTIALS: bool = (
        os.getenv("MAIL_USE_CREDENTIALS", "True").lower() == "true"
    )
    MAIL_VALIDATE_CERTS: bool = (
        os.getenv("MAIL_VALIDATE_CERTS", "True").lower() == "true"
    )

    # Admin API settings
    ADMIN_API_KEY: str = os.getenv("ADMIN_API_KEY", secrets.token_urlsafe(32))


settings = Settings()  # type: ignore
