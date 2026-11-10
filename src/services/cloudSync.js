// ============================================
// ROHIS Kabupaten Banyumas — Secure Cloud Sync Adapter
// Redirects to secure /api/sync with defense-in-depth sanitization
// ============================================

import { fetchData, saveData } from '../../shared/services/cloudSync.js';
import { sanitizeAndProtect } from '../../shared/services/securitySanitizer.js';

const CMS_KEY = 'rohis_cms_data';

// Fetch complete CMS data via secure API proxy
export async function fetchCloudCMSData() {
  try {
    const data = await fetchData(CMS_KEY);
    const { safeData } = sanitizeAndProtect(CMS_KEY, data);
    return safeData;
  } catch (err) {
    console.warn('Gagal memuat data dari Cloud:', err);
    return null;
  }
}

// Save complete CMS data via secure API proxy
export async function saveCloudCMSData(payload) {
  try {
    const result = await saveData(CMS_KEY, payload);
    return result?.success === true;
  } catch (err) {
    console.error('Gagal menyimpan ke Cloud:', err);
    return false;
  }
}
