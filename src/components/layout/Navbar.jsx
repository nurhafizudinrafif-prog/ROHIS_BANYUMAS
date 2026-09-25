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
  { path: '/schools', label: 'Anggota' },
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open to prevent background scrolling/ghosting
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '0.6rem 0' : '1rem 0',
        background: scrolled 
          ? 'rgba(13, 43, 34, 0.96)' 
          : 'rgba(13, 43, 34, 0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.3s ease',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1200,
          margin: '0 auto',
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
                width: 46, height: 46,
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
                color: 'var(--warm-alabaster)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                display: 'block',
              }}>ROKABA</span>
              <span style={{
                display: 'block',
                fontSize: '0.65rem',
                color: 'var(--antique-brass)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '1px',
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

          {/* Mobile Toggle Button */}
          <button
            className="hide-desktop"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Tutup navigasi" : "Buka navigasi"}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              width: 44,
              height: 44,
              cursor: 'pointer',
              color: 'var(--warm-alabaster)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease',
            }}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ═══ FULL-SCREEN IMMERSIVE MOBILE MENU DRAWER ═══ */}
      {isOpen && (
        <div
          className="hide-desktop no-scrollbar"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100dvh',
            zIndex: 99999,
            backgroundColor: '#0D2B22',
            backgroundImage: `
              radial-gradient(ellipse at 85% 15%, rgba(16, 185, 129, 0.2) 0%, transparent 60%),
              radial-gradient(ellipse at 15% 85%, rgba(181, 141, 79, 0.12) 0%, transparent 60%),
              url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2310B981' stroke-width='0.75' stroke-opacity='0.05'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z'/%3E%3Ccircle cx='40' cy='40' r='18'/%3E%3C/g%3E%3C/svg%3E")
            `,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Header Inside Drawer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(8, 28, 22, 0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              position: 'sticky',
              top: 0,
              zIndex: 10,
              flexShrink: 0,
            }}
          >
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                textDecoration: 'none',
              }}
            >
              <img
                src={logoImg}
                alt="Logo ROHIS Banyumas"
                style={{
                  width: 42,
                  height: 42,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(16,185,129,0.35))',
                }}
              />
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    color: 'var(--warm-alabaster)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    display: 'block',
                  }}
                >
                  ROKABA
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.62rem',
                    color: 'var(--antique-brass)',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginTop: '1px',
                  }}
                >
                  Rohis Kab. Banyumas
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Tutup navigasi"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                width: 44,
                height: 44,
                cursor: 'pointer',
                color: 'var(--warm-alabaster)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease',
              }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Links List Body */}
          <div
            style={{
              padding: '1.25rem 1rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              flex: 1,
            }}
          >
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    fontSize: '1rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--emerald-light)' : 'rgba(245, 242, 237, 0.9)',
                    borderRadius: '14px',
                    background: isActive ? 'rgba(16, 185, 129, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                    border: isActive
                      ? '1px solid rgba(16, 185, 129, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.05)',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--emerald-light)',
                        boxShadow: '0 0 10px var(--emerald)',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Bottom Footer Area */}
          <div
            style={{
              padding: '1.25rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom, 0px))',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(6, 20, 15, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'rgba(245, 242, 237, 0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Konektivitas & Media
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--antique-brass)', fontWeight: 600 }}>
                #RohisBanyumas
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { label: 'Instagram', url: 'https://www.instagram.com/rohisbanyumas' },
                { label: 'YouTube', url: 'https://www.youtube.com/@rohisbanyumas' },
                { label: 'WhatsApp', url: 'https://wa.me/6281234567890' },
              ].map(item => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.4rem',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--warm-alabaster)',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
