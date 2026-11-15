import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar,
    Clock,
    MapPin,
    Sparkles,
    ListFilter,
    X,
    BookOpen,
    Award,
    HeartHandshake,
    Users,
    ArrowRight,
} from 'lucide-react';
import { fetchCmsData, getDriveImageUrl } from '../services/cmsService';
import FeatureCarousel from '../components/FeatureCarousel';
import {
    Eyebrow,
    FramedPhoto,
    GlassChip,
    PrimaryButton,
    SoftCard,
} from '../components/ui/SoftUI';

export const DEFAULT_EVENTS = [
    {
        id: 'evt-1',
        title: 'Kajian Pelajar & Silaturahmi ROHIS',
        category: 'Kajian',
        date: '18 Januari 2026',
        shortDate: '18 Jan',
        time: '08.30 – 11.30 WIB',
        location: 'Masjid Agung / Sekolah Anggota',
        status: 'Terdekat',
        image: '/documentation/03-kajian.jpg',
        description:
            'Kajian rutin dan temu pelajar lintas SMA, SMK, dan MA se-Kabupaten Banyumas untuk menguatkan ilmu, adab, dan persaudaraan.',
    },
    {
        id: 'evt-2',
        title: 'Musyawarah & Koordinasi Pengurus',
        category: 'Organisasi',
        date: '2 Februari 2026',
        shortDate: '02 Feb',
        time: '08.00 – 14.00 WIB',
        location: 'Sekretariat & Sekolah Tuan Rumah',
        status: 'Terjadwal',
        image: '/documentation/02-muskerda.jpg',
        description:
            'Forum koordinasi pengurus BPH dan lima divisi bersama perwakilan 17 ROHIS sekolah anggota untuk menyelaraskan agenda semester berjalan.',
    },
    {
        id: 'evt-3',
        title: 'Workshop Media & Kepemimpinan',
        category: 'Pelatihan',
        date: '16 Februari 2026',
        shortDate: '16 Feb',
        time: '08.30 – 13.00 WIB',
        location: 'Aula Pendidikan Banyumas',
        status: 'Terjadwal',
        image: '/documentation/05-workshop.jpg',
        description:
            'Pelatihan manajemen organisasi, komunikasi publik, penulisan rilis kegiatan, dan desain syiar visual bagi pengurus ROHIS sekolah.',
    },
    {
        id: 'evt-4',
        title: 'Silaturahmi Wilayah & Aksi Kepedulian Pelajar',
        category: 'Sosial',
        date: '1 Maret 2026',
        shortDate: '01 Mar',
        time: '08.00 – 12.00 WIB',
        location: 'SMAN 1 Baturraden & Sekitarnya',
        status: 'Terjadwal',
        image: '/documentation/01-kebersamaan.jpg',
        description:
            'Temu ukhuwah kader lintas sekolah yang dirangkai dengan aksi sosial dan berbagi manfaat bersama masyarakat sekitar.',
    },
    {
        id: 'evt-5',
        title: 'Persiapan Semarak RBC × PECETIKAH',
        category: 'Kajian',
        date: '15 Maret 2026',
        shortDate: '15 Mar',
        time: '09.00 – 13.00 WIB',
        location: 'Purwokerto, Kabupaten Banyumas',
        status: 'Mendatang',
        image: '/documentation/04-kegiatan.jpg',
        description:
            "Sosialisasi cabang lomba Da'i Muda, MTQ, Nasyid, Poster Dakwah, dan CCAI bagi seluruh ROHIS SMA, SMK, dan MA di Banyumas.",
    },
];

const EVENT_CATEGORIES = [
    { key: 'Semua', label: 'Semua', icon: Sparkles },
    { key: 'Kajian', label: 'Kajian', icon: BookOpen },
    { key: 'Pelatihan', label: 'Pelatihan', icon: Award },
    { key: 'Sosial', label: 'Sosial', icon: HeartHandshake },
    { key: 'Organisasi', label: 'Organisasi', icon: Users },
];

function resolvePhotoUrl(raw, fallback) {
    if (!raw) return fallback;
    if (raw.startsWith('http') || raw.startsWith('/')) return raw;
    return getDriveImageUrl(raw);
}

function getShortDate(dateStr = '', idx = 0) {
    const clean = String(dateStr).trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')} ${parts[1].slice(0, 3)}`;
    }
    return DEFAULT_EVENTS[idx % DEFAULT_EVENTS.length]?.shortDate || 'Agenda';
}

export default function Events() {
    const [cms, setCms] = useState(null);
    const [category, setCategory] = useState('Semua');
    const [viewMode, setViewMode] = useState('all'); // 'all' | 'list'
    const [selectedEventId, setSelectedEventId] = useState(null);

    useEffect(() => {
        let mounted = true;
        fetchCmsData().then((data) => {
            if (mounted && data) setCms(data);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const events = useMemo(() => {
        const raw =
            Array.isArray(cms?.events) && cms.events.length > 0
                ? cms.events
                : DEFAULT_EVENTS;
        return raw.map((evt, idx) => {
            const fallback = DEFAULT_EVENTS[idx % DEFAULT_EVENTS.length];
            const dateStr = evt.date || fallback.date;
            return {
                id: evt.id || fallback.id || `evt-${idx}`,
                title: evt.title || evt.name || fallback.title,
                category: evt.category || fallback.category || 'Kajian',
                date: dateStr,
                shortDate: evt.shortDate || getShortDate(dateStr, idx),
                time: evt.time || fallback.time || '08.30 WIB – Selesai',
                location: evt.location || fallback.location || 'Kabupaten Banyumas',
                status: evt.status || fallback.status || 'Terjadwal',
                image: resolvePhotoUrl(evt.image || evt.photo, fallback.image),
                description:
                    evt.description || evt.summary || fallback.description,
            };
        });
    }, [cms]);

    const filteredEvents = useMemo(() => {
        return events.filter((evt) => {
            if (category === 'Semua') return true;
            return (evt.category || '').toLowerCase() === category.toLowerCase();
        });
    }, [events, category]);

    const activeDetailEvent = useMemo(() => {
        if (selectedEventId) {
            const found = filteredEvents.find((e) => e.id === selectedEventId);
            if (found) return found;
        }
        return filteredEvents[0] || events[0];
    }, [filteredEvents, events, selectedEventId]);

    return (
        <div className="rk-page">
            {/* 1. HEADER & FILTER BAR */}
            <section className="rk-hero-section" style={{ paddingBottom: 16 }}>
                <div className="rk-container">
                    <div className="rk-section-head">
                        <div>
                            <Eyebrow>Kalender Kegiatan</Eyebrow>
                            <h1 className="rk-page-title">Agenda & Kajian</h1>
                            <p className="rk-page-lead" style={{ marginTop: 10 }}>
                                Jadwal kajian pelajar, musyawarah, pelatihan, dan kegiatan
                                bersama ROHIS Kabupaten Banyumas.
                            </p>
                        </div>
                    </div>

                    <div className="rk-filter-bar">
                        <div
                            className="rk-filter-pills"
                            role="tablist"
                            aria-label="Kategori agenda"
                        >
                            {EVENT_CATEGORIES.map((cat) => {
                                const IconComp = cat.icon;
                                const active = category === cat.key;
                                return (
                                    <button
                                        key={cat.key}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        className={`rk-filter-pill ${
                                            active ? 'is-active' : ''
                                        }`}
                                        onClick={() => setCategory(cat.key)}
                                    >
                                        <IconComp size={14} />
                                        <span>{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div
                            className="rk-view-toggle"
                            role="group"
                            aria-label="Tampilan agenda"
                        >
                            <button
                                type="button"
                                className={`rk-filter-pill ${
                                    viewMode === 'all' ? 'is-active' : ''
                                }`}
                                onClick={() => setViewMode('all')}
                            >
                                <Sparkles size={14} />
                                <span>Sorotan</span>
                            </button>
                            <button
                                type="button"
                                className={`rk-filter-pill ${
                                    viewMode === 'list' ? 'is-active' : ''
                                }`}
                                onClick={() => setViewMode('list')}
                            >
                                <ListFilter size={14} />
                                <span>Daftar kegiatan</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. CAROUSEL 3 KARTU AGENDA */}
            {viewMode === 'all' && (
                <FeatureCarousel
                    id="sorotan-agenda"
                    variant="agenda"
                    eyebrow="Agenda Terdekat"
                    title="Sorotan kegiatan bersama"
                    description="Pilih kartu untuk melihat waktu, lokasi, dan rincian kegiatan."
                    items={filteredEvents.length > 0 ? filteredEvents : events}
                />
            )}

            {/* 3. DAFTAR KEGIATAN + PANEL DETAIL KEGIATAN (PAPAN 09-AGENDA-PC) */}
            <section className="rk-section">
                <div className="rk-container">
                    <div className="rk-agenda-split-layout-v3">
                        {/* KOLOM KIRI: DAFTAR KEGIATAN */}
                        <div className="rk-agenda-list-col-v3">
                            <h2
                                className="rk-section-title"
                                style={{ fontSize: '1.5rem', marginBottom: 16 }}
                            >
                                Daftar kegiatan
                            </h2>

                            <div className="rk-agenda-list">
                                {filteredEvents.map((evt) => {
                                    const isSelected =
                                        activeDetailEvent?.id === evt.id;
                                    return (
                                        <SoftCard
                                            key={evt.id}
                                            as="article"
                                            className={`rk-agenda-row rk-agenda-row--v3 ${
                                                isSelected ? 'is-selected' : ''
                                            }`}
                                        >
                                            <div className="rk-agenda-date-badge">
                                                <Calendar size={16} />
                                                <span>{evt.shortDate}</span>
                                            </div>

                                            <div className="rk-agenda-row-main">
                                                <div className="rk-agenda-row-badges">
                                                    <GlassChip>{evt.category}</GlassChip>
                                                    <span className="rk-agenda-status">
                                                        {evt.status}
                                                    </span>
                                                </div>
                                                <h3>{evt.title}</h3>
                                                <div className="rk-agenda-row-meta">
                                                    <span>
                                                        <MapPin size={14} />
                                                        {evt.location}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="rk-agenda-row-action">
                                                <button
                                                    type="button"
                                                    className={`rk-btn-secondary ${
                                                        isSelected ? 'is-active-btn' : ''
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedEventId(evt.id)
                                                    }
                                                >
                                                    <span>Detail</span>
                                                    <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </SoftCard>
                                    );
                                })}
                            </div>
                        </div>

                        {/* KOLOM KANAN: DETAIL KEGIATAN */}
                        {activeDetailEvent && (
                            <aside className="rk-agenda-detail-col-v3">
                                <h2
                                    className="rk-section-title"
                                    style={{ fontSize: '1.5rem', marginBottom: 16 }}
                                >
                                    Detail kegiatan
                                </h2>

                                <SoftCard className="rk-agenda-detail-panel-v3">
                                    <FramedPhoto
                                        src={activeDetailEvent.image}
                                        alt={activeDetailEvent.title}
                                        captionTitle={activeDetailEvent.category}
                                        captionSub={activeDetailEvent.location}
                                        aspectRatio="16 / 9.5"
                                    />

                                    <div className="rk-agenda-detail-body">
                                        <div className="rk-agenda-row-badges">
                                            <GlassChip>
                                                {activeDetailEvent.category}
                                            </GlassChip>
                                            <span className="rk-agenda-status">
                                                {activeDetailEvent.status}
                                            </span>
                                        </div>

                                        <h3>{activeDetailEvent.title}</h3>

                                        <div className="rk-modal-meta-grid">
                                            <div>
                                                <Calendar size={15} />
                                                <span>{activeDetailEvent.date}</span>
                                            </div>
                                            <div>
                                                <Clock size={15} />
                                                <span>{activeDetailEvent.time}</span>
                                            </div>
                                            <div>
                                                <MapPin size={15} />
                                                <span>{activeDetailEvent.location}</span>
                                            </div>
                                        </div>

                                        <p>{activeDetailEvent.description}</p>

                                        <div style={{ marginTop: 6 }}>
                                            <PrimaryButton to="/contact">
                                                <span>Koordinasi Kehadiran</span>
                                                <ArrowRight size={15} />
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                </SoftCard>
                            </aside>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
