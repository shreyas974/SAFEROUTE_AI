import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Load processed dataset
df = pd.read_csv("data/processed/crime_data_processed.csv")

# -------------------------
# Create Time Bucket
# -------------------------
def get_time_bucket(hour):
    if 0 <= hour < 6:
        return "Night"
    elif 6 <= hour < 12:
        return "Morning"
    elif 12 <= hour < 18:
        return "Afternoon"
    else:
        return "Evening"

df["Time_Bucket"] = df["Hour"].apply(get_time_bucket)

# -------------------------
# Convert severity to gravity
# -------------------------
# Your processed dataset uses:
# 0 = High
# 1 = Low
# 2 = Medium

gravity_map = {
    0: 3,   # High
    2: 2,   # Medium
    1: 1    # Low
}

df["Gravity"] = df["Severity"].map(gravity_map)

# -------------------------
# Aggregate per Area + Time Bucket
# -------------------------
risk_df = (
    df.groupby(["Area", "Time_Bucket"])
      .agg(
          Crime_Count=("FIR_ID", "count"),
          Avg_Gravity=("Gravity", "mean")
      )
      .reset_index()
)

print(risk_df.head())

# -------------------------
# Normalize Crime Count
# -------------------------
risk_df["Crime_Count_Norm"] = (
    risk_df["Crime_Count"] / risk_df["Crime_Count"].max()
)

# -------------------------
# Normalize Gravity
# -------------------------
risk_df["Gravity_Norm"] = (
    risk_df["Avg_Gravity"] / 3.0
)

# -------------------------
# Final Risk Score (0–1)
# -------------------------
risk_df["Risk_Score"] = (
    0.6 * risk_df["Crime_Count_Norm"] +
    0.4 * risk_df["Gravity_Norm"]
)

print("\nRisk Dataset:")
print(risk_df.head())

from sklearn.preprocessing import LabelEncoder

area_encoder = LabelEncoder()
bucket_encoder = LabelEncoder()

risk_df["Area"] = area_encoder.fit_transform(risk_df["Area"])
risk_df["Time_Bucket"] = bucket_encoder.fit_transform(risk_df["Time_Bucket"])

X = risk_df[["Area", "Time_Bucket"]]
y = risk_df["Risk_Score"]

print("\nFeatures:")
print(X.head())

print("\nTarget:")
print(y.head())

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

# -------------------------
# Split the dataset
# -------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# -------------------------
# Train the model
# -------------------------
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# -------------------------
# Predict
# -------------------------
y_pred = model.predict(X_test)

# -------------------------
# Evaluate
# -------------------------
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\n========== Model Evaluation ==========")
print(f"MAE : {mae:.4f}")
print(f"R²  : {r2:.4f}")

# -------------------------
# Save model and encoders
# -------------------------
joblib.dump(model, "models/risk_model.joblib")
joblib.dump(area_encoder, "models/area_encoder.joblib")
joblib.dump(bucket_encoder, "models/time_bucket_encoder.joblib")

print("\n✅ Model saved:")
print("models/risk_model.joblib")
print("models/area_encoder.joblib")
print("models/time_bucket_encoder.joblib")