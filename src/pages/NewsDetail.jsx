import { parseImageUrl } from '@shared/services/mediaHelper.js';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, Clock, User, Tag, MapPin, Share2 } from 'lucide-react';

export default function NewsDetail() {
  const { slug } = useParams();
  const { news } = useData();
  const newsList = news && news.length > 0 ? news : [];
  const currentNews = newsList.find(n => n.slug === slug || String(n.id) === String(slug));

  if (!currentNews) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '5rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--deep-pine)' }}>Berita Tidak Ditemukan</h2>
        <p style={{ color: 'rgba(13,43,34,0.6)', marginBottom: '1.5rem' }}>Berita yang Anda cari mungkin telah dipindahkan atau dihapus.</p>
        <Link to="/berita" className="btn btn-primary"><ArrowLeft size={16} /> Kembali ke Berita Terkini</Link>
      </div>
    );
  }

  const relatedNews = newsList.filter(n => (n.category === currentNews.category || !n.category) && String(n.id) !== String(currentNews.id)).slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentNews.title,
        text: currentNews.excerpt || currentNews.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan berita berhasil disalin ke clipboard!');
    }
  };

  return (
    <div style={{ overflowX: 'clip', width: '100%' }}>
      {/* Hero */}
      <section style={{
        background: 'var(--deep-pine)', paddingTop: '7rem', paddingBottom: '3.5rem',
        position: 'relative', overflow: 'hidden', width: '100%',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 60%, rgba(16,185,129,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ maxWidth: 880, margin: '0 auto', position: 'relative' }}>
          <Link to="/berita" className="animate-fade-in-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            color: 'rgba(245,242,237,0.6)', fontSize: '0.85rem', marginBottom: '1.5rem', textDecoration: 'none',
            transition: 'color 0.2s',
          }}>
            <ArrowLeft size={16} /> Kembali ke Berita Terkini
          </Link>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span className="badge badge-emerald animate-fade-in-up delay-100" style={{ display: 'inline-flex' }}>
              <Tag size={12} /> {currentNews.category || 'Warta Rohis'}
            </span>
            {currentNews.location && (
              <span className="badge" style={{
                background: 'rgba(245,242,237,0.1)', color: 'var(--warm-alabaster)',
                border: '1px solid rgba(245,242,237,0.15)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              }}>
                <MapPin size={12} /> {currentNews.location}
              </span>
            )}
          </div>

          <h1 className="animate-fade-in-up delay-200" style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 4.5vw, 2.5rem)',
            fontWeight: 800, color: 'var(--warm-alabaster)', lineHeight: 1.25, marginBottom: '1.5rem',
          }}>
            {currentNews.title}
          </h1>

          <div className="animate-fade-in-up delay-300" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem', flexWrap: 'wrap',
            color: 'rgba(245,242,237,0.6)', fontSize: '0.85rem', borderTop: '1px solid rgba(245,242,237,0.1)', paddingTop: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} /> {currentNews.author || 'Tim Redaksi'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={15} />
                {new Date(currentNews.publishedAt || currentNews.date || Date.now()).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
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
            {currentNews.image && (
              <div style={{ marginBottom: '2.5rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', maxHeight: 460 }}>
                <img
                  src={parseImageUrl(currentNews.image)}
                  alt={currentNews.title}
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', maxHeight: 460, objectFit: 'cover' }}
                />
              </div>
            )}

            <div
              style={{
                fontSize: '1.05rem', lineHeight: 1.9, color: 'rgba(13,43,34,0.85)',
              }}
              dangerouslySetInnerHTML={{
                __html: currentNews.content
                  ? (currentNews.content.includes('<p>')
                      ? currentNews.content
                      : currentNews.content.split('\n\n').map(p => `<p style="margin-bottom: 1.25rem;">${p.replace(/\n/g, '<br/>')}</p>`).join(''))
                  : `<p>${currentNews.excerpt || ''}</p>`
              }}
            />
          </article>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div style={{ marginTop: '3.5rem' }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)', fontSize: '1.35rem',
                color: 'var(--deep-pine)', marginBottom: '1.5rem',
              }}>
                Berita Kegiatan Terkait
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.25rem' }}>
                {relatedNews.map(n => (
                  <Link to={`/berita/${n.slug}`} key={n.id} style={{
                    background: 'white', borderRadius: 'var(--radius-lg)', padding: '1.25rem',
                    textDecoration: 'none', border: '1px solid rgba(13,43,34,0.06)',
                    transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: 'var(--shadow-sm)',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    {n.image && (
                      <div style={{ height: 130, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '0.85rem' }}>
                        <img src={parseImageUrl(n.image)} alt={n.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem', alignSelf: 'flex-start', marginBottom: '0.5rem' }}>{n.category || 'Berita'}</span>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--deep-pine)', marginBottom: '0.5rem', lineHeight: 1.4, flex: 1 }}>{n.title}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(13,43,34,0.5)' }}>
                      {new Date(n.publishedAt || n.date || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
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
