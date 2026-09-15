import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.png';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Beranda' },
  { path: '/tentang', label: 'Tentang' },
  { path: '/program', label: 'Agenda' },
  { path: '/artikel', label: 'Artikel' },
  { path: '/galeri', label: 'Galeri' },
  { path: '/rohis-anggota', label: 'ROHIS Anggota' },
  { path: '/kontak', label: 'Kontak' },
];

export default function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sheetRef = useRef(null);

  // Scroll detection for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const isLinkActive = (path) => {
    if (path === '/program') {
      return location.pathname === '/program' || location.pathname === '/agenda';
    }
    return location.pathname === path;
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-inner container">
          {/* Brand */}
          <Link to="/" className="navbar-brand">
            <img src={logoImg} alt="Logo ROHIS Kabupaten Banyumas" className="navbar-logo-img" />
            <div className="navbar-brand-text">
              <span className="navbar-brand-name">ROHIS</span>
              <span className="navbar-brand-sub">Kab. Banyumas</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="navbar-desktop-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${isLinkActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="navbar-hamburger"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Buka menu navigasi"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Sheet */}
      {isMobileOpen && (
        <div className="navbar-mobile-backdrop" onClick={() => setIsMobileOpen(false)}>
          <div
            className="navbar-mobile-sheet"
            ref={sheetRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
          >
            {/* Sheet Header */}
            <div className="navbar-sheet-header">
              <Link to="/" className="navbar-brand" onClick={() => setIsMobileOpen(false)}>
                <img src={logoImg} alt="Logo" className="navbar-logo-img" />
                <div className="navbar-brand-text">
                  <span className="navbar-brand-name">ROHIS</span>
                  <span className="navbar-brand-sub">Kab. Banyumas</span>
                </div>
              </Link>
              <button
                className="navbar-sheet-close"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Tutup menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Sheet Links */}
            <div className="navbar-sheet-links">
              {navLinks.map((link, i) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`navbar-sheet-link ${isLinkActive(link.path) ? 'active' : ''}`}
                  onClick={() => setIsMobileOpen(false)}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Sheet Footer */}
            <div className="navbar-sheet-footer">
              <p>ROHIS Kabupaten Banyumas</p>
              <p>Bersatu dalam Dakwah, Bergerak untuk Umat</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
