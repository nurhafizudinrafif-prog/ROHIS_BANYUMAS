// DataContext - Centralized State Management with Cloud Sync
import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

function getInitialData() {
  const getCached = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        let parsed = JSON.parse(raw);
        while (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed); } catch { break; }
        }
        if (parsed) return parsed;
      }
    } catch {}
    return fallback;
  };

  return {
    home: getCached('rokaba:home', fallbackData['rokaba:home'] || null),
    articles: getCached('rokaba:articles', fallbackData['rokaba:articles'] || []),
    events: getCached('rokaba:events', fallbackData['rokaba:events'] || []),
    schools: getCached('rokaba:schools', fallbackData['rokaba:schools'] || []),
    gallery: getCached('rokaba:gallery', fallbackData['rokaba:gallery'] || []),
    questions: getCached('rokaba:questions', fallbackData['rokaba:questions'] || []),
    library: getCached('rokaba:library', fallbackData['rokaba:library'] || []),
    team: normalizeTeam(getCached('rokaba:team', fallbackData['rokaba:team'])),
    users: getCached('rokaba:users', fallbackData['rokaba:users'] || []),
    auditLogs: getCached('rokaba:audit_logs', fallbackData['rokaba:audit_logs'] || []),
  };
}

const DataContext = createContext(null);

export function DataProvider({ children }) {
  // 1. Initial State: Hydrate immediately from cache so page never flashes dummy data
  const [data, setData] = useState(getInitialData);
  const [error, setError] = useState(null);
  const lastSyncRef = useRef(null);

  // Load all data silently in the background without screen refresh flickers
  const loadAllData = useCallback(async (isSilent = true) => {
    setError(null);
    try {
      const allData = await fetchAllData();
      if (!allData || typeof allData !== 'object') return;

      const nextData = {
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
      };

      setData((prev) => {
        // Only trigger React state update if data actually changed
        try {
          if (JSON.stringify(prev) === JSON.stringify(nextData)) {
            return prev;
          }
        } catch (e) {}
        return nextData;
      });
      lastSyncRef.current = new Date();
    } catch (err) {
      console.warn('[DataContext] Silent fetch warning:', err.message);
    }
  }, []);

  useEffect(() => {
    // Initial silent sync on mount
    loadAllData(true);

    // Instant sync when admin updates anything via BroadcastChannel
    let bc;
    try {
      bc = new BroadcastChannel('rokaba_realtime_sync');
      bc.onmessage = () => {
        loadAllData(true);
      };
    } catch (e) {}

    return () => {
      if (bc) {
        try { bc.close(); } catch (e) {}
      }
    };
  }, [loadAllData]);

  // Refresh a specific key
  const refreshKey = useCallback(async (key) => {
    const value = await fetchData(`rokaba:${key}`);
    setData((prev) => ({ ...prev, [key]: value }));
    lastSyncRef.current = new Date();
    return value;
  }, []);

  // Update data (for admin)
  const updateData = useCallback(async (key, value) => {
    const result = await saveData(`rokaba:${key}`, value);
    if (result.success) {
      setData((prev) => ({ ...prev, [key]: value }));
      lastSyncRef.current = new Date();
    }
    return result;
  }, []);

  // Memoize value to guarantee zero re-render cascades across consumer components
  const value = useMemo(() => ({
    ...data,
    loading: false,
    error,
    lastSync: lastSyncRef.current,
    refreshKey,
    updateData,
    loadAllData,
  }), [data, error, refreshKey, updateData, loadAllData]);

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
