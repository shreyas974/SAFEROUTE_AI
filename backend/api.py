from utils.logger import logger
from flask import Flask, jsonify
import sqlite3

# ==================================================
# DATABASE CONFIGURATION
#
# Current Database:
#     SQLite (Development)
#
# Future Upgrade:
#     Replace sqlite3 connection with
#     Zoho Catalyst Data Store connection.
# ==================================================

DB_PATH = "data/saferoute.db"

# Create Flask app
app = Flask(__name__)


# Database connection
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# -------------------------
# Health Check API
# -------------------------
@app.route("/health")
def health():

    logger.info("Health API called")

    return jsonify({
        "status": "Server Running"
    })


# -------------------------
# Get All Crimes
# -------------------------
@app.route("/crimes")
def get_crimes():
    logger.info("Fetching all crime records")
    conn = get_db_connection()

    rows = conn.execute(
        "SELECT * FROM crime_data"
    ).fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])


# -------------------------
# High Severity Crimes
# -------------------------
@app.route("/crime-hotspots")
def crime_hotspots():
    logger.info("Fetching high severity crimes")

    conn = get_db_connection()

    rows = conn.execute("""
        SELECT *
        FROM crime_data
        WHERE Severity = 'High'
    """).fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])


# -------------------------
# Crime Statistics by Area
# -------------------------
@app.route("/crime-stats/area")
def crime_stats_area():
    logger.info("Fetching crime statistics by area")

    conn = get_db_connection()

    rows = conn.execute("""
        SELECT Area,
               COUNT(*) AS total_crimes
        FROM crime_data
        GROUP BY Area
        ORDER BY total_crimes DESC
    """).fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])


# -------------------------
# Crime Statistics by Type
# -------------------------
@app.route("/crime-stats/type")
def crime_stats_type():
    logger.info("Fetching crime statistics by type")

    conn = get_db_connection()

    rows = conn.execute("""
        SELECT Crime_Type,
               COUNT(*) AS total
        FROM crime_data
        GROUP BY Crime_Type
        ORDER BY total DESC
    """).fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])


# -------------------------
# Crime Statistics by Severity
# -------------------------
@app.route("/crime-stats/severity")
def crime_stats_severity():
    logger.info("Fetching crime statistics by severity")

    conn = get_db_connection()

    rows = conn.execute("""
        SELECT Severity,
               COUNT(*) AS total
        FROM crime_data
        GROUP BY Severity
    """).fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])


# -------------------------
# Run Flask
# -------------------------
if __name__ == "__main__":
    app.run(debug=True)