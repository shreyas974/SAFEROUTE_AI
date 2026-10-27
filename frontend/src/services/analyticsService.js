import areaStats from "../data/areaStats.json";
import typeStats from "../data/typeStats.json";
import severityStats from "../data/severityStats.json";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export async function getAreaStats() {
  if (API_BASE_URL && !API_BASE_URL.includes("localhost") && !API_BASE_URL.includes("127.0.0.1")) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/crime-stats/area`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
    } catch (e) {}
  }
  return areaStats;
}

export async function getTypeStats() {
  if (API_BASE_URL && !API_BASE_URL.includes("localhost") && !API_BASE_URL.includes("127.0.0.1")) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/crime-stats/type`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
    } catch (e) {}
  }
  return typeStats;
}

export async function getSeverityStats() {
  if (API_BASE_URL && !API_BASE_URL.includes("localhost") && !API_BASE_URL.includes("127.0.0.1")) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/crime-stats/severity`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
    } catch (e) {}
  }
  return severityStats;
}
