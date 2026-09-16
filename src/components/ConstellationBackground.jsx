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
    const PARTICLE_COUNT = isMobile ? 12 : 24;
    const particles = [];

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const isGold = i % 7 === 0;
        const isEmerald = i % 3 === 0 && !isGold;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          // Extremely slow organic drifting
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.14 - 0.04, // slight upward buoyancy
          radius: Math.random() * 0.8 + 0.8,
          baseAlpha: Math.random() * 0.20 + 0.12,
          alpha: Math.random() * 0.20 + 0.12,
          driftSpeed: Math.random() * 0.008 + 0.003,
          driftPhase: Math.random() * Math.PI * 2,
          isGold,
          isEmerald,
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
      initParticles();
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    function render() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx + Math.sin(p.driftPhase) * 0.06;
          p.y += p.vy;
          p.driftPhase += p.driftSpeed;

          // Wrap around seamlessly
          if (p.x < -10) p.x = width + 10;
          else if (p.x > width + 10) p.x = -10;

          if (p.y < -10) p.y = height + 10;
          else if (p.y > height + 10) p.y = -10;

          // Gentle breathing pulsation
          p.alpha = p.baseAlpha + Math.sin(p.driftPhase * 1.5) * 0.08;
        }

        const effectiveAlpha = Math.max(0.05, Math.min(0.35, p.alpha));

        // Soft dust mote core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isGold) {
          ctx.fillStyle = `rgba(215, 184, 102, ${effectiveAlpha * 0.85})`;
        } else if (p.isEmerald) {
          ctx.fillStyle = `rgba(0, 221, 184, ${effectiveAlpha * 0.9})`;
        } else {
          ctx.fillStyle = `rgba(235, 248, 244, ${effectiveAlpha * 0.75})`;
        }
        ctx.fill();

        // Soft ambient optical halo for a few primary motes
        if (p.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
          if (p.isGold) {
            ctx.fillStyle = `rgba(215, 184, 102, ${effectiveAlpha * 0.15})`;
          } else if (p.isEmerald) {
            ctx.fillStyle = `rgba(0, 221, 184, ${effectiveAlpha * 0.18})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${effectiveAlpha * 0.10})`;
          }
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
