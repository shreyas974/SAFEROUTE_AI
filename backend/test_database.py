import sqlite3

conn = sqlite3.connect("data/saferoute.db")
cursor = conn.cursor()

cursor.execute("SELECT COUNT(*) FROM crime_data")
count = cursor.fetchone()[0]
print(f"Total Records: {count}")

print("\nFirst 5 Records:\n")

cursor.execute("SELECT * FROM crime_data LIMIT 5")
rows = cursor.fetchall()

for row in rows:
    print(row)

conn.close()