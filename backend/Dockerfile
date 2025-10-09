### Build stage for frontend
FROM node:16 as frontend-builder
WORKDIR /build-frontend
COPY frontend/package.json frontend/package-lock.json* ./frontend/
COPY frontend ./frontend
WORKDIR /build-frontend/frontend
RUN if [ -f package.json ]; then \
      npm install --no-audit --no-fund && npm run build; \
    fi

### Final stage: Python app
FROM python:3.10-slim
WORKDIR /app

# Install dependencies needed for building some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential ca-certificates \
  zlib1g-dev libjpeg-dev libjpeg62-turbo-dev libfreetype6-dev liblcms2-dev libwebp-dev tcl-dev tk-dev \
  && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy backend source
COPY . /app

# Copy built frontend into Flask static folder (if present)
RUN if [ -d "/build-frontend/frontend/build" ]; then \
      mkdir -p /app/../frontend && cp -r /build-frontend/frontend/build /app/../frontend/build || true; \
    fi

EXPOSE 5000

# Use gunicorn for production-like server
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:5000", "--workers", "2"]
