import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "@/api/auth-tokens";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${getAccessToken()}`,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Try to refresh the token
    const refreshResponse = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: getRefreshToken() }),
    });

    if (!refreshResponse.ok) {
      throw new Error("refresh_failed");
    }

    const { access } = await refreshResponse.json();
    setAccessToken(access);

    // Retry the original request with new token
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  }

  return response;
}
