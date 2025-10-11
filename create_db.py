"""Create dyslexia_db database"""
import mysql.connector

print("Creating database...")

try:
    # Connect without database
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password=''  # XAMPP default
    )
    cursor = conn.cursor()
    
    # Create database
    cursor.execute("CREATE DATABASE IF NOT EXISTS dyslexia_db")
    print("Database 'dyslexia_db' created!")
    
    # Use database
    cursor.execute("USE dyslexia_db")
    
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
    print("Table 'users' created!")
    
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
    print("Table 'test_results' created!")
    
    conn.commit()
    print("\nSetup complete!")
    print("Open http://localhost/phpmyadmin to verify")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if conn:
        cursor.close()
        conn.close()
