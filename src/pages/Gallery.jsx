import { useState } from 'react';
import { useScrollAnimation } from '../utils';
import { Camera, X, Calendar } from 'lucide-react';
import { galleryItems, galleryCategories } from '../data/gallery';
import './Gallery.css';
import './About.css';
import './Articles.css';

export default function Gallery() {
  useScrollAnimation();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = activeCategory === 'Semua'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <main className="page-gallery">
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-primary animate-hero delay-0">Galeri</span>
          <h1 className="page-hero-title animate-hero delay-1">Dokumentasi Kegiatan</h1>
          <p className="page-hero-subtitle animate-hero delay-2">
            Momen-momen berharga dari berbagai kegiatan dakwah dan program Organisasi ROHIS Kabupaten Banyumas.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Category Filter */}
          <div className="articles-filter">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                className={`articles-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="gallery-grid">
            {filteredItems.map((item, i) => (
              <div
                key={item.id}
                className={`gallery-item animate-on-scroll delay-${(i % 4) + 1}`}
                onClick={() => setSelectedItem(item)}
                title="Klik untuk melihat foto lebih besar"
              >
                <div className="gallery-item-image">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="gallery-item-img"
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <span className="gallery-item-emoji">{item.emoji}</span>
                      <Camera size={20} className="gallery-item-camera" />
                    </>
                  )}
                </div>
                <div className="gallery-item-overlay">
                  <span className="badge badge-primary">{item.category}</span>
                  <h4>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              💡 <em>Klik kartu kegiatan untuk melihat detail foto. Anda dapat menambahkan foto kegiatan asli melalui file <code>src/data/gallery.js</code>.</em>
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="gallery-modal-backdrop"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="gallery-modal-close"
              onClick={() => setSelectedItem(null)}
              aria-label="Tutup"
            >
              <X size={20} />
            </button>

            <div className="gallery-modal-body">
              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="gallery-modal-img"
                />
              ) : (
                <div className="gallery-modal-placeholder">
                  <span>{selectedItem.emoji}</span>
                  <p>Belum ada foto yang diunggah</p>
                </div>
              )}
            </div>

            <div className="gallery-modal-info">
              <div>
                <h3>{selectedItem.title}</h3>
              </div>
              <div className="gallery-modal-meta">
                <span className="badge badge-primary">{selectedItem.category}</span>
                {selectedItem.date && (
                  <span className="gallery-modal-date">
                    <Calendar size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                    {selectedItem.date}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
