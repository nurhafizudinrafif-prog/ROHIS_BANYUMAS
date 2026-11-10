// CloudSync Service - Secure Centralized Data Communication with Defense-in-Depth Sanitization
// Solves:
// 1. Eliminates direct Upstash Bearer token exposure in public client bundle.
// 2. Enforces separation between Public Read (/api/sync GET) and Authenticated Write (/api/sync POST).
// 3. Validates and sanitizes all incoming & outgoing payloads to completely prevent defacement rendering.

import { fallbackData } from '../data/fallback.js';
import { sanitizeAndProtect, scanValueForThreats } from './securitySanitizer.js';

// Resolve the correct API endpoint across public site, admin domain, and local dev
function getSyncEndpoint(query = '') {
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname;
    // If running on the separate Vercel admin domain, route API calls to the main backend
    if (host.includes('rohis-banyumasadminid.vercel.app')) {
      return `https://www.rohis-banyumas.web.id/api/sync${query}`;
    }
  }
  return `/api/sync${query}`;
}

// Get admin authentication headers dynamically from active login session (no hardcoded secrets in bundle)
function getAdminAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const sessionToken = window.sessionStorage.getItem('rokaba_admin_token');
      if (sessionToken) {
        headers['Authorization'] = `Bearer ${sessionToken}`;
      }
    }
  } catch { /* ignore */ }
  return headers;
}

function isJsonResponse(res) {
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json');
}

/**
 * Fetch data with Resilient Secure Fallback:
 * Level 1: Secure Backend Proxy (/api/sync?key=...)
 * Level 2: LocalStorage (sanitized & verified)
 * Level 3: Verified Static JS Fallback
 */
export async function fetchData(key) {
  // Level 1: Secure Proxy (/api/sync)
  try {
    const apiRes = await fetch(getSyncEndpoint(`?key=${encodeURIComponent(key)}`));
    if (apiRes.ok && isJsonResponse(apiRes)) {
      const json = await apiRes.json();
      if (json && json.result !== null && json.result !== undefined) {
        const { safeData, wasQuarantined } = sanitizeAndProtect(key, json.result);
        if (wasQuarantined) {
          console.warn(`[CloudSync] Data for ${key} quarantined by client firewall. Using verified fallback.`);
        }
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(safeData));
          }
        } catch { /* localStorage might be full */ }
        return safeData;
      }
    }
  } catch {
    // Network / offline, proceed to LocalStorage
  }

  // Level 2: LocalStorage (verified & auto-purged if poisoned)
  try {
    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        const { safeData, wasQuarantined } = sanitizeAndProtect(key, parsed);
        if (wasQuarantined) {
          localStorage.setItem(key, JSON.stringify(safeData));
        }
        return safeData;
      }
    }
  } catch (err) {
    console.warn(`[CloudSync] LocalStorage read failed for ${key}:`, err.message);
  }

  // Level 3: Verified static fallback data
  return fallbackData[key] || null;
}

/**
 * Save data to Backend Proxy (/api/sync) & Local Sync
 * Requires authenticated Administrator session token
 */
export async function saveData(key, value) {
  // Pre-save security scan
  const threatCheck = scanValueForThreats(value);
  if (!threatCheck.isSafe) {
    console.error(`[CloudSync Security] Save blocked! Threat detected: ${threatCheck.reason}`);
    return { success: false, error: `Konten ditolak karena mengandung pola terlarang: ${threatCheck.reason}` };
  }

  const { safeData, wasQuarantined, reason } = sanitizeAndProtect(key, value);
  if (wasQuarantined) {
    return { success: false, error: `Skema atau isi data tidak valid: ${reason}` };
  }

  try {
    const bc = new BroadcastChannel('rokaba_realtime_sync');
    bc.postMessage({ key, value: safeData });
  } catch {}

  const jsonValue = JSON.stringify(safeData);

  // 1. Update LocalStorage immediately for instant optimistic UI
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, jsonValue);
    }
  } catch { /* localStorage might be full */ }

  // 2. Dispatch to Secure Backend Proxy with Admin Authorization
  try {
    const headers = getAdminAuthHeaders();
    const response = await fetch(getSyncEndpoint(), {
      method: 'POST',
      headers,
      body: JSON.stringify({ key, value: safeData }),
    });

    if (response.ok && isJsonResponse(response)) {
      return { success: true, source: 'cloud' };
    }

    if (response.status === 401 || response.status === 403) {
      console.warn(`[CloudSync] Write unauthorized for ${key}. Admin login required.`);
      return { success: false, source: 'local', error: 'Sesi admin tidak valid atau belum terautentikasi.' };
    }

    const errJson = isJsonResponse(response) ? await response.json().catch(() => ({})) : {};
    return { success: false, source: 'local', error: errJson.error || `HTTP ${response.status}` };
  } catch (err) {
    console.warn(`[CloudSync] Cloud save warning for ${key}:`, err.message);
    return { success: true, source: 'local' };
  }
}

/**
 * Delete data via Secure Backend Proxy (/api/sync)
 * Requires authenticated Administrator session token
 */
export async function deleteData(key) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch { /* ignore */ }

  try {
    const headers = getAdminAuthHeaders();
    const response = await fetch(getSyncEndpoint(), {
      method: 'POST',
      headers,
      body: JSON.stringify({ key, value: null }),
    });

    return { success: response.ok, source: response.ok ? 'cloud' : 'local' };
  } catch (err) {
    console.error(`[CloudSync] Delete failed for ${key}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all ROKABA data keys at once
 */
export async function fetchAllData() {
  const keys = [
    'rokaba:home',
    'rokaba:news',
    'rokaba:articles',
    'rokaba:events',
    'rokaba:schools',
    'rokaba:gallery',
    'rokaba:questions',
    'rokaba:library',
    'rokaba:users',
    'rokaba:audit_logs',
    'rokaba:team',
    'rokaba:programs',
    'rokaba:settings',
  ];

  // Level 1: Try Secure Backend Proxy (/api/sync)
  try {
    const apiRes = await fetch(getSyncEndpoint());
    if (apiRes.ok && isJsonResponse(apiRes)) {
      const json = await apiRes.json();
      if (json && json.result && typeof json.result === 'object') {
        const results = {};
        for (const key of keys) {
          const raw = json.result[key] !== undefined && json.result[key] !== null
            ? json.result[key]
            : (fallbackData[key] || null);
          const { safeData } = sanitizeAndProtect(key, raw);
          results[key] = safeData;
          try {
            if (typeof localStorage !== 'undefined' && results[key]) {
              localStorage.setItem(key, JSON.stringify(results[key]));
            }
          } catch { /* ignore */ }
        }
        return results;
      }
    }
  } catch (err) {
    console.warn('[CloudSync] /api/sync batch fetch failed, falling back:', err.message);
  }

  // Level 2: Individual fallback with sanitization
  const results = {};
  await Promise.all(
    keys.map(async (key) => {
      results[key] = await fetchData(key);
    })
  );

  return results;
}
