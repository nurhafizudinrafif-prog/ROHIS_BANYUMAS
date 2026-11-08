import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Container, formatIndonesianDate } from '../components/ui/SoftUI';

const CATEGORIES = [
  'Semua',
  'Motivasi',
  'Ibadah',
  'Kepemimpinan',
  'Sosial',
  'Refleksi',
];

const REFERENCE_ARTICLES = [
  {
    id: 'ref-a1',
    slug: 'bertumbuh-melalui-kebiasaan-baik',
    title: 'Bertumbuh melalui kebiasaan baik',
    excerpt:
      'Refleksi sederhana tentang membangun kebiasaan positif dalam keseharian pelajar Muslim.',
    category: 'Refleksi',
    author: 'Tim Literasi ROKABA',
    date: '2026-09-01',
  },
];

export default function Articles() {
  const { articles } = useData();
  const [activeCat, setActiveCat] = useState('Semua');
  const [query, setQuery] = useState('');

  const filteredArticles = useMemo(() => {
    const cmsList = Array.isArray(articles) ? [...articles] : [];
    REFERENCE_ARTICLES.forEach((ref) => {
      if (!cmsList.some((a) => a.slug === ref.slug)) {
        cmsList.push(ref);
      }
    });

    return cmsList.filter((item) => {
      const matchCat =
        activeCat === 'Semua' ||
        (item.category || '').toLowerCase() === activeCat.toLowerCase();
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        (item.title || '').toLowerCase().includes(q) ||
        (item.excerpt || '').toLowerCase().includes(q) ||
        (item.author || '').toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [articles, activeCat, query]);

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
          <p className="rk-page-lead">
            Literasi dakwah moderat, motivasi ibadah, dan kepemimpinan bagi
            pelajar Muslim se-Kabupaten Banyumas.
          </p>
        </Container>
      </section>

      {/* 2. FILTER BAR + FULL ARTICLE LIST */}
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

            <div className="rk-search-well" style={{ width: 'min(100%, 280px)' }}>
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
            {filteredArticles.map((item) => (
              <Link
                key={item.id || item.slug}
                to={`/articles/${item.slug}`}
                className="rk-bar-card"
                style={{ padding: '18px 24px' }}
              >
                <div style={{ display: 'grid', gap: '5px' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--rk-brass-text)',
                    }}
                  >
                    <span>{item.category || 'Refleksi'}</span>
                    {item.author && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>{item.author}</span>
                      </>
                    )}
                    {item.date && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>{formatIndonesianDate(item.date)}</span>
                      </>
                    )}
                  </div>

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
