import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Target,
    Flag,
    MapPin,
    Users,
    ArrowRight,
    Sparkles,
    Share2,
    School,
} from 'lucide-react';
import { fetchCmsData, getDriveImageUrl } from '../services/cmsService';
import MemberDirectory from '../components/MemberDirectory';
import Programs from './Programs';
import {
    Eyebrow,
    FramedPhoto,
    SecondaryButton,
    SoftCard,
} from '../components/ui/SoftUI';

const DEFAULT_TIMELINE = [
    {
        year: '2017',
        title: 'Inisiasi Forum Komunikasi',
        location: 'Kabupaten Banyumas',
        description:
            'Inisiasi forum komunikasi ROHIS lintas sekolah di Banyumas.',
        icon: Flag,
    },
    {
        year: '2020',
        title: 'Adaptasi Kajian & Koordinasi Daring',
        location: 'Lintas Sekolah',
        description:
            'Adaptasi kajian dan koordinasi daring lintas sekolah.',
        icon: Share2,
    },
    {
        year: '2022',
        title: 'Penguatan Kaderisasi Pelajar',
        location: 'Kabupaten Banyumas',
        description:
            'Penguatan kaderisasi dan kolaborasi kegiatan pelajar.',
        icon: Users,
    },
    {
        year: '2024',
        title: 'Jejaring 17 Sekolah Anggota',
        location: 'SMA, SMK & MA Banyumas',
        description:
            'Perluasan jejaring 17 sekolah anggota SMA, SMK, dan MA.',
        icon: School,
    },
    {
        year: '2026',
        title: 'Pembaruan Gerak & Media Dakwah',
        location: 'Periode 2025/2026',
        description:
            'Pembaruan gerak organisasi dan penguatan media dakwah pelajar.',
        icon: Sparkles,
    },
];

const TIMELINE_ICONS = [Flag, Share2, Users, School, Sparkles];

function resolvePhotoUrl(raw, fallback) {
    if (!raw) return fallback;
    if (raw.startsWith('http') || raw.startsWith('/')) return raw;
    return getDriveImageUrl(raw);
}

export default function About() {
    const [cms, setCms] = useState(null);
    const { hash, key } = useLocation();
    const navigate = useNavigate();
    const waitingForSection = Boolean(hash) && cms === null;

    useEffect(() => {
        if (hash === '#sekolah') {
            navigate('/schools', { replace: true });
            return;
        }
        if (!hash || waitingForSection) return;

        let cancelled = false;
        document.fonts.ready.then(() => {
            if (!cancelled) {
                document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
            }
        });
        return () => {
            cancelled = true;
        };
    }, [hash, key, navigate, waitingForSection]);

    useEffect(() => {
        let mounted = true;
        fetchCmsData().then((data) => {
            if (mounted && data) setCms(data);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const aboutImage = resolvePhotoUrl(
        cms?.homeAbout?.image,
        '/documentation/02-muskerda.jpg'
    );

    const timeline =
        Array.isArray(cms?.homeTimeline) && cms.homeTimeline.length >= 5
            ? cms.homeTimeline
            : DEFAULT_TIMELINE;

    return (
        <div className="rk-page">
            {/* 1. PROFIL ORGANISASI */}
            <section className="rk-hero-section">
                <div className="rk-container">
                    <div className="rk-hero-grid">
                        <div className="rk-hero-copy">
                            <Eyebrow>Profil & Sejarah</Eyebrow>
                            <h1 className="rk-page-title">Mengenal ROKABA</h1>
                            <p className="rk-brass-subtitle">
                                Ukhuwah, kepemimpinan, kontribusi
                            </p>
                            <p className="rk-page-lead">
                                {cms?.homeAbout?.intro ||
                                    'ROHIS Kabupaten Banyumas adalah forum komunikasi dan kolaborasi ROHIS SMA, SMK, dan MA yang berdiri sejak 2017 untuk membina pelajar Muslim yang beradab dan berdampak.'}
                            </p>
                            <p className="rk-body-text">
                                {cms?.homeAbout?.paragraph ||
                                    'Kami mempertemukan semangat belajar keislaman, latihan kepemimpinan, kepedulian sosial, dan karya kreatif pelajar agar setiap ROHIS sekolah memiliki teman seperjalanan yang saling menguatkan.'}
                            </p>

                            <div className="rk-hero-actions">
                                <a href="#pengurus" className="rk-btn-primary">
                                    <Users size={17} />
                                    <span>Struktur 45 Pengurus</span>
                                </a>
                                <SecondaryButton to="#program">
                                    <span>Program & Kaderisasi</span>
                                    <ArrowRight size={16} />
                                </SecondaryButton>
                            </div>
                        </div>

                        <div className="rk-hero-visual">
                            <FramedPhoto
                                src={aboutImage}
                                alt="Dokumentasi kader ROKABA"
                                captionTitle="Dokumentasi kader ROKABA"
                                captionSub="Musyawarah Kerja Daerah & Kaderisasi"
                                aspectRatio="16 / 10.6"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. VISI & MISI (PAPAN 03-PROFIL-PC) */}
            <section className="rk-section">
                <div className="rk-container">
                    <div className="rk-visi-misi-grid-v3">
                        <SoftCard className="rk-visi-card-v3">
                            <div className="rk-visi-card-row">
                                <span className="rk-service-icon-badge rk-service-icon-badge--lg">
                                    <Flag size={22} />
                                </span>
                                <div className="rk-visi-card-copy">
                                    <h2>Visi</h2>
                                    <p>
                                        Menjadikan pelajar Muslim Banyumas yang berilmu,
                                        berakhlak, bersaudara, dan aktif berkontribusi bagi
                                        sekolah serta masyarakat.
                                    </p>
                                </div>
                            </div>
                        </SoftCard>

                        <SoftCard className="rk-misi-card-v3">
                            <div className="rk-visi-card-row">
                                <span className="rk-service-icon-badge rk-service-icon-badge--lg">
                                    <Target size={22} />
                                </span>
                                <div className="rk-visi-card-copy">
                                    <h2>Misi</h2>
                                    <p>
                                        Menguatkan pembinaan ruhiyah, jejaring antar-ROHIS
                                        sekolah, kepemimpinan kader, dan karya dakwah yang
                                        relevan dengan zaman.
                                    </p>
                                </div>
                            </div>
                        </SoftCard>
                    </div>
                </div>
            </section>

            {/* 3. JEJAK LANGKAH ROKABA (LINIMASA TERHUBUNG 2017 - 2026) */}
            <section className="rk-section" id="linimasa">
                <div className="rk-container">
                    <div className="rk-section-head rk-section-head--centered">
                        <div className="rk-centered-title-bar">
                            <span className="rk-brass-Rule" aria-hidden="true" />
                            <h2 className="rk-section-title">Jejak langkah ROKABA</h2>
                            <span className="rk-brass-Rule" aria-hidden="true" />
                        </div>
                        <p className="rk-section-desc">
                            Perjalanan kolaborasi pelajar Muslim Kabupaten Banyumas dari masa rintisan hingga periode kepengurusan saat ini.
                        </p>
                    </div>

                    <div className="rk-timeline-connected">
                        <div className="rk-timeline-track-line" aria-hidden="true" />
                        <div className="rk-timeline-nodes-grid">
                            {timeline.map((item, idx) => {
                                const IconComp =
                                    item.icon || TIMELINE_ICONS[idx % TIMELINE_ICONS.length];
                                return (
                                    <div key={idx} className="rk-timeline-node-col">
                                        <div className="rk-timeline-node-head">
                                            <span className="rk-timeline-year-pill">
                                                {item.year}
                                            </span>
                                            <span
                                                className="rk-timeline-node-dot"
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <SoftCard className="rk-timeline-card rk-timeline-card--v3">
                                            <span
                                                className="rk-timeline-card-icon"
                                                aria-hidden="true"
                                            >
                                                <IconComp size={18} />
                                            </span>
                                            {item.title && <h3>{item.title}</h3>}
                                            <p>{item.description}</p>
                                            {item.location && (
                                                <small className="rk-timeline-loc">
                                                    <MapPin size={12} />
                                                    <span>{item.location}</span>
                                                </small>
                                            )}
                                        </SoftCard>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <Programs cms={cms} />

            <MemberDirectory cmsMembers={cms?.members} />
        </div>
    );
}
