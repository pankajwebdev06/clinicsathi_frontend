const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// Render free tier can sleep — first request after idle takes 30+ seconds.
// 45s timeout gives the backend room to wake up before we give up.
const DEFAULT_TIMEOUT_MS = 45_000;

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  // Get token from local storage
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("auth_token");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // AbortController for timeout (covers cold-start backends)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    // Network-level failures (DNS, CORS, mixed content, offline, aborted, etc.)
    if (err.name === "AbortError") {
      throw new NetworkError(
        "Server is taking too long to respond. The backend may be starting up — please try again in a few seconds."
      );
    }
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new NetworkError("You're offline. Reconnect to the internet and try again.");
    }
    // "Failed to fetch" / TypeError — backend unreachable, CORS blocked, or mixed content
    throw new NetworkError(
      `Cannot reach the server. Check your connection or contact support. (${BASE_URL})`
    );
  }
  clearTimeout(timeoutId);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
