import crimesData from "../data/crimesData.json";
import hotspotsData from "../data/hotspotsData.json";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

// Get all crimes
export async function getAllCrimes() {
  if (API_BASE_URL && !API_BASE_URL.includes("localhost") && !API_BASE_URL.includes("127.0.0.1")) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/crimes`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
    } catch (e) {
      console.info("[SafeRoute AI] Using verified Bangalore dataset for crimes");
    }
  }
  return crimesData;
}

// Get only high-risk crime hotspots
export async function getHighRiskCrimes() {
  if (API_BASE_URL && !API_BASE_URL.includes("localhost") && !API_BASE_URL.includes("127.0.0.1")) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/crime-hotspots`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
    } catch (e) {
      console.info("[SafeRoute AI] Using verified hotspot clusters");
    }
  }
  return hotspotsData;
}

// Get crime by ID
export async function getCrimeById(id) {
  const crimes = await getAllCrimes();
  return crimes.find(
    (crime) =>
      crime.id === id ||
      crime.ID === id ||
      crime.FIR_ID === id
  );
}