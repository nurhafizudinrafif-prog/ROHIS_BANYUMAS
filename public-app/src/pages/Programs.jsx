import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Newspaper, Megaphone, Coins, Sparkles,
  ArrowRight, CheckCircle2, Flame, Compass, X, ChevronLeft, ChevronRight
} from 'lucide-react';

const DIVISION_SHOWCASE = [
  {
    num: '01',
    key: 'SDM',
    title: 'DIVISI SDM (SUMBER DAYA MANUSIA)',
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
      'Liputan fotografi, videografi, dan dokumentasi agenda',
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

export default function Programs() {
  // Card Morphing Expansion State (Option 2 - iOS App Store Style)
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [morphPhase, setMorphPhase] = useState('idle'); // 'idle' | 'expanding' | 'expanded' | 'collapsing'
  const [originRect, setOriginRect] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const cardRefs = useRef([]);
  const scrollRef = useRef(null);

  const activeExpandedItem =
    expandedIdx !== null ? DIVISION_SHOWCASE[expandedIdx] || null : null;
  const ActiveExpandedIcon = activeExpandedItem ? activeExpandedItem.icon : null;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openCardExpansion = (idx) => {
    const cardEl = cardRefs.current[idx];
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const initialRect = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    setOriginRect(initialRect);
    setExpandedIdx(idx);
    setMorphPhase('expanding');

    // Next frames: trigger 'expanded' so CSS transitions smoothly to full view
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setMorphPhase('expanded');
      });
    });
  };

  const closeCardExpansion = () => {
    if (morphPhase !== 'expanded') return;

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    setMorphPhase('collapsing');

    setTimeout(() => {
      setMorphPhase('idle');
      setExpandedIdx(null);
      setOriginRect(null);
    }, 500);
  };

  const switchDivision = (nextIdx) => {
    setExpandedIdx(nextIdx);
    if (cardRefs.current[nextIdx]) {
      const rect = cardRefs.current[nextIdx].getBoundingClientRect();
      setOriginRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  // Handle ESC key, arrow key navigation, and lock body scroll when card is expanded
  useEffect(() => {
    if (morphPhase === 'idle') return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeCardExpansion();
      } else if (e.key === 'ArrowLeft') {
        switchDivision(expandedIdx > 0 ? expandedIdx - 1 : DIVISION_SHOWCASE.length - 1);
      } else if (e.key === 'ArrowRight') {
        switchDivision(expandedIdx < DIVISION_SHOWCASE.length - 1 ? expandedIdx + 1 : 0);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [morphPhase, expandedIdx]);

  // Target geometry for GPU-accelerated card morphing
  const targetTop = isMobile ? 0 : Math.max(20, typeof window !== 'undefined' ? window.innerHeight * 0.04 : 30);
  const targetWidth = isMobile
    ? (typeof window !== 'undefined' ? window.innerWidth : 360)
    : Math.min(840, typeof window !== 'undefined' ? window.innerWidth - 32 : 840);
  const targetLeft = isMobile
    ? 0
    : Math.max(16, typeof window !== 'undefined' ? (window.innerWidth - targetWidth) / 2 : 16);
  const targetHeight = isMobile
    ? (typeof window !== 'undefined' ? window.innerHeight : 640)
    : Math.min(typeof window !== 'undefined' ? window.innerHeight * 0.92 : 880, 880);

  const scaleX = originRect && targetWidth ? originRect.width / targetWidth : 1;
  const scaleY = originRect && targetHeight ? originRect.height / targetHeight : 1;
  const deltaX = originRect ? originRect.left - targetLeft : 0;
  const deltaY = originRect ? originRect.top - targetTop : 0;

  return (
    <div style={{ overflowX: 'clip', width: '100%' }}>
      {/* ═══ HERO ═══ */}
      <section
        style={{
          background: 'var(--deep-pine)',
          paddingTop: '8rem',
          paddingBottom: '3.5rem',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
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
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
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
              const isThisCardExpanded = expandedIdx === idx && morphPhase !== 'idle';

              return (
                <div
                  key={item.num}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  onClick={() => openCardExpansion(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openCardExpansion(idx);
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
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, opacity 0.3s ease',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    opacity: isThisCardExpanded ? 0 : 1,
                    pointerEvents: isThisCardExpanded ? 'none' : 'auto',
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

        {/* ═══ iOS APP STORE STYLE CARD MORPHING EXPANSION (OPTION 2) ═══ */}
        {expandedIdx !== null && originRect && activeExpandedItem && (
          <div className="morph-card-overlay">
            {/* Backdrop Blur */}
            <div
              className={`morph-backdrop ${morphPhase === 'expanded' ? 'is-active' : ''} ${morphPhase === 'collapsing' ? 'is-collapsing-backdrop' : ''}`}
              onClick={closeCardExpansion}
            />

            {/* The Morphing Card Sheet */}
            <div
              className={`morph-card-sheet ${morphPhase === 'expanded' ? 'is-expanded' : ''} ${
                morphPhase === 'collapsing' ? 'is-collapsing' : ''
              }`}
              style={{
                top:
                  morphPhase === 'expanded'
                    ? `${targetTop}px`
                    : `${originRect ? originRect.top : targetTop}px`,
                left:
                  morphPhase === 'expanded'
                    ? `${targetLeft}px`
                    : `${originRect ? originRect.left : targetLeft}px`,
                width:
                  morphPhase === 'expanded'
                    ? `${targetWidth}px`
                    : `${originRect ? originRect.width : targetWidth}px`,
                height:
                  morphPhase === 'expanded'
                    ? `${targetHeight}px`
                    : `${originRect ? originRect.height : targetHeight}px`,
                borderRadius:
                  morphPhase === 'expanded'
                    ? isMobile
                      ? '0px'
                      : '24px'
                    : '20px',
                transition:
                  morphPhase === 'expanding'
                    ? 'none'
                    : undefined,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Scrollable Container */}
              <div ref={scrollRef} className="morph-card-scrollable">
                {/* Symmetrical Sticky Header (Pins smoothly with 0 layout shift) */}
                <div
                  className="morph-header-bar"
                  style={{
                    padding: 'clamp(1.2rem, 3.5vw, 1.8rem)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'linear-gradient(180deg, #0D2319 0%, #0D2319 88%, rgba(13, 35, 25, 0.95) 100%)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 20,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.85rem',
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
                        {activeExpandedItem.num}
                      </span>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          color: '#E6C587',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          background: 'rgba(200, 168, 91, 0.15)',
                          padding: '0.22rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(200, 168, 91, 0.28)',
                        }}
                      >
                        {activeExpandedItem.tag}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {/* Division Icon Badge matching grid card */}
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '14px',
                          background: 'rgba(16, 185, 129, 0.14)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--emerald-light)',
                          flexShrink: 0,
                        }}
                      >
                        {ActiveExpandedIcon && <ActiveExpandedIcon size={22} />}
                      </div>

                      {/* Centered Close Button */}
                      <button
                        type="button"
                        className="morph-close-btn"
                        onClick={closeCardExpansion}
                        aria-label="Tutup lembar divisi"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                      fontWeight: 800,
                      color: 'var(--warm-alabaster)',
                      margin: 0,
                      lineHeight: 1.25,
                    }}
                  >
                    {activeExpandedItem.detailTitle}
                  </h2>
                </div>

                {/* Dual-Layer Morphing Body */}
                <div className="morph-body-wrapper">
                  {/* Layer 1: Detail Content (Full Expanded View) */}
                  <div
                    key={`detail-${activeExpandedItem.num}`}
                    className="morph-detail-content"
                    style={{ padding: 'clamp(1.2rem, 3.5vw, 2rem)' }}
                  >
                    <p
                      style={{
                        color: 'rgba(247, 245, 240, 0.88)',
                        fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)',
                        lineHeight: 1.8,
                        marginBottom: '2rem',
                      }}
                    >
                      {activeExpandedItem.detailDesc}
                    </p>

                    {/* Agendas & Programs */}
                    <div
                      style={{
                        background: 'rgba(10, 30, 22, 0.75)',
                        border: '1px solid rgba(200, 168, 91, 0.22)',
                        borderRadius: '20px',
                        padding: 'clamp(1.2rem, 3vw, 1.75rem)',
                        marginBottom: '2rem',
                        boxShadow: 'inset 0 2px 12px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          color: '#DFBF73',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          marginBottom: '1.25rem',
                        }}
                      >
                        <Sparkles size={16} style={{ color: '#DFBF73' }} /> AGENDA & FOKUS PROGRAM KERJA:
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {activeExpandedItem.agendas.map((agenda, i) => (
                          <div
                            key={i}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.85rem',
                              padding: '0.65rem 0.85rem',
                              borderRadius: '12px',
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                            }}
                          >
                            <CheckCircle2
                              size={19}
                              style={{ color: 'var(--emerald)', flexShrink: 0, marginTop: '2px' }}
                            />
                            <span
                              style={{
                                fontSize: '0.92rem',
                                color: '#F7F5F0',
                                lineHeight: 1.6,
                                fontWeight: 500,
                              }}
                            >
                              {agenda}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar & Division Switcher */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() =>
                            switchDivision(
                              expandedIdx > 0 ? expandedIdx - 1 : DIVISION_SHOWCASE.length - 1
                            )
                          }
                          className="btn btn-outline"
                          style={{
                            padding: '0.55rem 0.95rem',
                            fontSize: '0.82rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            borderRadius: '9999px',
                            border: '1px solid rgba(255, 255, 255, 0.16)',
                            color: 'var(--warm-alabaster)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            cursor: 'pointer',
                          }}
                        >
                          <ChevronLeft size={16} /> Sebelumnya
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            switchDivision(
                              expandedIdx < DIVISION_SHOWCASE.length - 1 ? expandedIdx + 1 : 0
                            )
                          }
                          className="btn btn-outline"
                          style={{
                            padding: '0.55rem 0.95rem',
                            fontSize: '0.82rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            borderRadius: '9999px',
                            border: '1px solid rgba(255, 255, 255, 0.16)',
                            color: 'var(--warm-alabaster)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            cursor: 'pointer',
                          }}
                        >
                          Berikutnya <ChevronRight size={16} />
                        </button>
                      </div>

                      <Link
                        to="/schools#pengurus"
                        onClick={closeCardExpansion}
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

                  {/* Layer 2: Summary Content (Dissolves IN during collapse so card lands with complete text) */}
                  <div
                    className="morph-summary-content"
                    style={{
                      padding: 'clamp(1.2rem, 3vw, 1.6rem)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'rgba(247, 245, 240, 0.68)',
                        lineHeight: 1.6,
                        margin: '0 0 1rem 0',
                      }}
                    >
                      {activeExpandedItem.desc}
                    </p>

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
                      {activeExpandedItem.agendas.slice(0, 2).map((agenda, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                          }}
                        >
                          <CheckCircle2
                            size={14}
                            style={{ color: 'var(--emerald)', flexShrink: 0, marginTop: '2px' }}
                          />
                          <span
                            style={{
                              fontSize: '0.78rem',
                              color: 'rgba(247, 245, 240, 0.82)',
                              lineHeight: 1.45,
                            }}
                          >
                            {agenda}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '0.85rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#DFBF73',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                        }}
                      >
                        Pelajari Rencana & Program Divisi
                        <ArrowRight size={14} />
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: 'rgba(247, 245, 240, 0.45)',
                        }}
                      >
                        5 Agenda
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
