import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getMediaUrl } from '@shared/services/mediaHelper';
import {
  Container,
  PageHeader,
  FilterBar,
  InsetField,
  DocumentRow,
  AccessibleDialog,
  EmptyState,
} from '../components/ui/SoftUI';

const CURATED_DOCUMENTS = [
  {
    id: 'panduan-rohis-sekolah',
    title: 'Panduan Dasar Pengelolaan ROHIS Sekolah',
    category: 'Panduan ROHIS',
    fileType: 'PDF',
    meta: 'Panduan pengurus • 24 halaman',
    author: 'Bidang Kaderisasi ROKABA',
    description:
      'Pedoman terstruktur bagi pengurus baru dalam menyusun program kerja tahunan, tata tertib syuro, regenerasi kader, dan administrasi dasar ROHIS di sekolah.',
    outline: [
      'Struktur organisasi & pembagian amanah BPH ROHIS',
      'Penyusunan kalender kegiatan tahun ajaran berjalan',
      'SOP komunikasi dengan pembina dan kesiswaan sekolah',
    ],
  },
  {
    id: 'modul-kepemimpinan-pelajar',
    title: 'Modul Kepemimpinan dan Adab Bermusyawarah',
    category: 'Kepemimpinan',
    fileType: 'PDF',
    meta: 'Kaderisasi • 18 halaman',
    author: 'Dewan Pembina & Bidang SDM ROKABA',
    description:
      'Materi pegangan Latihan Dasar Kepemimpinan ROHIS (LDKR) yang membahas etika syuro, pengambilan keputusan yang adil, serta seni merangkul rekan sebaya.',
    outline: [
      'Prinsip syuro dan adab menyampaikan pendapat',
      'Manajemen konflik dan komunikasi empatik antar-pelajar',
      'Studi kasus pengelolaan kepanitiaan acara sekolah',
    ],
  },
  {
    id: 'kumpulan-materi-kajian-remaja',
    title: 'Kumpulan Materi Kajian Remaja Pilihan',
    category: 'Materi Kajian',
    fileType: 'SLIDE',
    meta: 'Syiar • 12 topik',
    author: 'Bidang Syiar & Dakwah ROKABA',
    description:
      'Rangkuman silabus dan salindia (slide) materi kajian remaja untuk menghidupkan halaqah mingguan maupun kajian bulanan di masjid sekolah.',
    outline: [
      'Menjaga adab menuntut ilmu di era digital',
      'Manajemen waktu antara akademik dan amanah organisasi',
      'Ukhuwah Islamiyah dan kepedulian sosial pelajar',
    ],
  },
];

export default function Library() {
  const { library = [], books = [] } = useData();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const allDocuments = useMemo(() => {
    const rawItems = [...library, ...books];
    const mappedCms = rawItems.map((b) => {
      const catLower = String(b.category || '').toLowerCase();
      let mappedCategory = 'Materi Kajian';
      if (catLower.includes('panduan') || catLower.includes('modul')) {
        mappedCategory = 'Panduan ROHIS';
      } else if (catLower.includes('kepemimpinan') || catLower.includes('kader')) {
        mappedCategory = 'Kepemimpinan';
      }

      const hasValidExternalFile =
        b.fileUrl &&
        b.fileUrl !== '#' &&
        b.fileUrl !== 'https://drive.google.com';

      return {
        id: b.id,
        title: b.title,
        category: mappedCategory,
        fileType: String(b.type || b.fileType || 'PDF').toUpperCase(),
        meta: `${b.category || 'Materi ROHIS'}${b.size || b.fileSize ? ` • ${b.size || b.fileSize}` : ''}`,
        author: b.author || 'Tim Literasi ROKABA',
        description:
          b.description ||
          'Materi bacaan dan referensi resmi untuk mendukung kegiatan literasi serta pembinaan kader ROHIS.',
        fileUrl: hasValidExternalFile ? getMediaUrl(b.fileUrl) : '',
        outline: [
          'Ringkasan materi dan panduan praktis aplikasi di sekolah',
          'Referensi diskusi kelompok / mentoring pelajar',
        ],
      };
    });

    const existingTitles = new Set(CURATED_DOCUMENTS.map((d) => d.title.toLowerCase()));
    const extras = mappedCms.filter(
      (d) => !existingTitles.has(String(d.title || '').toLowerCase())
    );
    return [...CURATED_DOCUMENTS, ...extras];
  }, [library, books]);

  const categories = ['Semua', 'Panduan ROHIS', 'Kepemimpinan', 'Materi Kajian'];

  const filteredDocs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allDocuments.filter((doc) => {
      const matchesCat =
        activeCategory === 'Semua' ||
        String(doc.category || '').toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        !q ||
        String(doc.title || '').toLowerCase().includes(q) ||
        String(doc.description || '').toLowerCase().includes(q) ||
        String(doc.meta || '').toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [allDocuments, activeCategory, searchQuery]);

  return (
    <div className="rk-page">
      <PageHeader
        breadcrumb={[{ label: 'Beranda', to: '/' }, { label: 'Perpustakaan' }]}
        title="Bekal untuk terus belajar"
        lead="Unduh modul kepemimpinan, panduan kegiatan ROHIS, dan materi pembinaan pilihan."
      />

      <section className="rk-section" aria-label="Katalog perpustakaan dan modul">
        <Container>
          <FilterBar
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchNode={
              <InsetField
                id="rk-library-search"
                type="search"
                aria-label="Cari materi atau panduan"
                placeholder="Cari materi atau panduan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            }
          />

          {filteredDocs.length === 0 ? (
            <EmptyState
              title="Materi tidak ditemukan"
              description="Coba kata kunci lain atau pilih kategori Semua untuk menampilkan seluruh modul."
              action={
                <button
                  type="button"
                  className="rk-btn-secondary"
                  onClick={() => {
                    setActiveCategory('Semua');
                    setSearchQuery('');
                  }}
                >
                  Tampilkan semua materi
                </button>
              }
            />
          ) : (
            <div style={{ display: 'grid', gap: '14px' }}>
              {filteredDocs.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  badge={doc.fileType}
                  title={doc.title}
                  meta={doc.meta}
                  actionLabel="Lihat dokumen"
                  onAction={() => setSelectedDoc(doc)}
                />
              ))}
            </div>
          )}
        </Container>
      </section>

      <AccessibleDialog
        open={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        eyebrow={`${selectedDoc?.fileType || 'PDF'} • ${selectedDoc?.category || 'Materi'}`}
        title={selectedDoc?.title || ''}
      >
        {selectedDoc && (
          <div style={{ display: 'grid', gap: '16px' }}>
            <p>{selectedDoc.description}</p>

            {Array.isArray(selectedDoc.outline) && selectedDoc.outline.length > 0 && (
              <div className="rk-inset-panel" style={{ padding: '16px 18px' }}>
                <h3 style={{ fontSize: '0.94rem', marginBottom: '8px' }}>
                  Pokok Bahasan Utama
                </h3>
                <ul className="rk-program-list">
                  {selectedDoc.outline.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rk-inset-panel" style={{ padding: '14px 16px', fontSize: '0.86rem', color: 'var(--rk-muted)' }}>
              <strong style={{ color: 'var(--rk-ink)' }}>Penyusun: </strong>
              {selectedDoc.author} ({selectedDoc.meta})
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingTop: '4px' }}>
              {selectedDoc.fileUrl ? (
                <a
                  href={selectedDoc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rk-btn-primary"
                >
                  Unduh / Buka Dokumen ↗
                </a>
              ) : (
                <a
                  href={`mailto:rokaba.banyumas@gmail.com?subject=${encodeURIComponent(
                    `Permohonan Salinan Modul: ${selectedDoc.title}`
                  )}&body=${encodeURIComponent(
                    `Assalamu'alaikum Pengurus ROKABA,\n\nSaya ingin memohon salinan dokumen "${selectedDoc.title}" untuk referensi kegiatan ROHIS di sekolah kami.\n\nNama:\nAsal Sekolah:\n\nTerima kasih.`
                  )}`}
                  className="rk-btn-primary"
                >
                  Minta Salinan via Email Resmi
                </a>
              )}
              <Link
                to="/articles"
                className="rk-btn-secondary"
                onClick={() => setSelectedDoc(null)}
              >
                Baca Artikel Terkait
              </Link>
            </div>
          </div>
        )}
      </AccessibleDialog>
    </div>
  );
}
