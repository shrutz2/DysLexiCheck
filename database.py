import sqlite3
import json
from datetime import datetime

class DyslexiaDB:
    def __init__(self, db_path="dyslexia_results.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the database with required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER,
                grade_level TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Test results table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS test_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                test_type TEXT NOT NULL,
                features TEXT,
                prediction_score REAL,
                has_dyslexia BOOLEAN,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_user(self, name, age, grade_level):
        """Add a new user and return user ID"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO users (name, age, grade_level)
            VALUES (?, ?, ?)
        ''', (name, age, grade_level))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return user_id
    
    def save_test_result(self, user_id, test_type, features, prediction_score):
        """Save test result to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        features_json = json.dumps(features)
        has_dyslexia = prediction_score > 0.5
        
        cursor.execute('''
            INSERT INTO test_results (user_id, test_type, features, prediction_score, has_dyslexia)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, test_type, features_json, prediction_score, has_dyslexia))
        
        conn.commit()
        conn.close()
    
    def get_user_results(self, user_id):
        """Get all test results for a user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM test_results WHERE user_id = ?
            ORDER BY created_at DESC
        ''', (user_id,))
        
        results = cursor.fetchall()
        conn.close()
        
        return results