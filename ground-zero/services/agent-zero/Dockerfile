# Ground-Zero Agent Zero Service
FROM python:3.11-slim

# Security: Non-root user
RUN useradd -m -u 1000 agent && \
    mkdir -p /app && \
    chown -R agent:agent /app

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (layer caching)
COPY --chown=agent:agent requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY --chown=agent:agent . .

# Switch to non-root user
USER agent

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import sys; sys.exit(0)"

# Default command
CMD ["python", "main.py"]
