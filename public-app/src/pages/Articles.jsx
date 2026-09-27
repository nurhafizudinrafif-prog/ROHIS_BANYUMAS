import { parseImageUrl, extractDriveId } from '@shared/services/mediaHelper.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { BookOpen, Search, Filter, Clock, User, ChevronRight, FileText } from 'lucide-react';

export default function Articles() {
  const { articles } = useData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');

  const categories = ['Semua', ...new Set(articles.map(a => a.category).filter(Boolean))];

  const filtered = articles
    .filter(a => category === 'Semua' || a.category === category)
    .filter(a => (a.title || '').toLowerCase().includes(search.toLowerCase()) || 
                 (a.author || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.publishedAt || b.date || 0) - new Date(a.publishedAt || a.date || 0));

  useScrollReveal([filtered, category, search]);

  return (
    <div style={{ overflowX: 'clip', width: '100%' }}>
      {/* Hero */}
      <section style={{
        background: 'var(--deep-pine)', paddingTop: '8rem', paddingBottom: '3.5rem',
        position: 'relative', overflow: 'hidden', width: '100%',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-emerald animate-fade-in-up" style={{ marginBottom: '1rem' }}>
            <BookOpen size={14} /> Literasi & Kajian
          </span>
          <h1 className="animate-fade-in-up delay-100" style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4.5vw, 2.8rem)',
            fontWeight: 800, color: 'var(--warm-alabaster)', marginBottom: '0.75rem',
          }}>
            Artikel Dakwah
          </h1>
          <p className="animate-fade-in-up delay-200" style={{
            color: 'rgba(245,242,237,0.65)', maxWidth: 540, fontSize: '1rem', lineHeight: 1.6,
          }}>
            Kajian, refleksi, wawasan keislaman, dan inspirasi dakwah untuk generasi muda muslim Banyumas.
          </p>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="section" style={{ background: 'var(--warm-alabaster)', width: '100%' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Search & Filter */}
          <div style={{
            display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap', alignItems: 'center',
          }}>
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(13,43,34,0.3)' }} />
              <input
                type="text" placeholder="Cari artikel dakwah..." value={search}
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

          {/* Articles Grid */}
          {filtered.length > 0 ? (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '1.5rem',
            }}>
              {filtered.map((article, i) => (
                <Link to={`/articles/${article.slug}`} key={article.id} className={`card-editorial reveal-scale delay-${(i % 6 + 1) * 80}`}
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 'var(--radius-xl)' }}>
                  <div style={{
                    height: 200,
                    background: `linear-gradient(135deg, var(--deep-pine) 0%, var(--deep-pine-light) 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                  }}>
                    {article.image ? (
                    <img
                      src={parseImageUrl(article.image)}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        const driveId = extractDriveId(article.image);
                        if (driveId && !e.currentTarget.src.includes('lh3.googleusercontent.com')) {
                          e.currentTarget.src = `https://lh3.googleusercontent.com/d/${driveId}`;
                        } else {
                          e.currentTarget.style.display = 'none';
                        }
                      }}
                    />
                  ) : (
                    <FileText size={40} style={{ color: 'rgba(245,242,237,0.12)' }} />
                  )}
                    <span
                      className="badge"
                      style={{
                        position: 'absolute',
                        top: '0.85rem',
                        left: '0.85rem',
                        background: 'rgba(13,43,34,0.82)',
                        backdropFilter: 'blur(8px)',
                        color: 'var(--warm-alabaster)',
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        fontWeight: 600,
                      }}
                    >
                      {article.category || 'Artikel'}
                    </span>
                  </div>
                  <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem' }}>
                    <div>
                      <h3 style={{ color: 'var(--deep-pine)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4 }}>{article.title}</h3>
                      {article.excerpt && (
                        <p style={{ color: 'rgba(13,43,34,0.65)', fontSize: '0.85rem', lineHeight: 1.55, margin: '0 0 1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(13,43,34,0.06)', fontSize: '0.78rem', color: 'rgba(13,43,34,0.5)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={13} /> {article.author || 'Tim ROKABA'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={13} />
                        {new Date(article.publishedAt || article.date || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(13,43,34,0.35)' }}>
              <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1.05rem' }}>Tidak ada artikel ditemukan</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Coba ubah kata kunci atau filter kategori</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
