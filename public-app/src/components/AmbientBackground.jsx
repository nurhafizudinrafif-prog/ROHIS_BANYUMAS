import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function AmbientBackground() {
  const ref = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => {
    const node = ref.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)));
      node.style.setProperty('--ambient-y', `${reduced.matches ? 0 : progress * -100}px`);
      node.style.setProperty('--ambient-angle', `${reduced.matches ? -12 : -12 + progress * 18}deg`);
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const initialScene = pathname.startsWith('/events') ? 'agenda' : pathname.startsWith('/berita') ? 'news' : 'welcome';
    node.dataset.scene = initialScene;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) node.dataset.scene = entry.target.dataset.scene; });
    }, { rootMargin: '-25% 0px -45% 0px', threshold: 0 });
    document.querySelectorAll('main [data-scene]').forEach((section) => observer.observe(section));
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    reduced.addEventListener('change', scroll);
    update();
    return () => { window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); reduced.removeEventListener('change', scroll); cancelAnimationFrame(frame); observer.disconnect(); };
  }, [pathname]);
  return <div ref={ref} className="rk-ambient" aria-hidden="true"><div className="rk-ambient-light rk-ambient-light--sage" /><div className="rk-ambient-light rk-ambient-light--brass" /><div className="rk-ambient-foliage rk-ambient-foliage--left" /><div className="rk-ambient-foliage rk-ambient-foliage--right" /></div>;
}
