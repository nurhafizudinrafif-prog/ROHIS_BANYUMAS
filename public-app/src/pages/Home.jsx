import { Link } from 'react-router-dom';
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
    title: 'Perpustakaan',
    description:
      'Koleksi modul kaderisasi LKRO, panduan shalat lengkap, materi kajian, dan slide etika digital Islami.',
    to: '/library',
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

export default function Home() {
  const { home, news, events } = useData();

  const stats = Array.isArray(home?.stats) && home.stats.length > 0
    ? home.stats
    : [
        { value: 15, suffix: '+', label: 'Dari Sekolah Kab. Banyumas' },
        { value: 53, suffix: '+', label: 'Anggota & Pengurus Aktif' },
        { value: 7, suffix: '+', label: 'Event Besar Kabupaten' },
        { value: 2017, suffix: '', label: 'Tahun Berdiri di Purwokerto' },
      ];

  const sambutan = home?.sambutan || {
    tag: 'SAMBUTAN PIMPINAN',
    titleLine1: 'Sambutan Pimpinan ROKABA',
    periodText: 'PERIODE 2025/2026',
    greeting: "Assalamu'alaikum warahmatullahi wabarakatuh.",
    paragraph1:
      'Selamat datang di portal resmi ROHIS Kabupaten Banyumas (ROKABA). Website ini kami hadirkan sebagai sarana informasi, komunikasi, dan publikasi kegiatan dakwah serta pengembangan potensi pelajar se-Kabupaten Banyumas. ROKABA menjadi wadah sinergi bagi seluruh kader untuk belajar berorganisasi, memperkuat ukhuwah islamiyah, menumbuhkan jiwa kepemimpinan, dan menyebarkan syiar Islam yang rahmatan lil alamin.',
    paragraph2:
      'Kami berharap kehadiran media digital ini mampu menjadi inspirasi yang mendorong partisipasi aktif seluruh pelajar dalam setiap program kebaikan. Mari bersama-sama berikhtiar merawat dakwah sekolah, mengokohkan karakter generasi muda, dan mengharumkan nama Kabupaten Banyumas dengan prestasi dan akhlak mulia.',
    closingGreeting: "Wassalamu'alaikum warahmatullahi wabarakatuh.",
  };

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

      {/* 2. TEMUKAN RUANGMU (6 LAYANAN & DIREKTORI LENGKAP) */}
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

      {/* 3. SAMBUTAN PIMPINAN & TENTANG KAMI (DARI ROHIS-BANYUMAS.WEB.ID) */}
      <section className="rk-section">
        <Container>
          <div className="rk-split-50-50" style={{ alignItems: 'stretch' }}>
            {/* Left: Sambutan Pimpinan */}
            <SoftCard
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div style={{ display: 'grid', gap: '10px' }}>
                <div className="rk-eyebrow" style={{ marginBottom: 0 }}>
                  <span className="rk-eyebrow-bar" aria-hidden="true" />
                  <span>
                    {sambutan.tag || 'SAMBUTAN PIMPINAN'} •{' '}
                    {sambutan.periodText || 'PERIODE 2025/2026'}
                  </span>
                </div>

                <h2 style={{ fontSize: 'clamp(1.35rem, 2vw, 1.7rem)' }}>
                  Sambutan Pimpinan ROKABA
                </h2>

                <p
                  style={{
                    fontWeight: 700,
                    color: 'var(--rk-ink)',
                    fontSize: '0.9rem',
                  }}
                >
                  {sambutan.greeting}
                </p>

                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {sambutan.paragraph1}
                </p>

                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {sambutan.paragraph2}
                </p>
              </div>

              <div
                className="rk-inset-panel"
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div style={{ fontSize: '0.82rem' }}>
                  <strong style={{ color: 'var(--rk-ink)', display: 'block' }}>
                    M. Rayyan Alfarabi (Ketua Umum)
                  </strong>
                  <span style={{ color: 'var(--rk-muted)' }}>
                    Bersama M. Raif Ramadhan (Ketua Ikhwan) & Neesa Azkia Shafa
                    (Ketua Akhwat)
                  </span>
                </div>

                <Link to="/about" className="rk-card-link">
                  <span>Struktur Lengkap</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </SoftCard>

            {/* Right: Bukan Sekadar Organisasi */}
            <SoftCard
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div style={{ display: 'grid', gap: '10px' }}>
                <div className="rk-eyebrow" style={{ marginBottom: 0 }}>
                  <span className="rk-eyebrow-bar" aria-hidden="true" />
                  <span>{aboutData.tag || 'TENTANG KAMI'} • EST. 2017</span>
                </div>

                <h2 style={{ fontSize: 'clamp(1.35rem, 2vw, 1.7rem)' }}>
                  {aboutData.title}
                </h2>

                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {aboutData.lead}
                </p>

                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {aboutData.paragraph1}
                </p>

                <div className="rk-grid-2" style={{ marginTop: '4px', gap: '12px' }}>
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
              </div>

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
                  }}
                >
                  {aboutData.quoteText}{' '}
                  <strong style={{ fontStyle: 'normal' }}>
                    {aboutData.quoteAuthor}
                  </strong>
                </p>
              </div>
            </SoftCard>
          </div>
        </Container>
      </section>

      {/* 4. KABAR DARI ROKABA & AGENDA BERSAMA */}
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

              <SoftCard style={{ padding: '18px' }}>
                <div className="rk-home-news-row">
                  <Link
                    to={`/berita/${featuredNews.slug}`}
                    aria-label={featuredNews.title}
                  >
                    <PhotoFrame
                      src={featuredNews.image || ROKABA_REAL_PHOTOS[0]}
                      alt={featuredNews.title}
                      aspect="16/10"
                    />
                  </Link>

                  <div style={{ display: 'grid', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--rk-brass-text)',
                      }}
                    >
                      {featuredNews.category || 'Kegiatan organisasi'} •{' '}
                      {formatIndonesianDate(featuredNews.date)}
                    </span>

                    <h3
                      style={{
                        fontSize: 'clamp(1.1rem, 1.55vw, 1.32rem)',
                        lineHeight: 1.24,
                      }}
                    >
                      <Link to={`/berita/${featuredNews.slug}`}>
                        {featuredNews.title}
                      </Link>
                    </h3>

                    <p style={{ fontSize: '0.84rem', lineHeight: 1.5 }}>
                      {featuredNews.excerpt}
                    </p>

                    <div style={{ marginTop: '4px' }}>
                      <Link
                        to={`/berita/${featuredNews.slug}`}
                        className="rk-link-inline"
                        style={{ fontSize: '0.88rem' }}
                      >
                        <span>Baca selengkapnya</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </SoftCard>

              {/* Stacked Bars for Other News */}
              {otherNews.map((item) => (
                <Link
                  key={item.id || item.slug}
                  to={`/berita/${item.slug}`}
                  className="rk-bar-card"
                  style={{ padding: '13px 18px' }}
                >
                  <div style={{ display: 'grid', gap: '2px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--rk-brass-text)',
                      }}
                    >
                      {item.category} • {item.location || formatIndonesianDate(item.date)}
                    </span>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--rk-ink)' }}>
                      {item.title}
                    </strong>
                  </div>
                  <span aria-hidden="true" style={{ fontWeight: 700 }}>
                    →
                  </span>
                </Link>
              ))}
            </div>

            {/* Right: Agenda bersama */}
            <SoftCard
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 'clamp(20px, 2.5vw, 26px)',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '14px',
                  }}
                >
                  <h2 style={{ fontSize: 'clamp(1.35rem, 2vw, 1.7rem)' }}>
                    Agenda bersama
                  </h2>
                  <Link to="/events" className="rk-card-link">
                    <span>Semua agenda</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                  {eventList.map((ev) => {
                    const dm = formatShortDayMonth(ev.date);
                    return (
                      <Link
                        key={ev.id}
                        to="/events"
                        className="rk-inset-panel"
                        style={{
                          padding: '12px 14px',
                          borderRadius: '14px',
                          display: 'grid',
                          gridTemplateColumns: '48px minmax(0, 1fr) auto',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div
                          className="rk-event-date-box"
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '11px',
                          }}
                        >
                          <span style={{ fontSize: '0.88rem', lineHeight: 1.05 }}>
                            {dm.day}
                          </span>
                          <span style={{ fontSize: '0.64rem', opacity: 0.8 }}>
                            {dm.month}
                          </span>
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <strong
                            style={{
                              display: 'block',
                              fontSize: '0.9rem',
                              color: 'var(--rk-ink)',
                              lineHeight: 1.28,
                            }}
                          >
                            {ev.title}
                          </strong>
                          <span
                            style={{
                              display: 'block',
                              fontSize: '0.78rem',
                              color: 'var(--rk-muted)',
                              marginTop: '2px',
                            }}
                          >
                            {ev.location} • {ev.time}
                          </span>
                        </div>

                        <span aria-hidden="true" style={{ fontWeight: 700 }}>
                          →
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </SoftCard>
          </div>
        </Container>
      </section>
    </div>
  );
}
