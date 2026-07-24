import sqlite3

DATABASE = "data/saferoute.db"

def test_database_connection():
    """Test if database connection can be established."""
    try:
        conn = sqlite3.connect(DATABASE)
        print("✅ Database connection successful.")
        conn.close()
    except Exception as e:
        print("❌ Database connection failed:", e)


def test_table_exists():
    """Test if crime_data table exists."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT name
        FROM sqlite_master
        WHERE type='table' AND name='crime_data';
    """)

    table = cursor.fetchone()

    if table:
        print("✅ crime_data table exists.")
    else:
        print("❌ crime_data table does not exist.")

    conn.close()


def test_record_count():
    """Test total records in database."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM crime_data;")
    count = cursor.fetchone()[0]

    print(f"✅ Total Records: {count}")

    conn.close()


def test_sample_query():
    """Display first 5 records."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT FIR_ID, Crime_Type, Area
        FROM crime_data
        LIMIT 5;
    """)

    rows = cursor.fetchall()

    print("\n✅ Sample Records:")
    for row in rows:
        print(row)

    conn.close()


if __name__ == "__main__":
    print("Running Database Utility Tests...\n")

    test_database_connection()
    test_table_exists()
    test_record_count()
    test_sample_query()

    print("\n🎉 All tests completed.")