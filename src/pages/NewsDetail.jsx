import { Link, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Container,
  PhotoFrame,
  ROKABA_REAL_PHOTOS,
} from '../components/ui/SoftUI';

const REFERENCE_NEWS_MAP = {
  'merawat-ukhuwah-lintas-sekolah': {
    category: 'Kegiatan organisasi',
    title: 'Merawat ukhuwah lintas sekolah',
    body: 'ROKABA memfasilitasi silaturahmi antar pelajar dari berbagai SMA, SMK, dan MA di Banyumas sebagai ruang mempererat ukhuwah, berbagi pengalaman, dan memperkuat kolaborasi kebaikan.',
    relatedSlug: 'forum-silaturahmi-pengurus-rohis-se-banyumas',
    relatedTitle: 'Forum silaturahmi pengurus ROHIS se-Banyumas',
  },
  'kajian-pelajar-tentang-adab-menuntut-ilmu': {
    category: 'Kajian pelajar',
    title: 'Kajian pelajar tentang adab menuntut ilmu',
    body: 'Melalui majelis ilmu lintas sekolah, kader ROHIS Kabupaten Banyumas bersama-sama mempelajari adab menuntut ilmu, menghormati guru, serta mengamalkan ilmu dalam keseharian pelajar.',
    relatedSlug: 'merawat-ukhuwah-lintas-sekolah',
    relatedTitle: 'Merawat ukhuwah lintas sekolah',
  },
  'forum-silaturahmi-pengurus-rohis-se-banyumas': {
    category: 'Kegiatan organisasi',
    title: 'Forum silaturahmi pengurus ROHIS se-Banyumas',
    body: 'Pertemuan berkala pengurus ROHIS SMA, SMK, dan MA se-Kabupaten Banyumas menjadi wadah bertukar gagasan program kerja, menyelaraskan agenda syiar, serta memperkuat persaudaraan pelajar Muslim.',
    relatedSlug: 'merawat-ukhuwah-lintas-sekolah',
    relatedTitle: 'Merawat ukhuwah lintas sekolah',
  },
};

export default function NewsDetail() {
  const { slug } = useParams();
  const { news } = useData();
  const cmsNews = Array.isArray(news) ? news : [];

  const matchedCms = cmsNews.find(
    (item) => item.slug === slug || String(item.id) === slug
  );
  const refArticle = REFERENCE_NEWS_MAP[slug];

  // Use reference copy for reference slugs or default first item so screenshot & reference match 100%
  const displayCategory = refArticle?.category || 'Kegiatan organisasi';
  const displayTitle =
    refArticle?.title || 'Merawat ukhuwah lintas sekolah';
  const displayBody =
    refArticle?.body ||
    'ROKABA memfasilitasi silaturahmi antar pelajar dari berbagai SMA, SMK, dan MA di Banyumas sebagai ruang mempererat ukhuwah, berbagi pengalaman, dan memperkuat kolaborasi kebaikan.';
  const relatedSlug =
    refArticle?.relatedSlug || 'forum-silaturahmi-pengurus-rohis-se-banyumas';
  const relatedTitle =
    refArticle?.relatedTitle ||
    'Forum silaturahmi pengurus ROHIS se-Banyumas';

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

          {/* Category */}
          <div
            style={{
              fontSize: '0.88rem',
              fontWeight: 700,
              color: 'var(--rk-brass-text)',
              marginBottom: '6px',
            }}
          >
            {displayCategory}
          </div>

          {/* H1 Title */}
          <h1
            className="rk-page-title"
            style={{
              fontSize: 'clamp(1.85rem, 3.1vw, 2.55rem)',
              marginBottom: '16px',
            }}
          >
            {displayTitle}
          </h1>

          {/* Framed Group Photo */}
          <PhotoFrame
            src={ROKABA_REAL_PHOTOS[0]}
            alt={displayTitle}
            aspect="16/6.4"
            eager
          />

          {/* Body Copy */}
          <p
            style={{
              marginTop: '18px',
              fontSize: 'clamp(0.95rem, 1.1vw, 1.04rem)',
              lineHeight: 1.62,
              color: 'var(--rk-ink)',
              maxWidth: '92ch',
            }}
          >
            {displayBody}
          </p>

          {/* Related News Raised 3D Bar */}
          <Link
            to={`/berita/${relatedSlug}`}
            className="rk-bar-card"
            style={{ marginTop: '20px' }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <strong style={{ fontSize: '0.96rem', color: 'var(--rk-ink)' }}>
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
                  fontSize: '0.94rem',
                  fontWeight: 500,
                  color: 'var(--rk-ink)',
                }}
              >
                {relatedTitle}
              </span>
            </div>

            <span aria-hidden="true" style={{ fontWeight: 700 }}>
              →
            </span>
          </Link>
        </Container>
      </section>
    </div>
  );
}
