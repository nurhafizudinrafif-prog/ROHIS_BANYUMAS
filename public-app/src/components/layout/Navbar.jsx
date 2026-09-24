import logoImg from '../../assets/logo.png';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Moon, Sun } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Beranda' },
  { path: '/about', label: 'Tentang' },
  { path: '/programs', label: 'Program' },
  { path: '/articles', label: 'Artikel' },
  { path: '/events', label: 'Agenda' },
  { path: '/schools', label: 'Sekolah' },
  { path: '/consultation', label: 'Konsultasi' },
  { path: '/library', label: 'E-Library' },
  { path: '/gallery', label: 'Galeri' },
  { path: '/contact', label: 'Kontak' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: scrolled ? '0.6rem 0' : '1rem 0',
      background: scrolled 
        ? 'rgba(13, 43, 34, 0.95)' 
        : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(16, 185, 129, 0.1)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 1.5rem',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          textDecoration: 'none',
        }}>
          <img
            src={logoImg}
            alt="Logo ROHIS Banyumas"
            style={{
              width: 48, height: 48,
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(16,185,129,0.35))',
              transition: 'transform 0.2s ease',
            }}
          />
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.15rem',
              color: scrolled ? 'var(--warm-alabaster)' : 'var(--warm-alabaster)',
              letterSpacing: '-0.02em',
            }}>ROKABA</span>
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              color: 'var(--antique-brass)',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: '-2px',
            }}>Rohis Kab. Banyumas</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hide-mobile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || 
              (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link key={link.path} to={link.path} style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--emerald-light)' : 'rgba(245,242,237,0.7)',
                borderRadius: 'var(--radius-full)',
                background: isActive ? 'rgba(16,185,129,0.12)' : 'transparent',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
              }}>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <button className="hide-desktop" onClick={() => setIsOpen(!isOpen)} style={{
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '10px',
          padding: '0.5rem',
          cursor: 'pointer',
          color: 'var(--warm-alabaster)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="hide-desktop" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(13, 43, 34, 0.98)',
          backdropFilter: 'blur(24px)',
          padding: '1rem 1.5rem 1.5rem',
          borderBottom: '1px solid rgba(16,185,129,0.15)',
          animation: 'fadeInUp 0.3s ease',
        }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} style={{
                display: 'block',
                padding: '0.75rem 1rem',
                fontSize: '0.95rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--emerald-light)' : 'rgba(245,242,237,0.8)',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'rgba(16,185,129,0.1)' : 'transparent',
                textDecoration: 'none',
                marginBottom: '0.2rem',
              }}>
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
