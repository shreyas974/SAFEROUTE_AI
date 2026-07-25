import sqlite3
import os

# ==================================================
# DATABASE CONFIGURATION
#
# Current Database:
#     SQLite (Development)
#
# Future Upgrade:
#     Replace sqlite3 connection with
#     Zoho Catalyst Data Store.
#     Only the connection logic needs to change.
# ==================================================

DB_PATH = "data/saferoute.db"

def get_connection():
    os.makedirs("data", exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    return conn

def create_table():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS crime_data (
        id INTEGER PRIMARY KEY,
        latitude REAL,
        longitude REAL,
        crime_type TEXT,
        severity INTEGER,
        time_of_day TEXT,
        location TEXT
    )
    """)
    conn.commit()
    conn.close()

def create_users_table():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_table()
    create_users_table()
    print("Database and table created successfully.")
