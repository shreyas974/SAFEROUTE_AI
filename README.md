# 🚦 SafeRouteAI

## 📌 Project Overview

**SafeRouteAI** is an AI-powered crime analytics and safe navigation system developed for a hackathon. The project analyzes crime data to identify high-risk locations, predicts crime severity using machine learning, and provides route safety analysis to help users make safer travel decisions.

---

## ✨ Features

* 📊 Synthetic crime dataset generation
* 📍 Crime hotspot detection using DBSCAN clustering
* 🛣️ Safe route risk analysis based on hotspot proximity
* 🤖 Crime severity prediction using Random Forest
* 🌐 Backend API integration (planned)
* 💻 Interactive Streamlit frontend (planned)

---

## 🛠️ Technologies Used

* Python 3
* Pandas
* NumPy
* Scikit-learn
* DBSCAN Clustering
* Random Forest Classifier
* Geopy
* Git & GitHub

---

## 📂 Project Structure

```text
SAFEROUTE_AI/
│
├── algorithms/
│   ├── hotspot_detection.py
│   └── safe_route.py
│
├── backend/
│   └── generate_synthetic_data.py
│
├── data/
│   ├── raw/
│   │   ├── crime_data.csv
│   │   └── hotspots.csv
│   └── processed/
│       └── crime_data_processed.csv
│
├── frontend/
│
├── maps/
│
├── models/
│   ├── preprocess.py
│   ├── eda.py
│   ├── crime_prediction.py
│   └── crime_prediction_model.pkl
│
├── utils/
├── app.py
├── requirements.txt
└── README.md
```

---

# ⚙️ AI Workflow

```text
Synthetic Crime Dataset
          │
          ▼
Crime Data Preprocessing
          │
          ▼
DBSCAN Hotspot Detection
          │
          ▼
Hotspot Identification
          │
          ▼
Safe Route Analysis
          │
          ▼
Crime Severity Prediction
```

---

# 📊 AI Module Outputs

## 1. crime_data.csv

**Location**

```text
data/raw/crime_data.csv
```

Contains synthetic crime records including:

* FIR ID
* Crime Type
* Area
* Latitude
* Longitude
* Date
* Time
* Severity
* Status
* Victim Age
* Victim Gender

Purpose:

* Dataset used for hotspot detection and machine learning.

---

## 2. hotspots.csv

**Location**

```text
data/raw/hotspots.csv
```

Generated using the DBSCAN clustering algorithm.

Contains:

* Hotspot ID
* Latitude
* Longitude
* Crime Count
* Risk Level

Purpose:

* Identifies high-crime areas.
* Used by the Safe Route module for route risk assessment.

---

## 3. crime_prediction_model.pkl

**Location**

```text
models/crime_prediction_model.pkl
```

Machine Learning Model:

* Algorithm: Random Forest Classifier

Input Features:

* Latitude
* Longitude
* Crime Type
* Area
* Hour
* Day of Week
* Victim Age
* Victim Gender
* Status

Prediction:

* Crime Severity (Low / Medium / High)

Purpose:

* Predicts the severity of crime incidents based on historical patterns.

---

# ▶️ How to Run

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Generate synthetic dataset

```bash
python backend/generate_synthetic_data.py
```

### 3. Detect crime hotspots

```bash
python algorithms/hotspot_detection.py
```

### 4. Run safe route analysis

```bash
python algorithms/safe_route.py
```

### 5. Train the crime prediction model

```bash
python models/crime_prediction.py
```

---

# 📈 Machine Learning Models

| Module            | Algorithm     |
| ----------------- | ------------- |
| Hotspot Detection | DBSCAN        |
| Crime Prediction  | Random Forest |

---

# 🚀 Future Enhancements

* Integration with Google Maps/OpenStreetMap for real route planning.
* Live crime data integration through APIs.
* Real-time crime alerts and notifications.
* Time-based crime prediction.
* Interactive heatmaps and dashboards.
* Mobile application support.

---

# 👥 Team Members

* **Member 1:** AI & Machine Learning
* **Member 2:** Backend Development
* **Member 3:** Frontend Development

---

# 📄 License

This project was developed for educational and hackathon purposes.
