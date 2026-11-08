import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Share2, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  Container,
  SoftCard,
  PhotoFrame,
  EmptyState,
  ROKABA_REAL_PHOTOS,
  formatIndonesianDate,
} from '../components/ui/SoftUI';

export default function NewsDetail() {
  const { slug } = useParams();
  const { news = [] } = useData();
  const [copied, setCopied] = useState(false);

  const item = news.find(
    (n) => String(n.slug) === String(slug) || String(n.id) === String(slug)
  );

  if (!item) {
    return (
      <div className="rk-page">
        <section className="rk-section">
          <Container>
            <EmptyState
              asPageHeading
              title="Berita tidak ditemukan"
              description="Halaman berita yang Anda cari mungkin telah dipindahkan atau tautannya tidak sesuai."
              action={
                <Link to="/berita" className="rk-btn-primary">
                  Kembali ke Arsip Berita
                </Link>
              }
            />
          </Container>
        </section>
      </div>
    );
  }

  const relatedNews = news
    .filter((n) => n.id !== item.id)
    .slice(0, 3);

  const paragraphs = String(item.content || item.excerpt || '')
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.excerpt || item.title,
          url: shareUrl,
        });
        return;
      } catch {
        // Lanjutkan ke penyalinan tautan jika dibatalkan
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rk-page">
      <section className="rk-page-header">
        <Container>
          <nav className="rk-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Beranda</Link>
            <span aria-hidden="true">/</span>
            <Link to="/berita">Berita</Link>
          </nav>

          <div className="rk-meta-line" style={{ marginBottom: '10px' }}>
            <span className="rk-badge rk-badge--brass">{item.category || 'Kegiatan'}</span>
            <span>•</span>
            <span>{formatIndonesianDate(item.date)}</span>
            {item.author && (
              <>
                <span>•</span>
                <span>Oleh {item.author}</span>
              </>
            )}
          </div>

          <h1
            className="rk-page-title"
            style={{ maxWidth: '24ch', marginBottom: '16px' }}
          >
            {item.title}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="rk-pill"
              onClick={handleShare}
              aria-label="Bagikan tautan berita"
            >
              {copied ? <Check size={15} /> : <Share2 size={15} />}
              <span>{copied ? 'Tautan disalin' : 'Bagikan berita'}</span>
            </button>
          </div>
        </Container>
      </section>

      <section className="rk-section">
        <Container>
          <div style={{ maxWidth: '880px', margin: '0 auto 28px' }}>
            <PhotoFrame
              src={item.image || ROKABA_REAL_PHOTOS[0]}
              alt={item.title}
              aspect="16/9"
              eager
              captionTitle={item.title}
              captionSub={`Dokumentasi ${item.category || 'Kegiatan'} • ${formatIndonesianDate(item.date)}`}
            />
          </div>

          <SoftCard
            as="article"
            style={{
              maxWidth: '760px',
              margin: '0 auto',
              padding: 'clamp(24px, 4vw, 42px)',
            }}
          >
            <div className="rk-prose">
              {item.excerpt && <p className="rk-lead-paragraph">{item.excerpt}</p>}
              {paragraphs.map((para, idx) => {
                if (idx === 0 && para === item.excerpt) return null;
                return <p key={idx}>{para}</p>;
              })}
            </div>

            <div
              style={{
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid var(--rk-line)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <Link to="/berita" className="rk-card-link" style={{ marginTop: 0 }}>
                <span aria-hidden="true">←</span>
                <span>Kembali ke semua berita</span>
              </Link>

              <button type="button" className="rk-pill" onClick={handleShare}>
                {copied ? <Check size={15} /> : <Share2 size={15} />}
                <span>{copied ? 'Tautan disalin' : 'Salin tautan'}</span>
              </button>
            </div>
          </SoftCard>

          {relatedNews.length > 0 && (
            <div style={{ maxWidth: '880px', margin: '40px auto 0' }}>
              <div className="rk-section-head">
                <h2 className="rk-section-title">Berita terkait lainnya</h2>
                <Link to="/berita" className="rk-card-link">
                  <span>Lihat arsip</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="rk-grid-3">
                {relatedNews.map((rel) => (
                  <SoftCard key={rel.id} as="article" interactive>
                    <div className="rk-meta-line">
                      <span>{rel.category || 'Kegiatan'}</span>
                      <span>•</span>
                      <span>{formatIndonesianDate(rel.date)}</span>
                    </div>
                    <h3 style={{ fontSize: '1.02rem', marginTop: '8px', marginBottom: '8px' }}>
                      <Link
                        to={`/berita/${rel.slug || rel.id}`}
                        style={{ color: 'inherit' }}
                      >
                        {rel.title}
                      </Link>
                    </h3>
                    <Link
                      to={`/berita/${rel.slug || rel.id}`}
                      className="rk-card-link"
                      style={{ fontSize: '0.86rem' }}
                    >
                      <span>Baca berita</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </SoftCard>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
