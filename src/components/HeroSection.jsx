import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, BookOpen, Users, Sprout } from 'lucide-react';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero-cinematic">
      {/* Background with panoramic Nabawi & Arch framing */}
      <div className="hero-cinematic-bg"></div>
      
      {/* Subtle floating particles & ethereal aura */}
      <div className="hero-cinematic-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`hero-star-particle particle-p${i + 1}`}></div>
        ))}
      </div>

      <div className="container hero-cinematic-container">
        {/* Left-Aligned Hero Content */}
        <div className="hero-cinematic-left">
          {/* Bismillah with decorative gold lines */}
          <div className="hero-bismillah-bar animate-hero delay-0">
            <span className="bismillah-line"></span>
            <span className="bismillah-ornament">✧</span>
            <span className="bismillah-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span className="bismillah-ornament">✧</span>
            <span className="bismillah-line"></span>
          </div>

          {/* Main Title matching reference */}
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

          {/* Bottom 3 Feature Mini-Cards */}
          <div className="hero-cinematic-features animate-hero delay-4">
            <div className="hero-glass-mini-card">
              <div className="hero-mini-icon icon-emerald">
                <BookOpen size={19} />
              </div>
              <div className="hero-mini-text">
                <span className="hero-mini-title">Dakwah</span>
                <span className="hero-mini-desc">Membangun Akhlak Mulia</span>
              </div>
            </div>

            <div className="hero-glass-mini-card">
              <div className="hero-mini-icon icon-cyan">
                <Users size={19} />
              </div>
              <div className="hero-mini-text">
                <span className="hero-mini-title">Kolaborasi</span>
                <span className="hero-mini-desc">Bersama untuk Umat</span>
              </div>
            </div>

            <div className="hero-glass-mini-card">
              <div className="hero-mini-icon icon-green">
                <Sprout size={19} />
              </div>
              <div className="hero-mini-text">
                <span className="hero-mini-title">Pembinaan</span>
                <span className="hero-mini-desc">Generasi Islami</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Golden Calligraphy Script */}
        <div className="hero-cinematic-right animate-hero delay-4">
          <div className="hero-slogan-script-container">
            <p className="hero-slogan-script">
              Pemuda Islam
              <br />
              Untuk Masa Depan Umat
            </p>
            <div className="hero-slogan-brush-line"></div>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <div className="hero-scroll-indicator">
        <ChevronDown size={22} />
      </div>
    </section>
  );
}
