import logging
import sys

import colorama
from colorama import Fore, Style

from app.core.config import settings

# Initialize colorama
colorama.init(autoreset=True)

# Define color mapping for different log levels
LEVEL_COLORS = {
    logging.DEBUG: Fore.CYAN,
    logging.INFO: Fore.GREEN,
    logging.WARNING: Fore.YELLOW,
    logging.ERROR: Fore.RED,
    logging.CRITICAL: Fore.MAGENTA + Style.BRIGHT,
}


class ColoredFormatter(logging.Formatter):
    """Custom formatter that adds colors to log levels."""

    def format(self, record):
        # Get the original formatted message
        msg = super().format(record)

        # Add color to the log level
        level_color = LEVEL_COLORS.get(record.levelno, "")
        level_name = record.levelname
        colored_level = f"{level_color}{level_name}{Style.RESET_ALL}"

        # Replace the original level name with the colored one
        return msg.replace(level_name, colored_level)


def setup_logger(
    name: str = "app",
    level: int = logging.INFO,
    log_format: str | None = None,
    date_format: str | None = None,
) -> logging.Logger:
    """
    Configure and return a logger with colored output.

    Args:
        name: The name of the logger
        level: The log level (default: INFO)
        log_format: Custom log format (optional)
        date_format: Custom date format (optional)

    Returns:
        A configured logger instance
    """
    if log_format is None:
        log_format = "%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d | %(message)s"

    if date_format is None:
        date_format = "%Y-%m-%d %H:%M:%S"

    logger = logging.getLogger(name)
    logger.setLevel(level)
    # Prevent propagation to avoid duplicate logs
    logger.propagate = False

    # Remove existing handlers if any
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)

    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)

    # Create formatter
    formatter = ColoredFormatter(log_format, datefmt=date_format)
    console_handler.setFormatter(formatter)

    # Add handler to logger
    logger.addHandler(console_handler)

    return logger


# Create a default logger instance
logger = setup_logger()


def get_logger(name: str, level: int | None = None) -> logging.Logger:
    """
    Get a logger with the specified name and level.

    Args:
        name: The name of the logger
        level: The log level (optional, defaults to LOG_LEVEL in settings)

    Returns:
        A configured logger instance
    """
    if level is None:
        level = settings.LOG_LEVEL

    return setup_logger(name=name, level=level)
