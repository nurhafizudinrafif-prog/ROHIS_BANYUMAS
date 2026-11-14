import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  LayoutDashboard,
  Home,
  Newspaper,
  FileText,
  Calendar,
  Image as ImageIcon,
  School,
  Users,
  MessageCircle,
  Shield,
  ClipboardList,
  Settings as SettingsIcon,
  RefreshCw,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import RohisLogo from './RohisLogo';
import './AdminLayout.css';

const ROUTE_BREADCRUMBS = {
  '/': { group: 'Dashboard', label: 'Ringkasan' },
  '/content/home': { group: 'Konten', label: 'Beranda' },
  '/content/news': { group: 'Konten', label: 'Berita' },
  '/content/articles': { group: 'Konten', label: 'Artikel' },
  '/content/events': { group: 'Konten', label: 'Agenda' },
  '/content/gallery': { group: 'Direktori & Media', label: 'Galeri' },
  '/content/schools': { group: 'Direktori & Media', label: 'Sekolah' },
  '/content/team': { group: 'Direktori & Media', label: 'Pengurus' },
  '/qa': { group: 'Direktori & Media', label: 'Moderasi Q&A' },
  '/users': { group: 'Sistem', label: 'Pengguna' },
  '/audit': { group: 'Sistem', label: 'Audit Log' },
  '/settings': { group: 'Sistem', label: 'Pengaturan' },
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { loadAllData, saving } = useData();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const dropdownRef = useRef(null);

  const currentCrumb = useMemo(() => {
    return (
      ROUTE_BREADCRUMBS[location.pathname] || {
        group: 'Admin ROKABA',
        label: 'Panel CMS',
      }
    );
  }, [location.pathname]);

  const userInitials = useMemo(() => {
    const raw = (user?.username || 'AD').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return raw.slice(0, 2) || 'AD';
  }, [user?.username]);

  // Close sidebar and dropdown on route change
  useEffect(() => {
    setSidebarOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Lock scroll on mobile when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard accessibility: ESC closes sidebar / dropdown
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real Sync Handler with Toast Feedback
  const handleSyncNow = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setToastMessage({ message: 'Menyinkronkan data dengan server...', type: 'info' });
    try {
      await loadAllData();
      setToastMessage({ message: 'Data berhasil disinkronkan!', type: 'success' });
    } catch {
      setToastMessage({ message: 'Sinkronisasi offline: data lokal aktif.', type: 'info' });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const isEditorSekolah = user?.role === 'editor_sekolah';

  return (
    <div className="admin-layout-wrapper">
      {/* Mobile Drawer Backdrop */}
      <div
        className={`admin-mobile-backdrop ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ══════════ SIDEBAR (Acuan Image 01) ══════════ */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Navigasi Utama">
        <div className="admin-sidebar-header">
          <RohisLogo size={34} showGlow={false} />
          <div className="admin-sidebar-brand">
            <h2>ROKABA</h2>
            <span>Admin CMS</span>
          </div>
          <button
            className="admin-sidebar-mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup Menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-nav">
          <NavLink to="/" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={17} />
            <span>Ringkasan</span>
          </NavLink>

          {!isEditorSekolah && (
            <>
              <div className="admin-nav-group-label">Konten</div>

              <NavLink to="/content/home" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                <Home size={17} />
                <span>Beranda</span>
              </NavLink>

              <NavLink to="/content/news" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                <Newspaper size={17} />
                <span>Berita</span>
              </NavLink>

              <NavLink to="/content/articles" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                <FileText size={17} />
                <span>Artikel</span>
              </NavLink>

              <NavLink to="/content/events" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                <Calendar size={17} />
                <span>Agenda</span>
              </NavLink>
            </>
          )}

          <div className="admin-nav-group-label">Direktori & Media</div>

          {!isEditorSekolah && (
            <NavLink to="/content/gallery" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <ImageIcon size={17} />
              <span>Galeri</span>
            </NavLink>
          )}

          <NavLink to="/content/schools" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <School size={17} />
            <span>Sekolah</span>
          </NavLink>

          {!isEditorSekolah && (
            <>
              <NavLink to="/content/team" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                <Users size={17} />
                <span>Pengurus</span>
              </NavLink>

              <NavLink to="/qa" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                <MessageCircle size={17} />
                <span>Moderasi Q&A</span>
              </NavLink>

              <div className="admin-nav-group-label">Sistem</div>

              <NavLink to="/users" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                <Shield size={17} />
                <span>Pengguna</span>
              </NavLink>

              <NavLink to="/audit" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                <ClipboardList size={17} />
                <span>Audit Log</span>
              </NavLink>

              <NavLink to="/settings" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                <SettingsIcon size={17} />
                <span>Pengaturan</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="admin-sidebar-footer">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-sidebar-footer-btn"
          >
            <ExternalLink size={15} />
            <span>Lihat website</span>
          </a>
          <button
            type="button"
            onClick={logout}
            className="admin-sidebar-footer-btn logout"
          >
            <LogOut size={15} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ══════════ MAIN WRAPPER & TOPBAR ══════════ */}
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="mobile-hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka Navigasi"
            >
              <Menu size={18} />
            </button>
            <div className="admin-topbar-title-wrap">
              <Home size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} aria-hidden="true" />
              <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} aria-hidden="true" />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                {currentCrumb.group}
              </span>
              <span style={{ color: 'var(--border-default)' }} aria-hidden="true">/</span>
              <span className="admin-topbar-title">{currentCrumb.label}</span>

              <span className="admin-topbar-sep" aria-hidden="true">|</span>
              <div className="admin-sync-indicator">
                <span className={`admin-sync-dot ${isSyncing || saving ? 'syncing' : ''}`} />
                <span>{isSyncing || saving ? 'Menyinkronkan...' : 'Tersinkron'}</span>
              </div>
            </div>
          </div>

          <div className="admin-topbar-right">
            <button
              type="button"
              className="topbar-btn"
              onClick={handleSyncNow}
              disabled={isSyncing}
              title="Sinkronkan data dengan server"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              <span>Sinkronkan</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="topbar-btn"
              title="Buka Website Publik ROKABA"
            >
              <span>Lihat website</span>
              <ExternalLink size={13} />
            </a>

            {/* Admin Profile Dropdown */}
            <div className="admin-user-menu" ref={dropdownRef}>
              <button
                type="button"
                className="topbar-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
                aria-label="Menu Pengguna"
                style={{ paddingLeft: '0.45rem', gap: '0.5rem' }}
              >
                <span className="admin-avatar-pill" aria-hidden="true">
                  {userInitials}
                </span>
                <span>{user?.username || 'Admin'}</span>
                <ChevronDown size={13} />
              </button>

              {userDropdownOpen && (
                <div className="admin-user-dropdown" role="menu">
                  <div style={{ padding: '0.45rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.2rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pine-dark)' }}>{user?.username}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {user?.role === 'superadmin' ? 'Superadmin' : 'Editor Sekolah'}
                    </div>
                  </div>
                  {!isEditorSekolah && (
                    <NavLink to="/settings" className="admin-user-dropdown-item" role="menuitem">
                      <SettingsIcon size={14} />
                      <span>Pengaturan Akun</span>
                    </NavLink>
                  )}
                  <button
                    type="button"
                    className="admin-user-dropdown-item logout"
                    onClick={logout}
                    role="menuitem"
                  >
                    <LogOut size={14} />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="admin-toast" role="status">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 size={16} style={{ color: '#10B981' }} />
          ) : (
            <AlertCircle size={16} style={{ color: '#F59E0B' }} />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}
    </div>
  );
}
