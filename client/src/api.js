// src/api.js
const API_BASE = 'http://localhost:4000/api';

async function rawFetch(path, opts = {}) {
  return fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
}

async function parseSafe(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

// Main exported function
export async function api(path, opts = {}) {
  // normalize path leading slash
  const p = path.startsWith('/') ? path : `/${path}`;
  let res = await rawFetch(p, opts);

  // If unauthorized and not auth endpoints, try refresh then retry once
  if (res.status === 401 && !['/auth/login', '/auth/register', '/auth/refresh'].includes(p)) {
    const refreshResp = await rawFetch('/auth/refresh', { method: 'POST' });
    if (refreshResp.ok) {
      res = await rawFetch(p, opts);
    } else {
      // return refresh failure
      return { status: refreshResp.status, body: await parseSafe(refreshResp) };
    }
  }

  return { status: res.status, body: await parseSafe(res) };
}
