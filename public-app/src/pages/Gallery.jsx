import { useMemo, useState } from 'react';
import { Play } from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  AccessibleDialog,
  Container,
  PhotoFrame,
  ROKABA_REAL_PHOTOS,
  SoftCard,
  SmartImage,
} from '../components/ui/SoftUI';

const HERO_BENTO_ITEMS = [
  {
    id: 'foto-utama',
    type: 'Foto',
    category: 'Organisasi',
    date: '07 Sep 2025',
    title: 'Dokumentasi kegiatan',
    subtitle: 'Kebersamaan kader ROHIS Kabupaten Banyumas',
    description:
      'Dokumentasi kebersamaan pengurus dan kader ROHIS SMA, SMK, dan MA se-Kabupaten Banyumas dalam agenda rutin organisasi.',
    src: ROKABA_REAL_PHOTOS[0],
  },
  {
    id: 'foto-kedua',
    type: 'Foto',
    category: 'Pelatihan',
    date: '20 Sep 2025',
    title: 'Dokumentasi kegiatan',
    subtitle: 'Silaturahmi lintas SMA, SMK, dan MA se-Banyumas',
    description:
      'Forum silaturahmi, konsolidasi program kerja, dan pembinaan kepemimpinan pelajar Muslim Banyumas.',
    src: ROKABA_REAL_PHOTOS[1],
  },
  {
    id: 'video-dok',
    type: 'Video',
    category: 'Lomba',
    date: '16 Mei 2025',
    title: 'Dokumentasi kegiatan',
    subtitle: 'Rekaman kegiatan & kebersamaan kader ROKABA',
    description:
      'Sorotan kegiatan Rohis Banyumas Competition (RBC) × PECETIKAH dan kajian pelajar akbar Kabupaten Banyumas.',
    src: ROKABA_REAL_PHOTOS[2],
    isVideo: true,
  },
];

const CATEGORIES = [
  'Semua',
  'Foto',
  'Video',
  'Kajian',
  'Pelatihan',
  'Sosial',
  'Lomba',
  'Organisasi',
];

export default function Gallery() {
  const { gallery } = useData();
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedItem, setSelectedItem] = useState(null);

  const albumItems = useMemo(() => {
    const raw = Array.isArray(gallery) ? gallery : [];
    return raw.map((album, idx) => {
      const hasVideo =
        Array.isArray(album.media) &&
        album.media.some((m) => m.type === 'video');
      const photoSrc = ROKABA_REAL_PHOTOS[idx % ROKABA_REAL_PHOTOS.length];
      return {
        id: album.id || `album-${idx}`,
        title: album.title || 'Album Dokumentasi ROKABA',
        subtitle: album.description || 'Dokumentasi kegiatan ROHIS Banyumas',
        description:
          album.description ||
          'Dokumentasi resmi kegiatan pelajar Muslim ROHIS Kabupaten Banyumas.',
        category: album.category || 'Kegiatan',
        date: album.date || '2025',
        type: hasVideo ? 'Video' : 'Foto',
        isVideo: hasVideo,
        src: photoSrc,
        mediaCount: Array.isArray(album.media) ? album.media.length : 1,
      };
    });
  }, [gallery]);

  const filteredAlbums = useMemo(() => {
    if (activeTab === 'Semua') return albumItems;
    if (activeTab === 'Foto' || activeTab === 'Video') {
      return albumItems.filter((a) => a.type === activeTab);
    }
    return albumItems.filter(
      (a) => a.category.toLowerCase() === activeTab.toLowerCase()
    );
  }, [albumItems, activeTab]);

  return (
    <div className="rk-page">
      {/* 1. HEADER */}
      <section className="rk-page-header">
        <Container>
          <div className="rk-eyebrow" style={{ marginBottom: '8px' }}>
            <span className="rk-eyebrow-bar" aria-hidden="true" />
            <span>Galeri Kegiatan ROKABA</span>
          </div>

          <h1 className="rk-page-title">Cerita dalam kebersamaan</h1>
        </Container>
      </section>

      {/* 2. FILTER PILLS + BENTO GRID */}
      <section className="rk-section" style={{ paddingTop: '8px' }}>
        <Container>
          <div className="rk-filter-bar" style={{ marginBottom: '18px' }}>
            <div
              className="rk-filter-pills"
              role="group"
              aria-label="Filter tipe galeri"
            >
              {CATEGORIES.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className="rk-pill"
                  aria-pressed={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Reference Bento Grid */}
          <div className="rk-gallery-bento" style={{ marginBottom: '28px' }}>
            {/* Left Large Framed Photo */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSelectedItem(HERO_BENTO_ITEMS[0])}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedItem(HERO_BENTO_ITEMS[0]);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <PhotoFrame
                src={HERO_BENTO_ITEMS[0].src}
                alt="Dokumentasi kegiatan kader ROHIS Kabupaten Banyumas"
                aspect="16/11.6"
                captionTitle="Dokumentasi kegiatan"
                captionSub="Kebersamaan kader ROHIS Kabupaten Banyumas"
                eager
              />
            </div>

            {/* Right Stacked 2 Framed Photos */}
            <div className="rk-gallery-bento-side">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedItem(HERO_BENTO_ITEMS[1])}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedItem(HERO_BENTO_ITEMS[1]);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <PhotoFrame
                  src={HERO_BENTO_ITEMS[1].src}
                  alt="Dokumentasi kegiatan pengurus ROKABA"
                  aspect="16/8.6"
                  captionTitle="Dokumentasi kegiatan"
                  captionSub="Silaturahmi lintas SMA, SMK, dan MA"
                />
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedItem(HERO_BENTO_ITEMS[2])}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedItem(HERO_BENTO_ITEMS[2]);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <PhotoFrame
                  src={HERO_BENTO_ITEMS[2].src}
                  alt="Video dokumentasi kegiatan ROKABA"
                  aspect="16/8.6"
                  captionTitle="Dokumentasi kegiatan"
                  captionSub="Sorotan RBC × PECETIKAH & Kajian Akbar"
                >
                  <span className="rk-glass-play" aria-hidden="true">
                    <Play size={16} fill="currentColor" />
                  </span>
                </PhotoFrame>
              </div>
            </div>
          </div>

          {/* 3. COMPLETE ALBUM ARCHIVE FROM ROHIS-BANYUMAS.WEB.ID */}
          <div className="rk-section-head" style={{ marginBottom: '16px' }}>
            <h2>Arsip Dokumentasi & Album Kegiatan ({filteredAlbums.length})</h2>
          </div>

          <div className="rk-grid-3">
            {filteredAlbums.map((album) => (
              <SoftCard
                key={album.id}
                as="button"
                type="button"
                interactive
                onClick={() => setSelectedItem(album)}
                style={{
                  padding: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    aspectRatio: '16/10',
                    background: 'var(--rk-surface-recessed)',
                  }}
                >
                  <SmartImage
                    src={album.src}
                    alt={album.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {album.isVideo && (
                    <span className="rk-glass-play" aria-hidden="true">
                      <Play size={15} fill="currentColor" />
                    </span>
                  )}
                </div>

                <div style={{ padding: '2px 4px 4px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '6px',
                    }}
                  >
                    <span className="rk-doc-badge">{album.category}</span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--rk-muted)',
                        fontWeight: 600,
                      }}
                    >
                      {album.date}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.04rem', lineHeight: 1.28 }}>
                    {album.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.84rem',
                      color: 'var(--rk-muted)',
                      marginTop: '6px',
                      lineHeight: 1.5,
                    }}
                  >
                    {album.description}
                  </p>
                </div>
              </SoftCard>
            ))}
          </div>
        </Container>
      </section>

      <AccessibleDialog
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        eyebrow={`${selectedItem?.category || 'Galeri'} • ${selectedItem?.date || 'ROKABA'}`}
        title={selectedItem?.title || 'Dokumentasi kegiatan'}
      >
        {selectedItem && (
          <div style={{ display: 'grid', gap: '12px' }}>
            <PhotoFrame
              src={selectedItem.src}
              alt={selectedItem.subtitle || selectedItem.title}
              aspect="16/10"
              captionTitle={selectedItem.title}
              captionSub={selectedItem.subtitle}
            />
            {selectedItem.description && (
              <p style={{ fontSize: '0.92rem', lineHeight: 1.65 }}>
                {selectedItem.description}
              </p>
            )}
          </div>
        )}
      </AccessibleDialog>
    </div>
  );
}
