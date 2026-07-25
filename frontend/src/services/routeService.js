const API_BASE_URL = "http://127.0.0.1:5000";

export async function getSafeRoute(source, destination, hour = 21) {
  const response = await fetch(`${API_BASE_URL}/route`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source_lat: source[0],
      source_lon: source[1],
      destination_lat: destination[0],
      destination_lon: destination[1],
      hour,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch route");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}
