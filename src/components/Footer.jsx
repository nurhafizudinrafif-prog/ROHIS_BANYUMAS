import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, AtSign, Play, MessageCircle, Moon, Star } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer pattern-bg">
      <div className="footer-ornament">
        <div className="ornament-separator">
          <span className="ornament-diamond"></span>
        </div>
      </div>

      <div className="container">
        <div className="footer-grid">
          <div className="footer-col footer-about">
            <div className="footer-brand">
              <div className="footer-logo">
                <Moon size={18} />
                <Star size={8} className="footer-star" />
              </div>
              <div>
                <h4 className="footer-brand-name">ROHIS Kabupaten Banyumas</h4>
              </div>
            </div>
            <p className="footer-desc">
              Organisasi koordinasi antar ROHIS sekolah dan pusat dakwah pemuda Islam se-Kabupaten Banyumas. Bersatu dalam dakwah, bergerak untuk umat.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <AtSign size={18} />
              </a>
              <a href="#" className="footer-social-link" aria-label="YouTube">
                <Play size={18} />
              </a>
              <a href="#" className="footer-social-link" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h5 className="footer-heading">Navigasi</h5>
            <ul className="footer-links">
              <li><Link to="/">Beranda</Link></li>
              <li><Link to="/tentang">Tentang Kami</Link></li>
              <li><Link to="/program">Program Kerja</Link></li>
              <li><Link to="/artikel">Artikel Dakwah</Link></li>
              <li><Link to="/agenda">Agenda Kegiatan</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5 className="footer-heading">Layanan</h5>
            <ul className="footer-links">
              <li><Link to="/galeri">Galeri Kegiatan</Link></li>
              <li><Link to="/rohis-anggota">ROHIS Anggota</Link></li>
              <li><Link to="/pendaftaran">Pendaftaran</Link></li>
              <li><Link to="/kontak">Hubungi Kami</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5 className="footer-heading">Kontak</h5>
            <ul className="footer-contact">
              <li>
                <MapPin size={16} />
                <span>Purwokerto, Kabupaten Banyumas, Jawa Tengah</span>
              </li>
              <li>
                <Mail size={16} />
                <span>info@rohisbanyumas.id</span>
              </li>
              <li>
                <Phone size={16} />
                <span>+62 812-3456-7890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-quote">
          <p className="footer-quote-arabic">
            ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ
          </p>
          <p className="footer-quote-translation">
            "Serulah (manusia) kepada jalan Tuhanmu dengan hikmah dan pengajaran yang baik"
            <span className="footer-quote-ref"> — QS. An-Nahl: 125</span>
          </p>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Organisasi ROHIS Kabupaten Banyumas. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
