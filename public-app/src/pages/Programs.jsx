import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Newspaper, Megaphone, Coins, Sparkles,
  ArrowRight, CheckCircle2, Flame, Compass
} from 'lucide-react';

const DIVISION_SHOWCASE = [
  {
    num: '01',
    key: 'SDM',
    title: 'Divisi Sumber Daya Manusia (SDM)',
    tag: 'DIVISI SDM',
    desc: 'Fokus pada pembinaan karakter, peningkatan kapasitas kader, regenerasi kepengurusan, serta penguatan soliditas anggota ROHIS se-Kabupaten Banyumas.',
    icon: Users,
    detailTitle: 'Divisi SDM (Sumber Daya Manusia)',
    detailDesc: 'Pusat kaderisasi dan pengembangan potensi pemuda Islam yang membina karakter kepemimpinan, integritas, dan keilmuan pengurus rohis sekolah.',
    agendas: [
      'Latihan Dasar Kepemimpinan (LDK) ROHIS se-Banyumas',
      'Mentoring & upgrading kepemimpinan kader berkala',
      'Regenerasi & estafet kepengurusan terstruktur',
      'Pembinaan karakter Islami dan spiritual leadership',
      'Forum silaturahmi kader rohis lintas SMA/SMK/MA',
    ],
  },
  {
    num: '02',
    key: 'Dakwah',
    title: 'Divisi Syiar & Dakwah Islam',
    tag: 'DIVISI DAKWAH',
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
    title: 'Divisi Media & Jurnalistik Kreatif',
    tag: 'DIVISI JURNALISTIK',
    desc: 'Mengelola publikasi informasi, dokumentasi kegiatan, buletin dakwah, konten multimedia kreatif, dan syiar digital di era modern.',
    icon: Newspaper,
    detailTitle: 'Divisi Jurnalistik',
    detailDesc: 'Garda terdepan syiar kreatif visual dan literasi digital yang mengemas dakwah Islam dengan bahasa generasi muda yang inspiratif, edukatif, dan segar.',
    agendas: [
      'Penerbitan Buletin Dakwah Digital & Majalah Dinding',
      'Produksi video dakwah kreatif Instagram, TikTok & YouTube',
      'Liputan fotografi, videografi, dan dokumentasi agenda',
      'Pengelolaan portal website resmi & artikel islami pelajar',
      'Workshop jurnalistik, desain grafis & multimedia dakwah',
    ],
  },
  {
    num: '04',
    key: 'HUMAS',
    title: 'Divisi Hubungan Masyarakat (HUMAS)',
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
    title: 'Divisi Dana Usaha (DANUS)',
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

export default function Programs() {
  const [activeIdx, setActiveIdx] = useState(1); // Default to Divisi Dakwah as in user's screenshot
  const current = DIVISION_SHOWCASE[activeIdx] || DIVISION_SHOWCASE[0];
  const CurrentIcon = current.icon;

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section
        style={{
          background: 'var(--deep-pine)',
          paddingTop: '8rem',
          paddingBottom: '3.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 40% 50%, rgba(16,185,129,0.06) 0%, transparent 50%)',
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
          }}
        >
          <span className="badge badge-emerald animate-fade-in-up" style={{ marginBottom: '1rem' }}>
            <Compass size={14} /> 5 Pilar Gerakan
          </span>
          <h1
            className="animate-fade-in-up delay-100"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4.5vw, 2.8rem)',
              fontWeight: 800,
              color: 'var(--warm-alabaster)',
            }}
          >
            Program Kerja Divisi
          </h1>
          <p
            className="animate-fade-in-up delay-200"
            style={{
              color: 'rgba(245,242,237,0.55)',
              maxWidth: 550,
              marginTop: '0.75rem',
              lineHeight: 1.7,
            }}
          >
            5 divisi utama penggerak dakwah, kaderisasi kepemimpinan, dan syiar pelajar Islam se-Kabupaten Banyumas.
          </p>
        </div>
      </section>

      {/* ═══ 5 DIVISI PROGRAM KERJA INTERAKTIF (Exact Match to Screenshot 1) ═══ */}
      <section
        className="section"
        style={{
          background: 'var(--deep-pine)',
          backgroundImage: `
            radial-gradient(ellipse at 30% 70%, rgba(16,185,129,0.06) 0%, transparent 65%),
            url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2310B981' stroke-width='0.75' stroke-opacity='0.08'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z'/%3E%3Ccircle cx='40' cy='40' r='18'/%3E%3Ccircle cx='40' cy='40' r='28'/%3E%3Cpath d='M0 0 L80 80 M80 0 L0 80'/%3E%3C/g%3E%3C/svg%3E")
          `,
          padding: '4rem 0 6rem',
        }}
      >
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Interactive Responsive Explorer */}
          <div className="showcase-grid-layout">
            {/* Mobile: Sleek Horizontal Division Selector Tabs */}
            <div className="showcase-mobile-tabs">
              {DIVISION_SHOWCASE.map((item, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={item.num}
                    onClick={() => setActiveIdx(idx)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.55rem 1rem',
                      borderRadius: '9999px',
                      border: isActive ? '1px solid #E6C587' : '1px solid rgba(255, 255, 255, 0.12)',
                      background: isActive ? 'rgba(20, 56, 44, 0.95)' : 'rgba(10, 32, 24, 0.7)',
                      color: isActive ? '#E6C587' : 'rgba(245, 242, 237, 0.75)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 0 16px rgba(181, 141, 79, 0.25)' : 'none',
                    }}
                  >
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: isActive ? 'var(--emerald-light)' : 'rgba(181, 141, 79, 0.8)',
                    }}>{item.num}</span>
                    <span>{item.key}</span>
                  </button>
                );
              })}
            </div>

            {/* Desktop: 01 to 05 List Cards */}
            <div className="showcase-desktop-list">
              {DIVISION_SHOWCASE.map((item, idx) => {
                const isActive = activeIdx === idx;

                return (
                  <div
                    key={item.num}
                    onClick={() => setActiveIdx(idx)}
                    style={{
                      background: isActive ? 'rgba(20, 56, 44, 0.95)' : 'rgba(10, 32, 24, 0.65)',
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
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
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
                padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 3vw, 2rem)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.3)',
                boxSizing: 'border-box',
                minWidth: 0,
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
                  <CurrentIcon size={26} />
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
                    {current.tag}
                  </div>
                  <h3
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: 'var(--warm-alabaster)',
                      lineHeight: 1.15,
                    }}
                  >
                    {current.detailTitle}
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
                {current.detailDesc}
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
                {current.agendas.map((agenda, i) => (
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
              <Link
                to={`/about?div=${current.key}#pengurus`}
                className="btn btn-emerald"
                style={{
                  marginTop: '2rem',
                  width: '100%',
                }}
              >
                Lihat Struktur & Pengurus Divisi Ini <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
