import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './DynamicBackground.css';

export default function DynamicBackground() {
  const location = useLocation();
  const [theme, setTheme] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef(null);

  // 1. Observe sections to change color theme smoothly
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('agenda')) setTheme('events');
    else if (path.includes('artikel') || path.includes('galeri')) setTheme('media');
    else if (path.includes('program')) setTheme('programs');
    else if (path.includes('tentang')) setTheme('quote');
    else setTheme('hero');

    const sectionSelectors = [
      { sel: '.hero-cinematic, .page-hero', theme: 'hero' },
      { sel: '.stats-section, .home-programs-grid', theme: 'programs' },
      { sel: '.quote-section, .about-story', theme: 'quote' },
      { sel: '.home-events-list, .agenda-container', theme: 'events' },
      { sel: '.gallery-grid, .instagram-section, .articles-grid, .grid-3', theme: 'media' },
      { sel: '.home-cta-section, .contact-form-wrapper, footer', theme: 'cta' }
    ];

    const elementsToObserve = [];

    const evaluateDominantTheme = () => {
      const focalY = window.innerHeight * 0.42;
      let closestElement = null;
      let minDistance = Infinity;

      elementsToObserve.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 40 && rect.top < window.innerHeight - 40) {
          const elCenter = (rect.top + rect.bottom) / 2;
          const dist = Math.abs(elCenter - focalY);
          if (dist < minDistance) {
            minDistance = dist;
            closestElement = el;
          }
        }
      });

      if (closestElement) {
        const matched = closestElement.getAttribute('data-bg-theme');
        if (matched) {
          setTheme((current) => (current !== matched ? matched : current));
        }
      }
    };

    const observer = new IntersectionObserver(
      () => {
        evaluateDominantTheme();
      },
      {
        threshold: [0.1, 0.25, 0.5, 0.75],
        rootMargin: '-5% 0px -15% 0px'
      }
    );

    sectionSelectors.forEach(({ sel, theme: t }) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.setAttribute('data-bg-theme', t);
        observer.observe(el);
        elementsToObserve.push(el);
      });
    });

    evaluateDominantTheme();

    return () => {
      elementsToObserve.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [location.pathname]);

  // 2. Smooth parallax on scroll
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
  const nebula1X = Math.sin(scrollProgress * Math.PI * 2) * 60;
  const nebula1Y = Math.cos(scrollProgress * Math.PI * 2) * 40 + scrollProgress * 80;
  const nebula2X = -Math.cos(scrollProgress * Math.PI * 2) * 70;
  const nebula2Y = Math.sin(scrollProgress * Math.PI * 2) * 50 - scrollProgress * 90;

  // Star parallax layers move at different speeds
  const starLayer1Y = -(scrollProgress * 30);
  const starLayer2Y = -(scrollProgress * 60);
  const starLayer3Y = -(scrollProgress * 15);

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

      {/* 5. Constellation Lines Overlay */}
      <div className="constellation-lines" />

      {/* 6. Shooting Stars */}
      <div className="shooting-star shooting-star-1" />
      <div className="shooting-star shooting-star-2" />
      <div className="shooting-star shooting-star-3" />

      {/* 7. Nebula Clouds (Emerald — theme morphing) */}
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

      {/* 8. Ambient Cosmic Vignette */}
      <div className="cosmic-vignette" />
    </div>
  );
}
