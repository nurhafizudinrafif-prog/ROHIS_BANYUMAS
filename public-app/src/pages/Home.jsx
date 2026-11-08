import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Container,
  SoftCard,
  PhotoFrame,
  SmartImage,
  EmptyState,
  ROKABA_REAL_PHOTOS,
  normalizeTeamData,
  getJakartaToday,
  isEventUpcoming,
  formatIndonesianDate,
} from '../components/ui/SoftUI';

const DEFAULT_HERO_PHOTO = ROKABA_REAL_PHOTOS[0];

const PRIMARY_SERVICES = [
  {
    id: 'programs',
    title: 'Program & kegiatan',
    description: 'Kenali pembinaan, syiar, kepemimpinan, dan kolaborasi pelajar.',
    ctaText: 'Lihat program',
    link: '/programs',
  },
  {
    id: 'schools',
    title: 'Sekolah anggota',
    description: 'Terhubung dengan jaringan ROHIS SMA, SMK, dan MA di Banyumas.',
    ctaText: 'Lihat jaringan',
    link: '/schools',
  },
  {
    id: 'library',
    title: 'Perpustakaan',
    description: 'Unduh modul, panduan kegiatan, dan bacaan pilihan untuk pengurus.',
    ctaText: 'Buka materi',
    link: '/library',
  },
];

const SECONDARY_SERVICES = [
  { label: 'Artikel & bacaan pelajar', link: '/articles' },
  { label: 'Galeri dokumentasi', link: '/gallery' },
  { label: 'Ruang konsultasi sebaya', link: '/consultation' },
];

export default function Home() {
  const { home = {}, news = [], events = [], team } = useData();
  const hiddenSections = Array.isArray(home?.hiddenSections) ? home.hiddenSections : [];
  const isVisible = (sectionKey) => !hiddenSections.includes(sectionKey);

  const heroData = home?.hero || {};
  const heroPhoto =
    heroData.photoUrl ||
    heroData.backgroundImage ||
    news?.[0]?.image ||
    DEFAULT_HERO_PHOTO;

  // Gunakan headline rancangan Soft UI kecuali jika admin mengubah judul secara spesifik
  const heroTitle =
    heroData.title && heroData.title !== 'Menyatukan Langkah, Menguatkan Ukhuwah.'
      ? heroData.title
      : 'Tempat berkumpul, bertumbuh, dan bergerak bersama.';

  const heroSubtitle =
    heroData.subtitle && !heroData.subtitle.startsWith('Wadah kolaborasi')
      ? heroData.subtitle
      : 'ROKABA mempertemukan ROHIS SMA, SMK, dan MA se-Kabupaten Banyumas dalam ruang pembinaan, persaudaraan, dan kegiatan nyata yang dekat dengan keseharian pelajar.';

  // Urutkan berita sesuai order lalu tanggal terbaru
  const sortedNews = [...news].sort((a, b) => {
    const orderA = Number.isFinite(Number(a.order)) ? Number(a.order) : 999;
    const orderB = Number.isFinite(Number(b.order)) ? Number(b.order) : 999;
    if (orderA !== orderB) return orderA - orderB;
    return String(b.date || '').localeCompare(String(a.date || ''));
  });

  const featuredNews = sortedNews[0] || null;
  const secondaryNews = sortedNews.slice(1, 3);

  // Urutkan agenda dan pisahkan mendatang vs arsip berdasarkan zona waktu Asia/Jakarta
  const todayStr = getJakartaToday();
  const sortedEvents = [...events].sort((a, b) =>
    String(b.date || '').localeCompare(String(a.date || ''))
  );
  const upcomingEvents = sortedEvents
    .filter((ev) => isEventUpcoming(ev, todayStr))
    .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
  const archivedEvents = sortedEvents.filter((ev) => !isEventUpcoming(ev, todayStr));
  const displayedEvents = (upcomingEvents.length > 0 ? upcomingEvents : archivedEvents).slice(0, 3);

  // Normalisasi stats (mendukung array langsung maupun objek .items)
  const rawStats = Array.isArray(home?.stats)
    ? home.stats
    : Array.isArray(home?.stats?.items)
    ? home.stats.items
    : [];

  const statsItems =
    rawStats.length > 0
      ? rawStats.map((s) => ({
          value: `${s.value}${s.suffix || ''}`,
          label: s.label,
        }))
      : [
          { value: '15+', label: 'Dari Sekolah Kab. Banyumas' },
          { value: '53+', label: 'Anggota Aktif' },
          { value: '7+', label: 'Event Besar' },
          { value: '2017', label: 'Tahun Berdiri' },
        ];

  const aboutData = home?.about || {};
  const sambutanData = home?.sambutan || {};
  const closingData = home?.closing || {};

  // Normalisasi timeline (mendukung array langsung maupun objek .steps)
  const timelineSteps = Array.isArray(home?.timeline)
    ? home.timeline
    : Array.isArray(home?.timeline?.steps)
    ? home.timeline.steps
    : [];

  // Data pimpinan untuk sambutan
  const { bph } = normalizeTeamData(team);
  const topLeaders = bph.slice(0, 3);

  return (
    <div className="rk-page">
      {/* 1. HERO SECTION (45% Teks / 55% Bingkai Foto) */}
      {isVisible('hero') && (
        <section className="rk-hero" aria-labelledby="rk-hero-heading">
          <Container>
            <div className="rk-hero-grid">
              <div>
                <div className="rk-eyebrow">
                  <span className="rk-eyebrow-bar" aria-hidden="true" />
                  <span>ROKABA • ROHIS Kabupaten Banyumas</span>
                </div>

                <h1 id="rk-hero-heading" className="rk-hero-title">
                  {heroTitle}
                </h1>

                <p className="rk-hero-lead">{heroSubtitle}</p>

                <div className="rk-hero-actions">
                  <Link to="/about" className="rk-btn-primary">
                    Mengenal ROKABA
                  </Link>
                  <Link to="/programs" className="rk-link-inline">
                    <span>Jelajahi program</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <p className="rk-hero-subnote">
                  Terbuka untuk pelajar, pengurus ROHIS, dan sekolah anggota di Banyumas.
                </p>
              </div>

              <div>
                <PhotoFrame
                  src={heroPhoto}
                  alt="Dokumentasi kebersamaan pengurus dan kader ROHIS Kabupaten Banyumas"
                  aspect="16/10"
                  eager
                  captionTitle="Kebersamaan kader ROHIS Banyumas"
                  captionSub="Dokumentasi kegiatan pelajar lintas sekolah"
                />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 2. PINTU MASUK LAYANAN (Temukan ruangmu.) */}
      {isVisible('services') && (
        <section className="rk-section" aria-labelledby="rk-services-heading">
          <Container>
            <div className="rk-section-head">
              <div>
                <h2 id="rk-services-heading" className="rk-section-title">
                  Temukan ruangmu.
                </h2>
              </div>
            </div>

            <div className="rk-grid-3">
              {PRIMARY_SERVICES.map((service) => (
                <SoftCard key={service.id} as="article" interactive className="rk-service-card">
                  <div>
                    <h3>{service.title}</h3>
                    <p style={{ marginTop: '8px' }}>{service.description}</p>
                  </div>
                  <Link to={service.link} className="rk-card-link">
                    <span>{service.ctaText}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </SoftCard>
              ))}
            </div>

            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '0.86rem', color: 'var(--rk-muted)', fontWeight: 600 }}>
                Eksplorasi lainnya:
              </span>
              {SECONDARY_SERVICES.map((item) => (
                <Link key={item.link} to={item.link} className="rk-pill">
                  <span>{item.label}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 3. SOROTAN BERITA & AGENDA BERSAMA */}
      {(isVisible('news') || isVisible('events')) && (
        <section className="rk-section" aria-label="Sorotan berita dan agenda">
          <Container>
            <div className="rk-split-60-40">
              {/* Kolom Kiri: Kabar dari ROKABA */}
              {isVisible('news') && (
                <div>
                  <div className="rk-section-head">
                    <h2 className="rk-section-title">Kabar dari ROKABA</h2>
                    <Link to="/berita" className="rk-card-link" style={{ marginTop: 0 }}>
                      <span>Semua berita</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>

                  {featuredNews ? (
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <SoftCard as="article" className="rk-news-feature-card">
                        <div className="rk-news-feature-thumb">
                          <SmartImage
                            src={featuredNews.image || DEFAULT_HERO_PHOTO}
                            alt={featuredNews.title}
                          />
                        </div>
                        <div className="rk-meta-line">
                          <span className="rk-badge rk-badge--brass">
                            {featuredNews.category || 'Kegiatan'}
                          </span>
                          <span>•</span>
                          <span>{formatIndonesianDate(featuredNews.date)}</span>
                        </div>
                        <h3 style={{ fontSize: '1.22rem', lineHeight: 1.3 }}>
                          <Link
                            to={`/berita/${featuredNews.slug || featuredNews.id}`}
                            style={{ color: 'inherit' }}
                          >
                            {featuredNews.title}
                          </Link>
                        </h3>
                        <p>{featuredNews.excerpt}</p>
                        <Link
                          to={`/berita/${featuredNews.slug || featuredNews.id}`}
                          className="rk-card-link"
                          style={{ marginTop: '4px' }}
                        >
                          <span>Baca selengkapnya</span>
                          <span aria-hidden="true">→</span>
                        </Link>
                      </SoftCard>

                      {secondaryNews.length > 0 && (
                        <div className="rk-grid-2">
                          {secondaryNews.map((item) => (
                            <SoftCard key={item.id} as="article" style={{ padding: '18px 20px' }}>
                              <div className="rk-meta-line">
                                <span>{item.category || 'Kabar'}</span>
                                <span>•</span>
                                <span>{formatIndonesianDate(item.date)}</span>
                              </div>
                              <h3
                                style={{
                                  fontSize: '1rem',
                                  lineHeight: 1.35,
                                  marginTop: '6px',
                                  marginBottom: '8px',
                                }}
                              >
                                <Link
                                  to={`/berita/${item.slug || item.id}`}
                                  style={{ color: 'inherit' }}
                                >
                                  {item.title}
                                </Link>
                              </h3>
                              <Link
                                to={`/berita/${item.slug || item.id}`}
                                className="rk-card-link"
                                style={{ fontSize: '0.86rem' }}
                              >
                                <span>Baca berita</span>
                                <span aria-hidden="true">→</span>
                              </Link>
                            </SoftCard>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      title="Belum ada kabar terbaru"
                      description="Berita kegiatan ROKABA akan segera ditampilkan di sini."
                    />
                  )}
                </div>
              )}

              {/* Kolom Kanan: Agenda bersama (Inset Panel) */}
              {isVisible('events') && (
                <div>
                  <div className="rk-section-head">
                    <h2 className="rk-section-title">Agenda bersama</h2>
                    <span className="rk-badge">
                      {upcomingEvents.length > 0 ? 'Mendatang' : 'Arsip kegiatan'}
                    </span>
                  </div>

                  <SoftCard variant="inset" style={{ display: 'grid', gap: '16px' }}>
                    {upcomingEvents.length === 0 && displayedEvents.length > 0 && (
                      <p
                        style={{
                          fontSize: '0.84rem',
                          color: 'var(--rk-muted)',
                          background: 'rgba(255, 255, 255, 0.55)',
                          padding: '10px 12px',
                          borderRadius: '12px',
                          border: '1px solid var(--rk-line)',
                        }}
                      >
                        Belum ada jadwal baru yang terdaftar. Berikut dokumentasi agenda terakhir yang telah terlaksana:
                      </p>
                    )}

                    {displayedEvents.length > 0 ? (
                      <div>
                        {displayedEvents.map((ev) => {
                          const upcoming = isEventUpcoming(ev, todayStr);
                          return (
                            <div key={ev.id} className="rk-agenda-mini-item">
                              <div className="rk-meta-line">
                                <span>{formatIndonesianDate(ev.date)}</span>
                                <span>•</span>
                                <span>{upcoming ? 'Mendatang' : 'Terlaksana'}</span>
                              </div>
                              <h3>{ev.title}</h3>
                              <p>
                                {ev.location || 'Kabupaten Banyumas'}
                                {ev.time ? ` • ${ev.time}` : ''}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.9rem' }}>Belum ada agenda yang tercatat.</p>
                    )}

                    <div style={{ paddingTop: '4px' }}>
                      <Link to="/events" className="rk-card-link">
                        <span>Lihat seluruh agenda</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </SoftCard>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* 4. MENGENAL ROKABA & STATISTIK VALID */}
      {(isVisible('about') || isVisible('stats')) && (
        <section className="rk-section" aria-labelledby="rk-about-home-heading">
          <Container>
            <SoftCard style={{ padding: 'clamp(24px, 3.5vw, 36px)' }}>
              <div className="rk-split-60-40" style={{ alignItems: 'center' }}>
                <div>
                  <div className="rk-eyebrow">
                    <span className="rk-eyebrow-bar" aria-hidden="true" />
                    <span>{aboutData.tag || aboutData.eyebrow || 'Tentang Kami'}</span>
                  </div>
                  <h2 id="rk-about-home-heading" className="rk-section-title">
                    {aboutData.title || 'Mengenal Lebih Dekat ROKABA'}
                  </h2>
                  {(aboutData.quoteText || aboutData.quote) && (
                    <blockquote
                      style={{
                        margin: '14px 0',
                        paddingLeft: '14px',
                        borderLeft: '3px solid var(--rk-brass)',
                        color: 'var(--rk-ink)',
                        fontWeight: 500,
                        fontSize: '0.96rem',
                      }}
                    >
                      {aboutData.quoteText || `“${aboutData.quote}”`}
                    </blockquote>
                  )}
                  <p style={{ marginTop: '10px', maxWidth: '62ch' }}>
                    {aboutData.lead ||
                      aboutData.paragraph1 ||
                      aboutData.description ||
                      'ROHIS Kabupaten Banyumas (ROKABA) hadir sebagai rumah bersama bagi seluruh ekstrakurikuler Kerohanian Islam tingkat SMA, SMK, dan MA di Banyumas.'}
                  </p>
                  <div style={{ marginTop: '18px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    <Link to="/about" className="rk-card-link">
                      <span>Pelajari profil & sejarah lengkap</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>

                {isVisible('stats') && (
                  <div className="rk-grid-2">
                    {statsItems.map((stat, idx) => (
                      <div key={idx} className="rk-inset-panel" style={{ padding: '18px' }}>
                        <div
                          style={{
                            fontSize: 'clamp(1.5rem, 2.4vw, 2rem)',
                            fontWeight: 700,
                            color: 'var(--rk-pine)',
                            letterSpacing: '-0.03em',
                          }}
                        >
                          {stat.value}
                        </div>
                        <div
                          style={{
                            fontSize: '0.84rem',
                            color: 'var(--rk-muted)',
                            marginTop: '4px',
                            lineHeight: 1.4,
                          }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SoftCard>
          </Container>
        </section>
      )}

      {/* 5. SAMBUTAN PIMPINAN */}
      {isVisible('sambutan') && (
        <section className="rk-section" aria-labelledby="rk-leaders-heading">
          <Container>
            <div className="rk-section-head">
              <div>
                <div className="rk-eyebrow">
                  <span className="rk-eyebrow-bar" aria-hidden="true" />
                  <span>{sambutanData.tag || 'Sambutan Pimpinan'}</span>
                </div>
                <h2 id="rk-leaders-heading" className="rk-section-title">
                  {sambutanData.titleLine1
                    ? `${sambutanData.titleLine1} ${sambutanData.titleLine2 || ''}`.trim()
                    : 'Sambutan Pimpinan ROKABA'}
                </h2>
              </div>
              <Link to="/schools#pengurus" className="rk-card-link">
                <span>Struktur pengurus</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="rk-split-60-40">
              <SoftCard>
                {sambutanData.greeting && (
                  <p style={{ fontWeight: 600, color: 'var(--rk-ink)', marginBottom: '10px' }}>
                    {sambutanData.greeting}
                  </p>
                )}
                <p style={{ marginBottom: '12px' }}>
                  {sambutanData.paragraph1 ||
                    'Selamat datang di portal resmi ROHIS Kabupaten Banyumas (ROKABA). Website ini kami hadirkan sebagai sarana informasi, komunikasi, dan publikasi kegiatan dakwah serta pengembangan potensi pelajar se-Kabupaten Banyumas.'}
                </p>
                {sambutanData.paragraph2 && <p>{sambutanData.paragraph2}</p>}
              </SoftCard>

              <div style={{ display: 'grid', gap: '12px' }}>
                {topLeaders.map((leader) => (
                  <SoftCard key={leader.id} as="article" style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: 'var(--rk-brass-text)',
                      }}
                    >
                      {leader.role}
                    </span>
                    <h3 style={{ fontSize: '1.02rem', marginTop: '2px' }}>{leader.name}</h3>
                    <p style={{ fontSize: '0.84rem' }}>{leader.school}</p>
                  </SoftCard>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 6. JEJAK PERJALANAN (TIMELINE) */}
      {isVisible('timeline') && timelineSteps.length > 0 && (
        <section className="rk-section" aria-labelledby="rk-timeline-heading">
          <Container>
            <div className="rk-section-head">
              <div>
                <div className="rk-eyebrow">
                  <span className="rk-eyebrow-bar" aria-hidden="true" />
                  <span>Jejak Perjalanan</span>
                </div>
                <h2 id="rk-timeline-heading" className="rk-section-title">
                  Langkah Demi Langkah Membangun Ukhuwah
                </h2>
              </div>
            </div>

            <div className="rk-grid-4">
              {timelineSteps.slice(0, 4).map((step, idx) => (
                <SoftCard key={step.id || idx} as="article">
                  <span className="rk-badge rk-badge--brass">{step.year}</span>
                  <h3 style={{ marginTop: '10px', marginBottom: '6px', fontSize: '1.05rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem' }}>{step.desc || step.description}</p>
                </SoftCard>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 7. AJAKAN PENUTUP */}
      {isVisible('closing') && (
        <section className="rk-section" aria-labelledby="rk-closing-heading">
          <Container>
            <SoftCard
              style={{
                padding: 'clamp(24px, 3.5vw, 36px)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
              }}
            >
              <div style={{ maxWidth: '620px' }}>
                <div className="rk-eyebrow">
                  <span className="rk-eyebrow-bar" aria-hidden="true" />
                  <span>{closingData.tag || 'Mari Berkolaborasi'}</span>
                </div>
                <h2 id="rk-closing-heading" className="rk-section-title">
                  {closingData.headline || closingData.title || 'Mari Bertumbuh Bersama dalam Kebaikan'}
                </h2>
                <p style={{ marginTop: '8px' }}>
                  {closingData.lead ||
                    closingData.subtitle ||
                    'Jadilah bagian dari perjalanan dakwah pelajar yang ramah, inklusif, dan berdampak nyata bagi sekolah serta masyarakat Kabupaten Banyumas.'}
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Link to="/contact" className="rk-btn-primary">
                  Hubungi Kami
                </Link>
                <Link to="/schools" className="rk-btn-secondary">
                  Lihat Jaringan Sekolah
                </Link>
              </div>
            </SoftCard>
          </Container>
        </section>
      )}
    </div>
  );
}
