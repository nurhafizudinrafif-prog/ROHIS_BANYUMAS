// CloudSync Service - Centralized Upstash Redis REST API & Local Sync Communication
// Implements Resilient Fallback: Cloud → Local Dev API → LocalStorage → Static JS

import { fallbackData } from '../data/fallback.js';

const UPSTASH_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_UPSTASH_REDIS_REST_URL) || 'https://holy-gobbler-70550.upstash.io';
const UPSTASH_TOKEN = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_UPSTASH_REDIS_REST_TOKEN) || 'gQAAAAAAAROWAAIgcDJlOTE0NTNiY2EyYjA0MjU3YmNjNjJkMzc3YmZmYjQ2NA';

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
          let parsed = data.result;
          while (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch { break; }
          }
          try {
            localStorage.setItem(key, JSON.stringify(parsed));
          } catch { /* localStorage might be full */ }
          return parsed;
        }
      }

      // If fetching home and rokaba:home is empty, check rohis_cms_data
      if (key === 'rokaba:home') {
        const cmsRes = await fetch(`${UPSTASH_URL}/get/rohis_cms_data`, { headers });
        if (cmsRes.ok) {
          const cmsData = await cmsRes.json();
          if (cmsData.result) {
            let cmsParsed = cmsData.result;
            while (typeof cmsParsed === 'string') {
              try { cmsParsed = JSON.parse(cmsParsed); } catch { break; }
            }
            if (cmsParsed && cmsParsed.homeContent) {
              try { localStorage.setItem(key, JSON.stringify(cmsParsed.homeContent)); } catch {}
              return cmsParsed.homeContent;
            }
          }
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

  // 1. Update LocalStorage immediately
  try {
    localStorage.setItem(key, jsonValue);
  } catch { /* localStorage might be full */ }

  // 2. Push to Local Dev Sync API (/api/sync)
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
  } catch {
    // Dev API might be offline
  }

  // 3. Push to Upstash Cloud (if configured)
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    console.info('[CloudSync] Saved locally. Upstash credentials not set.');
    return { success: true, source: 'local' };
  }

  try {
    const response = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(['SET', key, jsonValue]),
    });

    if (response.ok) {
      if (key === 'rokaba:home') {
        try {
          const getRes = await fetch(`${UPSTASH_URL}/get/rohis_cms_data`, { headers });
          let existing = {};
          if (getRes.ok) {
            const getJson = await getRes.json();
            if (getJson.result) {
              let p = getJson.result;
              while (typeof p === 'string') {
                try { p = JSON.parse(p); } catch { break; }
              }
              if (p && typeof p === 'object') existing = p;
            }
          }
          existing.homeContent = value;
          existing.updatedAt = new Date().toISOString();
          await fetch(UPSTASH_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(['SET', 'rohis_cms_data', JSON.stringify(existing)]),
          });
        } catch (e) {
          console.warn('[CloudSync] Mirror to rohis_cms_data warning:', e);
        }
      }
      return { success: true, source: 'cloud' };
    }
    throw new Error(`HTTP ${response.status}`);
  } catch (err) {
    console.error(`[CloudSync] Save failed for ${key}:`, err.message);
    return { success: false, source: 'local', error: err.message };
  }
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
  ];

  // Try single-shot MGET on Upstash Redis REST
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const allQueryKeys = [...keys, 'rohis_cms_data'];
      const response = await fetch(UPSTASH_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(['MGET', ...allQueryKeys]),
      });

      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json.result)) {
          const results = {};
          keys.forEach((key, idx) => {
            let val = json.result[idx];
            if (val) {
              while (typeof val === 'string') {
                try { val = JSON.parse(val); } catch { break; }
              }
              results[key] = val;
              try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
            }
          });

          // Extract rohis_cms_data from the last item
          let cmsData = json.result[keys.length];
          if (cmsData) {
            while (typeof cmsData === 'string') {
              try { cmsData = JSON.parse(cmsData); } catch { break; }
            }
          }

          // If individual rokaba:* key was missing or empty, take from rohis_cms_data
          if (cmsData && typeof cmsData === 'object') {
            if (!results['rokaba:home'] && cmsData.homeContent) results['rokaba:home'] = cmsData.homeContent;
            if ((!results['rokaba:articles'] || results['rokaba:articles'].length === 0) && cmsData.articles) results['rokaba:articles'] = cmsData.articles;
            if ((!results['rokaba:events'] || results['rokaba:events'].length === 0) && cmsData.events) results['rokaba:events'] = cmsData.events;
            if ((!results['rokaba:schools'] || results['rokaba:schools'].length === 0) && cmsData.memberSchools) results['rokaba:schools'] = cmsData.memberSchools;
            if ((!results['rokaba:gallery'] || results['rokaba:gallery'].length === 0) && cmsData.galleryItems) results['rokaba:gallery'] = cmsData.galleryItems;
            if (!results['rokaba:team'] && cmsData.team) results['rokaba:team'] = cmsData.team;
            if (!results['rokaba:programs'] && cmsData.programs) results['rokaba:programs'] = cmsData.programs;
          }

          // Fallback to static data for anything still missing
          keys.forEach(k => {
            if (results[k] === undefined || results[k] === null) {
              results[k] = fallbackData[k] || null;
            }
          });

          return results;
        }
      }
    } catch (err) {
      console.warn('[CloudSync] MGET query failed, falling back to individual fetch:', err.message);
    }
  }

  // Level 2: Try Local Dev API (/api/sync)
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

  // Level 3 & 4: Individual fetch with local storage and static fallback
  const results = {};
  await Promise.all(
    keys.map(async (key) => {
      results[key] = await fetchData(key);
    })
  );

  return results;
}
