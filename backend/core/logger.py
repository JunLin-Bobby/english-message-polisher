# backend/core/logger.py
import os
import logging
import sentry_sdk

def setup_logger():
    """
    Configures standard Python logging for Docker stdout and 
    initializes Sentry for unhandled exception tracking.
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[logging.StreamHandler()]
    )
    logger = logging.getLogger(__name__)

    # Initialize Sentry if the DSN environment variable is present
    SENTRY_DSN = os.getenv("SENTRY_DSN")
    if SENTRY_DSN:
        sentry_sdk.init(
            dsn=SENTRY_DSN,
            traces_sample_rate=1.0,
        )
        logger.info("Sentry initialized successfully.")
    else:
        logger.warning("SENTRY_DSN not found. Sentry is disabled.")

    return logger

# Create a singleton logger instance to be imported across the app
logger = setup_logger()