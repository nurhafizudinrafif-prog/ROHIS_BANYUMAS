import React, { useState } from 'react';
import {
    Users,
    Sparkles,
    Share2,
    PenTool,
    HeartHandshake,
    CheckCircle2,
    ArrowRight,
    Award,
    Compass,
    Heart,
    ChevronDown,
} from 'lucide-react';
import {
    Eyebrow,
    FramedPhoto,
    GlassChip,
    PrimaryButton,
    SoftCard,
} from '../components/ui/SoftUI';

const PILLARS = [
    {
        id: 'pembinaan',
        label: 'Pembinaan',
        shortDesc: 'Ruhiyah, adab, dan literasi keislaman pelajar.',
        spotlightTitle: 'Program Pembinaan & Dakwah',
        desc: 'Halaqah belajar, mentoring sebaya, kajian pelajar, dan pembiasaan adab yang ramah bagi siswa SMA, SMK, dan MA.',
        highlights: [
            'Kajian rutin pelajar lintas sekolah',
            'Mentoring adab & pendampingan ROHIS',
            'Karya literasi dakwah harian',
        ],
        photo: '/documentation/03-kajian.jpg',
        captionTitle: 'Kajian & pembinaan pelajar',
        captionSub: 'Pendampingan ruhiyah lintas sekolah',
        icon: Heart,
    },
    {
        id: 'kepemimpinan',
        label: 'Kepemimpinan',
        shortDesc: 'Manajemen organisasi dan kaderisasi pengurus.',
        spotlightTitle: 'Kaderisasi & Kepemimpinan Pelajar',
        desc: 'Menempa kapasitas manajemen organisasi, komunikasi publik, musyawarah kerja, dan regenerasi pengurus ROHIS sekolah yang tertib serta amanah.',
        highlights: [
            'Latihan Dasar Kepemimpinan (LDK) ROHIS',
            'Musyawarah Kerja Daerah (Muskerda)',
            'Workshop manajemen program & media',
        ],
        photo: '/documentation/02-muskerda.jpg',
        captionTitle: 'Musyawarah & latihan kepemimpinan',
        captionSub: 'Penguatan kapasitas pengurus ROHIS',
        icon: Compass,
    },
    {
        id: 'kepedulian',
        label: 'Kepedulian',
        shortDesc: 'Kolaborasi sosial dan kontribusi nyata di masyarakat.',
        spotlightTitle: 'Aksi Kepedulian & Kolaborasi Sosial',
        desc: 'Menggerakkan solidaritas pelajar Banyumas melalui bakti sosial, kolaborasi lingkungan, dan ruang silaturahmi yang memberi manfaat langsung.',
        highlights: [
            'Aksi sosial & kemanusiaan pelajar',
            'Kolaborasi lintas komunitas Banyumas',
            'Kemandirian program & kewirausahaan muda',
        ],
        photo: '/documentation/04-kegiatan.jpg',
        captionTitle: 'Kebersamaan & kolaborasi kader',
        captionSub: 'Aksi nyata pelajar Muslim Banyumas',
        icon: Users,
    },
];

const DEFAULT_DIVISIONS = [
    {
        id: 'sdm',
        code: 'SDM',
        name: 'Pengembangan Sumber Daya Manusia',
        summary:
            'Berfokus pada kaderisasi, penjagaan semangat pengurus, pelatihan kepemimpinan, dan penguatan kapasitas anggota ROHIS.',
        programs: [
            'Kaderisasi dan pembinaan pengurus',
            'Pelatihan kepemimpinan pelajar',
            'Pendampingan keaktifan anggota',
        ],
        icon: Users,
    },
    {
        id: 'dakwah',
        code: 'Dakwah',
        name: 'Syiar & Pembinaan Keislaman',
        summary:
            'Menggerakkan kajian pelajar, penguatan ruhiyah, syiar hari besar Islam, dan ruang diskusi keislaman yang sejuk.',
        programs: [
            'Kajian pelajar lintas sekolah',
            'Penguatan adab dan ibadah harian',
            'Konten pengingat kebaikan',
        ],
        icon: Sparkles,
    },
    {
        id: 'jurnalistik',
        code: 'Jurnalistik',
        name: 'Media, Literasi & Dokumentasi',
        summary:
            'Mengelola publikasi kreatif, dokumentasi visual kegiatan, penulisan berita, serta syiar digital ROKABA.',
        programs: [
            'Dokumentasi kegiatan dan galeri',
            'Publikasi berita dan artikel pelajar',
            'Pengelolaan identitas visual',
        ],
        icon: PenTool,
    },
    {
        id: 'humas',
        code: 'HUMAS',
        name: 'Hubungan Masyarakat & Jejaring',
        summary:
            'Menjaga komunikasi dengan 17 ROHIS sekolah anggota, kemitraan eksternal, dan silaturahmi antar-komunitas pelajar.',
        programs: [
            'Komunikasi 17 ROHIS sekolah anggota',
            'Silaturahmi dan kolaborasi kegiatan',
            'Koordinasi informasi eksternal',
        ],
        icon: Share2,
    },
    {
        id: 'danus',
        code: 'DANUS',
        name: 'Dana & Usaha Kemandirian',
        summary:
            'Mendorong kemandirian finansial organisasi melalui wirausaha pelajar yang halal, kreatif, dan mendukung keberlanjutan program.',
        programs: [
            'Dukungan kemandirian kegiatan',
            'Pengelolaan usaha kreatif organisasi',
            'Kemitraan pendukung program',
        ],
        icon: HeartHandshake,
    },
];

const RBC_COMPETITIONS = [
    "Da'i Muda",
    'MTQ',
    'Nasyid',
    'Poster Dakwah',
    'CCAI',
];

export default function Programs({ cms }) {
    const [activePillar, setActivePillar] = useState('pembinaan');
    const [openDivisionId, setOpenDivisionId] = useState('sdm');

    const selectedPillar =
        PILLARS.find((p) => p.id === activePillar) || PILLARS[0];

    const divisions = DEFAULT_DIVISIONS.map((def, idx) => {
        const cmsDiv = Array.isArray(cms?.homePrograms)
            ? cms.homePrograms.find(
                  (d) =>
                      (d.title || '').toLowerCase().includes(def.code.toLowerCase()) ||
                      (d.name || '').toLowerCase().includes(def.code.toLowerCase())
              ) || cms.homePrograms[idx]
            : null;
        return {
            ...def,
            summary: cmsDiv?.description || def.summary,
        };
    });

    return (
        <section id="program" aria-labelledby="program-title">
            {/* 1. HEADER & 3 PILAR GERAK + SPOTLIGHT BERGAMBAR */}
            <section className="rk-section">
                <div className="rk-container">
                    <div className="rk-section-head">
                        <div>
                            <Eyebrow>Gerak & Kaderisasi</Eyebrow>
                            <h2 id="program-title" className="rk-section-title">Program & Kaderisasi</h2>
                            <p className="rk-page-lead" style={{ marginTop: 12 }}>
                                Tiga pilar gerak dan lima divisi yang saling menguatkan
                                pelajar Muslim di Kabupaten Banyumas.
                            </p>
                        </div>
                    </div>

                    <div
                        className="rk-pillar-tabs"
                        role="tablist"
                        aria-label="Pilar program ROKABA"
                    >
                        {PILLARS.map((pillar) => {
                            const Icon = pillar.icon;
                            const active = pillar.id === activePillar;
                            return (
                                <button
                                    key={pillar.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    className={`rk-pillar-tab ${active ? 'is-active' : ''}`}
                                    onClick={() => setActivePillar(pillar.id)}
                                >
                                    <span className="rk-pillar-tab-icon">
                                        <Icon size={18} />
                                    </span>
                                    <span className="rk-pillar-tab-copy">
                                        <strong>{pillar.label}</strong>
                                        <small>{pillar.shortDesc}</small>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <SoftCard className="rk-pillar-spotlight rk-pillar-spotlight--v3">
                        <div className="rk-pillar-spotlight-copy">
                            <GlassChip>Pilar {selectedPillar.label}</GlassChip>
                            <h2 style={{ marginTop: 12 }}>
                                {selectedPillar.spotlightTitle}
                            </h2>
                            <p style={{ marginTop: 10 }}>{selectedPillar.desc}</p>

                            <ul className="rk-pillar-highlights" style={{ marginTop: 18 }}>
                                {selectedPillar.highlights.map((item, i) => (
                                    <li key={i}>
                                        <CheckCircle2 size={17} />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div style={{ marginTop: 22 }}>
                                <PrimaryButton to="/berita#agenda">
                                    <span>Lihat kegiatan</span>
                                    <ArrowRight size={16} />
                                </PrimaryButton>
                            </div>
                        </div>

                        <div className="rk-pillar-spotlight-media">
                            <FramedPhoto
                                src={selectedPillar.photo}
                                alt={selectedPillar.spotlightTitle}
                                captionTitle={selectedPillar.captionTitle}
                                captionSub={selectedPillar.captionSub}
                                aspectRatio="16 / 10.2"
                            />
                        </div>
                    </SoftCard>
                </div>
            </section>

            {/* 2. LIMA DIVISI UTAMA (3 ATAS + 2 BAWAH TENGAH DI PC, ACCORDION DI HP) */}
            <section className="rk-section">
                <div className="rk-container">
                    <div className="rk-section-head rk-section-head--centered">
                        <div className="rk-centered-title-bar">
                            <span className="rk-brass-Rule" aria-hidden="true" />
                            <h2 className="rk-section-title">
                                Program kerja 5 divisi utama
                            </h2>
                            <span className="rk-brass-Rule" aria-hidden="true" />
                        </div>
                        <p className="rk-section-desc">
                            Setiap divisi menjalankan program kerja yang terarah untuk
                            mendukung pertumbuhan kader dan ROHIS sekolah.
                        </p>
                    </div>

                    <div className="rk-divisions-grid-v3">
                        {divisions.map((div) => {
                            const Icon = div.icon;
                            const isOpen = openDivisionId === div.id;
                            return (
                                <SoftCard
                                    key={div.id}
                                    className={`rk-division-card rk-division-card--v3 ${
                                        isOpen ? 'is-open' : ''
                                    }`}
                                >
                                    <button
                                        type="button"
                                        className="rk-division-head rk-division-head--btn"
                                        onClick={() =>
                                            setOpenDivisionId((prev) =>
                                                prev === div.id ? '' : div.id
                                            )
                                        }
                                        aria-expanded={isOpen}
                                    >
                                        <span className="rk-service-icon-badge rk-service-icon-badge--lg">
                                            <Icon size={22} />
                                        </span>
                                        <span className="rk-division-head-copy">
                                            <strong>{div.code}</strong>
                                            <small>{div.name}</small>
                                        </span>
                                        <ChevronDown
                                            size={18}
                                            className="rk-division-chevron"
                                        />
                                    </button>

                                    <div className="rk-division-body">
                                        <p className="rk-division-summary">{div.summary}</p>
                                        <ul className="rk-division-list">
                                            {div.programs.map((prog, idx) => (
                                                <li key={idx}>
                                                    <CheckCircle2 size={16} />
                                                    <span>{prog}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </SoftCard>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 3. SOROTAN KEGIATAN BESAR (RBC x PECETIKAH BANNER) */}
            <section className="rk-section">
                <div className="rk-container">
                    <SoftCard className="rk-flagship-banner-v3">
                        <div className="rk-flagship-banner-left">
                            <div className="rk-flagship-banner-title-row">
                                <span className="rk-service-icon-badge rk-service-icon-badge--lg">
                                    <Award size={22} />
                                </span>
                                <div>
                                    <Eyebrow>Sorotan Kegiatan Tahunan</Eyebrow>
                                    <h2 style={{ marginTop: 6 }}>RBC × PECETIKAH</h2>
                                </div>
                            </div>
                            <p className="rk-flagship-banner-desc">
                                Ruang syiar, kompetisi sehat, dan kolaborasi karya pelajar
                                Muslim se-Kabupaten Banyumas.
                            </p>
                            <div className="rk-flagship-pills-row">
                                {RBC_COMPETITIONS.map((comp) => (
                                    <span key={comp} className="rk-flagship-comp-pill">
                                        <Sparkles size={13} />
                                        <span>{comp}</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="rk-flagship-banner-right">
                            <PrimaryButton to="/berita#agenda">
                                <span>Lihat agenda</span>
                                <ArrowRight size={16} />
                            </PrimaryButton>
                        </div>
                    </SoftCard>
                </div>
            </section>
        </section>
    );
}
