import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '../utils';
import { getDirectImageUrl, extractGoogleDriveId } from '../utils/media';
import './ArticleCard.css';

export default function ArticleCard({ article, index = 0 }) {
  const rawCover = article.image || article.coverImage;
  const initialCover = getDirectImageUrl(rawCover);
  const [imgSrc, setImgSrc] = useState(initialCover);
  const [hasError, setHasError] = useState(false);
  const [isDriveFallback, setIsDriveFallback] = useState(false);

  const handleImageError = () => {
    const driveId = extractGoogleDriveId(rawCover);
    if (driveId && !isDriveFallback) {
      setIsDriveFallback(true);
      setImgSrc(`https://drive.google.com/thumbnail?id=${driveId}&sz=w800`);
    } else {
      setHasError(true);
    }
  };

  const showImage = Boolean(imgSrc) && !hasError;

  return (
    <article className={`article-card card animate-on-scroll delay-${(index % 3) + 1}`}>
      <div className="article-card-thumb">
        {showImage && (
          <img
            src={imgSrc}
            alt={article.title}
            className="article-card-img"
            loading="lazy"
            onError={handleImageError}
          />
        )}
        <div
          className="article-card-thumb-placeholder"
          style={{ display: showImage ? 'none' : 'flex' }}
        >
          <span className="article-card-thumb-icon">📖</span>
        </div>
        <div className="article-card-thumb-overlay" />
        <span className="badge badge-primary article-card-category">{article.category}</span>
      </div>
      <div className="card-body article-card-body">
        <div className="article-card-meta">
          <Calendar size={14} />
          <span>{formatDate(article.date)}</span>
        </div>
        <h3 className="article-card-title">
          <Link to={`/artikel/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="article-card-excerpt">{article.excerpt}</p>
        <Link to={`/artikel/${article.slug}`} className="article-card-link">
          Baca Selengkapnya <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
