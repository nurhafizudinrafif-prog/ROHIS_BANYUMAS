import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  LayoutDashboard, FileText, Calendar, School, Image, Users,
  MessageCircle, Library, Shield, ClipboardList, LogOut, BookOpen,
  RefreshCw, ChevronLeft, Menu, Home
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/content/home', icon: Home, label: 'Home Editor' },
  { path: '/content/articles', icon: FileText, label: 'Artikel' },
  { path: '/content/events', icon: Calendar, label: 'Agenda' },
  { path: '/content/schools', icon: School, label: 'Sekolah' },
  { path: '/content/gallery', icon: Image, label: 'Galeri' },
  { path: '/content/team', icon: Users, label: 'Tim' },
  { divider: true },
  { path: '/qa', icon: MessageCircle, label: 'Moderasi Q&A' },
  { path: '/library', icon: Library, label: 'E-Library' },
  { divider: true },
  { path: '/users', icon: Shield, label: 'Manajemen User' },
  { path: '/audit', icon: ClipboardList, label: 'Audit Log' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { lastSync, loadAllData, saving } = useData();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 68 : 256,
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border-glass)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100,
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? '1.25rem 0.75rem' : '1.25rem 1.25rem',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex', alignItems: 'center', gap: '0.65rem',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <img
            src="/logo.png"
            alt="Logo ROKABA"
            style={{
              width: 36,
              height: 36,
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 6px rgba(16,185,129,0.35))',
              flexShrink: 0,
            }}
          />
          {!collapsed && (
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem' }}>ROKABA</span>
              <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--antique-brass)', letterSpacing: '0.06em', marginTop: '-2px' }}>Admin CMS</span>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '0.75rem', overflowY: 'auto' }}>
          {navItems.map((item, i) => {
            if (item.divider) {
              return <div key={`d-${i}`} style={{ height: 1, background: 'var(--border-glass)', margin: '0.5rem 0' }} />;
            }
            return (
              <NavLink key={item.path} to={item.path} end={item.end}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: collapsed ? '0.65rem' : '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.84rem', fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--emerald-light)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--emerald-glass)' : 'transparent',
                  textDecoration: 'none', marginBottom: '0.15rem',
                  transition: 'all 0.15s ease',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                })}
              >
                <item.icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
          {!collapsed && (
            <div style={{
              padding: '0.75rem', borderRadius: 'var(--radius-md)',
              background: 'var(--glass-bg-strong)', marginBottom: '0.5rem',
              fontSize: '0.78rem',
            }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>{user?.username}</div>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>{user?.role}</span>
            </div>
          )}
          <button onClick={logout} className="btn-ghost" style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
            padding: '0.6rem', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
            color: '#F87171', fontSize: '0.84rem', background: 'transparent',
            justifyContent: collapsed ? 'center' : 'flex-start',
            fontFamily: 'var(--font-body)',
          }}>
            <LogOut size={18} />
            {!collapsed && 'Keluar'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: collapsed ? 68 : 256, transition: 'margin-left 0.3s ease' }}>
        {/* Top Bar */}
        <header style={{
          height: 56, padding: '0 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-glass)',
          background: 'var(--bg-dark)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: '0.4rem',
            borderRadius: 'var(--radius-sm)',
          }}>
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {saving && (
              <span style={{ fontSize: '0.78rem', color: 'var(--antique-brass)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <RefreshCw size={14} className="animate-spin" /> Menyimpan...
              </span>
            )}
            {lastSync && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Sync: {lastSync.toLocaleTimeString('id-ID')}
              </span>
            )}
            <button onClick={loadAllData} className="btn btn-sm btn-secondary" style={{ gap: '0.35rem' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '1.5rem' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
