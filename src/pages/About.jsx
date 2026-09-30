import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Target, Heart, Award, BookOpen, Star,
  GraduationCap, ExternalLink, ShieldCheck,
  Flame, Megaphone, Newspaper, Coins, Sparkles,
  ArrowRight, CheckCircle2, School, X, ChevronLeft, ChevronRight
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



export default function About() {
  // Division Detail Modal State (null when closed, index 0..4 when opened)
  const [modalDivisionIdx, setModalDivisionIdx] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const activeModalItem =
    modalDivisionIdx !== null ? DIVISION_SHOWCASE[modalDivisionIdx] || null : null;
  const ActiveModalIcon = activeModalItem ? activeModalItem.icon : null;

  const openModal = (idx) => {
    setIsClosing(false);
    setModalDivisionIdx(idx);
  };

  const closeModal = () => {
    if (isClosing || modalDivisionIdx === null) return;
    setIsClosing(true);
    setTimeout(() => {
      setModalDivisionIdx(null);
      setIsClosing(false);
    }, 300);
  };

  // Handle ESC key, arrow key navigation, and lock body scroll when modal is open
  useEffect(() => {
    if (modalDivisionIdx === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        setModalDivisionIdx((prev) => (prev > 0 ? prev - 1 : DIVISION_SHOWCASE.length - 1));
      } else if (e.key === 'ArrowRight') {
        setModalDivisionIdx((prev) => (prev < DIVISION_SHOWCASE.length - 1 ? prev + 1 : 0));
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalDivisionIdx, isClosing]);

  return (
    <div style={{ overflowX: 'clip', width: '100%' }}>
      {/* ═══ HERO ═══ */}
      <section
        style={{
          background: 'var(--deep-pine)',
          paddingTop: '8rem',
          paddingBottom: '4rem',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
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
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 'clamp(1.5rem, 4vw, 3rem)',
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1.5rem',
            }}
          >
            <div
              className="animate-fade-in-up"
              style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
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
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '1.25rem',
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

      {/* ═══ 5 DIVISI PROGRAM KERJA DENGAN MODAL DETAIL INTERAKTIF ═══ */}
      <section
        className="section"
        id="program-divisi"
        style={{
          background: 'var(--deep-pine)',
          backgroundImage: `
            radial-gradient(ellipse at 30% 70%, rgba(16,185,129,0.06) 0%, transparent 65%),
            url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2310B981' stroke-width='0.75' stroke-opacity='0.08'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z'/%3E%3Ccircle cx='40' cy='40' r='18'/%3E%3Ccircle cx='40' cy='40' r='28'/%3E%3Cpath d='M0 0 L80 80 M80 0 L0 80'/%3E%3C/g%3E%3C/svg%3E")
          `,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
              <Sparkles size={14} /> 5 Pilar Gerakan
            </span>
            <h2 style={{ color: 'var(--warm-alabaster)' }}>Fokus & Program Divisi</h2>
            <div className="section-divider" />
            <p style={{ color: 'rgba(245,242,237,0.6)' }}>
              5 divisi utama penggerak dakwah, kaderisasi kepemimpinan, dan syiar pelajar Islam se-Kabupaten Banyumas.
            </p>
          </div>

          {/* 5 Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '1.25rem',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {DIVISION_SHOWCASE.map((item, idx) => {
              const ItemIcon = item.icon;

              return (
                <div
                  key={item.num}
                  onClick={() => openModal(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openModal(idx);
                    }
                  }}
                  style={{
                    background: 'linear-gradient(145deg, rgba(13, 35, 25, 0.85) 0%, rgba(7, 20, 14, 0.92) 100%)',
                    border: '1px solid rgba(200, 168, 91, 0.22)',
                    borderRadius: '20px',
                    padding: 'clamp(1.2rem, 3vw, 1.6rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.97)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.transform = 'scale(0.97)';
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(200, 168, 91, 0.65)';
                    e.currentTarget.style.boxShadow =
                      '0 16px 36px rgba(0, 0, 0, 0.4), 0 0 24px rgba(200, 168, 91, 0.15)';
                    e.currentTarget.style.background =
                      'linear-gradient(145deg, rgba(18, 48, 35, 0.95) 0%, rgba(10, 28, 20, 0.98) 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(200, 168, 91, 0.22)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
                    e.currentTarget.style.background =
                      'linear-gradient(145deg, rgba(13, 35, 25, 0.85) 0%, rgba(7, 20, 14, 0.92) 100%)';
                  }}
                >
                  {/* Top Bar: Number, Tag, & Icon */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.75rem',
                          fontWeight: 800,
                          color: '#DFBF73',
                          lineHeight: 1,
                        }}
                      >
                        {item.num}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: '#E6C587',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          background: 'rgba(200, 168, 91, 0.12)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(200, 168, 91, 0.25)',
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>

                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '14px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--emerald-light)',
                        flexShrink: 0,
                      }}
                    >
                      <ItemIcon size={22} />
                    </div>
                  </div>

                  {/* Division Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.12rem',
                      fontWeight: 700,
                      color: 'var(--warm-alabaster)',
                      margin: '0 0 0.5rem 0',
                      lineHeight: 1.35,
                    }}
                  >
                    {item.detailTitle}
                  </h3>

                  {/* Short Description */}
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'rgba(247, 245, 240, 0.68)',
                      lineHeight: 1.6,
                      margin: '0 0 1rem 0',
                      flexGrow: 1,
                    }}
                  >
                    {item.desc}
                  </p>

                  {/* Highlights (Preview 2 items) */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      marginBottom: '1.25rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    {item.agendas.slice(0, 2).map((agenda, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.78rem',
                          color: 'rgba(247, 245, 240, 0.82)',
                        }}
                      >
                        <CheckCircle2 size={13} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {agenda}
                        </span>
                      </div>
                    ))}
                    {item.agendas.length > 2 && (
                      <span style={{ fontSize: '0.72rem', color: '#DFBF73', fontWeight: 600, paddingLeft: '1.3rem' }}>
                        +{item.agendas.length - 2} program lainnya...
                      </span>
                    )}
                  </div>

                  {/* Interactive Action Prompt */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      color: '#DFBF73',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                    }}
                  >
                    <span>Buka Detail & Program</span>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'rgba(200, 168, 91, 0.15)',
                        border: '1px solid rgba(200, 168, 91, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MODAL POPUP DETAIL DIVISI (Cinematic Smooth Zoom & Approach) ── */}
        {activeModalItem && (
          <div
            onClick={closeModal}
            className={isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 18, 14, 0.88)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(0.75rem, 3vw, 1.5rem)',
              overflowY: 'auto',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={isClosing ? 'animate-modal-zoom-out' : 'animate-modal-zoom-in'}
              style={{
                width: '100%',
                maxWidth: '720px',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'linear-gradient(165deg, #0D2319 0%, #07140E 100%)',
                border: '1px solid rgba(200, 168, 91, 0.35)',
                borderRadius: '24px',
                boxShadow: '0 25px 70px -12px rgba(0, 0, 0, 0.9), 0 0 45px rgba(16, 185, 129, 0.18)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                margin: 'auto',
              }}
            >
              {/* Inner animated content container for smooth division switching */}
              <div key={activeModalItem.num} className="animate-modal-content-switch">
                {/* Modal Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    padding: 'clamp(1.25rem, 3vw, 1.75rem) clamp(1.25rem, 3vw, 2rem)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: '18px',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(200, 168, 91, 0.15) 100%)',
                        border: '1px solid rgba(200, 168, 91, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#DFBF73',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                        flexShrink: 0,
                      }}
                    >
                      {ActiveModalIcon && <ActiveModalIcon size={28} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            color: '#E6C587',
                            background: 'rgba(200, 168, 91, 0.15)',
                            border: '1px solid rgba(200, 168, 91, 0.35)',
                            padding: '0.15rem 0.6rem',
                            borderRadius: '9999px',
                          }}
                        >
                          Pilar {activeModalItem.num}
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'rgba(247, 245, 240, 0.65)',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {activeModalItem.tag}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'clamp(1.3rem, 3.5vw, 1.65rem)',
                          fontWeight: 800,
                          color: 'var(--warm-alabaster)',
                          margin: 0,
                          lineHeight: 1.2,
                        }}
                      >
                        {activeModalItem.detailTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={closeModal}
                    aria-label="Tutup detail divisi"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#BACEC3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                      e.currentTarget.style.color = '#EF4444';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.color = '#BACEC3';
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
                  {/* Detailed Description */}
                  <p
                    style={{
                      color: 'rgba(247, 245, 240, 0.85)',
                      fontSize: 'clamp(0.9rem, 2vw, 0.98rem)',
                      lineHeight: 1.75,
                      marginBottom: '1.75rem',
                    }}
                  >
                    {activeModalItem.detailDesc}
                  </p>

                  {/* Agenda & Fokus Utama Box */}
                  <div
                    style={{
                      background: 'rgba(10, 30, 22, 0.75)',
                      border: '1px solid rgba(200, 168, 91, 0.2)',
                      borderRadius: '18px',
                      padding: 'clamp(1rem, 2.5vw, 1.5rem)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#DFBF73',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: '1rem',
                      }}
                    >
                      <Sparkles size={14} style={{ color: '#DFBF73' }} /> AGENDA & FOKUS PROGRAM KERJA:
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {activeModalItem.agendas.map((agenda, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            padding: '0.5rem 0.65rem',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.04)',
                          }}
                        >
                          <CheckCircle2
                            size={18}
                            style={{ color: 'var(--emerald)', flexShrink: 0, marginTop: '2px' }}
                          />
                          <span
                            style={{
                              fontSize: '0.88rem',
                              color: '#F7F5F0',
                              lineHeight: 1.55,
                              fontWeight: 500,
                            }}
                          >
                            {agenda}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '1.25rem clamp(1.25rem, 3vw, 2rem)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(5, 18, 14, 0.5)',
                  flexWrap: 'wrap',
                }}
              >
                {/* Division Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() =>
                      setModalDivisionIdx((prev) =>
                        prev > 0 ? prev - 1 : DIVISION_SHOWCASE.length - 1
                      )
                    }
                    className="btn btn-outline"
                    style={{
                      padding: '0.5rem 0.85rem',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: 'var(--warm-alabaster)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                    }}
                  >
                    <ChevronLeft size={16} /> Sebelumnya
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setModalDivisionIdx((prev) =>
                        prev < DIVISION_SHOWCASE.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="btn btn-outline"
                    style={{
                      padding: '0.5rem 0.85rem',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: 'var(--warm-alabaster)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                    }}
                  >
                    Berikutnya <ChevronRight size={16} />
                  </button>
                </div>

                {/* Link ke Halaman Anggota */}
                <Link
                  to="/schools#pengurus"
                  onClick={closeModal}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: 'white',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.35)';
                  }}
                >
                  Lihat Pengurus & Anggota Divisi Ini <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════
          CTA Section: Struktur Pengurus & Sekolah Anggota
          ═══════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--warm-alabaster)', borderTop: '1px solid rgba(13,43,34,0.06)' }}>
        <div className="container" style={{ maxWidth: 1050, margin: '0 auto' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #07140E 0%, #0D2319 50%, #132D21 100%)',
              borderRadius: '24px',
              padding: 'clamp(2.5rem, 5vw, 3.75rem) clamp(1.5rem, 4vw, 3rem)',
              color: 'var(--warm-alabaster)',
              boxShadow: '0 20px 48px -12px rgba(7, 20, 14, 0.45), 0 0 0 1px rgba(200, 168, 91, 0.22)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            {/* Ambient Background Accents */}
            <div
              style={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: 380,
                height: 380,
                background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 68%)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-25%',
                left: '-10%',
                width: 340,
                height: 340,
                background: 'radial-gradient(circle, rgba(200,168,91,0.14) 0%, transparent 65%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <span
                className="badge badge-gold"
                style={{
                  marginBottom: '1.25rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'rgba(200, 168, 91, 0.15)',
                  color: '#DFBF73',
                  border: '1px solid rgba(200, 168, 91, 0.35)',
                  borderRadius: '9999px',
                  padding: '0.35rem 1rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                }}
              >
                <Users size={14} /> Fungsionaris & Basis Rohis
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.75rem, 4vw, 2.35rem)',
                  fontWeight: 800,
                  color: '#F7F5F0',
                  marginBottom: '1rem',
                  lineHeight: 1.25,
                  letterSpacing: '-0.015em',
                }}
              >
                Kenali Fungsionaris & Pangkalan Sekolah Anggota
              </h2>
              <p
                style={{
                  color: 'rgba(245, 242, 237, 0.82)',
                  maxWidth: 680,
                  margin: '0 auto 2.25rem',
                  fontSize: 'clamp(0.94rem, 1.8vw, 1.05rem)',
                  lineHeight: 1.75,
                }}
              >
                Struktur fungsionaris Badan Pengurus Harian (BPH), Divisi SDM, Dakwah, HUMAS, Jurnalistik, DANUS, serta direktori pangkalan ROHIS SMA, SMK, dan MA se-Kabupaten Banyumas dapat Anda telusuri secara lengkap pada halaman <strong style={{ color: '#DFBF73', fontWeight: 700 }}>Anggota</strong>.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to="/schools#pengurus"
                  className="btn btn-primary btn-lg"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '9999px',
                    padding: '0.85rem 2rem',
                    fontSize: '0.98rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.38)',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <Users size={18} /> Struktur Pengurus ROKABA
                </Link>
                <Link
                  to="/schools#sekolah"
                  className="btn btn-glass btn-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#F5F2ED',
                    border: '1.5px solid rgba(255, 255, 255, 0.35)',
                    borderRadius: '9999px',
                    padding: '0.85rem 2rem',
                    fontSize: '0.98rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    textDecoration: 'none',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <School size={18} /> Direktori Sekolah Anggota
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
