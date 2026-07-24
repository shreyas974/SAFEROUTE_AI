import sqlite3

DB_PATH = "data/saferoute.db"


def get_area_risk(area, hour):
    """
    Returns recent crime statistics for an area.
    Later, this data can be passed to the ML model.
    """

    # Validate area
    if not area or area.strip() == "":
        return {
            "success": False,
            "error": "Invalid area name."
        }

    # Validate hour
    if not isinstance(hour, int) or hour < 0 or hour > 23:
        return {
            "success": False,
            "error": "Hour must be between 0 and 23."
        }

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Check if database has any records
        cursor.execute("SELECT COUNT(*) FROM crime_data")
        total = cursor.fetchone()[0]

        if total == 0:
            conn.close()
            return {
                "success": False,
                "error": "No crime data available."
            }

        # Check if area exists
        cursor.execute(
            "SELECT COUNT(*) FROM crime_data WHERE Area = ?",
            (area,)
        )

        count = cursor.fetchone()[0]

        if count == 0:
            conn.close()
            return {
                "success": False,
                "error": "Area not found."
            }

        # Fetch recent crime records
        cursor.execute("""
            SELECT Crime_Type,
                   Severity,
                   Status,
                   Date,
                   Time
            FROM crime_data
            WHERE Area = ?
            ORDER BY Date DESC
            LIMIT 20
        """, (area,))

        crimes = cursor.fetchall()

        conn.close()

        # Placeholder for ML model
        # prediction = predict_risk(crimes, hour)

        return {
            "success": True,
            "area": area,
            "hour": hour,
            "crime_records": crimes,
            "message": "Crime data fetched successfully. Ready for ML prediction."
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


# Test
if __name__ == "__main__":
    result = get_area_risk("Indiranagar", 18)
    print(result)