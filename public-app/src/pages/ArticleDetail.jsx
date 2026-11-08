import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Container,
  SoftCard,
  formatIndonesianDate,
} from '../components/ui/SoftUI';

const TOC_ITEMS = [
  { id: 'memulai', label: 'Pengantar' },
  { id: 'menjaga-kebiasaan', label: 'Pembahasan Utama' },
  { id: 'refleksi', label: 'Refleksi & Hikmah' },
];

const FALLBACK_ARTICLE = {
  title: 'Bertumbuh melalui kebiasaan baik',
  category: 'Refleksi pelajar',
  author: 'Tim Dakwah ROHIS',
  date: '2026-09-01',
  content:
    'Kebiasaan baik adalah langkah kecil yang dilakukan secara konsisten dan membawa perubahan besar dalam diri. Sebagai pelajar, kita dapat memulainya dari hal-hal sederhana seperti disiplin waktu, menjaga ucapan, dan memperbanyak ilmu yang bermanfaat.\n\nKebiasaan baik juga membantu kita lebih terarah dalam belajar, berorganisasi, dan berinteraksi dengan sesama. Dengan membiasakan hal-hal positif, kita sedang melatih diri untuk menjadi pribadi yang lebih baik dan bermanfaat.',
};

export default function ArticleDetail() {
  const { slug } = useParams();
  const { articles } = useData();
  const [activeSection, setActiveSection] = useState('memulai');

  const cmsArticles = Array.isArray(articles) ? articles : [];
  const matched =
    cmsArticles.find(
      (item) => item.slug === slug || String(item.id) === slug
    ) ||
    (slug === 'bertumbuh-melalui-kebiasaan-baik'
      ? FALLBACK_ARTICLE
      : cmsArticles[0] || FALLBACK_ARTICLE);

  const paragraphs = String(matched.content || matched.excerpt || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const otherArticles = cmsArticles
    .filter((a) => a.slug !== matched.slug)
    .slice(0, 3);

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

          {/* Category & Author */}
          <div
            style={{
              fontSize: '0.86rem',
              fontWeight: 700,
              color: 'var(--rk-brass-text)',
              marginBottom: '6px',
            }}
          >
            {matched.category || 'Refleksi pelajar'}
            {matched.author ? ` • Oleh ${matched.author}` : ''}
            {matched.date ? ` • ${formatIndonesianDate(matched.date)}` : ''}
          </div>

          <div className="rk-article-layout">
            {/* Left Column: Full Article Content */}
            <div>
              <h1
                className="rk-page-title"
                style={{
                  fontSize: 'clamp(1.85rem, 3.1vw, 2.5rem)',
                  marginBottom: '16px',
                }}
              >
                {matched.title}
              </h1>

              <SoftCard
                id="memulai"
                style={{
                  display: 'grid',
                  gap: '14px',
                  fontSize: '0.96rem',
                  lineHeight: 1.68,
                  color: 'var(--rk-ink)',
                }}
              >
                {paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    id={idx === 1 ? 'menjaga-kebiasaan' : undefined}
                    style={{ color: 'var(--rk-ink)', whiteSpace: 'pre-line' }}
                  >
                    {para.replace(/\*\*/g, '')}
                  </p>
                ))}
              </SoftCard>

              {/* Quote Card with Vertical Brass Bar */}
              <SoftCard
                id="refleksi"
                style={{
                  marginTop: '16px',
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

            {/* Right Column: Daftar Isi & Artikel Lainnya */}
            <div style={{ display: 'grid', gap: '16px' }}>
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

              {otherArticles.length > 0 && (
                <SoftCard style={{ padding: '18px 20px' }}>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '0.94rem',
                      fontWeight: 800,
                      color: 'var(--rk-ink)',
                      marginBottom: '10px',
                    }}
                  >
                    Artikel lainnya
                  </strong>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {otherArticles.map((art) => (
                      <Link
                        key={art.slug}
                        to={`/articles/${art.slug}`}
                        className="rk-inset-panel"
                        style={{
                          padding: '10px 12px',
                          borderRadius: '11px',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          color: 'var(--rk-ink)',
                        }}
                      >
                        {art.title}
                      </Link>
                    ))}
                  </div>
                </SoftCard>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
