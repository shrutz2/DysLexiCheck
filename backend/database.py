import mysql.connector
from mysql.connector import Error
from datetime import datetime
import json

# MySQL Configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # Empty for XAMPP, change if you set a password
    'database': 'dyslexia_db'
}

def get_connection():
    """Create database connection"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        print(f"Database connection error: {e}")
        return None

def init_database():
    """Initialize database and create tables"""
    try:
        # Connect without database first
        conn = mysql.connector.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password']
        )
        cursor = conn.cursor()
        
        # Create database if not exists
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']}")
        cursor.execute(f"USE {DB_CONFIG['database']}")
        
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                age INT,
                grade VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create test_results table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS test_results (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                test_type ENUM('handwriting', 'pronunciation', 'dictation'),
                score FLOAT,
                prediction VARCHAR(100),
                confidence FLOAT,
                details JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        
        conn.commit()
        print("Database initialized successfully!")
        return True
        
    except Error as e:
        print(f"Database initialization error: {e}")
        return False
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def save_test_result(user_id, test_type, score, prediction, confidence, details):
    """Save test result to database"""
    conn = get_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO test_results (user_id, test_type, score, prediction, confidence, details)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (user_id, test_type, score, prediction, confidence, json.dumps(details)))
        conn.commit()
        return cursor.lastrowid
    except Error as e:
        print(f"Error saving test result: {e}")
        return None
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_user_by_name(name):
    """Get user by name for login"""
    conn = get_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM users WHERE name = %s ORDER BY created_at DESC LIMIT 1"
        cursor.execute(query, (name,))
        user = cursor.fetchone()
        return user
    except Error as e:
        print(f"Error fetching user by name: {e}")
        return None
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_user_history(user_id):
    """Get all test results for a user"""
    conn = get_connection()
    if not conn:
        return []
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT * FROM test_results 
            WHERE user_id = %s 
            ORDER BY created_at DESC
        """
        cursor.execute(query, (user_id,))
        results = cursor.fetchall()
        
        # Parse JSON details
        for result in results:
            if result['details']:
                result['details'] = json.loads(result['details'])
        
        return results
    except Error as e:
        print(f"Error fetching user history: {e}")
        return []
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def create_user(name, age, grade):
    """Create new user"""
    conn = get_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor()
        query = "INSERT INTO users (name, age, grade) VALUES (%s, %s, %s)"
        cursor.execute(query, (name, age, grade))
        conn.commit()
        return cursor.lastrowid
    except Error as e:
        print(f"Error creating user: {e}")
        return None
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_all_results():
    """Get all test results (for admin/analytics)"""
    conn = get_connection()
    if not conn:
        return []
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT tr.*, u.name, u.age, u.grade 
            FROM test_results tr
            JOIN users u ON tr.user_id = u.id
            ORDER BY tr.created_at DESC
        """
        cursor.execute(query)
        results = cursor.fetchall()
        
        for result in results:
            if result['details']:
                result['details'] = json.loads(result['details'])
        
        return results
    except Error as e:
        print(f"Error fetching all results: {e}")
        return []
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
