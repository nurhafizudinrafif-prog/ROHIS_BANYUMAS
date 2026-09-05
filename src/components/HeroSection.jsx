import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import logoImg from '../assets/logo.png';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero pattern-bg">
      <div className="hero-bg-gradient"></div>
      <div className="hero-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`hero-particle particle-${i + 1}`}></div>
        ))}
      </div>

      <div className="container hero-content">
        <div className="hero-logo-wrapper animate-hero delay-0">
          <img src={logoImg} alt="Logo ROHIS Kabupaten Banyumas" className="hero-logo-img" />
        </div>

        <div className="hero-badge badge badge-gold animate-hero delay-0">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </div>

        <h1 className="hero-title animate-hero delay-1">
          Organisasi <span className="hero-highlight">ROHIS</span>
          <br />
          Kabupaten Banyumas
        </h1>

        <p className="hero-subtitle animate-hero delay-2">
          Bersatu dalam Dakwah, Bergerak untuk Umat.
          <br />
          Wadah koordinasi antar ROHIS sekolah dan pusat dakwah pemuda Islam
          se-Kabupaten Banyumas.
        </p>

        <div className="hero-actions animate-hero delay-3">
          <Link to="/program" className="btn btn-primary btn-lg">
            Lihat Program
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <ChevronDown size={24} />
      </div>
    </section>
  );
}
