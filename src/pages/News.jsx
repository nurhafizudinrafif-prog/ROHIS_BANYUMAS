import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Calendar,
    User,
    ArrowRight,
    X,
    Sparkles,
    Users,
    BookOpen,
    HeartHandshake,
    Award,
} from 'lucide-react';
import { fetchCmsData, getDriveImageUrl } from '../services/cmsService';
import FeatureCarousel from '../components/FeatureCarousel';
import {
    Eyebrow,
    FramedPhoto,
    GlassChip,
    SoftCard,
} from '../components/ui/SoftUI';

export const DEFAULT_NEWS = [
    {
        id: 'news-1',
        slug: 'muskerda-rokaba-2026',
        title: 'Musyawarah & Rapat Kerja Pengurus ROHIS Kabupaten Banyumas',
        category: 'Organisasi',
        date: '12 Januari 2026',
        author: 'Jurnalistik ROKABA',
        location: 'Purwokerto, Banyumas',
        image: '/documentation/02-muskerda.jpg',
        summary:
            'Penyelarasan arah gerak lima divisi dan penguatan koordinasi 17 ROHIS sekolah anggota untuk periode kepengurusan berjalan.',
        content: [
            'ROHIS Kabupaten Banyumas (ROKABA) menyelenggarakan Musyawarah dan Rapat Kerja Pengurus sebagai langkah awal menyelaraskan program kerja lintas divisi pada periode kepengurusan berjalan.',
            'Dalam forum ini, pengurus BPH bersama lima divisi utama—SDM, Dakwah, Humas, Jurnalistik, dan Danus—merumuskan agenda kolaborasi yang ramah pelajar, terukur, serta relevan dengan kebutuhan ROHIS di tingkat SMA, SMK, dan MA.',
            'Melalui semangat satu ukhuwah, setiap program dirancang agar tidak berhenti sebagai seremonial semata, melainkan menjadi ruang bertumbuh yang hangat bagi kader di sekolah masing-masing.',
        ],
    },
    {
        id: 'news-2',
        slug: 'kajian-pelajar-lintas-sekolah',
        title: 'Kajian Pelajar & Halaqah Kebersamaan Lintas Sekolah Banyumas',
        category: 'Kajian',
        date: '26 Januari 2026',
        author: 'Divisi Dakwah',
        location: 'Masjid Agung & Sekolah Anggota',
        image: '/documentation/03-kajian.jpg',
        summary:
            'Menghadirkan ruang belajar keislaman yang sejuk, dialogis, dan menguatkan adab keseharian pelajar putih abu-abu.',
        content: [
            'Divisi Dakwah ROKABA kembali menggelar Kajian Pelajar Lintas Sekolah yang diikuti oleh perwakilan pengurus dan anggota ROHIS dari berbagai SMA, SMK, dan MA di Kabupaten Banyumas.',
            'Mengangkat tema keseimbangan antara prestasi akademik, adab pergaulan, dan ketekunan ibadah harian, sesi kajian berlangsung hangat dengan diskusi interaktif antar-pelajar.',
            'Para peserta juga saling berbagi praktik baik pengelolaan kajian rutin di sekolah masing-masing agar syiar Islam di lingkungan pelajar semakin hidup dan menyenangkan.',
        ],
    },
    {
        id: 'news-3',
        slug: 'silaturahmi-akbar-kader-rokaba',
        title: 'Silaturahmi & Kebersamaan Kader ROHIS se-Kabupaten Banyumas',
        category: 'Sosial',
        date: '9 Februari 2026',
        author: 'Divisi Humas',
        location: 'SMAN 1 Baturraden',
        image: '/documentation/01-kebersamaan.jpg',
        summary:
            'Mempererat persaudaraan antar-pengurus ROHIS sekolah melalui temu kader, diskusi jejaring, dan kolaborasi program.',
        content: [
            'Bertempat di lingkungan yang asri, kegiatan Silaturahmi Kader ROKABA mempertemukan puluhan pengurus ROHIS dari 17 sekolah anggota se-Kabupaten Banyumas.',
            'Selain sesi perkenalan dan pemetaan kolaborasi wilayah, kegiatan ini diisi dengan permainan ukhuwah, tukar gagasan program sekolah, serta doa bersama untuk keberkahan gerak dakwah pelajar.',
        ],
    },
    {
        id: 'news-4',
        slug: 'workshop-media-dan-kepemimpinan-rohis',
        title: 'Workshop Kepemimpinan & Literasi Media Dakwah Pelajar',
        category: 'Pelatihan',
        date: '22 Februari 2026',
        author: 'Divisi SDM & Jurnalistik',
        location: 'Aula Pendidikan Banyumas',
        image: '/documentation/05-workshop.jpg',
        summary:
            'Pelatihan manajemen organisasi dan pembuatan konten dakwah visual yang rapi, santun, serta komunikatif.',
        content: [
            'Kolaborasi Divisi SDM dan Jurnalistik menghadirkan Workshop Kepemimpinan dan Literasi Media bagi delegasi ROHIS sekolah.',
            'Peserta dibekali keterampilan menyusun alur kerja kepanitiaan, komunikasi publik yang efektif, serta kaidah penulisan rilis kegiatan dan dokumentasi fotografi.',
        ],
    },
    {
        id: 'news-5',
        slug: 'temu-koordinasi-rohis-sekolah-banyumas',
        title: 'Temu Koordinasi Wilayah & Kunjungan ROHIS Sekolah Anggota',
        category: 'Organisasi',
        date: '5 Maret 2026',
        author: 'Tim Humas ROKABA',
        location: 'Kabupaten Banyumas',
        image: '/documentation/04-kegiatan.jpg',
        summary:
            'Kunjungan silaturahmi untuk mendengar aspirasi dan mendukung program keislaman di masing-masing sekolah anggota.',
        content: [
            'Program kunjungan dan koordinasi sekolah menjadi jembatan penghubung antara pengurus kabupaten dengan pengurus ROHIS di tingkat satuan pendidikan.',
            'Melalui dialog langsung, ROKABA mendata kebutuhan pendampingan mentor, pemateri kajian, serta peluang kolaborasi kegiatan bersama.',
        ],
    },
];

const CATEGORIES = [
    { key: 'Semua', label: 'Semua', icon: Sparkles },
    { key: 'Organisasi', label: 'Organisasi', icon: Users },
    { key: 'Kajian', label: 'Kajian', icon: BookOpen },
    { key: 'Sosial', label: 'Sosial', icon: HeartHandshake },
    { key: 'Pelatihan', label: 'Pelatihan', icon: Award },
];

function resolvePhotoUrl(raw, fallback) {
    if (!raw) return fallback;
    if (raw.startsWith('http') || raw.startsWith('/')) return raw;
    return getDriveImageUrl(raw);
}

export default function News() {
    const [cms, setCms] = useState(null);
    const [category, setCategory] = useState('Semua');
    const [query, setQuery] = useState('');

    useEffect(() => {
        let mounted = true;
        fetchCmsData().then((data) => {
            if (mounted && data) setCms(data);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const newsItems = useMemo(() => {
        const rawList =
            Array.isArray(cms?.newsList) && cms.newsList.length > 0
                ? cms.newsList
                : DEFAULT_NEWS;
        return rawList.map((item, idx) => {
            const fallback = DEFAULT_NEWS[idx % DEFAULT_NEWS.length];
            return {
                id: item.id || fallback.id || `news-${idx}`,
                slug: item.slug || fallback.slug || `berita-${idx + 1}`,
                title: item.title || fallback.title,
                category: item.category || fallback.category || 'Kegiatan',
                date: item.date || fallback.date,
                author: item.author || fallback.author || 'Jurnalistik ROKABA',
                location: item.location || fallback.location || 'Kabupaten Banyumas',
                image: resolvePhotoUrl(item.image || item.photo, fallback.image),
                summary:
                    item.summary ||
                    item.excerpt ||
                    item.description ||
                    fallback.summary,
            };
        });
    }, [cms]);

    const filteredNews = useMemo(() => {
        const q = query.trim().toLowerCase();
        return newsItems.filter((item) => {
            const matchCat =
                category === 'Semua' ||
                (item.category || '').toLowerCase() === category.toLowerCase();
            const matchQuery =
                !q ||
                item.title.toLowerCase().includes(q) ||
                item.summary.toLowerCase().includes(q) ||
                (item.category || '').toLowerCase().includes(q);
            return matchCat && matchQuery;
        });
    }, [newsItems, category, query]);

    return (
        <div className="rk-page">
            {/* 1. HEADER & FILTER BAR */}
            <section className="rk-hero-section" style={{ paddingBottom: 16 }}>
                <div className="rk-container">
                    <div className="rk-page-header-row">
                        <div>
                            <Eyebrow>Rilis & Dokumentasi</Eyebrow>
                            <h1 className="rk-page-title">Berita & Kegiatan</h1>
                            <p className="rk-page-lead" style={{ marginTop: 10 }}>
                                Cerita kegiatan, rilis organisasi, dan dokumentasi
                                perjalanan ROHIS Kabupaten Banyumas.
                            </p>
                        </div>

                        <div className="rk-search-box rk-search-box--header">
                            <Search size={17} />
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari berita..."
                                aria-label="Cari berita ROKABA"
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

                    <div className="rk-filter-bar" style={{ marginTop: 22 }}>
                        <div
                            className="rk-filter-pills"
                            role="tablist"
                            aria-label="Kategori berita"
                        >
                            {CATEGORIES.map((cat) => {
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
                    </div>
                </div>
            </section>

            {/* 2. SOROTAN CAROUSEL 3 KARTU */}
            <FeatureCarousel
                id="sorotan-berita"
                variant="news"
                eyebrow="Sorotan Utama"
                title="Kabar pilihan pekan ini"
                description="Geser atau pilih kartu untuk membaca dokumentasi kegiatan terbaru."
                items={filteredNews.length > 0 ? filteredNews : newsItems}
            />

            {/* 3. BERITA LAINNYA (STRIP KARTU HORIZONTAL & ARSIP LENGKAP) */}
            <section className="rk-section">
                <div className="rk-container">
                    <div className="rk-section-head">
                        <div>
                            <h2 className="rk-section-title" style={{ fontSize: '1.55rem' }}>
                                Berita lainnya
                            </h2>
                        </div>
                    </div>

                    {filteredNews.length > 0 ? (
                        <div className="rk-other-news-grid-v3">
                            {filteredNews.map((item) => (
                                <SoftCard
                                    key={item.id}
                                    as="article"
                                    className="rk-other-news-card-v3"
                                >
                                    <Link
                                        to={`/berita/${item.slug}`}
                                        className="rk-other-news-thumb"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            loading="lazy"
                                        />
                                    </Link>

                                    <div className="rk-other-news-body">
                                        <div className="rk-other-news-meta">
                                            <GlassChip>{item.category}</GlassChip>
                                            <span>{item.date}</span>
                                        </div>

                                        <h3>
                                            <Link to={`/berita/${item.slug}`}>
                                                {item.title}
                                            </Link>
                                        </h3>

                                        <p>{item.summary}</p>

                                        <div className="rk-other-news-footer">
                                            <span className="rk-news-card-author">
                                                <User size={13} />
                                                {item.author}
                                            </span>
                                            <Link
                                                to={`/berita/${item.slug}`}
                                                className="rk-inline-btn-pill"
                                            >
                                                <span>Baca</span>
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </SoftCard>
                            ))}
                        </div>
                    ) : (
                        <SoftCard className="rk-empty-card">
                            <p>
                                Belum ada berita yang cocok dengan pencarian{' '}
                                <strong>“{query}”</strong> pada kategori{' '}
                                <strong>{category}</strong>.
                            </p>
                            <button
                                type="button"
                                className="rk-btn-secondary"
                                onClick={() => {
                                    setCategory('Semua');
                                    setQuery('');
                                }}
                            >
                                Reset filter
                            </button>
                        </SoftCard>
                    )}
                </div>
            </section>
        </div>
    );
}
