from utils.logger import logger
import sqlite3
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


def get_safe_route(source, destination):
    """
    Returns route information.
    Later, this will call the routing algorithm.
    """

    # Validate inputs
    if not source or not destination:
        return {
            "success": False,
            "error": "Source and destination are required."
        }

    if source == destination:
    
        return {
            "success": False,
            "error": "Source and destination cannot be the same."
        }

    try:
        conn = sqlite3.connect(DB_PATH)
        logger.info("Connected to SQLite database")
        cursor = conn.cursor()

        # Check source exists
        cursor.execute(
            "SELECT COUNT(*) FROM crime_data WHERE Area=?",
            (source,)
        )

        if cursor.fetchone()[0] == 0:
            conn.close()
            return {
                "success": False,
                "error": "Invalid source area."
            }

        # Check destination exists
        cursor.execute(
            "SELECT COUNT(*) FROM crime_data WHERE Area=?",
            (destination,)
        )

        if cursor.fetchone()[0] == 0:
            conn.close()
            return {
                "success": False,
                "error": "Invalid destination area."
            }

        conn.close()

        # Placeholder for routing algorithm
        # route = risk_router(source, destination)
        logger.info(f"Route requested from {source} to {destination}")

        return {
            "success": True,
            "source": source,
            "destination": destination,
            "coordinates": [],
            "distance": 0,
            "risk_score": 0,
            "message": "Ready for routing algorithm integration."
        }

    except Exception as e:
        logger.error(str(e))
        return {
            "success": False,
            "error": str(e)
        }


if __name__ == "__main__":
    result = get_safe_route(
        "Indiranagar",
        "Koramangala"
    )

    logger.info("Route service test completed successfully.")
    logger.info(result)