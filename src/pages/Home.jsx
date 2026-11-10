import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  Container,
  PhotoFrame,
  PrimaryButton,
  ROKABA_REAL_PHOTOS,
  SoftCard,
  formatIndonesianDate,
  formatShortDayMonth,
} from '../components/ui/SoftUI';

const DISCOVER_CARDS = [
  {
    title: 'Program & kegiatan',
    description:
      '5 divisi utama (SDM, Dakwah, Humas, Jurnalistik, Danus) serta ajang tahunan Rohis Banyumas Competition (RBC).',
    to: '/programs',
  },
  {
    title: 'Sekolah anggota',
    description:
      'Wadah kolaborasi 17+ ROHIS dari berbagai SMA, SMK, dan MA negeri maupun swasta se-Kabupaten Banyumas.',
    to: '/schools',
  },
  {
    title: 'Artikel & literasi',
    description:
      'Bacaan Islami moderat tentang kepemimpinan, ukhuwah remaja, tips istiqomah ibadah, dan dakwah era digital.',
    to: '/articles',
  },
  {
    title: 'Galeri dokumentasi',
    description:
      'Rekam jejak foto dan video kegiatan Kajian Akbar, LDK ROHIS, Bakti Sosial Ramadhan, Muskerda, dan RBC.',
    to: '/gallery',
  },
  {
    title: 'Ruang konsultasi',
    description:
      'Tempat bertanya dengan nyaman seputar fiqih ibadah, motivasi belajar, dan dinamika organisasi pelajar.',
    to: '/consultation',
  },
];

const LEADERS_DATA = [
  {
    id: 'ketua-umum',
    role: 'Ketua Umum',
    roleLine1: 'Ketua',
    roleLine2: 'Umum',
    name: 'Nama pengurus',
    photo: null,
    salutation: "Assalamu'alaikum warahmatullahi wabarakatuh.",
    paragraph1Desktop:
      'Selamat datang di portal resmi ROHIS SMA Negeri 4 Purwokerto. Ruang ini menjadi sarana informasi, silaturahmi, dan pengembangan potensi pelajar.',
    paragraph1Mobile:
      'Selamat datang di portal resmi ROHIS SMA Negeri 4 Purwokerto. Ruang ini menjadi tempat berbagi informasi, belajar, dan bertumbuh bersama.',
    paragraph2:
      'Bersama seluruh pengurus, kami ingin menghadirkan kegiatan yang menguatkan iman, menumbuhkan kepemimpinan, dan memberi manfaat bagi lingkungan sekolah.',
    paragraph3Desktop:
      'Mari merawat ukhuwah, saling mendukung dalam belajar, dan mengambil bagian dalam setiap langkah kebaikan.',
    paragraph3Mobile:
      'Mari merawat ukhuwah dan saling mendukung dalam setiap langkah kebaikan.',
    closing: "Wassalamu'alaikum warahmatullahi wabarakatuh.",
    nextId: 'ketua-akhwat',
    nextButtonText: 'Sambutan Ketua Akhwat',
  },
  {
    id: 'ketua-akhwat',
    role: 'Ketua Akhwat',
    roleLine1: 'Ketua',
    roleLine2: 'Akhwat',
    name: 'Nama pengurus',
    photo: null,
    salutation: "Assalamu'alaikum warahmatullahi wabarakatuh.",
    paragraph1Desktop:
      'Selamat datang di portal resmi ROHIS SMA Negeri 4 Purwokerto. Ruang ini menjadi sarana informasi, silaturahmi, dan pengembangan potensi pelajar muslimah.',
    paragraph1Mobile:
      'Selamat datang di portal resmi ROHIS SMA Negeri 4 Purwokerto. Ruang ini menjadi tempat berbagi informasi, belajar, dan bertumbuh bersama.',
    paragraph2:
      'Bersama seluruh pengurus, kami ingin menghadirkan kegiatan yang menguatkan iman, menumbuhkan kepemimpinan, dan memberi manfaat bagi lingkungan sekolah.',
    paragraph3Desktop:
      'Mari merawat ukhuwah, saling mendukung dalam belajar, dan mengambil bagian dalam setiap langkah kebaikan.',
    paragraph3Mobile:
      'Mari merawat ukhuwah dan saling mendukung dalam setiap langkah kebaikan.',
    closing: "Wassalamu'alaikum warahmatullahi wabarakatuh.",
    nextId: 'ketua-ikhwan',
    nextButtonText: 'Sambutan Ketua Ikhwan',
  },
  {
    id: 'ketua-ikhwan',
    role: 'Ketua Ikhwan',
    roleLine1: 'Ketua',
    roleLine2: 'Ikhwan',
    name: 'Nama pengurus',
    photo: null,
    salutation: "Assalamu'alaikum warahmatullahi wabarakatuh.",
    paragraph1Desktop:
      'Selamat datang di portal resmi ROHIS SMA Negeri 4 Purwokerto. Ruang ini menjadi sarana informasi, silaturahmi, dan pengembangan potensi pelajar.',
    paragraph1Mobile:
      'Selamat datang di portal resmi ROHIS SMA Negeri 4 Purwokerto. Ruang ini menjadi tempat berbagi informasi, belajar, dan bertumbuh bersama.',
    paragraph2:
      'Bersama seluruh pengurus, kami ingin menghadirkan kegiatan yang menguatkan iman, menumbuhkan kepemimpinan, dan memberi manfaat bagi lingkungan sekolah.',
    paragraph3Desktop:
      'Mari merawat ukhuwah, saling mendukung dalam belajar, dan mengambil bagian dalam setiap langkah kebaikan.',
    paragraph3Mobile:
      'Mari merawat ukhuwah dan saling mendukung dalam setiap langkah kebaikan.',
    closing: "Wassalamu'alaikum warahmatullahi wabarakatuh.",
    nextId: 'ketua-umum',
    nextButtonText: 'Sambutan Ketua Umum',
  },
];

export default function Home() {
  const { home, news, events } = useData();
  const [activeLeaderId, setActiveLeaderId] = useState('ketua-umum');

  const activeLeader =
    LEADERS_DATA.find((l) => l.id === activeLeaderId) || LEADERS_DATA[0];

  const stats =
    Array.isArray(home?.stats) && home.stats.length > 0
      ? home.stats
      : [
          { value: 15, suffix: '+', label: 'Dari Sekolah Kab. Banyumas' },
          { value: 53, suffix: '+', label: 'Anggota & Pengurus Aktif' },
          { value: 7, suffix: '+', label: 'Event Besar Kabupaten' },
          { value: 2017, suffix: '', label: 'Tahun Berdiri di Purwokerto' },
        ];

  const aboutData = home?.about || {
    tag: 'TENTANG KAMI',
    title: 'Bukan sekadar sebuah organisasi.',
    lead: 'Didirikan pada tahun 2017 di Purwokerto, ROHIS Kabupaten Banyumas tumbuh dari tekad bersama para pelajar SMA, SMK, dan MA untuk merajut ukhuwah dan memperkuat dakwah sekolah.',
    paragraph1:
      'Kami hadir bukan sekadar menyusun struktur jabatan formal, melainkan membangun ruang perjumpaan yang hangat—tempat setiap pelajar Muslim dapat belajar memahami nilai-nilai Islam yang rahmatan lil alamin, mengasah kepemimpinan, dan menyalurkan kepedulian nyata bagi masyarakat.',
    point1Title: 'Sinergi Lintas Sekolah',
    point1Desc: 'Mengikis sekat sekolah, menghubungkan puluhan rohis di Kabupaten Banyumas.',
    point2Title: 'Kaderisasi Berjenjang',
    point2Desc: 'Mencetak generasi muda yang kritis, berakhlak mulia, dan siap memimpin.',
    quoteText:
      '"Di sini kami belajar bahwa dakwah terbaik tidak diukur dari megahnya panggung, melainkan dari keteladanan akhlak dan keikhlasan melayani sesama pelajar."',
    quoteAuthor: '— Catatan Lapangan Kader Pelajar, Banyumas',
  };

  const newsList = Array.isArray(news) ? news : [];
  const featuredNews = newsList[0] || {
    title:
      'Musyawarah Kerja Daerah (MUSKERDA) ROHIS Banyumas 2026: Sinergi Kuat Pelajar se-Kabupaten',
    slug: 'muskerda-rohis-banyumas-2026',
    category: 'Organisasi',
    date: '2026-09-25',
    location: 'Aula SMA N 2 Purwokerto',
    excerpt:
      'Perwakilan pengurus ROHIS SMA/SMK/MA se-Kabupaten Banyumas sukses menyepakati agenda strategis dakwah dan konsolidasi kader tahun 2026/2027.',
    image: ROKABA_REAL_PHOTOS[0],
  };
  const otherNews = newsList.slice(1, 4);

  const eventList = Array.isArray(events) ? events.slice(0, 5) : [];

  return (
    <div className="rk-page">
      {/* 1. HERO SECTION */}
      <section className="rk-hero">
        <Container>
          <div className="rk-hero-grid">
            <div>
              <div className="rk-eyebrow">
                <span className="rk-eyebrow-bar" aria-hidden="true" />
                <span>Forum Komunikasi ROHIS Kabupaten Banyumas</span>
              </div>

              <h1 className="rk-hero-title">
                Satu ukhuwah. Banyak langkah kebaikan.
              </h1>

              <p className="rk-hero-lead" style={{ maxWidth: '50ch' }}>
                {home?.hero?.narrative ||
                  'Ruang bertumbuh bagi pelajar Muslim untuk belajar, berkarya, dan memberi manfaat bersama. Wadah silaturahmi, kaderisasi kepemimpinan, dan sinergi dakwah pelajar Islam lintas SMA, SMK, dan MA se-Kabupaten Banyumas.'}
              </p>

              <div className="rk-hero-actions">
                <PrimaryButton as={Link} to="/about">
                  Mengenal ROKABA
                </PrimaryButton>

                <Link to="/programs" className="rk-link-inline">
                  <span>Jelajahi program</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <p className="rk-hero-subnote">
                Terhubung lintas 17+ SMA, SMK, dan MA di bawah pembinaan Seksi PAI
                Kemenag Kabupaten Banyumas.
              </p>
            </div>

            <div>
              <PhotoFrame
                src={home?.hero?.photoUrl || ROKABA_REAL_PHOTOS[0]}
                alt="Kebersamaan kader ROHIS Kabupaten Banyumas"
                aspect="16/9.6"
                captionTitle="Kebersamaan kader ROHIS Banyumas"
                captionSub="Dokumentasi ROKABA • RBC X PECETIKAH SMAN 2 Purwokerto"
                eager
              />
            </div>
          </div>

          {/* 4 STATISTIK UTAMA DARI ROHIS-BANYUMAS.WEB.ID */}
          <div className="rk-grid-4" style={{ marginTop: '22px' }}>
            {stats.map((st, idx) => (
              <SoftCard
                key={idx}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: 'clamp(1.45rem, 2.2vw, 1.9rem)',
                      fontWeight: 800,
                      color: 'var(--rk-ink)',
                      lineHeight: 1.1,
                    }}
                  >
                    {st.value}
                    {st.suffix || ''}
                  </strong>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: 'var(--rk-muted)',
                      marginTop: '4px',
                    }}
                  >
                    {st.label}
                  </span>
                </div>
                <span className="rk-eyebrow-bar" aria-hidden="true" />
              </SoftCard>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. SAMBUTAN PIMPINAN ROHIS (100% REFERENCE-FAITHFUL — PLACED BEFORE TEMUKAN RUANGMU) */}
      <section className="rk-sambutan-section">
        <Container>
          <div className="rk-sambutan-header">
            <h2 className="rk-sambutan-title">
              <span className="rk-show-mobile">Sambutan pengurus</span>
              <span className="rk-show-desktop">Sambutan Pimpinan ROHIS</span>
            </h2>
            <div className="rk-sambutan-eyebrow">
              <span className="rk-sambutan-eyebrow-bar" aria-hidden="true" />
              <span>Bersama merawat ukhuwah dan menggerakkan kebaikan.</span>
            </div>
          </div>

          {/* Desktop Tabs with Status Indicator Dot */}
          <div
            className="rk-sambutan-tabs"
            role="tablist"
            aria-label="Pilih sambutan pimpinan"
          >
            {LEADERS_DATA.map((l) => {
              const isActive = activeLeaderId === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`rk-sambutan-tab ${isActive ? 'rk-sambutan-tab--active' : ''}`}
                  onClick={() => setActiveLeaderId(l.id)}
                >
                  <span className="rk-sambutan-tab-dot" aria-hidden="true" />
                  <span>{l.role}</span>
                </button>
              );
            })}
          </div>

          <div className="rk-sambutan-grid">
            {/* Left Column: Mobile Info Header + Body + Actions */}
            <div className="rk-sambutan-content">
              {/* Mobile-only current leader information (from Image 1) */}
              <div className="rk-mobile-leader-info">
                <strong className="rk-mobile-leader-name">{activeLeader.name}</strong>
                <span className="rk-mobile-leader-role">{activeLeader.role}</span>
                <hr className="rk-mobile-leader-divider" />
              </div>

              <div className="rk-sambutan-body">
                <p className="rk-sambutan-salutation">{activeLeader.salutation}</p>
                <p>
                  <span className="rk-show-desktop">{activeLeader.paragraph1Desktop}</span>
                  <span className="rk-show-mobile">{activeLeader.paragraph1Mobile}</span>
                </p>
                <p>{activeLeader.paragraph2}</p>
                <p>
                  <span className="rk-show-desktop">{activeLeader.paragraph3Desktop}</span>
                  <span className="rk-show-mobile">{activeLeader.paragraph3Mobile}</span>
                </p>
                <p className="rk-sambutan-closing">{activeLeader.closing}</p>
              </div>

              {/* Desktop Actions (Side-by-side buttons in left column) */}
              <div className="rk-sambutan-desktop-actions">
                <button
                  type="button"
                  className="rk-sambutan-btn-next"
                  onClick={() => setActiveLeaderId(activeLeader.nextId)}
                >
                  <span>{activeLeader.nextButtonText}</span>
                  <span aria-hidden="true">→</span>
                </button>

                <Link to="/about" className="rk-sambutan-btn-profile">
                  Profil pengurus
                </Link>
              </div>
            </div>

            {/* Right Column: Deck of 3 Leader Cards */}
            <div className="rk-sambutan-deck-wrap">
              <div className="rk-sambutan-deck-eyebrow">
                <span className="rk-sambutan-deck-eyebrow-bar">|</span>
                <span>Pilih pengurus untuk membaca sambutan</span>
              </div>

              <h3 className="rk-mobile-selector-head">Pilih sambutan pengurus</h3>

              <div className="rk-sambutan-deck-panel">
                <div className="rk-sambutan-cards-grid">
                  {LEADERS_DATA.map((leader) => {
                    const isSelected = activeLeaderId === leader.id;
                    return (
                      <div
                        key={leader.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveLeaderId(leader.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveLeaderId(leader.id);
                          }
                        }}
                        className={`rk-leader-card ${isSelected ? 'rk-leader-card--active' : ''}`}
                      >
                        <div className="rk-leader-photo-frame">
                          {leader.photo ? (
                            <img
                              src={leader.photo}
                              alt={`${leader.role} - ${leader.name}`}
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className="rk-leader-placeholder"
                              aria-label="Foto pengurus belum tersedia"
                            >
                              <User
                                size={32}
                                strokeWidth={1.5}
                                className="rk-leader-placeholder-icon"
                                aria-hidden="true"
                              />
                            </div>
                          )}
                        </div>

                        <div className="rk-leader-role-desktop">{leader.role}</div>
                        <div className="rk-leader-role-mobile">
                          <span>{leader.roleLine1}</span>
                          <span>{leader.roleLine2}</span>
                        </div>

                        <span className="rk-leader-card-name">{leader.name}</span>

                        {isSelected && (
                          <span className="rk-leader-active-badge">
                            Sambutan ditampilkan
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="rk-sambutan-note">
                Foto pengurus asli akan segera diperbarui.
              </p>

              {/* Mobile Actions (Buttons placed below cards on mobile as shown in Image 1) */}
              <div className="rk-sambutan-mobile-actions-wrap">
                <button
                  type="button"
                  className="rk-sambutan-btn-next"
                  onClick={() => setActiveLeaderId(activeLeader.nextId)}
                >
                  <span>{activeLeader.nextButtonText}</span>
                  <span aria-hidden="true">→</span>
                </button>

                <Link to="/about" className="rk-sambutan-btn-profile">
                  Lihat profil pengurus
                </Link>

                <div className="rk-mobile-footer-note">
                  <span className="rk-mobile-footer-org">ROHIS SMA Negeri 4 Purwokerto</span>
                  <span className="rk-mobile-footer-sub">
                    Foto pengurus asli akan segera diperbarui.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. TEMUKAN RUANGMU (6 LAYANAN & DIREKTORI LENGKAP) */}
      <section className="rk-section">
        <Container>
          <div className="rk-inline-section-head">
            <h2>Temukan ruangmu.</h2>
            <span className="rk-inline-section-sep" aria-hidden="true" />
            <p>
              Berbagai layanan, literasi, dan direktori untuk mendukung langkah
              kebaikanmu di ROKABA.
            </p>
          </div>

          <div className="rk-grid-3">
            {DISCOVER_CARDS.map((card) => (
              <SoftCard
                key={card.to}
                as={Link}
                to={card.to}
                interactive
                className="rk-service-card"
              >
                <div style={{ display: 'grid', gap: '6px' }}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>

                <span className="rk-card-link-right">
                  <span>Jelajahi</span>
                  <span aria-hidden="true">→</span>
                </span>
              </SoftCard>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. TENTANG KAMI & KABAR DARI ROKABA */}
      <section className="rk-section">
        <Container>
          <SoftCard style={{ padding: 'clamp(20px, 2.5vw, 28px)' }}>
            <div className="rk-eyebrow" style={{ marginBottom: 0 }}>
              <span className="rk-eyebrow-bar" aria-hidden="true" />
              <span>{aboutData.tag || 'TENTANG KAMI'} • EST. 2017</span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.35rem, 2vw, 1.7rem)', marginTop: '8px' }}>
              {aboutData.title}
            </h2>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginTop: '8px' }}>
              {aboutData.lead}
            </p>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginTop: '6px' }}>
              {aboutData.paragraph1}
            </p>

            <div className="rk-grid-2" style={{ marginTop: '14px', gap: '12px' }}>
              <div className="rk-inset-panel" style={{ padding: '12px 14px' }}>
                <strong
                  style={{
                    display: 'block',
                    fontSize: '0.88rem',
                    color: 'var(--rk-ink)',
                  }}
                >
                  {aboutData.point1Title}
                </strong>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: 'var(--rk-muted)',
                    marginTop: '3px',
                  }}
                >
                  {aboutData.point1Desc}
                </span>
              </div>

              <div className="rk-inset-panel" style={{ padding: '12px 14px' }}>
                <strong
                  style={{
                    display: 'block',
                    fontSize: '0.88rem',
                    color: 'var(--rk-ink)',
                  }}
                >
                  {aboutData.point2Title}
                </strong>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: 'var(--rk-muted)',
                    marginTop: '3px',
                  }}
                >
                  {aboutData.point2Desc}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: '12px',
                paddingTop: '14px',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: '3px',
                  borderRadius: '99px',
                  background: 'var(--rk-brass)',
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontSize: '0.84rem',
                  fontStyle: 'italic',
                  color: 'var(--rk-ink)',
                }}
              >
                {aboutData.quoteText}{' '}
                <strong style={{ fontStyle: 'normal' }}>
                  {aboutData.quoteAuthor}
                </strong>
              </p>
            </div>
          </SoftCard>
        </Container>
      </section>

      {/* 5. KABAR DARI ROKABA & AGENDA BERSAMA */}
      <section className="rk-section" style={{ paddingBottom: '16px' }}>
        <Container>
          <div className="rk-split-55-45">
            {/* Left: Kabar dari ROKABA */}
            <div style={{ display: 'grid', gap: '14px', alignContent: 'start' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <h2 style={{ fontSize: 'clamp(1.45rem, 2.2vw, 1.85rem)' }}>
                  Kabar dari ROKABA
                </h2>
                <Link to="/berita" className="rk-card-link">
                  <span>Semua berita</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              {/* Featured News Card */}
              <SoftCard
                as={Link}
                to={`/berita/${featuredNews.slug}`}
                interactive
                style={{ padding: '14px', textDecoration: 'none' }}
              >
                <div className="rk-home-news-row">
                  <div
                    style={{
                      borderRadius: '14px',
                      overflow: 'hidden',
                      aspectRatio: '16/10',
                      background: 'var(--rk-surface-recessed)',
                      minHeight: '120px',
                    }}
                  >
                    <img
                      src={featuredNews.image || ROKABA_REAL_PHOTOS[0]}
                      alt={featuredNews.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '4px 6px',
                    }}
                  >
                    <span className="rk-badge-category">
                      {featuredNews.category || 'Organisasi'}
                    </span>
                    <h3
                      style={{
                        fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
                        lineHeight: 1.25,
                      }}
                    >
                      {featuredNews.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--rk-muted)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {featuredNews.excerpt}
                    </p>
                    <span
                      className="rk-card-link"
                      style={{ alignSelf: 'flex-start', marginTop: '2px' }}
                    >
                      <span>Baca selengkapnya</span>
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </SoftCard>

              {/* News Bars */}
              <div style={{ display: 'grid', gap: '8px' }}>
                {otherNews.map((item) => (
                  <Link
                    key={item.slug || item.title}
                    to={`/berita/${item.slug}`}
                    className="rk-bar-card"
                  >
                    <span
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        color: 'var(--rk-ink)',
                        lineHeight: 1.35,
                      }}
                    >
                      {item.title}
                    </span>
                    <span aria-hidden="true" style={{ fontWeight: 700 }}>
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Agenda bersama */}
            <div style={{ display: 'grid', gap: '14px', alignContent: 'start' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <h2 style={{ fontSize: 'clamp(1.45rem, 2.2vw, 1.85rem)' }}>
                  Agenda bersama
                </h2>
                <Link to="/events" className="rk-card-link">
                  <span>Semua agenda</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div style={{ display: 'grid', gap: '8px' }}>
                {eventList.map((evt) => {
                  const dateObj = formatShortDayMonth(evt.date);
                  const dateStr =
                    evt.dateBadge ||
                    (dateObj && dateObj.day !== '--'
                      ? `${dateObj.day} ${dateObj.month}`
                      : 'AGENDA');
                  return (
                    <SoftCard
                      key={evt.id || evt.title}
                      as={Link}
                      to="/events"
                      interactive
                      style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px',
                        textDecoration: 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          minWidth: 0,
                        }}
                      >
                        <span
                          className="rk-inset-panel"
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            color: 'var(--rk-pine)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {dateStr}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <strong
                            style={{
                              display: 'block',
                              fontSize: '0.92rem',
                              color: 'var(--rk-ink)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {evt.title}
                          </strong>
                          {evt.location && (
                            <span
                              style={{
                                display: 'block',
                                fontSize: '0.78rem',
                                color: 'var(--rk-muted)',
                                marginTop: '2px',
                              }}
                            >
                              {evt.location}
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className="rk-card-link"
                        style={{ fontSize: '0.82rem', flexShrink: 0 }}
                      >
                        <span>Detail</span>
                        <span aria-hidden="true">→</span>
                      </span>
                    </SoftCard>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
