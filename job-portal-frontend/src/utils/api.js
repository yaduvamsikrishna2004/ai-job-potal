// src/utils/api.js

// Vite uses import.meta.env, not process.env
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

// Retrieve token from possible storage locations
function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token") ||
    null
  );
}

export async function apiFetch(path, opts = {}) {
  const token = getToken();

  // Merge headers safely
  const headers = {
    ...(opts.headers || {}),
  };

  // Add Authorization header only if missing
  if (token && !headers.Authorization && !headers.authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Build final request
  const response = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
  });

  // Try reading JSON if possible
  let body;
  const type = response.headers.get("content-type") || "";

  if (type.includes("application/json")) {
    body = await response.json();
  } else {
    // fallback to text
    try {
      body = await response.text();
    } catch {
      body = null;
    }
  }

  // Standardized error handling
  if (!response.ok) {
    const error = new Error(body?.error || body?.message || "API error");
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}
