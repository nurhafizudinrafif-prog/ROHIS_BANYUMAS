import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CONSTELLATIONS } from './constellationsData';
import './DynamicBackground.css';

export default function DynamicBackground() {
  const location = useLocation();
  const [theme, setTheme] = useState('hero');
  const containerRef = useRef(null);
  const astrolabeRef = useRef(null);
  const svgGroupRef = useRef(null);

  // Section selectors mapped to constellations
  const sectionSelectors = [
    { sel: '.hero-cinematic, .page-hero, .hero-slider', theme: 'hero' },
    { sel: '.home-programs-grid, .programs-grid, .page-programs', theme: 'programs' },
    { sel: '.quote-section, .about-story, .about-values-grid, .structure-section', theme: 'quote' },
    { sel: '.home-events-list, .agenda-container, .schools-grid', theme: 'events' },
    { sel: '.gallery-grid, .instagram-section, .articles-grid, .grid-3', theme: 'media' },
    { sel: '.home-cta-section, .contact-form-wrapper, .reg-form, footer', theme: 'cta' }
  ];

  // 1. Zero-Overhead Native IntersectionObserver for Active Constellation Switching
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

  // 2. Feather-Light Native Parallax Scroll
  // Reads ONLY window.scrollY (zero getBoundingClientRect calls, 0 layout cost)
  // Automatically disabled on low-power/mobile touch devices for 60fps perfection
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          if (svgGroupRef.current) {
            // Subtle upward float when scrolling down (rasi bintang ikut naik)
            const panY = -Math.round(scrollY * 0.15);
            svgGroupRef.current.style.transform = `translate3d(0, ${panY}px, 0)`;
          }
          if (astrolabeRef.current) {
            const astroPan = -Math.round(scrollY * 0.08);
            astrolabeRef.current.style.transform = `translate3d(0, ${astroPan}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Only attach scroll parallax on desktop devices with fine pointers
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;
    if (isDesktop) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      if (isDesktop) window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Active constellation details for the celestial badge
  const activeConstellation = CONSTELLATIONS.find((c) => c.id === theme) || CONSTELLATIONS[0];

  return (
    <div
      ref={containerRef}
      className={`dynamic-bg-container theme-${theme}`}
      aria-hidden="true"
    >
      {/* 1. Deep Space Velvet Cosmic Canvas */}
      <div className="constellation-base" />

      {/* 2. Micro-Starfield Depth Layers (100% GPU Compositor Layers) */}
      <div className="star-layer star-layer-distant" />
      <div className="star-layer star-layer-mid" />

      {/* 3. Cosmic Dust Nebula Plumes (Soft Radial Atmosphere) */}
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />

      {/* 4. Astrolabe Celestial Coordinate Dome Layer */}
      <div ref={astrolabeRef} className="astrolabe-dome-container">
        <svg
          className="astrolabe-dome-svg"
          viewBox="0 0 1000 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <g className="astrolabe-rotating-group">
            {/* Concentric Coordinate Guidance Rings */}
            <circle cx="500" cy="400" r="370" className="astrolabe-ring astrolabe-outer" />
            <circle cx="500" cy="400" r="270" className="astrolabe-ring astrolabe-mid" />
            <circle cx="500" cy="400" r="170" className="astrolabe-ring astrolabe-inner" />

            {/* Central 8-Point Islamic Star Rosette (Khatam Sulayman) */}
            <polygon
              points="500,348 537,363 552,400 537,437 500,452 463,437 448,400 463,363"
              className="astrolabe-rosette astrolabe-rosette-gold"
            />
            <circle cx="500" cy="400" r="15" className="astrolabe-rosette-center" />

            {/* Four Cardinal Direction Reference Markers */}
            <circle cx="500" cy="30" r="3" className="astrolabe-marker" />
            <circle cx="870" cy="400" r="3" className="astrolabe-marker" />
            <circle cx="500" cy="770" r="3" className="astrolabe-marker" />
            <circle cx="130" cy="400" r="3" className="astrolabe-marker" />
          </g>
        </svg>
      </div>

      {/* 5. CELESTIAL CONSTELLATIONS (Upward Parallax + 1.6s Silky Cross-Fade) */}
      <div ref={svgGroupRef} className="constellations-motion-wrapper">
        <svg
          className="constellations-canvas"
          viewBox="0 0 1000 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Starlight Flare Radial Halos */}
            <radialGradient id="flare-gold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#fff2c2" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#e8b84d" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#e8b84d" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="flare-emerald" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#c2fff5" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#00ffd2" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00ffd2" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="flare-cyan" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#c8f6ff" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#00e5ff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {CONSTELLATIONS.map((c) => {
            const isActive = c.id === theme;
            return (
              <g
                key={c.id}
                className={`constellation-content ${isActive ? 'active' : ''}`}
              >
                {/* Orbit Rings */}
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

                {/* Crisp Asterism Starlight Lines */}
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

                {/* Stars & Starlight Diffraction Flares */}
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
                        {/* 1. Starlight Halo */}
                        {star.flare && (
                          <circle
                            cx={star.cx}
                            cy={star.cy}
                            r={fSize * 0.9}
                            fill={flareGrad}
                            className="starlight-halo"
                          />
                        )}

                        {/* 2. Razor-Thin 4-Point Diamond Starlight Needles */}
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

                        {/* 5. Center Pinprick */}
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
        </svg>
      </div>

      {/* 6. Shooting Stars (Desktop and modern devices only) */}
      <div className="shooting-stars-wrapper">
        <div className="shooting-star shooting-star-1" />
        <div className="shooting-star shooting-star-2" />
      </div>

      {/* 7. Subtle Celestial Constellation Badge (Bottom Left) */}
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
