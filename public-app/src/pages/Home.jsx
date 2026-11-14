import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Compass,
  School,
  BookOpen,
  Image as ImageIcon,
  MessageCircle,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  Container,
  PhotoFrame,
  PrimaryButton,
  SecondaryButton,
  ROKABA_REAL_PHOTOS,
  SoftCard,
  SmartImage,
  formatShortDayMonth,
} from '../components/ui/SoftUI';

const DISCOVER_CARDS = [
  {
    title: 'Program & kegiatan',
    description:
      '5 divisi utama (SDM, Dakwah, Humas, Jurnalistik, Danus) serta ajang tahunan Rohis Banyumas Competition (RBC).',
    to: '/programs',
    icon: Compass,
  },
  {
    title: 'Sekolah anggota',
    description:
      'Wadah kolaborasi 17+ ROHIS dari berbagai SMA, SMK, dan MA negeri maupun swasta se-Kabupaten Banyumas.',
    to: '/schools',
    icon: School,
  },
  {
    title: 'Artikel & literasi',
    description:
      'Bacaan Islami moderat tentang kepemimpinan, ukhuwah remaja, tips istiqomah ibadah, dan dakwah era digital.',
    to: '/articles',
    icon: BookOpen,
  },
  {
    title: 'Galeri dokumentasi',
    description:
      'Rekam jejak foto dan video kegiatan Kajian Akbar, LDK ROHIS, Bakti Sosial Ramadhan, Muskerda, dan RBC.',
    to: '/gallery',
    icon: ImageIcon,
  },
  {
    title: 'Ruang konsultasi',
    description:
      'Tempat bertanya dengan nyaman seputar fiqih ibadah, motivasi belajar, dan dinamika organisasi pelajar.',
    to: '/consultation',
    icon: MessageCircle,
  },
];

export default function Home() {
  const { home, news, events } = useData();
  const [activeLeaderId, setActiveLeaderId] = useState('ketua-umum');

  const sambutanCms = home?.sambutan || {};

  const leadersData = useMemo(
    () => [
      {
        id: 'ketua-umum',
        role: 'Ketua Umum',
        name: sambutanCms.ketuaUmumName || 'Ketua Umum ROKABA',
        photo: sambutanCms.ketuaUmumPhoto || null,
        salutation: "Assalamu'alaikum warahmatullahi wabarakatuh.",
        paragraphs: [
          sambutanCms.paragraph1 ||
            'Selamat datang di portal resmi Forum Komunikasi ROHIS Kabupaten Banyumas (ROKABA). Ruang ini hadir sebagai sarana informasi, silaturahmi, dan pengembangan potensi pelajar Muslim SMA, SMK, dan MA se-Kabupaten Banyumas.',
          sambutanCms.paragraph2 ||
            'Bersama seluruh pengurus lintas sekolah, kami berkomitmen menghadirkan kegiatan yang menguatkan iman, menumbuhkan kepemimpinan yang amanah, serta memberi manfaat nyata bagi lingkungan sekolah dan masyarakat.',
          sambutanCms.quote
            ? String(sambutanCms.quote).replace(/^"+|"+$/g, '')
            : 'Mari merawat ukhuwah, saling mendukung dalam belajar, dan mengambil bagian dalam setiap langkah kebaikan bersama ROKABA.',
        ],
        closing: "Wassalamu'alaikum warahmatullahi wabarakatuh.",
        nextId: 'ketua-akhwat',
        nextButtonText: 'Sambutan Ketua Akhwat',
      },
      {
        id: 'ketua-akhwat',
        role: 'Ketua Akhwat',
        name: sambutanCms.ketuaAkhwatName || 'Ketua Akhwat ROKABA',
        photo: sambutanCms.ketuaAkhwatPhoto || null,
        salutation: "Assalamu'alaikum warahmatullahi wabarakatuh.",
        paragraphs: [
          'Selamat datang di ruang bersama ROHIS Kabupaten Banyumas (ROKABA). Kami menyambut hangat setiap pelajar muslimah dari berbagai SMA, SMK, dan MA untuk saling mengenal, belajar, dan bertumbuh dalam kebaikan.',
          'Melalui kajian keakhwatan, pembinaan adab, literasi kreatif, serta program kepedulian sosial, kami ingin menghadirkan suasana ukhuwah yang teduh, suportif, dan menginspirasi.',
          'Semoga setiap langkah kecil yang kita ikhtiarkan bersama menjadi amal jariyah dan membawa keberkahan bagi sekolah serta masyarakat.',
        ],
        closing: "Wassalamu'alaikum warahmatullahi wabarakatuh.",
        nextId: 'ketua-ikhwan',
        nextButtonText: 'Sambutan Ketua Ikhwan',
      },
      {
        id: 'ketua-ikhwan',
        role: 'Ketua Ikhwan',
        name: sambutanCms.ketuaIkhwanName || 'Ketua Ikhwan ROKABA',
        photo: sambutanCms.ketuaIkhwanPhoto || null,
        salutation: "Assalamu'alaikum warahmatullahi wabarakatuh.",
        paragraphs: [
          'Alhamdulillah, portal resmi ROHIS Kabupaten Banyumas (ROKABA) ini menjadi jembatan kolaborasi bagi kader pelajar Muslim lintas sekolah di seluruh Kabupaten Banyumas.',
          'Kami mengajak rekan-rekan pelajar untuk aktif menempa diri melalui latihan kepemimpinan, halaqah keilmuan, syiar kreatif, dan aksi bakti sosial yang terkoordinasi bersama.',
          'Mari jadikan masa muda di bangku sekolah sebagai momentum terbaik untuk menguatkan akhlak, memperluas persaudaraan, dan menebar manfaat.',
        ],
        closing: "Wassalamu'alaikum warahmatullahi wabarakatuh.",
        nextId: 'ketua-umum',
        nextButtonText: 'Sambutan Ketua Umum',
      },
    ],
    [sambutanCms]
  );

  const activeLeader =
    leadersData.find((l) => l.id === activeLeaderId) || leadersData[0];

  const stats =
    Array.isArray(home?.stats) && home.stats.length > 0
      ? home.stats
      : [
          { value: 17, suffix: '+', label: 'Sekolah Anggota Kab. Banyumas' },
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
    point1Desc:
      'Mengikis sekat sekolah, menghubungkan puluhan ROHIS SMA, SMK, dan MA di Kabupaten Banyumas.',
    point2Title: 'Kaderisasi Berjenjang',
    point2Desc:
      'Mencetak generasi muda yang kritis, berakhlak mulia, dan siap memimpin.',
    photoUrl: ROKABA_REAL_PHOTOS[1],
    quoteText:
      '"Di sini kami belajar bahwa dakwah terbaik tidak diukur dari megahnya panggung, melainkan dari keteladanan akhlak dan keikhlasan melayani sesama pelajar."',
    quoteAuthor: '— Catatan Lapangan Kader Pelajar, Banyumas',
  };

  const closingData = home?.closing || {
    title: 'Mari bergerak bersama dalam kebaikan.',
    description:
      'Terbuka untuk kolaborasi kegiatan ROHIS antar sekolah, delegasi kader, maupun ruang konsultasi pelajar Muslim se-Kabupaten Banyumas.',
    btnPrimaryText: 'Hubungi kami',
    btnPrimaryLink: '/contact',
    btnSecondaryText: 'Ruang konsultasi',
    btnSecondaryLink: '/consultation',
  };

  const sectionsMeta = home?.sections || {};

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
                <span>
                  {home?.hero?.tagline ||
                    'Forum Komunikasi ROHIS Kabupaten Banyumas'}
                </span>
              </div>

              <h1 className="rk-hero-title">
                {home?.hero?.headlineLine1 || 'Satu ukhuwah.'}{' '}
                {home?.hero?.headlineAccent || 'Banyak langkah kebaikan.'}
              </h1>

              <p className="rk-hero-lead" style={{ maxWidth: '50ch' }}>
                {home?.hero?.narrative ||
                  'Ruang bertumbuh bagi pelajar Muslim untuk belajar, berkarya, dan memberi manfaat bersama. Wadah silaturahmi, kaderisasi kepemimpinan, dan sinergi dakwah pelajar Islam lintas SMA, SMK, dan MA se-Kabupaten Banyumas.'}
              </p>

              <div className="rk-hero-actions">
                <PrimaryButton
                  as={Link}
                  to={home?.hero?.ctaPrimaryLink || '/about'}
                >
                  <span>{home?.hero?.ctaPrimaryText || 'Mengenal ROKABA'}</span>
                  <span aria-hidden="true">→</span>
                </PrimaryButton>

                <Link
                  to={home?.hero?.ctaSecondaryLink || '/programs'}
                  className="rk-link-inline"
                >
                  <span>{home?.hero?.ctaSecondaryText || 'Jelajahi program'}</span>
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
                captionSub="Dokumentasi ROKABA • Forum Komunikasi ROHIS SMA/SMK/MA"
                eager
              />
            </div>
          </div>

          {/* 4 STATISTIK UTAMA */}
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

      {/* 2. SAMBUTAN PENGURUS (SPEECH FIRST, 3 PORTRAIT CARDS BELOW, NEXT BUTTON AT BOTTOM) */}
      <section id="sambutan" className="rk-sambutan-section">
        <Container>
          <div className="rk-sambutan-header">
            <h2 className="rk-sambutan-title">
              {sambutanCms.title || 'Sambutan pengurus'}
            </h2>
            <div className="rk-sambutan-eyebrow">
              <span className="rk-sambutan-eyebrow-bar" aria-hidden="true" />
              <span>
                {sambutanCms.subtitle ||
                  'Bersama merawat ukhuwah dan menggerakkan kebaikan.'}
              </span>
            </div>
          </div>

          <div className="rk-sambutan-grid">
            {/* 1. Active Role Badge + Speech Content */}
            <div className="rk-sambutan-content">
              <div className="rk-sambutan-active-header">
                <span className="rk-sambutan-role-pill">
                  <span className="rk-sambutan-role-dot" aria-hidden="true" />
                  <span>{activeLeader.role}</span>
                </span>
                <span className="rk-sambutan-active-name">
                  {activeLeader.name}
                </span>
              </div>

              <div className="rk-sambutan-body">
                <p className="rk-sambutan-salutation">
                  {activeLeader.salutation}
                </p>
                {activeLeader.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
                <p className="rk-sambutan-closing">{activeLeader.closing}</p>
              </div>
            </div>

            {/* 2. Three Portrait Selector Cards (Placed Below Speech Text) */}
            <div className="rk-sambutan-deck-wrap">
              <div className="rk-sambutan-deck-panel">
                <div
                  className="rk-sambutan-cards-grid"
                  role="tablist"
                  aria-label="Pilih sambutan ketua"
                >
                  {leadersData.map((leader) => {
                    const isSelected = activeLeaderId === leader.id;
                    return (
                      <button
                        key={leader.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setActiveLeaderId(leader.id)}
                        className={`rk-leader-card ${
                          isSelected ? 'rk-leader-card--active' : ''
                        }`}
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
                                size={28}
                                strokeWidth={1.6}
                                className="rk-leader-placeholder-icon"
                                aria-hidden="true"
                              />
                              <span className="rk-leader-placeholder-text">
                                Foto belum tersedia
                              </span>
                            </div>
                          )}
                        </div>

                        <span className="rk-leader-role-title">
                          {leader.role}
                        </span>
                        <span className="rk-leader-card-name">
                          {leader.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Next Speech Button & Profile Link */}
            <div className="rk-sambutan-actions-bar">
              <button
                type="button"
                className="rk-sambutan-btn-next"
                onClick={() => setActiveLeaderId(activeLeader.nextId)}
              >
                <span>{activeLeader.nextButtonText}</span>
                <span aria-hidden="true">→</span>
              </button>

              <Link to="/about" className="rk-sambutan-btn-profile">
                <span>Lihat profil pengurus</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. RUANG UNTUK BERTUMBUH (5 LAYANAN UTAMA) */}
      <section className="rk-section">
        <Container>
          <div className="rk-inline-section-head">
            <h2>{sectionsMeta.services?.title || 'Ruang untuk bertumbuh.'}</h2>
            <span className="rk-inline-section-sep" aria-hidden="true" />
            <p>
              {sectionsMeta.services?.description ||
                'Kegiatan, literasi, dan layanan utama untuk mendukung langkah kebaikanmu di ROKABA.'}
            </p>
          </div>

          <div className="rk-discover-grid">
            {DISCOVER_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <SoftCard
                  key={card.to}
                  as={Link}
                  to={card.to}
                  interactive
                  className="rk-service-card"
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span className="rk-service-icon-badge" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <div style={{ display: 'grid', gap: '4px', minWidth: 0 }}>
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </div>
                  </div>

                  <span className="rk-card-link-right">
                    <span>Jelajahi</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </SoftCard>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. TENTANG KAMI (2-COLUMN EDITORIAL SPLIT WITH PHOTO) */}
      <section className="rk-section">
        <Container>
          <SoftCard style={{ padding: 'clamp(20px, 2.8vw, 32px)' }}>
            <div className="rk-split-55-45" style={{ alignItems: 'center' }}>
              <div>
                <div className="rk-eyebrow" style={{ marginBottom: 0 }}>
                  <span className="rk-eyebrow-bar" aria-hidden="true" />
                  <span>{aboutData.tag || 'TENTANG KAMI'} • EST. 2017</span>
                </div>

                <h2
                  style={{
                    fontSize: 'clamp(1.4rem, 2.2vw, 1.85rem)',
                    marginTop: '8px',
                  }}
                >
                  {aboutData.title}
                </h2>

                <p style={{ fontSize: '0.92rem', lineHeight: 1.62, marginTop: '10px' }}>
                  {aboutData.lead}
                </p>

                <p style={{ fontSize: '0.9rem', lineHeight: 1.62, marginTop: '8px' }}>
                  {aboutData.paragraph1}
                </p>

                <div
                  className="rk-grid-2"
                  style={{ marginTop: '16px', gap: '12px' }}
                >
                  <div className="rk-inset-panel" style={{ padding: '12px 14px' }}>
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '0.88rem',
                        color: 'var(--rk-ink)',
                      }}
                    >
                      {aboutData.point1Title || 'Sinergi Lintas Sekolah'}
                    </strong>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        color: 'var(--rk-muted)',
                        marginTop: '3px',
                      }}
                    >
                      {aboutData.point1Desc ||
                        'Menghubungkan ROHIS SMA, SMK, dan MA di Kabupaten Banyumas.'}
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
                      {aboutData.point2Title || 'Kaderisasi Berjenjang'}
                    </strong>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        color: 'var(--rk-muted)',
                        marginTop: '3px',
                      }}
                    >
                      {aboutData.point2Desc ||
                        'Mencetak generasi muda berakhlak mulia dan siap memimpin.'}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <Link to="/about" className="rk-link-inline">
                    <span>Selengkapnya tentang ROKABA</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                <PhotoFrame
                  src={aboutData.photoUrl || ROKABA_REAL_PHOTOS[1]}
                  alt="Kegiatan pengurus dan kader ROKABA"
                  aspect="16/10"
                  captionTitle="Silaturahmi & Pembinaan Pelajar"
                  captionSub="Wadah kolaborasi ROHIS SMA, SMK, dan MA se-Kabupaten Banyumas"
                />

                {aboutData.quoteText && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'stretch',
                      gap: '12px',
                      paddingTop: '4px',
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
                        margin: 0,
                      }}
                    >
                      {aboutData.quoteText}{' '}
                      <strong style={{ fontStyle: 'normal' }}>
                        {aboutData.quoteAuthor}
                      </strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </SoftCard>
        </Container>
      </section>

      {/* 5. KABAR DARI ROKABA & AGENDA BERSAMA */}
      <section className="rk-section">
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
                  {sectionsMeta.news?.title || 'Kabar dari ROKABA'}
                </h2>
                <Link to="/berita" className="rk-card-link">
                  <span>{sectionsMeta.news?.linkText || 'Semua berita'}</span>
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
                    <SmartImage
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
                  {sectionsMeta.events?.title || 'Agenda bersama'}
                </h2>
                <Link to="/events" className="rk-card-link">
                  <span>{sectionsMeta.events?.linkText || 'Semua agenda'}</span>
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
                      className="rk-home-event"
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

      {/* 6. AJAKAN BERGABUNG / CLOSING CTA BANNER (01-publik-beranda.png) */}
      <section className="rk-section" style={{ paddingBottom: '24px' }}>
        <Container>
          <SoftCard
            style={{
              padding: 'clamp(22px, 3vw, 34px)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <div style={{ maxWidth: '58ch', display: 'grid', gap: '6px' }}>
              <div className="rk-eyebrow" style={{ marginBottom: 0 }}>
                <span className="rk-eyebrow-bar" aria-hidden="true" />
                <span>KOLABORASI & UKHUWAH PELAJAR</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.8rem)' }}>
                {closingData.title || 'Mari bergerak bersama dalam kebaikan.'}
              </h2>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.58 }}>
                {closingData.description ||
                  'Terbuka untuk kolaborasi kegiatan ROHIS antar sekolah, delegasi kader, maupun ruang konsultasi pelajar Muslim se-Kabupaten Banyumas.'}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <PrimaryButton
                as={Link}
                to={closingData.btnPrimaryLink || '/contact'}
              >
                <span>{closingData.btnPrimaryText || 'Hubungi kami'}</span>
                <span aria-hidden="true">→</span>
              </PrimaryButton>
              <SecondaryButton
                as={Link}
                to={closingData.btnSecondaryLink || '/consultation'}
              >
                <span>{closingData.btnSecondaryText || 'Ruang konsultasi'}</span>
              </SecondaryButton>
            </div>
          </SoftCard>
        </Container>
      </section>
    </div>
  );
}
