# Multi-stage build for React + Flask
FROM node:16 AS frontend-build

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Python backend with Tesseract
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/ ./backend/
COPY requirements.txt ./
COPY model_training/ ./model_training/
COPY data/ ./data/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend build from previous stage
COPY --from=frontend-build /app/frontend/build ./backend/static

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=backend/backend.py
ENV PYTHONUNBUFFERED=1

# Run Flask app
CMD ["python", "backend/backend.py"]
