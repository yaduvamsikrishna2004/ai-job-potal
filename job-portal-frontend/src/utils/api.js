// src/utils/api.js
const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

function getToken() {
  // look in a few common places
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token") ||
    null
  );
}

export async function apiFetch(path, opts = {}) {
  const token = getToken();

  const headers = opts.headers ? { ...opts.headers } : {};
  if (token && !headers.Authorization && !headers.authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  let body = null;
  if (contentType.includes("application/json")) {
    body = await res.json();
  } else {
    try {
      body = await res.text();
    } catch {
      body = null;
    }
  }

  if (!res.ok) {
    const err = new Error(body?.error || body?.message || "API error");
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}
