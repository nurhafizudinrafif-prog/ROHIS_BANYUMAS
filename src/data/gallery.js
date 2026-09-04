// Data Dokumentasi Kegiatan / Galeri
// CARA MENAMBAH FOTO:
// 1. Simpan file foto Anda di folder 'public/gallery/' (misal: 'public/gallery/ldk.jpg')
// 2. Isi properti 'image' dengan path: '/gallery/nama-file.jpg'
// 3. Atau gunakan URL gambar dari internet (https://...)
// Jika 'image' dikosongkan (""), tampilan akan otomatis memakai ikon emoji fallback yang rapi.

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
    title: 'Kajian Ahad Pagi Akbar',
    category: 'Kajian',
    image: '', // Contoh: '/gallery/kajian-ahad.jpg'
    emoji: '📖',
    date: 'Februari 2025',
  },
  {
    id: 2,
    title: 'Latihan Dasar Kepemimpinan (LDK) 2025',
    category: 'Pelatihan',
    image: '', // Contoh: '/gallery/ldk-2025.jpg'
    emoji: '🎓',
    date: 'Januari 2025',
  },
  {
    id: 3,
    title: 'Bakti Sosial & Santunan Ramadhan',
    category: 'Sosial',
    image: '', // Contoh: '/gallery/baksos.jpg'
    emoji: '🤝',
    date: 'Ramadhan 1446 H',
  },
  {
    id: 4,
    title: 'Musyawarah Kerja Daerah (Mukerda)',
    category: 'Organisasi',
    image: '',
    emoji: '📋',
    date: 'Desember 2024',
  },
  {
    id: 5,
    title: 'Festival Da\'i Muda Pelajar Banyumas',
    category: 'Lomba',
    image: '',
    emoji: '🎤',
    date: 'November 2024',
  },
  {
    id: 6,
    title: 'Buka Puasa Bersama Lintas ROHIS',
    category: 'Sosial',
    image: '',
    emoji: '🍽️',
    date: 'Ramadhan 1445 H',
  },
  {
    id: 7,
    title: 'Workshop Desain & Media Dakwah Kreatif',
    category: 'Workshop',
    image: '',
    emoji: '💻',
    date: 'Oktober 2024',
  },
  {
    id: 8,
    title: 'Dauroh Tahsin Tilawah Al-Qur\'an',
    category: 'Kajian',
    image: '',
    emoji: '📕',
    date: 'September 2024',
  },
  {
    id: 9,
    title: 'Santunan & Belanja Ceria Anak Yatim',
    category: 'Sosial',
    image: '',
    emoji: '💝',
    date: 'Muharram 1446 H',
  },
];
