// DataContext - Centralized State Management with Cloud Sync
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchData, saveData, fetchAllData } from '@shared/services/cloudSync.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState({
    home: null,
    articles: [],
    events: [],
    schools: [],
    gallery: [],
    questions: [],
    library: [],
    team: [],
    users: [],
    auditLogs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  // Load all data on mount
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allData = await fetchAllData();
      setData({
        home: allData['rokaba:home'] || fallbackData['rokaba:home'],
        articles: allData['rokaba:articles'] || [],
        events: allData['rokaba:events'] || [],
        schools: allData['rokaba:schools'] || [],
        gallery: allData['rokaba:gallery'] || [],
        questions: allData['rokaba:questions'] || [],
        library: allData['rokaba:library'] || [],
        team: allData['rokaba:team'] || [],
        users: allData['rokaba:users'] || [],
        auditLogs: allData['rokaba:audit_logs'] || [],
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
    const interval = setInterval(loadAllData, 20000);
    window.addEventListener('focus', handleRevalidate);
    window.addEventListener('storage', handleRevalidate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleRevalidate);
      window.removeEventListener('storage', handleRevalidate);
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
