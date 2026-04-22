# backend/Dockerfile

# Lambda-compatible base image (Amazon Linux 2 + Python 3.11 runtime)
# Replaces python:3.11-slim which does not support Lambda's handler entrypoint format
FROM public.ecr.aws/lambda/python:3.11

# Set environment variables to ensure stable behavior
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
# Note: Lambda base image uses Amazon Linux (yum), not Debian (apt-get)
RUN yum install -y gcc && yum clean all

# Copy and install Python dependencies into Lambda's task root
# LAMBDA_TASK_ROOT is a built-in env var pointing to /var/task
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Copy application code into Lambda's task root
COPY . ${LAMBDA_TASK_ROOT}

# Lambda entrypoint: points to handler = Mangum(app) in main.py
CMD ["main.handler"]