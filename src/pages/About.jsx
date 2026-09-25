import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Target, Heart, Award, BookOpen, Star,
  GraduationCap, ExternalLink, ShieldCheck,
  Flame, Megaphone, Newspaper, Coins, Sparkles,
  ArrowRight, CheckCircle2, School
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
  // Showcase Active Division Index (0: SDM, 1: Dakwah, 2: Jurnalistik, 3: HUMAS, 4: DANUS)
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState(1); // Default to Divisi Dakwah

  const currentShowcase = DIVISION_SHOWCASE[activeShowcaseIdx] || DIVISION_SHOWCASE[0];
  const ShowcaseIcon = currentShowcase.icon;

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

          {/* Interactive 2-Column Explorer */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '1.5rem',
              alignItems: 'start',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Left: 01 to 05 List Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
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
                      padding: 'clamp(0.85rem, 3vw, 1.15rem)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'clamp(0.6rem, 2vw, 1rem)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: isActive ? '0 0 24px rgba(181, 141, 79, 0.16)' : 'none',
                      width: '100%',
                      maxWidth: '100%',
                      boxSizing: 'border-box',
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
                        minWidth: '2.2rem',
                        flexShrink: 0,
                        lineHeight: 1,
                      }}
                    >
                      {item.num}
                    </div>

                    {/* Middle Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
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
                            wordBreak: 'break-word',
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
                            flexShrink: 0,
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
                          wordBreak: 'break-word',
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
                padding: 'clamp(1.5rem, 4vw, 2.25rem) clamp(1.15rem, 3vw, 1.75rem)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.3)',
                position: 'sticky',
                top: '5.5rem',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
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

              {/* Action Button: Link ke Halaman Anggota */}
              <Link
                to="/schools#pengurus"
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
                  textDecoration: 'none',
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
                Lihat Pengurus & Anggota Divisi Ini <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA Section: Struktur Pengurus & Sekolah Anggota
          ═══════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--warm-alabaster)', borderTop: '1px solid rgba(13,43,34,0.06)' }}>
        <div className="container" style={{ maxWidth: 1050, margin: '0 auto' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, var(--deep-pine) 0%, #153a2f 100%)',
              borderRadius: '24px',
              padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2.5rem)',
              color: 'var(--warm-alabaster)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid rgba(181,141,79,0.3)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            {/* Background Accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 320,
                height: 320,
                background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <span className="badge badge-gold" style={{ marginBottom: '1.25rem' }}>
              <Users size={14} /> Fungsionaris & Basis Rohis
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 4vw, 2.35rem)',
                fontWeight: 800,
                color: 'var(--warm-alabaster)',
                marginBottom: '1rem',
                lineHeight: 1.25,
              }}
            >
              Kenali Fungsionaris & Pangkalan Sekolah Anggota
            </h2>
            <p
              style={{
                color: 'rgba(245,242,237,0.78)',
                maxWidth: 660,
                margin: '0 auto 2.25rem',
                fontSize: '0.98rem',
                lineHeight: 1.7,
              }}
            >
              Struktur fungsionaris Badan Pengurus Harian (BPH), Divisi SDM, Dakwah, HUMAS, Jurnalistik, DANUS, serta direktori pangkalan ROHIS SMA, SMK, dan MA se-Kabupaten Banyumas dapat Anda telusuri secara lengkap pada halaman <strong>Anggota</strong>.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/schools#pengurus"
                className="btn btn-emerald"
                style={{
                  fontSize: '0.95rem',
                  padding: '0.85rem 1.85rem',
                  boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
                }}
              >
                <Users size={18} /> Struktur Pengurus ROKABA
              </Link>
              <Link
                to="/schools#sekolah"
                className="btn btn-outline"
                style={{
                  fontSize: '0.95rem',
                  padding: '0.85rem 1.85rem',
                  borderColor: 'rgba(245,242,237,0.3)',
                  color: 'var(--warm-alabaster)',
                }}
              >
                <School size={18} /> Direktori Sekolah Anggota
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
