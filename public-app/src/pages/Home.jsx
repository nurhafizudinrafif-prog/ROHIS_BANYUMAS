import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    School,
    Users,
    Layers,
    CalendarCheck,
} from 'lucide-react';
import { fetchCmsData, getDriveImageUrl } from '../services/cmsService';
import FeatureCarousel from '../components/FeatureCarousel';
import {
    Eyebrow,
    FramedPhoto,
    PrimaryButton,
    SecondaryButton,
    SoftCard,
} from '../components/ui/SoftUI';

const DEFAULT_HERO = {
    badge: 'Forum Komunikasi ROHIS Kabupaten Banyumas',
    titleLine1: 'Satu ukhuwah.',
    titleLine2: 'Banyak langkah kebaikan.',
    subtitle:
        'Ruang bertumbuh bagi pelajar Muslim SMA, SMK, dan MA di Banyumas untuk belajar, berjejaring, dan menghadirkan karya yang bermanfaat.',
    ctaPrimaryText: 'Mengenal ROKABA',
    ctaPrimaryLink: '/about',
    ctaSecondaryText: 'Jelajahi program',
    ctaSecondaryLink: '/about#program',
    backgroundImage: '/documentation/01-kebersamaan.jpg',
    captionTitle: 'Dokumentasi kebersamaan kader ROKABA',
    captionSub: 'SMAN 1 Baturraden',
};

const DEFAULT_STATS = [
    { value: '17', suffix: '', label: 'Sekolah anggota', icon: School },
    { value: '45', suffix: '', label: 'Pengurus', icon: Users },
    { value: '5', suffix: '', label: 'Divisi', icon: Layers },
    { value: '2017', suffix: '', label: 'Tahun berdiri', icon: CalendarCheck },
];

const STAT_ICONS = [School, Users, Layers, CalendarCheck];

const DEFAULT_LEADERS = [
    {
        id: 'ketum',
        role: 'Ketua Umum',
        name: 'M. Rayyan Alfarabi',
        period: 'Periode 2025/2026',
        school: 'SMAN 1 Purwokerto',
        photo: '',
        salutationOpen: "Assalamu'alaikum warahmatullahi wabarakatuh.",
        paragraphs: [
            'Segala puji bagi Allah SWT yang mempertemukan kita dalam ukhuwah yang hangat. Di ROHIS Kabupaten Banyumas, kami percaya bahwa setiap pelajar memiliki potensi untuk tumbuh menjadi pribadi yang berilmu, beradab, dan bermanfaat bagi lingkungannya.',
            'Melalui kolaborasi lintas sekolah, kajian, kaderisasi, dan aksi kepedulian, kami ingin menghadirkan ruang belajar yang ramah, tertib, dan relevan dengan dunia pelajar hari ini. Mari berjalan bersama, saling menguatkan, dan menyalakan kebaikan dari sekolah kita masing-masing.',
        ],
        salutationClose: "Wassalamu'alaikum warahmatullahi wabarakatuh.",
    },
    {
        id: 'akhwat',
        role: 'Ketua Akhwat',
        name: 'Neesa Azkia Shafa',
        period: 'Periode 2025/2026',
        school: 'SMAN 1 Purwokerto',
        photo: '/documentation/06-ketua-akhwat.jpg',
        salutationOpen: "Assalamu'alaikum warahmatullahi wabarakatuh.",
        paragraphs: [
            'Alhamdulillah, kemuslimahan ROKABA hadir sebagai ruang aman dan suportif bagi pelajar putri Muslimah di Kabupaten Banyumas untuk bertumbuh dalam ilmu, adab, serta kepemimpinan yang santun.',
            'Semoga setiap perjumpaan, halaqah belajar, dan karya kolaborasi yang kita rangkai bersama menjadi jejak kebaikan yang menguatkan langkah kita di sekolah maupun masyarakat.',
        ],
        salutationClose: "Wassalamu'alaikum warahmatullahi wabarakatuh.",
    },
    {
        id: 'ikhwan',
        role: 'Ketua Ikhwan',
        name: 'Muhammad Raif Ramadhan',
        period: 'Periode 2025/2026',
        school: 'SMAN 2 Purwokerto',
        photo: '',
        salutationOpen: "Assalamu'alaikum warahmatullahi wabarakatuh.",
        paragraphs: [
            'Ukhuwah antar pelajar di Banyumas tumbuh kuat ketika kita saling hadir, mendengar, dan bergerak bersama. Koordinasi lapangan dan pembinaan kader ikhwan terus kami arahkan agar setiap ROHIS sekolah memiliki teman seperjalanan.',
            'Mari jadikan masa putih abu-abu ini sebagai waktu terbaik untuk menempa karakter, memperluas jejaring kebaikan, dan menghadirkan manfaat nyata.',
        ],
        salutationClose: "Wassalamu'alaikum warahmatullahi wabarakatuh.",
    },
];

const DEFAULT_ABOUT_SUMMARY = {
    sectionTitle: 'Tentang ROKABA',
    intro:
        'Forum Komunikasi ROHIS Kabupaten Banyumas (ROKABA) adalah wadah kolaborasi ROHIS di tingkat SMA, SMK, dan MA se-Kabupaten Banyumas.',
    paragraph:
        'Sejak dirintis pada 2017, ROKABA berkomitmen menjadi ruang silaturahmi, berbagi inspirasi, menguatkan kapasitas pelajar Muslim, serta mendorong lahirnya program-program kebaikan yang berdampak di sekolah dan masyarakat.',
    image: '/documentation/02-muskerda.jpg',
    values: [
        {
            title: 'Ukhuwah Lintas Sekolah',
            desc: 'Menghubungkan 17 ROHIS sekolah agar saling bertukar gagasan dan bergerak bersama.',
        },
        {
            title: 'Kaderisasi Beradab',
            desc: 'Menumbuhkan kepemimpinan pelajar yang santun, amanah, dan siap berkontribusi.',
        },
    ],
};

function resolvePhotoUrl(raw, fallback = '') {
    if (!raw) return fallback;
    if (raw.startsWith('http') || raw.startsWith('/')) return raw;
    return getDriveImageUrl(raw);
}

function tiltCover(event) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const frame = event.currentTarget;
    const bounds = frame.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    frame.style.setProperty('--cover-yaw', `${x * 4}deg`);
    frame.style.setProperty('--cover-pitch', `${y * -3}deg`);
}

function resetCover(event) {
    event.currentTarget.style.removeProperty('--cover-yaw');
    event.currentTarget.style.removeProperty('--cover-pitch');
}

export default function Home() {
    const [cms, setCms] = useState(null);
    const [activeLeaderIdx, setActiveLeaderIdx] = useState(0);

    useEffect(() => {
        let mounted = true;
        fetchCmsData().then((data) => {
            if (mounted && data) setCms(data);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const hero = {
        ...DEFAULT_HERO,
        ...(cms?.homeHero || {}),
    };
    const heroPhoto = resolvePhotoUrl(
        cms?.homeHero?.backgroundImage,
        DEFAULT_HERO.backgroundImage
    );

    const stats =
        Array.isArray(cms?.homeStats) && cms.homeStats.length > 0
            ? cms.homeStats.slice(0, 4)
            : DEFAULT_STATS;

    // Build the 3 leaders list from CMS + defaults, preserving real names & photos
    const cmsLeaders = cms?.homeWelcome?.leaders;
    const leaders = DEFAULT_LEADERS.map((def, idx) => {
        const custom = Array.isArray(cmsLeaders) ? cmsLeaders[idx] : null;
        let photoRaw = custom?.photo || def.photo;
        // Ensure Ketua Akhwat always has her authentic portrait available
        if (def.id === 'akhwat' && (!photoRaw || photoRaw === '1RBwhz_vc2aPWPjAIdGpKR8YnMXOVBDCA')) {
            photoRaw = '/documentation/06-ketua-akhwat.jpg';
        }
        return {
            ...def,
            name: custom?.name || def.name,
            role: custom?.role || def.role,
            school: custom?.school || def.school,
            photo: resolvePhotoUrl(photoRaw, def.photo),
            paragraphs:
                Array.isArray(custom?.paragraphs) && custom.paragraphs.length > 0
                    ? custom.paragraphs
                    : def.paragraphs,
        };
    });

    const activeLeader = leaders[activeLeaderIdx] || leaders[0];

    const aboutData = {
        ...DEFAULT_ABOUT_SUMMARY,
        ...(cms?.homeAbout || {}),
    };
    const aboutPhoto = resolvePhotoUrl(
        cms?.homeAbout?.image,
        DEFAULT_ABOUT_SUMMARY.image
    );

    const newsList = Array.isArray(cms?.newsList) ? cms.newsList : [];
    const eventsList = Array.isArray(cms?.events) ? cms.events : [];

    const ctaData = {
        title: cms?.homeCta?.title || 'Mari tumbuh dan bergerak bersama.',
        description:
            cms?.homeCta?.description ||
            'Terbuka untuk kolaborasi antar-ROHIS sekolah, kunjungan belajar, dan komunikasi kegiatan pelajar di Kabupaten Banyumas.',
        primaryText: cms?.homeCta?.primaryText || 'Hubungi sekretariat',
        primaryLink: cms?.homeCta?.primaryLink || '/contact',
        secondaryText: cms?.homeCta?.secondaryText || 'Lihat ROHIS sekolah',
        secondaryLink: cms?.homeCta?.secondaryLink || '/schools',
    };

    const handleNextLeader = () => {
        setActiveLeaderIdx((prev) => (prev + 1) % leaders.length);
    };

    return (
        <div className="rk-page">
            {/* 1. HERO SECTION */}
            <section className="rk-hero-section rk-home-cover" data-scene="welcome">
                <div className="rk-container">
                    <div className="rk-hero-grid">
                        <div className="rk-hero-copy">
                            <Eyebrow>{hero.badge}</Eyebrow>
                            <h1 className="rk-hero-title">
                                {hero.titleLine1}
                                <span className="rk-accent-line">{hero.titleLine2}</span>
                            </h1>
                            <p className="rk-hero-subtitle">{hero.subtitle}</p>

                            <div className="rk-hero-actions">
                                <PrimaryButton to={hero.ctaPrimaryLink || '/about'}>
                                    <span>{hero.ctaPrimaryText || 'Mengenal ROKABA'}</span>
                                    <ArrowRight size={17} />
                                </PrimaryButton>
                                <SecondaryButton to={hero.ctaSecondaryLink || '/about#program'}>
                                    <span>{hero.ctaSecondaryText || 'Jelajahi program'}</span>
                                    <ArrowRight size={16} />
                                </SecondaryButton>
                            </div>
                        </div>

                        <div className="rk-hero-visual" onPointerMove={tiltCover} onPointerLeave={resetCover}>
                            <FramedPhoto
                                src={heroPhoto}
                                alt="Dokumentasi kebersamaan kader ROKABA"
                                captionTitle={hero.captionTitle}
                                captionSub={hero.captionSub}
                                eager
                                aspectRatio="16 / 10.8"
                            />
                        </div>
                    </div>

                    {/* 2. RINGKASAN ORGANISASI (4 STATISTIK CAPSULE BAR) */}
                    <div className="rk-stats-capsule-bar" aria-label="Ringkasan organisasi ROKABA">
                        {stats.map((stat, idx) => {
                            const IconComponent = stat.icon || STAT_ICONS[idx % STAT_ICONS.length];
                            return (
                                <div key={idx} className="rk-stats-capsule-item">
                                    <span className="rk-stats-capsule-icon" aria-hidden="true">
                                        <IconComponent size={20} />
                                    </span>
                                    <div className="rk-stats-capsule-copy">
                                        <strong>
                                            {stat.value}
                                            {stat.suffix || ''}
                                        </strong>
                                        <span>{stat.label}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <div className="rk-home-flow" data-scene="calm">
                <section className="rk-section rk-welcome-letter" id="sambutan" aria-labelledby="sambutan-title">
                    <div className="rk-container">
                        <header className="rk-welcome-heading">
                            <div>
                                <h2 className="rk-section-title" id="sambutan-title">Sambutan pengurus</h2>
                                <p>ROHIS Kabupaten Banyumas</p>
                            </div>
                            <p>{activeLeader.period}</p>
                        </header>

                        <div className="rk-welcome-grid">
                            <div className="rk-welcome-people">
                                <FramedPhoto
                                    key={activeLeader.id}
                                    className="rk-flow-glass rk-welcome-portrait"
                                    src={activeLeader.photo}
                                    alt={activeLeader.name}
                                    aspectRatio="1 / 1.08"
                                    captionTitle={activeLeader.name}
                                    captionSub={activeLeader.role}
                                    fallback={
                                        <div className="rk-welcome-monogram" aria-hidden="true">
                                            {activeLeader.name.trim().split(/\s+/).slice(-2).map(word => word[0]).join('')}
                                        </div>
                                    }
                                />
                                <div
                                    className="rk-welcome-selector"
                                    role="group"
                                    aria-label="Pilih sambutan pengurus"
                                >
                                    {leaders.map((leader, idx) => (
                                        <button
                                            key={leader.id}
                                            type="button"
                                            aria-pressed={idx === activeLeaderIdx}
                                            aria-controls="sambutan-content"
                                            onClick={() => setActiveLeaderIdx(idx)}
                                        >
                                            {leader.role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <article className="rk-flow-glass rk-welcome-pane" id="sambutan-content" aria-labelledby="sambutan-role">
                                <h3 className="rk-welcome-role" id="sambutan-role" aria-live="polite">
                                    Sambutan {activeLeader.role}
                                </h3>
                                <div className="rk-sambutan-body rk-motion-content" key={activeLeader.id}>
                                    <p className="rk-salutation">{activeLeader.salutationOpen}</p>
                                    {activeLeader.paragraphs.map((paragraph, pIdx) => (
                                        <p key={pIdx}>{paragraph}</p>
                                    ))}
                                    <p className="rk-salutation-close">{activeLeader.salutationClose}</p>
                                    <div className="rk-welcome-byline">
                                        <strong>{activeLeader.name}</strong>
                                        <span>{activeLeader.school}</span>
                                    </div>
                                </div>

                                <footer className="rk-welcome-actions">
                                    <Link to="/about#pengurus">Kenali pengurus</Link>
                                    <button type="button" className="rk-btn-primary" onClick={handleNextLeader}>
                                        <span>Sambutan berikutnya</span>
                                        <ArrowRight size={16} aria-hidden="true" />
                                    </button>
                                </footer>
                            </article>
                        </div>
                    </div>
                </section>

                <section className="rk-section rk-home-profile" aria-labelledby="home-profile-title">
                    <div className="rk-container">
                        <h2 className="rk-section-title" id="home-profile-title">{aboutData.sectionTitle}</h2>
                        <div className="rk-about-preview-grid">
                            <FramedPhoto
                                src={aboutPhoto}
                                alt="Musyawarah dan kolaborasi pengurus ROKABA"
                                className="rk-flow-glass rk-profile-photo"
                                aspectRatio="16 / 10"
                            />

                            <div className="rk-about-preview-copy">
                                <p className="rk-lead-text">{aboutData.intro}</p>
                                <p className="rk-body-text">{aboutData.paragraph}</p>

                                <div className="rk-about-values-grid">
                                    {(aboutData.values || DEFAULT_ABOUT_SUMMARY.values).map(
                                        (val, idx) => (
                                            <SoftCard key={idx} className="rk-mini-value-card">
                                                <strong>{val.title}</strong>
                                                <p>{val.desc}</p>
                                            </SoftCard>
                                        )
                                    )}
                                </div>

                                <div className="rk-profile-actions">
                                    <PrimaryButton to="/about">
                                        <span>Pelajari profil & linimasa</span>
                                        <ArrowRight size={16} aria-hidden="true" />
                                    </PrimaryButton>
                                    <SecondaryButton to="/about#pengurus">
                                        <span>Direktori pengurus</span>
                                    </SecondaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* 6. CUPLIKAN BERITA TERKINI (CAROUSEL 3 KARTU) */}
            <FeatureCarousel
                id="berita-terkini"
                variant="news"
                eyebrow={cms?.sectionHeaders?.news?.tag || "Kabar dari ROKABA"}
                title={cms?.sectionHeaders?.news?.title || 'Berita & cerita kegiatan'}
                description={
                    cms?.sectionHeaders?.news?.description ||
                    'Dokumentasi kegiatan, rilis organisasi, dan cerita kolaborasi pelajar Muslim di Kabupaten Banyumas.'
                }
                ctaHref="/berita"
                ctaLabel={cms?.sectionHeaders?.news?.linkText || 'Semua berita'}
                items={newsList}
            />

            {/* 7. CUPLIKAN AGENDA & KAJIAN (CAROUSEL 3 KARTU) */}
            <FeatureCarousel
                id="agenda-terdekat"
                variant="agenda"
                eyebrow={cms?.sectionHeaders?.events?.tag || "Jadwal Terdekat"}
                title={cms?.sectionHeaders?.events?.title || 'Agenda & kegiatan bersama'}
                description={
                    cms?.sectionHeaders?.events?.description ||
                    'Ikuti kajian pelajar, pelatihan kepemimpinan, musyawarah kerja, dan aksi kolaborasi terdekat.'
                }
                ctaHref="/berita#agenda"
                ctaLabel={cms?.sectionHeaders?.events?.linkText || 'Lihat kalender agenda'}
                items={eventsList}
            />

            {/* 8. PENUTUP / AJAKAN KOLABORASI */}
            <section className="rk-section">
                <div className="rk-container">
                    <SoftCard className="rk-cta-card">
                        <div style={{ maxWidth: 620 }}>
                            <Eyebrow>Kolaborasi & Silaturahmi</Eyebrow>
                            <h2>{ctaData.title}</h2>
                            <p>{ctaData.description}</p>
                        </div>
                        <div className="rk-cta-actions">
                            <PrimaryButton to={ctaData.primaryLink}>
                                <span>{ctaData.primaryText}</span>
                                <ArrowRight size={16} />
                            </PrimaryButton>
                            <SecondaryButton to={ctaData.secondaryLink}>
                                <span>{ctaData.secondaryText}</span>
                            </SecondaryButton>
                        </div>
                    </SoftCard>
                </div>
            </section>
        </div>
    );
}
