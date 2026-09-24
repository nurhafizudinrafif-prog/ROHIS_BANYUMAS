import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  LayoutDashboard, FileText, Calendar, School, Image, Users,
  MessageCircle, Shield, ClipboardList, LogOut, BookOpen,
  RefreshCw, Home, Settings, ExternalLink, CheckCircle2
} from 'lucide-react';
import { useState, useMemo } from 'react';
import RohisLogo from './RohisLogo';
import DynamicBackground from './DynamicBackground';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const {
    articles = [],
    events = [],
    schools = [],
    gallery = [],
    questions = [],
    library = [],
    team = { bph: [], divisions: [] },
    users = [],
    loadAllData,
    saving,
  } = useData();

  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Total team count
  const totalPengurus = useMemo(() => {
    const bphCount = team?.bph?.length || 0;
    const divCount = team?.divisions?.reduce((acc, d) => acc + (d.members?.length || 0), 0) || 0;
    return bphCount + divCount;
  }, [team]);

  // Sync handler with feedback
  const handleSyncNow = async () => {
    setIsSyncing(true);
    setToastMessage({ message: 'Menyinkronkan data dengan Cloud Upstash & Web Publik...', type: 'info' });
    try {
      await loadAllData();
      setToastMessage({ message: 'Semua data berhasil disinkronkan ke Web Publik & Cloud Upstash!', type: 'success' });
    } catch {
      setToastMessage({ message: 'Data tersimpan secara lokal dan diantrekan ke Cloud.', type: 'info' });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div className="admin-layout-wrapper">
      {/* Dynamic Animated Islamic Sacred Girih Background */}
      <DynamicBackground />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 72,
          right: 24,
          zIndex: 9999,
          background: 'rgba(4, 19, 21, 0.95)',
          border: '1px solid #00F0CF',
          boxShadow: '0 8px 30px rgba(0, 240, 207, 0.25)',
          color: '#F1F5F9',
          padding: '0.75rem 1.25rem',
          borderRadius: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.85rem',
          backdropFilter: 'blur(12px)',
          animation: 'fadeInUp 0.3s ease forwards',
        }}>
          <CheckCircle2 size={18} style={{ color: '#00F0CF' }} />
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* ══════════ TOPBAR (Identical to reference screenshot) ══════════ */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <div className="admin-brand">
            <RohisLogo size={36} showGlow={true} />
            <div className="admin-brand-info">
              <h3>Admin ROKABA CMS</h3>
              <span className="admin-status-badge">
                <span className={`status-dot ${isSyncing || saving ? 'syncing' : ''}`}></span>
                {isSyncing || saving
                  ? 'Menyinkronkan ke Cloud...'
                  : 'Cloud Upstash Terhubung (Real-Time)'}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-topbar-right">
          <button
            onClick={handleSyncNow}
            className="btn-topbar btn-topbar-sync"
            disabled={isSyncing}
            title="Paksa sinkronisasi data ke Cloud Upstash & Web Publik"
          >
            <RefreshCw size={14} className={isSyncing ? 'spin-icon' : ''} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
          </button>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-topbar btn-topbar-public"
            title="Buka Website Publik ROKABA Banyumas"
          >
            <ExternalLink size={14} />
            <span>Lihat Web Publik</span>
          </a>

          <button
            onClick={logout}
            className="btn-topbar btn-topbar-logout"
            title="Keluar dari Panel Admin"
          >
            <LogOut size={15} />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* ══════════ SIDEBAR & PAGE CONTENT ══════════ */}
      <div className="admin-container">
        {/* Sidebar Nav */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <NavLink to="/" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Ringkasan</span>
            </NavLink>

            <NavLink to="/content/home" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <Home size={18} />
              <span>Kelola Beranda</span>
              <span className="nav-badge-cms">CMS</span>
            </NavLink>

            <NavLink to="/content/articles" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <FileText size={18} />
              <span>Artikel Dakwah</span>
              <span className="nav-counter">{articles.length}</span>
            </NavLink>

            <NavLink to="/content/events" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <Calendar size={18} />
              <span>Agenda & Kajian</span>
              <span className="nav-counter">{events.length}</span>
            </NavLink>

            <NavLink to="/content/gallery" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <Image size={18} />
              <span>Galeri Foto</span>
              <span className="nav-counter">{gallery.length}</span>
            </NavLink>

            <NavLink to="/content/schools" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <School size={18} />
              <span>ROHIS Sekolah</span>
              <span className="nav-counter">{schools.length}</span>
            </NavLink>

            <NavLink to="/content/team" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span>Pengurus ROKABA</span>
              <span className="nav-counter">{totalPengurus}</span>
            </NavLink>

            <NavLink to="/library" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <BookOpen size={18} />
              <span>E-Library</span>
              <span className="nav-counter">{library.length}</span>
            </NavLink>

            <div className="admin-nav-separator"></div>

            <NavLink to="/qa" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <MessageCircle size={18} />
              <span>Moderasi Q&A</span>
              <span className="nav-counter">{questions.length}</span>
            </NavLink>

            <NavLink to="/users" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <Shield size={18} />
              <span>Manajemen User</span>
              <span className="nav-counter">{users.length}</span>
            </NavLink>

            <NavLink to="/audit" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <ClipboardList size={18} />
              <span>Audit Log</span>
            </NavLink>

            <div className="admin-nav-separator"></div>

            <NavLink to="/settings" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <Settings size={18} />
              <span>Pengaturan & Backup</span>
            </NavLink>
          </nav>

          {/* Footer User Info */}
          <div className="admin-sidebar-footer">
            <div className="user-profile-badge">
              <div>
                <div className="user-profile-name">{user?.username || 'admin'}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748B' }}>ROKABA Banyumas</div>
              </div>
              <span className="user-profile-role">{user?.role || 'admin'}</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
