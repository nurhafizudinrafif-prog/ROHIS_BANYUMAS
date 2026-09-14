import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero-cinematic">
      <div className="container hero-cinematic-container">
        {/* Centered Hero Content */}
        <div className="hero-cinematic-content">
          {/* Bismillah with decorative gold lines */}
          <div className="hero-bismillah-bar animate-hero delay-0">
            <span className="bismillah-line"></span>
            <span className="bismillah-ornament">✧</span>
            <span className="bismillah-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span className="bismillah-ornament">✧</span>
            <span className="bismillah-line"></span>
          </div>

          {/* Main Title */}
          <h1 className="hero-cinematic-title animate-hero delay-1">
            <span className="title-serif">Organisasi </span>
            <span className="title-gold">ROHIS</span>
            <br />
            <span className="title-serif">Kabupaten Banyumas</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-cinematic-subtitle animate-hero delay-2">
            Bersatu dalam Dakwah, Bergerak untuk Umat.
            <br />
            Wadah koordinasi antar ROHIS sekolah dan pusat dakwah pemuda Islam
            se-Kabupaten Banyumas.
          </p>

          {/* CTA Button */}
          <div className="hero-cinematic-actions animate-hero delay-3">
            <Link to="/program" className="hero-cta-pill">
              <span>Lihat Program</span>
              <span className="hero-cta-arrow">
                <ArrowRight size={17} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
