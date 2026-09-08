// ============================================
// ROHIS Kabupaten Banyumas — Upstash Cloud Sync
// Real-Time Cloud Database Synchronizer
// ============================================

const UPSTASH_URL = 'https://holy-gobbler-70550.upstash.io';
const UPSTASH_TOKEN = 'gQAAAAAAAROWAAIgcDJlOTE0NTNiY2EyYjA0MjU3YmNjNjJkMzc3YmZmYjQ2NA';
const CMS_KEY = 'rohis_cms_data';

// Helper to execute Upstash REST command
async function upstashCommand(cmd) {
  try {
    const res = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cmd),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.warn('Cloud database sync error:', err);
    return null;
  }
}

// Fetch complete CMS data from Upstash Cloud
export async function fetchCloudCMSData() {
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${CMS_KEY}`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    let parsed = data.result;
    while (typeof parsed === 'string') {
      try {
        parsed = JSON.parse(parsed);
      } catch (e) {
        break;
      }
    }
    return parsed;
  } catch (err) {
    console.warn('Gagal memuat data dari Cloud Upstash:', err);
    return null;
  }
}

// Save complete CMS data to Upstash Cloud
export async function saveCloudCMSData(payload) {
  try {
    const jsonString = JSON.stringify({
      ...payload,
      updatedAt: new Date().toISOString(),
    });
    const result = await upstashCommand(['SET', CMS_KEY, jsonString]);
    return result === 'OK';
  } catch (err) {
    console.error('Gagal menyimpan ke Cloud Upstash:', err);
    return false;
  }
}
