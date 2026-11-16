// Saved routes for people without an account: kept in this browser only.
const KEY = "saferoute_saved_routes_device";

export function getDeviceRoutes() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveDeviceRoute(route) {
  const record = { ...route, id: `route_${Date.now()}`, savedAt: new Date().toISOString() };
  const next = [record, ...getDeviceRoutes()].slice(0, 50);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    throw new Error("This browser is not allowing local storage.");
  }
  return record;
}
