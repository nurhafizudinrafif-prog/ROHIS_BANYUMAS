import { useMemo, useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getVideoEmbedUrl } from '@shared/services/mediaHelper';
import {
  Container,
  PageHeader,
  PhotoFrame,
  SmartImage,
  AccessibleDialog,
  EmptyState,
  ROKABA_REAL_PHOTOS,
  formatIndonesianDate,
} from '../components/ui/SoftUI';

export default function Gallery() {
  const { gallery = [], news = [] } = useData();
  const [mediaTab, setMediaTab] = useState('Semua');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Utamakan foto dokumentasi asli ROKABA
  const allMedia = useMemo(() => {
    const items = [];

    // 1. Dokumentasi dari berita kegiatan asli ROKABA
    news.forEach((n, idx) => {
      items.push({
        id: `news-doc-${n.id}`,
        title: n.title,
        category: n.category || 'Kolaborasi',
        date: n.date,
        imageUrl: n.image || ROKABA_REAL_PHOTOS[idx % ROKABA_REAL_PHOTOS.length],
        description: n.excerpt,
        type: 'photo',
      });
    });

    // 2. Dokumentasi dari album galeri
    gallery.forEach((g, idx) => {
      const rawImg = g.imageUrl || g.coverImage || g.image || '';
      const cleanImg =
        !rawImg || rawImg.includes('unsplash.com')
          ? ROKABA_REAL_PHOTOS[idx % ROKABA_REAL_PHOTOS.length]
          : rawImg;

      const videoChild = Array.isArray(g.media)
        ? g.media.find((m) => m.type === 'video' && m.url)
        : null;

      items.push({
        id: `gal-${g.id}`,
        title: g.title,
        category: g.category || 'Kegiatan',
        date: g.date,
        imageUrl: cleanImg,
        videoUrl: g.videoUrl || videoChild?.url || '',
        description: g.description,
        type: g.type === 'video' || Boolean(g.videoUrl || videoChild) ? 'video' : 'photo',
      });
    });

    return items;
  }, [gallery, news]);

  const categories = useMemo(() => {
    const set = new Set(['Semua', 'Kaderisasi', 'Kajian', 'Kolaborasi']);
    allMedia.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set);
  }, [allMedia]);

  const filteredMedia = useMemo(() => {
    return allMedia.filter((item) => {
      const isVideo = item.type === 'video' || Boolean(item.videoUrl);
      if (mediaTab === 'Foto' && isVideo) return false;
      if (mediaTab === 'Video' && !isVideo) return false;

      if (activeCategory === 'Semua') return true;
      const cat = String(item.category || '').toLowerCase();
      const target = activeCategory.toLowerCase();
      if (target === 'kaderisasi') {
        return (
          cat.includes('kaderisasi') ||
          cat.includes('pelatihan') ||
          cat.includes('organisasi')
        );
      }
      if (target === 'kolaborasi') {
        return (
          cat.includes('kolaborasi') ||
          cat.includes('sosial') ||
          cat.includes('lomba') ||
          cat.includes('organisasi')
        );
      }
      return cat === target;
    });
  }, [allMedia, mediaTab, activeCategory]);

  const featuredItems = filteredMedia.slice(0, 3);
  const gridItems = filteredMedia.slice(3);

  const activeItem =
    lightboxIndex !== null && filteredMedia[lightboxIndex]
      ? filteredMedia[lightboxIndex]
      : null;

  const handlePrev = () => {
    if (lightboxIndex === null || filteredMedia.length === 0) return;
    setLightboxIndex((prev) =>
      prev <= 0 ? filteredMedia.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (lightboxIndex === null || filteredMedia.length === 0) return;
    setLightboxIndex((prev) =>
      prev >= filteredMedia.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="rk-page">
      <PageHeader
        breadcrumb={[{ label: 'Beranda', to: '/' }, { label: 'Galeri' }]}
        title="Cerita dalam kebersamaan"
        lead="Dokumentasi kegiatan, latihan kepemimpinan, dan silaturahmi pelajar ROHIS Banyumas."
      />

      <section className="rk-section" aria-label="Galeri foto dan video kegiatan">
        <Container>
          {/* Baris Filter Jenis Media & Kategori */}
          <div className="rk-filter-bar">
            <div className="rk-filter-pills" role="tablist" aria-label="Filter jenis dokumentasi">
              {['Semua', 'Foto', 'Video'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={mediaTab === tab}
                  className="rk-pill"
                  onClick={() => {
                    setMediaTab(tab);
                    setLightboxIndex(null);
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="rk-filter-pills" role="group" aria-label="Filter kategori kegiatan">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className="rk-pill"
                  aria-pressed={activeCategory === cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setLightboxIndex(null);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredMedia.length === 0 ? (
            <EmptyState
              title="Dokumentasi belum ditemukan"
              description="Silakan pilih tab Semua atau kategori lainnya untuk melihat dokumentasi kegiatan."
              action={
                <button
                  type="button"
                  className="rk-btn-secondary"
                  onClick={() => {
                    setMediaTab('Semua');
                    setActiveCategory('Semua');
                  }}
                >
                  Tampilkan semua dokumentasi
                </button>
              }
            />
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Bento Grid Sorotan (1 Besar Kiri + 2 Kanan) */}
              {featuredItems.length > 0 && (
                <div className="rk-gallery-bento">
                  <div>
                    {featuredItems[0] && (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setLightboxIndex(0)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setLightboxIndex(0);
                          }
                        }}
                        style={{ cursor: 'pointer', position: 'relative' }}
                      >
                        <PhotoFrame
                          src={featuredItems[0].imageUrl}
                          alt={featuredItems[0].title}
                          aspect="16/10"
                          captionTitle={featuredItems[0].title}
                          captionSub={`${featuredItems[0].category || 'Kegiatan'} • ${formatIndonesianDate(featuredItems[0].date)}`}
                        />
                        {(featuredItems[0].type === 'video' || featuredItems[0].videoUrl) && (
                          <span
                            className="rk-badge rk-badge--pine"
                            style={{
                              position: 'absolute',
                              top: '20px',
                              right: '20px',
                              gap: '6px',
                            }}
                          >
                            <Play size={13} /> Video
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {featuredItems.length > 1 && (
                    <div className="rk-gallery-bento-side">
                      {featuredItems.slice(1, 3).map((item, idx) => {
                        const realIndex = idx + 1;
                        const isVideo = item.type === 'video' || Boolean(item.videoUrl);
                        return (
                          <div
                            key={item.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setLightboxIndex(realIndex)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setLightboxIndex(realIndex);
                              }
                            }}
                            style={{ cursor: 'pointer', position: 'relative' }}
                          >
                            <PhotoFrame
                              src={item.imageUrl}
                              alt={item.title}
                              aspect="16/9"
                              captionTitle={item.title}
                              captionSub={item.category || 'Dokumentasi'}
                            />
                            {isVideo && (
                              <span
                                className="rk-badge rk-badge--pine"
                                style={{
                                  position: 'absolute',
                                  top: '18px',
                                  right: '18px',
                                  gap: '6px',
                                }}
                              >
                                <Play size={12} /> Video
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Grid Dokumentasi Lainnya */}
              {gridItems.length > 0 && (
                <div className="rk-grid-3">
                  {gridItems.map((item, idx) => {
                    const realIndex = idx + 3;
                    const isVideo = item.type === 'video' || Boolean(item.videoUrl);
                    return (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setLightboxIndex(realIndex)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setLightboxIndex(realIndex);
                          }
                        }}
                        style={{ cursor: 'pointer', position: 'relative' }}
                      >
                        <PhotoFrame
                          src={item.imageUrl}
                          alt={item.title}
                          aspect="4/3"
                          captionTitle={item.title}
                          captionSub={`${item.category || 'Dokumentasi'} • ${formatIndonesianDate(item.date)}`}
                        />
                        {isVideo && (
                          <span
                            className="rk-badge rk-badge--pine"
                            style={{
                              position: 'absolute',
                              top: '18px',
                              right: '18px',
                              gap: '6px',
                            }}
                          >
                            <Play size={12} /> Video
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      <AccessibleDialog
        open={Boolean(activeItem)}
        onClose={() => setLightboxIndex(null)}
        eyebrow={`${activeItem?.category || 'Dokumentasi'} • ${formatIndonesianDate(activeItem?.date)}`}
        title={activeItem?.title || ''}
      >
        {activeItem && (
          <div style={{ display: 'grid', gap: '16px' }}>
            {activeItem.videoUrl && getVideoEmbedUrl(activeItem.videoUrl) ? (
              <div
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  aspectRatio: '16/9',
                  background: '#07140E',
                }}
              >
                <iframe
                  src={getVideoEmbedUrl(activeItem.videoUrl)}
                  title={activeItem.title}
                  style={{ width: '100%', height: '100%', border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid var(--rk-line)',
                  background: 'var(--rk-surface-inset)',
                  aspectRatio: '16/10',
                }}
              >
                <SmartImage
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                />
              </div>
            )}

            {activeItem.description && <p>{activeItem.description}</p>}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <button
                type="button"
                className="rk-btn-secondary"
                onClick={handlePrev}
                aria-label="Dokumentasi sebelumnya"
              >
                <ChevronLeft size={16} /> Sebelumnya
              </button>

              <span style={{ fontSize: '0.84rem', color: 'var(--rk-muted)' }}>
                {lightboxIndex + 1} dari {filteredMedia.length}
              </span>

              <button
                type="button"
                className="rk-btn-secondary"
                onClick={handleNext}
                aria-label="Dokumentasi berikutnya"
              >
                Berikutnya <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </AccessibleDialog>
    </div>
  );
}
