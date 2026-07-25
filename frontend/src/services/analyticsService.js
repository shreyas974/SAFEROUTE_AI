const API_BASE_URL = "http://127.0.0.1:5000";

export async function getAreaStats() {
  const response = await fetch(`${API_BASE_URL}/crime-stats/area`);
  if (!response.ok) throw new Error("Failed to fetch area stats");
  return response.json();
}

export async function getTypeStats() {
  const response = await fetch(`${API_BASE_URL}/crime-stats/type`);
  if (!response.ok) throw new Error("Failed to fetch type stats");
  return response.json();
}

export async function getSeverityStats() {
  const response = await fetch(`${API_BASE_URL}/crime-stats/severity`);
  if (!response.ok) throw new Error("Failed to fetch severity stats");
  return response.json();
}
