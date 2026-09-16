import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ConstellationBackground from './ConstellationBackground';
import './DynamicBackground.css';

/**
 * =========================================================================
 * ROHIS KABUPATEN BANYUMAS — DYNAMIC SECTION ATMOSPHERE SYSTEM
 *
 * Art Direction:
 * Premium Dark + Modern Islamic Geometry + Liquid Glass Atmosphere +
 * Cinematic Ambient Light + Digital Architecture + Spatial Depth
 *
 * Color Architecture Target:
 * 70%: Near-black / deep obsidian charcoal (#010405, #020708, #030807)
 * 20%: Very dark forest green / dark teal (#041c18, #072b24, #031a20)
 *  8%: Deep emerald (diffused ambient reflected light)
 *  2%: Subtle cyan / muted gold accent (#00cdb8, #d7b866)
 *
 * Section System (7 Distinct Living Atmospheres):
 * 1. HERO / BERANDA: Deepest obsidian, emerald radial glow, soft cyan highlight, modern Islamic Khatam 8-point tessellation.
 * 2. TENTANG: Warmer forest-black, architectural interlocking grid/arches, diagonal ambient light beam, subtle warm gold.
 * 3. PROGRAM & AGENDA: Deep charcoal + dark teal, connected geometric nodes & starburst lines, focused circular lighting.
 * 4. ARTIKEL: Editorial charcoal, minimal architectural grid & editorial lines, high negative space, maximum text readability.
 * 5. GALERI: Cinematic dark atmosphere, large blurred shapes, diffused reflections, minimal geometry supporting photography.
 * 6. ROHIS ANGGOTA: Deep forest-black, symmetrical structural network, faint luminous nodes, organized institutional calmness.
 * 7. KONTAK / SIAP BERGABUNG: Charcoal + teal + soft emerald, minimal rosette, soft ambient bloom, peaceful conclusive closing.
 * =========================================================================
 */

const SECTIONS = ['hero', 'about', 'program', 'article', 'gallery', 'members', 'contact'];

const SECTION_CONFIG = {
  hero: {
    id: 'hero',
    name: 'Hero / Beranda',
    patternOpacity: 0.026, // 1.5% - 3.0%
    baseColor: '#010405',
  },
  about: {
    id: 'about',
    name: 'Tentang',
    patternOpacity: 0.024,
    baseColor: '#020605',
  },
  program: {
    id: 'program',
    name: 'Program & Agenda',
    patternOpacity: 0.025,
    baseColor: '#010709',
  },
  article: {
    id: 'article',
    name: 'Artikel',
    patternOpacity: 0.016, // High negative space, editorial minimalism
    baseColor: '#010405',
  },
  gallery: {
    id: 'gallery',
    name: 'Galeri',
    patternOpacity: 0.018, // Reduced density to support photography
    baseColor: '#010405',
  },
  members: {
    id: 'members',
    name: 'ROHIS Anggota',
    patternOpacity: 0.024,
    baseColor: '#010604',
  },
  contact: {
    id: 'contact',
    name: 'Kontak / Siap Bergabung',
    patternOpacity: 0.015, // Most minimal, peaceful closing
    baseColor: '#010405',
  },
};

const ROUTE_SECTION_MAP = {
  '/': 'hero',
  '/tentang': 'about',
  '/program': 'program',
  '/agenda': 'program',
  '/artikel': 'article',
  '/galeri': 'gallery',
  '/rohis-anggota': 'members',
  '/kontak': 'contact',
  '/pendaftaran': 'contact',
};

export default function DynamicBackground() {
  const location = useLocation();
  const containerRef = useRef(null);
  const layerRefs = useRef({});
  const patternRefs = useRef({});
  const radialRefs = useRef({});
  const organicRefs = useRef({});
  const glowRefs = useRef({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = null;
    let isTicking = false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isHomePage = location.pathname === '/';
    const subpageSection =
      ROUTE_SECTION_MAP[location.pathname] ||
      (location.pathname.startsWith('/artikel/') ? 'article' : 'hero');

    // Section anchor selectors on the Home page
    const sectionSelectors = [
      '[data-section="hero"], .hero',
      '[data-section="about"]',
      '[data-section="program"], #program',
      '[data-section="article"]',
      '[data-section="gallery"]',
      '[data-section="members"]',
      '[data-section="contact"], .home-cta-section',
    ];

    // Cached anchor offsets to eliminate layout thrashing during scroll
    let cachedTriggers = [];

    function calculateTriggerPositions() {
      if (!isHomePage) return;

      const windowHeight = window.innerHeight || 800;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

      cachedTriggers = sectionSelectors.map((sel, idx) => {
        if (idx === 0) return 0;
        const el = document.querySelector(sel);
        if (!el) {
          // Fallback estimated spacing if section is temporarily not in DOM
          return idx * 850;
        }
        const rect = el.getBoundingClientRect();
        // Transition starts as incoming section approaches top 42% of viewport
        return Math.max(0, rect.top + scrollY - windowHeight * 0.42);
      });

      // Guarantee strict monotonic progression
      for (let i = 1; i < cachedTriggers.length; i++) {
        if (cachedTriggers[i] <= cachedTriggers[i - 1] + 60) {
          cachedTriggers[i] = cachedTriggers[i - 1] + 120;
        }
      }
    }

    // Measure positions on mount and window resize
    calculateTriggerPositions();

    function updateAtmosphere() {
      isTicking = false;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const windowHeight = window.innerHeight || 800;
      const isMobile = window.innerWidth < 768;

      let activeIndex = 0;
      let nextIndex = 0;
      let ratio = 0;

      if (isHomePage) {
        if (!cachedTriggers.length) {
          calculateTriggerPositions();
        }

        const len = cachedTriggers.length;
        if (scrollY <= cachedTriggers[0]) {
          activeIndex = 0;
          nextIndex = 0;
          ratio = 0;
        } else if (scrollY >= cachedTriggers[len - 1]) {
          activeIndex = len - 1;
          nextIndex = len - 1;
          ratio = 1;
        } else {
          for (let i = 0; i < len - 1; i++) {
            const start = cachedTriggers[i];
            const end = cachedTriggers[i + 1];
            if (scrollY >= start && scrollY < end) {
              activeIndex = i;
              nextIndex = i + 1;
              const span = Math.max(1, end - start);
              ratio = Math.min(1, Math.max(0, (scrollY - start) / span));
              break;
            }
          }
        }

        // Bottom-of-page safeguard: smoothly lock to final contact section
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 1;
        if (scrollY + windowHeight >= scrollHeight - 60) {
          activeIndex = len - 1;
          nextIndex = len - 1;
          ratio = 1;
        }
      } else {
        // Dedicated subpage: active atmosphere mapped to page route
        const targetIdx = SECTIONS.indexOf(subpageSection);
        activeIndex = targetIdx >= 0 ? targetIdx : 0;
        nextIndex = activeIndex;
        ratio = 0;
      }

      // Smooth cosine interpolation curve:
      // A (100%) -> A (90%) B (10%) -> A (50%) B (50%) -> A (10%) B (90%) -> B (100%)
      const smoothRatio = 0.5 - 0.5 * Math.cos(ratio * Math.PI);

      // Section weights calculation
      const weights = {};
      SECTIONS.forEach((sec, idx) => {
        if (idx === activeIndex && idx === nextIndex) {
          weights[sec] = 1;
        } else if (idx === activeIndex) {
          weights[sec] = 1 - smoothRatio;
        } else if (idx === nextIndex) {
          weights[sec] = smoothRatio;
        } else {
          weights[sec] = 0;
        }
      });

      // Apply GPU-accelerated weights & morphing transforms to each section layer
      SECTIONS.forEach((sec, idx) => {
        const layerEl = layerRefs.current[sec];
        if (!layerEl) return;
        const w = weights[sec] || 0;

        if (w > 0.0005) {
          layerEl.style.display = 'block';
          layerEl.style.opacity = w.toFixed(4);

          // -------------------------------------------------------------
          // Layer 05: Geometric Motif Morphing
          // Smooth scale (1.00 <-> 1.04), rotation (0 <-> 1.5deg), 3% Parallax
          // -------------------------------------------------------------
          const patternEl = patternRefs.current[sec];
          if (patternEl) {
            const baseOp = SECTION_CONFIG[sec].patternOpacity;
            const finalOp = isMobile ? baseOp * 0.75 : baseOp;
            patternEl.style.opacity = (w * finalOp).toFixed(4);

            if (!prefersReducedMotion) {
              const scale = (1.04 - w * 0.04).toFixed(3);
              const rot = ((1 - w) * (idx % 2 === 0 ? 1.5 : -1.5)).toFixed(2);
              const patternParallax = (scrollY * -0.03).toFixed(1); // 3% Parallax
              patternEl.style.transform = `translate3d(0, ${patternParallax}px, 0) scale(${scale}) rotate(${rot}deg)`;
            } else {
              patternEl.style.transform = 'none';
            }
          }

          // -------------------------------------------------------------
          // Multi-Tiered Parallax & Subtle Transitional Displacement:
          // Layer 02: Radial Gradients (4% Parallax)
          // Layer 04: Organic Liquid Shapes (8% Parallax)
          // Layer 07: Ambient Bloom / Glow (6% Parallax)
          // -------------------------------------------------------------
          if (!prefersReducedMotion) {
            const radialEl = radialRefs.current[sec];
            if (radialEl) {
              const pY = (scrollY * -0.04).toFixed(1);
              const shiftX = ((1 - w) * (idx % 2 === 0 ? 15 : -15)).toFixed(1);
              radialEl.style.transform = `translate3d(${shiftX}px, ${pY}px, 0)`;
            }

            const organicEl = organicRefs.current[sec];
            if (organicEl) {
              const pY = (scrollY * -0.08).toFixed(1);
              const shiftX = ((1 - w) * (idx % 2 === 0 ? 25 : -25)).toFixed(1);
              organicEl.style.transform = `translate3d(${shiftX}px, ${pY}px, 0)`;
            }

            const glowEl = glowRefs.current[sec];
            if (glowEl) {
              const pY = (scrollY * -0.06).toFixed(1);
              glowEl.style.transform = `translate3d(0, ${pY}px, 0)`;
            }
          }
        } else {
          layerEl.style.display = 'none';
          layerEl.style.opacity = '0';
        }
      });

      // Update semantic attributes on container
      container.setAttribute('data-active-section', SECTIONS[activeIndex]);
      container.setAttribute('data-next-section', SECTIONS[nextIndex]);
      container.style.setProperty('--morph-progress', smoothRatio.toFixed(3));
    }

    function onScroll() {
      if (!isTicking) {
        isTicking = true;
        rafId = requestAnimationFrame(updateAtmosphere);
      }
    }

    function onResize() {
      calculateTriggerPositions();
      onScroll();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Re-check positions after fonts & dynamic images settle
    const loadTimeout = setTimeout(() => {
      calculateTriggerPositions();
      updateAtmosphere();
    }, 450);

    updateAtmosphere();

    return () => {
      clearTimeout(loadTimeout);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  return (
    <div className="dynamic-environment-container" ref={containerRef} aria-hidden="true">
      {/* =========================================================
          MULTI-LAYER SECTION BACKGROUNDS (7 Dedicated Section Atmospheres)
          Each section container encapsulates Layers 1-7 tailored to its visual role.
          Continuously interpolated via the GPU scroll morphing engine.
          ========================================================= */}
      {SECTIONS.map((sec) => (
        <div
          key={sec}
          className={`background-layer section-${sec}`}
          ref={(el) => (layerRefs.current[sec] = el)}
        >
          {/* Layer 01: Base Dark Color Foundation */}
          <div className="layer-base" />

          {/* Layer 02: Primary Atmospheric Gradient (4% Parallax) */}
          <div className="layer-radial" ref={(el) => (radialRefs.current[sec] = el)}>
            <div className="radial-glow glow-1" />
            <div className="radial-glow glow-2" />
            <div className="radial-glow glow-3" />
          </div>

          {/* Layer 04: Blurred Organic Liquid Forms (8% Parallax & Drifting) */}
          <div className="layer-organic" ref={(el) => (organicRefs.current[sec] = el)}>
            <div className="organic-blob blob-a" />
            <div className="organic-blob blob-b" />
          </div>

          {/* Layer 05: Modern Islamic Geometric Pattern Plane (3% Parallax & Morphing) */}
          <div
            className={`layer-pattern pattern-${sec}`}
            ref={(el) => (patternRefs.current[sec] = el)}
          />

          {/* Layer 06: Thin Architectural Spatial Lines & Digital Guides */}
          <div className="layer-architecture">
            <div className="arch-guide arch-v1" />
            <div className="arch-guide arch-v2" />
            <div className="arch-guide arch-diag" />
          </div>

          {/* Layer 07: Ambient Bloom & Reflected Light (6% Parallax) */}
          <div className="layer-glow" ref={(el) => (glowRefs.current[sec] = el)} />
        </div>
      ))}

      {/* =========================================================
          LAYER 08: Atmospheric Dust Motes
          Microscopic floating light particles in ambient sanctuary light
          ========================================================= */}
      <ConstellationBackground />

      {/* =========================================================
          LAYER 09: Procedural Analog Film Grain (Eliminates OLED Banding)
          True SVG noise texture replacing coarse polka-dots
          ========================================================= */}
      <div className="env-layer-noise" />

      {/* =========================================================
          LAYER 10: Cinematic Spatial Vignette
          Soft perimeter darkening focusing gaze on sharp liquid glass cards
          ========================================================= */}
      <div className="env-layer-vignette" />

      {/* =========================================================
          LAYER 11: Tactile Glass Specular Refraction Sheen
          Subtle 130-degree ambient light line for realistic optical depth
          ========================================================= */}
      <div className="env-layer-specular" />
    </div>
  );
}
