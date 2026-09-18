import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import './HeroSection.css';

/**
 * =========================================================
 * HERO SECTION: THE EDITORIAL ORGANIZATION COVER (DARK EDITION)
 * Dignified, scholarly typography with an authentic documentary focus.
 * Category: PELAJAR • PEMUDA • KABUPATEN BANYUMAS
 * Title: ROHIS BANYUMAS
 * Subtitle: Ruang belajar, bertumbuh, dan berkontribusi bersama.
 * Aesthetic: Deep Banyumas Pine Canvas • Burnished Brass • Warm Alabaster
 * =========================================================
 */
export default function HeroSection() {
  return (
    <section className="hero-editorial-cover" data-section="hero">
      <div className="container hero-cover-container">
        <div className="hero-cover-grid">
          {/* Left / Main Text Column */}
          <div className="hero-cover-text">
            {/* Top Category Tag */}
            <div className="hero-category-tag animate-hero delay-0">
              <span className="hero-tag-gem" />
              <span>PELAJAR • PEMUDA • KABUPATEN BANYUMAS</span>
            </div>

            {/* Massive Editorial Cover Title */}
            <h1 className="hero-cover-title animate-hero delay-1">
              ROHIS<br />
              <span className="hero-title-highlight">BANYUMAS</span>
            </h1>

            {/* Editorial Lead In */}
            <div className="hero-lead-phrase animate-hero delay-2">
              <em>Ruang belajar, bertumbuh, dan berkontribusi bersama.</em>
            </div>

            {/* Concrete Narrative Body */}
            <p className="hero-cover-narrative animate-hero delay-2">
              Wadah silaturahmi, kaderisasi kepemimpinan, dan sinergi dakwah pelajar 
              Islam lintas SMA, SMK, dan MA se-Kabupaten Banyumas. Berakar pada akhlak, 
              bergerak dalam karya nyata untuk generasi muda.
            </p>

            {/* Editorial Action Buttons */}
            <div className="hero-cover-actions animate-hero delay-3">
              <Link to="/tentang" className="btn btn-primary btn-lg">
                <span>Kenali ROHIS Lebih Dekat</span>
                <ArrowRight size={17} />
              </Link>
              <a href="#program" className="btn btn-outline btn-lg">
                <Compass size={17} />
                <span>5 Pilar Gerakan</span>
              </a>
            </div>

            {/* Publication / Organization Meta Bar */}
            <div className="hero-publication-meta animate-hero delay-3">
              <div className="pub-meta-item">
                <span className="pub-meta-label">STATUS</span>
                <span className="pub-meta-val">RESMI • DAKWAH SEKOLAH</span>
              </div>
              <div className="pub-meta-sep" />
              <div className="pub-meta-item">
                <span className="pub-meta-label">SEJAK</span>
                <span className="pub-meta-val">2017 • PURWOKERTO</span>
              </div>
              <div className="pub-meta-sep" />
              <div className="pub-meta-item">
                <span className="pub-meta-label">JEJARING</span>
                <span className="pub-meta-val">15+ SMA / SMK / MA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Documentary Photography Anchor */}
          <div className="hero-cover-visual animate-hero delay-2">
            <div className="hero-photo-mount">
              {/* Architectural Mat Frame */}
              <div className="hero-photo-mat">
                <div className="hero-photo-header">
                  <span className="hero-photo-stamp">ARCHIVE REF #01</span>
                  <span className="hero-photo-loc">MASJID AGUNG BAITUSSALAM</span>
                </div>

                <div className="hero-photo-container">
                  <img
                    src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80"
                    alt="Kajian Akbar dan Silaturahmi Pelajar ROHIS Kabupaten Banyumas"
                    className="hero-documentary-img"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="hero-photo-tone" />
                </div>

                <div className="hero-photo-caption">
                  <div className="hero-caption-title">
                    <ShieldCheck size={16} className="text-gold" />
                    <span>Sinergi Kader Dakwah Pelajar se-Banyumas</span>
                  </div>
                  <p className="hero-caption-sub">
                    Pertemuan akbar perwakilan pengurus rohis sekolah dalam merajut ukhuwah dan agenda keumatan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
