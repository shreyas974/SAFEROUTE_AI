import joblib
import pandas as pd

# Load trained model
model = joblib.load("models/crime_prediction_model.pkl")

# Create sample input
sample = pd.DataFrame([
    {
        "Crime_Type": 6,
        "Area": 1,
        "Latitude": 12.97,
        "Longitude": 77.60,
        "Victim_Age": 30,
        "Victim_Gender": 1,
        "Status": 2,
        "Day_of_Week": 4,
        "Hour": 21,
    }
])

# Keep the same feature order used during training
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

prediction = model.predict(sample)

severity_map = {
    0: "High",
    1: "Low",
    2: "Medium",
}

print("Predicted Severity:", severity_map.get(prediction[0], prediction[0]))