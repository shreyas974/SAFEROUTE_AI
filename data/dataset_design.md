# Crime Dataset Design

## Dataset Name
crime_data.csv

## Total Records
Generate **1,000–3,000** synthetic crime cases.

## Columns

| Column | Data Type | Example |
|---------|-----------|---------|
| FIR_ID | String | FIR00001 |
| Crime_Type | String | Theft |
| Area | String | Koramangala |
| Latitude | Float | 12.9352 |
| Longitude | Float | 77.6245 |
| Date | Date | 2026-07-20 |
| Time | Time | 18:45 |
| Severity | String | High |
| Status | String | Open |
| Victim_Age | Integer | 32 |
| Victim_Gender | String | Male |

## Crime Types
- Theft
- Robbery
- Assault
- Murder
- Kidnapping
- Cyber Crime
- Vehicle Theft
- Fraud
- Domestic Violence
- Drug Offense

## Areas
- MG Road
- Indiranagar
- Koramangala
- Whitefield
- Electronic City
- HSR Layout
- BTM Layout
- Jayanagar
- Hebbal
- Yelahanka
- Rajajinagar
- Banashankari
- Marathahalli
- Bellandur
- Malleshwaram

## Severity Levels
- Low
- Medium
- High

## Case Status
- Open
- Closed
- Under Investigation

## Victim Gender
- Male
- Female
- Other

## Data Generation Rules
- Generate **1,000–3,000** crime records.
- Every FIR_ID must be unique (FIR00001, FIR00002, ...).
- Randomly assign a crime type and area.
- Generate latitude and longitude within Bengaluru.
- Generate a random date from the last 2 years.
- Generate a random time between 00:00 and 23:59.
- Assign severity based on the crime type.
- Assign a random case status.
- Generate a victim age between 18 and 70.
- Assign a random victim gender.

## Sample Record

| FIR_ID | Crime_Type | Area | Latitude | Longitude | Date | Time | Severity | Status | Victim_Age | Victim_Gender |
|--------|------------|------|----------|-----------|------|------|----------|--------|-------------|----------------|
| FIR00001 | Theft | Koramangala | 12.9352 | 77.6245 | 2026-07-20 | 18:45 | Low | Open | 32 | Male |