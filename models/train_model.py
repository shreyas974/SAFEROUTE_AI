import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Load processed dataset
df = pd.read_csv("data/processed/crime_data_processed.csv")

# Features and target
X = df[
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

y = df["Severity"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# Save model
joblib.dump(model, "models/crime_prediction_model.pkl")

print("Model trained successfully.")
print("Saved as models/crime_prediction_model.pkl")