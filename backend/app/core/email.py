import logging
from pathlib import Path
from typing import Any

from fastapi import BackgroundTasks
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
from jinja2 import Environment, FileSystemLoader
from pydantic import EmailStr

from app.core.config import settings

# Configure logging
logger = logging.getLogger(__name__)

# Email templates directory
TEMPLATES_DIR = Path(__file__).parent.parent / "templates" / "email"


class EmailService:
    def __init__(self):
        if not settings.emails_enabled:
            logger.warning("Email service is not configured, skipping email send")
            return

        try:
            self.config = ConnectionConfig(
                MAIL_USERNAME=settings.SMTP_USER,
                MAIL_PASSWORD=settings.SMTP_PASSWORD,
                MAIL_FROM=settings.EMAILS_FROM_EMAIL,
                MAIL_PORT=settings.SMTP_PORT,
                MAIL_SERVER=settings.SMTP_HOST,
                MAIL_STARTTLS=settings.SMTP_TLS,
                MAIL_SSL_TLS=settings.SMTP_SSL,
                USE_CREDENTIALS=True,
                VALIDATE_CERTS=True,
                MAIL_FROM_NAME=settings.EMAILS_FROM_NAME,
            )
            self.fast_mail = FastMail(self.config)
            self.jinja = Environment(
                loader=FileSystemLoader(TEMPLATES_DIR),
                autoescape=True,
            )
        except Exception as e:
            logger.error(f"Failed to initialize email service: {str(e)}")
            raise

    async def send_email(
        self,
        subject: str,
        recipients: list[EmailStr],
        template_name: str,
        template_data: dict[str, Any],
        background_tasks: BackgroundTasks | None = None,
    ) -> None:
        """
        Send an email using a template. Can be run in background if background_tasks is provided.
        """
        if not settings.emails_enabled:
            logger.warning("Email service is not configured, skipping email send")
            return

        try:
            template = self.jinja.get_template(f"{template_name}.html")
            html_content = template.render(**template_data)

            message = MessageSchema(
                subject=subject,
                recipients=recipients,
                body=html_content,
                subtype="html",
            )

            if background_tasks:
                background_tasks.add_task(
                    self._send_email_task,
                    message=message,
                )
            else:
                await self._send_email_task(message)

        except Exception as e:
            logger.error(
                f"Failed to send email to {recipients} with subject '{subject}': {str(e)}"
            )
            raise

    async def _send_email_task(self, message: MessageSchema) -> None:
        """Internal method to send email, used for background tasks"""
        try:
            await self.fast_mail.send_message(message)
            logger.info(
                f"Successfully sent email to {message.recipients} with subject '{message.subject}'"
            )
        except Exception as e:
            logger.error(
                f"Failed to send email to {message.recipients} with subject '{message.subject}': {str(e)}"
            )
            raise
