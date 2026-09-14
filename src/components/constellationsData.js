// =========================================================
// CELESTIAL CONSTELLATIONS DATA
// Islamic & Classical Astronomical Formations
// Normalized to 1000 x 800 SVG ViewBox
// =========================================================

export const CONSTELLATIONS = [
  // 1. HERO: Rasi Al-Thair (Aquila / Altair — Elang Dakwah)
  {
    id: 'hero',
    name: 'Al-Thair (Aquila)',
    arabic: 'النسر الطائر',
    meaning: 'Elang Terbang — Simbol Keteguhan & Sayap Gerakan Dakwah',
    lines: [
      // Wings span
      [160, 330, 260, 280],
      [260, 280, 380, 240],
      [380, 240, 500, 210],
      [500, 210, 620, 240],
      [620, 240, 740, 280],
      [740, 280, 840, 330],
      // Diamond Heart / Chest
      [500, 210, 460, 290],
      [460, 290, 500, 380],
      [500, 380, 540, 290],
      [540, 290, 500, 210],
      // Body to Tail
      [500, 380, 460, 490],
      [500, 380, 540, 490],
      [460, 490, 540, 490],
      // Head
      [500, 210, 500, 120]
    ],
    stars: [
      { cx: 500, cy: 210, r: 4.5, color: 'gold', flare: true, flareSize: 28, label: 'Altair' },
      { cx: 500, cy: 120, r: 2.8, color: 'emerald', flare: false },
      { cx: 380, cy: 240, r: 3.2, color: 'emerald', flare: true, flareSize: 18, label: 'Tarazed' },
      { cx: 620, cy: 240, r: 3.2, color: 'emerald', flare: true, flareSize: 18, label: 'Alshain' },
      { cx: 260, cy: 280, r: 2.6, color: 'cyan', flare: false },
      { cx: 740, cy: 280, r: 2.6, color: 'cyan', flare: false },
      { cx: 160, cy: 330, r: 3.6, color: 'gold', flare: true, flareSize: 22 },
      { cx: 840, cy: 330, r: 3.6, color: 'gold', flare: true, flareSize: 22 },
      { cx: 460, cy: 290, r: 2.5, color: 'emerald', flare: false },
      { cx: 540, cy: 290, r: 2.5, color: 'emerald', flare: false },
      { cx: 500, cy: 380, r: 3.0, color: 'emerald', flare: true, flareSize: 16 },
      { cx: 460, cy: 490, r: 2.4, color: 'cyan', flare: false },
      { cx: 540, cy: 490, r: 2.4, color: 'cyan', flare: false }
    ]
  },

  // 2. PROGRAMS: Rasi Al-Dubb Al-Akbar (Ursa Major / Bintang Biduk)
  {
    id: 'programs',
    name: 'Al-Dubb Al-Akbar (Ursa Major)',
    arabic: 'الدب الأكبر',
    meaning: 'Bintang Biduk — Penunjuk Arah Lima Pilar Gerakan',
    lines: [
      // Bowl of dipper
      [310, 270, 470, 250],
      [470, 250, 480, 390],
      [480, 390, 320, 400],
      [320, 400, 310, 270],
      // Handle
      [470, 250, 590, 290],
      [590, 290, 710, 350],
      [710, 350, 830, 460],
      // Pointer line to Polaris (North Star)
      [470, 250, 480, 110]
    ],
    dashedLines: [
      [470, 250, 480, 110] // Pointer ray to Polaris
    ],
    stars: [
      { cx: 480, cy: 110, r: 5.0, color: 'gold', flare: true, flareSize: 32, label: 'Polaris (Al-Qutb)' },
      { cx: 310, cy: 270, r: 3.5, color: 'emerald', flare: true, flareSize: 20, label: 'Dubhe' },
      { cx: 470, cy: 250, r: 3.5, color: 'emerald', flare: true, flareSize: 20, label: 'Merak' },
      { cx: 480, cy: 390, r: 3.0, color: 'cyan', flare: false, label: 'Phecda' },
      { cx: 320, cy: 400, r: 3.0, color: 'emerald', flare: false, label: 'Megrez' },
      { cx: 590, cy: 290, r: 3.4, color: 'emerald', flare: true, flareSize: 18, label: 'Alioth' },
      { cx: 710, cy: 350, r: 3.4, color: 'gold', flare: true, flareSize: 20, label: 'Mizar' },
      { cx: 830, cy: 460, r: 3.8, color: 'emerald', flare: true, flareSize: 24, label: 'Alkaid' }
    ]
  },

  // 3. QUOTE: Rasi Al-Jabbar (Orion — Sang Pejuang Gigih)
  {
    id: 'quote',
    name: 'Al-Jabbar (Orion)',
    arabic: 'الجبار',
    meaning: 'Sang Pejuang — Keteguhan Hati Generasi Islami',
    lines: [
      // Shoulders
      [340, 190, 660, 200],
      // Upper Body to Belt
      [340, 190, 440, 360],
      [660, 200, 560, 380],
      // Belt (Alnitak, Alnilam, Mintaka)
      [440, 360, 500, 370],
      [500, 370, 560, 380],
      // Belt to Lower Body
      [440, 360, 370, 560],
      [560, 380, 630, 550],
      // Base
      [370, 560, 630, 550],
      // Sword / Nebula
      [500, 370, 500, 430],
      [500, 430, 495, 470],
      // Shield arc
      [660, 200, 740, 260],
      [740, 260, 750, 350],
      [750, 350, 730, 440]
    ],
    stars: [
      { cx: 340, cy: 190, r: 4.8, color: 'gold', flare: true, flareSize: 30, label: 'Betelgeuse (Ibt al-Jawza)' },
      { cx: 660, cy: 200, r: 4.2, color: 'emerald', flare: true, flareSize: 24, label: 'Bellatrix' },
      { cx: 440, cy: 360, r: 3.5, color: 'gold', flare: true, flareSize: 20, label: 'Alnitak' },
      { cx: 500, cy: 370, r: 3.8, color: 'emerald', flare: true, flareSize: 22, label: 'Alnilam' },
      { cx: 560, cy: 380, r: 3.5, color: 'gold', flare: true, flareSize: 20, label: 'Mintaka' },
      { cx: 500, cy: 430, r: 2.6, color: 'cyan', flare: false },
      { cx: 495, cy: 470, r: 3.0, color: 'cyan', flare: true, flareSize: 16 },
      { cx: 370, cy: 560, r: 3.4, color: 'emerald', flare: false, label: 'Saiph' },
      { cx: 630, cy: 550, r: 4.8, color: 'emerald', flare: true, flareSize: 30, label: 'Rigel (Rijl al-Jawza)' },
      { cx: 740, cy: 260, r: 2.2, color: 'emerald', flare: false },
      { cx: 750, cy: 350, r: 2.4, color: 'cyan', flare: false },
      { cx: 730, cy: 440, r: 2.2, color: 'emerald', flare: false }
    ]
  },

  // 4. EVENTS: Rasi Dzat Al-Kursi (Cassiopeia — Sang Ratu / Mahkota Kemenangan)
  {
    id: 'events',
    name: 'Dzat Al-Kursi (Cassiopeia)',
    arabic: 'ذات الكرسي',
    meaning: 'Mahkota Kemuliaan — Agenda & Syiar Kegiatan Penuh Berkah',
    lines: [
      // Iconic "W" shape
      [220, 310, 360, 190],
      [360, 190, 500, 290],
      [500, 290, 640, 180],
      [640, 180, 780, 280],
      // Crown arch support
      [360, 190, 500, 140],
      [500, 140, 640, 180],
      [220, 310, 350, 420],
      [350, 420, 500, 290],
      [500, 290, 650, 420],
      [650, 420, 780, 280]
    ],
    stars: [
      { cx: 220, cy: 310, r: 3.4, color: 'emerald', flare: true, flareSize: 18, label: 'Caph' },
      { cx: 360, cy: 190, r: 4.5, color: 'gold', flare: true, flareSize: 28, label: 'Schedar (Al-Sadr)' },
      { cx: 500, cy: 140, r: 3.2, color: 'emerald', flare: false },
      { cx: 500, cy: 290, r: 4.6, color: 'emerald', flare: true, flareSize: 28, label: 'Navi (Gamma Cas)' },
      { cx: 640, cy: 180, r: 3.8, color: 'cyan', flare: true, flareSize: 22, label: 'Ruchbah' },
      { cx: 780, cy: 280, r: 3.4, color: 'gold', flare: true, flareSize: 20, label: 'Segin' },
      { cx: 350, cy: 420, r: 2.6, color: 'emerald', flare: false },
      { cx: 650, cy: 420, r: 2.6, color: 'cyan', flare: false }
    ]
  },

  // 5. MEDIA: Rasi Al-Faras (Pegasus — Cahaya Inspirasi & Kreativitas Dakwah)
  {
    id: 'media',
    name: 'Al-Faras Al-A\'zam (Pegasus)',
    arabic: 'الفرس الأعظم',
    meaning: 'Kuda Bersayap — Kecepatan Dakwah Kreatif & Media Islami',
    lines: [
      // The Great Square of Pegasus
      [340, 240, 660, 220],
      [660, 220, 680, 490],
      [680, 490, 320, 480],
      [320, 480, 340, 240],
      // Wing Extension
      [340, 240, 210, 180],
      [210, 180, 130, 260],
      [210, 180, 160, 100],
      // Neck and Head
      [660, 220, 770, 280],
      [770, 280, 860, 370],
      [860, 370, 840, 460],
      // Forelegs
      [320, 480, 250, 590],
      [680, 490, 740, 600]
    ],
    stars: [
      { cx: 340, cy: 240, r: 4.2, color: 'gold', flare: true, flareSize: 26, label: 'Scheat' },
      { cx: 660, cy: 220, r: 4.0, color: 'emerald', flare: true, flareSize: 24, label: 'Alpheratz' },
      { cx: 680, cy: 490, r: 4.2, color: 'emerald', flare: true, flareSize: 26, label: 'Algenib' },
      { cx: 320, cy: 480, r: 4.4, color: 'gold', flare: true, flareSize: 28, label: 'Markab' },
      { cx: 210, cy: 180, r: 3.2, color: 'cyan', flare: false },
      { cx: 130, cy: 260, r: 2.8, color: 'emerald', flare: false },
      { cx: 160, cy: 100, r: 3.0, color: 'gold', flare: true, flareSize: 18 },
      { cx: 770, cy: 280, r: 3.0, color: 'emerald', flare: false },
      { cx: 860, cy: 370, r: 3.8, color: 'emerald', flare: true, flareSize: 22, label: 'Enif' },
      { cx: 840, cy: 460, r: 2.8, color: 'cyan', flare: false },
      { cx: 250, cy: 590, r: 2.6, color: 'emerald', flare: false },
      { cx: 740, cy: 600, r: 2.6, color: 'cyan', flare: false }
    ]
  },

  // 6. CTA / FOOTER: Rasi Al-Mizan / Crux (Southern Cross — Bintang Pari Pedoman Hidup)
  {
    id: 'cta',
    name: 'Al-Mizan & Crux (Bintang Pari)',
    arabic: 'الميزان والجنوب',
    meaning: 'Salib Selatan / Neraca — Kompas Penuntun Langkah Menuju Ridha Ilahi',
    lines: [
      // Central Cross
      [500, 160, 500, 580],
      [360, 330, 640, 330],
      // Diamond Halo
      [500, 160, 640, 330],
      [640, 330, 500, 580],
      [500, 580, 360, 330],
      [360, 330, 500, 160],
      // Pointer Stars (Alpha & Beta Centauri)
      [760, 420, 870, 480],
      // Alignment Ray
      [640, 330, 760, 420]
    ],
    stars: [
      { cx: 500, cy: 160, r: 4.2, color: 'gold', flare: true, flareSize: 26, label: 'Gacrux' },
      { cx: 500, cy: 580, r: 5.0, color: 'emerald', flare: true, flareSize: 32, label: 'Acrux (Al-Janub)' },
      { cx: 360, cy: 330, r: 4.0, color: 'emerald', flare: true, flareSize: 24, label: 'Mimosa' },
      { cx: 640, cy: 330, r: 3.6, color: 'cyan', flare: true, flareSize: 22, label: 'Delta Crucis' },
      { cx: 550, cy: 410, r: 2.4, color: 'emerald', flare: false, label: 'Epsilon' },
      { cx: 760, cy: 420, r: 4.4, color: 'emerald', flare: true, flareSize: 28, label: 'Hadar' },
      { cx: 870, cy: 480, r: 5.2, color: 'gold', flare: true, flareSize: 34, label: 'Rigil Kentaurus' }
    ]
  }
];
