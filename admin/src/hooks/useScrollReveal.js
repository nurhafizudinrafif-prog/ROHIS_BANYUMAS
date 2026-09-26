import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useScrollReveal Hook for ROKABA Admin Web
 * Automatically animates elements into view as the user scrolls.
 * Targets:
 * - Elements with explicit reveal classes (.reveal-on-scroll, .reveal-scale, .reveal-left, .reveal-right, .reveal-fade, .reveal-flip)
 * - Auto-detects admin cards (.glass-card, .admin-mobile-card, .home-cms-section, .cms-sub-box)
 * - Excludes modals, dialogs, toasts, and elements with .no-reveal
 */
export function useScrollReveal(dependencies = []) {
  const location = useLocation();

  useEffect(() => {
    // If IntersectionObserver is not supported, reveal immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document
        .querySelectorAll(
          '.reveal-on-scroll, .reveal-scale, .reveal-left, .reveal-right, .reveal-fade, .reveal-flip, .glass-card, .admin-mobile-card, .home-cms-section, .cms-sub-box'
        )
        .forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observedElements = new WeakSet();

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
      rootMargin: '0px 0px -30px 0px',
      threshold: 0.06,
    });

    const scanAndObserve = () => {
      // Find all target candidates
      const selectors = [
        '.reveal-on-scroll',
        '.reveal-scale',
        '.reveal-left',
        '.reveal-right',
        '.reveal-fade',
        '.reveal-flip',
        '.glass-card:not(.modal-card-responsive):not(.no-reveal)',
        '.admin-mobile-card:not(.no-reveal)',
        '.home-cms-section:not(.no-reveal)',
        '.cms-sub-box:not(.no-reveal)',
      ];

      const elements = document.querySelectorAll(selectors.join(', '));

      elements.forEach((el, index) => {
        // Exclude elements inside modal overlay or responsive modals
        if (el.closest('.modal-overlay-responsive') || el.closest('.admin-floating-toast') || el.classList.contains('no-reveal')) {
          el.classList.add('is-revealed');
          return;
        }

        // Add standard reveal class if no reveal style exists yet
        const hasRevealClass =
          el.classList.contains('reveal-on-scroll') ||
          el.classList.contains('reveal-scale') ||
          el.classList.contains('reveal-left') ||
          el.classList.contains('reveal-right') ||
          el.classList.contains('reveal-fade') ||
          el.classList.contains('reveal-flip');

        if (!hasRevealClass) {
          el.classList.add('reveal-on-scroll');
        }

        // If already observed, skip
        if (observedElements.has(el)) return;
        observedElements.add(el);

        // Check if element is already inside viewport on mount
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInViewport) {
          // Stagger slightly on initial page load for a fluid entrance cascade
          const stagger = Math.min((index % 6) * 50, 300);
          setTimeout(() => {
            el.classList.add('is-revealed');
          }, stagger);
        } else {
          observer.observe(el);
        }
      });
    };

    // Scan right away
    scanAndObserve();

    // Re-scan after short delay for dynamically rendered cards/subcomponents
    const initialTimer = setTimeout(scanAndObserve, 150);

    // Watch DOM mutations for tab switches, async data loads, or filters
    let debounceTimer = null;
    const mutationObserver = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(scanAndObserve, 80);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(initialTimer);
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname, ...dependencies]);
}

export default useScrollReveal;
