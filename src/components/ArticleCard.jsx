import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '../utils';
import './ArticleCard.css';

export default function ArticleCard({ article, index = 0 }) {
  return (
    <article className={`article-card card animate-on-scroll delay-${(index % 3) + 1}`}>
      <div className="article-card-thumb">
        <div className="article-card-thumb-placeholder">
          <span className="article-card-thumb-icon">📖</span>
        </div>
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
