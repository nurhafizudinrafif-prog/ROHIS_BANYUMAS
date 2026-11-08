import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from '../../assets/logo.png';

const PRIMARY_LINKS = [
  ['/about', 'Tentang'],
  ['/programs', 'Program'],
  ['/berita', 'Berita'],
  ['/events', 'Agenda'],
];

const EXPLORE_LINKS = [
  ['/schools', 'Sekolah anggota'],
  ['/articles', 'Artikel & bacaan'],
  ['/library', 'Perpustakaan'],
  ['/gallery', 'Galeri kegiatan'],
  ['/consultation', 'Ruang konsultasi'],
];

export function Brand({ onClick }) {
  return (
    <Link className="rk-brand" to="/" onClick={onClick} aria-label="ROKABA — Beranda">
      <img src={logo} alt="Logo ROHIS Kabupaten Banyumas" width="40" height="40" />
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
  const [exploreOpen, setExploreOpen] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setExploreOpen(false);
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setExploreOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
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
        if (exploreOpen) setExploreOpen(false);
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
  }, [mobileOpen, exploreOpen]);

  const isRouteActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const isExploreActive = EXPLORE_LINKS.some(([path]) => isRouteActive(path));

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
                  className="rk-nav-dropdown-btn"
                  aria-expanded={exploreOpen}
                  aria-controls="rk-explore-menu"
                  onClick={() => setExploreOpen((prev) => !prev)}
                  style={isExploreActive ? { color: 'var(--rk-ink)', fontWeight: 600 } : undefined}
                >
                  Jelajahi
                  <ChevronDown
                    size={15}
                    style={{
                      transition: 'transform 160ms ease',
                      transform: exploreOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {exploreOpen && (
                  <div
                    id="rk-explore-menu"
                    className="rk-dropdown-panel"
                    role="menu"
                    aria-label="Halaman layanan dan konten"
                  >
                    {EXPLORE_LINKS.map(([path, label]) => (
                      <Link
                        key={path}
                        to={path}
                        role="menuitem"
                        aria-current={isRouteActive(path) ? 'page' : undefined}
                      >
                        <span>{label}</span>
                        <span aria-hidden="true" style={{ color: 'var(--rk-muted)', fontSize: '0.8rem' }}>
                          →
                        </span>
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
              <Link to="/" aria-current={location.pathname === '/' ? 'page' : undefined}>
                <span>Beranda</span>
                <span aria-hidden="true">→</span>
              </Link>
              {PRIMARY_LINKS.map(([path, label]) => (
                <Link
                  key={path}
                  to={path}
                  aria-current={isRouteActive(path) ? 'page' : undefined}
                >
                  <span>{label}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
              {EXPLORE_LINKS.map(([path, label]) => (
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

            <div style={{ marginTop: '20px', display: 'grid', gap: '12px' }}>
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
                  fontSize: '0.82rem',
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
