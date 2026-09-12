import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './DynamicBackground.css';

const backgroundLayers = [
  { id: 'hero', src: '/backgrounds/bg-hero.jpg' },
  { id: 'programs', src: '/backgrounds/bg-programs.jpg' },
  { id: 'quote', src: '/backgrounds/bg-quote.jpg' },
  { id: 'events', src: '/backgrounds/bg-events.jpg' },
  { id: 'media', src: '/backgrounds/bg-programs.jpg' },
  { id: 'cta', src: '/backgrounds/bg-cta.jpg' },
];

export default function DynamicBackground() {
  const location = useLocation();
  const [theme, setTheme] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [parallaxY, setParallaxY] = useState(0);
  const rafRef = useRef(null);

  // 1. Observe sections to change color theme smoothly
  useEffect(() => {
    // Initial theme based on route
    const path = location.pathname;
    if (path.includes('agenda')) setTheme('events');
    else if (path.includes('artikel') || path.includes('galeri')) setTheme('media');
    else if (path.includes('program')) setTheme('programs');
    else if (path.includes('tentang')) setTheme('quote');
    else setTheme('hero');

    // Section triggers for scroll-based morphing
    const sectionSelectors = [
      { sel: '.hero-cinematic, .page-hero', theme: 'hero' },
      { sel: '.stats-section, .home-programs-grid', theme: 'programs' },
      { sel: '.quote-section, .about-story', theme: 'quote' },
      { sel: '.home-events-list, .agenda-container', theme: 'events' },
      { sel: '.gallery-grid, .instagram-section, .articles-grid', theme: 'media' },
      { sel: '.home-cta-section, .contact-form-wrapper, footer', theme: 'cta' }
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const matchedTheme = entry.target.getAttribute('data-bg-theme');
            if (matchedTheme) {
              setTheme(matchedTheme);
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-15% 0px -25% 0px'
      }
    );

    // Attach data-bg-theme to target elements
    const elementsToObserve = [];
    sectionSelectors.forEach(({ sel, theme: t }) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.setAttribute('data-bg-theme', t);
        observer.observe(el);
        elementsToObserve.push(el);
      });
    });

    return () => {
      elementsToObserve.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [location.pathname]);

  // 2. Smooth parallax and dynamic fluid aurora drift on scroll
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
        // Subtle parallax on Islamic geometric pattern (slow drift)
        setParallaxY(-(scrollY * 0.09) % 120);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Compute organic dynamic drift offsets based on scroll progress
  // Orb 1 moves smoothly from top-left toward center-left
  const orb1DriftX = Math.sin(scrollProgress * Math.PI * 2) * 80;
  const orb1DriftY = Math.cos(scrollProgress * Math.PI * 2) * 50 + scrollProgress * 100;

  // Orb 2 moves smoothly across the right side
  const orb2DriftX = -Math.cos(scrollProgress * Math.PI * 2) * 90;
  const orb2DriftY = Math.sin(scrollProgress * Math.PI * 2) * 60 - scrollProgress * 120;

  // Orb 3 floats in the lower center
  const orb3DriftX = Math.sin(scrollProgress * Math.PI * 1.5) * 110;
  const orb3DriftY = -Math.cos(scrollProgress * Math.PI * 1.5) * 70;

  return (
    <div
      className={`dynamic-bg-container theme-${theme}`}
      aria-hidden="true"
    >
      {/* 0. Cinematic Multi-Layer Image Crossfade Stack */}
      <div className="dynamic-image-stack">
        {backgroundLayers.map((layer) => {
          const isActive = theme === layer.id;
          return (
            <div
              key={layer.id}
              className={`bg-layer-item bg-layer-${layer.id} ${isActive ? 'is-active' : ''}`}
              style={{
                backgroundImage: `url(${layer.src})`
              }}
            />
          );
        })}
      </div>

      {/* 1. Seamless Fixed Islamic Sacred Geometry Pattern with Subtle Parallax */}
      <div
        className="dynamic-islamic-pattern"
        style={{
          transform: `translate3d(0, ${parallaxY}px, 0)`
        }}
      />

      {/* 2. Fluid Living Aurora Orbs with Theme Morphing */}
      <div
        className="dynamic-aurora dynamic-aurora-1"
        style={{
          transform: `translate3d(${orb1DriftX}px, ${orb1DriftY}px, 0)`
        }}
      />
      <div
        className="dynamic-aurora dynamic-aurora-2"
        style={{
          transform: `translate3d(${orb2DriftX}px, ${orb2DriftY}px, 0)`
        }}
      />
      <div
        className="dynamic-aurora dynamic-aurora-3"
        style={{
          transform: `translate3d(${orb3DriftX}px, ${orb3DriftY}px, 0)`
        }}
      />

      {/* 3. Cinema Ambient Vignette Overlay */}
      <div className="dynamic-ambient-mist" />
    </div>
  );
}
