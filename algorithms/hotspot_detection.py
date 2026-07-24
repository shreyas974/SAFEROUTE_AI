import pandas as pd
from sklearn.cluster import DBSCAN

# Load dataset
df = pd.read_csv("data/raw/crime_data.csv")

# Use latitude and longitude
coordinates = df[["Latitude", "Longitude"]]

# DBSCAN clustering
dbscan = DBSCAN(
    eps=0.005,      # Distance threshold
    min_samples=20  # Minimum crimes to form a hotspot
)

df["Hotspot_ID"] = dbscan.fit_predict(coordinates)

# Remove noise points (-1)
hotspots = df[df["Hotspot_ID"] != -1]

# Summarize hotspots
summary = hotspots.groupby("Hotspot_ID").agg({
    "Latitude": "mean",
    "Longitude": "mean",
    "FIR_ID": "count"
}).reset_index()

summary.rename(columns={
    "FIR_ID": "Crime_Count"
}, inplace=True)

# Assign risk levels
def risk_level(count):
    if count >= 100:
        return "High"
    elif count >= 50:
        return "Medium"
    else:
        return "Low"

summary["Risk"] = summary["Crime_Count"].apply(risk_level)

# Save results
summary.to_csv("data/raw/hotspots.csv", index=False)

print("\nDetected Hotspots:")
print(summary)

print("\nTotal Hotspots:", len(summary))
print("\nSaved as data/raw/hotspots.csv")