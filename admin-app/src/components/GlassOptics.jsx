// A static displacement field bends only the perimeter of decorative glass.
// It never filters foreground labels or controls, and has no animation loop.
const cells = [];
for (let y = 0; y < 16; y += 1) {
  for (let x = 0; x < 32; x += 1) {
    const nx = (x + 0.5) / 16 - 1;
    const ny = (y + 0.5) / 8 - 1;
    const edge = Math.pow(Math.max(Math.abs(nx), Math.abs(ny)), 5);
    const red = Math.round(128 + nx * edge * 95);
    const green = Math.round(128 + ny * edge * 95);
    cells.push(`<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="rgb(${red},${green},128)"/>`);
  }
}
const field = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="16" viewBox="0 0 32 16">${cells.join('')}</svg>`)}`;

export default function GlassOptics() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', pointerEvents: 'none' }}>
      <defs>
        <filter id="rokaba-glass-edge" x="-5%" y="-10%" width="110%" height="120%" colorInterpolationFilters="sRGB">
          <feImage href={field} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="field" />
          <feGaussianBlur in="field" stdDeviation="1.2" result="smoothField" />
          <feDisplacementMap in="SourceGraphic" in2="smoothField" scale="13" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
