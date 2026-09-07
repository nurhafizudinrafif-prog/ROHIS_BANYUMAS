import { useState, useEffect, useCallback, useRef } from 'react';
import { useScrollAnimation } from '../utils';
import {
  Camera,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play,
  Film,
  Maximize2,
  ExternalLink,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  normalizeMediaList,
  isVideoMedia,
  getYouTubeEmbedUrl,
  getGoogleDriveEmbedUrl,
  getDirectImageUrl,
  extractGoogleDriveId,
  getMediaThumbnail,
  getCoverMedia,
  getMediaSummary,
} from '../utils/media';
import './Gallery.css';
import './About.css';
import './Articles.css';

export default function Gallery() {
  useScrollAnimation();
  const { galleryItems, galleryCategories } = useData();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const filmstripRef = useRef(null);

  const filteredItems = activeCategory === 'Semua'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  const activeMediaList = selectedItem ? normalizeMediaList(selectedItem) : [];
  const currentMedia = activeMediaList[activeMediaIndex] || activeMediaList[0];
  const isVideo = currentMedia ? isVideoMedia(currentMedia) : false;
  const ytEmbedUrl = isVideo && currentMedia ? getYouTubeEmbedUrl(currentMedia.url) : null;
  const driveEmbedUrl = isVideo && currentMedia ? getGoogleDriveEmbedUrl(currentMedia.url) : null;
  const directImageUrl = currentMedia ? getDirectImageUrl(currentMedia.url) : '';

  // Open modal handler
  const handleOpenAlbum = (item) => {
    setSelectedItem(item);
    setActiveMediaIndex(0);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setSelectedItem(null);
    setActiveMediaIndex(0);
  };

  // Navigation handlers
  const handlePrevMedia = useCallback(() => {
    if (activeMediaList.length <= 1) return;
    setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : activeMediaList.length - 1));
  }, [activeMediaList.length]);

  const handleNextMedia = useCallback(() => {
    if (activeMediaList.length <= 1) return;
    setActiveMediaIndex((prev) => (prev < activeMediaList.length - 1 ? prev + 1 : 0));
  }, [activeMediaList.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!selectedItem) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      } else if (e.key === 'ArrowLeft') {
        handlePrevMedia();
      } else if (e.key === 'ArrowRight') {
        handleNextMedia();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, handlePrevMedia, handleNextMedia]);

  // Auto scroll active thumbnail into view
  useEffect(() => {
    if (filmstripRef.current) {
      const activeThumb = filmstripRef.current.children[activeMediaIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeMediaIndex]);

  return (
    <main className="page-gallery">
      {/* Hero Header */}
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-primary animate-hero delay-0">Galeri & Dokumentasi</span>
          <h1 className="page-hero-title animate-hero delay-1">Momen Dakwah & Prestasi</h1>
          <p className="page-hero-subtitle animate-hero delay-2">
            Kumpulan dokumentasi foto dan video kegiatan, kajian akbar, baksos, dan pelatihan pengurus ROHIS se-Kabupaten Banyumas.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Category Filter */}
          <div className="articles-filter">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                className={`articles-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="gallery-grid">
            {filteredItems.map((item, i) => {
              const coverUrl = getCoverMedia(item);
              const summary = getMediaSummary(item);
              const hasVideo = summary.videos > 0;

              return (
                <div
                  key={item.id}
                  className={`gallery-item animate-on-scroll delay-${(i % 4) + 1}`}
                  onClick={() => handleOpenAlbum(item)}
                  title="Klik untuk membuka album dokumentasi kegiatan"
                >
                  <div className="gallery-item-image">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={item.title}
                        className="gallery-item-img"
                        loading="lazy"
                      />
                    ) : (
                      <>
                        <span className="gallery-item-emoji">{item.emoji || '📸'}</span>
                        <Camera size={20} className="gallery-item-camera" />
                      </>
                    )}

                    {/* Media Count Badge Floating at Top-Right */}
                    <div className="gallery-card-badge">
                      <span>{summary.label}</span>
                    </div>

                    {/* Subtle Video Indicator Overlay */}
                    {hasVideo && (
                      <div className="gallery-video-indicator" title="Kegiatan ini memiliki video dokumentasi">
                        <Play size={18} fill="currentColor" />
                      </div>
                    )}
                  </div>

                  {/* Card Info Overlay */}
                  <div className="gallery-item-overlay">
                    <div className="gallery-overlay-meta">
                      <span className="badge badge-primary">{item.category}</span>
                      {item.date && (
                        <span className="gallery-overlay-date">{item.date}</span>
                      )}
                    </div>
                    <h4>{item.title}</h4>
                    {item.description && (
                      <p className="gallery-overlay-desc">{item.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              💡 <em>Klik kartu kegiatan di atas untuk membuka album lengkap dan menonton video dokumentasi. Admin dapat menambah dan mengubah foto/video kapan saja melalui Panel Admin.</em>
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* CINEMA LIGHTBOX ALBUM VIEWER (FOTO & VIDEO)          */}
      {/* ==================================================== */}
      {selectedItem && (
        <div
          className="gallery-cinema-backdrop"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="gallery-cinema-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar / Header */}
            <div className="cinema-topbar">
              <div className="cinema-title-group">
                <span className="badge badge-primary">{selectedItem.category}</span>
                <h3 className="cinema-title">{selectedItem.title}</h3>
              </div>

              <div className="cinema-top-actions">
                {activeMediaList.length > 1 && (
                  <span className="cinema-counter-badge">
                    {isVideo ? '🎥 Video' : '📸 Foto'} {activeMediaIndex + 1} dari {activeMediaList.length}
                  </span>
                )}
                {currentMedia?.url && !isVideo && (
                  <a
                    href={currentMedia.url}
                    target="_blank"
                    rel="noreferrer"
                    className="cinema-icon-btn"
                    title="Buka gambar resolusi penuh di tab baru"
                  >
                    <ExternalLink size={17} />
                  </a>
                )}
                <button
                  className="cinema-icon-btn cinema-close-btn"
                  onClick={handleCloseModal}
                  aria-label="Tutup"
                  title="Tutup (Esc)"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Media Stage (Viewing Screen) */}
            <div className="cinema-stage">
              {currentMedia ? (
                <>
                  {isVideo ? (
                    <div className="cinema-video-wrapper">
                      {ytEmbedUrl ? (
                        <iframe
                          src={ytEmbedUrl}
                          title={currentMedia.caption || selectedItem.title}
                          className="cinema-iframe"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : driveEmbedUrl ? (
                        <iframe
                          src={driveEmbedUrl}
                          title={currentMedia.caption || selectedItem.title}
                          className="cinema-iframe"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          controls
                          autoPlay
                          playsInline
                          className="cinema-direct-video"
                          src={currentMedia.url}
                        >
                          Browser Anda tidak mendukung pemutar video HTML5.
                        </video>
                      )}
                    </div>
                  ) : (
                    <div className="cinema-image-wrapper">
                      <img
                        src={directImageUrl}
                        alt={currentMedia.caption || selectedItem.title}
                        className="cinema-main-img"
                        onError={(e) => {
                          const driveId = extractGoogleDriveId(currentMedia.url);
                          if (driveId && !e.currentTarget.dataset.fallback) {
                            e.currentTarget.dataset.fallback = 'true';
                            e.currentTarget.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`;
                          }
                        }}
                      />
                    </div>
                  )}

                  {/* Optional Caption Bar */}
                  {currentMedia.caption && (
                    <div className="cinema-caption-overlay">
                      <p>{currentMedia.caption}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="gallery-modal-placeholder">
                  <span>{selectedItem.emoji || '📸'}</span>
                  <p>Belum ada dokumentasi yang diunggah untuk kegiatan ini.</p>
                </div>
              )}

              {/* Navigation Arrows (Prev / Next) */}
              {activeMediaList.length > 1 && (
                <>
                  <button
                    className="cinema-nav-btn cinema-nav-prev"
                    onClick={handlePrevMedia}
                    aria-label="Foto/Video Sebelumnya"
                    title="Sebelumnya (Panah Kiri)"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    className="cinema-nav-btn cinema-nav-next"
                    onClick={handleNextMedia}
                    aria-label="Foto/Video Selanjutnya"
                    title="Selanjutnya (Panah Kanan)"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
            </div>

            {/* Filmstrip Thumbnail Bar (if multiple media) */}
            {activeMediaList.length > 1 && (
              <div className="cinema-filmstrip-container">
                <div className="cinema-filmstrip" ref={filmstripRef}>
                  {activeMediaList.map((media, idx) => {
                    const thumb = getMediaThumbnail(media);
                    const isVid = isVideoMedia(media);
                    const isActive = idx === activeMediaIndex;

                    return (
                      <button
                        key={media.id || idx}
                        type="button"
                        className={`cinema-thumb-btn ${isActive ? 'active' : ''}`}
                        onClick={() => setActiveMediaIndex(idx)}
                        title={media.caption || `Item ${idx + 1}`}
                      >
                        {thumb ? (
                          <img src={thumb} alt={media.caption || `Thumb ${idx + 1}`} />
                        ) : (
                          <div className="cinema-thumb-fallback">
                            {isVid ? <Film size={18} /> : <Camera size={18} />}
                          </div>
                        )}
                        {isVid && (
                          <span className="cinema-thumb-play">
                            <Play size={10} fill="currentColor" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Album Description / Details */}
            <div className="cinema-bottom-info">
              <div className="cinema-meta-row">
                {selectedItem.date && (
                  <span className="cinema-date">
                    <Calendar size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: -2 }} />
                    {selectedItem.date}
                  </span>
                )}
                <span className="cinema-summary-count">
                  {getMediaSummary(selectedItem).label}
                </span>
              </div>
              {selectedItem.description && (
                <p className="cinema-description">{selectedItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
