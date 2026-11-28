import React, { useEffect, useMemo, useState } from 'react';
import {
    Image as ImageIcon,
    Video,
    X,
    Maximize2,
    Calendar,
    MapPin,
    FolderOpen,
    Search,
    Sparkles,
    BookOpen,
    HeartHandshake,
    Users,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { fetchCmsData, getDriveImageUrl } from '../services/cmsService';
import {
    Eyebrow,
    FramedPhoto,
    GlassChip,
    SoftCard,
} from '../components/ui/SoftUI';

const DEFAULT_GALLERY = [
    {
        id: 'gal-1',
        title: 'Kebersamaan Kader ROKABA',
        subtitle: 'SMAN 1 Baturraden',
        category: 'Sosial',
        type: 'Foto',
        date: 'Februari 2026',
        image: '/documentation/01-kebersamaan.jpg',
        featured: true,
    },
    {
        id: 'gal-2',
        title: 'Musyawarah & Kaderisasi',
        subtitle: 'Koordinasi pengurus lintas sekolah',
        category: 'Organisasi',
        type: 'Foto',
        date: 'Januari 2026',
        image: '/documentation/02-muskerda.jpg',
        featured: false,
    },
    {
        id: 'gal-3',
        title: 'Kajian Pelajar',
        subtitle: 'Pembinaan ruhiyah dan diskusi',
        category: 'Kajian',
        type: 'Foto',
        date: 'Januari 2026',
        image: '/documentation/03-kajian.jpg',
        featured: false,
    },
    {
        id: 'gal-4',
        title: 'Temu Koordinasi Wilayah',
        subtitle: 'Silaturahmi 17 ROHIS sekolah anggota',
        category: 'Organisasi',
        type: 'Foto',
        date: 'Maret 2026',
        image: '/documentation/04-kegiatan.jpg',
        featured: false,
    },
    {
        id: 'gal-5',
        title: 'Workshop Media & Kepemimpinan',
        subtitle: 'Pelatihan jurnalistik dan manajemen ROHIS',
        category: 'Kajian',
        type: 'Foto',
        date: 'Februari 2026',
        image: '/documentation/05-workshop.jpg',
        featured: false,
    },
];

const ALBUMS = [
    {
        title: 'Kajian & Pembinaan',
        count: '12 dokumentasi',
        category: 'Kajian',
        desc: 'Halaqah pelajar, kajian lintas sekolah, dan mentoring adab.',
    },
    {
        title: 'Musyawarah & Organisasi',
        count: '9 dokumentasi',
        category: 'Organisasi',
        desc: 'Muskerda, rapat koordinasi BPH & divisi, serta temu pengurus.',
    },
    {
        title: 'Kebersamaan & Sosial',
        count: '15 dokumentasi',
        category: 'Sosial',
        desc: 'Rihlah ukhuwah, silaturahmi akbar, dan kepedulian pelajar.',
    },
];

const FILTERS = [
    { key: 'Semua', label: 'Semua', icon: Sparkles },
    { key: 'Foto', label: 'Foto', icon: ImageIcon },
    { key: 'Video', label: 'Video', icon: Video },
    { key: 'Kajian', label: 'Kajian', icon: BookOpen },
    { key: 'Sosial', label: 'Sosial', icon: HeartHandshake },
    { key: 'Organisasi', label: 'Organisasi', icon: Users },
];

function resolvePhotoUrl(raw, fallback) {
    if (!raw) return fallback;
    if (raw.startsWith('http') || raw.startsWith('/')) return raw;
    return getDriveImageUrl(raw);
}

export default function Gallery() {
    const [cms, setCms] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [query, setQuery] = useState('');
    const [lightboxIdx, setLightboxIdx] = useState(-1);

    useEffect(() => {
        let mounted = true;
        fetchCmsData().then((data) => {
            if (mounted && data) setCms(data);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const items = useMemo(() => {
        const raw =
            Array.isArray(cms?.gallery) && cms.gallery.length > 0
                ? cms.gallery
                : DEFAULT_GALLERY;
        return raw.map((g, idx) => {
            const fallback = DEFAULT_GALLERY[idx % DEFAULT_GALLERY.length];
            return {
                id: g.id || fallback.id || `gal-${idx}`,
                title: g.title || g.caption || fallback.title,
                subtitle: g.subtitle || g.location || fallback.subtitle,
                category: g.category || fallback.category || 'Kegiatan',
                type: g.type || fallback.type || 'Foto',
                date: g.date || fallback.date || '2026',
                image: resolvePhotoUrl(g.image || g.url || g.photo, fallback.image),
                featured: idx === 0,
            };
        });
    }, [cms]);

    const filteredItems = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items.filter((item) => {
            const matchFilter =
                activeFilter === 'Semua' ||
                (activeFilter === 'Foto' &&
                    item.type.toLowerCase() === 'foto') ||
                (activeFilter === 'Video' &&
                    item.type.toLowerCase() === 'video') ||
                item.category.toLowerCase() === activeFilter.toLowerCase();
            const matchQuery =
                !q ||
                item.title.toLowerCase().includes(q) ||
                item.subtitle.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q);
            return matchFilter && matchQuery;
        });
    }, [items, activeFilter, query]);

    const activeLightboxItem =
        lightboxIdx >= 0 && lightboxIdx < filteredItems.length
            ? filteredItems[lightboxIdx]
            : null;

    const handlePrev = (e) => {
        e.stopPropagation();
        setLightboxIdx((prev) =>
            prev <= 0 ? filteredItems.length - 1 : prev - 1
        );
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setLightboxIdx((prev) =>
            prev >= filteredItems.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="rk-page">
            <section className="rk-hero-section">
                <div className="rk-container">
                    <div className="rk-page-header-row">
                        <div>
                            <Eyebrow>Arsip Visual</Eyebrow>
                            <h1 className="rk-page-title">Galeri Dokumentasi</h1>
                            <p className="rk-page-lead" style={{ marginTop: 10 }}>
                                Arsip visual kegiatan kebersamaan, kajian, musyawarah,
                                dan kaderisasi ROHIS Kabupaten Banyumas.
                            </p>
                        </div>

                        <div className="rk-search-box rk-search-box--header">
                            <Search size={17} />
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari galeri..."
                                aria-label="Cari dokumentasi galeri"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    aria-label="Hapus pencarian"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* FILTER PILLS */}
                    <div className="rk-filter-bar" style={{ marginTop: 22 }}>
                        <div
                            className="rk-filter-pills"
                            role="tablist"
                            aria-label="Filter galeri"
                        >
                            {FILTERS.map((f) => {
                                const IconComp = f.icon;
                                const active = activeFilter === f.key;
                                return (
                                    <button
                                        key={f.key}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        className={`rk-filter-pill ${
                                            active ? 'is-active' : ''
                                        }`}
                                        onClick={() => setActiveFilter(f.key)}
                                    >
                                        <IconComp size={14} />
                                        <span>{f.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* BENTO MOSAIC GRID (PAPAN 11-GALERI-PC) */}
                    {filteredItems.length > 0 ? (
                        <div
                            className="rk-gallery-bento"
                            style={{ marginTop: 24 }}
                        >
                            {filteredItems.map((item, idx) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`rk-gallery-tile ${
                                        idx === 0 ? 'rk-gallery-tile--featured' : ''
                                    }`}
                                    onClick={() => setLightboxIdx(idx)}
                                >
                                    <FramedPhoto
                                        src={item.image}
                                        alt={item.title}
                                        captionTitle={item.title}
                                        captionSub={`${item.subtitle} • ${item.category}`}
                                        aspectRatio={
                                            idx === 0 ? '16 / 11' : '16 / 10'
                                        }
                                    />
                                    <span
                                        className="rk-gallery-zoom-badge"
                                        aria-hidden="true"
                                    >
                                        <Maximize2 size={15} />
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <SoftCard className="rk-empty-card" style={{ marginTop: 24 }}>
                            <p>
                                Belum ada item dokumentasi pada kategori{' '}
                                <strong>{activeFilter}</strong>.
                            </p>
                            <button
                                type="button"
                                className="rk-btn-secondary"
                                onClick={() => {
                                    setActiveFilter('Semua');
                                    setQuery('');
                                }}
                            >
                                Lihat semua dokumentasi
                            </button>
                        </SoftCard>
                    )}
                </div>
            </section>

            {/* ALBUM KEGIATAN (PAPAN 11-GALERI-PC) */}
            <section className="rk-section">
                <div className="rk-container">
                    <div className="rk-section-head">
                        <div>
                            <h2
                                className="rk-section-title"
                                style={{ fontSize: '1.5rem' }}
                            >
                                Album kegiatan
                            </h2>
                        </div>
                    </div>

                    <div className="rk-albums-grid">
                        {ALBUMS.map((album) => (
                            <SoftCard
                                key={album.title}
                                className="rk-album-card rk-album-card--v3"
                                onClick={() => setActiveFilter(album.category)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="rk-album-head">
                                    <span className="rk-service-icon-badge">
                                        <FolderOpen size={20} />
                                    </span>
                                    <div>
                                        <h3>{album.title}</h3>
                                        <small style={{ color: 'var(--rk-muted)' }}>
                                            {album.count}
                                        </small>
                                    </div>
                                </div>
                                <p>{album.desc}</p>
                            </SoftCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* LIGHTBOX MODAL DENGAN TOMBOL PREV/NEXT (PAPAN 11-GALERI-PC) */}
            {activeLightboxItem && (
                <div
                    className="rk-modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-label={activeLightboxItem.title}
                    onClick={() => setLightboxIdx(-1)}
                >
                    <button
                        type="button"
                        className="rk-lightbox-nav rk-lightbox-nav--prev"
                        onClick={handlePrev}
                        aria-label="Foto sebelumnya"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <div
                        className="rk-modal-card rk-lightbox-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="rk-modal-head">
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                }}
                            >
                                <GlassChip>
                                    {activeLightboxItem.category}
                                </GlassChip>
                                <small style={{ color: 'var(--rk-muted)' }}>
                                    {lightboxIdx + 1} / {filteredItems.length}
                                </small>
                            </div>
                            <button
                                type="button"
                                className="rk-modal-close"
                                onClick={() => setLightboxIdx(-1)}
                                aria-label="Tutup pratinjau foto"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="rk-lightbox-media">
                            <img
                                key={activeLightboxItem.image}
                                className="rk-motion-content"
                                src={activeLightboxItem.image}
                                alt={activeLightboxItem.title}
                            />
                        </div>

                        <div className="rk-lightbox-caption">
                            <h3>{activeLightboxItem.title}</h3>
                            <div className="rk-detail-meta" style={{ marginTop: 6 }}>
                                <span>
                                    <MapPin size={14} />
                                    {activeLightboxItem.subtitle}
                                </span>
                                <span>
                                    <Calendar size={14} />
                                    {activeLightboxItem.date}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="rk-lightbox-nav rk-lightbox-nav--next"
                        onClick={handleNext}
                        aria-label="Foto berikutnya"
                    >
                        <ChevronRight size={22} />
                    </button>
                </div>
            )}
        </div>
    );
}
