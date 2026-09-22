// ============================================
// ROHIS Kabupaten Banyumas — Data E-Library Awal
// E-Library / Perpustakaan Digital
// ============================================

export const initialLibrary = [
  {
    id: 'lib-001',
    title: 'Panduan Shalat Lengkap',
    category: 'Ibadah',
    fileUrl: 'https://drive.google.com',
    type: 'pdf',
    size: '2.5 MB',
    uploadedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'lib-002',
    title: 'Materi Kajian: Islam Rahmatan Lil Alamin',
    category: 'Dakwah',
    fileUrl: 'https://drive.google.com',
    type: 'pdf',
    size: '1.8 MB',
    uploadedAt: '2026-09-05T10:00:00Z',
  },
  {
    id: 'lib-003',
    title: 'Slide Presentasi: Etika Digital Islami',
    category: 'Edukasi',
    fileUrl: 'https://drive.google.com',
    type: 'slide',
    size: '5.2 MB',
    uploadedAt: '2026-09-10T10:00:00Z',
  },
];

export const libraryCategories = ['Semua', 'Ibadah', 'Dakwah', 'Edukasi', 'Kajian', 'Umum'];
export const libraryTypes = [
  { id: 'pdf', label: 'PDF', color: '#EF4444' },
  { id: 'slide', label: 'Slide Presentasi', color: '#F59E0B' },
  { id: 'doc', label: 'Dokumen', color: '#3B82F6' },
];
