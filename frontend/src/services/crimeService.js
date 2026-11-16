import { api } from "./api";

// The map and the nearby-incidents card both need the full list: fetch it once per page load.
let allCrimes = null;

/** Incidents for the map (the bundled demo set is ~6k rows). */
export function getAllCrimes() {
  allCrimes ??= api("/incidents?limit=10000").then((d) => d.items);
  allCrimes.catch(() => (allCrimes = null)); // let a later call retry after a failure
  return allCrimes;
}

export async function getHighRiskCrimes({ signal } = {}) {
  return (await api("/incidents?severity=High&limit=10000", { signal })).items;
}

export async function getHotspots({ signal } = {}) {
  return api("/hotspots", { signal });
}

export async function getDatasetInfo({ signal } = {}) {
  return (await api("/meta", { signal })).dataset;
}

export async function getAreas({ signal } = {}) {
  return api("/areas", { signal });
}
