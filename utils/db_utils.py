import sqlite3

DB_PATH = "backend/saferoute.db"


def get_connection():
    """Create and return a database connection."""
    return sqlite3.connect(DB_PATH)


def get_all_crimes():
    """Return all crime records."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM crime_data")
    records = cursor.fetchall()

    conn.close()
    return records


def get_crime_by_area(area):
    """Return crimes for a specific area."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM crime_data WHERE area = ?",
        (area,)
    )

    records = cursor.fetchall()
    conn.close()
    return records


def get_crime_by_type(crime_type):
    """Return crimes of a specific type."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM crime_data WHERE crime_type = ?",
        (crime_type,)
    )

    records = cursor.fetchall()
    conn.close()
    return records


def get_high_risk_crimes():
    """Return all high-risk crimes."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM crime_data WHERE severity = 'High'"
    )

    records = cursor.fetchall()
    conn.close()
    return records


def get_crime_count():
    """Return total number of crime records."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM crime_data")
    count = cursor.fetchone()[0]

    conn.close()
    return count