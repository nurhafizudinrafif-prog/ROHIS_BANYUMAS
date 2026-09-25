import logoImg from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Camera, Play, MessageCircle } from 'lucide-react';

const footerLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Tentang', path: '/about' },
  { label: 'Program', path: '/programs' },
  { label: 'Artikel', path: '/articles' },
  { label: 'Agenda', path: '/events' },
  { label: 'Anggota', path: '/schools' },
  { label: 'Galeri', path: '/gallery' },
  { label: 'Konsultasi', path: '/consultation' },
  { label: 'E-Library', path: '/library' },
  { label: 'Kontak', path: '/contact' },
];

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--deep-pine)',
      color: 'var(--warm-alabaster)',
      padding: '4rem 0 0',
      width: '100%',
      overflowX: 'clip',
    }}>
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: '2.5rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid rgba(245,242,237,0.08)',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <img
                src={logoImg}
                alt="Logo ROHIS Banyumas"
                style={{
                  width: 48, height: 48,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(16,185,129,0.35))',
                }}
              />
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem' }}>ROKABA</span>
                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--antique-brass)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '-2px' }}>
                  Rohis Kabupaten Banyumas
                </span>
              </div>
            </div>
            <p style={{ color: 'rgba(245,242,237,0.55)', fontSize: '0.88rem', lineHeight: 1.7, maxWidth: 300 }}>
              Forum Komunikasi Rohis se-Kabupaten Banyumas. Membangun generasi pelajar Muslim yang berkarakter, cerdas, dan berakhlak mulia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--antique-brass)' }}>
              Navigasi
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {footerLinks.map((link) => (
                <Link key={link.path} to={link.path} style={{
                  color: 'rgba(245,242,237,0.6)',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  padding: '0.3rem 0',
                  transition: 'color 0.2s',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--antique-brass)' }}>
              Kontak
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'rgba(245,242,237,0.6)', fontSize: '0.85rem' }}>
                <MapPin size={16} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                Kabupaten Banyumas, Jawa Tengah
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'rgba(245,242,237,0.6)', fontSize: '0.85rem' }}>
                <Mail size={16} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                rokaba.banyumas@gmail.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'rgba(245,242,237,0.6)', fontSize: '0.85rem' }}>
                <Phone size={16} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                +62 812-3456-7890
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                {[
                  { icon: Camera, label: 'Instagram', url: 'https://www.instagram.com/rohisbanyumas' },
                  { icon: Play, label: 'YouTube', url: 'https://www.youtube.com/@rohisbanyumas' },
                  { icon: MessageCircle, label: 'WhatsApp', url: 'https://wa.me/6281234567890' },
                ].map(({ icon: Icon, label, url }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} style={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(245,242,237,0.6)',
                    transition: 'all 0.2s',
                  }}>
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          padding: '1.5rem 0',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.78rem',
          color: 'rgba(245,242,237,0.35)',
        }}>
          <span>© {new Date().getFullYear()} ROKABA — Forum Komunikasi Rohis Kabupaten Banyumas</span>
          <span>Dibangun dengan ❤️ untuk dakwah pelajar</span>
        </div>
      </div>
    </footer>
  );
}
