import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, SoftCard } from '../components/ui/SoftUI';

const TOC_ITEMS = [
  { id: 'memulai', label: 'Memulai' },
  { id: 'menjaga-kebiasaan', label: 'Menjaga kebiasaan' },
  { id: 'refleksi', label: 'Refleksi' },
];

export default function ArticleDetail() {
  const { slug } = useParams();
  const [activeSection, setActiveSection] = useState('memulai');

  const isMenjaga =
    slug === 'menjaga-semangat-belajar-sebagai-pelajar-muslim';
  const isPeran = slug === 'peran-pelajar-dalam-lingkungan-sekitar';

  const displayTitle = isMenjaga
    ? 'Menjaga semangat belajar sebagai pelajar Muslim'
    : isPeran
    ? 'Peran pelajar dalam lingkungan sekitar'
    : 'Bertumbuh melalui kebiasaan baik';

  return (
    <div className="rk-page">
      <section className="rk-section" style={{ paddingTop: '14px' }}>
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="rk-breadcrumb">
            <Link to="/">Beranda</Link>
            <span aria-hidden="true">/</span>
            <Link to="/articles">Artikel</Link>
          </nav>

          {/* Category */}
          <div
            style={{
              fontSize: '0.88rem',
              fontWeight: 700,
              color: 'var(--rk-brass-text)',
              marginBottom: '6px',
            }}
          >
            Refleksi pelajar
          </div>

          <div className="rk-article-layout">
            {/* Left Column: Article Content */}
            <div>
              <h1
                className="rk-page-title"
                style={{
                  fontSize: 'clamp(1.85rem, 3.1vw, 2.55rem)',
                  maxWidth: '22ch',
                  marginBottom: '16px',
                }}
              >
                {displayTitle}
              </h1>

              <div
                id="memulai"
                style={{
                  display: 'grid',
                  gap: '14px',
                  fontSize: '0.96rem',
                  lineHeight: 1.65,
                  color: 'var(--rk-ink)',
                }}
              >
                <p style={{ color: 'var(--rk-ink)' }}>
                  Kebiasaan baik adalah langkah kecil yang dilakukan secara
                  konsisten dan membawa perubahan besar dalam diri. Sebagai
                  pelajar, kita dapat memulainya dari hal-hal sederhana seperti
                  disiplin waktu, menjaga ucapan, dan memperbanyak ilmu yang
                  bermanfaat.
                </p>

                <p id="menjaga-kebiasaan" style={{ color: 'var(--rk-ink)' }}>
                  Kebiasaan baik juga membantu kita lebih terarah dalam belajar,
                  berorganisasi, dan berinteraksi dengan sesama. Dengan
                  membiasakan hal-hal positif, kita sedang melatih diri untuk
                  menjadi pribadi yang lebih baik dan bermanfaat.
                </p>
              </div>

              {/* Quote Card with Vertical Brass Bar */}
              <SoftCard
                id="refleksi"
                style={{
                  marginTop: '18px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: '14px',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '3.5px',
                    borderRadius: '99px',
                    background: 'var(--rk-brass)',
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    lineHeight: 1.55,
                    color: 'var(--rk-ink)',
                  }}
                >
                  “Perubahan besar sering kali berawal dari kebiasaan kecil yang
                  dijaga dengan konsisten.”
                </p>
              </SoftCard>
            </div>

            {/* Right Column: Daftar isi */}
            <SoftCard style={{ padding: '18px 20px' }}>
              <strong
                style={{
                  display: 'block',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  color: 'var(--rk-ink)',
                }}
              >
                Daftar isi
              </strong>

              <ul className="rk-toc-list">
                {TOC_ITEMS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={activeSection === item.id ? 'is-active' : ''}
                      onClick={() => setActiveSection(item.id)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </SoftCard>
          </div>
        </Container>
      </section>
    </div>
  );
}
