import { parseImageUrl, extractDriveId } from '@shared/services/mediaHelper.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Newspaper, Search, Clock, Calendar, User, ArrowRight, FileText, MapPin, Sparkles } from 'lucide-react';

export default function News() {
  const { news } = useData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');

  const newsList = news && news.length > 0 ? news : [];
  const categories = ['Semua', ...new Set(newsList.map(a => a.category).filter(Boolean))];

  const filtered = newsList
    .filter(a => category === 'Semua' || a.category === category)
    .filter(a => (a.title || '').toLowerCase().includes(search.toLowerCase()) || 
                 (a.author || '').toLowerCase().includes(search.toLowerCase()) ||
                 (a.location || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const ordA = (a.order !== undefined && a.order !== null && a.order !== '') ? Number(a.order) : 999999;
      const ordB = (b.order !== undefined && b.order !== null && b.order !== '') ? Number(b.order) : 999999;
      if (ordA !== ordB) return ordA - ordB;
      return new Date(b.publishedAt || b.date || 0) - new Date(a.publishedAt || a.date || 0);
    });

  useScrollReveal([filtered, category, search]);

  return (
    <div style={{ overflowX: 'clip', width: '100%' }}>
      {/* Hero */}
      <section style={{
        background: 'var(--deep-pine)', paddingTop: '8rem', paddingBottom: '3.5rem',
        position: 'relative', overflow: 'hidden', width: '100%',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-emerald animate-fade-in-up" style={{ marginBottom: '1rem' }}>
            <Newspaper size={14} /> Warta & Berita
          </span>
          <h1 className="animate-fade-in-up delay-100" style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4.5vw, 2.8rem)',
            fontWeight: 800, color: 'var(--warm-alabaster)', marginBottom: '0.75rem',
          }}>
            Berita Terkini ROHIS Banyumas
          </h1>
          <p className="animate-fade-in-up delay-200" style={{
            color: 'rgba(245,242,237,0.65)', maxWidth: 540, fontSize: '1rem', lineHeight: 1.6,
          }}>
            Warta kegiatan, liputan acara, dan agenda syiar pelajar Islam se-Kabupaten Banyumas.
          </p>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="section" style={{ background: 'var(--warm-alabaster)', width: '100%' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Search & Filter */}
          <div style={{
            display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap', alignItems: 'center',
            maxWidth: 960, margin: '0 auto 2.5rem',
          }}>
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(13,43,34,0.3)' }} />
              <input
                type="text" placeholder="Cari berita kegiatan..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ borderRadius: 'var(--radius-full)' }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Vertical News List */}
          {filtered.length > 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              maxWidth: 960,
              margin: '0 auto',
            }}>
              {filtered.map((item, i) => {
                const imgUrl = parseImageUrl(item.image || item.coverImage);
                return (
                  <Link
                    to={`/berita/${item.slug || item.id}`}
                    key={item.id}
                    className={`news-card-vertical reveal-scale delay-${(i % 5 + 1) * 75}`}
                  >
                    <div className="news-card-vertical-img">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const driveId = extractDriveId(item.image || item.coverImage);
                            if (driveId && !e.currentTarget.src.includes('lh3.googleusercontent.com')) {
                              e.currentTarget.src = `https://lh3.googleusercontent.com/d/${driveId}`;
                            } else {
                              e.currentTarget.style.display = 'none';
                            }
                          }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={44} style={{ color: 'rgba(245,242,237,0.2)' }} />
                        </div>
                      )}
                      <span
                        className="badge"
                        style={{
                          position: 'absolute',
                          top: '0.85rem',
                          left: '0.85rem',
                          background: 'rgba(13,43,34,0.85)',
                          backdropFilter: 'blur(8px)',
                          color: 'var(--warm-alabaster)',
                          fontSize: '0.72rem',
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid rgba(255,255,255,0.18)',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          zIndex: 2,
                        }}
                      >
                        {item.category || 'Warta Rohis'}
                      </span>
                      {i === 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '0.85rem',
                            right: '0.85rem',
                            background: 'linear-gradient(135deg, #DFBF73 0%, #C8A85B 100%)',
                            color: '#07140E',
                            fontSize: '0.68rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                            zIndex: 2,
                          }}
                        >
                          <Sparkles size={11} /> TERBARU
                        </span>
                      )}
                    </div>

                    <div className="news-card-vertical-body">
                      <div>
                        {/* Metadata Row */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            fontSize: '0.78rem',
                            color: 'rgba(13,43,34,0.55)',
                            flexWrap: 'wrap',
                            marginBottom: '0.35rem',
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--antique-brass)' }}>
                            <Calendar size={13} />
                            {new Date(item.publishedAt || item.date || Date.now()).toLocaleDateString(
                              'id-ID',
                              { day: 'numeric', month: 'long', year: 'numeric' }
                            )}
                          </span>
                          {item.location && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MapPin size={13} style={{ color: 'var(--emerald)' }} />
                              {item.location}
                            </span>
                          )}
                        </div>

                        <h3 className="news-card-vertical-title">
                          {item.title}
                        </h3>

                        {item.excerpt && (
                          <p
                            style={{
                              color: 'rgba(13,43,34,0.68)',
                              fontSize: '0.88rem',
                              lineHeight: 1.6,
                              margin: '0 0 1rem',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {item.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Footer Row */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '0.85rem',
                          borderTop: '1px solid rgba(13,43,34,0.07)',
                          fontSize: '0.8rem',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(13,43,34,0.55)' }}>
                          <User size={13} /> {item.author || 'Humas ROKABA'}
                        </span>
                        <span className="news-card-vertical-cta">
                          Baca Berita <ArrowRight size={15} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(13,43,34,0.35)' }}>
              <Newspaper size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1.05rem' }}>Tidak ada berita kegiatan ditemukan</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Coba ubah kata kunci atau filter kategori</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
