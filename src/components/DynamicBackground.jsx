import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './DynamicBackground.css';

/**
 * =========================================================================
 * DYNAMIC MULTI-LAYER BACKGROUND & SCROLL MORPHING SYSTEM
 * Concept: "PREMIUM DARK ISLAMIC DIGITAL ENVIRONMENT"
 *
 * Section System:
 * 1. HERO / BERANDA: Deepest black, subtle emerald radial light, thin cyan highlight, modern Islamic 8-point tessellation.
 * 2. TENTANG: Architectural geometric pattern, larger grid, subtle diagonal light, translucent abstract curves, soft green haze.
 * 3. PROGRAM & AGENDA: Dark charcoal + dark teal, connected geometric nodes & glowing points, thin connecting lines.
 * 4. ARTIKEL: Editorial dark charcoal, minimal grid + geometric architectural lines, high negative space.
 * 5. GALERI: Cinematic dark atmosphere, large blurred gradients, subtle reflective surfaces, soft emerald lighting.
 * 6. ROHIS ANGGOTA: Deep forest-black, symmetrical geometric structure, subtle luminous network.
 * 7. KONTAK: Deep charcoal, soft teal, subtle emerald, softest minimal star geometry, calm peaceful closing.
 * =========================================================================
 */

const SECTIONS = ['hero', 'about', 'program', 'article', 'gallery', 'members', 'contact'];

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
  const patternRefs = useRef({});
  const blobRefs = useRef([]);
  const gradientRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = null;
    let isTicking = false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detect if we are on a dedicated sub-page or on the home page with multi-section scrolling
    const isHomePage = location.pathname === '/';
    const subpageSection = ROUTE_SECTION_MAP[location.pathname] || (location.pathname.startsWith('/artikel/') ? 'article' : 'hero');

    function updateAtmosphere() {
      isTicking = false;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const windowHeight = window.innerHeight || 800;

      let activeIndex = 0;
      let nextIndex = 1;
      let ratio = 0;

      if (isHomePage) {
        // Collect section anchor elements
        const sectionSelectors = [
          '[data-section="hero"], .hero',
          '[data-section="about"], .home-about-grid',
          '[data-section="program"], #program',
          '[data-section="article"], .home-articles-magazine',
          '[data-section="gallery"], .gallery-grid',
          '[data-section="members"], .network-grid',
          '[data-section="contact"], .home-cta-section',
        ];

        // Measure anchors
        const positions = sectionSelectors.map((sel, idx) => {
          if (idx === 0) return 0;
          const el = document.querySelector(sel);
          if (!el) return idx * 800;
          const rect = el.getBoundingClientRect();
          return rect.top + scrollY - windowHeight * 0.35;
        });

        // Find which pair of sections the user is currently between
        const currentTrigger = scrollY;
        for (let i = 0; i < positions.length - 1; i++) {
          const start = positions[i];
          const end = positions[i + 1];
          if (currentTrigger >= start && currentTrigger < end) {
            activeIndex = i;
            nextIndex = i + 1;
            const span = Math.max(1, end - start);
            ratio = Math.min(1, Math.max(0, (currentTrigger - start) / span));
            break;
          } else if (i === positions.length - 2 && currentTrigger >= end) {
            activeIndex = positions.length - 1;
            nextIndex = positions.length - 1;
            ratio = 1;
          }
        }

        // Check if user is near the bottom of the page -> snap smoothly to contact section
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 1;
        if (scrollY + windowHeight >= scrollHeight - 60) {
          activeIndex = positions.length - 1;
          nextIndex = positions.length - 1;
          ratio = 1;
        }
      } else {
        // Fixed subpage section mapping with smooth static presentation
        const targetIdx = SECTIONS.indexOf(subpageSection);
        activeIndex = targetIdx >= 0 ? targetIdx : 0;
        nextIndex = activeIndex;
        ratio = 0;
      }

      // Smooth cosine interpolation curve for seamless continuous evolution (no hard cut, no jumping)
      const smoothRatio = 0.5 - 0.5 * Math.cos(ratio * Math.PI);

      // Section weights
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

      // Layer 4: Geometric Motif Morphing (Smooth crossfade, scale 1.00 -> 1.04, rotation 0 -> 1.8deg)
      // Calibrated to 1.5% - 3.5% opacity as explicitly instructed for modern architectural subtlety
      const isMobile = window.innerWidth < 768;
      SECTIONS.forEach((sec, idx) => {
        const pEl = patternRefs.current[sec];
        if (!pEl) return;
        const w = weights[sec];

        if (w > 0.001) {
          pEl.style.display = 'block';
          const baseMaxOp = sec === 'hero' ? 0.16
            : sec === 'about' ? 0.14
            : sec === 'program' ? 0.15
            : sec === 'article' ? 0.10
            : sec === 'gallery' ? 0.12
            : sec === 'members' ? 0.14
            : 0.12;
          const maxOp = isMobile ? baseMaxOp * 0.85 : baseMaxOp;
          pEl.style.opacity = (w * maxOp).toFixed(4);

          if (!prefersReducedMotion) {
            const scale = (1.04 - w * 0.04).toFixed(3);
            const rotate = ((1 - w) * (idx % 2 === 0 ? 1.8 : -1.8)).toFixed(2);
            const parallaxY = (scrollY * -0.03).toFixed(1); // 3% Parallax on geometric pattern
            pEl.style.transform = `translate3d(0, ${parallaxY}px, 0) scale(${scale}) rotate(${rotate}deg)`;
          } else {
            pEl.style.transform = 'none';
          }
        } else {
          pEl.style.display = 'none';
          pEl.style.opacity = '0';
        }
      });

      // Parallax offsets for other layers
      if (!prefersReducedMotion) {
        const gradientParallax = (scrollY * -0.05).toFixed(1); // 5% Parallax
        const glowParallax = (scrollY * -0.08).toFixed(1);     // 8% Parallax
        const blobParallax = (scrollY * -0.10).toFixed(1);     // 10% Parallax

        if (gradientRef.current) {
          gradientRef.current.style.transform = `translate3d(0, ${gradientParallax}px, 0)`;
        }
        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(0, ${glowParallax}px, 0)`;
        }
        blobRefs.current.forEach((blob) => {
          if (blob) {
            blob.style.setProperty('--scroll-parallax', `${blobParallax}px`);
          }
        });
      }

      // Continuous section variable blending on container
      container.style.setProperty('--active-section-idx', activeIndex.toString());
      container.style.setProperty('--morph-progress', smoothRatio.toFixed(3));
      container.setAttribute('data-active-section', SECTIONS[activeIndex]);
      container.setAttribute('data-next-section', SECTIONS[nextIndex]);
    }

    function onScroll() {
      if (!isTicking) {
        isTicking = true;
        rafId = requestAnimationFrame(updateAtmosphere);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateAtmosphere();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  return (
    <div className="dynamic-environment-container" ref={containerRef} aria-hidden="true">
      {/* =========================================================
          LAYER 1: Base Dark Atmosphere Foundation
          Multi-stop interpolated gradient: Near black, charcoal, dark forest
          ========================================================= */}
      <div className="env-layer env-layer-base" />

      {/* =========================================================
          LAYER 2: Large Radial Gradients & Evolving Light Horizons
          ========================================================= */}
      <div className="env-layer env-layer-radial" ref={gradientRef}>
        <div className="radial-horizon horizon-primary" />
        <div className="radial-horizon horizon-secondary" />
        <div className="radial-horizon horizon-accent" />
      </div>

      {/* =========================================================
          LAYER 3: Blurred Organic Liquid Shapes (Atmospheric Blobs)
          Soft, rounded, translucent, GPU-accelerated slow ambient drift
          ========================================================= */}
      <div className="env-layer env-layer-organic">
        <div
          className="organic-shape organic-shape-1"
          ref={(el) => (blobRefs.current[0] = el)}
        />
        <div
          className="organic-shape organic-shape-2"
          ref={(el) => (blobRefs.current[1] = el)}
        />
        <div
          className="organic-shape organic-shape-3"
          ref={(el) => (blobRefs.current[2] = el)}
        />
        <div
          className="organic-shape organic-shape-4"
          ref={(el) => (blobRefs.current[3] = el)}
        />
      </div>

      {/* =========================================================
          LAYER 4: Multi-Section Islamic Geometric Motif Morphing Plane
          7 Bespoke SVG Vector Tessellations with subtle scale & rotation
          ========================================================= */}
      <div className="env-layer env-layer-patterns">
        <div
          className="pattern-plane pattern-hero"
          ref={(el) => (patternRefs.current['hero'] = el)}
        />
        <div
          className="pattern-plane pattern-about"
          ref={(el) => (patternRefs.current['about'] = el)}
        />
        <div
          className="pattern-plane pattern-program"
          ref={(el) => (patternRefs.current['program'] = el)}
        />
        <div
          className="pattern-plane pattern-article"
          ref={(el) => (patternRefs.current['article'] = el)}
        />
        <div
          className="pattern-plane pattern-gallery"
          ref={(el) => (patternRefs.current['gallery'] = el)}
        />
        <div
          className="pattern-plane pattern-members"
          ref={(el) => (patternRefs.current['members'] = el)}
        />
        <div
          className="pattern-plane pattern-contact"
          ref={(el) => (patternRefs.current['contact'] = el)}
        />
      </div>

      {/* =========================================================
          LAYER 5: Thin Architectural Spatial Lines & Digital Grid
          ========================================================= */}
      <div className="env-layer env-layer-architecture">
        <div className="arch-guide-line arch-line-v1" />
        <div className="arch-guide-line arch-line-v2" />
        <div className="arch-guide-line arch-line-diag" />
      </div>

      {/* =========================================================
          LAYER 6: Soft Ambient Bloom / Glow
          ========================================================= */}
      <div className="env-layer env-layer-bloom" ref={glowRef} />

      {/* =========================================================
          LAYER 7: Very Subtle Micro-Texture
          Organic tactile depth to eliminate color banding
          ========================================================= */}
      <div className="env-layer env-layer-noise" />

      {/* =========================================================
          LAYER 8: Cinematic Spatial Vignette
          Darkens viewport perimeter, focusing gaze on glass cards
          ========================================================= */}
      <div className="env-layer env-layer-vignette" />

      {/* =========================================================
          LAYER 9: Subtle Spatial Glass Reflection Sheen
          ========================================================= */}
      <div className="env-layer env-layer-specular" />
    </div>
  );
}
