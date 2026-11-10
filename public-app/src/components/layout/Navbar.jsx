import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from '../../assets/logo.png';

const PRIMARY_LINKS = [
  ['/about', 'Tentang'],
  ['/programs', 'Program'],
  ['/berita', 'Berita'],
  ['/events', 'Agenda'],
  ['/schools', 'Sekolah'],
];

const MORE_LINKS = [
  ['/articles', 'Artikel & Opini'],
  ['/gallery', 'Galeri Kegiatan'],
  ['/consultation', 'Ruang Konsultasi'],
];

const ALL_MOBILE_LINKS = [
  ['/', 'Beranda'],
  ['/about', 'Tentang ROKABA'],
  ['/programs', 'Program & Divisi'],
  ['/berita', 'Berita Kegiatan'],
  ['/events', 'Agenda Bersama'],
  ['/schools', 'Sekolah Anggota'],
  ['/articles', 'Artikel & Opini'],
  ['/gallery', 'Galeri Kegiatan'],
  ['/consultation', 'Ruang Konsultasi'],
  ['/contact', 'Kontak & Sekretariat'],
];

export function Brand({ onClick }) {
  return (
    <Link className="rk-brand" to="/" onClick={onClick} aria-label="ROKABA — Beranda">
      <img src={logo} alt="Logo ROHIS Kabupaten Banyumas" width="42" height="42" />
      <span className="rk-brand-divider" aria-hidden="true" />
      <span className="rk-brand-text">
        <strong>ROKABA</strong>
        <small>ROHIS Kabupaten Banyumas</small>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      const firstLink = drawerRef.current?.querySelector('a, button');
      firstLink?.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (moreOpen) setMoreOpen(false);
        if (mobileOpen) {
          setMobileOpen(false);
          toggleBtnRef.current?.focus();
        }
      }
      if (mobileOpen && e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll('a[href], button:not([disabled])');
        if (focusables.length > 0) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen, moreOpen]);

  const isRouteActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const isMoreActive = MORE_LINKS.some(([path]) => isRouteActive(path));

  return (
    <>
      <a className="rk-skip" href="#main-content">
        Lewati ke konten utama
      </a>

      <header className="rk-header-shell">
        <div className="rk-container">
          <div className="rk-glass-nav">
            <Brand />

            <nav className="rk-nav-links" aria-label="Navigasi utama">
              {PRIMARY_LINKS.map(([path, label]) => (
                <Link
                  key={path}
                  to={path}
                  className="rk-nav-link"
                  aria-current={isRouteActive(path) ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}

              <div className="rk-nav-dropdown-wrap" ref={dropdownRef}>
                <button
                  type="button"
                  className="rk-nav-link"
                  aria-expanded={moreOpen}
                  aria-controls="rk-more-menu"
                  onClick={() => setMoreOpen((prev) => !prev)}
                  style={{
                    border: 'none',
                    background: isMoreActive ? 'rgba(255, 255, 255, 0.75)' : 'transparent',
                    boxShadow: isMoreActive ? 'var(--rk-shadow-inset)' : 'none',
                    cursor: 'pointer',
                    gap: '5px',
                  }}
                >
                  <span>Layanan</span>
                  <ChevronDown
                    size={15}
                    style={{
                      transition: 'transform 150ms ease',
                      transform: moreOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {moreOpen && (
                  <div
                    id="rk-more-menu"
                    className="rk-dropdown-panel"
                    role="menu"
                    aria-label="Menu layanan dan literasi"
                  >
                    {MORE_LINKS.map(([path, label]) => (
                      <Link
                        key={path}
                        to={path}
                        role="menuitem"
                        aria-current={isRouteActive(path) ? 'page' : undefined}
                      >
                        <span>{label}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/contact"
                className="rk-btn-primary"
                style={{ minHeight: '42px', padding: '0 20px', fontSize: '0.9rem' }}
              >
                Hubungi kami
              </Link>
            </nav>

            <button
              ref={toggleBtnRef}
              type="button"
              className="rk-mobile-toggle"
              aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={mobileOpen}
              aria-controls="rk-mobile-drawer"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          id="rk-mobile-drawer"
          ref={drawerRef}
          className="rk-mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi utama"
        >
          <div className="rk-mobile-drawer-panel">
            <div>
              <div className="rk-mobile-drawer-top">
                <Brand onClick={() => setMobileOpen(false)} />
                <button
                  type="button"
                  className="rk-mobile-toggle"
                  style={{ display: 'inline-flex' }}
                  aria-label="Tutup menu navigasi"
                  onClick={() => {
                    setMobileOpen(false);
                    toggleBtnRef.current?.focus();
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="rk-mobile-nav-list" aria-label="Menu seluler">
                {ALL_MOBILE_LINKS.map(([path, label]) => (
                  <Link
                    key={path}
                    to={path}
                    aria-current={isRouteActive(path) ? 'page' : undefined}
                  >
                    <span>{label}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div style={{ marginTop: '16px', display: 'grid', gap: '10px' }}>
              <Link
                to="/contact"
                className="rk-btn-primary"
                style={{ width: '100%' }}
                onClick={() => setMobileOpen(false)}
              >
                Hubungi kami
              </Link>
              <p
                style={{
                  margin: 0,
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--rk-muted)',
                }}
              >
                Kabupaten Banyumas • rokaba.banyumas@gmail.com
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
