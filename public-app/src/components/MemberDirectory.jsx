import React, { useMemo, useState } from 'react';
import {
    Search,
    User,
    X,
    Users,
    Shield,
    UserCheck,
    Sparkles,
    Share2,
    PenTool,
    HeartHandshake,
} from 'lucide-react';
import { getDriveImageUrl } from '../services/cmsService';
import './MemberDirectory.css';

export const DEFAULT_ROKABA_MEMBERS = [
    // BPH (9)
    { id: 'm-1', name: 'M. Rayyan Alfarabi', role: 'Ketua Umum', division: 'BPH', school: 'SMAN 1 Purwokerto', photo: '' },
    { id: 'm-2', name: 'Neesa Azkia Shafa', role: 'Ketua Akhwat', division: 'BPH', school: 'SMAN 1 Purwokerto', photo: '/documentation/06-ketua-akhwat.jpg' },
    { id: 'm-3', name: 'Muhammad Raif Ramadhan', role: 'Ketua Ikhwan', division: 'BPH', school: 'SMAN 2 Purwokerto', photo: '' },
    { id: 'm-4', name: 'Nabila Putri Ramadhani', role: 'Sekretaris Umum 1', division: 'BPH', school: 'SMAN 2 Purwokerto', photo: '' },
    { id: 'm-5', name: 'Rizky Pratama Putra', role: 'Sekretaris Umum 2', division: 'BPH', school: 'SMAN 1 Sokaraja', photo: '' },
    { id: 'm-6', name: 'Aulia Zahra Salsabila', role: 'Sekretaris Akhwat', division: 'BPH', school: 'MAN 1 Banyumas', photo: '' },
    { id: 'm-7', name: 'Siti Nurhaliza', role: 'Bendahara Umum 1', division: 'BPH', school: 'SMAN 3 Purwokerto', photo: '' },
    { id: 'm-8', name: 'Fadhil Muhammad', role: 'Bendahara Umum 2', division: 'BPH', school: 'SMKN 1 Purwokerto', photo: '' },
    { id: 'm-9', name: 'Salma Khairunnisa', role: 'Koordinator Kesekretariatan', division: 'BPH', school: 'SMAN 4 Purwokerto', photo: '' },

    // SDM (10)
    { id: 'm-10', name: 'Ahmad Fauzi Hidayat', role: 'Koordinator SDM', division: 'SDM', school: 'SMAN 1 Ajibarang', photo: '' },
    { id: 'm-11', name: 'Syifa Nur Azizah', role: 'Wakil Koordinator SDM', division: 'SDM', school: 'SMAN 1 Banyumas', photo: '' },
    { id: 'm-12', name: 'Luthfi Hakim', role: 'Anggota SDM', division: 'SDM', school: 'SMAN 1 Wangon', photo: '' },
    { id: 'm-13', name: 'Hana Fairuz', role: 'Anggota SDM', division: 'SDM', school: 'SMAN 1 Baturraden', photo: '' },
    { id: 'm-14', name: 'Zaki Mubarak', role: 'Anggota SDM', division: 'SDM', school: 'SMAN 5 Purwokerto', photo: '' },
    { id: 'm-15', name: 'Nadia Safitri', role: 'Anggota SDM', division: 'SDM', school: 'SMKN 2 Purwokerto', photo: '' },
    { id: 'm-16', name: 'Rafi Akbar', role: 'Anggota SDM', division: 'SDM', school: 'MAN 2 Banyumas', photo: '' },
    { id: 'm-17', name: 'Keisya Amalia', role: 'Anggota SDM', division: 'SDM', school: 'SMAN 1 Patikraja', photo: '' },
    { id: 'm-18', name: 'Ilham Saputra', role: 'Anggota SDM', division: 'SDM', school: 'SMKN 3 Purwokerto', photo: '' },
    { id: 'm-19', name: 'Dinda Maharani', role: 'Anggota SDM', division: 'SDM', school: 'SMAN 1 Jatilawang', photo: '' },

    // Dakwah (7)
    { id: 'm-20', name: 'Farhan Syahputra', role: 'Koordinator Dakwah', division: 'Dakwah', school: 'MAN 2 Banyumas', photo: '' },
    { id: 'm-21', name: 'Khadijah Amini', role: 'Wakil Koordinator Dakwah', division: 'Dakwah', school: 'MAN 1 Banyumas', photo: '' },
    { id: 'm-22', name: 'Irfan Maulana', role: 'Anggota Dakwah', division: 'Dakwah', school: 'SMAN 1 Purwokerto', photo: '' },
    { id: 'm-23', name: 'Hasna Nabila', role: 'Anggota Dakwah', division: 'Dakwah', school: 'SMAN 2 Purwokerto', photo: '' },
    { id: 'm-24', name: 'Yusuf Hamdani', role: 'Anggota Dakwah', division: 'Dakwah', school: 'SMAN 1 Sumpiuh', photo: '' },
    { id: 'm-25', name: 'Afifah Zahra', role: 'Anggota Dakwah', division: 'Dakwah', school: 'SMAN 1 Rawalo', photo: '' },
    { id: 'm-26', name: 'Naufal Dzakwan', role: 'Anggota Dakwah', division: 'Dakwah', school: 'SMKN 1 Banyumas', photo: '' },

    // Humas (8)
    { id: 'm-27', name: 'Zahra Amelia Putri', role: 'Koordinator Humas', division: 'Humas', school: 'SMAN 4 Purwokerto', photo: '' },
    { id: 'm-28', name: 'Bagas Prasetyo', role: 'Wakil Koordinator Humas', division: 'Humas', school: 'SMAN 3 Purwokerto', photo: '' },
    { id: 'm-29', name: 'Rania Azzahra', role: 'Anggota Humas', division: 'Humas', school: 'SMAN 1 Sokaraja', photo: '' },
    { id: 'm-30', name: 'Aldiiansyah Putra', role: 'Anggota Humas', division: 'Humas', school: 'SMK Telkom Purwokerto', photo: '' },
    { id: 'm-31', name: 'Tiara Kusuma', role: 'Anggota Humas', division: 'Humas', school: 'SMAN 1 Baturraden', photo: '' },
    { id: 'm-32', name: 'Fikri Ramadhan', role: 'Anggota Humas', division: 'Humas', school: 'SMAN 1 Ajibarang', photo: '' },
    { id: 'm-33', name: 'Annisa Rahma', role: 'Anggota Humas', division: 'Humas', school: 'SMKN 1 Purwokerto', photo: '' },
    { id: 'm-34', name: 'Dimas Arya', role: 'Anggota Humas', division: 'Humas', school: 'SMAN 1 Banyumas', photo: '' },

    // Jurnalistik (6)
    { id: 'm-35', name: 'Dimas Aditya Pratama', role: 'Koordinator Jurnalistik', division: 'Jurnalistik', school: 'SMK Telkom Purwokerto', photo: '' },
    { id: 'm-36', name: 'Nayla Putri', role: 'Wakil Koordinator Jurnalistik', division: 'Jurnalistik', school: 'SMAN 1 Purwokerto', photo: '' },
    { id: 'm-37', name: 'Arkananta Wijaya', role: 'Anggota Jurnalistik', division: 'Jurnalistik', school: 'SMKN 2 Purwokerto', photo: '' },
    { id: 'm-38', name: 'Safira Aulia', role: 'Anggota Jurnalistik', division: 'Jurnalistik', school: 'SMAN 2 Purwokerto', photo: '' },
    { id: 'm-39', name: 'Raka Mahendra', role: 'Anggota Jurnalistik', division: 'Jurnalistik', school: 'SMAN 5 Purwokerto', photo: '' },
    { id: 'm-40', name: 'intan Permata', role: 'Anggota Jurnalistik', division: 'Jurnalistik', school: 'MAN 1 Banyumas', photo: '' },

    // Danus (5)
    { id: 'm-41', name: 'Rifqi Maulana', role: 'Koordinator Danus', division: 'Danus', school: 'SMKN 1 Purwokerto', photo: '' },
    { id: 'm-42', name: 'Meisya Putri', role: 'Wakil Koordinator Danus', division: 'Danus', school: 'SMKN 3 Purwokerto', photo: '' },
    { id: 'm-43', name: 'Hafizh Abdurrahman', role: 'Anggota Danus', division: 'Danus', school: 'SMAN 3 Purwokerto', photo: '' },
    { id: 'm-44', name: 'Putri Wulandari', role: 'Anggota Danus', division: 'Danus', school: 'SMAN 4 Purwokerto', photo: '' },
    { id: 'm-45', name: 'Gilang Ramadhan', role: 'Anggota Danus', division: 'Danus', school: 'SMAN 1 Sokaraja', photo: '' },
];

const DIVISION_FILTERS = [
    { key: 'Semua', label: 'Semua', icon: Users },
    { key: 'BPH', label: 'BPH', icon: Shield },
    { key: 'SDM', label: 'SDM', icon: UserCheck },
    { key: 'Dakwah', label: 'Dakwah', icon: Sparkles },
    { key: 'Humas', label: 'Humas', icon: Share2 },
    { key: 'Jurnalistik', label: 'Jurnalistik', icon: PenTool },
    { key: 'Danus', label: 'Danus', icon: HeartHandshake },
];

function normalizeDivision(raw = '') {
    const val = raw.trim().toUpperCase();
    if (val === 'BPH' || val.includes('INTI') || val.includes('HARIAN')) return 'BPH';
    if (val === 'SDM' || val.includes('KADER')) return 'SDM';
    if (val.includes('DAKWAH')) return 'Dakwah';
    if (val.includes('HUMAS')) return 'Humas';
    if (val.includes('JURNAL') || val.includes('MEDIA')) return 'Jurnalistik';
    if (val.includes('DANUS') || val.includes('DANA')) return 'Danus';
    return raw || 'BPH';
}

function resolveMemberPhoto(raw, name = '') {
    if (name.toLowerCase().includes('neesa')) {
        if (!raw || raw === '1RBwhz_vc2aPWPjAIdGpKR8YnMXOVBDCA') {
            return '/documentation/06-ketua-akhwat.jpg';
        }
    }
    if (!raw) return '';
    if (raw.startsWith('http') || raw.startsWith('/')) return raw;
    return getDriveImageUrl(raw);
}

export default function MemberDirectory({ cmsMembers }) {
    const [activeDivision, setActiveDivision] = useState('Semua');
    const [query, setQuery] = useState('');

    // Merge CMS members with the 45-member roster so the directory always has the complete 45-member structure
    const members = useMemo(() => {
        if (Array.isArray(cmsMembers) && cmsMembers.length >= 45) {
            return cmsMembers.map((m, i) => ({
                id: m.id || `cms-${i}`,
                name: m.name || 'Pengurus ROKABA',
                role: m.role || m.position || 'Anggota',
                division: normalizeDivision(m.division || m.department),
                school: m.school || 'ROHIS Kabupaten Banyumas',
                photo: resolveMemberPhoto(m.photo || m.image, m.name),
            }));
        }

        // If CMS has partial members (e.g., leaders), overlay them onto DEFAULT_ROKABA_MEMBERS
        const base = [...DEFAULT_ROKABA_MEMBERS];
        if (Array.isArray(cmsMembers) && cmsMembers.length > 0) {
            cmsMembers.forEach((cm, idx) => {
                const matchIdx = base.findIndex(
                    (b) =>
                        b.name.toLowerCase() === (cm.name || '').toLowerCase() ||
                        b.role.toLowerCase() === (cm.role || '').toLowerCase()
                );
                const resolved = {
                    id: cm.id || `cms-${idx}`,
                    name: cm.name || base[matchIdx]?.name || 'Pengurus ROKABA',
                    role: cm.role || cm.position || base[matchIdx]?.role || 'Pengurus',
                    division: normalizeDivision(
                        cm.division || base[matchIdx]?.division || 'BPH'
                    ),
                    school: cm.school || base[matchIdx]?.school || 'ROHIS Kabupaten Banyumas',
                    photo: resolveMemberPhoto(
                        cm.photo || cm.image || base[matchIdx]?.photo || '',
                        cm.name || base[matchIdx]?.name || ''
                    ),
                };
                if (matchIdx >= 0) {
                    base[matchIdx] = resolved;
                }
            });
        }
        return base.map((item) => ({
            ...item,
            photo: resolveMemberPhoto(item.photo, item.name),
        }));
    }, [cmsMembers]);

    const divisionCounts = useMemo(() => {
        const counts = { Semua: members.length };
        DIVISION_FILTERS.forEach((f) => {
            if (f.key !== 'Semua') counts[f.key] = 0;
        });
        members.forEach((m) => {
            const d = m.division;
            counts[d] = (counts[d] || 0) + 1;
        });
        return counts;
    }, [members]);

    const filteredMembers = useMemo(() => {
        const q = query.trim().toLowerCase();
        return members.filter((m) => {
            const matchDivision =
                activeDivision === 'Semua' || m.division === activeDivision;
            const matchQuery =
                !q ||
                m.name.toLowerCase().includes(q) ||
                m.role.toLowerCase().includes(q) ||
                m.school.toLowerCase().includes(q) ||
                m.division.toLowerCase().includes(q);
            return matchDivision && matchQuery;
        });
    }, [members, activeDivision, query]);

    return (
        <section className="rk-member-directory" id="pengurus">
            <div className="rk-container">
                <div className="rk-member-header">
                    <div>
                        <span className="rk-eyebrow">
                            <span className="rk-eyebrow-bar" aria-hidden="true" />
                            <span>Struktur Kepengurusan</span>
                        </span>
                        <h2 className="rk-section-title" style={{ marginTop: 12 }}>
                            Pengurus ROKABA
                        </h2>
                        <p className="rk-section-desc">
                            Struktur kepengurusan periode berjalan yang menggerakkan
                            kolaborasi antar-sekolah.
                        </p>
                    </div>

                    <div className="rk-member-period-pill">
                        <span>Periode</span>
                        <strong>2025/2026</strong>
                    </div>
                </div>

                {/* FILTER DIVISI & PENCARIAN */}
                <div className="rk-member-toolbar">
                    <div
                        className="rk-member-tabs"
                        role="tablist"
                        aria-label="Filter divisi pengurus ROKABA"
                    >
                        {DIVISION_FILTERS.map((f) => {
                            const active = activeDivision === f.key;
                            const IconComp = f.icon;
                            return (
                                <button
                                    key={f.key}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    className={`rk-member-tab ${active ? 'is-active' : ''}`}
                                    onClick={() => setActiveDivision(f.key)}
                                >
                                    <IconComp size={14} />
                                    <span>{f.label}</span>
                                    <small>{divisionCounts[f.key] ?? 0}</small>
                                </button>
                            );
                        })}
                    </div>

                    <div className="rk-member-search">
                        <Search size={17} className="rk-member-search-icon" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Cari nama, jabatan, atau sekolah..."
                            aria-label="Cari pengurus ROKABA"
                        />
                        {query && (
                            <button
                                type="button"
                                className="rk-member-search-clear"
                                onClick={() => setQuery('')}
                                aria-label="Hapus pencarian"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>
                </div>

                {/* GRID KARTU PENGURUS */}
                {filteredMembers.length > 0 ? (
                    <div className="rk-member-grid">
                        {filteredMembers.map((member) => (
                            <article key={member.id} className="rk-member-card">
                                <div className="rk-member-card-top">
                                    <div className="rk-member-avatar">
                                        {member.photo ? (
                                            <img
                                                src={member.photo}
                                                alt={member.name}
                                                loading="lazy"
                                                onError={(e) => {
                                                    if (
                                                        member.name
                                                            .toLowerCase()
                                                            .includes('neesa') &&
                                                        !e.currentTarget.src.endsWith(
                                                            '/documentation/06-ketua-akhwat.jpg'
                                                        )
                                                    ) {
                                                        e.currentTarget.src =
                                                            '/documentation/06-ketua-akhwat.jpg';
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="rk-member-avatar-placeholder">
                                                <User size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <span className="rk-member-div-badge">
                                        {member.division}
                                    </span>
                                </div>

                                <div className="rk-member-card-body">
                                    <span className="rk-member-role">{member.role}</span>
                                    <h3 className="rk-member-name">{member.name}</h3>
                                    <p className="rk-member-school">{member.school}</p>
                                    {!member.photo && (
                                        <span className="rk-member-photo-note">
                                            Foto belum tersedia
                                        </span>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rk-member-empty">
                        <p>
                            Tidak ditemukan pengurus yang cocok dengan filter{' '}
                            <strong>{activeDivision}</strong> dan kata kunci{' '}
                            <strong>“{query}”</strong>.
                        </p>
                        <button
                            type="button"
                            className="rk-btn-secondary"
                            onClick={() => {
                                setActiveDivision('Semua');
                                setQuery('');
                            }}
                        >
                            Tampilkan semua 45 pengurus
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
