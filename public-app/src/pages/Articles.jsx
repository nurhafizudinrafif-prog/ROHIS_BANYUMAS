import { parseImageUrl } from '@shared/services/mediaHelper.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { BookOpen, Search, Filter, Clock, User, ChevronRight, FileText } from 'lucide-react';

export default function Articles() {
  const { articles } = useData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');

  const categories = ['Semua', ...new Set((articles || []).map(a => a.category).filter(Boolean))];

  const filtered = (articles || [])
    .filter(a => category === 'Semua' || a.category === category)
    .filter(a => ((a.title || '').toLowerCase().includes((search || '').toLowerCase()) || 
                 (a.author || '').toLowerCase().includes((search || '').toLowerCase())))
    .sort((a, b) => new Date(b.date || b.publishedAt || 0) - new Date(a.date || a.publishedAt || 0));

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'var(--deep-pine)', paddingTop: '8rem', paddingBottom: '3rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <span className="badge badge-emerald animate-fade-in-up" style={{ marginBottom: '1rem' }}>
            <BookOpen size={14} /> Artikel & Literasi
          </span>
          <h1 className="animate-fade-in-up delay-100" style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4.5vw, 2.8rem)',
            fontWeight: 800, color: 'var(--warm-alabaster)', marginBottom: '0.75rem',
          }}>
            Literasi Dakwah Moderat
          </h1>
          <p className="animate-fade-in-up delay-200" style={{
            color: 'rgba(245,242,237,0.55)', maxWidth: 500, fontSize: '1rem',
          }}>
            Bacaan Islami berkualitas untuk memperluas wawasan dan memperkuat iman.
          </p>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="section" style={{ background: 'var(--warm-alabaster)' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Search & Filter */}
          <div style={{
            display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center',
          }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(13,43,34,0.3)' }} />
              <input
                type="text" placeholder="Cari artikel..." value={search}
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
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.5rem',
            }}>
              {filtered.map((article, i) => (
                <Link to={`/articles/${article.slug}`} key={article.id} className="card-editorial animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms`, textDecoration: 'none' }}>
                  <div style={{
                    height: 180,
                    background: `linear-gradient(135deg, var(--deep-pine) 0%, var(--deep-pine-light) 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                  }}>
                    {article.image ? (
                    <img
                      src={parseImageUrl(article.image)}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <FileText size={40} style={{ color: 'rgba(245,242,237,0.12)' }} />
                  )}
                    <span className="badge badge-emerald" style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                      {article.category}
                    </span>
                  </div>
                  <div className="card-body">
                    <h3 style={{ color: 'var(--deep-pine)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{article.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'rgba(13,43,34,0.45)', marginTop: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={13} /> {article.author}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={13} />
                        {new Date(article.date || article.publishedAt || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
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
