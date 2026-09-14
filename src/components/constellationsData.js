// =========================================================
// CELESTIAL CONSTELLATIONS DATA
// Islamic Astronomical Formations & Al-Sufi Cartography
// Normalized to 1000 x 800 SVG ViewBox
// Designed with zero-collision reading zones & celestial arches
// =========================================================

export const CONSTELLATIONS = [
  // 1. HERO: Rasi Al-Thair (Aquila / Altair — Elang Terbang Dakwah)
  {
    id: 'hero',
    name: 'Al-Thair (Aquila)',
    arabic: 'النسر الطائر',
    meaning: 'Elang Terbang — Simbol Keteguhan & Sayap Gerakan Dakwah Pelajar',
    lines: [
      // Main Wings Span (Arches gracefully in upper celestial dome)
      [140, 310, 250, 260],
      [250, 260, 380, 210],
      [380, 210, 500, 170],
      [500, 170, 620, 210],
      [620, 210, 750, 260],
      [750, 260, 860, 310],
      // Wing Feathers Tips (Flanking margins)
      [140, 310, 110, 390],
      [250, 260, 220, 350],
      [750, 260, 780, 350],
      [860, 310, 890, 390],
      // Diamond Chest & Heart (Altair center)
      [500, 170, 450, 250],
      [450, 250, 500, 330],
      [500, 330, 550, 250],
      [550, 250, 500, 170],
      // Tail Feathers
      [500, 330, 450, 440],
      [500, 330, 550, 440],
      [450, 440, 500, 490],
      [550, 440, 500, 490],
      // Head Crest
      [500, 170, 500, 90],
      [500, 90, 530, 60],
      [500, 90, 470, 60]
    ],
    dashedLines: [
      [110, 390, 220, 350],
      [780, 350, 890, 390],
      [470, 60, 530, 60]
    ],
    orbitRings: [
      { cx: 500, cy: 170, r: 28, color: 'gold' },
      { cx: 500, cy: 170, r: 44, color: 'emerald' },
      { cx: 140, cy: 310, r: 18, color: 'gold' },
      { cx: 860, cy: 310, r: 18, color: 'gold' }
    ],
    stars: [
      { cx: 500, cy: 170, r: 5.5, color: 'gold', flare: true, flareSize: 36, label: 'Altair (Al-Nasr Al-Tair)' },
      { cx: 380, cy: 210, r: 4.0, color: 'emerald', flare: true, flareSize: 22, label: 'Tarazed' },
      { cx: 620, cy: 210, r: 4.0, color: 'emerald', flare: true, flareSize: 22, label: 'Alshain' },
      { cx: 500, cy: 90, r: 3.5, color: 'emerald', flare: true, flareSize: 18, label: 'Okab' },
      { cx: 530, cy: 60, r: 2.6, color: 'cyan', flare: false },
      { cx: 470, cy: 60, r: 2.6, color: 'gold', flare: false },
      { cx: 250, cy: 260, r: 3.2, color: 'cyan', flare: false },
      { cx: 750, cy: 260, r: 3.2, color: 'cyan', flare: false },
      { cx: 140, cy: 310, r: 4.5, color: 'gold', flare: true, flareSize: 26 },
      { cx: 860, cy: 310, r: 4.5, color: 'gold', flare: true, flareSize: 26 },
      { cx: 110, cy: 390, r: 2.8, color: 'emerald', flare: false },
      { cx: 220, cy: 350, r: 2.6, color: 'cyan', flare: false },
      { cx: 780, cy: 350, r: 2.6, color: 'cyan', flare: false },
      { cx: 890, cy: 390, r: 2.8, color: 'emerald', flare: false },
      { cx: 450, cy: 250, r: 3.0, color: 'emerald', flare: false },
      { cx: 550, cy: 250, r: 3.0, color: 'emerald', flare: false },
      { cx: 500, cy: 330, r: 3.6, color: 'emerald', flare: true, flareSize: 20 },
      { cx: 450, cy: 440, r: 2.8, color: 'cyan', flare: false },
      { cx: 550, cy: 440, r: 2.8, color: 'cyan', flare: false },
      { cx: 500, cy: 490, r: 3.4, color: 'gold', flare: true, flareSize: 20 }
    ]
  },

  // 2. PROGRAMS: Rasi Al-Dubb Al-Akbar (Ursa Major / Bintang Biduk)
  // Perfectly elevated in high northern celestial dome (Y: 45 - 195).
  // Zero collision with section header, subtitle ("Digerakkan melalui 5 divisi..."), or cards!
  {
    id: 'programs',
    name: 'Al-Dubb Al-Akbar (Ursa Major)',
    arabic: 'الدب الأكبر',
    meaning: 'Bintang Biduk — Penunjuk Arah Lima Pilar Gerakan & Kompas Dakwah',
    lines: [
      // Dipper Bowl (Dubhe, Megrez, Phecda, Merak) — High in celestial sky
      [330, 110, 460, 120], // Dubhe to Megrez (Rim)
      [460, 120, 440, 195], // Megrez to Phecda (Right side)
      [440, 195, 320, 185], // Phecda to Merak (Base)
      [320, 185, 330, 110], // Merak to Dubhe (Pointer edge)
      // Dipper Handle (Arches smoothly toward the northeast sky)
      [460, 120, 580, 105], // Megrez to Alioth
      [580, 105, 690, 95],  // Alioth to Mizar
      [690, 95, 800, 115]   // Mizar to Alkaid
    ],
    dashedLines: [
      // Celestial Pointer Line: Merak through Dubhe pointing directly to Polaris (Al-Qutb)
      [330, 110, 340, 40]
    ],
    orbitRings: [
      // Polaris (North Star) Celestial Pole Navigation Coordinate Rings
      { cx: 340, cy: 40, r: 22, color: 'gold' },
      { cx: 340, cy: 40, r: 38, color: 'emerald' },
      // Alkaid Handle tip ring
      { cx: 800, cy: 115, r: 20, color: 'gold' },
      // Dubhe pointer anchor ring
      { cx: 330, cy: 110, r: 16, color: 'emerald' }
    ],
    stars: [
      { cx: 340, cy: 40, r: 5.8, color: 'gold', flare: true, flareSize: 38, label: 'Polaris (Al-Qutb)' },
      { cx: 330, cy: 110, r: 4.5, color: 'emerald', flare: true, flareSize: 26, label: 'Dubhe' },
      { cx: 320, cy: 185, r: 4.2, color: 'emerald', flare: true, flareSize: 24, label: 'Merak' },
      { cx: 440, cy: 195, r: 3.8, color: 'cyan', flare: false, label: 'Phecda' },
      { cx: 460, cy: 120, r: 3.8, color: 'emerald', flare: false, label: 'Megrez' },
      { cx: 580, cy: 105, r: 4.2, color: 'emerald', flare: true, flareSize: 24, label: 'Alioth' },
      { cx: 690, cy: 95, r: 4.5, color: 'gold', flare: true, flareSize: 28, label: 'Mizar & Alcor' },
      { cx: 800, cy: 115, r: 4.8, color: 'emerald', flare: true, flareSize: 30, label: 'Alkaid' }
    ]
  },

  // 3. QUOTE: Rasi Al-Jabbar (Orion — Sang Pejuang Gigih)
  // Framed elegantly around the quote card without horizontal strikethroughs
  {
    id: 'quote',
    name: 'Al-Jabbar (Orion)',
    arabic: 'الجبار',
    meaning: 'Sang Pejuang — Keteguhan Hati & Keikhlasan Jiwa Dakwah Generasi Islam',
    lines: [
      // Shoulders
      [330, 150, 670, 160],
      // Head
      [500, 95, 330, 150],
      [500, 95, 670, 160],
      // Upper Body to Belt
      [330, 150, 440, 310],
      [670, 160, 560, 320],
      // Belt (Alnitak, Alnilam, Mintaka)
      [440, 310, 500, 315],
      [500, 315, 560, 320],
      // Belt to Lower Body
      [440, 310, 360, 520],
      [560, 320, 640, 510],
      // Base
      [360, 520, 640, 510],
      // Sword & Great Nebula
      [500, 315, 500, 370],
      [500, 370, 495, 420],
      // Shield Arc
      [670, 160, 750, 220],
      [750, 220, 760, 310],
      [760, 310, 740, 400],
      // Raised Arm
      [330, 150, 260, 95],
      [260, 95, 280, 55]
    ],
    dashedLines: [
      [750, 220, 740, 400],
      [360, 520, 500, 420],
      [500, 420, 640, 510]
    ],
    orbitRings: [
      // Betelgeuse (Red/Gold Supergiant)
      { cx: 330, cy: 150, r: 28, color: 'gold' },
      // Rigel (Blue/Emerald Supergiant)
      { cx: 640, cy: 510, r: 30, color: 'emerald' },
      // Central Belt alignment circle
      { cx: 500, cy: 315, r: 20, color: 'gold' }
    ],
    stars: [
      { cx: 330, cy: 150, r: 5.6, color: 'gold', flare: true, flareSize: 38, label: 'Betelgeuse (Ibt al-Jawza)' },
      { cx: 670, cy: 160, r: 4.8, color: 'emerald', flare: true, flareSize: 28, label: 'Bellatrix' },
      { cx: 500, cy: 95, r: 3.4, color: 'cyan', flare: false, label: 'Meissa' },
      { cx: 440, cy: 310, r: 4.0, color: 'gold', flare: true, flareSize: 24, label: 'Alnitak' },
      { cx: 500, cy: 315, r: 4.5, color: 'emerald', flare: true, flareSize: 26, label: 'Alnilam' },
      { cx: 560, cy: 320, r: 4.0, color: 'gold', flare: true, flareSize: 24, label: 'Mintaka' },
      { cx: 500, cy: 370, r: 3.0, color: 'cyan', flare: false },
      { cx: 495, cy: 420, r: 4.0, color: 'emerald', flare: true, flareSize: 22, label: 'Nebula Orion' },
      { cx: 360, cy: 520, r: 4.0, color: 'emerald', flare: true, flareSize: 24, label: 'Saiph' },
      { cx: 640, cy: 510, r: 5.8, color: 'emerald', flare: true, flareSize: 38, label: 'Rigel (Rijl al-Jawza)' },
      { cx: 750, cy: 220, r: 2.8, color: 'emerald', flare: false },
      { cx: 760, cy: 310, r: 3.0, color: 'cyan', flare: false },
      { cx: 740, cy: 400, r: 2.8, color: 'emerald', flare: false },
      { cx: 260, cy: 95, r: 3.0, color: 'gold', flare: false },
      { cx: 280, cy: 55, r: 2.8, color: 'cyan', flare: false }
    ]
  },

  // 4. EVENTS: Rasi Dzat Al-Kursi (Cassiopeia — Mahkota Kemuliaan)
  // Clean iconic W-crown in the upper sky with royal crown apex
  {
    id: 'events',
    name: 'Dzat Al-Kursi (Cassiopeia)',
    arabic: 'ذات الكرسي',
    meaning: 'Mahkota Kemuliaan — Agenda & Syiar Syarafah Penuh Berkah',
    lines: [
      // Iconic "W" shape
      [180, 200, 330, 130],
      [330, 130, 500, 190],
      [500, 190, 670, 130],
      [670, 130, 820, 200],
      // Royal Crown Peak Arch
      [330, 130, 500, 70],
      [500, 70, 670, 130],
      // Royal Halo Ray
      [500, 70, 500, 25]
    ],
    dashedLines: [
      [500, 70, 500, 25],
      [180, 200, 330, 70],
      [670, 70, 820, 200]
    ],
    orbitRings: [
      { cx: 500, cy: 190, r: 26, color: 'emerald' },
      { cx: 330, cy: 130, r: 22, color: 'gold' },
      { cx: 500, cy: 25, r: 18, color: 'gold' }
    ],
    stars: [
      { cx: 180, cy: 200, r: 4.2, color: 'emerald', flare: true, flareSize: 24, label: 'Caph (Kaff)' },
      { cx: 330, cy: 130, r: 5.0, color: 'gold', flare: true, flareSize: 32, label: 'Schedar (Al-Sadr)' },
      { cx: 500, cy: 70, r: 3.8, color: 'cyan', flare: false },
      { cx: 500, cy: 25, r: 4.5, color: 'gold', flare: true, flareSize: 28, label: 'Bintang Mahkota' },
      { cx: 500, cy: 190, r: 5.4, color: 'emerald', flare: true, flareSize: 36, label: 'Navi (Gamma Cas)' },
      { cx: 670, cy: 130, r: 4.4, color: 'cyan', flare: true, flareSize: 26, label: 'Ruchbah' },
      { cx: 820, cy: 200, r: 4.0, color: 'gold', flare: true, flareSize: 24, label: 'Segin' }
    ]
  },

  // 5. MEDIA: Rasi Al-Faras (Pegasus — Kuda Bersayap Dakwah)
  // The Great Square & outspread wings, keeping center airy
  {
    id: 'media',
    name: 'Al-Faras Al-A\'zam (Pegasus)',
    arabic: 'الفرس الأعظم',
    meaning: 'Kuda Bersayap — Kecepatan Dakwah Kreatif, Media & Informasi Digital',
    lines: [
      // The Great Square perimeter
      [340, 200, 660, 180],
      [660, 180, 680, 420],
      [680, 420, 320, 410],
      [320, 410, 340, 200],
      // Wing Feathers (Extending toward left margin)
      [340, 200, 210, 150],
      [210, 150, 130, 230],
      [210, 150, 160, 80],
      [160, 80, 270, 110],
      // Mane & Head (Extending toward right margin)
      [660, 180, 770, 240],
      [770, 240, 860, 320],
      [860, 320, 840, 410],
      // Front Legs
      [320, 410, 240, 520],
      [680, 420, 740, 530]
    ],
    dashedLines: [
      [130, 230, 240, 520],
      [840, 410, 740, 530]
    ],
    orbitRings: [
      { cx: 340, cy: 200, r: 24, color: 'gold' },
      { cx: 320, cy: 410, r: 24, color: 'gold' },
      { cx: 860, cy: 320, r: 22, color: 'emerald' }
    ],
    stars: [
      { cx: 340, cy: 200, r: 4.8, color: 'gold', flare: true, flareSize: 30, label: 'Scheat' },
      { cx: 660, cy: 180, r: 4.6, color: 'emerald', flare: true, flareSize: 28, label: 'Alpheratz' },
      { cx: 680, cy: 420, r: 4.8, color: 'emerald', flare: true, flareSize: 30, label: 'Algenib' },
      { cx: 320, cy: 410, r: 5.0, color: 'gold', flare: true, flareSize: 32, label: 'Markab' },
      { cx: 210, cy: 150, r: 3.6, color: 'cyan', flare: false },
      { cx: 130, cy: 230, r: 3.2, color: 'emerald', flare: false },
      { cx: 160, cy: 80, r: 3.8, color: 'gold', flare: true, flareSize: 22 },
      { cx: 270, cy: 110, r: 3.0, color: 'cyan', flare: false },
      { cx: 770, cy: 240, r: 3.4, color: 'emerald', flare: false },
      { cx: 860, cy: 320, r: 4.6, color: 'emerald', flare: true, flareSize: 26, label: 'Enif' },
      { cx: 840, cy: 410, r: 3.2, color: 'cyan', flare: false },
      { cx: 240, cy: 520, r: 3.2, color: 'emerald', flare: false },
      { cx: 740, cy: 530, r: 3.2, color: 'cyan', flare: false }
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
      [500, 130, 500, 540],
      [370, 290, 630, 290],
      // Diamond Halo
      [500, 130, 630, 290],
      [630, 290, 500, 540],
      [500, 540, 370, 290],
      [370, 290, 500, 130],
      // Pointer Stars (Alpha & Beta Centauri)
      [760, 390, 870, 460],
      // Alignment Ray
      [630, 290, 760, 390],
      // Balance Pans (Al-Mizan Scales)
      [370, 290, 300, 400],
      [300, 400, 410, 400],
      [410, 400, 370, 290],
      [630, 290, 580, 400],
      [580, 400, 690, 400],
      [690, 400, 630, 290]
    ],
    dashedLines: [
      [500, 130, 500, 50],
      [500, 540, 500, 640]
    ],
    orbitRings: [
      { cx: 500, cy: 540, r: 28, color: 'emerald' },
      { cx: 500, cy: 130, r: 22, color: 'gold' },
      { cx: 870, cy: 460, r: 30, color: 'gold' }
    ],
    stars: [
      { cx: 500, cy: 130, r: 4.8, color: 'gold', flare: true, flareSize: 30, label: 'Gacrux' },
      { cx: 500, cy: 540, r: 5.8, color: 'emerald', flare: true, flareSize: 38, label: 'Acrux (Al-Janub)' },
      { cx: 370, cy: 290, r: 4.6, color: 'emerald', flare: true, flareSize: 28, label: 'Mimosa' },
      { cx: 630, cy: 290, r: 4.2, color: 'cyan', flare: true, flareSize: 26, label: 'Delta Crucis' },
      { cx: 540, cy: 370, r: 2.8, color: 'emerald', flare: false, label: 'Ginan' },
      { cx: 760, cy: 390, r: 4.8, color: 'emerald', flare: true, flareSize: 30, label: 'Hadar' },
      { cx: 870, cy: 460, r: 6.0, color: 'gold', flare: true, flareSize: 42, label: 'Rigil Kentaurus' },
      { cx: 300, cy: 400, r: 3.0, color: 'cyan', flare: false },
      { cx: 410, cy: 400, r: 3.0, color: 'cyan', flare: false },
      { cx: 580, cy: 400, r: 3.0, color: 'emerald', flare: false },
      { cx: 690, cy: 400, r: 3.0, color: 'emerald', flare: false }
    ]
  }
];
