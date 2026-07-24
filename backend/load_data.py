import joblib
import pandas as pd

model = joblib.load("models/crime_prediction_model.pkl")

sample = pd.DataFrame([{
    "Crime_Type": 6,
    "Area": 1,
    "Latitude": 12.97,
    "Longitude": 77.60,
    "Victim_Age": 35,
    "Victim_Gender": 1,
    "Status": 2,
    "Day_of_Week": 4,
    "Hour": 21
}])

prediction = model.predict(sample)
print(prediction)