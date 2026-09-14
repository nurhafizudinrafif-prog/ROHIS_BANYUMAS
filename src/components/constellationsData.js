// =========================================================
// CELESTIAL CONSTELLATIONS DATA
// Islamic Astronomical Formations & Al-Sufi Cartography
// Normalized to 1000 x 800 SVG ViewBox
// =========================================================

export const CONSTELLATIONS = [
  // 1. HERO: Rasi Al-Thair (Aquila / Altair — Elang Terbang Dakwah)
  {
    id: 'hero',
    name: 'Al-Thair (Aquila)',
    arabic: 'النسر الطائر',
    meaning: 'Elang Terbang — Simbol Keteguhan & Sayap Gerakan Dakwah Pelajar',
    lines: [
      // Main Wings Span
      [140, 340, 250, 290],
      [250, 290, 380, 240],
      [380, 240, 500, 210],
      [500, 210, 620, 240],
      [620, 240, 750, 290],
      [750, 290, 860, 340],
      // Feather Wing Tips
      [140, 340, 110, 420],
      [250, 290, 220, 380],
      [750, 290, 780, 380],
      [860, 340, 890, 420],
      // Diamond Chest & Heart (Altair center)
      [500, 210, 450, 300],
      [450, 300, 500, 390],
      [500, 390, 550, 300],
      [550, 300, 500, 210],
      // Tail Feathers & Foundation
      [500, 390, 440, 510],
      [500, 390, 560, 510],
      [440, 510, 500, 570],
      [560, 510, 500, 570],
      // Head Crest
      [500, 210, 500, 110],
      [500, 110, 535, 75],
      [500, 110, 465, 75]
    ],
    dashedLines: [
      [110, 420, 220, 380],
      [780, 380, 890, 420],
      [465, 75, 535, 75],
      // Summer Triangle guide alignment
      [380, 240, 210, 130],
      [620, 240, 790, 130]
    ],
    orbitRings: [
      { cx: 500, cy: 210, r: 28, color: 'gold' },
      { cx: 500, cy: 210, r: 46, color: 'emerald' },
      { cx: 140, cy: 340, r: 18, color: 'gold' },
      { cx: 860, cy: 340, r: 18, color: 'gold' }
    ],
    stars: [
      { cx: 500, cy: 210, r: 5.5, color: 'gold', flare: true, flareSize: 38, label: 'Altair (Al-Nasr Al-Tair)' },
      { cx: 380, cy: 240, r: 4.0, color: 'emerald', flare: true, flareSize: 24, label: 'Tarazed' },
      { cx: 620, cy: 240, r: 4.0, color: 'emerald', flare: true, flareSize: 24, label: 'Alshain' },
      { cx: 500, cy: 110, r: 3.6, color: 'emerald', flare: true, flareSize: 20, label: 'Okab' },
      { cx: 535, cy: 75, r: 2.6, color: 'cyan', flare: false },
      { cx: 465, cy: 75, r: 2.6, color: 'gold', flare: false },
      { cx: 250, cy: 290, r: 3.2, color: 'cyan', flare: false },
      { cx: 750, cy: 290, r: 3.2, color: 'cyan', flare: false },
      { cx: 140, cy: 340, r: 4.5, color: 'gold', flare: true, flareSize: 28 },
      { cx: 860, cy: 340, r: 4.5, color: 'gold', flare: true, flareSize: 28 },
      { cx: 110, cy: 420, r: 2.8, color: 'emerald', flare: false },
      { cx: 220, cy: 380, r: 2.6, color: 'cyan', flare: false },
      { cx: 780, cy: 380, r: 2.6, color: 'cyan', flare: false },
      { cx: 890, cy: 420, r: 2.8, color: 'emerald', flare: false },
      { cx: 450, cy: 300, r: 3.0, color: 'emerald', flare: false },
      { cx: 550, cy: 300, r: 3.0, color: 'emerald', flare: false },
      { cx: 500, cy: 390, r: 3.8, color: 'emerald', flare: true, flareSize: 22 },
      { cx: 440, cy: 510, r: 3.0, color: 'cyan', flare: false },
      { cx: 560, cy: 510, r: 3.0, color: 'cyan', flare: false },
      { cx: 500, cy: 570, r: 3.6, color: 'gold', flare: true, flareSize: 22 }
    ]
  },

  // 2. PROGRAMS: Rasi Al-Dubb Al-Akbar (Ursa Major / Bintang Biduk)
  {
    id: 'programs',
    name: 'Al-Dubb Al-Akbar (Ursa Major)',
    arabic: 'الدب الأكبر',
    meaning: 'Bintang Biduk — Penunjuk Arah Lima Pilar Gerakan & Kompas Dakwah',
    lines: [
      // Bowl of dipper
      [310, 270, 470, 250],
      [470, 250, 480, 390],
      [480, 390, 320, 400],
      [320, 400, 310, 270],
      // Diagonal internal bracing
      [310, 270, 480, 390],
      // Handle (Ekor Biduk)
      [470, 250, 590, 290],
      [590, 290, 710, 350],
      [710, 350, 830, 460],
      // Paws / Foundation
      [320, 400, 260, 520],
      [480, 390, 440, 530],
      [480, 390, 550, 510]
    ],
    dashedLines: [
      // Pointer Guide Line from Merak & Dubhe to Polaris
      [470, 250, 480, 85],
      [310, 270, 480, 85],
      [260, 520, 440, 530],
      [590, 290, 480, 85]
    ],
    orbitRings: [
      // Polaris Celestial North Pole astrolabe compass rings
      { cx: 480, cy: 85, r: 24, color: 'gold' },
      { cx: 480, cy: 85, r: 42, color: 'emerald' },
      { cx: 310, cy: 270, r: 20, color: 'gold' },
      { cx: 830, cy: 460, r: 22, color: 'emerald' }
    ],
    stars: [
      { cx: 480, cy: 85, r: 6.0, color: 'gold', flare: true, flareSize: 42, label: 'Polaris (Al-Qutb)' },
      { cx: 310, cy: 270, r: 4.2, color: 'emerald', flare: true, flareSize: 26, label: 'Dubhe' },
      { cx: 470, cy: 250, r: 4.2, color: 'emerald', flare: true, flareSize: 26, label: 'Merak' },
      { cx: 480, cy: 390, r: 3.5, color: 'cyan', flare: false, label: 'Phecda' },
      { cx: 320, cy: 400, r: 3.5, color: 'emerald', flare: false, label: 'Megrez' },
      { cx: 590, cy: 290, r: 4.0, color: 'emerald', flare: true, flareSize: 24, label: 'Alioth' },
      { cx: 710, cy: 350, r: 4.2, color: 'gold', flare: true, flareSize: 28, label: 'Mizar & Alcor' },
      { cx: 830, cy: 460, r: 4.5, color: 'emerald', flare: true, flareSize: 30, label: 'Alkaid' },
      { cx: 260, cy: 520, r: 3.0, color: 'cyan', flare: false },
      { cx: 440, cy: 530, r: 3.0, color: 'cyan', flare: false },
      { cx: 550, cy: 510, r: 3.0, color: 'emerald', flare: false }
    ]
  },

  // 3. QUOTE: Rasi Al-Jabbar (Orion — Sang Pejuang Gigih)
  {
    id: 'quote',
    name: 'Al-Jabbar (Orion)',
    arabic: 'الجبار',
    meaning: 'Sang Pejuang — Keteguhan Hati & Keikhlasan Jiwa Dakwah Generasi Islam',
    lines: [
      // Shoulders
      [330, 180, 670, 190],
      // Head
      [500, 115, 330, 180],
      [500, 115, 670, 190],
      // Upper Body to Belt
      [330, 180, 440, 360],
      [670, 190, 560, 380],
      // Belt (Alnitak, Alnilam, Mintaka)
      [440, 360, 500, 370],
      [500, 370, 560, 380],
      // Belt to Lower Body
      [440, 360, 360, 570],
      [560, 380, 640, 560],
      // Base
      [360, 570, 640, 560],
      // Sword & Great Nebula
      [500, 370, 500, 430],
      [500, 430, 495, 480],
      // Shield Arc
      [670, 190, 750, 250],
      [750, 250, 760, 350],
      [760, 350, 740, 450],
      // Raised Arm & Club
      [330, 180, 260, 120],
      [260, 120, 280, 70]
    ],
    dashedLines: [
      [750, 250, 740, 450],
      [360, 570, 500, 480],
      [500, 480, 640, 560],
      // Celestial Equator Belt Line
      [360, 350, 640, 390]
    ],
    orbitRings: [
      // Betelgeuse (Red/Gold Supergiant)
      { cx: 330, cy: 180, r: 28, color: 'gold' },
      // Rigel (Blue/Emerald Supergiant)
      { cx: 640, cy: 560, r: 30, color: 'emerald' },
      // Central Belt alignment circle
      { cx: 500, cy: 370, r: 22, color: 'gold' }
    ],
    stars: [
      { cx: 330, cy: 180, r: 5.6, color: 'gold', flare: true, flareSize: 40, label: 'Betelgeuse (Ibt al-Jawza)' },
      { cx: 670, cy: 190, r: 4.8, color: 'emerald', flare: true, flareSize: 30, label: 'Bellatrix' },
      { cx: 500, cy: 115, r: 3.4, color: 'cyan', flare: false, label: 'Meissa' },
      { cx: 440, cy: 360, r: 4.0, color: 'gold', flare: true, flareSize: 26, label: 'Alnitak' },
      { cx: 500, cy: 370, r: 4.5, color: 'emerald', flare: true, flareSize: 28, label: 'Alnilam' },
      { cx: 560, cy: 380, r: 4.0, color: 'gold', flare: true, flareSize: 26, label: 'Mintaka' },
      { cx: 500, cy: 430, r: 3.0, color: 'cyan', flare: false },
      { cx: 495, cy: 480, r: 4.0, color: 'emerald', flare: true, flareSize: 24, label: 'Nebula Orion' },
      { cx: 360, cy: 570, r: 4.0, color: 'emerald', flare: true, flareSize: 24, label: 'Saiph' },
      { cx: 640, cy: 560, r: 5.8, color: 'emerald', flare: true, flareSize: 40, label: 'Rigel (Rijl al-Jawza)' },
      { cx: 750, cy: 250, r: 2.8, color: 'emerald', flare: false },
      { cx: 760, cy: 350, r: 3.0, color: 'cyan', flare: false },
      { cx: 740, cy: 450, r: 2.8, color: 'emerald', flare: false },
      { cx: 260, cy: 120, r: 3.0, color: 'gold', flare: false },
      { cx: 280, cy: 70, r: 2.8, color: 'cyan', flare: false }
    ]
  },

  // 4. EVENTS: Rasi Dzat Al-Kursi (Cassiopeia — Mahkota Kemenangan)
  {
    id: 'events',
    name: 'Dzat Al-Kursi (Cassiopeia)',
    arabic: 'ذات الكرسي',
    meaning: 'Mahkota Kemuliaan — Agenda & Syiar Syarafah Penuh Berkah',
    lines: [
      // Iconic "W" shape
      [210, 320, 350, 190],
      [350, 190, 500, 300],
      [500, 300, 650, 180],
      [650, 180, 790, 290],
      // Crown Peak Arch
      [350, 190, 500, 120],
      [500, 120, 650, 180],
      // Throne Foundation
      [210, 320, 340, 440],
      [340, 440, 500, 300],
      [500, 300, 660, 440],
      [660, 440, 790, 290],
      [340, 440, 660, 440],
      // Royal halo rays
      [500, 120, 500, 60]
    ],
    dashedLines: [
      [500, 120, 500, 60],
      [210, 320, 790, 290],
      [340, 440, 660, 440]
    ],
    orbitRings: [
      { cx: 500, cy: 300, r: 26, color: 'emerald' },
      { cx: 350, cy: 190, r: 24, color: 'gold' },
      { cx: 500, cy: 60, r: 18, color: 'gold' }
    ],
    stars: [
      { cx: 210, cy: 320, r: 4.0, color: 'emerald', flare: true, flareSize: 24, label: 'Caph (Kaff)' },
      { cx: 350, cy: 190, r: 5.0, color: 'gold', flare: true, flareSize: 34, label: 'Schedar (Al-Sadr)' },
      { cx: 500, cy: 120, r: 3.8, color: 'emerald', flare: false },
      { cx: 500, cy: 60, r: 4.5, color: 'gold', flare: true, flareSize: 30, label: 'Bintang Mahkota' },
      { cx: 500, cy: 300, r: 5.4, color: 'emerald', flare: true, flareSize: 38, label: 'Navi (Gamma Cas)' },
      { cx: 650, cy: 180, r: 4.4, color: 'cyan', flare: true, flareSize: 28, label: 'Ruchbah' },
      { cx: 790, cy: 290, r: 4.0, color: 'gold', flare: true, flareSize: 26, label: 'Segin' },
      { cx: 340, cy: 440, r: 3.2, color: 'emerald', flare: false },
      { cx: 660, cy: 440, r: 3.2, color: 'cyan', flare: false }
    ]
  },

  // 5. MEDIA: Rasi Al-Faras (Pegasus — Kuda Bersayap Dakwah)
  {
    id: 'media',
    name: 'Al-Faras Al-A\'zam (Pegasus)',
    arabic: 'الفرس الأعظم',
    meaning: 'Kuda Bersayap — Kecepatan Dakwah Kreatif, Media & Informasi Digital',
    lines: [
      // The Great Square
      [330, 240, 670, 220],
      [670, 220, 690, 500],
      [690, 500, 310, 490],
      [310, 490, 330, 240],
      // Internal Diamond Cross
      [330, 240, 690, 500],
      // Wing Feathers
      [330, 240, 200, 180],
      [200, 180, 120, 260],
      [200, 180, 150, 90],
      [150, 90, 260, 130],
      // Mane & Head
      [670, 220, 780, 280],
      [780, 280, 870, 370],
      [870, 370, 850, 460],
      // Front Legs
      [310, 490, 230, 610],
      [690, 500, 750, 620]
    ],
    dashedLines: [
      [120, 260, 230, 610],
      [850, 460, 750, 620],
      [330, 240, 870, 370]
    ],
    orbitRings: [
      { cx: 330, cy: 240, r: 24, color: 'gold' },
      { cx: 310, cy: 490, r: 24, color: 'gold' },
      { cx: 870, cy: 370, r: 22, color: 'emerald' }
    ],
    stars: [
      { cx: 330, cy: 240, r: 4.8, color: 'gold', flare: true, flareSize: 32, label: 'Scheat' },
      { cx: 670, cy: 220, r: 4.6, color: 'emerald', flare: true, flareSize: 30, label: 'Alpheratz' },
      { cx: 690, cy: 500, r: 4.8, color: 'emerald', flare: true, flareSize: 32, label: 'Algenib' },
      { cx: 310, cy: 490, r: 5.0, color: 'gold', flare: true, flareSize: 34, label: 'Markab' },
      { cx: 200, cy: 180, r: 3.6, color: 'cyan', flare: false },
      { cx: 120, cy: 260, r: 3.2, color: 'emerald', flare: false },
      { cx: 150, cy: 90, r: 3.8, color: 'gold', flare: true, flareSize: 24 },
      { cx: 260, cy: 130, r: 3.0, color: 'cyan', flare: false },
      { cx: 780, cy: 280, r: 3.4, color: 'emerald', flare: false },
      { cx: 870, cy: 370, r: 4.6, color: 'emerald', flare: true, flareSize: 28, label: 'Enif' },
      { cx: 850, cy: 460, r: 3.2, color: 'cyan', flare: false },
      { cx: 230, cy: 610, r: 3.2, color: 'emerald', flare: false },
      { cx: 750, cy: 620, r: 3.2, color: 'cyan', flare: false }
    ]
  },

  // 6. CTA / FOOTER: Rasi Al-Mizan & Crux (Bintang Pari & Neraca)
  {
    id: 'cta',
    name: 'Al-Mizan & Crux (Bintang Pari)',
    arabic: 'الميزان والجنوب',
    meaning: 'Salib Selatan / Neraca — Kompas Penuntun Langkah Menuju Ridha Ilahi',
    lines: [
      // Central Crux Cross
      [500, 140, 500, 610],
      [340, 330, 660, 330],
      // Diamond Halo
      [500, 140, 660, 330],
      [660, 330, 500, 610],
      [500, 610, 340, 330],
      [340, 330, 500, 140],
      // Pointer Stars (Alpha & Beta Centauri)
      [760, 420, 880, 490],
      // Alignment Ray
      [660, 330, 760, 420],
      // Balance Pans (Al-Mizan Scales)
      [340, 330, 270, 440],
      [270, 440, 390, 440],
      [390, 440, 340, 330],
      [660, 330, 600, 440],
      [600, 440, 720, 440],
      [720, 440, 660, 330]
    ],
    dashedLines: [
      [500, 140, 880, 490],
      [500, 140, 500, 50],
      [500, 610, 500, 700]
    ],
    orbitRings: [
      // Acrux (Alpha Crucis) navigation coordinate ring
      { cx: 500, cy: 610, r: 30, color: 'emerald' },
      { cx: 500, cy: 140, r: 24, color: 'gold' },
      // Rigil Kentaurus (Alpha Centauri)
      { cx: 880, cy: 490, r: 32, color: 'gold' }
    ],
    stars: [
      { cx: 500, cy: 140, r: 4.8, color: 'gold', flare: true, flareSize: 32, label: 'Gacrux' },
      { cx: 500, cy: 610, r: 6.0, color: 'emerald', flare: true, flareSize: 42, label: 'Acrux (Al-Janub)' },
      { cx: 340, cy: 330, r: 4.6, color: 'emerald', flare: true, flareSize: 30, label: 'Mimosa' },
      { cx: 660, cy: 330, r: 4.2, color: 'cyan', flare: true, flareSize: 28, label: 'Delta Crucis' },
      { cx: 550, cy: 410, r: 2.8, color: 'emerald', flare: false, label: 'Ginan' },
      { cx: 760, cy: 420, r: 5.0, color: 'emerald', flare: true, flareSize: 34, label: 'Hadar' },
      { cx: 880, cy: 490, r: 6.2, color: 'gold', flare: true, flareSize: 46, label: 'Rigil Kentaurus' },
      { cx: 270, cy: 440, r: 3.0, color: 'cyan', flare: false },
      { cx: 390, cy: 440, r: 3.0, color: 'cyan', flare: false },
      { cx: 600, cy: 440, r: 3.0, color: 'emerald', flare: false },
      { cx: 720, cy: 440, r: 3.0, color: 'emerald', flare: false }
    ]
  }
];
