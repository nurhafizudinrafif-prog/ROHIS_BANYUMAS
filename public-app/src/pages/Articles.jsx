import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    BookOpen,
    Clock,
    User,
    ArrowRight,
    X,
    Sparkles,
    Compass,
    Heart,
    Award,
} from 'lucide-react';
import { fetchCmsData, getDriveImageUrl } from '../services/cmsService';
import {
    Eyebrow,
    GlassChip,
    PrimaryButton,
    SoftCard,
} from '../components/ui/SoftUI';

export const DEFAULT_ARTICLES = [
    {
        id: 'art-1',
        slug: 'menjaga-semangat-belajar-dan-berorganisasi',
        title: 'Menjaga Semangat Belajar dan Berorganisasi',
        category: 'Motivasi',
        readTime: '4 menit baca',
        date: '15 Januari 2026',
        author: 'Tim Literasi ROKABA',
        image: '/documentation/03-kajian.jpg',
        excerpt:
            'Kiat praktis mengatur prioritas waktu bagi pelajar Muslim agar prestasi kelas dan amanah organisasi berjalan selaras.',
        takeaways: [
            'Tetapkan prioritas harian dan mingguan secara tertulis.',
            'Komunikasikan jadwal dengan guru, orang tua, dan rekan pengurus.',
            'Jaga waktu istirahat serta ibadah tepat waktu sebagai penguat fokus.',
        ],
        quote:
            'Belajar yang tertib dan organisasi yang sehat akan saling menguatkan.',
        content: [
            'Banyak pelajar merasa ragu aktif di organisasi karena khawatir waktu belajarnya tersita. Padahal, ketika dikelola dengan adab dan perencanaan yang rapi, aktivitas di ROHIS justru melatih kedisiplinan yang sangat membantu di ruang kelas.',
            'Kunci pertamanya adalah memandang belajar sebagai amanah utama seorang penuntut ilmu, sementara berorganisasi adalah laboratorium amal untuk mempraktikkan ilmu dan kepemimpinan bersama teman sebaya.',
            'Gunakan catatan pekanan sederhana untuk memisahkan tugas akademik yang mendesak dan agenda rapat atau kegiatan ROHIS. Jangan ragu berbagi peran secara sehat dengan rekan satu divisi agar tidak ada satu orang pun yang memikul beban sendirian.',
        ],
    },
    {
        id: 'art-2',
        slug: 'adab-berteman-di-sekolah',
        title: 'Adab Berteman di Sekolah',
        category: 'Ibadah',
        readTime: '3 menit baca',
        date: '22 Januari 2026',
        author: 'Divisi Dakwah ROKABA',
        image: '/documentation/01-kebersamaan.jpg',
        excerpt:
            'Menumbuhkan pertemanan yang saling mendoakan, menjaga lisan, dan mengingatkan dalam kebaikan.',
        takeaways: [
            'Mulai perjumpaan dengan senyum dan salam yang tulus.',
            'Jaga rahasia dan kehormatan teman, baik saat bersama maupun di media sosial.',
            'Saling mengingatkan dalam ibadah dan semangat menuntut ilmu.',
        ],
        quote:
            'Teman yang baik adalah yang kehadirannya membuatmu lebih dekat kepada kebaikan.',
        content: [
            'Masa SMA, SMK, dan MA adalah masa di mana lingkar pertemanan memberi warna besar bagi cara pandang dan kebiasaan harian kita. Islam menempatkan adab bersahabat sebagai bagian dari kemuliaan akhlak.',
            'Menjadi kader ROHIS berarti belajar hadir sebagai teman yang menenangkan: ramah menyapa siapa saja di sekolah, menjaga lisan dari candaan yang melukai, serta siap membantu teman yang sedang kesulitan belajar.',
        ],
    },
    {
        id: 'art-3',
        slug: 'belajar-memimpin-dengan-keteladanan',
        title: 'Belajar Memimpin dengan Keteladanan',
        category: 'Kepemimpinan',
        readTime: '5 menit baca',
        date: '2 Februari 2026',
        author: 'Divisi SDM ROKABA',
        image: '/documentation/02-muskerda.jpg',
        excerpt:
            'Kepemimpinan di ROHIS dimulai dari ketulusan mendengar, menepati janji, dan hadir membersamai anggota.',
        takeaways: [
            'Hadir tepat waktu dan menepati kesepakatan musyawarah.',
            'Mendengar aspirasi anggota sebelum mengambil keputusan.',
            'Mengapresiasi setiap kontribusi kecil rekan satu tim.',
        ],
        quote:
            'Pemimpin terbaik di kalangan pelajar adalah yang paling tulus melayani dan menguatkan temannya.',
        content: [
            'Memimpin teman sebaya di lingkungan sekolah memiliki tantangan tersendiri. Kita tidak memimpin dengan instruksi kaku, melainkan dengan keteladanan sikap dan kesediaan mendengar.',
            'Musyawarah di ROHIS menjadi tempat kita berlatih menghargai perbedaan pendapat, menyusun rencana kegiatan secara tertib, dan mengevaluasi program dengan bahasa yang membangun.',
        ],
    },
    {
        id: 'art-4',
        slug: 'menjaga-konsistensi-kebaikan-kecil',
        title: 'Menjaga Konsistensi Kebaikan Kecil setiap Hari',
        category: 'Ibadah',
        readTime: '4 menit baca',
        date: '14 Februari 2026',
        author: 'Kemuslimahan ROKABA',
        image: '/documentation/04-kegiatan.jpg',
        excerpt:
            'Bagaimana amalan ringan yang dilakukan rutin di sela jam sekolah mampu menjaga ketenangan hati pelajar.',
        takeaways: [
            'Tilawah beberapa ayat Al-Qur’an sebelum memulai belajar.',
            'Menjaga wudhu dan shalat tepat waktu di masjid sekolah.',
            'Menutup hari dengan evaluasi diri dan doa bagi orang tua serta guru.',
        ],
        quote:
            'Amalan yang paling dicintai adalah yang dijaga keberlanjutannya meskipun sederhana.',
        content: [
            'Di tengah padatnya tugas sekolah, praktikum, dan kegiatan ekstrakurikuler, sering kali kita menunggu waktu luang yang panjang untuk beramal. Padahal, keberkahan justru tumbuh dari kebaikan-kebaikan kecil yang dijaga secara konsisten.',
            'Membaca beberapa ayat Al-Qur’an sebelum belajar, menjaga shalat berjamaah di masjid sekolah, atau merapikan kembali alas duduk setelah kajian adalah kebiasaan sederhana yang menata hati tetap jernih.',
        ],
    },
    {
        id: 'art-5',
        slug: 'dakwah-kreatif-dan-santun-di-ruang-digital',
        title: 'Dakwah Kreatif dan Santun di Ruang Digital',
        category: 'Kepemimpinan',
        readTime: '4 menit baca',
        date: '28 Februari 2026',
        author: 'Divisi Jurnalistik ROKABA',
        image: '/documentation/05-workshop.jpg',
        excerpt:
            'Merangkai pesan visual dan tulisan dakwah yang jernih, terverifikasi, serta menyejukkan lini masa pelajar.',
        takeaways: [
            'Pastikan kesahihan dalil dan kutipan sebelum dipublikasikan.',
            'Gunakan bahasa yang merangkul dan desain yang nyaman dibaca.',
            'Jadikan media sosial ROHIS sebagai ruang apresiasi karya pelajar.',
        ],
        quote:
            'Setiap unggahan kebaikan adalah jejak cahaya yang bisa menguatkan pembaca tanpa kita sadari.',
        content: [
            'Media sosial telah menjadi halaman depan bagi banyak ROHIS sekolah. Sebuah poster pengingat singkat atau rangkuman kajian bisa menjangkau ratusan pelajar yang mungkin belum sempat hadir di majelis langsung.',
            'Karena itu, tim media dan jurnalistik ROHIS perlu menjaga tiga hal utama: keakuratan kutipan ilmu, bahasa yang santun tanpa menghakimi, serta tampilan visual yang bersih dan nyaman dibaca.',
        ],
    },
];

const ARTICLE_CATEGORIES = [
    { key: 'Semua', label: 'Semua', icon: Sparkles },
    { key: 'Motivasi', label: 'Motivasi', icon: Award },
    { key: 'Ibadah', label: 'Ibadah', icon: Heart },
    { key: 'Kepemimpinan', label: 'Kepemimpinan', icon: Compass },
];

function resolvePhotoUrl(raw, fallback) {
    if (!raw) return fallback;
    if (raw.startsWith('http') || raw.startsWith('/')) return raw;
    return getDriveImageUrl(raw);
}

export default function Articles() {
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

    const articles = useMemo(() => {
        const raw =
            Array.isArray(cms?.articles) && cms.articles.length > 0
                ? cms.articles
                : DEFAULT_ARTICLES;
        return raw.map((item, idx) => {
            const fallback = DEFAULT_ARTICLES[idx % DEFAULT_ARTICLES.length];
            return {
                id: item.id || fallback.id || `art-${idx}`,
                slug: item.slug || fallback.slug || `artikel-${idx + 1}`,
                title: item.title || fallback.title,
                category: item.category || fallback.category || 'Motivasi',
                readTime: item.readTime || fallback.readTime || '4 menit baca',
                date: item.date || fallback.date,
                author: item.author || fallback.author || 'Tim Literasi ROKABA',
                image: resolvePhotoUrl(item.image || item.photo, fallback.image),
                excerpt:
                    item.excerpt ||
                    item.summary ||
                    item.description ||
                    fallback.excerpt,
            };
        });
    }, [cms]);

    const filteredArticles = useMemo(() => {
        const q = query.trim().toLowerCase();
        return articles.filter((a) => {
            const matchCat =
                category === 'Semua' ||
                (a.category || '').toLowerCase() === category.toLowerCase();
            const matchQuery =
                !q ||
                a.title.toLowerCase().includes(q) ||
                a.excerpt.toLowerCase().includes(q) ||
                (a.author || '').toLowerCase().includes(q);
            return matchCat && matchQuery;
        });
    }, [articles, category, query]);

    const featured = filteredArticles[0];
    const rest = filteredArticles.slice(1);

    return (
        <div className="rk-page">
            <section className="rk-hero-section">
                <div className="rk-container">
                    <div className="rk-section-head">
                        <div>
                            <Eyebrow>Literasi & Catatan Pelajar</Eyebrow>
                            <h1 className="rk-page-title">Artikel Dakwah</h1>
                            <p className="rk-page-lead" style={{ marginTop: 10 }}>
                                Tulisan singkat seputar iman, adab, belajar, dan
                                kepemimpinan pelajar.
                            </p>
                        </div>
                    </div>

                    {/* FILTER KATEGORI & PENCARIAN */}
                    <div className="rk-filter-bar">
                        <div
                            className="rk-filter-pills"
                            role="tablist"
                            aria-label="Kategori artikel dakwah"
                        >
                            {ARTICLE_CATEGORIES.map((cat) => {
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

                        <div className="rk-search-box">
                            <Search size={17} />
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari artikel..."
                                aria-label="Cari artikel dakwah"
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

                    {/* ARTIKEL PILIHAN UTAMA DENGAN FOTO (PAPAN 08-ARTIKEL-PC) */}
                    {featured ? (
                        <>
                            <SoftCard
                                className="rk-article-featured-v3"
                                style={{ marginTop: 24 }}
                            >
                                <Link
                                    to={`/articles/${featured.slug}`}
                                    className="rk-article-featured-thumb"
                                >
                                    <img
                                        src={featured.image}
                                        alt={featured.title}
                                        loading="lazy"
                                    />
                                </Link>

                                <div className="rk-article-featured-copy">
                                    <div className="rk-article-meta-row">
                                        <GlassChip>{featured.category}</GlassChip>
                                        <span>
                                            <Clock size={14} />
                                            {featured.readTime}
                                        </span>
                                        <span>{featured.date}</span>
                                    </div>

                                    <h2>
                                        <Link to={`/articles/${featured.slug}`}>
                                            {featured.title}
                                        </Link>
                                    </h2>

                                    <p>{featured.excerpt}</p>

                                    <div className="rk-article-featured-footer">
                                        <span className="rk-news-card-author">
                                            <User size={15} />
                                            {featured.author}
                                        </span>
                                        <PrimaryButton to={`/articles/${featured.slug}`}>
                                            <span>Baca selengkapnya</span>
                                            <ArrowRight size={16} />
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </SoftCard>

                            {/* DAFTAR ARTIKEL LAINNYA (GRID 2 KOLOM BERGAMBAR) */}
                            {rest.length > 0 && (
                                <div
                                    className="rk-articles-grid-v3"
                                    style={{ marginTop: 22 }}
                                >
                                    {rest.map((art) => (
                                        <SoftCard
                                            key={art.id}
                                            as="article"
                                            className="rk-article-card-v3"
                                        >
                                            <Link
                                                to={`/articles/${art.slug}`}
                                                className="rk-article-card-thumb"
                                            >
                                                <img
                                                    src={art.image}
                                                    alt={art.title}
                                                    loading="lazy"
                                                />
                                            </Link>

                                            <div className="rk-article-card-body-v3">
                                                <div className="rk-article-meta-row">
                                                    <GlassChip>{art.category}</GlassChip>
                                                    <span>{art.date}</span>
                                                </div>

                                                <h3>
                                                    <Link to={`/articles/${art.slug}`}>
                                                        {art.title}
                                                    </Link>
                                                </h3>

                                                <p>{art.excerpt}</p>

                                                <div className="rk-article-card-footer-v3">
                                                    <span className="rk-news-card-author">
                                                        <Clock size={13} />
                                                        {art.readTime}
                                                    </span>
                                                    <Link
                                                        to={`/articles/${art.slug}`}
                                                        className="rk-article-arrow-btn"
                                                        aria-label={`Baca ${art.title}`}
                                                    >
                                                        <ArrowRight size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </SoftCard>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <SoftCard className="rk-empty-card" style={{ marginTop: 24 }}>
                            <p>
                                Tidak ditemukan artikel untuk kategori{' '}
                                <strong>{category}</strong> dan kata kunci{' '}
                                <strong>“{query}”</strong>.
                            </p>
                            <button
                                type="button"
                                className="rk-btn-secondary"
                                onClick={() => {
                                    setCategory('Semua');
                                    setQuery('');
                                }}
                            >
                                Tampilkan semua artikel
                            </button>
                        </SoftCard>
                    )}
                </div>
            </section>
        </div>
    );
}
