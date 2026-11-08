import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export default function Footer() {
  const { settings } = useData();
  const instagramUrl =
    settings?.instagramUrl || 'https://www.instagram.com/rohis_banyumas/';
  const youtubeUrl =
    settings?.youtubeUrl || 'https://youtube.com/@rohisbanyumas9';

  return (
    <footer className="rk-footer-wrap">
      <div className="rk-footer-bar">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '12px 18px',
          }}
        >
          <span className="rk-footer-brand">
            ROHIS Kabupaten Banyumas (ROKABA)
          </span>
          <span className="rk-footer-divider" aria-hidden="true" />
          <span
            style={{
              fontSize: '0.82rem',
              color: 'rgba(247, 245, 240, 0.82)',
            }}
          >
            Naungan Seksi PAI Kemenag Kab. Banyumas • Periode{' '}
            {settings?.period || '2025/2026'}
          </span>
        </div>

        <div className="rk-footer-right" style={{ flexWrap: 'wrap', gap: '14px' }}>
          <nav
            aria-label="Tautan cepat footer"
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '14px',
              fontSize: '0.84rem',
              color: 'rgba(247, 245, 240, 0.86)',
            }}
          >
            <Link to="/about">Tentang</Link>
            <Link to="/programs">Program</Link>
            <Link to="/schools">Sekolah</Link>
            <Link to="/articles">Artikel</Link>
            <Link to="/gallery">Galeri</Link>
            <Link to="/library">Perpustakaan</Link>
            <Link to="/consultation">Konsultasi</Link>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              Instagram ↗
            </a>
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
              YouTube ↗
            </a>
          </nav>

          <span className="rk-footer-divider" aria-hidden="true" />

          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#F7F5F0',
              fontWeight: 700,
            }}
          >
            <span>Hubungi kami</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
