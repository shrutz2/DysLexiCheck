# MySQL Database Setup Guide

## Prerequisites

1. **Install MySQL Server**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP which includes MySQL

2. **Install MySQL Python Connector**
   ```bash
   pip install mysql-connector-python
   ```

## Database Configuration

### Step 1: Start MySQL Server

**Windows (XAMPP):**
```bash
# Start XAMPP Control Panel
# Click "Start" for MySQL
```

**Windows (Standalone MySQL):**
```bash
# MySQL runs as Windows service
net start MySQL80
```

**Linux/Mac:**
```bash
sudo systemctl start mysql
# or
sudo service mysql start
```

### Step 2: Create Database

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE dyslexia_db;
USE dyslexia_db;
```

**Option B: Using phpMyAdmin**
1. Open http://localhost/phpmyadmin
2. Click "New" to create database
3. Name it `dyslexia_db`
4. Click "Create"

### Step 3: Configure Database Credentials

Edit `backend/database.py` and update:

```python
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',           # Your MySQL username
    'password': 'your_password',  # Your MySQL password
    'database': 'dyslexia_db'
}
```

### Step 4: Initialize Database Tables

The tables will be created automatically when you run the backend:

```bash
cd backend
python backend.py
```

Or manually initialize:
```python
from database import init_database
init_database()
```

## Database Schema

### Table: `users`
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    age INT,
    grade VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `test_results`
```sql
CREATE TABLE test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    test_type ENUM('handwriting', 'pronunciation', 'dictation'),
    score FLOAT,
    prediction VARCHAR(100),
    confidence FLOAT,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Endpoints

### Create User
```bash
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "age": 10,
  "grade": "5th"
}
```

### Get User History
```bash
GET /api/users/{user_id}/history
```

### Get All Results (Admin)
```bash
GET /api/results
```

### Get Statistics
```bash
GET /api/stats
```

### Save Test Results

Test results are automatically saved when you include `user_id` in requests:

**Handwriting Test:**
```bash
POST /api/analyze-image
Form Data:
  - file: [image file]
  - user_id: 1
```

**Pronunciation Test:**
```bash
POST /api/predict-pronunciation-dyslexia
Content-Type: application/json

{
  "results": [...],
  "user_id": 1
}
```

**Dictation Test:**
```bash
POST /api/check-dictation
Content-Type: application/json

{
  "words": [...],
  "user_input": [...],
  "user_id": 1
}
```

## Testing Database Connection

Create a test file `test_db.py`:

```python
from backend.database import get_connection, init_database, create_user

# Test connection
conn = get_connection()
if conn:
    print("✓ Database connection successful!")
    conn.close()
else:
    print("✗ Database connection failed!")

# Initialize database
if init_database():
    print("✓ Database initialized!")

# Create test user
user_id = create_user("Test User", 10, "5th")
if user_id:
    print(f"✓ Test user created with ID: {user_id}")
```

Run:
```bash
python test_db.py
```

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
- Check MySQL username and password in `database.py`
- Reset MySQL root password if needed

### Error: "Can't connect to MySQL server"
- Ensure MySQL service is running
- Check if port 3306 is open
- Verify host is 'localhost' or '127.0.0.1'

### Error: "Unknown database 'dyslexia_db'"
- Create database manually: `CREATE DATABASE dyslexia_db;`
- Or run `init_database()` function

### Error: "Table doesn't exist"
- Run `init_database()` to create tables
- Check MySQL user has CREATE TABLE permissions

## Docker Setup with MySQL

Update `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: dyslexia_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  app:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mysql
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: rootpassword
      DB_NAME: dyslexia_db

volumes:
  mysql_data:
```

## Backup and Restore

### Backup Database
```bash
mysqldump -u root -p dyslexia_db > backup.sql
```

### Restore Database
```bash
mysql -u root -p dyslexia_db < backup.sql
```

## Security Best Practices

1. **Never commit passwords** to Git
2. Use **environment variables** for credentials:
   ```python
   import os
   DB_CONFIG = {
       'host': os.getenv('DB_HOST', 'localhost'),
       'user': os.getenv('DB_USER', 'root'),
       'password': os.getenv('DB_PASSWORD', ''),
       'database': os.getenv('DB_NAME', 'dyslexia_db')
   }
   ```

3. Create **separate MySQL user** for the app:
   ```sql
   CREATE USER 'dyslexia_app'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON dyslexia_db.* TO 'dyslexia_app'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. Use **SSL connections** in production

## Production Deployment

For production, consider:
- **AWS RDS** for managed MySQL
- **Google Cloud SQL**
- **Azure Database for MySQL**
- **DigitalOcean Managed Databases**

Update `database.py` with production credentials and enable SSL.
