import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const ADMIN_USER = import.meta.env.VITE_ADMIN_USERNAME || 'admin_rokaba';
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'rokaba2026';
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '1234';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('rokaba_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const login = useCallback((username, password, pin) => {
    // Super Admin check via env
    if (username === ADMIN_USER && password === ADMIN_PASS && pin === ADMIN_PIN) {
      const userData = { id: 'user-001', username, role: 'superadmin', schoolId: null };
      setUser(userData);
      sessionStorage.setItem('rokaba_admin_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: 'Kredensial tidak valid' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('rokaba_admin_user');
  }, []);

  const isAuthorized = useCallback((module, schoolId) => {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    if (user.role === 'editor_sekolah' && module === 'schools') {
      return user.schoolId === schoolId;
    }
    return false;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthorized, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
}
