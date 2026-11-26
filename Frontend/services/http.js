import { API_URL } from './config';

let token = null;
let onUnauthorized = null;
const TIMEOUT_MS = 20000;

export const setToken = (t) => { token = t; };
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

// Every request: JSON in/out, Bearer token, timeout, readable errors.
export async function request(method, path, { query, body, form } = {}) {
  let url = API_URL.replace(/\/$/, '') + path;
  if (query) {
    const q = Object.entries(query)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    if (q) url += '?' + q;
  }

  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form; // multipart: let fetch set the boundary
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(url, { method, headers, body: payload, signal: ctrl.signal });
  } catch (e) {
    throw new Error(e.name === 'AbortError' ? 'Request timed out. Please try again.' : 'Cannot reach the server. Check your connection.');
  } finally {
    clearTimeout(timer);
  }

  let data = null;
  try { data = await res.json(); } catch (e) { /* empty body */ }

  // Expired/invalid token while logged in -> send the user back to login
  if (res.status === 401 && token && onUnauthorized) onUnauthorized();
  if (!res.ok) throw new Error((data && data.message) || `Request failed (${res.status})`);
  return data;
}
