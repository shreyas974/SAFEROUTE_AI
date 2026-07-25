from dotenv import load_dotenv
import os
load_dotenv()

from utils.logger import logger
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from backend.database import get_connection, create_users_table
from backend.route_engine import find_safe_route

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
CORS(app)  # Enable CORS for React frontend

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-fallback-key-not-for-production")


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
# Safe Route API
# -------------------------
@app.route("/route", methods=["POST"])
def route():

    logger.info("Safe route requested")

    data = request.get_json()

    source = (
        data["source_lat"],
        data["source_lon"]
    )

    destination = (
        data["destination_lat"],
        data["destination_lon"]
    )

    hour = data.get("hour", 21)

    result = find_safe_route(
        source=source,
        destination=destination,
        hour=hour
    )

    return jsonify(result)



# -------------------------
# Signup
# -------------------------
@app.route("/auth/signup", methods=["POST"])
def signup():

    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "name, email and password are required"}), 400

    password_hash = generate_password_hash(password)

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (name, email, password_hash)
        )
        conn.commit()
        user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "Email already registered"}), 409

    conn.close()

    token = jwt.encode(
        {
            "user_id": user_id,
            "email": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
        },
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({
        "token": token,
        "user": {"id": user_id, "name": name, "email": email}
    }), 201


# -------------------------
# Login
# -------------------------
@app.route("/auth/login", methods=["POST"])
def login():

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    conn = get_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = jwt.encode(
        {
            "user_id": user["id"],
            "email": user["email"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
        },
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({
        "token": token,
        "user": {"id": user["id"], "name": user["name"], "email": user["email"]}
    }), 200


# -------------------------
# Run Flask
# -------------------------
if __name__ == "__main__":
    app.run(debug=True)