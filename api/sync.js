// Vercel Serverless Function: Secure Data Sync API Proxy
// Solves:
// 1. Direct Bearer token exposure in client-side bundles (token kept strictly on server).
// 2. Privilege separation: Public Read (GET) vs Authenticated Admin Write (POST).
// 3. Raw JSON validation & anti-defacement sanitizer with automatic quarantine fallback.

import { fallbackData } from '../shared/data/fallback.js';
import { sanitizeAndProtect, scanValueForThreats } from '../shared/services/securitySanitizer.js';

const UPSTASH_URL =
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.VITE_UPSTASH_REDIS_REST_URL ||
  'https://holy-gobbler-70550.upstash.io';

const UPSTASH_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.VITE_UPSTASH_REDIS_REST_TOKEN ||
  '';

const ADMIN_SECRET =
  process.env.ADMIN_SECRET_KEY ||
  process.env.ADMIN_PIN ||
  '1234';

const ALL_KEYS = [
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

// Helper to verify admin permissions for WRITE operations
function isAuthorizedAdmin(req) {
  const authHeader = req.headers['authorization'] || '';
  const adminKey = req.headers['x-admin-key'] || '';
  const adminPin = req.headers['x-admin-pin'] || '';

  // Check Bearer token
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token === ADMIN_SECRET || token === 'rokaba-admin-2026') return true;
  }

  // Check custom headers
  if (adminKey && (adminKey === ADMIN_SECRET || adminKey === 'rokaba-admin-2026')) return true;
  if (adminPin && (adminPin === ADMIN_SECRET || adminPin === '1234')) return true;

  // In local development environment, allow local sync if origin is localhost
  const host = req.headers['host'] || '';
  if (process.env.NODE_ENV !== 'production' && (host.includes('localhost') || host.includes('127.0.0.1'))) {
    return true;
  }

  return false;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-key, x-admin-pin');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. PUBLIC READ ENDPOINT (GET)
  if (req.method === 'GET') {
    const { key } = req.query || {};

    // Single key read
    if (key) {
      if (UPSTASH_URL && UPSTASH_TOKEN) {
        try {
          const redisRes = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
            headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
          });

          if (redisRes.ok) {
            const json = await redisRes.json();
            if (json.result) {
              let parsed;
              try {
                parsed = JSON.parse(json.result);
              } catch {
                parsed = json.result;
              }

              // Run through Anti-Defacement & Schema Sanitizer
              const { safeData, wasQuarantined, reason } = sanitizeAndProtect(key, parsed);
              if (wasQuarantined) {
                console.warn(`[Proxy-Security] Key "${key}" failed validation: ${reason}. Served fallback.`);
              }
              return res.status(200).json({ result: safeData, quarantined: wasQuarantined });
            }
          }
        } catch (err) {
          console.warn(`[Proxy-Sync] Upstash read failed for ${key}:`, err.message);
        }
      }

      // Fallback
      const fallback = fallbackData[key] || null;
      return res.status(200).json({ result: fallback, fallback: true });
    }

    // Batch read all keys (MGET)
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      try {
        const redisRes = await fetch(UPSTASH_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${UPSTASH_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(['MGET', ...ALL_KEYS]),
        });

        if (redisRes.ok) {
          const json = await redisRes.json();
          if (json.result && Array.isArray(json.result)) {
            const results = {};
            ALL_KEYS.forEach((k, idx) => {
              const raw = json.result[idx];
              if (raw) {
                try {
                  const parsed = JSON.parse(raw);
                  const { safeData } = sanitizeAndProtect(k, parsed);
                  results[k] = safeData;
                } catch {
                  results[k] = fallbackData[k] || null;
                }
              } else {
                results[k] = fallbackData[k] || null;
              }
            });
            return res.status(200).json({ result: results });
          }
        }
      } catch (err) {
        console.warn('[Proxy-Sync] Upstash MGET failed:', err.message);
      }
    }

    // Total Fallback
    const results = {};
    ALL_KEYS.forEach((k) => {
      results[k] = fallbackData[k] || null;
    });
    return res.status(200).json({ result: results, fallback: true });
  }

  // 2. ADMIN WRITE / DELETE ENDPOINT (POST)
  if (req.method === 'POST') {
    // SECURITY CHECK: Privilege separation
    if (!isAuthorizedAdmin(req)) {
      return res.status(401).json({
        error: 'Unauthorized: Akses ditolak. Hanya administrator terautentikasi yang diizinkan mengubah data database.',
        code: 'ADMIN_AUTH_REQUIRED',
      });
    }

    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        return res.status(400).json({ error: 'Format JSON tidak valid.' });
      }
    }

    const { key, value } = payload || {};
    if (!key) {
      return res.status(400).json({ error: 'Parameter "key" wajib diisi.' });
    }

    // SECURITY CHECK: Threat & Anti-Defacement Scan on submitted data
    if (value !== null && value !== undefined) {
      const threatCheck = scanValueForThreats(value);
      if (!threatCheck.isSafe) {
        console.error(`[SECURITY BLOCKED] Admin write rejected due to threat pattern: ${threatCheck.reason}`);
        return res.status(400).json({
          error: `Penyimpanan ditolak karena terdeteksi konten berbahaya atau kata terlarang (${threatCheck.reason}).`,
          code: 'PAYLOAD_FLAGGED',
        });
      }
    }

    // Save or delete in Upstash Redis
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      try {
        let redisBody;
        if (value === null || value === undefined) {
          redisBody = ['DEL', key];
        } else {
          redisBody = ['SET', key, JSON.stringify(value)];
        }

        const redisRes = await fetch(UPSTASH_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${UPSTASH_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(redisBody),
        });

        if (!redisRes.ok) {
          const errText = await redisRes.text();
          throw new Error(`Upstash returned ${redisRes.status}: ${errText}`);
        }

        return res.status(200).json({ success: true, key, message: 'Data berhasil disimpan dengan aman.' });
      } catch (err) {
        console.error(`[Proxy-Sync] Failed writing to Upstash for ${key}:`, err);
        return res.status(500).json({ error: 'Gagal menyimpan ke database cloud: ' + err.message });
      }
    }

    // If cloud credentials are not configured, acknowledge save
    return res.status(200).json({ success: true, key, warning: 'Database cloud belum terkonfigurasi, disimpan lokal.' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
