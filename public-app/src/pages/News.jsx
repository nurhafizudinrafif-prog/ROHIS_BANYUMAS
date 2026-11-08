import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  Container,
  PhotoFrame,
  ROKABA_REAL_PHOTOS,
  SoftCard,
} from '../components/ui/SoftUI';

const CATEGORIES = ['Semua', 'Organisasi', 'Kajian'];

const REFERENCE_NEWS_BARS = [
  {
    slug: 'kajian-pelajar-tentang-adab-menuntut-ilmu',
    title: 'Kajian pelajar tentang adab menuntut ilmu',
    category: 'Kajian',
  },
  {
    slug: 'forum-silaturahmi-pengurus-rohis-se-banyumas',
    title: 'Forum silaturahmi pengurus ROHIS se-Banyumas',
    category: 'Organisasi',
  },
];

export default function News() {
  const { news } = useData();
  const [activeCat, setActiveCat] = useState('Semua');
  const [query, setQuery] = useState('');

  const cmsNews = Array.isArray(news) ? news : [];
  const featuredSlug = 'merawat-ukhuwah-lintas-sekolah';

  const barItems = useMemo(() => {
    const combined = [...REFERENCE_NEWS_BARS];
    cmsNews.forEach((item) => {
      if (
        item?.title &&
        !combined.some(
          (b) => b.slug === item.slug || b.title === item.title
        )
      ) {
        combined.push({
          slug: item.slug || String(item.id),
          title: item.title,
          category: /kajian|ilmu|syiar/i.test(
            `${item.category || ''} ${item.title || ''}`
          )
            ? 'Kajian'
            : 'Organisasi',
        });
      }
    });

    return combined.filter((item) => {
      const matchCat =
        activeCat === 'Semua' ||
        item.category.toLowerCase() === activeCat.toLowerCase();
      const q = query.trim().toLowerCase();
      const matchQuery = !q || item.title.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [cmsNews, activeCat, query]);

  const showFeatured =
    (activeCat === 'Semua' || activeCat === 'Organisasi') &&
    (!query.trim() ||
      'merawat ukhuwah lintas sekolah'.includes(query.trim().toLowerCase()));

  return (
    <div className="rk-page">
      {/* 1. HEADER */}
      <section className="rk-page-header">
        <Container>
          <div className="rk-eyebrow">
            <span className="rk-eyebrow-bar" aria-hidden="true" />
            <span>Berita ROKABA</span>
          </div>

          <h1 className="rk-page-title">Kabar dari ROKABA</h1>
        </Container>
      </section>

      {/* 2. FILTER BAR + FEATURED CARD + COMPACT BARS */}
      <section className="rk-section" style={{ paddingTop: '8px' }}>
        <Container>
          <div className="rk-filter-bar">
            <div
              className="rk-filter-pills"
              role="group"
              aria-label="Filter kategori berita"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className="rk-pill"
                  aria-pressed={activeCat === cat}
                  onClick={() => setActiveCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="rk-search-well" style={{ width: 'min(100%, 260px)' }}>
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                className="rk-inset-control"
                placeholder="Cari berita"
                aria-label="Cari berita"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Featured News Card */}
          {showFeatured && (
            <SoftCard style={{ padding: 'clamp(16px, 2vw, 22px)' }}>
              <div className="rk-home-news-row">
                <Link
                  to={`/berita/${featuredSlug}`}
                  aria-label="Merawat ukhuwah lintas sekolah"
                >
                  <PhotoFrame
                    src={ROKABA_REAL_PHOTOS[0]}
                    alt="Merawat ukhuwah lintas sekolah"
                    aspect="16/9.4"
                    eager
                  />
                </Link>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: 'var(--rk-brass-text)',
                    }}
                  >
                    Kegiatan organisasi
                  </span>

                  <h2
                    style={{
                      fontSize: 'clamp(1.4rem, 2.2vw, 1.85rem)',
                      lineHeight: 1.15,
                    }}
                  >
                    <Link to={`/berita/${featuredSlug}`}>
                      Merawat ukhuwah lintas sekolah
                    </Link>
                  </h2>

                  <div style={{ marginTop: '4px' }}>
                    <Link
                      to={`/berita/${featuredSlug}`}
                      className="rk-link-inline"
                    >
                      <span>Baca selengkapnya</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </SoftCard>
          )}

          {/* Stacked 3D Horizontal Bars */}
          <div style={{ marginTop: '14px', display: 'grid', gap: '12px' }}>
            {barItems.slice(0, query.trim() ? 10 : 2).map((item) => (
              <Link
                key={item.slug}
                to={`/berita/${item.slug}`}
                className="rk-bar-card"
              >
                <strong style={{ fontSize: '0.98rem', color: 'var(--rk-ink)' }}>
                  {item.title}
                </strong>
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
