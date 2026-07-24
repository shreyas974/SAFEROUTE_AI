import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Load dataset
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
label_encoder = LabelEncoder()

categorical_columns = [
    "Crime_Type",
    "Area",
    "Victim_Gender",
    "Status",
    "Day_of_Week",
    "Severity"
]

for column in categorical_columns:
    df[column] = label_encoder.fit_transform(df[column])

# -----------------------------
# Save Processed Dataset
# -----------------------------
output_path = "data/processed/crime_data_processed.csv"

df.to_csv(output_path, index=False)

print("\nPreprocessing Completed Successfully!")
print("Processed Dataset Shape:", df.shape)
print(f"Saved processed dataset to: {output_path}")
print("\nFirst 5 Rows:")
print(df.head())