import './DynamicBackground.css';

/**
 * 6-Layer Atmospheric Background — ROHIS Kabupaten Banyumas Official Platform
 * Layer 1: Deep Dark Green Base (#061713)
 * Layer 2: Subtle Radial Gradients
 * Layer 3: Large Blurred Organic Light Shapes (GPU-accelerated)
 * Layer 4: Emerald / Cyan Atmospheric Ambient Glow
 * Layer 5: Micro-Noise Texture
 * Layer 6: Subtle Islamic Geometric Pattern Tile (2-4% Opacity)
 */
export default function DynamicBackground() {
  return (
    <div className="atmospheric-container" aria-hidden="true">
      {/* Layer 1 & 2: Base & Radial Gradient Field */}
      <div className="atmospheric-base" />

      {/* Layer 3: Large Blurred Organic Light Blobs */}
      <div className="atmospheric-blob blob-emerald-top" />
      <div className="atmospheric-blob blob-cyan-mid" />
      <div className="atmospheric-blob blob-gold-bottom" />

      {/* Layer 4: Ambient Atmosphere Glow */}
      <div className="atmospheric-glow-field" />

      {/* Layer 5: Micro-Grain Noise Simulation */}
      <div className="atmospheric-noise" />

      {/* Layer 6: Subtle Islamic Geometric Pattern (2-4% opacity) */}
      <div className="atmospheric-islamic-pattern" />
    </div>
  );
}
