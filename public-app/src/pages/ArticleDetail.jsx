import { parseImageUrl } from '@shared/services/mediaHelper.js';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, Clock, User, Tag, Share2 } from 'lucide-react';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { articles } = useData();
  const safeArticles = Array.isArray(articles) ? articles : [];
  const article = safeArticles.find(a => a.slug === slug || String(a.id) === String(slug));

  if (!article) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Artikel Tidak Ditemukan</h2>
        <Link to="/articles" className="btn btn-primary"><ArrowLeft size={16} /> Kembali ke Artikel</Link>
      </div>
    );
  }

  const relatedArticles = safeArticles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'var(--deep-pine)', paddingTop: '7rem', paddingBottom: '3rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 60%, rgba(16,185,129,0.08) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="container" style={{ maxWidth: 800, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <Link to="/articles" className="animate-fade-in-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            color: 'rgba(245,242,237,0.5)', fontSize: '0.85rem', marginBottom: '1.5rem', textDecoration: 'none',
          }}>
            <ArrowLeft size={16} /> Kembali ke Artikel
          </Link>
          <span className="badge badge-emerald animate-fade-in-up delay-100" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <Tag size={12} /> {article.category}
          </span>
          <h1 className="animate-fade-in-up delay-200" style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800, color: 'var(--warm-alabaster)', lineHeight: 1.2, marginBottom: '1.5rem',
          }}>
            {article.title}
          </h1>
          <div className="animate-fade-in-up delay-300" style={{
            display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap',
            color: 'rgba(245,242,237,0.45)', fontSize: '0.85rem',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={15} /> {article.author}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={15} />
              {new Date(article.date || article.publishedAt || Date.now()).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section" style={{ background: 'var(--warm-alabaster)' }}>
        <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
          <article className="animate-fade-in-up" style={{
            background: 'white', borderRadius: 'var(--radius-xl)', padding: 'clamp(1.5rem, 4vw, 3rem)',
            boxShadow: 'var(--shadow-md)', border: '1px solid rgba(13,43,34,0.05)',
            marginTop: '-2rem', position: 'relative', zIndex: 1,
          }}>
            {article.image && (
              <div style={{ marginBottom: '2rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', maxHeight: 420 }}>
                <img
                  src={parseImageUrl(article.image)}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', maxHeight: 420, objectFit: 'cover' }}
                />
              </div>
            )}
            <div style={{
              fontSize: '1.05rem', lineHeight: 1.9, color: 'rgba(13,43,34,0.75)',
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Artikel Terkait</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {relatedArticles.map(a => (
                  <Link to={`/articles/${a.slug}`} key={a.id} style={{
                    background: 'white', borderRadius: 'var(--radius-lg)', padding: '1.25rem',
                    textDecoration: 'none', border: '1px solid rgba(13,43,34,0.06)',
                    transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)', boxShadow: 'var(--shadow-sm)',
                  }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem', marginBottom: '0.75rem' }}>{a.category}</span>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--deep-pine)', marginBottom: '0.35rem' }}>{a.title}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(13,43,34,0.4)' }}>{a.author}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
