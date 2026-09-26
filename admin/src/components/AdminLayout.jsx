import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  LayoutDashboard, FileText, Calendar, School, Image, Users,
  MessageCircle, Shield, ClipboardList, LogOut, BookOpen,
  RefreshCw, Home, Settings, ExternalLink, CheckCircle2,
  Menu, X, ChevronUp
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import RohisLogo from './RohisLogo';
import DynamicBackground from './DynamicBackground';
import useScrollReveal from '../hooks/useScrollReveal';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Activate ubiquitous scroll reveal animations across all routes
  useScrollReveal();
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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Auto-close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Lock background scroll when mobile sidebar is open
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

  // Track scroll position live for progress bar, topbar elevation, and scroll-to-top button
  useEffect(() => {
    const mainContent = document.querySelector('.admin-main-content');

    const handleScrollTracking = () => {
      const winScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const winMax = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;

      const contentScroll = mainContent ? mainContent.scrollTop : 0;
      const contentMax = mainContent ? (mainContent.scrollHeight - mainContent.clientHeight) : 0;

      let currentScroll = winScroll;
      let maxScroll = winMax;

      if (contentMax > 20 && contentScroll > 0) {
        currentScroll = contentScroll;
        maxScroll = contentMax;
      }

      const pct = maxScroll > 0 ? Math.min(100, Math.max(0, (currentScroll / maxScroll) * 100)) : 0;
      setScrollPercent(pct);
      setIsScrolled(currentScroll > 15);
      setShowScrollTop(currentScroll > 260);
    };

    window.addEventListener('scroll', handleScrollTracking, { passive: true });
    document.addEventListener('scroll', handleScrollTracking, { passive: true, capture: true });
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScrollTracking, { passive: true });
    }
    handleScrollTracking();

    return () => {
      window.removeEventListener('scroll', handleScrollTracking);
      document.removeEventListener('scroll', handleScrollTracking, { capture: true });
      if (mainContent) {
        mainContent.removeEventListener('scroll', handleScrollTracking);
      }
    };
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContent = document.querySelector('.admin-main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
      {/* Sleek Glowing Scroll Progress Bar */}
      <div className="admin-scroll-progress-track" aria-hidden="true">
        <div className="admin-scroll-progress-bar" style={{ width: `${scrollPercent}%` }}>
          <div className="admin-scroll-progress-glow" />
        </div>
      </div>

      {/* Dynamic Animated Islamic Sacred Girih Background */}
      <DynamicBackground />

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="admin-scroll-top-btn"
          title="Kembali ke atas"
          aria-label="Kembali ke atas"
        >
          <ChevronUp size={22} />
        </button>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="admin-floating-toast">
          <CheckCircle2 size={18} style={{ color: '#00F0CF', flexShrink: 0 }} />
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* ══════════ TOPBAR (Identical to reference screenshot, Responsive on HP) ══════════ */}
      <header className={`admin-topbar ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="admin-topbar-left">
          {/* Mobile Hamburger Drawer Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(prev => !prev)}
            aria-label={sidebarOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            title={sidebarOpen ? 'Tutup Menu' : 'Buka Menu Navigasi'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="admin-brand">
            <RohisLogo size={36} showGlow={true} />
            <div className="admin-brand-info">
              <h3>Admin ROKABA CMS</h3>
              <span className="admin-status-badge">
                <span className={`status-dot ${isSyncing || saving ? 'syncing' : ''}`}></span>
                <span className="status-text-full">
                  {isSyncing || saving
                    ? 'Menyinkronkan ke Cloud...'
                    : 'Cloud Upstash Terhubung (Real-Time)'}
                </span>
                <span className="status-text-compact">
                  {isSyncing || saving ? 'Sinkron...' : 'Online'}
                </span>
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
            <span className="btn-topbar-text">{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan'}</span>
          </button>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-topbar btn-topbar-public"
            title="Buka Website Publik ROKABA Banyumas"
          >
            <ExternalLink size={14} />
            <span className="btn-topbar-text">Lihat Web</span>
          </a>

          <button
            onClick={logout}
            className="btn-topbar btn-topbar-logout"
            title="Keluar dari Panel Admin"
          >
            <LogOut size={15} />
            <span className="btn-topbar-text">Keluar</span>
          </button>
        </div>
      </header>

      {/* ══════════ SIDEBAR & PAGE CONTENT ══════════ */}
      <div className={`admin-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <div
            className="admin-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar Nav (Desktop Sticky & Mobile Slide Drawer) */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          {/* Mobile Drawer Header */}
          <div className="admin-sidebar-mobile-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <RohisLogo size={28} />
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                Navigasi Admin
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="btn-sidebar-close"
              aria-label="Tutup menu"
              title="Tutup Menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="admin-nav" onClick={(e) => { if (e.target.closest('a')) setSidebarOpen(false); }}>
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
