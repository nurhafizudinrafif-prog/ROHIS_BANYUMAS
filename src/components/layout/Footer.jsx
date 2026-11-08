import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export default function Footer() {
  const { settings } = useData();
  const email = settings?.contactEmail || 'rokaba.banyumas@gmail.com';
  const locationText = settings?.address || 'Kabupaten Banyumas';
  const instagramUrl = settings?.socialLinks?.instagram || 'https://www.instagram.com/rohis_banyumas/';
  const youtubeUrl = settings?.socialLinks?.youtube || 'https://www.youtube.com/@rohisbanyumas9';

  return (
    <footer className="rk-footer-wrap">
      <div className="rk-container">
        <div className="rk-footer-bar">
          <div className="rk-footer-top">
            <div className="rk-footer-brand">
              <strong>ROKABA — ROHIS Kabupaten Banyumas</strong>
              <span>
                Wadah kolaborasi, pembinaan karakter, dan syiar pelajar Muslim SMA/SMK/MA se-Kabupaten Banyumas.
              </span>
            </div>

            <div className="rk-footer-meta">
              <span>{locationText}</span>
              <span aria-hidden="true">•</span>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          </div>

          <div className="rk-footer-links-row">
            <nav className="rk-footer-nav" aria-label="Tautan cepat footer">
              <Link to="/about">Tentang</Link>
              <Link to="/programs">Program</Link>
              <Link to="/berita">Berita</Link>
              <Link to="/events">Agenda</Link>
              <Link to="/schools">Sekolah anggota</Link>
              <Link to="/articles">Artikel</Link>
              <Link to="/library">Perpustakaan</Link>
              <Link to="/gallery">Galeri</Link>
              <Link to="/consultation">Konsultasi</Link>
              <Link to="/contact">Kontak</Link>
            </nav>

            <div className="rk-footer-meta" style={{ fontSize: '0.84rem' }}>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram Resmi ↗
              </a>
              <span aria-hidden="true">•</span>
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                YouTube ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
