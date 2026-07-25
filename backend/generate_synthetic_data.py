import pandas as pd
import random
import os
from faker import Faker

# Initialize Faker
fake = Faker("en_IN")

# -----------------------------
# Crime Types
# -----------------------------
crime_types = [
    "Theft",
    "Robbery",
    "Assault",
    "Murder",
    "Kidnapping",
    "Cyber Crime",
    "Vehicle Theft",
    "Fraud",
    "Domestic Violence",
    "Drug Offense"
]

# -----------------------------
# Bengaluru Areas with Coordinates
# -----------------------------
areas = {
    "MG Road": (12.9756, 77.6050),
    "Indiranagar": (12.9784, 77.6408),
    "Koramangala": (12.9352, 77.6245),
    "Whitefield": (12.9698, 77.7499),
    "Electronic City": (12.8399, 77.6770),
    "HSR Layout": (12.9116, 77.6474),
    "BTM Layout": (12.9166, 77.6101),
    "Jayanagar": (12.9250, 77.5938),
    "Hebbal": (13.0358, 77.5970),
    "Yelahanka": (13.1007, 77.5963),
    "Rajajinagar": (12.9915, 77.5545),
    "Banashankari": (12.9184, 77.5735),
    "Marathahalli": (12.9591, 77.6974),
    "Bellandur": (12.9279, 77.6762),
    "Malleshwaram": (13.0035, 77.5706)
}

# -----------------------------
# Severity Mapping
# -----------------------------
severity_map = {
    "Theft": "Low",
    "Vehicle Theft": "Low",
    "Fraud": "Medium",
    "Cyber Crime": "Medium",
    "Domestic Violence": "Medium",
    "Drug Offense": "Medium",
    "Assault": "Medium",
    "Robbery": "High",
    "Kidnapping": "High",
    "Murder": "High"
}

# -----------------------------
# Case Status
# -----------------------------
status_list = [
    "Open",
    "Closed",
    "Under Investigation"
]

# -----------------------------
# Victim Gender
# -----------------------------
genders = [
    "Male",
    "Female",
    "Other"
]

# -----------------------------
# Number of Records
# -----------------------------
num_records = random.randint(6000, 7000)

crime_records = []

print("Generating synthetic crime dataset...")
print(f"Total Records to Generate: {num_records}")

# -----------------------------
# Generate Records
# -----------------------------
for i in range(1, num_records + 1):

    crime = random.choice(crime_types)
    area = random.choice(list(areas.keys()))

    base_lat, base_lon = areas[area]

    latitude = round(base_lat + random.uniform(-0.005, 0.005), 6)
    longitude = round(base_lon + random.uniform(-0.005, 0.005), 6)

    random_date = fake.date_between(
        start_date="-2y",
        end_date="today"
    )

    random_time = fake.time()

    record = {
        "FIR_ID": f"FIR{i:05d}",
        "Crime_Type": crime,
        "Area": area,
        "Latitude": latitude,
        "Longitude": longitude,
        "Date": random_date,
        "Time": random_time,
        "Severity": severity_map[crime],
        "Status": random.choice(status_list),
        "Victim_Age": random.randint(18, 70),
        "Victim_Gender": random.choice(genders)
    }

    crime_records.append(record)

# -----------------------------
# Create DataFrame
# -----------------------------
df = pd.DataFrame(crime_records)

# -----------------------------
# Create Output Folder
# -----------------------------
os.makedirs("data/raw", exist_ok=True)

# -----------------------------
# Save CSV
# -----------------------------
output_path = "data/raw/crime_data.csv"

df.to_csv(output_path, index=False)

# -----------------------------
# Display Summary
# -----------------------------
print("\n==========================================")
print(" SafeRouteAI Dataset Generated Successfully")
print("==========================================")
print(f"Total Records : {len(df)}")
print(f"Output File   : {output_path}")
print("==========================================")

print("\nFirst 5 Records:\n")
print(df.head())

print("\nCrime Type Distribution:\n")
print(df["Crime_Type"].value_counts())

print("\nSeverity Distribution:\n")
print(df["Severity"].value_counts())

print("\nCase Status Distribution:\n")
print(df["Status"].value_counts())

print("\nDataset generation completed successfully.")