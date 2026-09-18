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
  Sparkles,
  Quote,
  History,
} from 'lucide-react';
import { useScrollAnimation } from '../utils';
import HeroSection from '../components/HeroSection';
import StatsCounter from '../components/StatsCounter';
import SectionHeader from '../components/SectionHeader';
import EventCard from '../components/EventCard';
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

const divisionLogos = {
  SDM: '/divisi-sdm.svg',
  Dakwah: '/divisi-dakwah.svg',
  Jurnalistik: '/divisi-jurnalistik.svg',
  HUMAS: '/divisi-humas.svg',
  DANUS: '/divisi-danus.svg',
};

const timelineMilestones = [
  {
    year: '2017',
    tag: 'AWAL JEJAK',
    title: 'Inisiasi & Silaturahmi Perdana',
    location: 'Purwokerto',
    desc: 'Pertemuan perdana perwakilan pengurus rohis sekolah se-Purwokerto yang melahirkan kesepakatan membentuk wadah silaturahmi terpadu.',
  },
  {
    year: '2020',
    tag: 'KETAHANAN',
    title: 'Ruang Temu di Masa Pandemi',
    location: 'Banyumas',
    desc: 'Menghadapi masa karantina dengan menggelar kajian virtual berkala, mentoring daring, dan aksi kepedulian sosial bagi pelajar terdampak.',
  },
  {
    year: '2022',
    tag: 'REKONSILIASI',
    title: 'Konsolidasi Akbar Pasca-Pandemi',
    location: 'Masjid Agung Baitussalam',
    desc: 'Kebangkitan tatap muka akbar, memperluas jejaring dakwah hingga ke SMA, SMK, dan MA di berbagai kecamatan Kabupaten Banyumas.',
  },
  {
    year: '2024',
    tag: 'KURIKULUM',
    title: 'Standarisasi Modul Kaderisasi',
    location: 'Banyumas',
    desc: 'Penyusunan kurikulum Latihan Kepemimpinan ROHIS (LKRO) terstandar dan mentoring berkala demi mencetak kader yang berkarakter dan kritis.',
  },
  {
    year: '2026',
    tag: 'TRANSFORMASI',
    title: 'Era Kolaborasi & Platform Terpadu',
    location: 'Kabupaten Banyumas',
    desc: 'Peluncuran platform digital terpadu, penguatan jurnalisme literasi, kemandirian kas dakwah, dan jejaring lebih dari 15 sekolah.',
  },
];

export default function Home() {
  useScrollAnimation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeProgramIndex, setActiveProgramIndex] = useState(0);
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

  const activeProgram = programs[activeProgramIndex] || programs[0];

  const upcomingEvents = events.filter((e) => e.status === 'upcoming');
  const featuredEvent = upcomingEvents[0];
  const secondaryEvents = upcomingEvents.slice(1, 3);

  const featuredArticle = articles[0];
  const supportingArticles = articles.slice(1, 4);
  const networkSchools = memberSchools.slice(0, 10);

  const handleOpenAlbum = (item) => {
    setSelectedItem(item);
    setActiveMediaIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setActiveMediaIndex(0);
  };

  // Lock body scroll when modal open
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
    <main className="editorial-homepage">
      {/* =========================================================
          SECTION 1: THE EDITORIAL COVER (Dark Modern Islamic)
          ========================================================= */}
      <HeroSection />

      {/* Snapshot Impact Band */}
      <StatsCounter />

      {/* =========================================================
          SECTION 2: ABOUT EDITORIAL SPREAD
          ========================================================= */}
      <section className="section" data-section="about">
        <div className="container">
          <div className="editorial-about-spread">
            {/* Left: Narrative Column */}
            <div className="about-spread-narrative">
              <span className="badge badge-primary">TENTANG KAMI</span>
              
              <h2 className="about-spread-title">
                Bukan sekadar sebuah organisasi.
              </h2>

              <p className="about-spread-lead">
                Didirikan pada tahun 2017 di Purwokerto, ROHIS Kabupaten Banyumas tumbuh 
                dari tekad bersama para pelajar SMA, SMK, dan MA untuk merajut ukhuwah 
                dan memperkuat dakwah sekolah.
              </p>

              <div className="about-spread-body">
                <p>
                  Kami hadir bukan sekadar menyusun struktur jabatan formal, melainkan 
                  membangun ruang perjumpaan yang hangat—tempat setiap pelajar Muslim 
                  dapat belajar memahami nilai-nilai Islam yang rahmatan lil 'alamin, 
                  mengasah kepemimpinan, dan menyalurkan kepedulian nyata bagi masyarakat.
                </p>
                <p>
                  Dari kajian akbar di masjid-masjid agung hingga pelatihan literasi digital 
                  dan aksi kepedulian sosial di pelosok Banyumas, seluruh langkah kami 
                  digerakkan secara gotong-royong oleh kader pelajar bersama para pembina.
                </p>
              </div>

              <div className="about-spread-points">
                <div className="about-point-item">
                  <span className="point-number">01</span>
                  <div className="point-text">
                    <strong>Sinergi Lintas Sekolah</strong>
                    <span>Mengikis sekat sekolah, menghubungkan puluhan rohis di Kabupaten Banyumas.</span>
                  </div>
                </div>
                <div className="about-point-item">
                  <span className="point-number">02</span>
                  <div className="point-text">
                    <strong>Kaderisasi Berjenjang</strong>
                    <span>Mencetak generasi muda yang kritis, berakhlak mulia, dan siap memimpin.</span>
                  </div>
                </div>
              </div>

              <div className="about-spread-cta">
                <Link to="/tentang" className="btn btn-primary">
                  <span>Kenali Sejarah & Pengurus Kami</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right: Archival Visual & Quote */}
            <div className="about-spread-visual">
              <div className="about-photo-card">
                <div className="about-photo-header">
                  <span>DOKUMENTASI KADERISASI • PURWOKERTO</span>
                  <span>EST. 2017</span>
                </div>
                <div className="about-photo-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80"
                    alt="Kaderisasi Pelajar ROHIS Banyumas"
                    className="about-photo-img"
                    loading="lazy"
                  />
                </div>
                <div className="about-quote-box">
                  <Quote size={24} className="about-quote-icon" />
                  <p className="about-quote-text">
                    "Di sini kami belajar bahwa dakwah terbaik tidak diukur dari megahnya panggung, 
                    melainkan dari keteladanan akhlak dan keikhlasan melayani sesama pelajar."
                  </p>
                  <span className="about-quote-author">
                    — Catatan Lapangan Kader Pelajar, Banyumas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: NUMBERED EDITORIAL INDEX 01-05 (Program Kerja)
          ========================================================= */}
      <section className="section section-alt" id="program" data-section="program">
        <div className="container">
          <SectionHeader
            badge="Fokus Gerakan"
            title="Lima Pilar Program Kerja"
            subtitle="Dikelola secara terpadu melalui lima divisi resmi untuk membentuk generasi Islam yang kokoh secara spiritual, cakap berorganisasi, dan berdampak nyata."
          />

          <div className="editorial-program-layout">
            {/* Left: Interactive Numbered Index List */}
            <div className="program-numbered-index">
              {programs.map((prog, idx) => {
                const isSelected = idx === activeProgramIndex;
                const numStr = String(idx + 1).padStart(2, '0');
                return (
                  <div
                    key={prog.id}
                    className={`program-index-row ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveProgramIndex(idx)}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="index-row-num">{numStr}</span>
                    <div className="index-row-info">
                      <div className="index-row-top">
                        <span className="index-row-title">{prog.title.toUpperCase()}</span>
                        <span className="index-row-division">DIVISI {prog.division}</span>
                      </div>
                      <p className="index-row-summary">{prog.description}</p>
                    </div>
                    <div className="index-row-arrow">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Active Pillar Showcase Card */}
            <div className="program-detail-showcase">
              <div className="showcase-card-inner">
                <div className="showcase-card-header">
                  <div className="showcase-logo-frame">
                    <img
                      src={divisionLogos[activeProgram.division] || '/divisi-sdm.svg'}
                      alt={`Insignia ${activeProgram.division}`}
                      className="showcase-logo-svg"
                    />
                  </div>
                  <div>
                    <span className="showcase-division-tag">DIVISI {activeProgram.division}</span>
                    <h3 className="showcase-division-title">{activeProgram.title}</h3>
                  </div>
                </div>

                <p className="showcase-division-desc">{activeProgram.description}</p>

                <div className="showcase-focus-heading">AGENDA & FOKUS UTAMA:</div>
                <div className="showcase-focus-list">
                  {activeProgram.details.map((detail, dIdx) => (
                    <div key={dIdx} className="showcase-focus-item">
                      <CheckCircle2 size={16} className="text-accent" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="showcase-action-row">
                  <Link to="/program" className="btn btn-primary">
                    <span>Silabus Lengkap Divisi Ini</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4: FEATURED DOCUMENTARY SPOTLIGHT ("Sorotan Kegiatan")
          ========================================================= */}
      <section className="section" data-section="gallery">
        <div className="container">
          <SectionHeader
            badge="Dokumentasi Utama"
            title="Sorotan Kegiatan Terkini"
            subtitle="Potret nyata antusiasme dan khidmat dakwah pelajar Muslim se-Kabupaten Banyumas."
          />

          {galleryItems.length > 0 && (
            <div className="forest-feature-stage">
              <div className="forest-feature-visual">
                <img
                  src={getCoverMedia(galleryItems[0]) || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80'}
                  alt={galleryItems[0].title}
                  className="forest-feature-img"
                  loading="lazy"
                />
                <div className="forest-feature-overlay" />
                <span className="forest-feature-stamp">ARSIP UTAMA BANYUMAS</span>
              </div>

              <div className="forest-feature-content">
                <div className="forest-feature-meta">
                  <span className="meta-forest-item">
                    <Calendar size={15} />
                    <span>{galleryItems[0].date || 'Februari 2025'}</span>
                  </span>
                  <span className="meta-forest-item">
                    <MapPin size={15} />
                    <span>Purwokerto</span>
                  </span>
                </div>

                <h3 className="forest-feature-headline">{galleryItems[0].title}</h3>
                <p className="forest-feature-desc">{galleryItems[0].description}</p>

                <div className="forest-feature-actions">
                  <button
                    onClick={() => handleOpenAlbum(galleryItems[0])}
                    className="btn btn-primary"
                  >
                    <Camera size={17} />
                    <span>Buka Dokumentasi Foto & Video</span>
                  </button>
                  <Link to="/galeri" className="btn btn-outline">
                    <span>Lihat Seluruh Arsip</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Prestigious Metric Ribbon */}
          <div className="forest-metric-ribbon">
            <div className="metric-cell">
              <span className="metric-val">15+</span>
              <span className="metric-lbl">SMA / SMK / MA</span>
            </div>
            <div className="metric-sep" />
            <div className="metric-cell">
              <span className="metric-val">53+</span>
              <span className="metric-lbl">Kader Aktif</span>
            </div>
            <div className="metric-sep" />
            <div className="metric-cell">
              <span className="metric-val">8 Thn</span>
              <span className="metric-lbl">Khidmat Dakwah</span>
            </div>
            <div className="metric-sep" />
            <div className="metric-cell">
              <span className="metric-val">5 Divisi</span>
              <span className="metric-lbl">Pilar Gerakan</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5: COMMUNITY ARCHIVE WALL / CONTACT SHEET
          ========================================================= */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeader
            badge="Arsip Komunitas"
            title="Lembar Memori & Dokumentasi"
            subtitle="Setiap jejak kebersamaan didokumentasikan sebagai bagian dari sejarah dakwah pemuda Islam Banyumas."
          />

          <div className="archive-contact-sheet">
            {galleryItems.slice(0, 6).map((item, idx) => {
              const coverUrl = getCoverMedia(item);
              const summary = getMediaSummary(item);
              const hasVideo = summary.videos > 0;
              const refNum = `ARCHIVE #${String(idx + 14).padStart(3, '0')}`;

              return (
                <div
                  key={item.id}
                  className="contact-sheet-card"
                  onClick={() => handleOpenAlbum(item)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="contact-sheet-topbar">
                    <span className="sheet-ref-code">{refNum}</span>
                    <span className="sheet-cat-badge">{item.category}</span>
                  </div>

                  <div className="contact-sheet-photo">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={item.title}
                        className="contact-sheet-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="contact-sheet-placeholder">
                        <Camera size={24} />
                      </div>
                    )}
                    {hasVideo && (
                      <div className="sheet-video-pill">
                        <Play size={14} fill="currentColor" />
                        <span>VIDEO</span>
                      </div>
                    )}
                  </div>

                  <div className="contact-sheet-footer">
                    <h4 className="sheet-photo-title">{item.title}</h4>
                    <div className="sheet-photo-meta">
                      <span className="sheet-photo-date">{item.date || 'Purwokerto'}</span>
                      <span className="sheet-photo-count">{summary.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center" style={{ marginTop: 'var(--space-3xl)' }}>
            <Link to="/galeri" className="btn btn-outline btn-lg">
              <span>Jelajahi Galeri Dokumentasi Lengkap</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 6: QUIET TIMELINE: "PERJALANAN KAMI"
          ========================================================= */}
      <section className="section">
        <div className="container">
          <SectionHeader
            badge="Historia Gerakan"
            title="Perjalanan Kami"
            subtitle="Merawat benih dakwah sejak pertemuan pertama di Purwokerto hingga jejaring sekolah se-Kabupaten Banyumas."
          />

          <div className="quiet-timeline-track">
            {timelineMilestones.map((m, idx) => (
              <div key={idx} className="timeline-node">
                <div className="timeline-node-header">
                  <span className="timeline-year">{m.year}</span>
                  <span className="timeline-tag">{m.tag}</span>
                </div>
                <div className="timeline-dot-axis">
                  <div className="timeline-axis-dot" />
                  <div className="timeline-axis-line" />
                </div>
                <div className="timeline-node-card">
                  <div className="timeline-node-loc">
                    <MapPin size={13} />
                    <span>{m.location}</span>
                  </div>
                  <h4 className="timeline-node-title">{m.title}</h4>
                  <p className="timeline-node-desc">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 7: AGENDA & ARTICLES EDITORIAL GRID
          ========================================================= */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeader
            badge="Agenda & Bacaan"
            title="Agenda & Bacaan Inspiratif"
            subtitle="Ikuti jadwal kajian terdekat dan perkaya wawasan keislaman melalui tulisan pemuda Banyumas."
          />

          <div className="agenda-articles-editorial-grid">
            {/* Left: Featured Event */}
            <div className="editorial-agenda-col">
              <h3 className="col-subheading">Agenda Terdekat</h3>
              {featuredEvent ? (
                <div className="editorial-event-card">
                  <div className="event-date-stamp">
                    <span className="stamp-day">{new Date(featuredEvent.date).getDate() || '13'}</span>
                    <span className="stamp-month">
                      {new Date(featuredEvent.date).toLocaleString('id-ID', { month: 'short' }).toUpperCase() || 'SEP'}
                    </span>
                  </div>
                  <div className="event-details-block">
                    <span className="badge badge-primary">{featuredEvent.type}</span>
                    <h4 className="event-title-text">{featuredEvent.title}</h4>
                    <div className="event-loc-time">
                      <span><MapPin size={14} /> {featuredEvent.location}</span>
                      {featuredEvent.time && <span><Clock size={14} /> {featuredEvent.time}</span>}
                    </div>
                    <p className="event-excerpt-text">{featuredEvent.description}</p>
                    <Link to="/program#agenda" className="btn btn-primary btn-sm">
                      <span>Ikuti Agenda</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-muted">Tidak ada agenda terdekat saat ini.</p>
              )}
            </div>

            {/* Right: Featured Article */}
            <div className="editorial-articles-col">
              <h3 className="col-subheading">Bacaan Pilihan</h3>
              {featuredArticle ? (
                <div className="editorial-article-card">
                  <div className="article-photo-box">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="article-photo-thumb"
                    />
                  </div>
                  <div className="article-body-box">
                    <span className="badge badge-primary">{featuredArticle.category}</span>
                    <h4 className="article-title-text">{featuredArticle.title}</h4>
                    <p className="article-excerpt-text">{featuredArticle.excerpt}</p>
                    <Link to={`/artikel/${featuredArticle.slug}`} className="article-read-link">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Official Feed */}
      <InstagramSection />

      {/* Network of Schools */}
      <section className="section">
        <div className="container text-center">
          <span className="badge badge-primary" style={{ marginBottom: 'var(--space-md)' }}>
            JEJARING RESMI
          </span>
          <h2 style={{ marginBottom: 'var(--space-md)', color: 'var(--color-forest)' }}>Bergerak Bersama Sekolah Anggota</h2>
          <p style={{ maxWidth: '640px', margin: '0 auto var(--space-3xl)', color: 'var(--color-text-secondary)' }}>
            Menjalin ukhuwah dan kerja sama dakwah pelajar lintas SMA, SMK, dan MA se-Kabupaten Banyumas.
          </p>
          <div className="network-pill-cloud">
            {networkSchools.map((sch) => (
              <div key={sch.id} className="network-school-pill">
                <School size={16} className="text-gold" />
                <span>{sch.name}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/rohis-anggota" className="btn btn-outline">
              <span>Lihat Seluruh Sekolah Anggota & Struktur BPH</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 8: CLOSING INVITATION / CTA
          ========================================================= */}
      <section className="section" data-section="contact">
        <div className="container">
          <div className="editorial-closing-card">
            <span className="badge badge-primary">MARI BERGABUNG</span>
            <h2 className="closing-headline">Mari Tumbuh Bersama.</h2>
            <p className="closing-lead">
              Pintu selalu terbuka bagi pelajar yang ingin belajar, mengasah kepemimpinan, 
              dan bersama-sama menghidupkan dakwah Islam rahmatan lil 'alamin di Kabupaten Banyumas.
            </p>
            <div className="closing-actions">
              <Link to="/pendaftaran" className="btn btn-primary btn-lg">
                <span>Daftar Menjadi Bagian ROKABA</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/kontak" className="btn btn-outline btn-lg">
                <span>Hubungi Pengurus</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cinema Lightbox Modal for Photo and Video Playback */}
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
                    href={directImageUrl || currentMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cinema-action-btn"
                    title="Buka foto ukuran asli di tab baru"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
                <button
                  className="cinema-close-btn"
                  onClick={handleCloseModal}
                  aria-label="Tutup penampil media"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Cinema Stage */}
            <div className="cinema-stage">
              {activeMediaList.length > 1 && (
                <button
                  className="cinema-nav-arrow left"
                  onClick={handlePrevMedia}
                  aria-label="Media sebelumnya"
                >
                  <ChevronLeft size={28} />
                </button>
              )}

              <div className="cinema-viewport">
                {isVideo ? (
                  <div className="cinema-video-container">
                    {ytEmbedUrl ? (
                      <iframe
                        src={ytEmbedUrl}
                        title={selectedItem.title}
                        className="cinema-iframe"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : driveEmbedUrl ? (
                      <iframe
                        src={driveEmbedUrl}
                        title={selectedItem.title}
                        className="cinema-iframe"
                        allow="autoplay"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={currentMedia.url}
                        controls
                        autoPlay
                        className="cinema-native-video"
                      />
                    )}
                  </div>
                ) : (
                  <div className="cinema-image-container">
                    <img
                      src={directImageUrl || currentMedia.url}
                      alt={currentMedia.caption || selectedItem.title}
                      className="cinema-main-img"
                    />
                  </div>
                )}
              </div>

              {activeMediaList.length > 1 && (
                <button
                  className="cinema-nav-arrow right"
                  onClick={handleNextMedia}
                  aria-label="Media selanjutnya"
                >
                  <ChevronRight size={28} />
                </button>
              )}
            </div>

            {/* Footer / Caption & Filmstrip */}
            <div className="cinema-footer">
              <div className="cinema-caption-row">
                <p className="cinema-caption-text">
                  {currentMedia?.caption || selectedItem.description || selectedItem.title}
                </p>
                {selectedItem.date && (
                  <span className="cinema-date-tag">
                    <Calendar size={13} />
                    <span>{selectedItem.date}</span>
                  </span>
                )}
              </div>

              {activeMediaList.length > 1 && (
                <div className="cinema-filmstrip" ref={filmstripRef}>
                  {activeMediaList.map((media, idx) => {
                    const thumbUrl = getMediaThumbnail(media);
                    const isMediaVid = isVideoMedia(media);
                    return (
                      <button
                        key={idx}
                        className={`filmstrip-thumb ${idx === activeMediaIndex ? 'active' : ''}`}
                        onClick={() => setActiveMediaIndex(idx)}
                      >
                        {thumbUrl ? (
                          <img src={thumbUrl} alt="" className="thumb-img" />
                        ) : (
                          <div className="thumb-placeholder">
                            {isMediaVid ? <Film size={18} /> : <Camera size={18} />}
                          </div>
                        )}
                        {isMediaVid && (
                          <div className="thumb-vid-icon">
                            <Play size={12} fill="currentColor" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
