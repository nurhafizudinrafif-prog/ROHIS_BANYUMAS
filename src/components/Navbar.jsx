import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Beranda' },
  { path: '/tentang', label: 'Tentang' },
  { path: '/program', label: 'Program & Agenda' },
  { path: '/artikel', label: 'Artikel' },
  { path: '/galeri', label: 'Galeri' },
  { path: '/rohis-anggota', label: 'ROHIS Anggota' },
  { path: '/kontak', label: 'Kontak' },
];

export default function Navbar() {
  const location = useLocation();
  const menuRef = useRef(null);

  // Auto-scroll the active menu link to the center on mobile swipe bar
  useEffect(() => {
    if (menuRef.current) {
      const activeLink = menuRef.current.querySelector('.navbar-link.active');
      if (activeLink) {
        activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [location.pathname]);

  const isLinkActive = (path) => {
    if (path === '/program') {
      return location.pathname === '/program' || location.pathname === '/agenda';
    }
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        {/* Brand Logo & Name */}
        <Link to="/" className="navbar-brand">
          <img src={logoImg} alt="Logo ROHIS Kabupaten Banyumas" className="navbar-logo-img" />
          <div className="navbar-brand-text">
            <span className="navbar-brand-name">ROHIS</span>
            <span className="navbar-brand-sub">Kabupaten Banyumas</span>
          </div>
        </Link>

        {/* Separator on mobile */}
        <div className="navbar-brand-divider" aria-hidden="true" />

        {/* Horizontal Navigation Menu (Always visible & swipeable on mobile, matching Gambar 2) */}
        <div className="navbar-menu" ref={menuRef}>
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
      </div>
    </nav>
  );
}
