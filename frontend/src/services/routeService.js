import { api } from "./api";

/**
 * Ask the server for the fastest and the lower-risk route between two points.
 * Both are computed on the real OpenStreetMap road graph and measured the same way, so the
 * comparison is never invented here. safetyWeight: 0 = fastest only, 10 = avoid risk strongly.
 */
export async function getSafeRoute(source, destination, hour = 21, safetyWeight = 3) {
  const [slat, slon] = source;
  const [dlat, dlon] = destination;
  return api("/route", {
    method: "POST",
    body: { source: { lat: slat, lon: slon }, destination: { lat: dlat, lon: dlon }, hour, safety_weight: safetyWeight },
    timeoutMs: 60000,
  });
}
