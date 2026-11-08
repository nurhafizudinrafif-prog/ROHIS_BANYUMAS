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

export default function News() {
  const { news = [] } = useData();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Urutkan sesuai order (jika ada) lalu tanggal terbaru
  const sortedNews = useMemo(() => {
    return [...news].sort((a, b) => {
      const orderA = Number.isFinite(Number(a.order)) ? Number(a.order) : 999;
      const orderB = Number.isFinite(Number(b.order)) ? Number(b.order) : 999;
      if (orderA !== orderB) return orderA - orderB;
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
  }, [news]);

  const categories = useMemo(() => {
    const unique = new Set(['Semua']);
    sortedNews.forEach((item) => {
      if (item.category) unique.add(item.category);
    });
    return Array.from(unique);
  }, [sortedNews]);

  const filteredNews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sortedNews.filter((item) => {
      const matchesCat =
        activeCategory === 'Semua' ||
        String(item.category || '').toLowerCase() === activeCategory.toLowerCase();
      const matchesQuery =
        !q ||
        String(item.title || '').toLowerCase().includes(q) ||
        String(item.excerpt || '').toLowerCase().includes(q) ||
        String(item.content || '').toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [sortedNews, activeCategory, searchQuery]);

  const featuredItem = filteredNews[0] || null;
  const listItems = filteredNews.slice(1);

  return (
    <div className="rk-page">
      <PageHeader
        breadcrumb={[{ label: 'Beranda', to: '/' }, { label: 'Berita' }]}
        title="Kabar dari ROKABA"
        lead="Ikuti kegiatan, kolaborasi, dan catatan perjalanan ROHIS SMA, SMK, dan MA se-Kabupaten Banyumas."
      />

      <section className="rk-section" aria-label="Arsip berita ROKABA">
        <Container>
          <FilterBar
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchNode={
              <InsetField
                id="rk-news-search"
                type="search"
                aria-label="Cari berita"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            }
          />

          {filteredNews.length === 0 ? (
            <EmptyState
              title="Berita tidak ditemukan"
              description="Belum ada berita yang cocok dengan kata kunci atau kategori yang dipilih."
              action={
                <button
                  type="button"
                  className="rk-btn-secondary"
                  onClick={() => {
                    setActiveCategory('Semua');
                    setSearchQuery('');
                  }}
                >
                  Tampilkan semua berita
                </button>
              }
            />
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Berita Utama */}
              {featuredItem && (
                <SoftCard as="article" style={{ padding: 'clamp(20px, 3vw, 28px)' }}>
                  <div className="rk-split-50-50" style={{ alignItems: 'center' }}>
                    <Link
                      to={`/berita/${featuredItem.slug || featuredItem.id}`}
                      className="rk-news-feature-thumb"
                      style={{ display: 'block', margin: 0 }}
                    >
                      <SmartImage
                        src={featuredItem.image || ROKABA_REAL_PHOTOS[0]}
                        alt={featuredItem.title}
                        eager
                      />
                    </Link>

                    <div>
                      <div className="rk-meta-line">
                        <span className="rk-badge rk-badge--brass">
                          {featuredItem.category || 'Kegiatan'}
                        </span>
                        <span>•</span>
                        <span>{formatIndonesianDate(featuredItem.date)}</span>
                      </div>

                      <h2
                        style={{
                          fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)',
                          lineHeight: 1.25,
                          marginTop: '10px',
                          marginBottom: '10px',
                        }}
                      >
                        <Link
                          to={`/berita/${featuredItem.slug || featuredItem.id}`}
                          style={{ color: 'inherit' }}
                        >
                          {featuredItem.title}
                        </Link>
                      </h2>

                      <p style={{ marginBottom: '16px' }}>{featuredItem.excerpt}</p>

                      <Link
                        to={`/berita/${featuredItem.slug || featuredItem.id}`}
                        className="rk-card-link"
                      >
                        <span>Baca selengkapnya</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </SoftCard>
              )}

              {/* Daftar Berita Lainnya */}
              {listItems.map((item, idx) => (
                <SoftCard key={item.id} as="article" interactive className="rk-editorial-row">
                  <Link
                    to={`/berita/${item.slug || item.id}`}
                    className="rk-editorial-thumb"
                  >
                    <SmartImage
                      src={item.image || ROKABA_REAL_PHOTOS[(idx + 1) % ROKABA_REAL_PHOTOS.length]}
                      alt={item.title}
                    />
                  </Link>

                  <div className="rk-editorial-body">
                    <div className="rk-meta-line">
                      <span>{item.category || 'Kabar'}</span>
                      <span>•</span>
                      <span>{formatIndonesianDate(item.date)}</span>
                      {item.author && (
                        <>
                          <span>•</span>
                          <span>{item.author}</span>
                        </>
                      )}
                    </div>
                    <h3>
                      <Link
                        to={`/berita/${item.slug || item.id}`}
                        style={{ color: 'inherit' }}
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p>{item.excerpt}</p>
                  </div>

                  <Link
                    to={`/berita/${item.slug || item.id}`}
                    className="rk-editorial-arrow"
                    aria-label={`Baca berita ${item.title}`}
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
