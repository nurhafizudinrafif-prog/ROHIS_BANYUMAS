import { Link, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Container,
  PhotoFrame,
  ROKABA_REAL_PHOTOS,
  SoftCard,
  formatIndonesianDate,
} from '../components/ui/SoftUI';

const REFERENCE_NEWS_MAP = {
  'merawat-ukhuwah-lintas-sekolah': {
    category: 'Kegiatan organisasi',
    title: 'Merawat ukhuwah lintas sekolah',
    date: '2026-09-20',
    author: 'Humas ROKABA',
    location: 'Kabupaten Banyumas',
    content:
      'ROKABA memfasilitasi silaturahmi antar pelajar dari berbagai SMA, SMK, dan MA di Banyumas sebagai ruang mempererat ukhuwah, berbagi pengalaman, dan memperkuat kolaborasi kebaikan.\n\nMelalui forum komunikasi yang terkoordinasi bersama Seksi PAI Kementerian Agama Kabupaten Banyumas, para pengurus ROHIS lintas sekolah saling bertukar gagasan program kerja, menyelaraskan jadwal kajian pelajar, serta merancang agenda kolaboratif tingkat kabupaten.',
    image: ROKABA_REAL_PHOTOS[0],
  },
};

export default function NewsDetail() {
  const { slug } = useParams();
  const { news } = useData();
  const cmsNews = Array.isArray(news) ? news : [];

  const matchedCms = cmsNews.find(
    (item) => item.slug === slug || String(item.id) === slug
  );
  const article =
    matchedCms ||
    REFERENCE_NEWS_MAP[slug] ||
    cmsNews[0] ||
    REFERENCE_NEWS_MAP['merawat-ukhuwah-lintas-sekolah'];

  const paragraphs = String(article.content || article.excerpt || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const relatedNews = cmsNews
    .filter((item) => item.slug !== article.slug)
    .slice(0, 2);

  return (
    <div className="rk-page">
      <section className="rk-section" style={{ paddingTop: '14px' }}>
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="rk-breadcrumb">
            <Link to="/">Beranda</Link>
            <span aria-hidden="true">/</span>
            <Link to="/berita">Berita</Link>
          </nav>

          {/* Category & Meta */}
          <div
            style={{
              fontSize: '0.86rem',
              fontWeight: 700,
              color: 'var(--rk-brass-text)',
              marginBottom: '6px',
            }}
          >
            {article.category || 'Kegiatan organisasi'}
            {article.date ? ` • ${formatIndonesianDate(article.date)}` : ''}
            {article.location ? ` • ${article.location}` : ''}
            {article.author ? ` • Oleh ${article.author}` : ''}
          </div>

          {/* H1 Title */}
          <h1
            className="rk-page-title"
            style={{
              fontSize: 'clamp(1.75rem, 2.9vw, 2.45rem)',
              marginBottom: '16px',
            }}
          >
            {article.title}
          </h1>

          {/* Framed Group Photo */}
          <PhotoFrame
            src={article.image || ROKABA_REAL_PHOTOS[0]}
            alt={article.title}
            aspect="16/7.4"
            captionTitle={article.location || 'Dokumentasi Kegiatan ROKABA'}
            captionSub={article.author || 'ROHIS Kabupaten Banyumas'}
            eager
          />

          {/* Full Narrative Paragraphs */}
          <SoftCard style={{ marginTop: '18px', display: 'grid', gap: '12px' }}>
            {paragraphs.map((para, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: '0.96rem',
                  lineHeight: 1.68,
                  color: 'var(--rk-ink)',
                }}
              >
                {para}
              </p>
            ))}
          </SoftCard>

          {/* Related News Raised 3D Bars */}
          <div style={{ marginTop: '18px', display: 'grid', gap: '10px' }}>
            {relatedNews.map((rel) => (
              <Link
                key={rel.slug}
                to={`/berita/${rel.slug}`}
                className="rk-bar-card"
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                >
                  <strong style={{ fontSize: '0.92rem', color: 'var(--rk-ink)' }}>
                    Berita terkait
                  </strong>
                  <span
                    aria-hidden="true"
                    style={{
                      width: '1.5px',
                      height: '18px',
                      background: 'rgba(16, 41, 31, 0.18)',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: 'var(--rk-ink)',
                    }}
                  >
                    {rel.title}
                  </span>
                </div>

                <span aria-hidden="true" style={{ fontWeight: 700 }}>
                  →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
