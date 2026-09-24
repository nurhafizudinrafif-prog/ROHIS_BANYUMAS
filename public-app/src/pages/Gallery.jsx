import { useState, useMemo, useEffect, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { parseMediaItem } from '@shared/services/mediaHelper.js';
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Play,
  Calendar,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  Maximize2,
  AlertCircle
} from 'lucide-react';

export default function Gallery() {
  const { gallery } = useData();
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'image' | 'video'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeItem, setActiveItem] = useState(null);

  // Parse all media items with multi-platform helper
  const parsedItems = useMemo(() => {
    return (gallery || []).map((item) => ({
      ...item,
      media: parseMediaItem(item),
    }));
  }, [gallery]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    parsedItems.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['all', ...Array.from(set)];
  }, [parsedItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    return parsedItems.filter((item) => {
      const matchesType =
        typeFilter === 'all' || item.media.mediaType === typeFilter;
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      return matchesType && matchesCategory;
    });
  }, [parsedItems, typeFilter, selectedCategory]);

  // Active item index in current filtered list for next/prev
  const activeIndex = useMemo(() => {
    if (!activeItem) return -1;
    return filteredItems.findIndex((i) => i.id === activeItem.id);
  }, [activeItem, filteredItems]);

  const handleNext = useCallback(() => {
    if (activeIndex >= 0 && activeIndex < filteredItems.length - 1) {
      setActiveItem(filteredItems[activeIndex + 1]);
    } else if (filteredItems.length > 0) {
      setActiveItem(filteredItems[0]); // Loop around
    }
  }, [activeIndex, filteredItems]);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveItem(filteredItems[activeIndex - 1]);
    } else if (filteredItems.length > 0) {
      setActiveItem(filteredItems[filteredItems.length - 1]); // Loop around
    }
  }, [activeIndex, filteredItems]);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeItem) return;
      if (e.key === 'Escape') setActiveItem(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItem, handleNext, handlePrev]);

  // Stats
  const photoCount = useMemo(
    () => parsedItems.filter((i) => i.media.mediaType === 'image').length,
    [parsedItems]
  );
  const videoCount = useMemo(
    () => parsedItems.filter((i) => i.media.mediaType === 'video').length,
    [parsedItems]
  );

  return (
    <div>
      {/* ── HERO SECTION ── */}
      <section
        style={{
          background: 'var(--deep-pine)',
          paddingTop: '8rem',
          paddingBottom: '3.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(181,141,79,0.08) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="container"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 1.5rem',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <span className="badge badge-brass animate-fade-in-up">
              <Sparkles size={13} /> Dokumentasi & Multimedia
            </span>
            <span
              style={{
                fontSize: '0.78rem',
                color: 'rgba(245,242,237,0.5)',
                background: 'rgba(255,255,255,0.06)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {parsedItems.length} Koleksi ({photoCount} Foto, {videoCount} Video)
            </span>
          </div>

          <h1
            className="animate-fade-in-up delay-100"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 800,
              color: 'var(--warm-alabaster)',
              letterSpacing: '-0.02em',
            }}
          >
            Galeri Kegiatan & Video
          </h1>
          <p
            className="animate-fade-in-up delay-200"
            style={{
              color: 'rgba(245,242,237,0.65)',
              maxWidth: 580,
              marginTop: '0.75rem',
              lineHeight: 1.6,
              fontSize: '1.02rem',
            }}
          >
            Rekam jejak perjuangan, kaderisasi dakwah, kajian akbar, dan momen berharga
            ROHIS se-Kabupaten Banyumas dalam foto dan video resolusi tinggi.
          </p>

          {/* Media Type Tabs Filter */}
          <div
            className="animate-fade-in-up delay-300"
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => setTypeFilter('all')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: typeFilter === 'all' ? '1px solid var(--antique-brass)' : '1px solid rgba(255,255,255,0.12)',
                background: typeFilter === 'all' ? 'var(--antique-brass)' : 'rgba(255,255,255,0.06)',
                color: typeFilter === 'all' ? 'var(--deep-pine)' : 'var(--warm-alabaster)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              Semua ({parsedItems.length})
            </button>
            <button
              onClick={() => setTypeFilter('image')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: typeFilter === 'image' ? '1px solid var(--antique-brass)' : '1px solid rgba(255,255,255,0.12)',
                background: typeFilter === 'image' ? 'var(--antique-brass)' : 'rgba(255,255,255,0.06)',
                color: typeFilter === 'image' ? 'var(--deep-pine)' : 'var(--warm-alabaster)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <ImageIcon size={14} /> Foto ({photoCount})
            </button>
            <button
              onClick={() => setTypeFilter('video')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: typeFilter === 'video' ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.12)',
                background: typeFilter === 'video' ? '#10B981' : 'rgba(255,255,255,0.06)',
                color: typeFilter === 'video' ? '#081C16' : 'var(--warm-alabaster)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <VideoIcon size={14} /> Video ({videoCount})
            </button>
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTER BAR & MEDIA GRID ── */}
      <section className="section" style={{ background: 'var(--warm-alabaster)', minHeight: '60vh' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Sub-Filter: Categories */}
          {categories.length > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '2rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                scrollbarWidth: 'none',
              }}
            >
              <span style={{ fontSize: '0.78rem', color: 'rgba(13,43,34,0.5)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.25rem', whiteSpace: 'nowrap' }}>
                <Filter size={13} /> Kategori:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.35rem 0.9rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: selectedCategory === cat ? '1px solid var(--deep-pine)' : '1px solid rgba(13,43,34,0.12)',
                    background: selectedCategory === cat ? 'var(--deep-pine)' : 'white',
                    color: selectedCategory === cat ? 'var(--warm-alabaster)' : 'rgba(13,43,34,0.7)',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat === 'all' ? 'Semua Kategori' : cat}
                </button>
              ))}
            </div>
          )}

          {/* Media Grid */}
          {filteredItems.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {filteredItems.map((item, i) => {
                const isVideo = item.media.mediaType === 'video';
                return (
                  <div
                    key={item.id || i}
                    className="animate-fade-in-up"
                    onClick={() => setActiveItem(item)}
                    style={{
                      animationDelay: `${i * 60}ms`,
                      borderRadius: 'var(--radius-xl)',
                      overflow: 'hidden',
                      background: 'white',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'pointer',
                      border: '1px solid rgba(13,43,34,0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 16px 36px rgba(13,43,34,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    {/* Media Thumbnail Container */}
                    <div
                      style={{
                        height: 220,
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #0D2B22 0%, #163D31 100%)',
                      }}
                    >
                      {item.media.thumbnailUrl ? (
                        <img
                          src={item.media.thumbnailUrl}
                          alt={item.title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const cur = e.currentTarget.src;
                            if (item.media.fallbackThumbnailUrl && cur !== item.media.fallbackThumbnailUrl) {
                              e.currentTarget.src = item.media.fallbackThumbnailUrl;
                            } else if (item.media.tertiaryThumbnailUrl && cur !== item.media.tertiaryThumbnailUrl) {
                              e.currentTarget.src = item.media.tertiaryThumbnailUrl;
                            } else {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling;
                              if (fallback) fallback.style.display = 'flex';
                            }
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                        />
                      ) : null}

                      {/* Branded Fallback Placeholder if Image Fails or Video has no Cover */}
                      <div
                        style={{
                          display: item.media.thumbnailUrl ? 'none' : 'flex',
                          width: '100%',
                          height: '100%',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #0D2B22 0%, #163D31 100%)',
                          color: 'var(--warm-alabaster)',
                          padding: '1.5rem',
                          textAlign: 'center',
                        }}
                      >
                        {item.media.source === 'tiktok' ? (
                          <>
                            <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#000', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', boxShadow: '0 0 16px rgba(0,242,234,0.4)' }}>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.33 0 .65.06.94.16V9.45a6.37 6.37 0 0 0-.94-.07 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.42c1.3.93 2.89 1.48 4.6 1.48V6.45c-.28.01-.58-.02-.84-.06z"/></svg>
                            </div>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Video TikTok</span>
                          </>
                        ) : item.media.source === 'instagram' ? (
                          <>
                            <div style={{ width: 50, height: 50, borderRadius: '14px', background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', boxShadow: '0 0 16px rgba(220,39,67,0.4)' }}>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                            </div>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Instagram Reel</span>
                          </>
                        ) : item.media.source === 'youtube' ? (
                          <>
                            <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', boxShadow: '0 0 16px rgba(239,68,68,0.4)' }}>
                              <Play size={22} color="white" fill="white" style={{ marginLeft: 2 }} />
                            </div>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>YouTube Video</span>
                          </>
                        ) : item.media.isDrive ? (
                          <>
                            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52,211,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                              {isVideo ? <VideoIcon size={22} color="#34D399" /> : <ImageIcon size={22} color="#34D399" />}
                            </div>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34D399' }}>
                              {isVideo ? 'Google Drive Video' : 'Google Drive Foto'}
                            </span>
                          </>
                        ) : (
                          <>
                            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                              {isVideo ? <VideoIcon size={22} /> : <ImageIcon size={22} />}
                            </div>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Dokumentasi</span>
                          </>
                        )}
                      </div>

                      {/* Video Play Overlay */}
                      {isVideo && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.3s',
                          }}
                        >
                          <div
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: '50%',
                              background: 'rgba(16, 185, 129, 0.9)',
                              backdropFilter: 'blur(8px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#081C16',
                              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                              transition: 'transform 0.2s, background 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.15)';
                              e.currentTarget.style.background = '#34D399';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.9)';
                            }}
                          >
                            <Play size={24} fill="#081C16" style={{ marginLeft: 3 }} />
                          </div>
                        </div>
                      )}

                      {/* Platform & Media Type Badge on top right */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '0.75rem',
                          right: '0.75rem',
                          display: 'flex',
                          gap: '0.4rem',
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.25rem 0.6rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            background: 'rgba(8, 28, 22, 0.85)',
                            color: isVideo ? '#34D399' : 'var(--antique-brass-light)',
                            border: isVideo ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(181, 141, 79, 0.3)',
                            backdropFilter: 'blur(6px)',
                          }}
                        >
                          {isVideo ? <VideoIcon size={11} /> : <Maximize2 size={11} />}
                          {item.media.platformName.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Card Meta Content */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span className="badge badge-brass" style={{ fontSize: '0.7rem' }}>
                          {item.category || 'Dokumentasi'}
                        </span>
                        {item.date && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'rgba(13,43,34,0.5)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <Calendar size={12} />
                            {new Date(item.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>

                      <h3
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: 'var(--deep-pine)',
                          lineHeight: 1.35,
                          marginBottom: '0.45rem',
                        }}
                      >
                        {item.title}
                      </h3>

                      {item.description && (
                        <p
                          style={{
                            fontSize: '0.82rem',
                            color: 'rgba(13,43,34,0.65)',
                            lineHeight: 1.5,
                            marginTop: 'auto',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 1.5rem', color: 'rgba(13,43,34,0.45)' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(13,43,34,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <ImageIcon size={30} style={{ opacity: 0.5 }} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--deep-pine)', marginBottom: '0.35rem' }}>
                Tidak ada media ditemukan
              </h3>
              <p style={{ fontSize: '0.85rem' }}>Coba ubah filter kategori atau jenis media di atas.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── MULTI-PLATFORM MEDIA MODAL (LIGHTBOX) ── */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 20, 16, 0.92)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: activeItem.media.source === 'tiktok' ? 440 : activeItem.media.source === 'instagram' ? 480 : 920,
              background: 'var(--deep-pine-dark)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                  {activeItem.category || 'Dokumentasi'}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--warm-alabaster)',
                    background: 'rgba(255,255,255,0.08)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600,
                  }}
                >
                  {activeItem.media.platformName}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {activeItem.media.directUrl && (
                  <a
                    href={activeItem.media.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Buka media langsung di tab baru"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '50%',
                      width: 34,
                      height: 34,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--warm-alabaster)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textDecoration: 'none',
                    }}
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
                <button
                  onClick={() => setActiveItem(null)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '50%',
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--warm-alabaster)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.85)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body / Media Viewport */}
            <div
              style={{
                background: '#051410',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                minHeight: 280,
              }}
            >
              {activeItem.media.mediaType === 'video' ? (
                activeItem.media.source === 'tiktok' ? (
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '1rem', background: '#000' }}>
                    <iframe
                      src={activeItem.media.embedUrl}
                      title={activeItem.title}
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        width: '100%',
                        maxWidth: 340,
                        height: 'min(70vh, 580px)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                      }}
                    />
                  </div>
                ) : activeItem.media.source === 'instagram' ? (
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '1rem', background: '#000' }}>
                    <iframe
                      src={activeItem.media.embedUrl}
                      title={activeItem.title}
                      allowTransparency="true"
                      allow="autoplay; fullscreen"
                      style={{
                        width: '100%',
                        maxWidth: 380,
                        height: 'min(70vh, 560px)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        background: 'white',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      position: 'relative',
                      paddingBottom: '56.25%', // 16:9 Aspect Ratio
                      height: 0,
                    }}
                  >
                    <iframe
                      src={activeItem.media.embedUrl}
                      title={activeItem.title}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                      }}
                    />
                  </div>
                )
              ) : (
                <div
                  style={{
                    maxHeight: '65vh',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    position: 'relative',
                  }}
                >
                  <img
                    src={activeItem.media.thumbnailUrl || activeItem.media.directUrl}
                    alt={activeItem.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const cur = e.currentTarget.src;
                      if (activeItem.media.fallbackThumbnailUrl && cur !== activeItem.media.fallbackThumbnailUrl) {
                        e.currentTarget.src = activeItem.media.fallbackThumbnailUrl;
                      } else if (activeItem.media.tertiaryThumbnailUrl && cur !== activeItem.media.tertiaryThumbnailUrl) {
                        e.currentTarget.src = activeItem.media.tertiaryThumbnailUrl;
                      }
                    }}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '60vh',
                      objectFit: 'contain',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                    }}
                  />
                </div>
              )}

              {/* Prev Button */}
              {filteredItems.length > 1 && (
                <button
                  onClick={handlePrev}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(8,28,22,0.75)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s',
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.85)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(8,28,22,0.75)')}
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              {/* Next Button */}
              {filteredItems.length > 1 && (
                <button
                  onClick={handleNext}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(8,28,22,0.75)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s',
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.85)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(8,28,22,0.75)')}
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            {/* Modal Footer / Description Info */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                background: 'var(--deep-pine)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <h2
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--warm-alabaster)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {activeItem.title}
                  </h2>

                  {activeItem.description && (
                    <p
                      style={{
                        fontSize: '0.88rem',
                        color: 'rgba(245,242,237,0.7)',
                        lineHeight: 1.5,
                        marginTop: '0.4rem',
                      }}
                    >
                      {activeItem.description}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                  {activeItem.date && (
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(245,242,237,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Calendar size={13} />
                      {new Date(activeItem.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  )}

                  {activeItem.media.directUrl && (
                    <a
                      href={activeItem.media.directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm"
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        color: 'var(--emerald-light)',
                        fontSize: '0.75rem',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        marginTop: '0.25rem',
                      }}
                    >
                      Buka di {activeItem.media.platformName} <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
