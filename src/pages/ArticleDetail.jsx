import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { formatDate } from '../utils';
import { articles } from '../data/articles';
import './Articles.css';
import './About.css';

export default function ArticleDetail() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

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

  return (
    <main>
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-primary">{article.category}</span>
          <h1 className="page-hero-title" style={{ maxWidth: '800px', margin: 'var(--space-md) auto 0' }}>
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
