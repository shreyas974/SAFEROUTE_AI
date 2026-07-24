import sqlite3
import pandas as pd

DB_PATH = "data/saferoute.db"
CSV_PATH = "data/raw/crime_data.csv"

def load_csv_to_database():

    df = pd.read_csv(CSV_PATH)

    conn = sqlite3.connect(DB_PATH)

    df.to_sql(
        "crime_data",
        conn,
        if_exists="replace",
        index=False
    )

    conn.commit()

    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM crime_data")

    count = cursor.fetchone()[0]

    print(f"Successfully inserted {count} records.")

    conn.close()

if __name__ == "__main__":
    load_csv_to_database()