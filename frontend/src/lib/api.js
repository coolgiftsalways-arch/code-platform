// Small fetch helper for the student pages.
// Sends the login token automatically and throws an Error with the
// server's message when the response is not OK (err.status = HTTP code).

export const API_URL = import.meta.env.VITE_API_URL || "";

const TOKEN_KEY = "devnex_token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage blocked (private mode) – the student just has to log in again
  }
}

export async function api(path, { method = "GET", body } = {}) {
  const token = getToken();

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw Object.assign(new Error("Unable to connect to server."), { status: 0 });
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw Object.assign(new Error(data.message || "Something went wrong."), {
      status: response.status,
      data,
    });
  }

  return data;
}
