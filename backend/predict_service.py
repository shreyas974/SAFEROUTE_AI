import joblib
import pandas as pd

model = joblib.load("models/crime_prediction_model.pkl")

severity_map = {
    0: "High",
    1: "Low",
    2: "Medium"
}

def predict_severity(data):
    df = pd.DataFrame([data])

    prediction = model.predict(df)[0]

    return {
        "severity": severity_map.get(int(prediction), "Unknown")
    }