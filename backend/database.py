import sqlite3
import os

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

if __name__ == "__main__":
    create_table()
    print("Database and table created successfully.")










import sqlite3

conn = sqlite3.connect("data/saferoute.db")
cursor = conn.cursor()

# Total records
cursor.execute("SELECT COUNT(*) FROM crime_data")
count = cursor.fetchone()[0]
print(f"Total Records: {count}")

# Display first 5 rows
print("\nFirst 5 Records:\n")

cursor.execute("SELECT * FROM crime_data LIMIT 5")
rows = cursor.fetchall()

for row in rows:
    print(row)

conn.close()
