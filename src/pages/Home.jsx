import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Container,
  PhotoFrame,
  PrimaryButton,
  ROKABA_REAL_PHOTOS,
  SoftCard,
} from '../components/ui/SoftUI';

const DISCOVER_CARDS = [
  {
    title: 'Program & kegiatan',
    description:
      'Beragam kegiatan pembinaan untuk mengembangkan ilmu, akhlak, dan kepemimpinan.',
    to: '/programs',
  },
  {
    title: 'Sekolah anggota',
    description:
      'Wadah kolaborasi ROHIS dari berbagai SMA, SMK, dan MA di Banyumas.',
    to: '/schools',
  },
  {
    title: 'Perpustakaan',
    description:
      'Koleksi bacaan Islami pilihan untuk menambah wawasan dan inspirasi.',
    to: '/library',
  },
];

export default function Home() {
  const featuredSlug = 'merawat-ukhuwah-lintas-sekolah';

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

              <p className="rk-hero-lead">
                Ruang bertumbuh bagi pelajar Muslim untuk belajar, berkarya, dan
                memberi manfaat bersama.
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
                Terhubung lintas SMA, SMK, dan MA di Banyumas.
              </p>
            </div>

            <div>
              <PhotoFrame
                src={ROKABA_REAL_PHOTOS[0]}
                alt="Kebersamaan kader ROHIS Kabupaten Banyumas"
                aspect="16/9.2"
                captionTitle="Kebersamaan kader ROHIS Banyumas"
                captionSub="Dokumentasi ROKABA"
                eager
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. TEMUKAN RUANGMU */}
      <section className="rk-section">
        <Container>
          <div className="rk-inline-section-head">
            <h2>Temukan ruangmu.</h2>
            <span className="rk-inline-section-sep" aria-hidden="true" />
            <p>
              Berbagai layanan dan kegiatan untuk mendukung langkah kebaikanmu di
              ROKABA.
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
                <div style={{ display: 'grid', gap: '8px' }}>
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

      {/* 3. KABAR DARI ROKABA & AGENDA BERSAMA */}
      <section className="rk-section" style={{ paddingBottom: '12px' }}>
        <Container>
          <div className="rk-split-55-45">
            {/* Left: Kabar dari ROKABA */}
            <div>
              <h2
                style={{
                  fontSize: 'clamp(1.45rem, 2.2vw, 1.85rem)',
                  marginBottom: '16px',
                }}
              >
                Kabar dari ROKABA
              </h2>

              <div className="rk-home-news-row">
                <Link
                  to={`/berita/${featuredSlug}`}
                  aria-label="Merawat ukhuwah lintas sekolah"
                >
                  <PhotoFrame
                    src={ROKABA_REAL_PHOTOS[0]}
                    alt="Merawat ukhuwah lintas sekolah"
                    aspect="16/9.6"
                  />
                </Link>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: 'var(--rk-brass-text)',
                    }}
                  >
                    Kegiatan organisasi
                  </span>

                  <h3
                    style={{
                      fontSize: 'clamp(1.25rem, 1.85vw, 1.55rem)',
                      lineHeight: 1.18,
                    }}
                  >
                    <Link to={`/berita/${featuredSlug}`}>
                      Merawat ukhuwah lintas sekolah
                    </Link>
                  </h3>

                  <div style={{ marginTop: '4px' }}>
                    <Link to={`/berita/${featuredSlug}`} className="rk-link-inline">
                      <span>Baca selengkapnya</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Agenda bersama */}
            <SoftCard
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 'clamp(20px, 2.5vw, 28px)',
              }}
            >
              <h2
                style={{
                  fontSize: 'clamp(1.35rem, 2vw, 1.7rem)',
                  marginBottom: '16px',
                }}
              >
                Agenda bersama
              </h2>

              <div style={{ display: 'grid' }}>
                <Link
                  to="/events"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '14px 4px',
                    borderBottom: '1px solid var(--rk-line)',
                  }}
                >
                  <strong style={{ fontSize: '1.05rem', color: 'var(--rk-ink)' }}>
                    Kajian pelajar
                  </strong>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'var(--rk-muted)',
                    }}
                  >
                    <span>Informasi kegiatan</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>

                <Link
                  to="/events"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '14px 4px 6px',
                  }}
                >
                  <strong style={{ fontSize: '1.05rem', color: 'var(--rk-ink)' }}>
                    Forum silaturahmi
                  </strong>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'var(--rk-muted)',
                    }}
                  >
                    <span>Informasi kegiatan</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </div>
            </SoftCard>
          </div>
        </Container>
      </section>
    </div>
  );
}
