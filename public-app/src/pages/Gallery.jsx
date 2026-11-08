import { useState } from 'react';
import { Play } from 'lucide-react';
import {
  AccessibleDialog,
  Container,
  PhotoFrame,
  ROKABA_REAL_PHOTOS,
} from '../components/ui/SoftUI';

const GALLERY_ITEMS = [
  {
    id: 'foto-utama',
    type: 'Foto',
    title: 'Dokumentasi kegiatan',
    subtitle: 'Kebersamaan kader ROHIS Kabupaten Banyumas',
    src: ROKABA_REAL_PHOTOS[0],
  },
  {
    id: 'foto-kedua',
    type: 'Foto',
    title: 'Dokumentasi kegiatan',
    subtitle: 'Silaturahmi lintas SMA, SMK, dan MA se-Banyumas',
    src: ROKABA_REAL_PHOTOS[0],
  },
  {
    id: 'video-dok',
    type: 'Video',
    title: 'Dokumentasi kegiatan',
    subtitle: 'Rekaman kegiatan & kebersamaan kader ROKABA',
    src: ROKABA_REAL_PHOTOS[0],
    isVideo: true,
  },
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('Foto');
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="rk-page">
      {/* 1. HEADER */}
      <section className="rk-page-header">
        <Container>
          <div className="rk-eyebrow" style={{ marginBottom: '8px' }}>
            <span className="rk-eyebrow-bar" aria-hidden="true" />
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
              {['Foto', 'Video'].map((tab) => (
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

          <div className="rk-gallery-bento">
            {/* Left Large Framed Photo */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSelectedItem(GALLERY_ITEMS[0])}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedItem(GALLERY_ITEMS[0]);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <PhotoFrame
                src={GALLERY_ITEMS[0].src}
                alt="Dokumentasi kegiatan kader ROHIS Kabupaten Banyumas"
                aspect="16/11.6"
                captionTitle="Dokumentasi kegiatan"
                eager
              />
            </div>

            {/* Right Stacked 2 Framed Photos */}
            <div className="rk-gallery-bento-side">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedItem(GALLERY_ITEMS[1])}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedItem(GALLERY_ITEMS[1]);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <PhotoFrame
                  src={GALLERY_ITEMS[1].src}
                  alt="Dokumentasi kegiatan pengurus ROKABA"
                  aspect="16/8.6"
                  captionTitle="Dokumentasi kegiatan"
                />
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedItem(GALLERY_ITEMS[2])}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedItem(GALLERY_ITEMS[2]);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <PhotoFrame
                  src={GALLERY_ITEMS[2].src}
                  alt="Video dokumentasi kegiatan ROKABA"
                  aspect="16/8.6"
                  captionTitle="Dokumentasi kegiatan"
                >
                  <span className="rk-glass-play" aria-hidden="true">
                    <Play size={16} fill="currentColor" />
                  </span>
                </PhotoFrame>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <AccessibleDialog
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        eyebrow={selectedItem?.type || 'Galeri ROKABA'}
        title={selectedItem?.title || 'Dokumentasi kegiatan'}
      >
        {selectedItem && (
          <div style={{ display: 'grid', gap: '12px' }}>
            <PhotoFrame
              src={selectedItem.src}
              alt={selectedItem.subtitle}
              aspect="16/10"
              captionTitle={selectedItem.title}
              captionSub={selectedItem.subtitle}
            />
          </div>
        )}
      </AccessibleDialog>
    </div>
  );
}
