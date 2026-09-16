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
  MapPin,
  Clock,
  UserCheck,
  BookOpen,
  Newspaper,
  Megaphone,
  Wallet,
  CheckCircle2,
  School,
} from 'lucide-react';
import { useScrollAnimation } from '../utils';
import HeroSection from '../components/HeroSection';
import StatsCounter from '../components/StatsCounter';
import SectionHeader from '../components/SectionHeader';
import EventCard from '../components/EventCard';
import QuoteSection from '../components/QuoteSection';
import InstagramSection from '../components/InstagramSection';
import AchievementsSection from '../components/AchievementsSection';
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

const divisionIcons = {
  SDM: UserCheck,
  Dakwah: BookOpen,
  Jurnalistik: Newspaper,
  HUMAS: Megaphone,
  DANUS: Wallet,
};

export default function Home() {
  useScrollAnimation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [featuredPillarIndex, setFeaturedPillarIndex] = useState(0);
  const filmstripRef = useRef(null);

  const {
    articles,
    events,
    memberSchools,
    galleryItems,
  } = useData();

  const activeMediaList = selectedItem ? normalizeMediaList(selectedItem) : [];
  const currentMedia = activeMediaList[activeMediaIndex] || activeMediaList[0];
  const isVideo = currentMedia ? isVideoMedia(currentMedia) : false;
  const ytEmbedUrl = isVideo && currentMedia ? getYouTubeEmbedUrl(currentMedia.url) : null;
  const driveEmbedUrl = isVideo && currentMedia ? getGoogleDriveEmbedUrl(currentMedia.url) : null;
  const directImageUrl = currentMedia ? getDirectImageUrl(currentMedia.url) : '';

  const activePillar = programs[featuredPillarIndex] || programs[0];
  const ActivePillarIcon = divisionIcons[activePillar.division] || UserCheck;

  const upcomingEvents = events.filter((e) => e.status === 'upcoming');
  const featuredEvent = upcomingEvents[0];
  const secondaryEvents = upcomingEvents.slice(1, 3);

  const featuredArticle = articles[0];
  const supportingArticles = articles.slice(1, 4);
  const networkSchools = memberSchools.slice(0, 8);

  const handleOpenAlbum = (item) => {
    setSelectedItem(item);
    setActiveMediaIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setActiveMediaIndex(0);
  };

  // Lock background body scroll when lightbox is open
  useEffect(() => {
    if (selectedItem) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [selectedItem]);

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
      {/* 02: Hero Section (55/45 Editorial Split) */}
      <HeroSection />

      {/* 03: Organization Snapshot / Impact Data Band */}
      <StatsCounter />

      {/* 04: Editorial About ROHIS Banyumas */}
      <section className="section" data-section="about">
        <div className="container">
          <div className="home-about-grid">
            <div className="home-about-content">
              <span className="badge badge-primary" style={{ marginBottom: 'var(--space-md)' }}>
                Tentang ROHIS Banyumas
              </span>
              <h2>Wadah Sinergi & Pembinaan Generasi Qur'ani Banyumas</h2>
              <p>
                Didirikan pada tahun 2017, ROHIS Kabupaten Banyumas menaungi puluhan kader dakwah sekolah 
                lintas SMA, SMK, dan MA. Kami hadir untuk menumbuhkan nilai-nilai keislaman yang rahmatan lil 'alamin 
                dan melahirkan karya nyata bagi pelajar serta masyarakat.
              </p>
              <p>
                Melalui 5 pilar divisi utama, kami menyelenggarakan kajian berkala, kaderisasi kepemimpinan, 
                jurnalisme kreatif, bakti sosial, serta pengembangan kemandirian wirausaha generasi muda Islam.
              </p>
              <div style={{ marginTop: 'var(--space-lg)' }}>
                <Link to="/tentang" className="btn btn-outline">
                  <span>Kenali Sejarah & Visi Kami</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="home-about-visual">
              <div className="home-about-frame">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80"
                  alt="Kaderisasi ROHIS Kabupaten Banyumas"
                  className="home-about-img"
                  loading="lazy"
                />
              </div>
              <div className="home-about-badge-card">
                <div className="home-about-stat-item">
                  <span className="home-about-stat-num">2017</span>
                  <span className="home-about-stat-label">Tahun Berdiri</span>
                </div>
                <div style={{ width: '1px', height: '32px', background: 'rgba(13, 59, 46, 0.12)' }} />
                <div className="home-about-stat-item">
                  <span className="home-about-stat-num">15+</span>
                  <span className="home-about-stat-label">Sekolah Anggota</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05: Five Pillars / Program (1 Featured + 4 Supporting) */}
      <section className="section section-alt" id="program" data-section="program">
        <div className="container">
          <SectionHeader
            badge="Program Kerja"
            title="Lima Pilar Gerakan Kami"
            subtitle="Digerakkan secara terpadu melalui 5 divisi utama untuk membentuk generasi Islam yang berdaya, berakhlak, dan berdampak."
          />

          <div className="five-pillars-editorial">
            {/* Left: Featured Pillar Card */}
            <div className="pillar-featured-card">
              <div>
                <div className="pillar-featured-header">
                  <div className="pillar-featured-icon">
                    <ActivePillarIcon size={28} />
                  </div>
                  <div className="pillar-featured-meta">
                    <span className="pillar-featured-badge">Pilar Utama • Divisi {activePillar.division}</span>
                    <h3 className="pillar-featured-title">{activePillar.title}</h3>
                  </div>
                </div>

                <p className="pillar-featured-desc">{activePillar.description}</p>

                <div className="pillar-details-title">Fokus Program Kerja:</div>
                <div className="pillar-details-list">
                  {activePillar.details.map((detail, idx) => (
                    <div key={idx} className="pillar-detail-item">
                      <CheckCircle2 size={16} className="pillar-detail-icon" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link to="/program" className="btn btn-primary">
                  <span>Lihat Silabus Lengkap Divisi Ini</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right: 4 Supporting Pillars */}
            <div className="pillar-supporting-list">
              {programs.map((program, idx) => {
                const ItemIcon = divisionIcons[program.division] || UserCheck;
                const isSelected = idx === featuredPillarIndex;
                return (
                  <div
                    key={program.id}
                    className={`pillar-supporting-item ${isSelected ? 'active' : ''}`}
                    onClick={() => setFeaturedPillarIndex(idx)}
                    role="button"
                    tabIndex={0}
                    title="Klik untuk melihat detail divisi ini"
                  >
                    <div className="pillar-supporting-icon">
                      <ItemIcon size={20} />
                    </div>
                    <div className="pillar-supporting-info">
                      <span className="pillar-supporting-division">Divisi {program.division}</span>
                      <h4 className="pillar-supporting-title">{program.title}</h4>
                      <p className="pillar-supporting-desc">{program.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/program" className="btn btn-outline">
              Lihat Agenda & Semua Program <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 06: Featured Activity (60/40 Story) */}
      {galleryItems.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeader
              badge="Dokumentasi Pilihan"
              title="Sorotan Kegiatan Terbaru"
              subtitle="Potret nyata antusiasme dan komitmen dakwah pelajar Muslim Kabupaten Banyumas."
            />

            <div className="activity-story-card">
              <div className="activity-story-media">
                <img
                  src={getCoverMedia(galleryItems[0]) || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80'}
                  alt={galleryItems[0].title}
                  className="activity-story-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <span className="activity-story-overlay-tag">Kegiatan Utama</span>
              </div>

              <div className="activity-story-content">
                <div className="activity-story-meta">
                  <span className="activity-story-meta-item">
                    <Calendar size={15} />
                    <span>{galleryItems[0].date || 'Februari 2025'}</span>
                  </span>
                  <span className="activity-story-meta-item">
                    <MapPin size={15} />
                    <span>Purwokerto</span>
                  </span>
                </div>

                <h3 className="activity-story-title">{galleryItems[0].title}</h3>
                <p className="activity-story-desc">{galleryItems[0].description}</p>

                <button
                  onClick={() => handleOpenAlbum(galleryItems[0])}
                  className="btn btn-primary"
                >
                  <Camera size={17} />
                  <span>Buka Dokumentasi Foto & Video</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quote Section */}
      <QuoteSection />

      {/* 07: Upcoming Events Spotlight */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeader
            badge="Agenda"
            title="Kegiatan Mendatang"
            subtitle="Jadwal kajian akbar, pelatihan kepemimpinan, dan aksi sosial pelajar Banyumas."
          />

          <div className="events-spotlight-layout">
            {/* Main Featured Upcoming Event */}
            {featuredEvent && (
              <div className="event-featured-card">
                <div className="event-date-block">
                  <span className="event-date-day">
                    {new Date(featuredEvent.date).getDate() || '13'}
                  </span>
                  <span className="event-date-month">
                    {new Date(featuredEvent.date).toLocaleString('id-ID', { month: 'short' }).toUpperCase() || 'SEP'}
                  </span>
                </div>

                <div className="event-featured-info">
                  <div className="event-featured-meta">
                    <span className="event-badge-type">{featuredEvent.type}</span>
                    <span className="event-location-text">
                      <MapPin size={14} />
                      {featuredEvent.location}
                    </span>
                    {featuredEvent.time && (
                      <span className="event-location-text">
                        <Clock size={14} />
                        {featuredEvent.time}
                      </span>
                    )}
                  </div>
                  <h4 className="event-featured-title">{featuredEvent.title}</h4>
                  <p className="event-featured-desc">{featuredEvent.description}</p>
                </div>

                <div>
                  <Link to="/program#agenda" className="btn btn-primary">
                    <span>Ikuti Agenda</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}

            {/* Secondary Events Grid */}
            {secondaryEvents.length > 0 && (
              <div className="events-secondary-grid">
                {secondaryEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            )}
          </div>

          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/program#agenda" className="btn btn-outline">
              Lihat Kalender Agenda Lengkap <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 08: Latest Stories (Editorial Magazine) */}
      <section className="section" data-section="article">
        <div className="container">
          <SectionHeader
            badge="Artikel Dakwah"
            title="Bacaan Inspiratif Terkini"
            subtitle="Kumpulan tulisan, kajian tematik, dan refleksi pemuda Muslim untuk memperluas cakrawala keislaman."
          />

          <div className="home-articles-magazine">
            {/* Left: Featured Major Story */}
            {featuredArticle && (
              <div className="article-featured-card">
                <div className="article-featured-media">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="article-featured-img"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                </div>
                <div className="article-featured-body">
                  <div className="article-meta-row">
                    <span className="badge badge-primary">{featuredArticle.category}</span>
                    <span>{featuredArticle.date}</span>
                    <span>• {featuredArticle.author}</span>
                  </div>
                  <h3 className="article-featured-title">{featuredArticle.title}</h3>
                  <p className="article-featured-desc">{featuredArticle.excerpt}</p>
                  <Link to={`/artikel/${featuredArticle.slug}`} className="article-read-btn">
                    <span>Baca Artikel Selengkapnya</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}

            {/* Right: 3 Supporting Stories */}
            <div className="articles-supporting-list">
              {supportingArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/artikel/${article.slug}`}
                  className="article-supporting-item"
                >
                  <div className="article-supporting-thumb">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="article-supporting-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>
                  <div className="article-supporting-content">
                    <span className="article-supporting-category">{article.category}</span>
                    <h4 className="article-supporting-title">{article.title}</h4>
                    <span className="article-supporting-date">{article.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/artikel" className="btn btn-outline">
              Jelajahi Seluruh Artikel <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 09: Achievements / Rekam Jejak */}
      <AchievementsSection limit={4} showFilters={true} />

      {/* 10: Gallery Section */}
      <section className="section section-alt" data-section="gallery">
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

      {/* 11: Network ("Bergerak Bersama") */}
      <section className="section" data-section="members">
        <div className="container">
          <SectionHeader
            badge="Sinergi Lintas Lembaga"
            title="Bergerak Bersama Sekolah & Mitra"
            subtitle={`Membangun jejaring dakwah pelajar yang kokoh bersama lebih dari 15 sekolah tingkat SMA, SMK, dan MA se-Kabupaten Banyumas.`}
          />
          <div className="network-grid">
            {networkSchools.map((school) => (
              <div key={school.id} className="network-school-card">
                <div className="network-school-icon">
                  <School size={20} />
                </div>
                <div>
                  <h4 className="network-school-name">{school.name}</h4>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>
                    {school.type || 'Sekolah Anggota'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/rohis-anggota" className="btn btn-outline">
              Lihat Struktur BPH, Divisi & ROHIS Anggota <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 12: Final CTA Section */}
      <section className="section home-cta-section pattern-bg" data-section="contact">
        <div className="container text-center">
          <div className="home-cta animate-on-scroll">
            <h2>Siap Bergabung Bersama Kami?</h2>
            <p>
              Jadilah bagian dari gerakan dakwah pemuda Islam terbesar di Kabupaten Banyumas.
              Bersama, kita wujudkan generasi yang berilmu, berakhlak, dan berdampak.
            </p>
            <div className="home-cta-actions">
              <Link to="/pendaftaran" className="btn btn-primary btn-lg">
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
