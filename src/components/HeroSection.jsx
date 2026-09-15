import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge animate-hero delay-0">
            <span className="hero-badge-dot" />
            <span>Organisasi Pelajar Muslim Kabupaten Banyumas</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title animate-hero delay-1">
            Bersatu dalam <span className="hero-title-accent">Dakwah</span>,{' '}
            <br className="hero-br" />
            Bergerak untuk <span className="hero-title-accent">Umat</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle animate-hero delay-2">
            Wadah koordinasi antar ROHIS sekolah dan pusat dakwah pemuda Islam
            se-Kabupaten Banyumas. Menginspirasi, membina, dan membangun generasi muda
            yang berilmu, berakhlak, dan berdampak.
          </p>

          {/* CTA */}
          <div className="hero-actions animate-hero delay-3">
            <Link to="/program" className="btn-primary btn-lg">
              Jelajahi Program <ArrowRight size={18} />
            </Link>
            <Link to="/tentang" className="btn-outline btn-lg hero-btn-secondary">
              Tentang Kami <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative bottom edge */}
      <div className="hero-edge" aria-hidden="true" />
    </section>
  );
}
