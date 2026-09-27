import { parseImageUrl } from '@shared/services/mediaHelper.js';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, Clock, User, Tag, Share2 } from 'lucide-react';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { articles } = useData();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '5rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--deep-pine)' }}>Artikel Tidak Ditemukan</h2>
        <p style={{ color: 'rgba(13,43,34,0.6)', marginBottom: '1.5rem' }}>Artikel yang Anda cari mungkin telah dipindahkan atau dihapus.</p>
        <Link to="/articles" className="btn btn-primary"><ArrowLeft size={16} /> Kembali ke Daftar Artikel</Link>
      </div>
    );
  }

  const relatedArticles = articles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt || article.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan artikel berhasil disalin!');
    }
  };

  return (
    <div style={{ overflowX: 'clip', width: '100%' }}>
      {/* Hero */}
      <section style={{
        background: 'var(--deep-pine)', paddingTop: '7rem', paddingBottom: '3.5rem',
        position: 'relative', overflow: 'hidden', width: '100%',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 60%, rgba(16,185,129,0.08) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="container" style={{ maxWidth: 880, margin: '0 auto', position: 'relative' }}>
          <Link to="/articles" className="animate-fade-in-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            color: 'rgba(245,242,237,0.6)', fontSize: '0.85rem', marginBottom: '1.5rem', textDecoration: 'none',
          }}>
            <ArrowLeft size={16} /> Kembali ke Daftar Artikel
          </Link>
          <span className="badge badge-emerald animate-fade-in-up delay-100" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <Tag size={12} /> {article.category}
          </span>
          <h1 className="animate-fade-in-up delay-200" style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800, color: 'var(--warm-alabaster)', lineHeight: 1.25, marginBottom: '1.5rem',
          }}>
            {article.title}
          </h1>
          <div className="animate-fade-in-up delay-300" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem', flexWrap: 'wrap',
            color: 'rgba(245,242,237,0.6)', fontSize: '0.85rem', borderTop: '1px solid rgba(245,242,237,0.1)', paddingTop: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={15} /> {article.author}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={15} />
                {new Date(article.publishedAt || article.date || Date.now()).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <button
              onClick={handleShare}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(245,242,237,0.1)', color: 'var(--warm-alabaster)',
                border: '1px solid rgba(245,242,237,0.15)', borderRadius: 'var(--radius-full)',
                padding: '0.4rem 0.9rem', fontSize: '0.8rem', cursor: 'pointer',
              }}
            >
              <Share2 size={14} /> Bagikan
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section" style={{ background: 'var(--warm-alabaster)', minHeight: '60vh' }}>
        <div className="container" style={{ maxWidth: 880, margin: '0 auto' }}>
          <article className="animate-fade-in-up" style={{
            background: 'white', borderRadius: 'var(--radius-xl)', padding: 'clamp(1.5rem, 5vw, 3rem)',
            boxShadow: 'var(--shadow-md)', border: '1px solid rgba(13,43,34,0.06)',
            marginTop: '-2rem', position: 'relative', zIndex: 1,
          }}>
            {article.image && (
              <div style={{ marginBottom: '2.5rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', maxHeight: 460 }}>
                <img
                  src={parseImageUrl(article.image)}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', maxHeight: 460, objectFit: 'cover' }}
                />
              </div>
            )}
            <div style={{
              fontSize: '1.05rem', lineHeight: 1.9, color: 'rgba(13,43,34,0.85)',
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div style={{ marginTop: '3.5rem' }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)', fontSize: '1.35rem',
                color: 'var(--deep-pine)', marginBottom: '1.5rem',
              }}>
                Artikel Dakwah Terkait
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.25rem' }}>
                {relatedArticles.map(a => (
                  <Link to={`/articles/${a.slug}`} key={a.id} style={{
                    background: 'white', borderRadius: 'var(--radius-lg)', padding: '1.25rem',
                    textDecoration: 'none', border: '1px solid rgba(13,43,34,0.06)',
                    transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: 'var(--shadow-sm)',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    {a.image && (
                      <div style={{ height: 130, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '0.85rem' }}>
                        <img src={parseImageUrl(a.image)} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem', alignSelf: 'flex-start', marginBottom: '0.5rem' }}>{a.category}</span>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--deep-pine)', marginBottom: '0.5rem', lineHeight: 1.4, flex: 1 }}>{a.title}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(13,43,34,0.5)' }}>{a.author}</span>
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
