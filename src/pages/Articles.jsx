import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Container,
  PageHeader,
  SoftCard,
  FilterBar,
  InsetField,
  SmartImage,
  EmptyState,
  ROKABA_REAL_PHOTOS,
  formatIndonesianDate,
} from '../components/ui/SoftUI';

export default function Articles() {
  const { articles = [] } = useData();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) =>
      String(b.date || '').localeCompare(String(a.date || ''))
    );
  }, [articles]);

  const categories = useMemo(() => {
    const base = ['Semua', 'Aqidah & Akhlak', 'Kepemimpinan', 'Keseharian Pelajar'];
    const set = new Set(base);
    sortedArticles.forEach((art) => {
      if (art.category) set.add(art.category);
    });
    return Array.from(set);
  }, [sortedArticles]);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sortedArticles.filter((art) => {
      const cat = String(art.category || '').toLowerCase();
      const activeLower = activeCategory.toLowerCase();
      const matchesCategory =
        activeCategory === 'Semua' ||
        cat === activeLower ||
        (activeLower === 'aqidah & akhlak' &&
          (cat.includes('aqidah') || cat.includes('akhlak') || cat.includes('ibadah'))) ||
        (activeLower === 'keseharian pelajar' &&
          (cat.includes('pelajar') ||
            cat.includes('produktivitas') ||
            cat.includes('motivasi') ||
            cat.includes('sosial')));

      const matchesSearch =
        !q ||
        String(art.title || '').toLowerCase().includes(q) ||
        String(art.excerpt || '').toLowerCase().includes(q) ||
        String(art.author || '').toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [sortedArticles, activeCategory, searchQuery]);

  return (
    <div className="rk-page">
      <PageHeader
        breadcrumb={[{ label: 'Beranda', to: '/' }, { label: 'Artikel' }]}
        title="Bacaan untuk bertumbuh"
        lead="Kumpulan catatan keislaman, kepemimpinan, dan refleksi keseharian untuk menemani perjalanan belajar pelajar."
      />

      <section className="rk-section" aria-label="Daftar artikel pelajar">
        <Container>
          <FilterBar
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchNode={
              <InsetField
                id="rk-article-search"
                type="search"
                aria-label="Cari artikel"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            }
          />

          {filteredArticles.length === 0 ? (
            <EmptyState
              title="Artikel belum ditemukan"
              description="Coba gunakan kata kunci lain atau pilih kategori Semua untuk melihat seluruh bacaan."
              action={
                <button
                  type="button"
                  className="rk-btn-secondary"
                  onClick={() => {
                    setActiveCategory('Semua');
                    setSearchQuery('');
                  }}
                >
                  Tampilkan semua artikel
                </button>
              }
            />
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {filteredArticles.map((art, idx) => (
                <SoftCard key={art.id} as="article" interactive className="rk-editorial-row">
                  <Link
                    to={`/articles/${art.slug || art.id}`}
                    className="rk-editorial-thumb"
                  >
                    <SmartImage
                      src={
                        art.image ||
                        art.coverImage ||
                        ROKABA_REAL_PHOTOS[idx % ROKABA_REAL_PHOTOS.length]
                      }
                      alt={art.title}
                    />
                  </Link>

                  <div className="rk-editorial-body">
                    <div className="rk-meta-line">
                      <span>{art.category || 'Refleksi'}</span>
                      <span>•</span>
                      <span>{formatIndonesianDate(art.date)}</span>
                      {art.readingTime && (
                        <>
                          <span>•</span>
                          <span>{art.readingTime} baca</span>
                        </>
                      )}
                    </div>

                    <h3>
                      <Link
                        to={`/articles/${art.slug || art.id}`}
                        style={{ color: 'inherit' }}
                      >
                        {art.title}
                      </Link>
                    </h3>

                    <p>{art.excerpt}</p>
                  </div>

                  <Link
                    to={`/articles/${art.slug || art.id}`}
                    className="rk-editorial-arrow"
                    aria-label={`Baca artikel ${art.title}`}
                  >
                    →
                  </Link>
                </SoftCard>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
