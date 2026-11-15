import React, { useEffect, useMemo, useState } from 'react';
import {
    Search,
    School,
    MapPin,
    AtSign,
    ArrowUpRight,
    X,
    Users,
    ArrowRight,
    Sparkles,
} from 'lucide-react';
import { fetchCmsData } from '../services/cmsService';
import {
    Eyebrow,
    GlassChip,
    PrimaryButton,
    SoftCard,
} from '../components/ui/SoftUI';

export const DEFAULT_SCHOOLS = [
    // MA (2)
    { id: 'sch-1', name: 'MAN 1 Banyumas', level: 'MA', district: 'Purwokerto Timur', rohisName: 'ROHIS Al-Faruq MAN 1 Banyumas', instagram: '@rohis_man1banyumas', focus: 'Kajian kitab, tilawah, dan syiar madrasah.' },
    { id: 'sch-2', name: 'MAN 2 Banyumas', level: 'MA', district: 'Purwokerto Timur', rohisName: 'ROHIS Al-Hikmah MAN 2 Banyumas', instagram: '@rohis_man2banyumas', focus: 'Tahsin, hadroh, literasi dakwah, dan kaderisasi.' },

    // SMA (10)
    { id: 'sch-3', name: 'SMA Negeri 1 Purwokerto', level: 'SMA', district: 'Purwokerto Timur', rohisName: 'ROHIS SMAN 1 Purwokerto', instagram: '@rohis_smansa', focus: 'Mentoring sebaya, kajian remaja, dan aksi sosial.' },
    { id: 'sch-4', name: 'SMA Negeri 2 Purwokerto', level: 'SMA', district: 'Purwokerto Timur', rohisName: 'ROHIS SMAN 2 Purwokerto', instagram: '@rohis_smada', focus: 'Kaderisasi kepemimpinan, buletin dakwah, dan syiar sekolah.' },
    { id: 'sch-5', name: 'SMA Negeri 3 Purwokerto', level: 'SMA', district: 'Purwokerto Barat', rohisName: 'ROHIS SMAN 3 Purwokerto', instagram: '@rohis_smaga', focus: 'Halaqah rutin, kemuslimahan, dan bakti sosial.' },
    { id: 'sch-6', name: 'SMA Negeri 4 Purwokerto', level: 'SMA', district: 'Purwokerto Selatan', rohisName: 'ROHIS SMAN 4 Purwokerto', instagram: '@rohis_smfour', focus: 'Kajian Jumat, media dakwah kreatif, dan ukhuwah.' },
    { id: 'sch-7', name: 'SMA Negeri 5 Purwokerto', level: 'SMA', district: 'Purwokerto Timur', rohisName: 'ROHIS SMAN 5 Purwokerto', instagram: '@rohis_smanla', focus: 'Pembinaan adab, tilawah pagi, dan kolaborasi pelajar.' },
    { id: 'sch-8', name: 'SMA Negeri 1 Ajibarang', level: 'SMA', district: 'Ajibarang', rohisName: 'ROHIS SMAN 1 Ajibarang', instagram: '@rohis_smanja', focus: 'Penguatan kader wilayah barat dan kajian pelajar.' },
    { id: 'sch-9', name: 'SMA Negeri 1 Banyumas', level: 'SMA', district: 'Banyumas', rohisName: 'ROHIS SMAN 1 Banyumas', instagram: '@rohis_smaba', focus: 'Syiar hari besar Islam, mentoring, dan kepemimpinan.' },
    { id: 'sch-10', name: 'SMA Negeri 1 Baturraden', level: 'SMA', district: 'Baturraden', rohisName: 'ROHIS SMAN 1 Baturraden', instagram: '@rohis_smabara', focus: 'Tadabbur alam, kebersamaan kader, dan pembinaan rutin.' },
    { id: 'sch-11', name: 'SMA Negeri 1 Sokaraja', level: 'SMA', district: 'Sokaraja', rohisName: 'ROHIS SMAN 1 Sokaraja', instagram: '@rohis_smansoka', focus: 'Kajian pekanan, literasi Al-Qur’an, dan jejaring sekolah.' },
    { id: 'sch-12', name: 'SMA Negeri 1 Wangon', level: 'SMA', district: 'Wangon', rohisName: 'ROHIS SMAN 1 Wangon', instagram: '@rohis_smanwa', focus: 'Pembinaan ruhiyah dan kolaborasi pelajar wilayah selatan.' },

    // SMK (5)
    { id: 'sch-13', name: 'SMK Negeri 1 Purwokerto', level: 'SMK', district: 'Purwokerto Timur', rohisName: 'ROHIS SMKN 1 Purwokerto', instagram: '@rohis_smecone', focus: 'Kemandirian organisasi, kajian kejuruan, dan adab kerja.' },
    { id: 'sch-14', name: 'SMK Negeri 2 Purwokerto', level: 'SMK', district: 'Purwokerto Timur', rohisName: 'ROHIS SMKN 2 Purwokerto', instagram: '@rohis_smkn2pwt', focus: 'Kajian teknik, solidaritas pelajar, dan pembinaan masjid.' },
    { id: 'sch-15', name: 'SMK Negeri 3 Purwokerto', level: 'SMK', district: 'Purwokerto Selatan', rohisName: 'ROHIS SMKN 3 Purwokerto', instagram: '@rohis_smkn3pwt', focus: 'Kemuslimahan kreatif, adab keseharian, dan syiar sekolah.' },
    { id: 'sch-16', name: 'SMK Negeri 1 Banyumas', level: 'SMK', district: 'Banyumas', rohisName: 'ROHIS SMKN 1 Banyumas', instagram: '@rohis_smkn1bms', focus: 'Mentoring sebaya dan kegiatan sosial pelajar.' },
    { id: 'sch-17', name: 'SMK Telkom Purwokerto', level: 'SMK', district: 'Purwokerto Selatan', rohisName: 'ROHIS SMK Telkom Purwokerto', instagram: '@rohis_smktelkompwt', focus: 'Dakwah digital, desain kreatif, dan kepemimpinan teknologi.' },
];

const LEVEL_FILTERS = [
    { key: 'Semua', label: 'Semua jenjang' },
    { key: 'SMA', label: 'SMA' },
    { key: 'SMK', label: 'SMK' },
    { key: 'MA', label: 'MA' },
];

function detectLevel(name = '', rawLevel = '') {
    const up = (rawLevel || name).toUpperCase();
    if (up.includes('SMK')) return 'SMK';
    if (up.includes('MAN') || up.includes('MA ') || up === 'MA') return 'MA';
    return 'SMA';
}

export default function Schools() {
    const [cms, setCms] = useState(null);
    const [level, setLevel] = useState('Semua');
    const [query, setQuery] = useState('');
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        let mounted = true;
        fetchCmsData().then((data) => {
            if (mounted && data) setCms(data);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const schools = useMemo(() => {
        if (Array.isArray(cms?.schools) && cms.schools.length >= 17) {
            return cms.schools.map((s, idx) => {
                const fallback = DEFAULT_SCHOOLS[idx % DEFAULT_SCHOOLS.length];
                const name = s.name || s.schoolName || fallback.name;
                return {
                    id: s.id || `sch-${idx}`,
                    name,
                    level: detectLevel(name, s.level || s.type),
                    district: s.district || s.location || fallback.district,
                    rohisName: s.rohisName || fallback.rohisName || `ROHIS ${name}`,
                    instagram: s.instagram || fallback.instagram,
                    focus: s.focus || s.description || fallback.focus,
                };
            });
        }
        return DEFAULT_SCHOOLS;
    }, [cms]);

    const counts = useMemo(() => {
        const res = { Semua: schools.length, SMA: 0, SMK: 0, MA: 0 };
        schools.forEach((s) => {
            res[s.level] = (res[s.level] || 0) + 1;
        });
        return res;
    }, [schools]);

    const filteredSchools = useMemo(() => {
        const q = query.trim().toLowerCase();
        return schools.filter((s) => {
            const matchLevel = level === 'Semua' || s.level === level;
            const matchQuery =
                !q ||
                s.name.toLowerCase().includes(q) ||
                s.district.toLowerCase().includes(q) ||
                s.rohisName.toLowerCase().includes(q);
            return matchLevel && matchQuery;
        });
    }, [schools, level, query]);

    const activeBannerSchool = selectedSchool || filteredSchools[0] || schools[0];

    const handleSelectSchool = (school) => {
        setSelectedSchool(school);
        setModalOpen(true);
    };

    return (
        <div className="rk-page">
            <section className="rk-hero-section">
                <div className="rk-container">
                    {/* HEADER + 3 BADGE RINGKASAN JENJANG DI KANAN ATAS (PAPAN 10-SEKOLAH-PC) */}
                    <div className="rk-schools-header-row-v3">
                        <div>
                            <Eyebrow>Jejaring Satuan Pendidikan</Eyebrow>
                            <h1 className="rk-page-title">ROHIS Sekolah Anggota</h1>
                            <p className="rk-page-lead" style={{ marginTop: 10 }}>
                                Jejaring 17 SMA, SMK, dan MA yang terhubung dalam ROHIS
                                Kabupaten Banyumas.
                            </p>
                        </div>

                        <div
                            className="rk-school-summary-pills"
                            aria-label="Ringkasan jumlah sekolah per jenjang"
                        >
                            <div className="rk-school-summary-pill">
                                <span className="rk-school-summary-icon">
                                    <School size={18} />
                                </span>
                                <div>
                                    <strong>{counts.SMA}</strong>
                                    <span>SMA</span>
                                </div>
                            </div>
                            <div className="rk-school-summary-pill">
                                <span className="rk-school-summary-icon">
                                    <School size={18} />
                                </span>
                                <div>
                                    <strong>{counts.SMK}</strong>
                                    <span>SMK</span>
                                </div>
                            </div>
                            <div className="rk-school-summary-pill">
                                <span className="rk-school-summary-icon">
                                    <School size={18} />
                                </span>
                                <div>
                                    <strong>{counts.MA}</strong>
                                    <span>MA</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FILTER JENJANG & PENCARIAN */}
                    <div className="rk-filter-bar" style={{ marginTop: 22 }}>
                        <div
                            className="rk-filter-pills"
                            role="tablist"
                            aria-label="Filter jenjang sekolah"
                        >
                            {LEVEL_FILTERS.map((f) => {
                                const active = level === f.key;
                                return (
                                    <button
                                        key={f.key}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        className={`rk-filter-pill ${
                                            active ? 'is-active' : ''
                                        }`}
                                        onClick={() => setLevel(f.key)}
                                    >
                                        <School size={14} />
                                        <span>{f.label}</span>
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
                                placeholder="Cari sekolah..."
                                aria-label="Cari sekolah anggota ROKABA"
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

                    {/* GRID 17 SEKOLAH (PAPAN 10-SEKOLAH-PC) */}
                    {filteredSchools.length > 0 ? (
                        <div
                            className="rk-schools-grid-v3"
                            style={{ marginTop: 24 }}
                        >
                            {filteredSchools.map((school) => (
                                <SoftCard
                                    key={school.id}
                                    as="article"
                                    className={`rk-school-card-v3 ${
                                        activeBannerSchool?.id === school.id
                                            ? 'is-selected'
                                            : ''
                                    }`}
                                >
                                    <span
                                        className="rk-service-icon-badge rk-service-icon-badge--lg"
                                        aria-hidden="true"
                                    >
                                        <School size={22} />
                                    </span>

                                    <div className="rk-school-card-main-v3">
                                        <div className="rk-school-card-title-row">
                                            <h3>{school.name}</h3>
                                            <span className="rk-school-level-badge">
                                                {school.level}
                                            </span>
                                        </div>

                                        <p className="rk-school-card-sub">
                                            ROHIS Sekolah Anggota
                                        </p>

                                        <div className="rk-school-card-action-row">
                                            <span className="rk-school-district-text">
                                                <MapPin size={13} />
                                                {school.district}
                                            </span>
                                            <button
                                                type="button"
                                                className="rk-school-profile-btn"
                                                onClick={() =>
                                                    handleSelectSchool(school)
                                                }
                                            >
                                                <span>Lihat profil</span>
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </SoftCard>
                            ))}
                        </div>
                    ) : (
                        <SoftCard className="rk-empty-card" style={{ marginTop: 24 }}>
                            <p>
                                Tidak ditemukan sekolah dengan jenjang{' '}
                                <strong>{level}</strong> dan kata kunci{' '}
                                <strong>“{query}”</strong>.
                            </p>
                            <button
                                type="button"
                                className="rk-btn-secondary"
                                onClick={() => {
                                    setLevel('Semua');
                                    setQuery('');
                                }}
                            >
                                Tampilkan 17 sekolah
                            </button>
                        </SoftCard>
                    )}

                    {/* BANNER PROFIL SEKOLAH TERPILIH DI BAWAH GRID (PAPAN 10-SEKOLAH-PC) */}
                    {activeBannerSchool && (
                        <SoftCard
                            className="rk-school-inline-banner-v3"
                            style={{ marginTop: 22 }}
                        >
                            <div className="rk-school-inline-left">
                                <span className="rk-service-icon-badge rk-service-icon-badge--lg">
                                    <School size={22} />
                                </span>
                                <div>
                                    <h3>{activeBannerSchool.name}</h3>
                                    <p>
                                        Jenjang {activeBannerSchool.level} • Kabupaten
                                        Banyumas — Informasi profil singkat, kegiatan
                                        unggulan ({activeBannerSchool.focus.toLowerCase()}),
                                        dan kontak koordinasi ROHIS sekolah.
                                    </p>
                                </div>
                            </div>
                            <PrimaryButton to="/contact">
                                <span>Koordinasi Sekolah</span>
                                <ArrowRight size={15} />
                            </PrimaryButton>
                        </SoftCard>
                    )}
                </div>
            </section>

            {/* MODAL PROFIL SEKOLAH */}
            {modalOpen && selectedSchool && (
                <div
                    className="rk-modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="school-modal-title"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="rk-modal-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="rk-modal-head">
                            <GlassChip>Jenjang {selectedSchool.level}</GlassChip>
                            <button
                                type="button"
                                className="rk-modal-close"
                                onClick={() => setModalOpen(false)}
                                aria-label="Tutup profil sekolah"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <h2 id="school-modal-title">{selectedSchool.name}</h2>
                        <p
                            style={{
                                color: 'var(--rk-brass)',
                                fontWeight: 700,
                                marginTop: 4,
                            }}
                        >
                            {selectedSchool.rohisName}
                        </p>

                        <div className="rk-modal-meta-grid">
                            <div>
                                <MapPin size={16} />
                                <span>
                                    Kecamatan {selectedSchool.district}, Kabupaten
                                    Banyumas
                                </span>
                            </div>
                            <div>
                                <Users size={16} />
                                <span>
                                    Anggota Aktif Forum Komunikasi ROKABA
                                </span>
                            </div>
                            <div>
                                <AtSign size={16} />
                                <span>{selectedSchool.instagram}</span>
                            </div>
                        </div>

                        <p className="rk-modal-desc">
                            <strong>Fokus Gerak & Kegiatan:</strong>{' '}
                            {selectedSchool.focus}
                        </p>

                        <div className="rk-modal-actions">
                            <PrimaryButton to="/contact">
                                <span>Hubungi Koordinasi Sekolah</span>
                            </PrimaryButton>
                            <button
                                type="button"
                                className="rk-btn-secondary"
                                onClick={() => setModalOpen(false)}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
