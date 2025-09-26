@echo off
echo ================================================
echo    DysLexiCheck - Dyslexia Detection System
echo ================================================
echo.
echo 🚀 Starting application...
echo.

:: Change to script directory
cd /d "%~dp0"

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://python.org
    pause
    exit /b 1
)

:: Check if requirements are installed
echo 🔍 Checking dependencies...
pip show streamlit >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo ✅ Dependencies OK
echo 📱 Open your browser and go to: http://localhost:8501
echo ⏹️  Press Ctrl+C in this window to stop the server
echo.

:: Run the application
python run_app.py

echo.
echo 🛑 Application stopped
pause