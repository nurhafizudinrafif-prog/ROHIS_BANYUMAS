import { useState } from 'react';
import { Award, Trophy, School, Calendar, MapPin, Sparkles } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { achievements, achievementCategories, achievementYears } from '../data/achievements';
import './AchievementsSection.css';

export default function AchievementsSection({ limit = 6, showFilters = true }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedYear, setSelectedYear] = useState('Semua Tahun');

  const filteredAchievements = achievements.filter((item) => {
    const matchCategory =
      selectedCategory === 'Semua Kategori' || item.category === selectedCategory;
    const matchYear =
      selectedYear === 'Semua Tahun' || item.year.toString() === selectedYear;
    return matchCategory && matchYear;
  });

  const displayedList = limit ? filteredAchievements.slice(0, limit) : filteredAchievements;

  return (
    <section className="section achievements-section">
      <div className="container">
        <SectionHeader
          badge="Rekam Jejak & Prestasi"
          title="Arsip Prestasi & Dedikasi"
          subtitle="Dokumentasi capaian santri, delegasi sekolah, dan kader ROHIS Kabupaten Banyumas dalam berbagai ajang syiar, kompetisi, dan musabaqah keilmuan."
        />

        {showFilters && (
          <div className="achievements-filter-wrap animate-on-scroll">
            {/* Year Filters */}
            <div className="achievements-filter-group" role="group" aria-label="Filter Tahun Prestasi">
              <span className="filter-group-label">Tahun:</span>
              <div className="filter-pills">
                {achievementYears.map((year) => (
                  <button
                    key={year}
                    className={`filter-pill-btn ${selectedYear === year ? 'active' : ''}`}
                    onClick={() => setSelectedYear(year)}
                    type="button"
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filters */}
            <div className="achievements-filter-group" role="group" aria-label="Filter Kategori Prestasi">
              <span className="filter-group-label">Kategori:</span>
              <div className="filter-pills">
                {achievementCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                    type="button"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="achievements-grid">
          {displayedList.map((item, index) => {
            const rankClass = `rank-${item.rank}`;
            return (
              <article
                key={item.id}
                className={`achievement-card ${rankClass} animate-on-scroll delay-${(index % 3) + 1}`}
              >
                <div className="achievement-card-header">
                  <div className="achievement-rank-badge">
                    {item.rank === 'gold' ? (
                      <Trophy size={14} className="rank-icon rank-icon-gold" />
                    ) : (
                      <Award size={14} className={`rank-icon rank-icon-${item.rank}`} />
                    )}
                    <span>{item.rankLabel}</span>
                  </div>
                  <div className="achievement-meta-pills">
                    <span className="achievement-year-tag">
                      <Calendar size={12} />
                      {item.year}
                    </span>
                    <span className="achievement-category-tag">{item.category}</span>
                  </div>
                </div>

                <h3 className="achievement-card-title">{item.title}</h3>

                <div className="achievement-info-rows">
                  <div className="achievement-info-item">
                    <Sparkles size={14} className="info-icon" />
                    <span className="info-text">{item.event}</span>
                  </div>
                  <div className="achievement-info-item recipient-item">
                    <School size={14} className="info-icon" />
                    <span className="info-text recipient-text">{item.recipient}</span>
                  </div>
                  <div className="achievement-info-item">
                    <MapPin size={14} className="info-icon" />
                    <span className="info-text">{item.level} • {item.organizer}</span>
                  </div>
                </div>

                {item.description && (
                  <p className="achievement-card-desc">{item.description}</p>
                )}
              </article>
            );
          })}
        </div>

        {displayedList.length === 0 && (
          <div className="achievements-empty text-center">
            <p>Tidak ada arsip prestasi pada filter yang dipilih.</p>
          </div>
        )}
      </div>
    </section>
  );
}
