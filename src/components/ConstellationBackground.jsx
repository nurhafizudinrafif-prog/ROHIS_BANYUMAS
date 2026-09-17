import { useEffect, useRef } from 'react';

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

    // Star configuration
    const isMobile = window.innerWidth < 768;
    const STAR_COUNT = isMobile ? 55 : 110;
    const CONNECTION_DIST = isMobile ? 100 : 145;
    const stars = [];

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
    };

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        // A few special brighter anchor stars (Rasi Bintang vertices)
        const isAnchor = i % 6 === 0;
        const isGold = i % 14 === 0;

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.35),
          vy: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.35),
          radius: isAnchor ? (isGold ? 2.8 : 2.5) : Math.random() * 1.6 + 0.8,
          baseAlpha: isAnchor ? 0.90 : Math.random() * 0.55 + 0.35,
          alpha: isAnchor ? 0.90 : Math.random() * 0.55 + 0.35,
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
      canvas.width = width * dpr;
      canvas.height = height * dpr;
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

    let time = 0;

    function render() {
      ctx.clearRect(0, 0, width, height);

      time += 0.015;

      // 1. Draw connection lines (Constellation Geometric Web)
      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i];

        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const lineAlpha = (1 - dist / CONNECTION_DIST) * 0.14 * (s1.alpha + s2.alpha);
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);

            if (s1.isGold || s2.isGold) {
              ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha * 1.1})`;
            } else {
              ctx.strokeStyle = `rgba(0, 240, 207, ${lineAlpha * 1.45})`;
            }
            ctx.lineWidth = s1.isAnchor && s2.isAnchor ? 0.95 : 0.55;
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
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // 2. Draw Stars & Anchor Nodes
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Move stars softly
        if (!prefersReducedMotion) {
          star.x += star.vx;
          star.y += star.vy;

          if (star.x < 0) star.x = width;
          else if (star.x > width) star.x = 0;

          if (star.y < 0) star.y = height;
          else if (star.y > height) star.y = 0;

          // Twinkle effect
          star.twinklePhase += star.twinkleSpeed;
          star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.25;
        }

        // Draw star point
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        if (star.isGold) {
          ctx.fillStyle = `rgba(224, 192, 107, ${Math.max(0.1, star.alpha)})`;
        } else if (star.isAnchor) {
          ctx.fillStyle = `rgba(0, 240, 207, ${Math.max(0.35, star.alpha)})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.08, star.alpha)})`;
        }
        ctx.fill();

        // Soft cinematic green neon glow halo around anchor stars
        if (star.isAnchor) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3.8, 0, Math.PI * 2);
          ctx.fillStyle = star.isGold
            ? `rgba(212, 175, 55, ${star.alpha * 0.16})`
            : `rgba(0, 240, 207, ${star.alpha * 0.28})`;
          ctx.fill();

          if (!star.isGold) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius * 6.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 207, ${star.alpha * 0.10})`;
            ctx.fill();
          }
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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
        opacity: 1,
      }}
      aria-hidden="true"
    />
  );
}
