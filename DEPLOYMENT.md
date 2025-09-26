# Deployment Guide for DysLexiCheck

This guide covers different deployment options for the DysLexiCheck application.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)
- Git
- Microphone access for speech features
- Internet connection for API services

### 1. Clone and Setup
```bash
git clone https://github.com/shrutz2/DysLexiCheck.git
cd DysLexiCheck
pip install -r requirements.txt
```

### 2. Run Application
```bash
# Option 1: Using Python script
python run_app.py

# Option 2: Direct Streamlit
streamlit run app.py

# Option 3: Windows Batch File
start_app.bat
```

## 🌐 Cloud Deployment Options

### 1. Streamlit Cloud (Recommended)

#### Steps:
1. Push your code to GitHub
2. Go to [share.streamlit.io](https://share.streamlit.io)
3. Connect your GitHub account
4. Select your repository
5. Set main file path: `app.py`
6. Add secrets for API keys in Streamlit Cloud dashboard

#### Secrets Configuration:
```toml
# .streamlit/secrets.toml
[azure]
subscription_key = "your_azure_key"
endpoint = "your_azure_endpoint"

[bing]
api_key = "your_bing_api_key"
```

### 2. Heroku Deployment

#### Files needed:
```bash
# Procfile
web: streamlit run app.py --server.port=$PORT --server.address=0.0.0.0

# runtime.txt
python-3.9.16

# requirements.txt (already exists)
```

#### Steps:
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set AZURE_SUBSCRIPTION_KEY="your_key"
heroku config:set AZURE_ENDPOINT="your_endpoint"
heroku config:set BING_API_KEY="your_key"
git push heroku main
```

### 3. AWS EC2 Deployment

#### Launch EC2 Instance:
```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt update
sudo apt install python3-pip nginx
pip3 install -r requirements.txt

# Run with PM2 or systemd
sudo systemctl create dyslexicheck.service
```

#### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8501;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. Google Cloud Platform

#### App Engine (app.yaml):
```yaml
runtime: python39

env_variables:
  AZURE_SUBSCRIPTION_KEY: "your_key"
  AZURE_ENDPOINT: "your_endpoint"
  BING_API_KEY: "your_key"

automatic_scaling:
  min_instances: 1
  max_instances: 10
```

#### Deploy:
```bash
gcloud app deploy
```

### 5. Docker Deployment

#### Dockerfile:
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8501

CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

#### Build and Run:
```bash
docker build -t dyslexicheck .
docker run -p 8501:8501 dyslexicheck
```

#### Docker Compose:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8501:8501"
    environment:
      - AZURE_SUBSCRIPTION_KEY=${AZURE_SUBSCRIPTION_KEY}
      - AZURE_ENDPOINT=${AZURE_ENDPOINT}
      - BING_API_KEY=${BING_API_KEY}
```

## 🔧 Configuration

### Environment Variables
```bash
# Required API Keys
AZURE_SUBSCRIPTION_KEY=your_azure_key
AZURE_ENDPOINT=your_azure_endpoint
BING_API_KEY=your_bing_key

# Optional Configuration
STREAMLIT_SERVER_PORT=8501
STREAMLIT_SERVER_ADDRESS=localhost
```

### API Setup

#### Azure Computer Vision:
1. Create Azure Cognitive Services resource
2. Get subscription key and endpoint
3. Update in app.py or set environment variables

#### Bing Spell Check:
1. Create Bing Search resource in Azure
2. Get API key
3. Update in app.py or set environment variables

## 📊 Production Considerations

### Performance Optimization
- Use caching for ML model predictions
- Implement request rate limiting
- Optimize image processing pipeline
- Use CDN for static assets

### Security
- Secure API keys using environment variables
- Implement HTTPS in production
- Add input validation and sanitization
- Use secure headers

### Monitoring
- Set up application logging
- Monitor API usage and costs
- Track user interactions
- Set up health checks

### Scaling
- Use load balancers for multiple instances
- Implement database for user data
- Cache frequently accessed data
- Optimize for concurrent users

## 🔍 Troubleshooting

### Common Issues

#### 1. API Key Errors
```bash
# Check environment variables
echo $AZURE_SUBSCRIPTION_KEY
echo $BING_API_KEY

# Verify API endpoints
curl -H "Ocp-Apim-Subscription-Key: YOUR_KEY" "YOUR_ENDPOINT"
```

#### 2. Dependency Issues
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Check Python version
python --version
```

#### 3. Port Conflicts
```bash
# Use different port
streamlit run app.py --server.port=8502
```

#### 4. Memory Issues
```bash
# Monitor memory usage
htop
# Optimize model loading
# Use model caching
```

### Logs and Debugging
```bash
# Enable debug mode
streamlit run app.py --logger.level=debug

# Check application logs
tail -f ~/.streamlit/logs/streamlit.log
```

## 📱 Mobile Deployment

### Progressive Web App (PWA)
Add to `public/manifest.json`:
```json
{
  "name": "DysLexiCheck",
  "short_name": "DysLexiCheck",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

### React Native (Future)
- Convert React components to React Native
- Implement native audio recording
- Add offline capabilities
- Publish to app stores

## 🔄 CI/CD Pipeline

### GitHub Actions (.github/workflows/deploy.yml):
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: pip install -r requirements.txt
    - name: Run tests
      run: python -m pytest
    - name: Deploy to Streamlit Cloud
      run: echo "Deployment triggered"
```

## 📈 Monitoring and Analytics

### Application Metrics
- User engagement tracking
- Feature usage statistics
- Performance monitoring
- Error tracking

### Tools
- Google Analytics for web tracking
- Sentry for error monitoring
- New Relic for performance
- Custom dashboards for ML metrics

---

For specific deployment questions, please check the [Contributing Guide](CONTRIBUTING.md) or open an issue.