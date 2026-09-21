// DataContext - Centralized State Management with Cloud Sync
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchData, saveData, fetchAllData } from '@shared/services/cloudSync.js';
import { fallbackData } from '@shared/data/fallback.js';

// Helper to normalize team from either Array or structured Object format ({ bph: [], divisions: [] })
export function normalizeTeam(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== 'object') return [];
  const list = [];
  if (Array.isArray(raw.bph)) {
    raw.bph.forEach((m, idx) => list.push({
      ...m,
      id: m.id || `bph-${idx}`,
      position: m.position || m.role || 'Pengurus BPH',
      role: m.role || m.position || 'Pengurus BPH',
      division: m.division || 'BPH',
    }));
  }
  const divs = Array.isArray(raw.divisions)
    ? raw.divisions
    : (raw.divisions ? Object.values(raw.divisions) : []);
  divs.forEach(div => {
    const divName = div.name || div.title || div.id || 'Divisi';
    const short = div.shortName || divName;
    if (Array.isArray(div.members)) {
      div.members.forEach((m, idx) => list.push({
        ...m,
        id: m.id || `${short}-${idx}`,
        position: m.position || m.role || 'Anggota Divisi',
        role: m.role || m.position || 'Anggota Divisi',
        division: m.division || short || divName,
      }));
    }
  });
  return list;
}

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState({
    home: fallbackData['rokaba:home'] || null,
    articles: fallbackData['rokaba:articles'] || [],
    events: fallbackData['rokaba:events'] || [],
    schools: fallbackData['rokaba:schools'] || [],
    gallery: fallbackData['rokaba:gallery'] || [],
    questions: fallbackData['rokaba:questions'] || [],
    library: fallbackData['rokaba:library'] || [],
    team: normalizeTeam(fallbackData['rokaba:team']),
    users: fallbackData['rokaba:users'] || [],
    auditLogs: fallbackData['rokaba:audit_logs'] || [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  // Load all data on mount and sync
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allData = await fetchAllData();
      setData({
        home: allData['rokaba:home'] || fallbackData['rokaba:home'],
        articles: (Array.isArray(allData['rokaba:articles']) && allData['rokaba:articles'].length > 0)
          ? allData['rokaba:articles']
          : (fallbackData['rokaba:articles'] || []),
        events: (Array.isArray(allData['rokaba:events']) && allData['rokaba:events'].length > 0)
          ? allData['rokaba:events']
          : (fallbackData['rokaba:events'] || []),
        schools: (Array.isArray(allData['rokaba:schools']) && allData['rokaba:schools'].length > 0)
          ? allData['rokaba:schools']
          : (fallbackData['rokaba:schools'] || []),
        gallery: (Array.isArray(allData['rokaba:gallery']) && allData['rokaba:gallery'].length > 0)
          ? allData['rokaba:gallery']
          : (fallbackData['rokaba:gallery'] || []),
        questions: allData['rokaba:questions'] || fallbackData['rokaba:questions'] || [],
        library: allData['rokaba:library'] || fallbackData['rokaba:library'] || [],
        team: normalizeTeam(allData['rokaba:team'] || fallbackData['rokaba:team']),
        users: allData['rokaba:users'] || fallbackData['rokaba:users'] || [],
        auditLogs: allData['rokaba:audit_logs'] || fallbackData['rokaba:audit_logs'] || [],
      });
      setLastSync(new Date());
    } catch (err) {
      setError(err.message);
      console.error('[DataContext] Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
    const handleRevalidate = () => {
      loadAllData();
    };
    const interval = setInterval(loadAllData, 12000); // Check for fresh updates every 12 seconds
    window.addEventListener('focus', handleRevalidate);
    window.addEventListener('storage', handleRevalidate);

    let bc;
    try {
      bc = new BroadcastChannel('rokaba_realtime_sync');
      bc.onmessage = () => {
        loadAllData();
      };
    } catch (e) {}

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleRevalidate);
      window.removeEventListener('storage', handleRevalidate);
      if (bc) {
        try { bc.close(); } catch (e) {}
      }
    };
  }, [loadAllData]);

  // Refresh a specific key
  const refreshKey = useCallback(async (key) => {
    const value = await fetchData(`rokaba:${key}`);
    setData((prev) => ({ ...prev, [key]: value }));
    setLastSync(new Date());
    return value;
  }, []);

  // Update data (for admin)
  const updateData = useCallback(async (key, value) => {
    const result = await saveData(`rokaba:${key}`, value);
    if (result.success) {
      setData((prev) => ({ ...prev, [key]: value }));
      setLastSync(new Date());
    }
    return result;
  }, []);

  const value = {
    ...data,
    loading,
    error,
    lastSync,
    refreshKey,
    updateData,
    loadAllData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export default DataContext;
