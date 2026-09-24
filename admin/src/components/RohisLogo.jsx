import logoImg from '../assets/logo.png';

/**
 * RohisLogo - Official Emblem for ROHIS Kabupaten Banyumas.
 */
export default function RohisLogo({ 
  size = 42, 
  className = '', 
  showGlow = false, 
  style = {} 
}) {
  const width = size;
  const height = Math.round(size * (918 / 1024));

  return (
    <div 
      className={`rohis-vector-logo-wrap ${className}`} 
      style={{ 
        width, 
        height, 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        ...style 
      }}
    >
      {showGlow && (
        <div 
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200, 168, 91, 0.35) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}
      <img
        src={logoImg}
        alt="Logo Resmi ROHIS Kabupaten Banyumas"
        width={1024}
        height={918}
        loading="eager"
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          position: 'relative',
          zIndex: 1,
          filter: showGlow ? 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.45))' : 'none',
        }}
      />
    </div>
  );
}
