import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { formatDate } from '../utils';
import { useData } from '../context/DataContext';
import { getDirectImageUrl, extractGoogleDriveId } from '../utils/media';
import './Articles.css';
import './About.css';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { articles } = useData();
  const article = articles.find((a) => a.slug === slug);

  const rawCover = article?.image || article?.coverImage;
  const initialCover = getDirectImageUrl(rawCover);
  const [coverSrc, setCoverSrc] = useState(initialCover);
  const [hasError, setHasError] = useState(false);
  const [isDriveFallback, setIsDriveFallback] = useState(false);

  const handleImageError = () => {
    const driveId = extractGoogleDriveId(rawCover);
    if (driveId && !isDriveFallback) {
      setIsDriveFallback(true);
      setCoverSrc(`https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`);
    } else {
      setHasError(true);
    }
  };

  if (!article) {
    return (
      <main>
        <section className="page-hero pattern-bg">
          <div className="container text-center">
            <h1 className="page-hero-title">Artikel Tidak Ditemukan</h1>
            <p className="page-hero-subtitle">Artikel yang Anda cari tidak ada.</p>
            <Link to="/artikel" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
              <ArrowLeft size={16} /> Kembali ke Artikel
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const paragraphs = article.content.split('\n\n').filter(Boolean);
  const showCover = Boolean(coverSrc) && !hasError;

  return (
    <main>
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-primary">{article.category}</span>
          <h1 className="page-hero-title" style={{ maxWidth: '840px', margin: 'var(--space-md) auto 0' }}>
            {article.title}
          </h1>
          <div className="article-detail-meta" style={{ justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
            <span className="article-detail-meta-item">
              <Calendar size={14} /> {formatDate(article.date)}
            </span>
            <span className="article-detail-meta-item">
              <User size={14} /> {article.author}
            </span>
            <span className="article-detail-meta-item">
              <Tag size={14} /> {article.category}
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="article-detail">
            {showCover && (
              <div className="article-detail-cover-wrapper">
                <img
                  src={coverSrc}
                  alt={article.title}
                  className="article-detail-cover-img"
                  onError={handleImageError}
                />
              </div>
            )}

            <div className="article-detail-content">
              {paragraphs.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              ))}
            </div>

            <div className="article-detail-back">
              <Link to="/artikel" className="btn btn-outline">
                <ArrowLeft size={16} /> Kembali ke Semua Artikel
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
