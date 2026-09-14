import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CONSTELLATIONS } from './constellationsData';
import './DynamicBackground.css';

export default function DynamicBackground() {
  const location = useLocation();
  const [theme, setTheme] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef(null);

  // Section definitions mapped to celestial constellations
  const sectionSelectors = [
    { sel: '.hero-cinematic, .page-hero', theme: 'hero' },
    { sel: '.stats-section, .home-programs-grid', theme: 'programs' },
    { sel: '.quote-section, .about-story, .about-values-grid', theme: 'quote' },
    { sel: '.home-events-list, .agenda-container, .schools-grid', theme: 'events' },
    { sel: '.gallery-grid, .instagram-section, .articles-grid, .grid-3', theme: 'media' },
    { sel: '.home-cta-section, .contact-form-wrapper, .reg-form, footer', theme: 'cta' }
  ];

  // Evaluate which section is dominant in the viewport
  const evaluateDominantTheme = () => {
    const focalY = window.innerHeight * 0.45;
    let closestTheme = null;
    let minDistance = Infinity;

    sectionSelectors.forEach(({ sel, theme: t }) => {
      const els = document.querySelectorAll(sel);
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const elCenter = (rect.top + rect.bottom) / 2;
          const dist = Math.abs(elCenter - focalY);
          if (dist < minDistance) {
            minDistance = dist;
            closestTheme = t;
          }
        }
      });
    });

    if (closestTheme) {
      setTheme((current) => (current !== closestTheme ? closestTheme : current));
    }
  };

  // 1. Initial route detection and initial evaluation
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('agenda')) setTheme('events');
    else if (path.includes('artikel') || path.includes('galeri')) setTheme('media');
    else if (path.includes('program')) setTheme('programs');
    else if (path.includes('tentang')) setTheme('quote');
    else if (path.includes('kontak') || path.includes('pendaftaran')) setTheme('cta');
    else setTheme('hero');

    const timer = setTimeout(evaluateDominantTheme, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // 2. Smooth parallax and dynamic constellation swap on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight
        );
        const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
        setScrollProgress(progress);
        evaluateDominantTheme();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Nebula drift based on scroll
  const nebula1X = Math.sin(scrollProgress * Math.PI * 2) * 50;
  const nebula1Y = Math.cos(scrollProgress * Math.PI * 2) * 30 + scrollProgress * 60;
  const nebula2X = -Math.cos(scrollProgress * Math.PI * 2) * 60;
  const nebula2Y = Math.sin(scrollProgress * Math.PI * 2) * 40 - scrollProgress * 70;

  // Star parallax layers move at different speeds
  const starLayer1Y = -(scrollProgress * 25);
  const starLayer2Y = -(scrollProgress * 45);
  const starLayer3Y = -(scrollProgress * 12);

  // Active constellation details
  const activeConstellation = CONSTELLATIONS.find((c) => c.id === theme) || CONSTELLATIONS[0];

  return (
    <div
      className={`dynamic-bg-container theme-${theme}`}
      aria-hidden="true"
    >
      {/* 1. Deep Space Base Gradient */}
      <div className="constellation-base" />

      {/* 2. Distant Star Layer (tiny, slow parallax) */}
      <div
        className="star-layer star-layer-distant"
        style={{ transform: `translate3d(0, ${starLayer3Y}px, 0)` }}
      />

      {/* 3. Mid Star Layer (medium stars, moderate parallax) */}
      <div
        className="star-layer star-layer-mid"
        style={{ transform: `translate3d(0, ${starLayer1Y}px, 0)` }}
      />

      {/* 4. Close Star Layer (brighter, faster parallax) */}
      <div
        className="star-layer star-layer-close"
        style={{ transform: `translate3d(0, ${starLayer2Y}px, 0)` }}
      />

      {/* 5. DYNAMIC SCROLL-REACTIVE CONSTELLATIONS SVG CANVAS */}
      <svg
        className="constellations-canvas"
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Diffraction Flare Gradients */}
          <radialGradient id="flare-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="15%" stopColor="#fff2c2" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#e8b84d" stopOpacity="0.6" />
            <stop offset="75%" stopColor="#b58012" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#e8b84d" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="flare-emerald" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="18%" stopColor="#b3ffef" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#00ffd2" stopOpacity="0.6" />
            <stop offset="75%" stopColor="#00bfa5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00ffd2" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="flare-cyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="18%" stopColor="#ccf8ff" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#00e5ff" stopOpacity="0.6" />
            <stop offset="75%" stopColor="#0091ea" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </radialGradient>

          <filter id="starlight-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render each constellation group with smooth cross-fade */}
        {CONSTELLATIONS.map((c) => {
          const isActive = c.id === theme;
          return (
            <g
              key={c.id}
              className={`constellation-group ${isActive ? 'active' : ''}`}
            >
              {/* Lines Layer */}
              <g className="constellation-lines-layer" filter="url(#starlight-glow)">
                {c.lines.map(([x1, y1, x2, y2], lIdx) => (
                  <line
                    key={lIdx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className="constellation-line"
                  />
                ))}
                {c.dashedLines &&
                  c.dashedLines.map(([x1, y1, x2, y2], dIdx) => (
                    <line
                      key={`dash-${dIdx}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      className="constellation-line-dashed"
                    />
                  ))}
              </g>

              {/* Stars & Diamond Starlight Flares Layer */}
              <g className="constellation-stars-layer">
                {c.stars.map((star, sIdx) => {
                  const flareGradient =
                    star.color === 'gold'
                      ? 'url(#flare-gold)'
                      : star.color === 'cyan'
                      ? 'url(#flare-cyan)'
                      : 'url(#flare-emerald)';

                  const spikeFill =
                    star.color === 'gold'
                      ? '#ffe89e'
                      : star.color === 'cyan'
                      ? '#a8f5ff'
                      : '#9effeb';

                  const fSize = star.flareSize || 22;
                  const half = fSize;
                  const thin = 1.3;
                  const diagHalf = fSize * 0.45;
                  const diagThin = 0.85;

                  return (
                    <g
                      key={sIdx}
                      className={`star-node ${star.flare ? 'has-flare' : ''}`}
                    >
                      {/* 1. Breathing Glow Halo */}
                      {star.flare && (
                        <circle
                          cx={star.cx}
                          cy={star.cy}
                          r={fSize * 0.9}
                          fill={flareGradient}
                          className="starlight-halo"
                        />
                      )}

                      {/* 2. 4-Point Diamond Diffraction Spikes (Cahaya Bintang Ciamik) */}
                      {star.flare && (
                        <g className="starlight-spikes-group">
                          {/* Vertical spike */}
                          <polygon
                            points={`${star.cx},${star.cy - half} ${star.cx + thin},${star.cy} ${star.cx},${star.cy + half} ${star.cx - thin},${star.cy}`}
                            fill={spikeFill}
                            className="spike-primary"
                          />
                          {/* Horizontal spike */}
                          <polygon
                            points={`${star.cx - half},${star.cy} ${star.cx},${star.cy + thin} ${star.cx + half},${star.cy} ${star.cx},${star.cy - thin}`}
                            fill={spikeFill}
                            className="spike-primary"
                          />
                          {/* 45-degree micro diagonal spikes */}
                          <polygon
                            points={`${star.cx - diagHalf},${star.cy - diagHalf} ${star.cx + diagThin},${star.cy - diagThin} ${star.cx + diagHalf},${star.cy + diagHalf} ${star.cx - diagThin},${star.cy + diagThin}`}
                            fill={spikeFill}
                            opacity="0.65"
                          />
                          <polygon
                            points={`${star.cx + diagHalf},${star.cy - diagHalf} ${star.cx + diagThin},${star.cy + diagThin} ${star.cx - diagHalf},${star.cy + diagHalf} ${star.cx - diagThin},${star.cy - diagThin}`}
                            fill={spikeFill}
                            opacity="0.65"
                          />
                        </g>
                      )}

                      {/* 3. Outer Star Glow Node */}
                      <circle
                        cx={star.cx}
                        cy={star.cy}
                        r={star.r + 1.2}
                        className={`star-glow star-glow-${star.color}`}
                      />

                      {/* 4. Core Star Dot */}
                      <circle
                        cx={star.cx}
                        cy={star.cy}
                        r={star.r}
                        className={`star-core star-core-${star.color}`}
                      />

                      {/* 5. Hot white center core */}
                      <circle
                        cx={star.cx}
                        cy={star.cy}
                        r={Math.max(1, star.r * 0.5)}
                        fill="#ffffff"
                        className="star-hotspot"
                      />
                    </g>
                  );
                })}
              </g>
            </g>
          );
        })}
      </svg>

      {/* 6. Shooting Stars (Desktop only for battery and zero-overflow safety) */}
      <div className="shooting-stars-wrapper">
        <div className="shooting-star shooting-star-1" />
        <div className="shooting-star shooting-star-2" />
        <div className="shooting-star shooting-star-3" />
      </div>

      {/* 7. Soft Nebula Clouds (Emerald theme morphing) */}
      <div
        className="nebula nebula-1"
        style={{
          transform: `translate3d(${nebula1X}px, ${nebula1Y}px, 0)`
        }}
      />
      <div
        className="nebula nebula-2"
        style={{
          transform: `translate3d(${nebula2X}px, ${nebula2Y}px, 0)`
        }}
      />

      {/* 8. Subtle Celestial Constellation Indicator Badge (Bottom Right) */}
      <div className="celestial-badge">
        <span className="celestial-badge-icon">✧</span>
        <span className="celestial-badge-name">{activeConstellation.name}</span>
        <span className="celestial-badge-arabic">{activeConstellation.arabic}</span>
      </div>

      {/* 9. Ambient Cosmic Vignette */}
      <div className="cosmic-vignette" />
    </div>
  );
}
