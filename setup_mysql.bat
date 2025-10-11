@echo off
echo ========================================
echo MySQL Setup for DysLexiCheck
echo ========================================
echo.

echo Step 1: Installing Python MySQL connector...
pip install mysql-connector-python
echo.

echo Step 2: Checking MySQL connection...
python -c "from backend.database import get_connection; conn = get_connection(); print('✓ MySQL Connected!' if conn else '✗ MySQL Not Running')"
echo.

echo Step 3: Initializing database...
python -c "from backend.database import init_database; init_database()"
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Make sure XAMPP MySQL is running
echo 2. Update password in backend/database.py if needed
echo 3. Run: python backend/backend.py
echo.
pause
