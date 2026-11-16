// One client for the SafeRoute API. Every number the UI shows comes from here; nothing is
// substituted from bundled data when the server is unreachable: the UI shows the error instead.
const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "") + "/api/v1";

export class ApiError extends Error {
  constructor(message, status = 0, field = null) {
    super(message);
    this.status = status;
    this.field = field;
  }
}

export async function api(path, { method = "GET", body, timeoutMs = 20000, signal } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  signal?.addEventListener("abort", () => controller.abort());
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (e) {
    throw new ApiError(e.name === "AbortError" ? "The server took too long to answer. Try again." : "Can't reach the SafeRoute server. Check that it is running.");
  } finally {
    clearTimeout(timer);
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON error page */
  }
  if (!res.ok) throw new ApiError(data?.error ?? `Request failed (HTTP ${res.status})`, res.status, data?.field ?? null);
  return data;
}
