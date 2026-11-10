// Security & Anti-Defacement Sanitizer for ROKABA Ecosystem
// Defends against defacement, XSS injections, untrusted external image hosts, and corrupt schemas

import { fallbackData } from '../data/fallback.js';

// Suspicious defacement and attack signatures
const DEFACEMENT_PATTERNS = [
  /\b(hacked|hacked\s+by|hacker|zell_?id|zell|deface|defaced|pwned|owned|010101)\b/i,
  /\b(israel\s+haram|cyber\s+attack|cyber\s+army|root\s+access|security\s+breach)\b/i,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/i,
  /data:text\/html/i,
  /on(?:error|load|click|mouseover|focus|blur)\s*=/i,
  /base64\s*,/i,
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
];

/**
 * Scan a single string for malicious or defacement patterns
 * @param {string} str
 * @returns {{ isSafe: boolean, pattern?: string }}
 */
export function checkStringSafety(str) {
  if (typeof str !== 'string') return { isSafe: true };

  for (const pattern of DEFACEMENT_PATTERNS) {
    if (pattern.test(str)) {
      return { isSafe: false, pattern: pattern.toString() };
    }
  }

  // Check for suspicious external image domains
  for (const domain of SUSPICIOUS_IMAGE_DOMAINS) {
    if (str.toLowerCase().includes(domain.toLowerCase())) {
      return { isSafe: false, pattern: `Suspicious image domain: ${domain}` };
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
      // Check keys
      const keyCheck = checkStringSafety(k);
      if (!keyCheck.isSafe) {
        return { isSafe: false, reason: `Object key "${k}" threat: ${keyCheck.pattern}` };
      }
      // Check values
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
 * Sanitize plain string (strip script tags and HTML control characters)
 * @param {string} str
 * @returns {string}
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Validate schema and structure of incoming data
 * @param {string} key
 * @param {any} data
 * @returns {boolean}
 */
export function validateSchema(key, data) {
  if (data === null || data === undefined) return false;

  // Expected array keys
  const arrayKeys = [
    'rokaba:news',
    'rokaba:articles',
    'rokaba:events',
    'rokaba:schools',
    'rokaba:gallery',
    'rokaba:questions',
    'rokaba:library',
    'rokaba:programs',
  ];

  if (arrayKeys.includes(key)) {
    if (!Array.isArray(data)) return false;
    // If news, must have valid items with title & date or slug
    if (key === 'rokaba:news' && data.length > 0) {
      const valid = data.every(
        (item) => item && typeof item === 'object' && (item.title || item.slug)
      );
      if (!valid) return false;
    }
    return true;
  }

  // Expected object keys
  const objectKeys = ['rokaba:home', 'rokaba:settings', 'rokaba:team'];
  if (objectKeys.includes(key)) {
    return typeof data === 'object' && !Array.isArray(data);
  }

  return true;
}

/**
 * Central Data Sanitizer & Firewall:
 * Scans, verifies schema, and quarantines bad data by falling back to verified fallbackData
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

  return {
    safeData: rawData,
    wasQuarantined: false,
  };
}
