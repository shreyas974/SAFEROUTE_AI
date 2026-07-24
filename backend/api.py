import joblib
import pandas as pd
from flask import request


from flask import Flask, jsonify
import sqlite3

# Create Flask app
app = Flask(__name__)

# Database path
DB_PATH = "data/saferoute.db"
# Load ML Model
model = joblib.load("models/crime_prediction_model.pkl")
encoder = joblib.load("models/feature_encoder.pkl")
target_encoder = joblib.load("models/target_encoder.pkl")

# Database connection
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# Health Check API
@app.route("/health")
def health():
    return jsonify({
        "status": "Server Running"
    })


# Get All Crimes
@app.route("/crimes")
def get_crimes():
    conn = get_db_connection()

    rows = conn.execute("SELECT * FROM crime_data").fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])


# Get High Severity Crimes
@app.route("/crime-hotspots")
def crime_hotspots():
    conn = get_db_connection()

    rows = conn.execute(
        "SELECT * FROM crime_data WHERE severity='High'"
    ).fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])

@app.route("/predict-risk", methods=["POST"])
def predict_risk():

    data = request.get_json()

    sample = pd.DataFrame([{
        "Crime_Type": data["Crime_Type"],
        "Area": data["Area"],
        "Severity": data["Severity"],
        "Victim_Age": data["Victim_Age"],
        "Victim_Gender": data["Victim_Gender"]
    }])

    categorical_columns = [
        "Crime_Type",
        "Area",
        "Severity",
        "Victim_Gender"
    ]

    sample[categorical_columns] = encoder.transform(sample[categorical_columns])

    prediction = model.predict(sample)

    result = target_encoder.inverse_transform(prediction)

    return jsonify({
        "prediction": result[0]
    })


# Run Flask
if __name__ == "__main__":
    app.run(debug=True)