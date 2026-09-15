import { Link } from 'react-router-dom';
import { Mail, Phone, Globe, ExternalLink, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';
import './Footer.css';

const footerLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Tentang', path: '/tentang' },
  { label: 'Agenda', path: '/program' },
  { label: 'Artikel', path: '/artikel' },
  { label: 'Galeri', path: '/galeri' },
  { label: 'ROHIS Anggota', path: '/rohis-anggota' },
  { label: 'Kontak', path: '/kontak' },
];

export default function Footer() {
  const { siteSettings } = useData();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        {/* Top Section */}
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <h3 className="footer-brand-name">ROHIS Kabupaten Banyumas</h3>
            <p className="footer-brand-tagline">
              Bersatu dalam Dakwah, Bergerak untuk Umat.
            </p>
            <div className="footer-socials">
              {siteSettings.instagramUrl && (
                <a
                  href={siteSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Instagram"
                >
                  <Globe size={18} />
                </a>
              )}
              {siteSettings.youtubeUrl && (
                <a
                  href={siteSettings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="YouTube"
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Navigasi</h4>
            <ul className="footer-links">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Kontak</h4>
            <ul className="footer-contact-list">
              {siteSettings.email && (
                <li className="footer-contact-item">
                  <Mail size={14} />
                  <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
                </li>
              )}
              {siteSettings.phone && (
                <li className="footer-contact-item">
                  <Phone size={14} />
                  <a href={`tel:${siteSettings.phone}`}>{siteSettings.phone}</a>
                </li>
              )}
              {siteSettings.address && (
                <li className="footer-contact-item">
                  <MapPin size={14} />
                  <span>{siteSettings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {year} ROHIS Kabupaten Banyumas. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
