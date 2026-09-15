import ConstellationBackground from './ConstellationBackground';
import './DynamicBackground.css';

/**
 * 7-Layer Atmospheric Dark Liquid Glass Background System
 * Layer 1: Deep Obsidian Forest Base (#061510)
 * Layer 2: Subtle Deep Space Gradient Field
 * Layer 3: Large Blurred Organic Auroral Blobs (GPU-accelerated)
 * Layer 4: Constellation Starfield ("Rasi Bintang" with connecting celestial geometry)
 * Layer 5: Ambient Atmosphere Glow Field
 * Layer 6: Micro-Noise Texture
 * Layer 7: Subtle Islamic Geometric Pattern Tile (1.5% Opacity)
 */
export default function DynamicBackground() {
  return (
    <div className="atmospheric-container" aria-hidden="true">
      {/* Layer 1 & 2: Deep Dark Base */}
      <div className="atmospheric-base" />

      {/* Layer 3: Large Blurred Organic Auroral Blobs */}
      <div className="atmospheric-blob blob-emerald-top" />
      <div className="atmospheric-blob blob-cyan-mid" />
      <div className="atmospheric-blob blob-gold-bottom" />

      {/* Layer 4: Celestial Constellation ("Rasi Bintang") */}
      <ConstellationBackground />

      {/* Layer 5: Ambient Atmosphere Glow Field */}
      <div className="atmospheric-glow-field" />

      {/* Layer 6: Micro-Grain Noise Simulation */}
      <div className="atmospheric-noise" />

      {/* Layer 7: Subtle Islamic Geometric Pattern Tile */}
      <div className="atmospheric-islamic-pattern" />
    </div>
  );
}
