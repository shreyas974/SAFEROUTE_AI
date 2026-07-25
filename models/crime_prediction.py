import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Load dataset
df = pd.read_csv("data/raw/crime_data.csv")

# Remove missing values
df = df.dropna()

# Convert Date to datetime and extract Day_of_Week
df["Date"] = pd.to_datetime(df["Date"])
df["Day_of_Week"] = df["Date"].dt.day_name()

# Extract Hour from Time
df["Hour"] = pd.to_datetime(df["Time"], format="%H:%M:%S").dt.hour

# Encode categorical columns
encoders = {}

categorical_columns = [
    "Crime_Type",
    "Area",
    "Victim_Gender",
    "Status",
    "Day_of_Week"
]

for col in categorical_columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# Encode target
severity_encoder = LabelEncoder()
df["Severity"] = severity_encoder.fit_transform(df["Severity"])

# Features
X = df[
    [
        "Latitude",
        "Longitude",
        "Crime_Type",
        "Area",
        "Hour",
        "Day_of_Week",
        "Victim_Age",
        "Victim_Gender",
        "Status"
    ]
]

# Target
y = df["Severity"]

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train Model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Evaluate
accuracy = accuracy_score(y_test, y_pred)

print(f"\nAccuracy: {accuracy * 100:.2f}%\n")
print(classification_report(y_test, y_pred))

# Save model
joblib.dump(model, "models/crime_prediction_model.pkl")

print("Model saved as models/crime_prediction_model.pkl")