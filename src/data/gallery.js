// Data Dokumentasi Kegiatan / Galeri Multi-Media ROHIS Banyumas
// Sistem ini mendukung MULTI-MEDIA (Banyak Foto & Video per Kegiatan)
// Tipe media didukung:
// 1. type: 'image' -> URL gambar (https://... atau /gallery/nama-file.jpg)
// 2. type: 'video' -> Link YouTube (https://youtu.be/... atau https://www.youtube.com/watch?v=...) atau link direct MP4

export const galleryCategories = [
  'Semua',
  'Kajian',
  'Pelatihan',
  'Sosial',
  'Organisasi',
  'Lomba',
  'Workshop',
];

export const galleryItems = [
  {
    id: 1,
    title: 'Kajian Ahad Pagi Akbar Pelajar Banyumas',
    category: 'Kajian',
    date: '16 Februari 2025',
    description: 'Kajian akbar mempertemukan ratusan pelajar muslim se-Kabupaten Banyumas dengan tema Meneguhkan Iman & Karakter di Era Digital.',
    emoji: '📖',
    coverImage: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
    media: [
      {
        id: '1-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
        caption: 'Suasana pembukaan kajian akbar di masjid agung',
      },
      {
        id: '1-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Sesi tilawah Al-Qur\'an bersama seluruh peserta',
      },
      {
        id: '1-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
        caption: 'Pemaparan materi motivasi hijrah & prestasi oleh Ustadz',
      },
      {
        id: '1-4',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        caption: 'Dokumentasi video singkat suasana kajian dan antusiasme peserta',
      },
    ],
  },
  {
    id: 2,
    title: 'Latihan Dasar Kepemimpinan (LDK) ROHIS 2025',
    category: 'Pelatihan',
    date: '25 Januari 2025',
    description: 'Pelatihan intensif manajemen organisasi dakwah sekolah, kepemimpinan Islam, dan public speaking bagi calon ketua ROHIS.',
    emoji: '🎓',
    coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    media: [
      {
        id: '2-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
        caption: 'Sesi workshop kepemimpinan dan studi kasus dakwah sekolah',
      },
      {
        id: '2-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
        caption: 'Presentasi program kerja unggulan oleh delegasi tiap SMA/SMK',
      },
      {
        id: '2-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
        caption: 'Outbound team building untuk merekatkan ukhuwah antar pengurus',
      },
    ],
  },
  {
    id: 3,
    title: 'Bakti Sosial & Tebar Paket Sembako Ramadhan',
    category: 'Sosial',
    date: 'Ramadhan 1446 H',
    description: 'Aksi peduli sesama dengan membagikan 250+ paket sembako dan santunan tunai kepada kaum dhuafa di pelosok Banyumas.',
    emoji: '🤝',
    coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    media: [
      {
        id: '3-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Penyaluran paket berkah Ramadhan kepada warga penerima manfaat',
      },
      {
        id: '3-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
        caption: 'Relawan pelajar bergotong royong membungkus paket sembako',
      },
      {
        id: '3-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?auto=format&fit=crop&w=1200&q=80',
        caption: 'Senyum kebahagiaan adik-adik panti asuhan saat menerima santunan',
      },
    ],
  },
  {
    id: 4,
    title: 'Musyawarah Kerja Daerah (Mukerda) 2024/2025',
    category: 'Organisasi',
    date: 'Desember 2024',
    description: 'Sidang pleno evaluasi program kerja tahunan dan penetapan arah gerak strategis ROHIS Banyumas satu periode ke depan.',
    emoji: '📋',
    coverImage: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80',
    media: [
      {
        id: '4-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80',
        caption: 'Sidang pleno Mukerda bersama jajaran pimpinan BPH & koordinator divisi',
      },
      {
        id: '4-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80',
        caption: 'Penandatanganan pakta integritas dan komitmen kepengurusan',
      },
    ],
  },
  {
    id: 5,
    title: 'Festival Da\'i Muda Pelajar Tingkat Kabupaten',
    category: 'Lomba',
    date: 'November 2024',
    description: 'Ajang kompetisi syiar dakwah pelajar se-Kabupaten Banyumas meliputi cabang Pidato Dai, MTQ, Kaligrafi, dan Nasyid Akapela.',
    emoji: '🎤',
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    media: [
      {
        id: '5-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
        caption: 'Penampilan salah satu finalis lomba Da\'i Muda di panggung utama',
      },
      {
        id: '5-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        caption: 'Dewan juri menyimak lantunan tilawah merdu peserta MTQ',
      },
      {
        id: '5-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80',
        caption: 'Penyerahan trofi juara umum festival oleh Pembina ROHIS',
      },
    ],
  },
  {
    id: 6,
    title: 'Workshop Desain Grafis & Konten Dakwah Digital',
    category: 'Workshop',
    date: 'Oktober 2024',
    description: 'Pelatihan pembuatan infografis islami, editing reels dakwah, dan copywriting persuasif untuk tim media sekolah.',
    emoji: '💻',
    coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    media: [
      {
        id: '6-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
        caption: 'Praktik langsung mendesain poster dakwah menggunakan aplikasi desain',
      },
      {
        id: '6-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Diskusi kelompok pembuatan konsep konten video kreatif dakwah TikTok & IG Reels',
      },
    ],
  },
];
