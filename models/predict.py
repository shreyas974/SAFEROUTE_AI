import joblib
import pandas as pd

# -----------------------------
# Load Model and Encoders
# -----------------------------
model = joblib.load("models/risk_model.joblib")

area_encoder = joblib.load("models/encoders/area_encoder.joblib")
time_encoder = joblib.load("models/time_bucket_encoder.joblib")


# -----------------------------
# Convert Hour to Time Bucket
# -----------------------------
def get_time_bucket(hour):
    if 0 <= hour < 6:
        return "Night"
    elif 6 <= hour < 12:
        return "Morning"
    elif 12 <= hour < 18:
        return "Afternoon"
    elif 18 <= hour <= 23:
        return "Evening"
    else:
        raise ValueError("Hour must be between 0 and 23")


# -----------------------------
# Predict Risk
# -----------------------------
def predict_risk(area_name, hour):
    """
    Predict risk score (0-1) for an area at a given hour.
    """

    bucket = get_time_bucket(hour)

    try:
        area = area_encoder.transform([area_name])[0]
    except ValueError:
        raise ValueError(f"Unknown area: {area_name}")

    try:
        bucket = time_encoder.transform([bucket])[0]
    except ValueError:
        raise ValueError(f"Unknown time bucket: {bucket}")

    sample = pd.DataFrame({
        "Area": [area],
        "Time_Bucket": [bucket]
    })

    risk = float(model.predict(sample)[0])

    # Clamp prediction between 0 and 1
    risk = max(0.0, min(1.0, risk))

    return risk


# -----------------------------
# Example
# -----------------------------
if __name__ == "__main__":

    area = "Koramangala"
    hour = 22

    risk = predict_risk(area, hour)

    print(f"Area : {area}")
    print(f"Hour : {hour}")
    print(f"Risk : {risk:.3f}")