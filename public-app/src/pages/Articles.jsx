import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Container } from '../components/ui/SoftUI';

const CATEGORIES = ['Semua', 'Refleksi', 'Pelajar'];

const REFERENCE_ARTICLES = [
  {
    slug: 'bertumbuh-melalui-kebiasaan-baik',
    title: 'Bertumbuh melalui kebiasaan baik',
    excerpt:
      'Refleksi sederhana tentang membangun kebiasaan positif dalam keseharian.',
    category: 'Refleksi',
  },
  {
    slug: 'menjaga-semangat-belajar-sebagai-pelajar-muslim',
    title: 'Menjaga semangat belajar sebagai pelajar Muslim',
    excerpt:
      'Panduan singkat agar tetap semangat dan produktif dalam menuntut ilmu.',
    category: 'Pelajar',
  },
  {
    slug: 'peran-pelajar-dalam-lingkungan-sekitar',
    title: 'Peran pelajar dalam lingkungan sekitar',
    excerpt:
      'Gagasan sederhana untuk memberi dampak positif di sekitar kita.',
    category: 'Pelajar',
  },
];

export default function Articles() {
  const { articles } = useData();
  const [activeCat, setActiveCat] = useState('Semua');
  const [query, setQuery] = useState('');

  const cmsArticles = Array.isArray(articles) ? articles : [];

  const filteredArticles = useMemo(() => {
    const combined = [...REFERENCE_ARTICLES];
    cmsArticles.forEach((item) => {
      if (
        item?.title &&
        !combined.some(
          (a) => a.slug === item.slug || a.title === item.title
        )
      ) {
        combined.push({
          slug: item.slug || String(item.id),
          title: item.title,
          excerpt:
            item.excerpt ||
            'Catatan dan refleksi keislaman bagi pelajar Muslim Banyumas.',
          category: /refleksi|akhlak|hati/i.test(
            `${item.category || ''} ${item.title || ''}`
          )
            ? 'Refleksi'
            : 'Pelajar',
        });
      }
    });

    return combined.filter((item) => {
      const matchCat =
        activeCat === 'Semua' ||
        item.category.toLowerCase() === activeCat.toLowerCase();
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [cmsArticles, activeCat, query]);

  return (
    <div className="rk-page">
      {/* 1. HEADER */}
      <section className="rk-page-header">
        <Container>
          <div className="rk-eyebrow">
            <span className="rk-eyebrow-bar" aria-hidden="true" />
            <span>Artikel ROKABA</span>
          </div>

          <h1 className="rk-page-title">Bacaan untuk bertumbuh</h1>
        </Container>
      </section>

      {/* 2. FILTER BAR + STACKED 3D ARTICLE CARDS */}
      <section className="rk-section" style={{ paddingTop: '8px' }}>
        <Container>
          <div className="rk-filter-bar">
            <div
              className="rk-filter-pills"
              role="group"
              aria-label="Filter kategori artikel"
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
                placeholder="Cari artikel"
                aria-label="Cari artikel"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gap: '14px' }}>
            {filteredArticles
              .slice(0, query.trim() ? 12 : 3)
              .map((item) => (
                <Link
                  key={item.slug}
                  to={`/articles/${item.slug}`}
                  className="rk-bar-card"
                  style={{ padding: '18px 24px' }}
                >
                  <div style={{ display: 'grid', gap: '4px' }}>
                    <h2 style={{ fontSize: '1.14rem', fontWeight: 800 }}>
                      {item.title}
                    </h2>
                    <p style={{ fontSize: '0.88rem', color: 'var(--rk-muted)' }}>
                      {item.excerpt}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    style={{ fontSize: '1.05rem', fontWeight: 700 }}
                  >
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
