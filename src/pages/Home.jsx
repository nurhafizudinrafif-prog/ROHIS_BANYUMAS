import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Camera,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play,
  Film,
  ExternalLink,
} from 'lucide-react';
import { useScrollAnimation } from '../utils';
import HeroSection from '../components/HeroSection';
import StatsCounter from '../components/StatsCounter';
import SectionHeader from '../components/SectionHeader';
import ProgramCard from '../components/ProgramCard';
import ArticleCard from '../components/ArticleCard';
import EventCard from '../components/EventCard';
import MemberSchoolCard from '../components/MemberSchoolCard';
import QuoteSection from '../components/QuoteSection';
import InstagramSection from '../components/InstagramSection';
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
import { programs } from '../data/programs';
import './Home.css';
import './Gallery.css';

export default function Home() {
  useScrollAnimation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const filmstripRef = useRef(null);

  const {
    articles,
    events,
    memberSchools,
    galleryItems,
    team,
    structurePeriod,
    organizationFullName,
  } = useData();

  const activeMediaList = selectedItem ? normalizeMediaList(selectedItem) : [];
  const currentMedia = activeMediaList[activeMediaIndex] || activeMediaList[0];
  const isVideo = currentMedia ? isVideoMedia(currentMedia) : false;
  const ytEmbedUrl = isVideo && currentMedia ? getYouTubeEmbedUrl(currentMedia.url) : null;
  const driveEmbedUrl = isVideo && currentMedia ? getGoogleDriveEmbedUrl(currentMedia.url) : null;
  const directImageUrl = currentMedia ? getDirectImageUrl(currentMedia.url) : '';

  const handleOpenAlbum = (item) => {
    setSelectedItem(item);
    setActiveMediaIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setActiveMediaIndex(0);
  };

  const handlePrevMedia = useCallback(() => {
    if (activeMediaList.length <= 1) return;
    setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : activeMediaList.length - 1));
  }, [activeMediaList.length]);

  const handleNextMedia = useCallback(() => {
    if (activeMediaList.length <= 1) return;
    setActiveMediaIndex((prev) => (prev < activeMediaList.length - 1 ? prev + 1 : 0));
  }, [activeMediaList.length]);

  useEffect(() => {
    if (!selectedItem) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCloseModal();
      else if (e.key === 'ArrowLeft') handlePrevMedia();
      else if (e.key === 'ArrowRight') handleNextMedia();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, handlePrevMedia, handleNextMedia]);

  useEffect(() => {
    if (filmstripRef.current) {
      const activeThumb = filmstripRef.current.children[activeMediaIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeMediaIndex]);

  return (
    <main>
      <HeroSection />
      <StatsCounter />

      {/* Programs Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            badge="Program Kerja"
            title="Lima Pilar Gerakan Kami"
            subtitle="Digerakkan melalui 5 divisi utama: SDM, Dakwah, Jurnalistik, HUMAS, dan DANUS untuk membentuk generasi Islam yang berdaya dan berdampak."
          />
          <div className="home-programs-grid">
            {programs.map((program, i) => (
              <ProgramCard key={program.id} program={program} index={i} />
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/program" className="btn btn-outline">
              Lihat Semua Program <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <QuoteSection />

      {/* Upcoming Events */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeader
            badge="Agenda"
            title="Kegiatan Mendatang"
            subtitle="Jadwal kajian, pelatihan, dan kegiatan sosial yang akan datang. Catat tanggalnya!"
          />
          <div className="home-events-list">
            {events
              .filter((e) => e.status === 'upcoming')
              .slice(0, 3)
              .map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/agenda" className="btn btn-outline">
              Lihat Semua Agenda <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="section">
        <div className="container">
          <SectionHeader
            badge="Artikel Dakwah"
            title="Bacaan Terbaru"
            subtitle="Artikel, kajian, dan tulisan inspiratif untuk meningkatkan keilmuan dan keimanan."
          />
          <div className="grid grid-3">
            {articles.slice(0, 3).map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/artikel" className="btn btn-outline">
              Lihat Semua Artikel <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeader
            badge="Dokumentasi"
            title="Galeri Kegiatan"
            subtitle="Potret semangat kebersamaan dan aksi nyata kegiatan dakwah pelajar ROHIS se-Kabupaten Banyumas."
          />
          <div className="gallery-grid">
            {galleryItems.slice(0, 6).map((item, i) => {
              const coverUrl = getCoverMedia(item);
              const summary = getMediaSummary(item);
              const hasVideo = summary.videos > 0;

              return (
                <div
                  key={item.id}
                  className={`gallery-item card animate-on-scroll delay-${(i % 3) + 1}`}
                  onClick={() => handleOpenAlbum(item)}
                  title="Klik untuk melihat album dokumentasi kegiatan"
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

                    <div className="gallery-card-badge">
                      <span>{summary.label}</span>
                    </div>

                    {hasVideo && (
                      <div className="gallery-video-indicator" title="Kegiatan ini memiliki video dokumentasi">
                        <Play size={18} fill="currentColor" />
                      </div>
                    )}
                  </div>
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
            <Link to="/galeri" className="btn-gallery-cta">
              Lihat Semua Galeri <ChevronRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Official Instagram Showcase */}
      <InstagramSection />

      {/* Member Schools */}
      <section className="section">
        <div className="container">
          <SectionHeader
            badge="Jaringan & Struktur"
            title="ROHIS Anggota & Kepengurusan"
            subtitle={`Lebih dari 15 sekolah di Kabupaten Banyumas serta jajaran BPH dan 5 divisi gerakan ${structurePeriod}.`}
          />
          <div className="grid grid-4">
            {memberSchools.slice(0, 4).map((school, i) => (
              <MemberSchoolCard key={school.id} school={school} index={i} />
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/rohis-anggota" className="btn btn-outline">
              Lihat Struktur Lengkap BPH, Divisi & ROHIS Sekolah <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section home-cta-section pattern-bg">
        <div className="container text-center">
          <div className="home-cta animate-on-scroll">
            <h2>Siap Bergabung Bersama Kami?</h2>
            <p>
              Jadilah bagian dari gerakan dakwah pemuda Islam terbesar di Kabupaten Banyumas.
              Bersama, kita wujudkan generasi yang berilmu, berakhlak, dan berdampak.
            </p>
            <div className="home-cta-actions">
              <Link to="/pendaftaran" className="btn btn-gold btn-lg">
                Daftar Sekarang
              </Link>
              <Link to="/kontak" className="btn btn-outline btn-lg">
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cinema Lightbox Modal */}
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
            {/* Top Bar */}
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
                    title="Buka gambar penuh"
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

            {/* Media Stage */}
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
                          Browser Anda tidak mendukung video HTML5.
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

                  {currentMedia.caption && (
                    <div className="cinema-caption-overlay">
                      <p>{currentMedia.caption}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="gallery-modal-placeholder">
                  <span>{selectedItem.emoji || '📸'}</span>
                  <p>Belum ada dokumentasi untuk kegiatan ini.</p>
                </div>
              )}

              {/* Navigation Arrows */}
              {activeMediaList.length > 1 && (
                <>
                  <button
                    className="cinema-nav-btn cinema-nav-prev"
                    onClick={handlePrevMedia}
                    aria-label="Sebelumnya"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    className="cinema-nav-btn cinema-nav-next"
                    onClick={handleNextMedia}
                    aria-label="Selanjutnya"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
            </div>

            {/* Filmstrip */}
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

            {/* Bottom Details */}
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
