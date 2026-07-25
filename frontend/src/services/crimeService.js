const API_BASE_URL = "http://127.0.0.1:5000";

// Get all crimes
export async function getAllCrimes() {
  const response = await fetch(`${API_BASE_URL}/crimes`);

  if (!response.ok) {
    throw new Error("Failed to fetch crimes");
  }

  return await response.json();
}

// Get only high-risk crimes
export async function getHighRiskCrimes() {
  const response = await fetch(`${API_BASE_URL}/crime-hotspots`);

  if (!response.ok) {
    throw new Error("Failed to fetch crime hotspots");
  }

  return await response.json();
}

// Get crime by ID
export async function getCrimeById(id) {
  const crimes = await getAllCrimes();

  return crimes.find(
    (crime) =>
      crime.id === id ||
      crime.ID === id
  );
}