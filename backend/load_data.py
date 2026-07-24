import sqlite3
import pandas as pd

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
CSV_PATH = "data/raw/crime_data.csv"


def load_csv_to_database():
    # Read crime data from CSV
    df = pd.read_csv(CSV_PATH)

    # Connect to SQLite database
    conn = sqlite3.connect(DB_PATH)

    # Create/Replace the crime_data table
    df.to_sql(
        "crime_data",
        conn,
        if_exists="replace",
        index=False
    )

    conn.commit()

    # Verify number of inserted records
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM crime_data")

    count = cursor.fetchone()[0]

    print(f"Successfully inserted {count} records.")

    conn.close()


if __name__ == "__main__":
    load_csv_to_database()