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
  Shield,
  ClipboardList,
  Settings as SettingsIcon,
  RefreshCw,
  ExternalLink,
  LogOut,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import RohisLogo from './RohisLogo';
import './AdminLayout.css';

const NAV_GROUPS = [
  { label: 'Ringkasan', icon: LayoutDashboard, links: [
    { path: '/', label: 'Ringkasan', icon: LayoutDashboard, school: true },
  ] },
  { label: 'Konten', icon: Newspaper, links: [
    { path: '/content/home', label: 'Beranda', icon: Home },
    { path: '/content/news', label: 'Berita', icon: Newspaper },
    { path: '/content/events', label: 'Agenda', icon: Calendar },
    { path: '/content/articles', label: 'Artikel', icon: FileText },
    { path: '/content/gallery', label: 'Galeri Dokumentasi', icon: ImageIcon },
  ] },
  { label: 'Direktori', icon: Users, links: [
    { path: '/content/schools', label: 'Sekolah', icon: School, school: true },
    { path: '/content/team', label: 'Pengurus', icon: Users },
  ] },
  { label: 'Sistem', icon: SettingsIcon, links: [
    { path: '/users', label: 'Pengguna', icon: Shield },
    { path: '/audit', label: 'Audit Log', icon: ClipboardList },
    { path: '/settings', label: 'Pengaturan', icon: SettingsIcon },
  ] },
];

function MenuLink({ item, className, onClick }) {
  const Icon = item.icon;
  return (
    <NavLink to={item.path} end onClick={onClick}
      className={({ isActive }) => className + (isActive ? ' active' : '')}>
      <Icon size={18} aria-hidden="true" /><span>{item.label}</span>
    </NavLink>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { loadAllData, saving } = useData();

  const [openGroup, setOpenGroup] = useState(null);
  const bottomNavRef = useRef(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const dropdownRef = useRef(null);

  const isEditorSekolah = user?.role === 'editor_sekolah';
  const groups = NAV_GROUPS.map(group => ({
    ...group, links: group.links.filter(link => !isEditorSekolah || link.school),
  })).filter(group => group.links.length);
  const currentGroup = groups.find(group => group.links.some(link => link.path === location.pathname));
  const currentLink = currentGroup?.links.find(link => link.path === location.pathname);
  const currentCrumb = { group: currentGroup?.label || 'Admin', label: currentLink?.label || 'CMS' };

  const userInitials = useMemo(() => {
    const raw = (user?.username || 'AD').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return raw.slice(0, 2) || 'AD';
  }, [user?.username]);

  // Close sidebar and dropdown on route change
  useEffect(() => {
    setOpenGroup(null);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!bottomNavRef.current?.contains(e.target)) setOpenGroup(null);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  // Keyboard accessibility: ESC closes sidebar / dropdown
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        bottomNavRef.current?.querySelector('[aria-expanded="true"]')?.focus();
        setOpenGroup(null);
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

  return (
    <div className="admin-layout-wrapper">
      <aside className="admin-sidebar admin-glass" aria-label="Navigasi utama">
        <div className="admin-sidebar-header">
          <RohisLogo size={34} showGlow={false} />
          <div className="admin-sidebar-brand">
            <h2>ROKABA</h2>
            <span>Admin CMS</span>
          </div>
        </div>
        <nav className="admin-nav">
          {groups.map(group => (
            <div className="admin-nav-group" key={group.label}>
              {group.label !== 'Ringkasan' && <div className="admin-nav-group-label">{group.label}</div>}
              {group.links.map(item => <MenuLink key={item.path} item={item} className="admin-nav-item" />)}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a
            href="https://www.rohis-banyumas.web.id/"
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
              href="https://www.rohis-banyumas.web.id/"
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

      <nav ref={bottomNavRef} className="admin-bottom-nav" aria-label="Menu admin"
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpenGroup(null); }}>
        {groups.map(({ label, icon: Icon, links }) => {
          if (links.length === 1) return <MenuLink key={label} item={links[0]} className="admin-bottom-tab" />;
          const expanded = openGroup === label;
          return (
            <div className="admin-bottom-group" key={label}>
              <button type="button" className={'admin-bottom-tab' + (currentGroup?.label === label ? ' active' : '')}
                aria-expanded={expanded} aria-controls={'menu-' + label}
                onClick={() => setOpenGroup(expanded ? null : label)}>
                <Icon size={19} aria-hidden="true" /><span>{label}</span>
              </button>
              <div id={'menu-' + label} hidden={!expanded} className="admin-bottom-panel" aria-label={label}>
                {links.map(item => <MenuLink key={item.path} item={item} className="admin-nav-item" onClick={() => setOpenGroup(null)} />)}
              </div>
            </div>
          );
        })}
      </nav>

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
