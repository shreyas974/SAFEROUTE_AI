import os
import joblib
import pandas as pd
from sklearn.preprocessing import LabelEncoder

# -----------------------------
# Create Required Directories
# -----------------------------
os.makedirs("data/processed", exist_ok=True)
os.makedirs("models/encoders", exist_ok=True)

# -----------------------------
# Load Dataset
# -----------------------------
df = pd.read_csv("data/raw/crime_data.csv")

print("Original Dataset Shape:", df.shape)

# -----------------------------
# Handle Missing Values
# -----------------------------
df.dropna(inplace=True)

# -----------------------------
# Convert Date to Datetime
# -----------------------------
df["Date"] = pd.to_datetime(df["Date"], errors="coerce")

# Extract Day of Week
df["Day_of_Week"] = df["Date"].dt.day_name()

# -----------------------------
# Convert Time to Datetime
# -----------------------------
df["Time"] = pd.to_datetime(
    df["Time"],
    format="%H:%M:%S",
    errors="coerce"
)

# Extract Hour
df["Hour"] = df["Time"].dt.hour

# Remove rows with invalid Date/Time
df.dropna(subset=["Date", "Time"], inplace=True)

# -----------------------------
# Encode Categorical Columns
# -----------------------------
categorical_columns = [
    "Crime_Type",
    "Area",
    "Victim_Gender",
    "Status",
    "Day_of_Week",
    "Severity"
]

encoders = {}

for column in categorical_columns:
    encoder = LabelEncoder()

    df[column] = encoder.fit_transform(df[column])

    encoders[column] = encoder

    joblib.dump(
        encoder,
        f"models/encoders/{column.lower()}_encoder.joblib"
    )

    print(f"\n{column} Encoding:")
    mapping = dict(zip(encoder.classes_, encoder.transform(encoder.classes_)))
    print(mapping)

# -----------------------------
# Save Processed Dataset
# -----------------------------
output_path = "data/processed/crime_data_processed.csv"

df.to_csv(output_path, index=False)

print("\n========================================")
print("Preprocessing Completed Successfully!")
print("========================================")
print("Processed Dataset Shape:", df.shape)
print(f"Saved processed dataset to: {output_path}")

print("\nFirst 5 Rows:")
print(df.head())