# Docker Setup Guide

## Prerequisites
- Docker Desktop installed
- Docker Compose installed

## Build and Run

### Option 1: Using Docker Compose (Recommended)
```bash
# Build and start
docker-compose up --build

# Run in background
docker-compose up -d

# Stop
docker-compose down
```

### Option 2: Using Docker directly
```bash
# Build image
docker build -t dyslexia-app .

# Run container
docker run -p 5000:5000 dyslexia-app
```

## Access Application
Open browser: http://localhost:5000

## What's Included
- ✅ React frontend (built and served by Flask)
- ✅ Flask backend API
- ✅ Tesseract OCR (pre-installed)
- ✅ All Python dependencies
- ✅ ML models and data files

## Container Details
- **Base Image**: Python 3.9 slim + Node 16
- **Tesseract**: Pre-installed in container
- **Port**: 5000
- **Size**: ~800MB

## Troubleshooting

### Port already in use
```bash
# Change port in docker-compose.yml
ports:
  - "8080:5000"  # Use 8080 instead
```

### Rebuild after changes
```bash
docker-compose up --build
```

### View logs
```bash
docker-compose logs -f
```

### Remove all containers
```bash
docker-compose down -v
```

## Production Deployment
For production, set environment variables:
```yaml
environment:
  - FLASK_ENV=production
  - FLASK_DEBUG=0
```
