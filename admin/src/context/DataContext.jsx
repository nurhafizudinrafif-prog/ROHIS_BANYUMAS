import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchData, saveData, fetchAllData } from '@shared/services/cloudSync.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState({
    home: null, articles: [], events: [], schools: [], gallery: [],
    questions: [], library: [], team: { bph: [], divisions: [] },
    programs: [], settings: null, users: [], auditLogs: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const all = await fetchAllData();
      setData({
        home: all['rokaba:home'],
        articles: all['rokaba:articles'] || [],
        events: all['rokaba:events'] || [],
        schools: all['rokaba:schools'] || [],
        gallery: all['rokaba:gallery'] || [],
        questions: all['rokaba:questions'] || [],
        library: all['rokaba:library'] || [],
        team: all['rokaba:team'] || { bph: [], divisions: [] },
        programs: all['rokaba:programs'] || [],
        settings: all['rokaba:settings'] || null,
        users: all['rokaba:users'] || [],
        auditLogs: all['rokaba:audit_logs'] || [],
      });
      setLastSync(new Date());
    } catch (err) {
      console.error('[Admin DataContext] Load failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAllData(); }, [loadAllData]);

  const updateData = useCallback(async (key, value) => {
    // 1. Instant Optimistic UI update (0ms perceived latency)
    setData(prev => ({ ...prev, [key]: value }));
    setLastSync(new Date());
    setSaving(true);
    try {
      const result = await saveData(`rokaba:${key}`, value);
      return result;
    } finally {
      setSaving(false);
    }
  }, []);

  // Helper: add audit log (non-blocking)
  const addAuditLog = useCallback(async (userId, username, action, module, detail) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId, username, action, module, detail,
    };
    const currentLogs = Array.isArray(data.auditLogs) ? data.auditLogs : [];
    const updated = [newLog, ...currentLogs].slice(0, 200); // keep last 200
    return updateData('audit_logs', updated);
  }, [data.auditLogs, updateData]);

  return (
    <DataContext.Provider value={{
      ...data, loading, saving, lastSync,
      loadAllData, updateData, addAuditLog,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be within DataProvider');
  return ctx;
}
