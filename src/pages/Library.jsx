import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  AccessibleDialog,
  Container,
  SoftCard,
} from '../components/ui/SoftUI';

const CATEGORIES = ['Semua', 'Modul', 'Panduan', 'Ibadah', 'Kajian', 'Teknologi'];

const REFERENCE_DOCUMENTS = [
  {
    id: 'modul-kaderisasi',
    title: 'Modul kaderisasi',
    category: 'Modul',
    badge: 'PDF',
    size: '3.1 MB',
    description:
      'Panduan terstruktur pembinaan dasar, penguatan akhlak, dan kepemimpinan kader ROHIS SMA, SMK, dan MA di Kabupaten Banyumas.',
    topics: [
      'Adab menuntut ilmu dan berorganisasi',
      'Dasar-dasar kepemimpinan pelajar Muslim',
      'Manajemen dakwah sekolah yang ramah dan inklusif',
    ],
  },
  {
    id: 'panduan-kegiatan',
    title: 'Panduan kegiatan',
    category: 'Panduan',
    badge: 'PDF',
    size: '2.2 MB',
    description:
      'Pedoman teknis perencanaan, pelaksanaan, administrasi, dan evaluasi kegiatan ROHIS di tingkat sekolah maupun lintas sekolah.',
    topics: [
      'Penyusunan rencana kerja dan kepanitiaan',
      'Tata tertib surat-menyurat dan dokumentasi',
      'Evaluasi program dan keberlanjutan kegiatan',
    ],
  },
  {
    id: 'materi-pembinaan',
    title: 'Materi pembinaan',
    category: 'Modul',
    badge: 'PDF',
    size: '1.9 MB',
    description:
      'Kumpulan materi kajian pelajar, halaqah mingguan, dan inspirasi kebaikan sehari-hari untuk anggota ROHIS Banyumas.',
    topics: [
      'Menjaga semangat belajar dan ibadah harian',
      'Ukhuwah Islamiyah lintas sekolah',
      'Kontribusi positif pelajar di lingkungan sekitar',
    ],
  },
];

export default function Library() {
  const { library } = useData();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('Semua');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const cmsDocs = Array.isArray(library) ? library : [];

  const visibleDocs = useMemo(() => {
    const combined = [...REFERENCE_DOCUMENTS];
    cmsDocs.forEach((doc) => {
      if (
        doc?.title &&
        !combined.some((d) => d.title.toLowerCase() === doc.title.toLowerCase())
      ) {
        combined.push({
          id: String(doc.id || doc.title),
          title: doc.title,
          category: doc.category || 'Modul',
          badge: doc.type || 'PDF',
          size: doc.size || '2.0 MB',
          description:
            doc.description ||
            'Materi bacaan dan referensi kegiatan ROHIS Kabupaten Banyumas.',
          topics: [
            'Referensi resmi kegiatan dan dakwah pelajar ROKABA',
            'Bahan diskusi mentoring dan kajian unit ROHIS sekolah',
          ],
        });
      }
    });

    return combined.filter((item) => {
      const matchCat =
        activeCat === 'Semua' ||
        item.category.toLowerCase() === activeCat.toLowerCase();
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        `${item.title} ${item.description} ${item.category}`
          .toLowerCase()
          .includes(q);
      return matchCat && matchQuery;
    });
  }, [cmsDocs, activeCat, query]);

  return (
    <div className="rk-page">
      {/* 1. HEADER */}
      <section className="rk-page-header">
        <Container>
          <div className="rk-eyebrow" style={{ marginBottom: '8px' }}>
            <span className="rk-eyebrow-bar" aria-hidden="true" />
            <span>Perpustakaan Digital ROKABA</span>
          </div>

          <h1 className="rk-page-title">Bekal untuk terus belajar</h1>
          <p className="rk-page-lead" style={{ marginTop: '6px' }}>
            Koleksi modul kaderisasi, panduan kegiatan, dan materi kajian untuk
            mendukung gerak dakwah pelajar di sekolah.
          </p>
        </Container>
      </section>

      {/* 2. SEARCH BAR + PILLS + DOCUMENT ROWS */}
      <section className="rk-section" style={{ paddingTop: '6px' }}>
        <Container>
          <div className="rk-search-well" style={{ marginBottom: '14px' }}>
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              className="rk-inset-control"
              placeholder="Cari materi"
              aria-label="Cari materi"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="rk-filter-bar" style={{ marginBottom: '16px' }}>
            <div
              className="rk-filter-pills"
              role="group"
              aria-label="Filter kategori materi"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className="rk-pill"
                  aria-pressed={activeCat === cat}
                  onClick={() => setActiveCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '14px' }}>
            {visibleDocs.map((doc) => (
              <SoftCard
                key={doc.id}
                as="button"
                type="button"
                interactive
                className="rk-document-row"
                onClick={() => setSelectedDoc(doc)}
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <div>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '1.06rem',
                      color: 'var(--rk-ink)',
                    }}
                  >
                    {doc.title}
                  </strong>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.84rem',
                      color: 'var(--rk-muted)',
                      marginTop: '4px',
                    }}
                  >
                    {doc.description}
                  </span>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '14px',
                    flexShrink: 0,
                  }}
                >
                  <span className="rk-doc-badge">
                    {doc.badge} • {doc.size}
                  </span>

                  <span
                    aria-hidden="true"
                    style={{
                      width: '1px',
                      height: '20px',
                      background: 'var(--rk-line)',
                    }}
                  />

                  <span className="rk-card-link">
                    <span>Lihat dokumen</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </SoftCard>
            ))}
          </div>
        </Container>
      </section>

      <AccessibleDialog
        open={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        eyebrow={`Perpustakaan ROKABA • ${selectedDoc?.category || 'Materi'} (${selectedDoc?.size || 'PDF'})`}
        title={selectedDoc?.title || 'Detail Materi'}
      >
        {selectedDoc && (
          <div style={{ display: 'grid', gap: '12px' }}>
            <p style={{ fontSize: '0.94rem', lineHeight: 1.6 }}>
              {selectedDoc.description}
            </p>
            {Array.isArray(selectedDoc.topics) &&
              selectedDoc.topics.length > 0 && (
                <div className="rk-inset-panel">
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '0.88rem',
                      marginBottom: '6px',
                      color: 'var(--rk-ink)',
                    }}
                  >
                    Pokok Bahasan:
                  </strong>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '18px',
                      fontSize: '0.88rem',
                      color: 'var(--rk-muted)',
                      display: 'grid',
                      gap: '4px',
                    }}
                  >
                    {selectedDoc.topics.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}
      </AccessibleDialog>
    </div>
  );
}
