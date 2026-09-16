import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero" data-section="hero">
      <div className="container hero-container">
        <div className="hero-editorial-grid">
          {/* Left Column: Editorial Content */}
          <div className="hero-content-col">
            {/* Official Category Pill */}
            <div className="hero-badge animate-hero delay-0">
              <span className="hero-badge-dot" />
              <span>ROHIS KABUPATEN BANYUMAS • PLATFORM RESMI</span>
            </div>

            {/* Large Editorial Headline */}
            <h1 className="hero-title animate-hero delay-1">
              Tumbuh dalam Nilai,{' '}
              <span className="hero-title-editorial">Bergerak dalam Karya.</span>
            </h1>

            {/* Concrete, Informative Subtitle */}
            <p className="hero-subtitle animate-hero delay-2">
              Pusat koordinasi, kaderisasi, dan kolaborasi dakwah pelajar Islam lintas SMA, SMK, dan MA 
              se-Kabupaten Banyumas. Bersinergi mencetak generasi muda yang teguh dalam prinsip, unggul dalam karya.
            </p>

            {/* Clear Primary & Secondary CTAs */}
            <div className="hero-actions animate-hero delay-3">
              <Link to="/program" className="btn-primary btn-lg">
                <span>Jelajahi 5 Pilar Gerakan</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/program#agenda" className="btn-outline btn-lg hero-btn-secondary">
                <Calendar size={17} />
                <span>Agenda & Kajian</span>
              </Link>
            </div>

            {/* Trust Metadata Line */}
            <div className="hero-meta-bar animate-hero delay-4">
              <div className="hero-meta-item">
                <span className="hero-meta-val">15+</span>
                <span className="hero-meta-lbl">Sekolah Anggota</span>
              </div>
              <span className="hero-meta-divider">•</span>
              <div className="hero-meta-item">
                <span className="hero-meta-val">53+</span>
                <span className="hero-meta-lbl">Pengurus Aktif</span>
              </div>
              <span className="hero-meta-divider">•</span>
              <div className="hero-meta-item">
                <span className="hero-meta-val">5 Divisi</span>
                <span className="hero-meta-lbl">Fokus Gerakan</span>
              </div>
            </div>
          </div>

          {/* Right Column: Documentary Photography Anchor */}
          <div className="hero-visual-col animate-hero delay-2">
            <div className="hero-visual-card">
              <div className="hero-image-frame">
                <img
                  src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80"
                  alt="Kajian Akbar ROHIS Pelajar Kabupaten Banyumas"
                  className="hero-doc-img"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="hero-image-overlay" />
              </div>

              {/* Floating Crystal Glass Info Card */}
              <div className="hero-floating-glass-card">
                <div className="hero-glass-badge">
                  <span className="hero-glass-dot" />
                  <span>Dokumentasi Kegiatan</span>
                </div>
                <h4 className="hero-glass-title">Kajian Akbar Pelajar Banyumas</h4>
                <p className="hero-glass-desc">Masjid Agung Baitussalam Purwokerto • Kolaborasi Lintas Sekolah</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
