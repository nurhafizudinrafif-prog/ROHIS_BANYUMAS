import { useEffect } from 'react';

/**
 * useScrollReveal Hook
 * Automatically attaches an IntersectionObserver to elements matching reveal classes:
 * .reveal-on-scroll, .reveal-scale, .reveal-left, .reveal-right, .reveal-fade
 * Adds the 'is-revealed' class when elements scroll into view.
 */
export function useScrollReveal(dependencies = []) {
  useEffect(() => {
    // If browser doesn't support IntersectionObserver, reveal immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document
        .querySelectorAll('.reveal-on-scroll, .reveal-scale, .reveal-left, .reveal-right, .reveal-fade')
        .forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08,
    });

    // Select all reveal elements
    const elements = document.querySelectorAll(
      '.reveal-on-scroll, .reveal-scale, .reveal-left, .reveal-right, .reveal-fade'
    );

    elements.forEach((el) => {
      // Check if element is already within viewport on mount
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // In viewport already
        el.classList.add('is-revealed');
      } else {
        observer.observe(el);
      }
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, dependencies);
}
