import React from 'react';

/**
 * RohisLogo - Official Master Vector Emblem for ROHIS Kabupaten Banyumas.
 * Crafted with museum-grade Islamic architectural geometry, 24K burnished gold
 * gradients, and deep Banyumas pine green shield backing.
 */
export default function RohisLogo({ 
  size = 42, 
  className = '', 
  showGlow = false, 
  style = {} 
}) {
  const width = size;
  const height = Math.round(size * (560 / 500));

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 560"
        width={width}
        height={height}
        style={{ width: '100%', height: '100%', display: 'block', position: 'relative', zIndex: 1 }}
        role="img"
        aria-label="Logo Resmi ROHIS Kabupaten Banyumas"
      >
        <defs>
          <linearGradient id="compGoldLinear" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3E7C4" />
            <stop offset="25%" stopColor="#DFBF73" />
            <stop offset="50%" stopColor="#C8A85B" />
            <stop offset="75%" stopColor="#EAD59A" />
            <stop offset="100%" stopColor="#9E7F35" />
          </linearGradient>

          <linearGradient id="compGoldGleam" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="30%" stopColor="#DFBF73" />
            <stop offset="70%" stopColor="#C8A85B" />
            <stop offset="100%" stopColor="#846826" />
          </linearGradient>

          <radialGradient id="compPineShield" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#123B2A" />
            <stop offset="45%" stopColor="#0B2419" />
            <stop offset="85%" stopColor="#06160F" />
            <stop offset="100%" stopColor="#030C08" />
          </radialGradient>

          <radialGradient id="compInnerAura" cx="50%" cy="42%" r="45%">
            <stop offset="0%" stopColor="#DFBF73" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#C8A85B" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#07140E" stopOpacity="0" />
          </radialGradient>

          <filter id="compDrop" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Main Pentagon Shield */}
        <g filter="url(#compDrop)">
          {/* Outer Gold Frame */}
          <polygon
            points="250,22 476,170 390,500 110,500 24,170"
            fill="url(#compGoldLinear)"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />

          {/* Hairline Inset */}
          <polygon
            points="250,32 464,174 382,490 118,490 36,174"
            fill="#05120B"
          />

          {/* Inner Pine Field */}
          <polygon
            points="250,40 454,178 376,482 124,482 46,178"
            fill="url(#compPineShield)"
            stroke="url(#compGoldLinear)"
            strokeWidth="2.5"
          />

          {/* Inner Light Aura */}
          <circle cx="250" cy="240" r="160" fill="url(#compInnerAura)" />

          {/* Subtle Geometric Tessellation */}
          <g opacity="0.09" stroke="url(#compGoldLinear)" strokeWidth="1" fill="none">
            <circle cx="250" cy="220" r="140" />
            <circle cx="250" cy="220" r="100" />
            <polygon points="250,80 349,151 389,267 312,357 188,357 111,267 151,151" />
            <polygon points="250,360 151,289 111,173 188,83 312,83 389,173 349,289" />
          </g>

          {/* 5 Arched Golden Stars */}
          <g fill="url(#compGoldGleam)">
            <path d="M 105,190 L 111,174 L 118,189 L 102,179 L 121,179 Z" transform="rotate(-28 112 182)" />
            <path d="M 168,138 L 175,120 L 183,137 L 165,126 L 187,126 Z" transform="rotate(-14 176 130)" />
            <path d="M 250,72 L 259,100 L 289,100 L 265,118 L 274,146 L 250,128 L 226,146 L 235,118 L 211,100 L 241,100 Z" />
            <path d="M 332,138 L 339,120 L 347,137 L 329,126 L 351,126 Z" transform="rotate(14 340 130)" />
            <path d="M 395,190 L 401,174 L 408,189 L 392,179 L 411,179 Z" transform="rotate(28 402 182)" />
          </g>

          {/* Mosque Dome Architecture */}
          <g>
            <path d="M 250,154 L 250,182" stroke="url(#compGoldLinear)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 250,162 A 9,9 0 1,0 258,150 A 7.5,7.5 0 1,1 250,162 Z" fill="url(#compGoldLinear)" />

            <path
              d="M 125,325 C 125,270 175,215 250,182 C 325,215 375,270 375,325"
              fill="none"
              stroke="url(#compGoldLinear)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M 137,325 C 137,276 182,226 250,196 C 318,226 363,276 363,325"
              fill="none"
              stroke="url(#compGoldLinear)"
              strokeWidth="1.5"
              opacity="0.6"
              strokeDasharray="6,4"
            />
            <line x1="118" y1="325" x2="382" y2="325" stroke="url(#compGoldLinear)" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Calligraphic Flourish */}
          <g fill="none" stroke="url(#compGoldGleam)" strokeWidth="2.5" strokeLinecap="round" opacity="0.9">
            <path d="M 148,220 Q 165,202 185,214 Q 200,205 220,212" />
            <path d="M 226,206 Q 235,196 250,198 Q 265,196 274,206" />
            <path d="M 280,212 Q 300,205 315,214 Q 335,202 352,220" />
            <polygon points="172,198 175,194 178,198 175,202" fill="url(#compGoldLinear)" stroke="none" />
            <polygon points="250,186 253,182 256,186 253,190" fill="url(#compGoldLinear)" stroke="none" />
            <polygon points="328,198 331,194 334,198 331,202" fill="url(#compGoldLinear)" stroke="none" />
          </g>

          {/* Bold Center Typography: "ROHIS" */}
          <g>
            <text
              x="250"
              y="385"
              textAnchor="middle"
              fontFamily="'Plus Jakarta Sans', 'Cinzel', serif"
              fontSize="62"
              fontWeight="900"
              letterSpacing="6"
              fill="url(#compGoldLinear)"
            >
              ROHIS
            </text>
            <line x1="170" y1="398" x2="330" y2="398" stroke="url(#compGoldLinear)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="250" cy="398" r="4" fill="url(#compGoldLinear)" />
          </g>

          {/* Ribbon Banner: "KABUPATEN BANYUMAS" */}
          <g>
            <path d="M 85,446 L 125,432 L 125,466 L 85,480 L 102,463 Z" fill="#6B521E" />
            <path d="M 415,446 L 375,432 L 375,466 L 415,480 L 398,463 Z" fill="#6B521E" />

            <path
              d="M 116,432 C 180,420 320,420 384,432 C 394,434 400,442 396,452 L 390,470 C 386,478 376,482 368,480 C 310,470 190,470 132,480 C 124,482 114,478 110,470 L 104,452 C 100,442 106,434 116,432 Z"
              fill="url(#compGoldLinear)"
              stroke="#FFFFFF"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <path
              d="M 124,439 C 184,428 316,428 376,439 L 370,465 C 316,456 184,456 130,465 Z"
              fill="#0A2418"
              stroke="url(#compGoldLinear)"
              strokeWidth="1.2"
            />
            <text
              x="250"
              y="456"
              textAnchor="middle"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="16.5"
              fontWeight="800"
              letterSpacing="3"
              fill="url(#compGoldLinear)"
            >
              KABUPATEN BANYUMAS
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
