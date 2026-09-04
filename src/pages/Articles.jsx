import { useState } from 'react';
import { useScrollAnimation } from '../utils';
import SectionHeader from '../components/SectionHeader';
import ArticleCard from '../components/ArticleCard';
import { articles, articleCategories } from '../data/articles';
import './Articles.css';
import './About.css';

export default function Articles() {
  useScrollAnimation();
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filtered = activeCategory === 'Semua'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <main className="page-articles">
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-primary animate-hero delay-0">Artikel Dakwah</span>
          <h1 className="page-hero-title animate-hero delay-1">Bacaan Islami Inspiratif</h1>
          <p className="page-hero-subtitle animate-hero delay-2">
            Kumpulan artikel, kajian, dan tulisan untuk meningkatkan keilmuan dan keimanan.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="articles-filter">
            {articleCategories.map((cat) => (
              <button
                key={cat}
                className={`articles-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-3">
            {filtered.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center" style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2xl)' }}>
              Belum ada artikel di kategori ini.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
