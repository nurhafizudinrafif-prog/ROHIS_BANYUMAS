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
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import RohisLogo from './RohisLogo';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { loadAllData, saving } = useData();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const dropdownRef = useRef(null);

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
            <h2>ROKABA CMS</h2>
            <span>ROHIS Kabupaten Banyumas</span>
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
              <NavLink to="/content/home" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                <Home size={17} />
                <span>Kelola Beranda</span>
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

              <NavLink to="/content/gallery" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                <ImageIcon size={17} />
                <span>Galeri</span>
              </NavLink>
            </>
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

              <div className="admin-nav-divider" />

              <NavLink to="/qa" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                <MessageCircle size={17} />
                <span>Moderasi Q&A</span>
              </NavLink>

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
          <div className="admin-sidebar-user">
            <div>
              <div className="admin-user-name">{user?.username || 'Admin'}</div>
            </div>
            <span className="admin-user-role">{user?.role === 'superadmin' ? 'Superadmin' : 'Editor'}</span>
          </div>
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
              <span className="admin-topbar-title">Admin ROKABA</span>
              <span className="admin-topbar-sep" aria-hidden="true">|</span>
              <div className="admin-sync-indicator">
                <span className={`admin-sync-dot ${isSyncing || saving ? 'syncing' : ''}`} />
                <span>{isSyncing || saving ? 'Menyinkronkan...' : 'Status sinkronisasi'}</span>
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
              <ExternalLink size={14} />
              <span>Lihat web</span>
            </a>

            {/* Admin Profile Dropdown */}
            <div className="admin-user-menu" ref={dropdownRef}>
              <button
                type="button"
                className="topbar-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
                aria-label="Menu Pengguna"
              >
                <UserIcon size={14} />
                <span>{user?.username || 'Admin'}</span>
                <ChevronDown size={13} />
              </button>

              {userDropdownOpen && (
                <div className="admin-user-dropdown" role="menu">
                  <div style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.2rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pine-dark)' }}>{user?.username}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{user?.role || 'Administrator'}</div>
                  </div>
                  <NavLink to="/settings" className="admin-user-dropdown-item" role="menuitem">
                    <SettingsIcon size={14} />
                    <span>Pengaturan Akun</span>
                  </NavLink>
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
