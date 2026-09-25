import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { parseImageUrl } from '@shared/services/mediaHelper.js';
import {
  School, Search, Users, Phone, MapPin, User,
  GraduationCap, ShieldCheck, Flame, Megaphone, Newspaper,
  Coins, X, Grid, Layers, ExternalLink, ArrowDown
} from 'lucide-react';

/**
 * Authentic SVG Instagram Icon (FEATHER / LUCIDE STYLE)
 */
function InstagramIcon({ size = 15, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/**
 * Divisions Definition for Pengurus ROKABA
 */
const DIVISIONS = [
  {
    id: 'ALL',
    label: 'Semua Pengurus',
    shortName: 'Semua',
    icon: Users,
    tagline: 'Seluruh Fungsionaris ROKABA 2025/2026',
    description: 'Badan Pengurus Harian bersama seluruh divisi penggerak dakwah pelajar Banyumas.',
    accentColor: 'var(--emerald)',
  },
  {
    id: 'BPH',
    label: 'Badan Pengurus Harian (BPH)',
    shortName: 'BPH',
    icon: ShieldCheck,
    tagline: 'Pusat Koordinasi, Kesekretariatan & Pengambilan Kebijakan',
    description: 'Penanggung jawab utama arah kebijakan organisasi, koordinasi umum, tata kelola persuratan, dan manajemen perbendaharaan.',
    accentColor: 'var(--antique-brass)',
  },
  {
    id: 'SDM',
    label: 'Divisi Sumber Daya Manusia (SDM)',
    shortName: 'SDM',
    icon: Users,
    tagline: 'Kaderisasi, Pembinaan Karakter & Pengembangan Potensi',
    description: 'Fokus pada regenerasi, peningkatan mutu kader rohis sekolah, mentoring kepemimpinan, dan Latihan Dasar Kepemimpinan (LDK).',
    accentColor: '#10B981',
  },
  {
    id: 'Dakwah',
    label: 'Divisi Syiar & Dakwah',
    shortName: 'Dakwah',
    icon: Flame,
    tagline: 'Penyebaran Nilai Islam Rahmatan Lil Alamin',
    description: 'Menginisiasi agenda kajian keislaman pelajar, pembinaan spiritual ibadah, agenda safari dakwah, dan dialog agama.',
    accentColor: '#F59E0B',
  },
  {
    id: 'HUMAS',
    label: 'Divisi Hubungan Masyarakat (HUMAS)',
    shortName: 'HUMAS',
    icon: Megaphone,
    tagline: 'Sinergi Antar-Sekolah & Kemitraan Eksternal',
    description: 'Menjadi jembatan silaturahmi antar pangkalan Rohis SMA/SMK/MA se-Banyumas, dinas/kemenag, serta stakeholder eksternal.',
    accentColor: '#3B82F6',
  },
  {
    id: 'Jurnalistik',
    label: 'Divisi Media & Jurnalistik',
    shortName: 'Jurnalistik',
    icon: Newspaper,
    tagline: 'Kreativitas Visual, Buletin & Dakwah Digital',
    description: 'Mengelola publikasi media sosial resmi, produksi konten kreatif grafis & video, buletin digital, dan pengelolaan portal website.',
    accentColor: '#EC4899',
  },
  {
    id: 'DANUS',
    label: 'Divisi Dana Usaha (DANUS)',
    shortName: 'DANUS',
    icon: Coins,
    tagline: 'Kemandirian Finansial & Kewirausahaan Mandiri',
    description: 'Mendorong kemandirian operasional dakwah melalui unit usaha halal, penyediaan atribut resmi rohis, dan sponsorship kreatif.',
    accentColor: '#8B5CF6',
  },
];

function getMemberDivisionId(member) {
  const div = (member?.division || member?.groupKey || member?.groupName || '').toLowerCase();
  if (div.includes('bph')) return 'BPH';
  if (div.includes('sdm')) return 'SDM';
  if (div.includes('dakwah')) return 'Dakwah';
  if (div.includes('humas')) return 'HUMAS';
  if (div.includes('jurnalistik')) return 'Jurnalistik';
  if (div.includes('danus') || div.includes('dana')) return 'DANUS';
  return 'LAINNYA';
}

function formatInstagramUrl(handle) {
  if (!handle) return null;
  const clean = handle.trim().replace(/^@+/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/+$/, '');
  if (!clean) return null;
  return `https://www.instagram.com/${clean}/`;
}

function formatInstagramHandle(handle) {
  if (!handle) return '';
  const clean = handle.trim().replace(/^@+/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/+$/, '');
  return `@${clean}`;
}

/**
 * Member Card Component (Sesuai Mockup Disetujui)
 */
function MemberCard({ member, index }) {
  const [imgError, setImgError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);
  const isLeadership =
    member.role === 'Ketua Umum' ||
    member.role === 'Ketua Ikhwan' ||
    member.role === 'Ketua Akhwat';
  const isKoordinator =
    (member.position || '').toLowerCase().includes('koordinator') ||
    (member.position || '').toLowerCase().includes('sekretaris') ||
    (member.position || '').toLowerCase().includes('bendahara');

  const igUrl = formatInstagramUrl(member.instagram);
  const igHandle = formatInstagramHandle(member.instagram);
  const initials = member.name
    ? member.name
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'RO';

  const driveIdMatch = member.photo && typeof member.photo === 'string'
    ? (member.photo.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i) || member.photo.match(/[?&]id=([a-zA-Z0-9_-]+)/i))
    : null;
  const driveId = driveIdMatch ? driveIdMatch[1] : null;

  const photoSrc = triedFallback && driveId
    ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`
    : parseImageUrl(member.photo);

  const hasPhoto = Boolean(member.photo && typeof member.photo === 'string' && member.photo.trim().length > 0 && !imgError);

  const handleImgError = () => {
    if (driveId && !triedFallback) {
      setTriedFallback(true);
    } else {
      setImgError(true);
    }
  };

  return (
    <div
      className="member-card animate-fade-in-up"
      style={{
        animationDelay: `${(index % 12) * 50}ms`,
      }}
    >
      {/* Area Foto Bagian Atas Membentang Penuh dengan Tepi Halus */}
      <div className={`member-card-photo-wrapper ${isLeadership ? 'leadership' : ''}`}>
        {hasPhoto ? (
          <img
            src={photoSrc}
            referrerPolicy="no-referrer"
            alt={member.name}
            onError={handleImgError}
            className="member-card-photo"
            loading="lazy"
          />
        ) : (
          <div className="member-card-initials-wrapper">
            <span className="member-card-initials-text">{initials}</span>
          </div>
        )}
      </div>

      {/* Bagian Informasi Pengurus di Bawah Foto */}
      <div className="member-card-content">
        {/* Position Badge */}
        <div style={{ marginBottom: '0.65rem' }}>
          <span
            className="badge"
            style={{
              fontSize: '0.72rem',
              padding: '0.25rem 0.75rem',
              fontWeight: 600,
              background: isLeadership
                ? 'rgba(181, 141, 79, 0.15)'
                : isKoordinator
                  ? 'var(--emerald-glass)'
                  : 'rgba(13, 43, 34, 0.05)',
              color: isLeadership
                ? '#996C2A'
                : isKoordinator
                  ? 'var(--emerald-dark)'
                  : 'rgba(13, 43, 34, 0.7)',
              border: isLeadership
                ? '1px solid rgba(181, 141, 79, 0.35)'
                : isKoordinator
                  ? '1px solid rgba(16, 185, 129, 0.28)'
                  : '1px solid rgba(13, 43, 34, 0.08)',
            }}
          >
            {member.position || member.role || 'Pengurus'}
          </span>
        </div>

        {/* Member Name */}
        <h4
          style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            marginBottom: '0.35rem',
            color: 'var(--deep-pine)',
            lineHeight: 1.3,
            minHeight: '2.6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {member.name}
        </h4>

        {/* School Name */}
        {member.school ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              color: 'rgba(13, 43, 34, 0.65)',
              marginBottom: '0.45rem',
              maxWidth: '100%',
            }}
          >
            <GraduationCap size={14} style={{ color: 'var(--antique-brass)', flexShrink: 0 }} />
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 200,
              }}
              title={member.school}
            >
              {member.school}
            </span>
          </div>
        ) : (
          <div style={{ height: '1.2rem', marginBottom: '0.45rem' }} />
        )}

        {/* Period */}
        <div
          style={{
            fontSize: '0.74rem',
            color: 'rgba(13, 43, 34, 0.45)',
            marginBottom: '1rem',
          }}
        >
          Periode {member.period || '2025/2026'}
        </div>

        {/* Instagram Button */}
        <div style={{ marginTop: 'auto', width: '100%' }}>
          {igUrl ? (
            <a
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-instagram"
              title={`Kunjungi profil Instagram ${member.name} (${igHandle})`}
              style={{ width: '100%' }}
            >
              <InstagramIcon size={14} />
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {igHandle}
              </span>
              <ExternalLink size={11} style={{ opacity: 0.7, marginLeft: 'auto', flexShrink: 0 }} />
            </a>
          ) : (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.8rem',
                fontSize: '0.74rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(13, 43, 34, 0.04)',
                color: 'rgba(13, 43, 34, 0.4)',
                border: '1px dashed rgba(13, 43, 34, 0.12)',
                width: '100%',
              }}
            >
              <InstagramIcon size={13} style={{ opacity: 0.5 }} />
              <span>Instagram: -</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Schools() {
  const { schools = [], team } = useData();

  // 1. Normalize Team Data
  const teamList = useMemo(() => {
    if (!team) return [];
    if (Array.isArray(team)) return team;
    if (typeof team === 'object') {
      const list = [];
      if (Array.isArray(team.bph)) {
        team.bph.forEach(m => list.push({
          ...m,
          division: m.division || 'BPH',
          groupKey: 'bph',
          groupName: 'Badan Pengurus Harian (BPH)'
        }));
      }
      if (Array.isArray(team.divisions)) {
        team.divisions.forEach(div => {
          (div.members || []).forEach(m => {
            list.push({
              ...m,
              division: m.division || div.shortName || div.name || 'Divisi',
              groupKey: (div.shortName || div.id || '').toLowerCase(),
              groupName: div.name
            });
          });
        });
      }
      return list;
    }
    return [];
  }, [team]);

  // States for Pengurus Filter
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [searchMember, setSearchMember] = useState('');
  const [viewMode, setViewMode] = useState('tabs'); // 'tabs' | 'grouped'

  // Member Counts per Division
  const divisionCounts = useMemo(() => {
    const counts = { ALL: teamList.length };
    DIVISIONS.slice(1).forEach(div => {
      counts[div.id] = teamList.filter(m => getMemberDivisionId(m) === div.id).length;
    });
    return counts;
  }, [teamList]);

  // Active Division Meta
  const activeDivMeta = useMemo(() => {
    return DIVISIONS.find(d => d.id === selectedDivision) || DIVISIONS[0];
  }, [selectedDivision]);

  // Filtered Pengurus
  const filteredTeam = useMemo(() => {
    return teamList.filter(member => {
      const matchDivision =
        selectedDivision === 'ALL' || getMemberDivisionId(member) === selectedDivision;
      if (!matchDivision) return false;

      if (!searchMember.trim()) return true;
      const q = searchMember.toLowerCase().trim();
      const name = (member.name || '').toLowerCase();
      const pos = (member.position || member.role || '').toLowerCase();
      const school = (member.school || '').toLowerCase();
      const ig = (member.instagram || '').toLowerCase();
      return name.includes(q) || pos.includes(q) || school.includes(q) || ig.includes(q);
    });
  }, [teamList, selectedDivision, searchMember]);

  // 2. States for Schools Filter
  const [searchSchool, setSearchSchool] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');

  const schoolTypes = ['Semua', ...new Set(schools.map(s => s.type).filter(Boolean))];
  const filteredSchools = useMemo(() => {
    return schools
      .filter(s => typeFilter === 'Semua' || s.type === typeFilter)
      .filter(s =>
        (s.name || '').toLowerCase().includes(searchSchool.toLowerCase()) ||
        (s.pembina || '').toLowerCase().includes(searchSchool.toLowerCase()) ||
        (s.address || '').toLowerCase().includes(searchSchool.toLowerCase())
      );
  }, [schools, typeFilter, searchSchool]);

  return (
    <div style={{ overflowX: 'clip', width: '100%' }}>
      {/* ═══ HERO: Keanggotaan ROKABA ═══ */}
      <section style={{
        background: 'var(--deep-pine)',
        paddingTop: '8rem',
        paddingBottom: '3.5rem',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 40% 60%, rgba(16,185,129,0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-emerald animate-fade-in-up" style={{ marginBottom: '1rem' }}>
            <Users size={14} /> Keanggotaan ROKABA
          </span>
          <h1 className="animate-fade-in-up delay-100" style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: 'var(--warm-alabaster)',
            lineHeight: 1.15,
          }}>
            Anggota & Pengurus ROKABA
          </h1>
          <p className="animate-fade-in-up delay-200" style={{
            color: 'rgba(245,242,237,0.72)',
            maxWidth: 620,
            marginTop: '0.85rem',
            fontSize: '1rem',
            lineHeight: 1.6,
          }}>
            Struktur kepengurusan resmi Rohis Kabupaten Banyumas Periode 2025/2026 serta direktori jaringan pangkalan ROHIS SMA, SMK, dan MA se-Kabupaten Banyumas.
          </p>

          {/* Quick Jump Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            <a
              href="#pengurus"
              className="btn btn-emerald"
              style={{ fontSize: '0.86rem', padding: '0.65rem 1.35rem' }}
            >
              <Users size={15} /> Lihat Pengurus ROKABA
            </a>
            <a
              href="#sekolah"
              className="btn btn-outline"
              style={{ fontSize: '0.86rem', padding: '0.65rem 1.35rem', borderColor: 'rgba(245,242,237,0.25)', color: 'var(--warm-alabaster)' }}
            >
              <School size={15} /> Direktori Sekolah Anggota <ArrowDown size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════
          BAGIAN 1 (ATAS): STRUKTUR PENGURUS ROKABA
          ═════════════════════════════════════════════════ */}
      <section className="section" id="pengurus" style={{ background: 'var(--warm-alabaster)', borderBottom: '1px solid rgba(13,43,34,0.06)' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Section Header */}
          <div className="section-header">
            <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
              <Users size={13} /> Struktur Kepengurusan
            </span>
            <h2>Pengurus ROKABA</h2>
            <div className="section-divider" />
            <p>
              Generasi muda berdedikasi yang mengemban amanah memajukan dakwah pelajar Islam di Kabupaten Banyumas Periode 2025/2026.
            </p>
          </div>

          {/* Division Filter Tabs & Controls */}
          <div style={{ marginBottom: '2rem' }}>
            {/* Search and View Controls */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              {/* Search Box */}
              <div
                style={{
                  position: 'relative',
                  flex: '1 1 240px',
                  maxWidth: 420,
                }}
              >
                <Search
                  size={17}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(13,43,34,0.4)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  placeholder="Cari nama pengurus, jabatan, sekolah, atau IG..."
                  value={searchMember}
                  onChange={e => setSearchMember(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.68rem 2.4rem 0.68rem 2.7rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(13,43,34,0.12)',
                    background: 'white',
                    fontSize: '0.88rem',
                    color: 'var(--deep-pine)',
                    outline: 'none',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'border-color var(--transition-fast)',
                  }}
                />
                {searchMember && (
                  <button
                    onClick={() => setSearchMember('')}
                    style={{
                      position: 'absolute',
                      right: '0.8rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'rgba(13,43,34,0.4)',
                      padding: '0.2rem',
                    }}
                    title="Hapus pencarian"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* View Mode Toggle */}
              {selectedDivision === 'ALL' && !searchMember.trim() && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'white',
                    padding: '0.25rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(13,43,34,0.1)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <button
                    onClick={() => setViewMode('tabs')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.9rem',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: viewMode === 'tabs' ? 'var(--deep-pine)' : 'transparent',
                      color: viewMode === 'tabs' ? 'var(--warm-alabaster)' : 'rgba(13,43,34,0.6)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Grid size={14} /> Grid
                  </button>
                  <button
                    onClick={() => setViewMode('grouped')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.9rem',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: viewMode === 'grouped' ? 'var(--deep-pine)' : 'transparent',
                      color: viewMode === 'grouped' ? 'var(--warm-alabaster)' : 'rgba(13,43,34,0.6)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Layers size={14} /> Per Divisi
                  </button>
                </div>
              )}
            </div>

            {/* Division Pill Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.6rem',
                alignItems: 'center',
              }}
            >
              {DIVISIONS.map(div => {
                const isActive = selectedDivision === div.id;
                const IconComponent = div.icon;
                const count = divisionCounts[div.id] || 0;

                return (
                  <button
                    key={div.id}
                    onClick={() => setSelectedDivision(div.id)}
                    className={`division-pill ${isActive ? 'active' : ''}`}
                    title={div.label}
                  >
                    <IconComponent size={15} style={{ color: isActive ? 'var(--emerald-light)' : div.accentColor }} />
                    <span>{div.shortName}</span>
                    <span className="pill-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Division Hero Banner (Shown when a specific division is filtered) */}
          {selectedDivision !== 'ALL' && (
            <div
              className="animate-fade-in-up"
              style={{
                background: 'linear-gradient(135deg, rgba(13,43,34,0.03) 0%, rgba(16,185,129,0.06) 100%)',
                border: '1px solid rgba(16,185,129,0.18)',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(1.25rem, 3vw, 1.75rem) clamp(1rem, 3vw, 2rem)',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '16px',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid rgba(13,43,34,0.08)',
                  color: activeDivMeta.accentColor,
                  flexShrink: 0,
                }}
              >
                <activeDivMeta.icon size={28} />
              </div>
              <div style={{ flex: 1, minWidth: 'min(100%, 220px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--deep-pine)' }}>
                    {activeDivMeta.label}
                  </h3>
                  <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                    {filteredTeam.length} Pengurus
                  </span>
                </div>
                <p
                  style={{
                    color: 'var(--antique-brass)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    marginTop: '0.2rem',
                  }}
                >
                  {activeDivMeta.tagline}
                </p>
                <p
                  style={{
                    color: 'rgba(13,43,34,0.65)',
                    fontSize: '0.86rem',
                    marginTop: '0.35rem',
                    lineHeight: 1.6,
                  }}
                >
                  {activeDivMeta.description}
                </p>
              </div>
            </div>
          )}

          {/* Search Result Feedback */}
          {searchMember && (
            <div
              style={{
                marginBottom: '1.5rem',
                fontSize: '0.88rem',
                color: 'rgba(13,43,34,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>
                Menampilkan <strong>{filteredTeam.length}</strong> pengurus untuk pencarian &ldquo;{searchMember}&rdquo;
              </span>
              <button
                onClick={() => setSearchMember('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--emerald)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Reset
              </button>
            </div>
          )}

          {/* Display Cards */}
          {filteredTeam.length === 0 ? (
            <div
              style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                border: '1px dashed rgba(13,43,34,0.15)',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(13,43,34,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: 'rgba(13,43,34,0.4)',
                }}
              >
                <Users size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--deep-pine)', marginBottom: '0.5rem' }}>
                Tidak Ada Pengurus Ditemukan
              </h3>
              <p style={{ color: 'rgba(13,43,34,0.5)', fontSize: '0.88rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
                Tidak ditemukan nama pengurus, jabatan, atau sekolah yang cocok dengan pencarian Anda.
              </p>
              <button
                onClick={() => {
                  setSearchMember('');
                  setSelectedDivision('ALL');
                }}
                className="btn btn-emerald"
                style={{ fontSize: '0.85rem', padding: '0.6rem 1.4rem' }}
              >
                Lihat Semua Pengurus
              </button>
            </div>
          ) : selectedDivision === 'ALL' && !searchMember.trim() && viewMode === 'grouped' ? (
            /* Grouped by division view */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {DIVISIONS.slice(1).map(division => {
                const divisionMembers = teamList.filter(m => getMemberDivisionId(m) === division.id);
                if (divisionMembers.length === 0) return null;

                const DivIcon = division.icon;

                return (
                  <div key={division.id} id={`divisi-${division.id.toLowerCase()}`}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '0.85rem',
                        marginBottom: '1.5rem',
                        borderBottom: '2px solid rgba(13,43,34,0.08)',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '12px',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(13,43,34,0.08)',
                            color: division.accentColor,
                            boxShadow: 'var(--shadow-sm)',
                          }}
                        >
                          <DivIcon size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--deep-pine)' }}>
                            {division.label}
                          </h3>
                          <p style={{ fontSize: '0.82rem', color: 'rgba(13,43,34,0.6)' }}>
                            {division.tagline}
                          </p>
                        </div>
                      </div>
                      <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                        {divisionMembers.length} Pengurus
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
                        gap: '1.25rem',
                      }}
                    >
                      {divisionMembers.map((member, i) => (
                        <MemberCard key={member.id} member={member} index={i} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Standard Filtered Grid View */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
                gap: '1.25rem',
              }}
            >
              {filteredTeam.map((member, i) => (
                <MemberCard key={member.id} member={member} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════
          BAGIAN 2 (BAWAH): DIREKTORI SEKOLAH ANGGOTA
          ═════════════════════════════════════════════════ */}
      <section className="section" id="sekolah" style={{ background: 'white' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Section Header */}
          <div className="section-header">
            <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
              <School size={13} /> Direktori Sekolah Anggota
            </span>
            <h2>Sekolah Anggota ROKABA</h2>
            <div className="section-divider" />
            <p>
              Pangkalan ROHIS SMA, SMK, dan MA se-Kabupaten Banyumas yang tergabung dalam wadah silaturahmi dan ukhuwah ROKABA.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(13,43,34,0.3)' }} />
              <input
                type="text"
                placeholder="Cari sekolah, pembina, atau alamat..."
                value={searchSchool}
                onChange={e => setSearchSchool(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {schoolTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* School Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
            {filteredSchools.map((school, i) => (
              <div
                key={school.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${i * 60}ms`,
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                  border: '1px solid rgba(13,43,34,0.08)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'rgba(13,43,34,0.08)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span className="badge badge-pine" style={{ marginBottom: '0.5rem' }}>{school.type}</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--deep-pine)', lineHeight: 1.3 }}>{school.name}</h3>
                  </div>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: 'var(--emerald-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <School size={20} style={{ color: 'var(--emerald)' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem', color: 'rgba(13,43,34,0.65)' }}>
                  {school.pembina && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={14} style={{ color: 'var(--antique-brass)', flexShrink: 0 }} />
                      <span>Pembina: <strong>{school.pembina}</strong></span>
                    </span>
                  )}
                  {school.memberCount && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={14} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                      <span>{school.memberCount} Anggota Terdaftar</span>
                    </span>
                  )}
                  {school.address && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={14} style={{ color: 'rgba(13,43,34,0.4)', flexShrink: 0 }} />
                      <span>{school.address}</span>
                    </span>
                  )}
                  {school.contact && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={14} style={{ color: 'rgba(13,43,34,0.4)', flexShrink: 0 }} />
                      <span>{school.contact}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredSchools.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(13,43,34,0.35)' }}>
              <School size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>Tidak ada sekolah ditemukan yang cocok dengan pencarian Anda.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
