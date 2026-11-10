// Security & Anti-Defacement Sanitizer for ROKABA Ecosystem
// Defends against defacement, XSS injections, untrusted external image hosts, and corrupt schemas

import { fallbackData } from '../data/fallback.js';

// Suspicious defacement and attack signatures (handles underscore/symbol separators as well)
const DEFACEMENT_PATTERNS = [
  /(?:^|[^a-z0-9])(hacked|hacker|zell|zell_id|deface|defaced|pwned|owned|010101|01010101|bjorka|anonsec)(?:$|[^a-z0-9])/i,
  /(?:hacked\s*by|by\s*_?\s*zell|zell\s*_?\s*id|israel\s+haram|cyber\s+attack|cyber\s+army|root\s+access|security\s+breach)/i,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<(?:iframe|object|embed|applet|meta|link|style|form)\b/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /data\s*:\s*(?:text\/html|application\/javascript|text\/javascript|application\/x-javascript)/i,
  /on(?:error|load|click|mouseover|mouseenter|focus|blur|submit|change|keyup|keydown)\s*=/i,
];

// Suspicious or defacement image hosting domains
const SUSPICIOUS_IMAGE_DOMAINS = [
  'ibb.co',
  'i.ibb.co',
  'i.ibb.co.com',
  'pastebin.com',
  'anonfiles.com',
  'temp.sh',
  'transfer.sh',
  'catbox.moe',
  'pomf2.lain.la',
  '0x0.st',
  'prnt.sc',
];

/**
 * Scan a single string for malicious or defacement patterns
 * @param {string} str
 * @returns {{ isSafe: boolean, pattern?: string }}
 */
export function checkStringSafety(str) {
  if (typeof str !== 'string' || str.length === 0) return { isSafe: true };

  // Allow valid base64 image data URLs (from legitimate admin photo uploads)
  if (/^data:image\/(?:png|jpeg|jpg|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=\s]+$/i.test(str)) {
    return { isSafe: true };
  }

  for (const pattern of DEFACEMENT_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(str)) {
      return { isSafe: false, pattern: pattern.toString() };
    }
  }

  // Check for suspicious external image domains
  const lower = str.toLowerCase();
  for (const domain of SUSPICIOUS_IMAGE_DOMAINS) {
    if (lower.includes(domain.toLowerCase())) {
      return { isSafe: false, pattern: `Suspicious external domain: ${domain}` };
    }
  }

  return { isSafe: true };
}

/**
 * Recursively scans any value (string, object, array) for defacement signals
 * @param {any} val
 * @returns {{ isSafe: boolean, reason?: string }}
 */
export function scanValueForThreats(val) {
  if (val === null || val === undefined) return { isSafe: true };

  if (typeof val === 'string') {
    const check = checkStringSafety(val);
    if (!check.isSafe) {
      return { isSafe: false, reason: `Threat matched: ${check.pattern}` };
    }
    return { isSafe: true };
  }

  if (Array.isArray(val)) {
    for (let i = 0; i < val.length; i++) {
      const check = scanValueForThreats(val[i]);
      if (!check.isSafe) {
        return { isSafe: false, reason: `Array item [${i}] threat: ${check.reason}` };
      }
    }
    return { isSafe: true };
  }

  if (typeof val === 'object') {
    for (const [k, v] of Object.entries(val)) {
      const keyCheck = checkStringSafety(k);
      if (!keyCheck.isSafe) {
        return { isSafe: false, reason: `Object key "${k}" threat: ${keyCheck.pattern}` };
      }
      const valCheck = scanValueForThreats(v);
      if (!valCheck.isSafe) {
        return { isSafe: false, reason: `Field "${k}" threat: ${valCheck.reason}` };
      }
    }
    return { isSafe: true };
  }

  return { isSafe: true };
}

/**
 * Sanitize plain string (strip script tags, dangerous HTML, and control characters)
 * @param {string} str
 * @returns {string}
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  if (/^data:image\/(?:png|jpeg|jpg|webp|gif|svg\+xml);base64,/i.test(str)) {
    return str;
  }
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<\/?(?:iframe|object|embed|applet|meta|link|style|form)\b[^>]*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/on(?:error|load|click|mouseover|focus|blur)\s*=/gi, '');
}

/**
 * Recursively sanitize all strings in a value
 * @param {any} val
 * @returns {any}
 */
export function deepSanitizeValue(val) {
  if (typeof val === 'string') return sanitizeString(val);
  if (Array.isArray(val)) return val.map(deepSanitizeValue);
  if (val && typeof val === 'object') {
    const out = {};
    const sensitiveFields = ['adminPassword', 'adminPin', 'password', 'secretToken'];
    for (const [k, v] of Object.entries(val)) {
      if (sensitiveFields.includes(k)) continue;
      out[sanitizeString(k)] = deepSanitizeValue(v);
    }
    return out;
  }
  return val;
}

/**
 * Validate schema and structure of incoming data
 * @param {string} key
 * @param {any} data
 * @returns {boolean}
 */
export function validateSchema(key, data) {
  if (data === null || data === undefined) return false;

  const arrayKeys = [
    'rokaba:news',
    'rokaba:articles',
    'rokaba:events',
    'rokaba:schools',
    'rokaba:gallery',
    'rokaba:questions',
    'rokaba:library',
    'rokaba:programs',
    'rokaba:users',
    'rokaba:audit_logs',
  ];

  if (arrayKeys.includes(key)) {
    if (!Array.isArray(data)) return false;

    if (key === 'rokaba:news' && data.length > 0) {
      return data.every(
        (item) =>
          item &&
          typeof item === 'object' &&
          typeof item.title === 'string' &&
          item.title.trim().length > 0
      );
    }

    if (key === 'rokaba:articles' && data.length > 0) {
      return data.every(
        (item) =>
          item &&
          typeof item === 'object' &&
          typeof item.title === 'string' &&
          item.title.trim().length > 0
      );
    }

    if (key === 'rokaba:users' && data.length > 0) {
      return data.every(
        (item) =>
          item &&
          typeof item === 'object' &&
          typeof item.username === 'string' &&
          ['superadmin', 'editor_sekolah', 'admin'].includes(item.role)
      );
    }

    return true;
  }

  if (key === 'rokaba:home') {
    return (
      typeof data === 'object' &&
      !Array.isArray(data) &&
      data.hero &&
      typeof data.hero === 'object'
    );
  }

  const objectKeys = ['rokaba:settings', 'rokaba:team'];
  if (objectKeys.includes(key)) {
    return typeof data === 'object' && !Array.isArray(data);
  }

  return true;
}

/**
 * Central Data Sanitizer & Firewall:
 * Scans, verifies schema, sanitizes strings, and quarantines bad data by falling back to verified fallbackData
 * @param {string} key
 * @param {any} rawData
 * @returns {{ safeData: any, wasQuarantined: boolean, reason?: string }}
 */
export function sanitizeAndProtect(key, rawData) {
  if (!rawData) {
    return {
      safeData: fallbackData[key] || null,
      wasQuarantined: false,
    };
  }

  // 1. Threat & Defacement Scan
  const threatCheck = scanValueForThreats(rawData);
  if (!threatCheck.isSafe) {
    console.error(
      `[SECURITY ALERT] Defacement or attack detected in data key "${key}"! Quarantining content. Reason: ${threatCheck.reason}`
    );
    return {
      safeData: fallbackData[key] || null,
      wasQuarantined: true,
      reason: threatCheck.reason,
    };
  }

  // 2. Schema Integrity Verification
  if (!validateSchema(key, rawData)) {
    console.warn(`[SECURITY WARNING] Schema validation failed for "${key}". Reverting to fallback.`);
    return {
      safeData: fallbackData[key] || null,
      wasQuarantined: true,
      reason: 'Schema validation mismatch',
    };
  }

  // 3. Deep String Sanitization
  return {
    safeData: deepSanitizeValue(rawData),
    wasQuarantined: false,
  };
}
