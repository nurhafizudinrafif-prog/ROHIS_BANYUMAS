// CloudSync Service - Centralized Upstash Redis REST API & Local Sync Communication
// Implements Resilient Fallback: Cloud → Local Dev API → LocalStorage → Static JS

import { fallbackData } from '../data/fallback.js';

const UPSTASH_URL = import.meta.env.VITE_UPSTASH_REDIS_REST_URL || 'https://holy-gobbler-70550.upstash.io';
const UPSTASH_TOKEN = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAAROWAAIgcDJlOTE0NTNiY2EyYjA0MjU3YmNjNjJkMzc3YmZmYjQ2NA';

const headers = {
  Authorization: `Bearer ${UPSTASH_TOKEN}`,
  'Content-Type': 'application/json',
};

/**
 * Fetch data with Resilient Fallback:
 * Level 1: Upstash Cloud
 * Level 2: Local Dev API (/api/sync)
 * Level 3: LocalStorage
 * Level 4: Static JS Fallback
 */
export async function fetchData(key) {
  // Level 1: Try Upstash Cloud
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const response = await fetch(`${UPSTASH_URL}/get/${key}`, { headers });
      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          const parsed = JSON.parse(data.result);
          try {
            localStorage.setItem(key, JSON.stringify(parsed));
          } catch { /* localStorage might be full */ }
          return parsed;
        }
      }
    } catch (err) {
      console.warn(`[CloudSync] Upstash fetch failed for ${key}:`, err.message);
    }
  }

  // Level 2: Try Local Dev API (/api/sync)
  try {
    const apiRes = await fetch(`/api/sync?key=${encodeURIComponent(key)}`);
    if (apiRes.ok) {
      const json = await apiRes.json();
      if (json && json.result !== null && json.result !== undefined) {
        try {
          localStorage.setItem(key, JSON.stringify(json.result));
        } catch { /* ignore */ }
        return json.result;
      }
    }
  } catch {
    // Dev API not running or network error, proceed to LocalStorage
  }

  // Level 3: Try LocalStorage
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      console.info(`[CloudSync] Using LocalStorage cache for ${key}`);
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn(`[CloudSync] LocalStorage read failed for ${key}:`, err.message);
  }

  // Level 4: Static fallback data
  console.info(`[CloudSync] Using static fallback for ${key}`);
  return fallbackData[key] || null;
}

/**
 * Save data to Upstash Redis & Local Sync
 */
export async function saveData(key, value) {
  try {
    const bc = new BroadcastChannel('rokaba_realtime_sync');
    bc.postMessage({ key, value });
  } catch {}
  const jsonValue = JSON.stringify(value);

  // 1. Update LocalStorage immediately (synchronous, 0ms)
  try {
    localStorage.setItem(key, jsonValue);
  } catch { /* localStorage might be full */ }

  // 2. Dispatch Local Dev API & Upstash Cloud simultaneously in parallel
  const tasks = [];

  // Dev API sync
  tasks.push(
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    }).catch(() => null)
  );

  // Upstash Cloud sync
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    tasks.push(
      fetch(UPSTASH_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(['SET', key, jsonValue]),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return { success: true, source: 'cloud' };
        })
        .catch((err) => {
          console.warn(`[CloudSync] Cloud save warning for ${key}:`, err.message);
          return { success: false, source: 'local', error: err.message };
        })
    );
  }

  const results = await Promise.allSettled(tasks);
  const cloudRes = results.find((r) => r.status === 'fulfilled' && r.value?.source === 'cloud');
  if (cloudRes && cloudRes.value?.success) {
    return { success: true, source: 'cloud' };
  }
  return { success: true, source: 'local' };
}

/**
 * Delete data from Upstash Redis & Local Sync
 */
export async function deleteData(key) {
  // 1. Remove from LocalStorage
  try {
    localStorage.removeItem(key);
  } catch { /* ignore */ }

  // 2. Remove from Local Dev Sync API
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: null }),
    });
  } catch { /* ignore */ }

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return { success: true, source: 'local' };
  }

  try {
    const response = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(['DEL', key]),
    });
    return { success: response.ok, source: 'cloud' };
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

  // Level 1: Try Upstash Cloud (Single-shot MGET for real-time sync across admin & web)
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const response = await fetch(UPSTASH_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(['MGET', ...keys]),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.result && Array.isArray(data.result)) {
          const results = {};
          keys.forEach((key, i) => {
            const raw = data.result[i];
            if (raw) {
              try {
                results[key] = JSON.parse(raw);
              } catch {
                results[key] = raw;
              }
            } else {
              results[key] = fallbackData[key] || null;
            }
            try {
              if (results[key]) localStorage.setItem(key, JSON.stringify(results[key]));
            } catch { /* localStorage might be full */ }
          });
          return results;
        }
      }
    } catch (err) {
      console.warn('[CloudSync] Upstash MGET failed, falling back to local:', err.message);
    }
  }

  // Level 2: Try to load all keys from local dev API in a single shot
  try {
    const apiRes = await fetch('/api/sync');
    if (apiRes.ok) {
      const json = await apiRes.json();
      if (json && json.result && typeof json.result === 'object') {
        const results = {};
        for (const key of keys) {
          results[key] = json.result[key] !== undefined ? json.result[key] : (fallbackData[key] || null);
          try {
            if (results[key]) localStorage.setItem(key, JSON.stringify(results[key]));
          } catch { /* ignore */ }
        }
        return results;
      }
    }
  } catch {
    // proceed to individual fetch
  }

  // Level 3: Individual fallback
  const results = {};
  await Promise.all(
    keys.map(async (key) => {
      results[key] = await fetchData(key);
    })
  );

  return results;
}
