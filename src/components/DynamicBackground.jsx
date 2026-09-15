import './DynamicBackground.css';

/**
 * Atmospheric Background — Lightweight CSS-only
 * Replaces the previous constellation/astrolabe animation system.
 * Uses only CSS gradients and subtle patterns for a professional, warm feel.
 */
export default function DynamicBackground() {
  return (
    <>
      <div className="atmospheric-bg" aria-hidden="true" />
      <div className="atmospheric-dots" aria-hidden="true" />
    </>
  );
}
