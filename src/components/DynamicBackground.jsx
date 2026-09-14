import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CONSTELLATIONS } from './constellationsData';
import './DynamicBackground.css';

export default function DynamicBackground() {
  const location = useLocation();
  const [theme, setTheme] = useState('hero');

  // Direct element references for 60-120fps GPU native transforms
  const containerRef = useRef(null);
  const astrolabeRef = useRef(null);
  const groupRefs = useRef({});
  const star1Ref = useRef(null);
  const star2Ref = useRef(null);
  const star3Ref = useRef(null);
  const nebula1Ref = useRef(null);
  const nebula2Ref = useRef(null);
  const rafRef = useRef(null);

  // Section selectors mapped to constellations and logical hierarchy
  const sectionSelectors = [
    { sel: '.hero-cinematic, .page-hero, .hero-slider', theme: 'hero', index: 0 },
    { sel: '.stats-section, .home-programs-grid, .programs-grid', theme: 'programs', index: 1 },
    { sel: '.quote-section, .about-story, .about-values-grid, .structure-section', theme: 'quote', index: 2 },
    { sel: '.home-events-list, .agenda-container, .schools-grid', theme: 'events', index: 3 },
    { sel: '.gallery-grid, .instagram-section, .articles-grid, .grid-3', theme: 'media', index: 4 },
    { sel: '.home-cta-section, .contact-form-wrapper, .reg-form, footer', theme: 'cta', index: 5 }
  ];

  // 1. Initial route detection
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('agenda')) setTheme('events');
    else if (path.includes('artikel') || path.includes('galeri')) setTheme('media');
    else if (path.includes('program')) setTheme('programs');
    else if (path.includes('tentang')) setTheme('quote');
    else if (path.includes('kontak') || path.includes('pendaftaran')) setTheme('cta');
    else setTheme('hero');
  }, [location.pathname]);

  // 2. High-Performance True Scroll Parallax & Section Cross-Fade Listener
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const windowH = window.innerHeight;
        const docH = document.documentElement.scrollHeight;
        const maxScroll = Math.max(1, docH - windowH);
        const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

        // Bottom of page guarantee
        const isBottom = windowH + scrollY >= docH - 120;
        let dominantTheme = isBottom ? 'cta' : null;
        let minDistance = Infinity;
        const focalY = windowH * 0.44;

        // Compute true section-relative scroll offsets
        const computedPans = {};

        sectionSelectors.forEach(({ sel, theme: t }) => {
          const el = document.querySelector(sel);
          if (el) {
            const rect = el.getBoundingClientRect();
            const center = (rect.top + rect.bottom) / 2;
            const dist = Math.abs(center - focalY);

            if (!isBottom && dist < minDistance && rect.bottom > 20 && rect.top < windowH - 20) {
              minDistance = dist;
              dominantTheme = t;
            }

            // Section-relative scroll parallax:
            // When section is centered at focalY, pan is 0.
            // As user scrolls down, section center moves up (diff < 0), so constellation pans UP!
            const diff = center - focalY;
            computedPans[t] = Math.round(diff * 0.38);
          }
        });

        // Trigger state change only when section switches (super smooth 3.2s CSS transition handles fade)
        if (dominantTheme) {
          setTheme((curr) => (curr !== dominantTheme ? dominantTheme : curr));
        }

        const effectiveTheme = dominantTheme || theme;
        const activeIdx = sectionSelectors.findIndex((s) => s.theme === effectiveTheme);
        const activePan = computedPans[effectiveTheme] ?? 0;

        // Apply native SVG translation directly to each constellation's outer scroll layer
        sectionSelectors.forEach(({ theme: t, index }) => {
          if (computedPans[t] === undefined) {
            computedPans[t] = Math.round(activePan + (index - activeIdx) * 360);
          }
          const gEl = groupRefs.current[t];
          if (gEl) {
            gEl.setAttribute('transform', `translate(0, ${computedPans[t]})`);
          }
        });

        // Astrolabe coordinate layer subtle parallax drift
        if (astrolabeRef.current) {
          const astroPan = Math.round(activePan * 0.20);
          astrolabeRef.current.setAttribute('transform', `translate(0, ${astroPan})`);
        }

        // Starfield depth layers
        if (star1Ref.current) {
          star1Ref.current.style.transform = `translate3d(0, ${-scrollY * 0.08}px, 0)`;
        }
        if (star2Ref.current) {
          star2Ref.current.style.transform = `translate3d(0, ${-scrollY * 0.16}px, 0)`;
        }
        if (star3Ref.current) {
          star3Ref.current.style.transform = `translate3d(0, ${-scrollY * 0.28}px, 0)`;
        }

        // Nebula clouds slow organic morph
        if (nebula1Ref.current) {
          const n1X = Math.sin(progress * Math.PI * 2) * 45;
          const n1Y = Math.cos(progress * Math.PI * 2) * 25 + progress * 50;
          nebula1Ref.current.style.transform = `translate3d(${n1X}px, ${n1Y}px, 0)`;
        }
        if (nebula2Ref.current) {
          const n2X = -Math.cos(progress * Math.PI * 2) * 55;
          const n2Y = Math.sin(progress * Math.PI * 2) * 35 - progress * 60;
          nebula2Ref.current.style.transform = `translate3d(${n2X}px, ${n2Y}px, 0)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [theme]);

  // Active constellation details for the celestial badge
  const activeConstellation = CONSTELLATIONS.find((c) => c.id === theme) || CONSTELLATIONS[0];

  return (
    <div
      ref={containerRef}
      className={`dynamic-bg-container theme-${theme}`}
      aria-hidden="true"
    >
      {/* 1. Deep Space Base Gradient */}
      <div className="constellation-base" />

      {/* 2. Distant Star Layer (tiny, slow parallax) */}
      <div ref={star1Ref} className="star-layer star-layer-distant" />

      {/* 3. Mid Star Layer (medium stars, moderate parallax) */}
      <div ref={star2Ref} className="star-layer star-layer-mid" />

      {/* 4. Close Star Layer (brightest stars, fastest parallax) */}
      <div ref={star3Ref} className="star-layer star-layer-close" />

      {/* 5. CELESTIAL CONSTELLATIONS & ASTROLABE SVG CANVAS */}
      <svg
        className="constellations-canvas"
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Vertical Edge Dissolve Mask */}
          <mask id="celestial-fade-mask">
            <rect x="0" y="0" width="1000" height="800" fill="url(#celestial-fade-grad)" />
          </mask>
          <linearGradient id="celestial-fade-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="8%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="92%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Starlight Flare Radial Gradients */}
          <radialGradient id="flare-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="14%" stopColor="#fff4c8" stopOpacity="0.95" />
            <stop offset="42%" stopColor="#e8b84d" stopOpacity="0.65" />
            <stop offset="72%" stopColor="#b58012" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#e8b84d" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="flare-emerald" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="16%" stopColor="#bafff2" stopOpacity="0.95" />
            <stop offset="42%" stopColor="#00ffd2" stopOpacity="0.65" />
            <stop offset="72%" stopColor="#00bfa5" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#00ffd2" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="flare-cyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="16%" stopColor="#d1f9ff" stopOpacity="0.95" />
            <stop offset="42%" stopColor="#00e5ff" stopOpacity="0.65" />
            <stop offset="72%" stopColor="#0091ea" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </radialGradient>

          {/* Starlight Line Glow Filter */}
          <filter id="starlight-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur1" />
            <feGaussianBlur stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 5A. ISLAMIC CELESTIAL ASTROLABE RINGS */}
        <g
          ref={astrolabeRef}
          className="astrolabe-layer"
          mask="url(#celestial-fade-mask)"
        >
          <g className="astrolabe-rotating-group">
            {/* Concentric Coordinate Circles */}
            <circle cx="500" cy="400" r="370" className="astrolabe-ring astrolabe-outer" />
            <circle cx="500" cy="400" r="280" className="astrolabe-ring astrolabe-mid" />
            <circle cx="500" cy="400" r="180" className="astrolabe-ring astrolabe-inner" />
            <circle cx="500" cy="400" r="85" className="astrolabe-ring astrolabe-core" />

            {/* Ecliptic tilted ring (23.5 deg obliquity of celestial sphere) */}
            <ellipse
              cx="500"
              cy="400"
              rx="350"
              ry="240"
              transform="rotate(-23.5 500 400)"
              className="astrolabe-ring astrolabe-ecliptic"
            />

            {/* Crosshair Axes with degree ticks */}
            <line x1="120" y1="400" x2="880" y2="400" className="astrolabe-axis" />
            <line x1="500" y1="20" x2="500" y2="780" className="astrolabe-axis" />
            <line x1="230" y1="130" x2="770" y2="670" className="astrolabe-axis-subtle" />
            <line x1="770" y1="130" x2="230" y2="670" className="astrolabe-axis-subtle" />

            {/* Astrolabe Pointer Markers */}
            <circle cx="500" cy="30" r="3.5" className="astrolabe-marker" />
            <circle cx="870" cy="400" r="3.5" className="astrolabe-marker" />
            <circle cx="500" cy="770" r="3.5" className="astrolabe-marker" />
            <circle cx="130" cy="400" r="3.5" className="astrolabe-marker" />
          </g>
        </g>

        {/* 5B. RENDER EACH CONSTELLATION (Scroll wrapper + 3.2s silky cross-fade content) */}
        <g className="all-constellations-mask-group" mask="url(#celestial-fade-mask)">
          {CONSTELLATIONS.map((c) => {
            const isActive = c.id === theme;
            return (
              <g
                key={c.id}
                ref={(el) => (groupRefs.current[c.id] = el)}
                className={`constellation-scroll-wrapper constellation-scroll-${c.id}`}
              >
                <g className={`constellation-content ${isActive ? 'active' : ''}`}>
                  {/* Antique Coordinate Orbit Rings */}
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

                  {/* Stars & 8-Point Diamond Starlight Flares Layer */}
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

                      const fSize = star.flareSize || 24;
                      const half = fSize;
                      const thin = 1.35;
                      const diagHalf = fSize * 0.46;
                      const diagThin = 0.9;

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
                              r={fSize * 0.95}
                              fill={flareGradient}
                              className="starlight-halo"
                            />
                          )}

                          {/* 2. 8-Point Diamond Diffraction Spikes (Cahaya Bintang Ciamik) */}
                          {star.flare && (
                            <g className="starlight-spikes-group">
                              {/* Primary Vertical Spike */}
                              <polygon
                                points={`${star.cx},${star.cy - half * 1.25} ${star.cx + thin},${star.cy} ${star.cx},${star.cy + half * 1.25} ${star.cx - thin},${star.cy}`}
                                fill={spikeFill}
                                className="spike-primary"
                              />
                              {/* Primary Horizontal Spike */}
                              <polygon
                                points={`${star.cx - half * 1.25},${star.cy} ${star.cx},${star.cy + thin} ${star.cx + half * 1.25},${star.cy} ${star.cx - thin},${star.cy}`}
                                fill={spikeFill}
                                className="spike-primary"
                              />
                              {/* 45-Degree Diagonal Micro Spikes */}
                              <polygon
                                points={`${star.cx - diagHalf},${star.cy - diagHalf} ${star.cx + diagThin},${star.cy - diagThin} ${star.cx + diagHalf},${star.cy + diagHalf} ${star.cx - diagThin},${star.cy + diagThin}`}
                                fill={spikeFill}
                                className="spike-secondary"
                              />
                              <polygon
                                points={`${star.cx + diagHalf},${star.cy - diagHalf} ${star.cx + diagThin},${star.cy + diagThin} ${star.cx - diagHalf},${star.cy + diagHalf} ${star.cx - diagThin},${star.cy - diagThin}`}
                                fill={spikeFill}
                                className="spike-secondary"
                              />
                            </g>
                          )}

                          {/* 3. Outer Star Glow Node */}
                          <circle
                            cx={star.cx}
                            cy={star.cy}
                            r={star.r + 1.5}
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
                            r={Math.max(1.1, star.r * 0.48)}
                            fill="#ffffff"
                            className="star-hotspot"
                          />
                        </g>
                      );
                    })}
                  </g>
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* 6. Shooting Stars (Desktop only for battery and zero-overflow safety) */}
      <div className="shooting-stars-wrapper">
        <div className="shooting-star shooting-star-1" />
        <div className="shooting-star shooting-star-2" />
        <div className="shooting-star shooting-star-3" />
      </div>

      {/* 7. Soft Nebula Clouds (Emerald theme morphing) */}
      <div ref={nebula1Ref} className="nebula nebula-1" />
      <div ref={nebula2Ref} className="nebula nebula-2" />

      {/* 8. Luxury Islamic Astrolabe Instrument Badge (Bottom Left) */}
      <div className="celestial-badge">
        <div className="celestial-badge-pulse" />
        <div className="celestial-badge-content">
          <div className="celestial-badge-top">
            <span className="celestial-badge-icon">✦</span>
            <span className="celestial-badge-arabic">{activeConstellation.arabic}</span>
          </div>
          <div className="celestial-badge-name">{activeConstellation.name}</div>
          <div className="celestial-badge-desc">{activeConstellation.meaning}</div>
        </div>
      </div>

      {/* 9. Ambient Cosmic Vignette */}
      <div className="cosmic-vignette" />
    </div>
  );
}
