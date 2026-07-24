import pandas as pd
from geopy.distance import geodesic

# Load hotspot data
hotspots = pd.read_csv("data/raw/hotspots.csv")

print("===== SafeRoute AI =====")

# User input
source_lat = float(input("Enter Source Latitude: "))
source_lon = float(input("Enter Source Longitude: "))

dest_lat = float(input("Enter Destination Latitude: "))
dest_lon = float(input("Enter Destination Longitude: "))

source = (source_lat, source_lon)
destination = (dest_lat, dest_lon)

nearest_distance = float("inf")
nearest_hotspot = None

# Find the nearest hotspot
for _, row in hotspots.iterrows():
    hotspot = (row["Latitude"], row["Longitude"])

    source_distance = geodesic(source, hotspot).km
    destination_distance = geodesic(destination, hotspot).km

    distance = min(source_distance, destination_distance)

    if distance < nearest_distance:
        nearest_distance = distance
        nearest_hotspot = row

print("\n===== Route Analysis =====")
print(f"Nearest Hotspot: {int(nearest_hotspot['Hotspot_ID'])}")
print(f"Risk Level: {nearest_hotspot['Risk']}")
print(f"Distance to Hotspot: {nearest_distance:.2f} km")

# Route recommendation
if nearest_distance < 1:
    print("\n⚠️ HIGH RISK")
    print("Recommended: Choose another route.")
elif nearest_distance < 3:
    print("\n⚠️ MODERATE RISK")
    print("Travel carefully.")
else:
    print("\n✅ SAFE ROUTE")
    print("No nearby hotspot detected.")