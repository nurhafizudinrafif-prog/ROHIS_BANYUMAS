import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  Container,
  PhotoFrame,
  ROKABA_REAL_PHOTOS,
  SoftCard,
  formatIndonesianDate,
} from '../components/ui/SoftUI';

const CATEGORIES = ['Semua', 'Organisasi', 'Kajian', 'Sosial', 'Pelatihan'];

export default function News() {
  const { news } = useData();
  const [activeCat, setActiveCat] = useState('Semua');
  const [query, setQuery] = useState('');

  const allNews = useMemo(() => {
    const cmsList = Array.isArray(news) ? [...news] : [];
    const extras = [
      {
        id: 'ref-1',
        slug: 'merawat-ukhuwah-lintas-sekolah',
        title: 'Merawat ukhuwah lintas sekolah',
        category: 'Organisasi',
        date: '2026-09-20',
        author: 'Humas ROKABA',
        location: 'Kabupaten Banyumas',
        excerpt:
          'ROKABA memfasilitasi silaturahmi antar pelajar dari berbagai SMA, SMK, dan MA di Banyumas sebagai ruang mempererat ukhuwah dan kolaborasi kebaikan.',
        image: ROKABA_REAL_PHOTOS[0],
      },
    ];

    extras.forEach((ex) => {
      if (!cmsList.some((n) => n.slug === ex.slug)) {
        cmsList.push(ex);
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
        (item.location || '').toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [news, activeCat, query]);

  const featuredItem = allNews[0] || null;
  const remainingItems = allNews.slice(1);

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
          <p className="rk-page-lead">
            Informasi, dokumentasi, dan warta kegiatan dakwah pelajar ROHIS
            SMA, SMK, dan MA se-Kabupaten Banyumas.
          </p>
        </Container>
      </section>

      {/* 2. FILTER BAR + FEATURED CARD + ALL NEWS LIST */}
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

            <div className="rk-search-well" style={{ width: 'min(100%, 280px)' }}>
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
          {featuredItem && (
            <SoftCard style={{ padding: 'clamp(16px, 2vw, 22px)' }}>
              <div className="rk-home-news-row">
                <Link
                  to={`/berita/${featuredItem.slug}`}
                  aria-label={featuredItem.title}
                >
                  <PhotoFrame
                    src={featuredItem.image || ROKABA_REAL_PHOTOS[0]}
                    alt={featuredItem.title}
                    aspect="16/9.6"
                    captionTitle={featuredItem.location || 'Kabupaten Banyumas'}
                    captionSub={formatIndonesianDate(featuredItem.date)}
                    eager
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
                    {featuredItem.category || 'Kegiatan organisasi'} •{' '}
                    {formatIndonesianDate(featuredItem.date)}
                  </span>

                  <h2
                    style={{
                      fontSize: 'clamp(1.32rem, 2vw, 1.72rem)',
                      lineHeight: 1.2,
                    }}
                  >
                    <Link to={`/berita/${featuredItem.slug}`}>
                      {featuredItem.title}
                    </Link>
                  </h2>

                  <p style={{ fontSize: '0.9rem', lineHeight: 1.55 }}>
                    {featuredItem.excerpt}
                  </p>

                  <div style={{ marginTop: '4px' }}>
                    <Link
                      to={`/berita/${featuredItem.slug}`}
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

          {/* Remaining News Cards */}
          <div style={{ marginTop: '16px', display: 'grid', gap: '14px' }}>
            {remainingItems.map((item) => (
              <Link
                key={item.id || item.slug}
                to={`/berita/${item.slug}`}
                className="rk-bar-card"
                style={{ padding: '18px 22px' }}
              >
                <div style={{ display: 'grid', gap: '4px' }}>
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
                    <span>{item.category}</span>
                    <span aria-hidden="true">•</span>
                    <span>{formatIndonesianDate(item.date)}</span>
                    {item.location && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>{item.location}</span>
                      </>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.08rem', fontWeight: 800 }}>
                    {item.title}
                  </h3>

                  {item.excerpt && (
                    <p style={{ fontSize: '0.86rem', color: 'var(--rk-muted)' }}>
                      {item.excerpt}
                    </p>
                  )}
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
