import joblib
import pandas as pd

# Load trained model once
model = joblib.load("models/crime_prediction_model.pkl")

# Convert predicted severity to a numeric risk score
RISK_MAP = {
    0: 1.0,   # High
    2: 0.6,   # Medium
    1: 0.2    # Low
}


def predict_risk(
    crime_type,
    area,
    latitude,
    longitude,
    victim_age,
    victim_gender,
    status,
    day_of_week,
    hour,
):
    """
    Predicts a normalized risk score (0-1).

    Returns:
        float : risk score
    """

    sample = pd.DataFrame([{
        "Crime_Type": crime_type,
        "Area": area,
        "Latitude": latitude,
        "Longitude": longitude,
        "Victim_Age": victim_age,
        "Victim_Gender": victim_gender,
        "Status": status,
        "Day_of_Week": day_of_week,
        "Hour": hour,
    }])

    sample = sample[
        [
            "Crime_Type",
            "Area",
            "Latitude",
            "Longitude",
            "Victim_Age",
            "Victim_Gender",
            "Status",
            "Day_of_Week",
            "Hour",
        ]
    ]

    prediction = model.predict(sample)[0]

    return RISK_MAP[prediction]


if __name__ == "__main__":

    risk = predict_risk(
        crime_type=6,
        area=1,
        latitude=12.97,
        longitude=77.60,
        victim_age=30,
        victim_gender=1,
        status=2,
        day_of_week=4,
        hour=21,
    )

    print(f"Predicted Risk Score: {risk:.2f}")