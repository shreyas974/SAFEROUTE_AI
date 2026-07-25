import pandas as pd
import matplotlib.pyplot as plt

# Load dataset
df = pd.read_csv("data/raw/crime_data.csv")

print("=" * 50)
print("Crime Dataset Information")
print("=" * 50)
print(df.info())

print("\nFirst 5 Records:")
print(df.head())

print("\nDataset Shape:")
print(df.shape)

print("\nMissing Values:")
print(df.isnull().sum())

print("\nStatistical Summary:")
print(df.describe(include="all"))

# -----------------------------
# Crime Type Distribution
# -----------------------------
plt.figure(figsize=(8, 5))
df["Crime_Type"].value_counts().plot(kind="bar")
plt.title("Crime Type Distribution")
plt.xlabel("Crime Type")
plt.ylabel("Count")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig("crime_type_distribution.png")
plt.show()

# -----------------------------
# Severity Distribution
# -----------------------------
plt.figure(figsize=(6, 4))
df["Severity"].value_counts().plot(kind="bar")
plt.title("Crime Severity Distribution")
plt.xlabel("Severity")
plt.ylabel("Count")
plt.tight_layout()
plt.savefig("severity_distribution.png")
plt.show()

# -----------------------------
# Crimes by Area
# -----------------------------
plt.figure(figsize=(8, 5))
df["Area"].value_counts().plot(kind="bar")
plt.title("Crimes by Area")
plt.xlabel("Area")
plt.ylabel("Number of Crimes")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig("area_distribution.png")
plt.show()

# -----------------------------
# Victim Gender Distribution
# -----------------------------
plt.figure(figsize=(5, 5))
df["Victim_Gender"].value_counts().plot(kind="pie", autopct="%1.1f%%")
plt.title("Victim Gender Distribution")
plt.ylabel("")
plt.tight_layout()
plt.savefig("victim_gender_distribution.png")
plt.show()

print("\nEDA Completed Successfully!")
print("Charts saved:")
print("- crime_type_distribution.png")
print("- severity_distribution.png")
print("- area_distribution.png")
print("- victim_gender_distribution.png")