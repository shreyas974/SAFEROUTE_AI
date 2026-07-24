import joblib
import pandas as pd

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split

# Load processed data
df = pd.read_csv("data/processed/crime_data_processed.csv")

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

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Load trained model
model = joblib.load("models/crime_prediction_model.pkl")

# Predict
y_pred = model.predict(X_test)

print(f"\nAccuracy: {accuracy_score(y_test, y_pred)*100:.2f}%\n")

print("Classification Report")
print(classification_report(y_test, y_pred))

print("Confusion Matrix")
print(confusion_matrix(y_test, y_pred))