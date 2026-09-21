import { parseImageUrl } from '@shared/services/mediaHelper.js';
import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  Users, Target, Heart, Award, BookOpen, Star,
  GraduationCap, Search, ExternalLink, ShieldCheck,
  Flame, Megaphone, Newspaper, Coins, Sparkles, X,
  Grid, Layers, ArrowRight, CheckCircle2
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
 * 5 Division Showcase Data (Matches Exact Reference)
 */
const DIVISION_SHOWCASE = [
  {
    num: '01',
    key: 'SDM',
    title: 'DIVISI SDM (SUMBER DAYA MANUSIA)',
    tag: 'DIVISI SDM',
    desc: 'Fokus pada pembinaan karakter, peningkatan kapasitas kader, regenerasi kepengurusan, serta penguatan soliditas anggota ROHIS se-Kabupaten Banyumas.',
    icon: Users,
    detailTitle: 'Divisi SDM (Sumber Daya Manusia)',
    detailDesc: 'Pusat kaderisasi dan pengembangan kapasitas generasi muda Islam yang membina karakter kepemimpinan, integritas, dan keilmuan pengurus rohis sekolah.',
    agendas: [
      'Latihan Dasar Kepemimpinan (LDK) ROHIS se-Banyumas',
      'Mentoring & upgrading berkala kapasitas pengurus',
      'Regenerasi & estafet kepengurusan terstruktur',
      'Pembinaan karakter Islami dan spiritual leadership',
      'Forum silaturahmi kader rohis lintas SMA/SMK/MA',
    ],
  },
  {
    num: '02',
    key: 'Dakwah',
    title: 'DIVISI DAKWAH',
    tag: 'DIVISI Dakwah',
    desc: 'Jantung gerakan dakwah Islam yang menyelenggarakan kajian keilmuan, pembinaan ruhiyah, serta syiar Islam yang rahmatan lil \'alamin bagi pelajar dan masyarakat.',
    icon: Flame,
    detailTitle: 'Divisi Dakwah',
    detailDesc: 'Jantung gerakan dakwah Islam yang menyelenggarakan kajian keilmuan, pembinaan ruhiyah, serta syiar Islam yang rahmatan lil \'alamin bagi pelajar dan masyarakat.',
    agendas: [
      'Kajian Ahad Pagi rutin se-Kabupaten Banyumas',
      'Halaqah tarbiyah & bimbingan keislaman mingguan',
      'Safari Dakwah ke sekolah-sekolah se-Banyumas',
      'Tabligh Akbar & Dauroh Tahsin Tilawah Al-Qur\'an',
      'Peringatan Hari Besar Islam (PHBI) bersama pelajar',
    ],
  },
  {
    num: '03',
    key: 'Jurnalistik',
    title: 'DIVISI JURNALISTIK',
    tag: 'DIVISI Jurnalistik',
    desc: 'Mengelola publikasi informasi, dokumentasi kegiatan, buletin dakwah, konten multimedia kreatif, dan syiar digital di era modern.',
    icon: Newspaper,
    detailTitle: 'Divisi Jurnalistik',
    detailDesc: 'Garda terdepan syiar kreatif visual dan literasi digital yang mengemas dakwah Islam dengan bahasa generasi muda yang inspiratif, edukatif, dan segar.',
    agendas: [
      'Penerbitan Buletin Dakwah Digital & Majalah Dinding',
      'Produksi video dakwah kreatif Instagram, TikTok & YouTube',
      'Liputan fotografi, videografi, dan dokumentasi kegiatan',
      'Pengelolaan portal website resmi & artikel islami pelajar',
      'Workshop jurnalistik, desain grafis & multimedia dakwah',
    ],
  },
  {
    num: '04',
    key: 'HUMAS',
    title: 'DIVISI HUMAS (HUBUNGAN MASYARAKAT)',
    tag: 'DIVISI HUMAS',
    desc: 'Menjadi jembatan komunikasi, relasi, dan sinergi antara ROHIS sekolah, instansi pemerintah, lembaga keagamaan, serta masyarakat luas.',
    icon: Megaphone,
    detailTitle: 'Divisi HUMAS (Hubungan Masyarakat)',
    detailDesc: 'Penghubung silaturahmi yang mempererat ukhuwah antar-pangkalan sekolah, membangun jejaring instansi dinas & kemenag, dan bakti sosial masyarakat.',
    agendas: [
      'Jaringan komunikasi & silaturahmi antar-ROHIS sekolah',
      'Sinergi kemitraan bersama Kemenag & Dinas Pendidikan',
      'Aksi kepedulian sosial kemanusiaan & tanggap bencana',
      'Publikasi hubungan eksternal dan keterbukaan informasi',
      'Sarasehan & forum temu pembina ROHIS se-Kabupaten Banyumas',
    ],
  },
  {
    num: '05',
    key: 'DANUS',
    title: 'DIVISI DANUS (DANA USAHA)',
    tag: 'DIVISI DANUS',
    desc: 'Membangun kemandirian finansial organisasi melalui kegiatan kewirausahaan halal, pengadaan merchandise resmi, kemitraan sponsorship, dan unit usaha produktif.',
    icon: Coins,
    detailTitle: 'Divisi DANUS (Dana Usaha)',
    detailDesc: 'Membangun pilar kemandirian ekonomi dakwah melalui unit usaha kreatif, merchandise resmi, dan kemitraan sponsorship produktif yang halal dan berkah.',
    agendas: [
      'Pengadaan atribut resmi & merchandise resmi ROKABA',
      'Bazar kewirausahaan halal pada perhelatan agenda akbar',
      'Manajemen kemitraan sponsorship & donasi dakwah',
      'Pelatihan kewirausahaan mandiri bagi kader pelajar',
      'Pengelolaan unit dana abadi organisasi secara transparan',
    ],
  },
];

/**
 * Master Division Definitions for Filtering Pengurus
 */
const DIVISIONS = [
  {
    id: 'ALL',
    label: 'Semua Divisi',
    shortName: 'Semua',
    icon: Sparkles,
    tagline: 'Sinergi Seluruh Divisi Pengurus ROKABA',
    description: 'Seluruh struktur kepengurusan ROHIS Kabupaten Banyumas yang bersinergi dalam menjalankan misi dakwah pelajar.',
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

/**
 * Normalizes member division to match division id
 */
function getMemberDivisionId(member) {
  const div = (member?.division || member?.department || '').toLowerCase();
  const role = (member?.role || member?.position || '').toLowerCase();
  if (div.includes('bph') || role.includes('ketua') || role.includes('sekretaris') || role.includes('bendahara') || role.includes('kadep')) return 'BPH';
  if (div.includes('sdm')) return 'SDM';
  if (div.includes('dakwah')) return 'Dakwah';
  if (div.includes('humas')) return 'HUMAS';
  if (div.includes('jurnalistik') || div.includes('media')) return 'Jurnalistik';
  if (div.includes('danus') || div.includes('dana')) return 'DANUS';
  return 'BPH';
}

/**
 * Normalizes Instagram URL and Handle
 */
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
 * Member Card Component
 */
function MemberCard({ member, index }) {
  const isLeadership =
    member.role === 'Ketua Umum' ||
    member.role === 'Ketua Ikhwan' ||
    member.role === 'Ketua Akhwat';
  const isKoordinator =
    (member.position || member.role || '').toLowerCase().includes('koordinator') ||
    (member.position || member.role || '').toLowerCase().includes('sekretaris') ||
    (member.position || member.role || '').toLowerCase().includes('bendahara');

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

  return (
    <div
      className="member-card animate-fade-in-up"
      style={{
        animationDelay: `${(index % 12) * 50}ms`,
      }}
    >
      {/* Avatar with Initials or Photo */}
      <div className={`member-card-avatar ${isLeadership ? 'leadership' : ''}`}>
        {member.photo ? (
          <img
            src={parseImageUrl(member.photo)} referrerPolicy="no-referrer"
            alt={member.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

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
          fontSize: '1rem',
          fontWeight: 700,
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
            fontSize: '0.78rem',
            color: 'rgba(13, 43, 34, 0.65)',
            marginBottom: '0.75rem',
            lineHeight: 1.3,
          }}
        >
          <GraduationCap size={13} style={{ flexShrink: 0, color: 'var(--antique-brass)' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {member.school}
          </span>
        </div>
      ) : (
        <div style={{ height: '1.2rem', marginBottom: '0.75rem' }} />
      )}

      {/* Bio Snippet if exists */}
      {member.bio && (
        <p
          style={{
            fontSize: '0.76rem',
            color: 'rgba(13, 43, 34, 0.55)',
            lineHeight: 1.45,
            marginBottom: '0.85rem',
            fontStyle: 'italic',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          "{member.bio}"
        </p>
      )}

      {/* Instagram Button */}
      <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
        {igUrl ? (
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-instagram"
            aria-label={`Instagram ${member.name}`}
            title={`Buka Instagram ${igHandle}`}
          >
            <InstagramIcon size={14} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {igHandle}
            </span>
          </a>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              color: 'rgba(13, 43, 34, 0.3)',
              padding: '0.3rem 0.6rem',
            }}
          >
            <InstagramIcon size={13} style={{ opacity: 0.4 }} />
            <span>—</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default function About() {
  const { team: rawTeam } = useData();

  // Safely normalize team to always be an array of members
  const team = useMemo(() => {
    if (Array.isArray(rawTeam)) return rawTeam;
    if (!rawTeam || typeof rawTeam !== 'object') return [];
    const list = [];
    if (Array.isArray(rawTeam.bph)) {
      rawTeam.bph.forEach((m, idx) => list.push({
        ...m,
        id: m.id || `bph-${idx}`,
        position: m.position || m.role || 'Pengurus BPH',
        role: m.role || m.position || 'Pengurus BPH',
        division: m.division || 'BPH',
      }));
    }
    const divs = Array.isArray(rawTeam.divisions)
      ? rawTeam.divisions
      : (rawTeam.divisions ? Object.values(rawTeam.divisions) : []);
    divs.forEach(div => {
      const divName = div.name || div.title || div.id || 'Divisi';
      const short = div.shortName || divName;
      if (Array.isArray(div.members)) {
        div.members.forEach((m, idx) => list.push({
          ...m,
          id: m.id || `${short}-${idx}`,
          position: m.position || m.role || 'Anggota Divisi',
          role: m.role || m.position || 'Anggota Divisi',
          division: m.division || short || divName,
        }));
      }
    });
    return list;
  }, [rawTeam]);

  // Division Filter & View States
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('tabs'); // 'tabs' | 'grouped'

  // Showcase Active Division Index (0: SDM, 1: Dakwah, 2: Jurnalistik, 3: HUMAS, 4: DANUS)
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState(1); // Default to Divisi Dakwah as in screenshot

  // Calculate Member Counts per Division safely
  const divisionCounts = useMemo(() => {
    const safeTeam = Array.isArray(team) ? team : [];
    const counts = { ALL: safeTeam.length };
    DIVISIONS.slice(1).forEach(div => {
      counts[div.id] = safeTeam.filter(m => getMemberDivisionId(m) === div.id).length;
    });
    return counts;
  }, [team]);

  // Active Division Meta for Pengurus
  const activeDivMeta = useMemo(() => {
    return DIVISIONS.find(d => d.id === selectedDivision) || DIVISIONS[0];
  }, [selectedDivision]);

  // Filtered List for Pengurus safely
  const filteredTeam = useMemo(() => {
    const safeTeam = Array.isArray(team) ? team : [];
    return safeTeam.filter(member => {
      const matchDivision =
        selectedDivision === 'ALL' || getMemberDivisionId(member) === selectedDivision;
      if (!matchDivision) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const name = (member.name || '').toLowerCase();
      const pos = (member.position || member.role || '').toLowerCase();
      const school = (member.school || '').toLowerCase();
      const ig = (member.instagram || '').toLowerCase();
      return name.includes(q) || pos.includes(q) || school.includes(q) || ig.includes(q);
    });
  }, [team, selectedDivision, searchQuery]);

  const currentShowcase = DIVISION_SHOWCASE[activeShowcaseIdx] || DIVISION_SHOWCASE[0];
  const ShowcaseIcon = currentShowcase.icon;

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section
        style={{
          background: 'var(--deep-pine)',
          paddingTop: '8rem',
          paddingBottom: '4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at 30% 50%, rgba(16,185,129,0.08) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="container"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 1.5rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span className="badge badge-emerald animate-fade-in-up" style={{ marginBottom: '1rem' }}>
            <BookOpen size={14} /> Tentang ROKABA
          </span>
          <h1
            className="animate-fade-in-up delay-100"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 800,
              color: 'var(--warm-alabaster)',
              maxWidth: 700,
              lineHeight: 1.15,
            }}
          >
            Forum Komunikasi Rohis{' '}
            <span style={{ color: 'var(--emerald-light)' }}>Kabupaten Banyumas</span>
          </h1>
          <p
            className="animate-fade-in-up delay-200"
            style={{
              color: 'rgba(245,242,237,0.55)',
              fontSize: '1.05rem',
              maxWidth: 600,
              marginTop: '1.25rem',
              lineHeight: 1.7,
            }}
          >
            Wadah koordinasi dan sinergi seluruh Rohis SMA/SMK/MA se-Kabupaten Banyumas dalam menjalankan misi dakwah pelajar.
          </p>
        </div>
      </section>

      {/* ═══ SEJARAH & LATAR BELAKANG (Exact Match to Screenshot 2) ═══ */}
      <section
        className="section"
        style={{
          background: 'var(--deep-pine)',
          backgroundImage: `
            radial-gradient(ellipse at 70% 30%, rgba(16,185,129,0.08) 0%, transparent 60%),
            url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2310B981' stroke-width='0.75' stroke-opacity='0.08'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z'/%3E%3Ccircle cx='40' cy='40' r='18'/%3E%3Ccircle cx='40' cy='40' r='28'/%3E%3Cpath d='M0 0 L80 80 M80 0 L0 80'/%3E%3C/g%3E%3C/svg%3E")
          `,
          padding: '5rem 0',
          position: 'relative',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left: History Narrative */}
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: 800,
                  color: 'var(--warm-alabaster)',
                  marginBottom: '1.75rem',
                  lineHeight: 1.2,
                }}
              >
                Sejarah & Latar Belakang
              </h2>

              <p
                style={{
                  color: 'rgba(245, 242, 237, 0.72)',
                  fontSize: '0.96rem',
                  lineHeight: 1.85,
                  marginBottom: '1.35rem',
                }}
              >
                Organisasi ROHIS Kabupaten Banyumas didirikan pada tahun 2017 sebagai wadah koordinasi dan silaturahmi antar ROHIS (Rohani Islam) sekolah tingkat SMA/SMK/MA se-Kabupaten Banyumas, Jawa Tengah.
              </p>

              <p
                style={{
                  color: 'rgba(245, 242, 237, 0.72)',
                  fontSize: '0.96rem',
                  lineHeight: 1.85,
                  marginBottom: '1.35rem',
                }}
              >
                Berawal dari inisiatif beberapa pengurus ROHIS sekolah yang merasa perlu adanya sinergi dan kolaborasi lintas sekolah, organisasi ini terus berkembang hingga kini menjadi pusat dakwah pemuda Islam yang menaungi lebih dari 15 sekolah di Kabupaten Banyumas dengan puluhan kader dakwah aktif.
              </p>

              <p
                style={{
                  color: 'rgba(245, 242, 237, 0.72)',
                  fontSize: '0.96rem',
                  lineHeight: 1.85,
                }}
              >
                Selain mengkoordinasikan kegiatan antar ROHIS, organisasi ini juga menyelenggarakan program-program dakwah, pendidikan, sosial, dan pengembangan kapasitas yang terbuka untuk seluruh pemuda Muslim di Kabupaten Banyumas.
              </p>
            </div>

            {/* Right: 3 Vertical Stat Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { number: '2017', label: 'Tahun Berdiri' },
                { number: '15+', label: 'Dari Sekolah Kab. Banyumas' },
                { number: '53+', label: 'Anggota Aktif' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(10, 32, 24, 0.75)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '1.85rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'rgba(181, 141, 79, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(2.2rem, 3.5vw, 2.75rem)',
                      fontWeight: 800,
                      color: '#E6C587',
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {stat.number}
                  </div>
                  <div
                    style={{
                      color: 'rgba(245, 242, 237, 0.65)',
                      fontSize: '0.86rem',
                      marginTop: '0.5rem',
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ VISION & MISSION ═══ */}
      <section className="section" style={{ background: 'var(--warm-alabaster)' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            <div
              className="animate-fade-in-up"
              style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                border: '1px solid rgba(13,43,34,0.06)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  background: 'var(--emerald-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <Target size={26} style={{ color: 'var(--emerald)' }} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Visi</h3>
              <p style={{ color: 'rgba(13,43,34,0.6)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                Menjadi forum dakwah pelajar paling modern, inklusif, dan kredibel di Kabupaten Banyumas yang mengedepankan nilai Islam Rahmatan Lil Alamin.
              </p>
            </div>

            <div
              className="animate-fade-in-up delay-200"
              style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                border: '1px solid rgba(13,43,34,0.06)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  background: 'rgba(181,141,79,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <Star size={26} style={{ color: 'var(--antique-brass)' }} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Misi</h3>
              <ul style={{ color: 'rgba(13,43,34,0.6)', lineHeight: 2, fontSize: '0.95rem', paddingLeft: '1.25rem' }}>
                <li>Menyatukan dan mengkoordinasikan seluruh Rohis se-Banyumas</li>
                <li>Mengembangkan literasi Islam moderat untuk pelajar</li>
                <li>Memfasilitasi pengembangan kader dakwah yang berkualitas</li>
                <li>Menyelenggarakan kegiatan syiar yang kreatif dan berdampak</li>
                <li>Memanfaatkan teknologi digital untuk dakwah</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ VALUES ═══ */}
      <section className="section section-pine">
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-header">
            <h2>Nilai-Nilai Kami</h2>
            <div className="section-divider" />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              { icon: Heart, title: 'Rahmatan Lil Alamin', desc: 'Islam yang penuh kasih sayang dan membawa manfaat untuk semua.' },
              { icon: Users, title: 'Ukhuwah', desc: 'Persaudaraan yang erat antar sesama kader rohis.' },
              { icon: Award, title: 'Keunggulan', desc: 'Selalu berusaha menjadi yang terbaik dalam dakwah dan ilmu.' },
              { icon: BookOpen, title: 'Literasi', desc: 'Mengutamakan ilmu dan wawasan sebagai bekal dakwah.' },
            ].map((value, i) => (
              <div
                key={i}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${i * 100}ms`,
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, var(--emerald), var(--emerald-dark))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    boxShadow: 'var(--shadow-emerald)',
                  }}
                >
                  <value.icon size={22} color="white" />
                </div>
                <h4 style={{ color: 'var(--warm-alabaster)', marginBottom: '0.5rem', fontSize: '1.05rem' }}>{value.title}</h4>
                <p style={{ color: 'rgba(245,242,237,0.5)', fontSize: '0.85rem', lineHeight: 1.6 }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5 DIVISI PROGRAM KERJA INTERAKTIF (Exact Match to Screenshot 1) ═══ */}
      <section
        className="section"
        id="program-divisi"
        style={{
          background: 'var(--deep-pine)',
          backgroundImage: `
            radial-gradient(ellipse at 30% 70%, rgba(16,185,129,0.06) 0%, transparent 65%),
            url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2310B981' stroke-width='0.75' stroke-opacity='0.08'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z'/%3E%3Ccircle cx='40' cy='40' r='18'/%3E%3Ccircle cx='40' cy='40' r='28'/%3E%3Cpath d='M0 0 L80 80 M80 0 L0 80'/%3E%3C/g%3E%3C/svg%3E")
          `,
          padding: '5rem 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
              <Sparkles size={14} /> 5 Pilar Gerakan
            </span>
            <h2 style={{ color: 'var(--warm-alabaster)' }}>Fokus & Program Divisi</h2>
            <div className="section-divider" />
            <p style={{ color: 'rgba(245,242,237,0.6)' }}>
              5 divisi utama penggerak dakwah, kaderisasi kepemimpinan, dan syiar pelajar Islam se-Kabupaten Banyumas.
            </p>
          </div>

          {/* Interactive 2-Column Explorer */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '2rem',
              alignItems: 'start',
            }}
          >
            {/* Left: 01 to 05 List Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {DIVISION_SHOWCASE.map((item, idx) => {
                const isActive = activeShowcaseIdx === idx;

                return (
                  <div
                    key={item.num}
                    onClick={() => setActiveShowcaseIdx(idx)}
                    style={{
                      background: isActive ? 'rgba(20, 56, 44, 0.9)' : 'rgba(10, 32, 24, 0.65)',
                      border: isActive ? '1px solid rgba(181, 141, 79, 0.75)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: isActive ? '0 0 24px rgba(181, 141, 79, 0.16)' : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                        e.currentTarget.style.background = 'rgba(15, 46, 36, 0.8)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.background = 'rgba(10, 32, 24, 0.65)';
                      }
                    }}
                  >
                    {/* Number (01, 02, etc.) */}
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.65rem',
                        fontWeight: 800,
                        color: isActive ? '#E6C587' : 'rgba(181, 141, 79, 0.75)',
                        minWidth: '2.5rem',
                        flexShrink: 0,
                        lineHeight: 1,
                      }}
                    >
                      {item.num}
                    </div>

                    {/* Middle Text */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <h4
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            color: 'var(--warm-alabaster)',
                            letterSpacing: '0.02em',
                            margin: 0,
                          }}
                        >
                          {item.title}
                        </h4>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: '#E6C587',
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: '0.82rem',
                          color: 'rgba(245, 242, 237, 0.62)',
                          lineHeight: 1.55,
                          marginTop: '0.35rem',
                          margin: '0.35rem 0 0',
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <div style={{ flexShrink: 0, color: isActive ? '#E6C587' : 'rgba(255, 255, 255, 0.25)' }}>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Active Division Detail Panel */}
            <div
              style={{
                background: 'rgba(10, 32, 24, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.3)',
                position: 'sticky',
                top: '6rem',
              }}
            >
              {/* Badge & Title Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '16px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--emerald-light)',
                    flexShrink: 0,
                  }}
                >
                  <ShowcaseIcon size={26} />
                </div>
                <div>
                  <div
                    style={{
                      color: '#E6C587',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {currentShowcase.tag}
                  </div>
                  <h3
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: 'var(--warm-alabaster)',
                      lineHeight: 1.15,
                    }}
                  >
                    {currentShowcase.detailTitle}
                  </h3>
                </div>
              </div>

              {/* Main Desc */}
              <p
                style={{
                  color: 'rgba(245, 242, 237, 0.72)',
                  fontSize: '0.88rem',
                  lineHeight: 1.7,
                  marginBottom: '1.75rem',
                }}
              >
                {currentShowcase.detailDesc}
              </p>

              {/* Agenda & Fokus Utama */}
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#E6C587',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}
              >
                AGENDA & FOKUS UTAMA:
              </div>

              {/* Checklists */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {currentShowcase.agendas.map((agenda, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                    }}
                  >
                    <CheckCircle2
                      size={17}
                      style={{ color: 'var(--emerald)', flexShrink: 0, marginTop: '2px' }}
                    />
                    <span
                      style={{
                        fontSize: '0.86rem',
                        color: 'rgba(245, 242, 237, 0.85)',
                        lineHeight: 1.5,
                      }}
                    >
                      {agenda}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  const el = document.getElementById('pengurus');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  setSelectedDivision(currentShowcase.key);
                }}
                style={{
                  marginTop: '2rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '9999px',
                  background: 'rgba(16, 185, 129, 0.22)',
                  border: '1px solid var(--emerald)',
                  color: 'var(--warm-alabaster)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  width: '100%',
                  justifyContent: 'center',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--emerald)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.22)';
                  e.currentTarget.style.color = 'var(--warm-alabaster)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Silabus Lengkap Divisi Ini <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Team / Struktur Pengurus ROKABA
          ═══════════════════════════════════════════ */}
      <section className="section" id="pengurus">
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Section Title */}
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
                  flex: '1 1 300px',
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
                  placeholder="Cari nama, jabatan, sekolah, atau IG..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
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
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
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

              {/* View Mode Toggle (Only visible when ALL division selected & no search) */}
              {selectedDivision === 'ALL' && !searchQuery.trim() && (
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
                    onClick={() => {
                      setSelectedDivision(div.id);
                    }}
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
                padding: '1.75rem 2rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
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
              <div style={{ flex: 1, minWidth: 260 }}>
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
          {searchQuery && (
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
                Menampilkan <strong>{filteredTeam.length}</strong> pengurus untuk pencarian &ldquo;{searchQuery}&rdquo;
              </span>
              <button
                onClick={() => setSearchQuery('')}
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

          {/* ═══ DISPLAY CONTENT ═══ */}
          {filteredTeam.length === 0 ? (
            /* Empty State */
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
                Tidak Ada Anggota Ditemukan
              </h3>
              <p style={{ color: 'rgba(13,43,34,0.5)', fontSize: '0.88rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
                Tidak ditemukan nama pengurus, jabatan, atau sekolah yang cocok dengan pencarian Anda.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDivision('ALL');
                }}
                className="btn btn-emerald"
                style={{ fontSize: '0.85rem', padding: '0.6rem 1.4rem' }}
              >
                Lihat Semua Pengurus
              </button>
            </div>
          ) : selectedDivision === 'ALL' && !searchQuery.trim() && viewMode === 'grouped' ? (
            /* ── GROUPED BY DIVISION VIEW ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {DIVISIONS.slice(1).map(division => {
                const divisionMembers = (Array.isArray(team) ? team : []).filter(m => getMemberDivisionId(m) === division.id);
                if (divisionMembers.length === 0) return null;

                const DivIcon = division.icon;

                return (
                  <div key={division.id} id={`divisi-${division.id.toLowerCase()}`}>
                    {/* Division Header Banner inside grouped view */}
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

                    {/* Member Cards Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '1.5rem',
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
            /* ── STANDARD FILTERED GRID VIEW ── */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {filteredTeam.map((member, i) => (
                <MemberCard key={member.id} member={member} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
