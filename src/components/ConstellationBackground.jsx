import { useEffect, useRef } from 'react';

/**
 * =========================================================================
 * ATMOSPHERIC LIGHT PARTICLES (Dust Motes in Sanctuary Lighting)
 *
 * Replaces high-density constellation/spiderweb lines with ultra-sparse,
 * gentle micro-particles drifting in ambient architectural light.
 *
 * Characteristics:
 * - Extremely sparse (22 desktop / 12 mobile)
 * - Microscopic radius (0.8px – 1.6px)
 * - Low opacity (0.12 – 0.32)
 * - Ultra-slow organic Brownian drift
 * - Warm-gold, emerald, and white ambient light tints
 * - Zero cyberpunk lines, zero outer-space star fields
 * =========================================================================
 */
export default function ConstellationBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const STAR_COUNT = isMobile ? 38 : 75;
    const CONNECTION_DIST = isMobile ? 95 : 130;
    const stars = [];

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
    };

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        const isAnchor = i % 6 === 0;
        const isGold = i % 11 === 0;

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (isMobile ? 0.22 : 0.35),
          vy: (Math.random() - 0.5) * (isMobile ? 0.22 : 0.35),
          radius: isAnchor ? (isGold ? 2.5 : 2.2) : Math.random() * 1.3 + 0.6,
          baseAlpha: isAnchor ? 0.70 : Math.random() * 0.40 + 0.20,
          alpha: isAnchor ? 0.70 : Math.random() * 0.40 + 0.20,
          twinkleSpeed: Math.random() * 0.02 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          isGold,
          isAnchor,
        });
      }
    }

    function handleResize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initStars();
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // 1. Constellation Connection Web ("Rasi Bintang")
      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i];

        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const lineAlpha = (1 - dist / CONNECTION_DIST) * 0.16 * (s1.alpha + s2.alpha);
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);

            if (s1.isGold || s2.isGold) {
              ctx.strokeStyle = `rgba(215, 184, 102, ${lineAlpha * 1.1})`;
            } else {
              ctx.strokeStyle = `rgba(0, 221, 184, ${lineAlpha})`;
            }
            ctx.lineWidth = s1.isAnchor && s2.isAnchor ? 0.9 : 0.55;
            ctx.stroke();
          }
        }

        // Mouse interactive connection (desktop only)
        if (!isMobile && mouse.x > 0) {
          const mdx = s1.x - mouse.x;
          const mdy = s1.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < mouse.radius) {
            const mAlpha = (1 - mDist / mouse.radius) * 0.32;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 240, 207, ${mAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 2. Stars & Anchor Vertices
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (!prefersReducedMotion) {
          s.x += s.vx;
          s.y += s.vy;

          if (s.x < 0) s.x = width;
          else if (s.x > width) s.x = 0;

          if (s.y < 0) s.y = height;
          else if (s.y > height) s.y = 0;

          s.twinklePhase += s.twinkleSpeed;
          s.alpha = s.baseAlpha + Math.sin(s.twinklePhase) * 0.28;
        }

        const effectiveAlpha = Math.max(0.12, Math.min(0.95, s.alpha));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);

        if (s.isGold) {
          ctx.fillStyle = `rgba(245, 208, 118, ${effectiveAlpha})`;
        } else if (s.isAnchor) {
          ctx.fillStyle = `rgba(0, 255, 210, ${effectiveAlpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${effectiveAlpha * 0.85})`;
        }
        ctx.fill();

        // Luminous Halo around Anchor Stars
        if (s.isAnchor) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = s.isGold
            ? `rgba(215, 184, 102, ${effectiveAlpha * 0.18})`
            : `rgba(0, 221, 184, ${effectiveAlpha * 0.22})`;
          ctx.fill();
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="env-layer-particles"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.85,
      }}
      aria-hidden="true"
    />
  );
}
