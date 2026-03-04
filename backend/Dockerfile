# backend/Dockerfile

# Use the official lightweight Python 3.11 image
FROM python:3.11-slim

# Set environment variables to ensure stable behavior
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create a dedicated non-root user and group for security
RUN addgroup --system appgroup && adduser --system --group appuser

# Set the working directory
WORKDIR /app

# Install system dependencies (e.g., for building certain Python packages)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache for dependencies
COPY requirements.txt .

# Install dependencies as root before switching users
RUN pip install --no-cache-dir -r requirements.txt 

# Copy the rest of the application code
COPY --chown=appuser:appgroup . .

# Transfer ownership of the application files to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user to run the application securely
USER appuser

EXPOSE 8000

# Default command (can be overridden during testing)
CMD ["gunicorn", "main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]