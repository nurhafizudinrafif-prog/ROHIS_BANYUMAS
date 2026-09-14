import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CONSTELLATIONS } from './constellationsData';
import './DynamicBackground.css';

export default function DynamicBackground() {
  const location = useLocation();
  const [theme, setTheme] = useState('hero');
  const containerRef = useRef(null);

  // Section selectors mapped to constellations
  const sectionSelectors = [
    { sel: '.hero-cinematic, .page-hero, .hero-slider', theme: 'hero' },
    { sel: '.stats-section, .home-programs-grid, .programs-grid', theme: 'programs' },
    { sel: '.quote-section, .about-story, .about-values-grid, .structure-section', theme: 'quote' },
    { sel: '.home-events-list, .agenda-container, .schools-grid', theme: 'events' },
    { sel: '.gallery-grid, .instagram-section, .articles-grid, .grid-3', theme: 'media' },
    { sel: '.home-cta-section, .contact-form-wrapper, .reg-form, footer', theme: 'cta' }
  ];

  // 1. Initial route check & Ultra-Lightweight Native IntersectionObserver
  // (0ms JavaScript scroll overhead, 0 layout thrashing, 100% compositor driven)
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('agenda')) setTheme('events');
    else if (path.includes('artikel') || path.includes('galeri')) setTheme('media');
    else if (path.includes('program')) setTheme('programs');
    else if (path.includes('tentang')) setTheme('quote');
    else if (path.includes('kontak') || path.includes('pendaftaran')) setTheme('cta');
    else setTheme('hero');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const matchedTheme = entry.target.dataset.bgTheme;
            if (matchedTheme) {
              setTheme((curr) => (curr !== matchedTheme ? matchedTheme : curr));
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-15% 0px -35% 0px',
        threshold: 0.1
      }
    );

    const observeSections = () => {
      sectionSelectors.forEach(({ sel, theme: t }) => {
        const el = document.querySelector(sel);
        if (el) {
          el.dataset.bgTheme = t;
          observer.observe(el);
        }
      });
    };

    observeSections();
    const timer = setTimeout(observeSections, 300);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [location.pathname]);

  // Active constellation details for the celestial badge
  const activeConstellation = CONSTELLATIONS.find((c) => c.id === theme) || CONSTELLATIONS[0];

  return (
    <div
      ref={containerRef}
      className={`dynamic-bg-container theme-${theme}`}
      aria-hidden="true"
    >
      {/* 1. Deep Space Interstellar Atmospheric Base */}
      <div className="constellation-base" />

      {/* 2. Micro-Starfield Depth Layers (Pure GPU CSS, zero main thread cost) */}
      <div className="star-layer star-layer-distant" />
      <div className="star-layer star-layer-mid" />

      {/* 3. Cosmic Dust Nebula Plumes (Soft Hardware Radial Gradients) */}
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />

      {/* 4. CELESTIAL CONSTELLATIONS & ASTROLABE SVG CANVAS */}
      <svg
        className="constellations-canvas"
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Edge Dissolve & Central Readability Softening Mask */}
          <mask id="celestial-clean-mask">
            <rect x="0" y="0" width="1000" height="800" fill="url(#edge-fade-grad)" />
            <ellipse cx="500" cy="400" rx="360" ry="220" fill="url(#readability-center-fade)" />
          </mask>

          <linearGradient id="edge-fade-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="6%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="94%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="readability-center-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
            <stop offset="65%" stopColor="#000000" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Starlight Flare Radial Halos (Hardware-accelerated, 0 filter overhead) */}
          <radialGradient id="flare-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="20%" stopColor="#fff2c2" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#e8b84d" stopOpacity="0.40" />
            <stop offset="100%" stopColor="#e8b84d" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="flare-emerald" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="20%" stopColor="#c2fff5" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#00ffd2" stopOpacity="0.40" />
            <stop offset="100%" stopColor="#00ffd2" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="flare-cyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="20%" stopColor="#c8f6ff" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#00e5ff" stopOpacity="0.40" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 4A. MINIMALIST ISLAMIC CELESTIAL ASTROLABE WATERMARK */}
        <g className="astrolabe-layer" mask="url(#celestial-clean-mask)">
          {/* Concentric Coordinate Guidance Rings */}
          <circle cx="500" cy="400" r="360" className="astrolabe-ring astrolabe-outer" />
          <circle cx="500" cy="400" r="220" className="astrolabe-ring astrolabe-mid" />

          {/* Central 8-Point Islamic Star Rosette (Khatam Sulayman) */}
          <polygon
            points="500,355 532,368 545,400 532,432 500,445 468,432 455,400 468,368"
            className="astrolabe-rosette"
          />
          <circle cx="500" cy="400" r="14" className="astrolabe-rosette-center" />

          {/* Four Cardinal Direction Reference Markers */}
          <circle cx="500" cy="40" r="2.5" className="astrolabe-marker" />
          <circle cx="860" cy="400" r="2.5" className="astrolabe-marker" />
          <circle cx="500" cy="760" r="2.5" className="astrolabe-marker" />
          <circle cx="140" cy="400" r="2.5" className="astrolabe-marker" />
        </g>

        {/* 4B. CELESTIAL CONSTELLATIONS (Smooth, dreamy 1.8s cross-fade) */}
        <g className="all-constellations-mask-group" mask="url(#celestial-clean-mask)">
          {CONSTELLATIONS.map((c) => {
            const isActive = c.id === theme;
            return (
              <g
                key={c.id}
                className={`constellation-content ${isActive ? 'active' : ''}`}
              >
                {/* Celestial Coordinate Orbit Rings */}
                {c.orbitRings && (
                  <g className="constellation-orbit-rings">
                    {c.orbitRings.map((ring, rIdx) => (
                      <circle
                        key={`orbit-${rIdx}`}
                        cx={ring.cx}
                        cy={ring.cy}
                        r={ring.r}
                        className={`constellation-orbit-ring ring-${ring.color}`}
                      />
                    ))}
                  </g>
                )}

                {/* Starlight Asterism Lines (Single crisp filament, zero redundant DOM) */}
                <g className="constellation-lines-group">
                  {c.lines.map(([x1, y1, x2, y2], lIdx) => (
                    <line
                      key={`line-${lIdx}`}
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

                {/* Stars & Diamond Starlight Diffraction Flares */}
                <g className="constellation-stars-group">
                  {c.stars.map((star, sIdx) => {
                    const flareGrad =
                      star.color === 'gold'
                        ? 'url(#flare-gold)'
                        : star.color === 'cyan'
                        ? 'url(#flare-cyan)'
                        : 'url(#flare-emerald)';

                    const spikeColor =
                      star.color === 'gold'
                        ? '#ffe596'
                        : star.color === 'cyan'
                        ? '#c4f8ff'
                        : '#afffe9';

                    const fSize = star.flareSize || 22;
                    const half = fSize * 0.95;
                    const thin = 0.9;

                    return (
                      <g key={sIdx} className="star-node">
                        {/* 1. Soft Radial Bloom Halo */}
                        {star.flare && (
                          <circle
                            cx={star.cx}
                            cy={star.cy}
                            r={fSize * 0.9}
                            fill={flareGrad}
                            className="starlight-halo"
                          />
                        )}

                        {/* 2. Razor-Thin 4-Point Starlight Needles (Clean SVG, 0 filter overhead) */}
                        {star.flare && (
                          <g className="starlight-spikes">
                            <polygon
                              points={`${star.cx},${star.cy - half} ${star.cx + thin},${star.cy} ${star.cx},${star.cy + half} ${star.cx - thin},${star.cy}`}
                              fill={spikeColor}
                            />
                            <polygon
                              points={`${star.cx - half},${star.cy} ${star.cx},${star.cy + thin} ${star.cx + half},${star.cy} ${star.cx - thin},${star.cy}`}
                              fill={spikeColor}
                            />
                          </g>
                        )}

                        {/* 3. Outer Star Glow Dot */}
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

                        {/* 5. Hot Stardust Center Pinprick */}
                        <circle
                          cx={star.cx}
                          cy={star.cy}
                          r={Math.max(0.9, star.r * 0.42)}
                          fill="#ffffff"
                        />
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* 5. Subtle Celestial Constellation Badge (Bottom Left) */}
      <div className="celestial-badge">
        <div className="celestial-badge-pulse" />
        <div className="celestial-badge-content">
          <div className="celestial-badge-top">
            <span className="celestial-badge-icon">✦</span>
            <span className="celestial-badge-arabic">{activeConstellation.arabic}</span>
          </div>
          <div className="celestial-badge-name">{activeConstellation.name}</div>
        </div>
      </div>
    </div>
  );
}
