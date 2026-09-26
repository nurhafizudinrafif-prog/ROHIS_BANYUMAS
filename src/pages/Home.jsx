import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import logoImg from '../assets/logo.png';
import { parseImageUrl, extractDriveId } from '@shared/services/mediaHelper.js';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Quote,
  Compass,
  History,
  Calendar,
  Heart,
  MapPin,
  Users,
  Camera,
  Share2,
  Briefcase,
  FileText,
  MessageCircle,
  Library,
  School,
} from 'lucide-react';

function StatCard({ value, suffix = '+', label, delay = 0 }) {
  return (
    <div
      className={`reveal-scale delay-${Math.min(delay, 500)}`}
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 1.25rem',
        textAlign: 'center',
        transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.background = 'rgba(16,185,129,0.08)';
        e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '2.3rem',
          color: 'var(--warm-alabaster)',
          lineHeight: 1,
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #F5F2ED 30%, var(--antique-brass) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {value}
        {suffix}
      </div>
      <div
        style={{
          color: 'rgba(245,242,237,0.7)',
          fontSize: '0.82rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function ArticleCard({ article, index }) {
  const categoryColors = {
    Edukasi: 'var(--emerald)',
    Dakwah: 'var(--antique-brass)',
    Ibadah: '#7C3AED',
    Motivasi: '#F59E0B',
  };

  const imgUrl = parseImageUrl(article.image || article.coverImage);

  return (
    <Link
      to={`/articles/${article.slug || article.id}`}
      className={`card-editorial reveal-scale delay-${Math.min((index + 1) * 100, 500)}`}
      style={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          height: 190,
          background: `linear-gradient(135deg, var(--deep-pine) 0%, var(--deep-pine-light) 50%, ${
            categoryColors[article.category] || 'var(--emerald)'
          }22 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={article.title}
            referrerPolicy="no-referrer"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              const driveId = extractDriveId(article.image || article.coverImage);
              if (driveId && !e.currentTarget.src.includes('lh3.googleusercontent.com')) {
                e.currentTarget.src = `https://lh3.googleusercontent.com/d/${driveId}`;
              } else {
                e.currentTarget.style.display = 'none';
              }
            }}
          />
        ) : (
          <FileText size={40} style={{ color: 'rgba(245,242,237,0.2)' }} />
        )}
      </div>
      <div
        className="card-body"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem',
        }}
      >
        <h3
          style={{
            color: 'var(--deep-pine)',
            fontSize: '1.05rem',
            lineHeight: 1.4,
            marginBottom: '0.5rem',
          }}
        >
          {article.title}
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.78rem',
            color: 'rgba(13,43,34,0.5)',
          }}
        >
          <span>{article.author || 'Tim ROKABA'}</span>
          <span>•</span>
          <span>
            {new Date(article.publishedAt || article.date || Date.now()).toLocaleDateString(
              'id-ID',
              { day: 'numeric', month: 'short', year: 'numeric' }
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

function EventCard({ event, index }) {
  const eventDate = new Date(event.date);

  return (
    <div
      className={`reveal-on-scroll delay-${Math.min((index + 1) * 100, 500)}`}
      style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'flex-start',
        border: '1px solid rgba(13,43,34,0.06)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, var(--deep-pine), var(--deep-pine-light))',
          color: 'var(--warm-alabaster)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          flexShrink: 0,
          minWidth: 64,
        }}
      >
        <div style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: 1 }}>
          {eventDate.getDate() || '15'}
        </div>
        <div
          style={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginTop: '0.2rem',
            color: 'var(--antique-brass)',
          }}
        >
          {eventDate.toLocaleDateString('id-ID', { month: 'short' }) || 'BLN'}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <span
          className="badge badge-gold"
          style={{ fontSize: '0.7rem', padding: '0.15rem 0.6rem', marginBottom: '0.4rem' }}
        >
          {event.category || 'Agenda'}
        </span>
        <h4 style={{ color: 'var(--deep-pine)', margin: '0.35rem 0 0.4rem', fontSize: '1.05rem', lineHeight: 1.3 }}>
          {event.title}
        </h4>
        <p
          style={{
            fontSize: '0.82rem',
            color: 'rgba(13,43,34,0.6)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <MapPin size={14} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
          {event.location} {event.time ? `• 🕐 ${event.time}` : ''}
        </p>
      </div>
    </div>
  );
}

const divisionCards = [
  {
    id: 1,
    division: 'SDM',
    title: 'Divisi SDM & Kaderisasi',
    icon: Users,
    color: '#3B82F6',
    desc: 'Fokus pada pembinaan karakter, regenerasi pengurus, dan soliditas kader ROHIS se-Banyumas.',
    programs: [
      'Latihan Dasar Kepemimpinan (LDK) ROHIS',
      'Upgrading Skill Pengurus',
      'Mentoring Kepemimpinan Pelajar',
    ],
  },
  {
    id: 2,
    division: 'Dakwah',
    title: 'Divisi Syiar & Dakwah',
    icon: BookOpen,
    color: '#059669',
    desc: 'Jantung gerakan dakwah menyelenggarakan kajian keilmuan dan syiar Islam rahmatan lil alamin.',
    programs: [
      'Kajian Ahad Pagi Se-Banyumas',
      'Safari Dakwah Sekolah',
      'Tahsin Tilawah Al-Quran',
    ],
  },
  {
    id: 3,
    division: 'Jurnalistik',
    title: 'Divisi Media & Jurnalistik',
    icon: Camera,
    color: '#00F0CF',
    desc: 'Memproduksi konten dakwah digital, artikel inspiratif, video kreatif, dan pengelolaan website resmi.',
    programs: [
      'Produksi Konten Media Sosial',
      'Penerbitan Buletin Digital',
      'Workshop Desain & Videografi',
    ],
  },
  {
    id: 4,
    division: 'HUMAS',
    title: 'Divisi Hubungan Masyarakat',
    icon: Share2,
    color: '#06B6D4',
    desc: 'Menjadi jembatan komunikasi dan sinergi antara ROHIS sekolah, instansi, dan masyarakat luas.',
    programs: [
      'Silaturahmi Antar Sekolah',
      'Kemitraan Kemenag & Lembaga Islam',
      'Aksi Peduli Sosial & Bencana',
    ],
  },
  {
    id: 5,
    division: 'DANUS',
    title: 'Divisi Dana Usaha (Kewirausahaan)',
    icon: Briefcase,
    color: '#D4A843',
    desc: 'Membangun kemandirian finansial organisasi melalui unit usaha halal, merchandise, dan sponsorship.',
    programs: [
      'Merchandise Resmi ROKABA',
      'Bazaar Dakwah Kreatif',
      'Edukasi Entrepreneur Syariah',
    ],
  },
];

export default function Home() {
  const { home, articles, events, loading } = useData();

  // Attach scroll reveal observer whenever dependencies update
  useScrollReveal([home, articles, events, loading]);

  if (loading && !home) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--deep-pine)',
        }}
      >
        <div className="animate-float" style={{ textAlign: 'center' }}>
          <img
            src={logoImg}
            alt="ROKABA"
            style={{
              width: 64,
              height: 64,
              objectFit: 'contain',
              marginBottom: '1rem',
              filter: 'drop-shadow(0 4px 16px rgba(16,185,129,0.4))',
            }}
          />
          <p style={{ color: 'rgba(245,242,237,0.7)', fontFamily: 'var(--font-heading)' }}>
            Memuat data ekosistem dakwah...
          </p>
        </div>
      </div>
    );
  }

  const hero = home?.hero || {
    tag: 'PELAJAR • PEMUDA • KABUPATEN BANYUMAS',
    titleLine1: home?.hero_title || 'ROHIS',
    titleLine2: home?.hero_subtitle || 'BANYUMAS',
    leadPhrase: 'Ruang belajar, bertumbuh, dan berkontribusi bersama.',
    narrative:
      home?.welcome_msg ||
      'Wadah silaturahmi, kaderisasi kepemimpinan, dan sinergi dakwah pelajar Islam lintas SMA, SMK, dan MA se-Kabupaten Banyumas. Berakar pada akhlak, bergerak dalam karya nyata untuk generasi muda.',
    btnPrimaryText: 'Kenali ROHIS Lebih Dekat',
    btnPrimaryLink: '/about',
    btnSecondaryText: 'Anggota ROHIS',
    btnSecondaryLink: '/schools',
    photoUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
    photoStamp: 'ARCHIVE REF #01',
    photoLoc: 'MASJID AGUNG BAITUSSALAM',
    photoTitle: 'Sinergi Kader Dakwah Pelajar se-Banyumas',
    photoSub: 'Pertemuan akbar perwakilan pengurus rohis sekolah dalam merajut ukhuwah dan agenda keumatan.',
    metaStatus: 'RESMI • DAKWAH SEKOLAH',
    metaSince: '2017 • PURWOKERTO',
    metaNetwork: '17+ SMA / SMK / MA',
  };

  const about = home?.about || {
    tag: 'TENTANG KAMI',
    title: 'Bukan sekadar sebuah organisasi.',
    lead: 'Didirikan pada tahun 2017 di Purwokerto, ROHIS Kabupaten Banyumas tumbuh dari tekad bersama para pelajar SMA, SMK, dan MA untuk merajut ukhuwah dan memperkuat dakwah sekolah.',
    paragraph1:
      "Kami hadir bukan sekadar menyusun struktur jabatan formal, melainkan membangun ruang perjumpaan yang hangat—tempat setiap pelajar Muslim dapat belajar memahami nilai-nilai Islam yang rahmatan lil 'alamin, mengasah kepemimpinan, dan menyalurkan kepedulian nyata bagi masyarakat.",
    paragraph2:
      'Dari kajian akbar di masjid-masjid agung hingga pelatihan literasi digital dan aksi kepedulian sosial di pelosok Banyumas, seluruh langkah kami digerakkan secara gotong-royong oleh kader pelajar bersama para pembina.',
    point1Title: 'Sinergi Lintas Sekolah',
    point1Desc: 'Mengikis sekat sekolah, menghubungkan puluhan rohis di Kabupaten Banyumas.',
    point2Title: 'Kaderisasi Berjenjang',
    point2Desc: 'Mencetak generasi muda yang kritis, berakhlak mulia, dan siap memimpin.',
    photoUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    photoTag: 'DOKUMENTASI KADERISASI • PURWOKERTO',
    photoEst: 'EST. 2017',
    quoteText:
      '"Di sini kami belajar bahwa dakwah terbaik tidak diukur dari megahnya panggung, melainkan dari keteladanan akhlak dan keikhlasan melayani sesama pelajar."',
    quoteAuthor: '— Catatan Lapangan Kader Pelajar, Banyumas',
  };

  const timeline =
    Array.isArray(home?.timeline) && home.timeline.length > 0
      ? home.timeline
      : [
          {
            id: 'tl-1',
            year: '2017',
            tag: 'AWAL JEJAK',
            title: 'Inisiasi & Silaturahmi Perdana',
            location: 'Purwokerto',
            desc: 'Pertemuan perdana perwakilan pengurus rohis sekolah se-Purwokerto yang melahirkan kesepakatan membentuk wadah silaturahmi terpadu.',
          },
          {
            id: 'tl-2',
            year: '2020',
            tag: 'KETAHANAN',
            title: 'Ruang Temu di Masa Pandemi',
            location: 'Banyumas',
            desc: 'Menghadapi masa karantina dengan menggelar kajian virtual berkala, mentoring daring, dan aksi kepedulian sosial bagi pelajar terdampak.',
          },
          {
            id: 'tl-3',
            year: '2022',
            tag: 'REKONSILIASI',
            title: 'Konsolidasi Akbar Pasca-Pandemi',
            location: 'Masjid Agung Baitussalam',
            desc: 'Kebangkitan tatap muka akbar, memperluas jejaring dakwah hingga ke SMA, SMK, dan MA di berbagai kecamatan Kabupaten Banyumas.',
          },
          {
            id: 'tl-4',
            year: '2024',
            tag: 'KURIKULUM',
            title: 'Standarisasi Modul Kaderisasi',
            location: 'Banyumas',
            desc: 'Penyusunan kurikulum Latihan Kepemimpinan ROHIS (LKRO) terstandar dan mentoring berkala demi mencetak kader yang berkarakter dan kritis.',
          },
          {
            id: 'tl-5',
            year: '2026',
            tag: 'TRANSFORMASI',
            title: 'Era Kolaborasi & Platform Terpadu',
            location: 'Kabupaten Banyumas',
            desc: 'Peluncuran platform digital terpadu, penguatan jurnalisme literasi, kemandirian kas dakwah, dan jejaring lebih dari 17 sekolah binaan.',
          },
        ];

  const statsList =
    Array.isArray(home?.stats) && home.stats.length > 0
      ? home.stats
      : [
          { value: 17, suffix: '+', label: 'Sekolah Binaan' },
          { value: 53, suffix: '+', label: 'Anggota Aktif' },
          { value: 7, suffix: '+', label: 'Agenda Akbar' },
          { value: 2017, suffix: '', label: 'Tahun Berdiri' },
        ];

  const closing = home?.closing || {
    tag: 'MARI BERGABUNG',
    headline: 'Mari Tumbuh Bersama.',
    lead: "Pintu selalu terbuka bagi pelajar yang ingin belajar, mengasah kepemimpinan, dan bersama-sama menghidupkan dakwah Islam rahmatan lil 'alamin di Kabupaten Banyumas.",
    btnPrimaryText: 'Daftar Menjadi Bagian ROKABA',
    btnPrimaryLink: '/contact',
    btnSecondaryText: 'Hubungi Pengurus',
    btnSecondaryLink: '/contact',
  };

  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date))
    .slice(0, 3);

  const upcomingEvents = events.filter((e) => e.status === 'upcoming' || !e.status).slice(0, 3);

  const heroPhoto = parseImageUrl(hero.photoUrl);
  const aboutPhoto = parseImageUrl(about.photoUrl);

  return (
    <div style={{ overflowX: 'clip', width: '100%' }}>
      {/* ═══ 1. HERO SECTION ═══ */}
      <section
        style={{
          background: 'var(--deep-pine)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '6rem',
          paddingBottom: '4rem',
        }}
      >
        {/* Background Gradients */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(ellipse at 15% 40%, rgba(16,185,129,0.12) 0%, transparent 55%),
              radial-gradient(ellipse at 85% 25%, rgba(181,141,79,0.1) 0%, transparent 45%),
              radial-gradient(ellipse at 50% 85%, rgba(16,185,129,0.06) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
          }}
        />
        {/* Pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310B981' fill-opacity='0.035'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            pointerEvents: 'none',
          }}
        />

        <div
          className="container"
          style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, width: '100%' }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: heroPhoto ? 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' : '1fr',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="reveal-on-scroll delay-100" style={{ marginBottom: '1.25rem' }}>
                <span
                  className="badge badge-emerald"
                  style={{ fontSize: '0.78rem', padding: '0.4rem 1rem', letterSpacing: '0.08em' }}
                >
                  <Sparkles size={14} /> {hero.tag || 'PELAJAR • PEMUDA • KABUPATEN BANYUMAS'}
                </span>
              </div>

              <h1
                className="reveal-on-scroll delay-150"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                  fontWeight: 900,
                  color: 'var(--warm-alabaster)',
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                  marginBottom: '1rem',
                }}
              >
                {hero.titleLine1 || 'ROHIS'}{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, var(--emerald-light) 0%, var(--antique-brass) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {hero.titleLine2 || 'BANYUMAS'}
                </span>
              </h1>

              {hero.leadPhrase && (
                <p
                  className="reveal-on-scroll delay-200"
                  style={{
                    fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)',
                    fontWeight: 600,
                    color: 'var(--antique-brass)',
                    marginBottom: '1rem',
                    lineHeight: 1.5,
                  }}
                >
                  {hero.leadPhrase}
                </p>
              )}

              <p
                className="reveal-on-scroll delay-250"
                style={{
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)',
                  color: 'rgba(245,242,237,0.7)',
                  lineHeight: 1.8,
                  marginBottom: '2.25rem',
                  maxWidth: 580,
                }}
              >
                {hero.narrative}
              </p>

              <div
                className="reveal-on-scroll delay-300"
                style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}
              >
                <Link to={hero.btnPrimaryLink || '/about'} className="btn btn-primary btn-lg">
                  {hero.btnPrimaryText || 'Kenali ROHIS Lebih Dekat'} <ArrowRight size={18} />
                </Link>
                {hero.btnSecondaryLink && (hero.btnSecondaryLink.startsWith('http') || hero.btnSecondaryLink.startsWith('#')) ? (
                  <a
                    href={hero.btnSecondaryLink}
                    className="btn btn-primary btn-lg"
                  >
                    {hero.btnSecondaryText || 'Anggota ROHIS'} <ArrowRight size={18} />
                  </a>
                ) : (
                  <Link
                    to={hero.btnSecondaryLink || '/schools'}
                    className="btn btn-primary btn-lg"
                  >
                    {hero.btnSecondaryText || 'Anggota ROHIS'} <ArrowRight size={18} />
                  </Link>
                )}
              </div>
            </div>

            {heroPhoto && (
              <div className="reveal-scale delay-200" style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    border: '1px solid rgba(16,185,129,0.25)',
                    boxShadow: '0 20px 40px -15px rgba(0,0,0,0.6)',
                    background: 'var(--deep-pine-light)',
                  }}
                >
                  <img
                    src={heroPhoto}
                    alt={hero.photoTitle || 'Dokumentasi ROHIS Banyumas'}
                    referrerPolicy="no-referrer"
                    style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block', filter: 'contrast(1.05)' }}
                    onError={(e) => {
                      const driveId = extractDriveId(hero.photoUrl);
                      if (driveId && !e.currentTarget.src.includes('lh3.googleusercontent.com')) {
                        e.currentTarget.src = `https://lh3.googleusercontent.com/d/${driveId}`;
                      }
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(13,43,34,0.85)',
                      backdropFilter: 'blur(10px)',
                      padding: '0.35rem 0.8rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid rgba(181,141,79,0.3)',
                      color: '#E6C587',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}
                  >
                    {hero.photoStamp || 'ARCHIVE REF #01'}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(13,43,34,0.96) 0%, rgba(13,43,34,0.7) 60%, transparent 100%)',
                      padding: '2rem 1.5rem 1.25rem',
                      color: 'var(--warm-alabaster)',
                    }}
                  >
                    {hero.photoLoc && (
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: '#E6C587',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          marginBottom: '0.35rem',
                        }}
                      >
                        📍 {hero.photoLoc}
                      </div>
                    )}
                    <h4
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        marginBottom: '0.35rem',
                        lineHeight: 1.3,
                        color: 'var(--warm-alabaster)',
                      }}
                    >
                      {hero.photoTitle || 'Sinergi Kader Dakwah Pelajar se-Banyumas'}
                    </h4>
                    {hero.photoSub && (
                      <p style={{ fontSize: '0.82rem', color: 'rgba(245,242,237,0.75)', margin: 0, lineHeight: 1.4 }}>
                        {hero.photoSub}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                    fontSize: '0.72rem',
                    color: 'rgba(245,242,237,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  <span>{hero.metaStatus || 'RESMI • DAKWAH SEKOLAH'}</span>
                  <span>{hero.metaSince || '2017 • PURWOKERTO'}</span>
                  <span>{hero.metaNetwork || '17+ SMA / SMK / MA'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1.25rem',
              marginTop: '4.5rem',
            }}
          >
            {statsList.map((stat, idx) => (
              <StatCard
                key={idx}
                value={stat.value}
                suffix={stat.suffix || '+'}
                label={stat.label}
                delay={100 + idx * 80}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 2. ABOUT SECTION ═══ */}
      <section className="section" style={{ background: 'var(--warm-alabaster)', padding: '5.5rem 0' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: aboutPhoto ? 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' : '1fr',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span className="badge badge-emerald reveal-left delay-100" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
                <BookOpen size={14} /> {about.tag || 'TENTANG KAMI'}
              </span>
              <h2
                className="reveal-left delay-150"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.7rem)',
                  fontWeight: 800,
                  color: 'var(--deep-pine)',
                  lineHeight: 1.2,
                  marginBottom: '1.25rem',
                }}
              >
                {about.title || 'Bukan sekadar sebuah organisasi.'}
              </h2>
              {about.lead && (
                <p
                  className="reveal-left delay-200"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'var(--deep-pine-light)',
                    lineHeight: 1.7,
                    marginBottom: '1.25rem',
                  }}
                >
                  {about.lead}
                </p>
              )}
              {about.paragraph1 && (
                <p
                  className="reveal-left delay-250"
                  style={{
                    color: 'rgba(13,43,34,0.7)',
                    lineHeight: 1.8,
                    marginBottom: '1rem',
                    fontSize: '0.96rem',
                  }}
                >
                  {about.paragraph1}
                </p>
              )}
              {about.paragraph2 && (
                <p
                  className="reveal-left delay-300"
                  style={{
                    color: 'rgba(13,43,34,0.7)',
                    lineHeight: 1.8,
                    marginBottom: '1.75rem',
                    fontSize: '0.96rem',
                  }}
                >
                  {about.paragraph2}
                </p>
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                  gap: '1.25rem',
                  marginBottom: '2rem',
                }}
              >
                {about.point1Title && (
                  <div
                    className="reveal-scale delay-200"
                    style={{
                      background: 'white',
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(13,43,34,0.08)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.4rem',
                        color: 'var(--deep-pine)',
                        fontWeight: 700,
                      }}
                    >
                      <CheckCircle size={18} style={{ color: 'var(--emerald)' }} />
                      <span>{about.point1Title}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'rgba(13,43,34,0.6)', lineHeight: 1.5 }}>
                      {about.point1Desc}
                    </p>
                  </div>
                )}
                {about.point2Title && (
                  <div
                    className="reveal-scale delay-300"
                    style={{
                      background: 'white',
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(13,43,34,0.08)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.4rem',
                        color: 'var(--deep-pine)',
                        fontWeight: 700,
                      }}
                    >
                      <CheckCircle size={18} style={{ color: 'var(--antique-brass)' }} />
                      <span>{about.point2Title}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'rgba(13,43,34,0.6)', lineHeight: 1.5 }}>
                      {about.point2Desc}
                    </p>
                  </div>
                )}
              </div>

              <div className="reveal-left delay-350">
                <Link to="/about" className="btn btn-secondary">
                  Baca Selengkapnya Tentang Kami <ChevronRight size={18} />
                </Link>
              </div>
            </div>

            {aboutPhoto && (
              <div>
                <div
                  className="reveal-right delay-200"
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid rgba(13,43,34,0.1)',
                  }}
                >
                  <img
                    src={aboutPhoto}
                    alt="Tentang ROHIS Banyumas"
                    referrerPolicy="no-referrer"
                    style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      const driveId = extractDriveId(about.photoUrl);
                      if (driveId && !e.currentTarget.src.includes('lh3.googleusercontent.com')) {
                        e.currentTarget.src = `https://lh3.googleusercontent.com/d/${driveId}`;
                      }
                    }}
                  />
                  {about.photoTag && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '1rem',
                        left: '1rem',
                        background: 'rgba(13,43,34,0.88)',
                        backdropFilter: 'blur(8px)',
                        color: 'var(--warm-alabaster)',
                        padding: '0.4rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {about.photoTag} {about.photoEst ? `• ${about.photoEst}` : ''}
                    </div>
                  )}
                </div>

                {about.quoteText && (
                  <div
                    className="reveal-right delay-300"
                    style={{
                      marginTop: '1.5rem',
                      background: 'rgba(13,43,34,0.03)',
                      borderLeft: '4px solid var(--antique-brass)',
                      padding: '1.25rem 1.5rem',
                      borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
                    }}
                  >
                    <Quote size={20} style={{ color: 'var(--antique-brass)', marginBottom: '0.4rem', opacity: 0.7 }} />
                    <p
                      style={{
                        fontStyle: 'italic',
                        color: 'var(--deep-pine)',
                        fontSize: '0.94rem',
                        lineHeight: 1.6,
                        margin: '0 0 0.5rem',
                      }}
                    >
                      {about.quoteText}
                    </p>
                    {about.quoteAuthor && (
                      <div style={{ fontSize: '0.8rem', color: 'rgba(13,43,34,0.5)', fontWeight: 600 }}>
                        {about.quoteAuthor}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ 3. 5 PILAR GERAKAN ═══ */}
      <section id="program" className="section section-pine" style={{ padding: '5.5rem 0' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="section-header reveal-on-scroll delay-100">
            <span
              className="badge"
              style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--emerald-light)', marginBottom: '0.75rem' }}
            >
              <Compass size={14} /> Struktur Gerakan
            </span>
            <h2 style={{ color: 'var(--warm-alabaster)' }}>5 Pilar Divisi & Program Kerja</h2>
            <div className="section-divider" />
            <p style={{ color: 'rgba(245,242,237,0.6)' }}>
              Struktur fungsional organisasi yang menggerakkan roda dakwah, pembinaan, dan karya nyata pelajar se-Banyumas.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {divisionCards.map((div, i) => {
              const Icon = div.icon;
              return (
                <div
                  key={div.id}
                  className={`card-editorial reveal-scale delay-${(i + 1) * 80}`}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: 'rgba(16,185,129,0.15)',
                        border: '1px solid rgba(16,185,129,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <Icon size={22} style={{ color: 'var(--emerald-light)' }} />
                    </div>
                    <span
                      className="badge badge-gold"
                      style={{ fontSize: '0.68rem', padding: '0.15rem 0.6rem', marginBottom: '0.5rem' }}
                    >
                      {div.division}
                    </span>
                    <h3 style={{ color: 'var(--warm-alabaster)', fontSize: '1.15rem', margin: '0.4rem 0 0.75rem', lineHeight: 1.3 }}>
                      <Link to={`/about?div=${div.division}#program-divisi`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {div.title}
                      </Link>
                    </h3>
                    <p style={{ color: 'rgba(245,242,237,0.65)', fontSize: '0.86rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {div.desc}
                    </p>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                      <div
                        style={{
                          fontSize: '0.74rem',
                          color: 'var(--antique-brass)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Program Kerja Unggulan:
                      </div>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: '1.2rem',
                          color: 'rgba(245,242,237,0.7)',
                          fontSize: '0.82rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {div.programs.map((prog, pIdx) => (
                          <li key={pIdx} style={{ marginBottom: '0.25rem' }}>
                            {prog}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                    <Link
                      to={`/about?div=${div.division}#program-divisi`}
                      style={{
                        color: 'var(--emerald-light)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      Detail Divisi <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="reveal-on-scroll delay-200" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/about#program-divisi" className="btn btn-primary">
              Pelajari Detail 5 Pilar Divisi <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 4. HISTORIA & LINIMASA ROKABA ═══ */}
      <section className="section" style={{ background: 'var(--warm-alabaster)', padding: '5.5rem 0' }}>
        <div className="container" style={{ maxWidth: 1000, margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="section-header reveal-on-scroll delay-100">
            <span className="badge badge-emerald" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
              <History size={14} /> Jejak Perjalanan
            </span>
            <h2 style={{ color: 'var(--deep-pine)' }}>Historia & Linimasa ROKABA</h2>
            <div className="section-divider" />
            <p style={{ color: 'rgba(13,43,34,0.6)' }}>
              Tonggak peristiwa bersejarah dan langkah konsolidasi dakwah pelajar sejak awal berdirinya hingga kini.
            </p>
          </div>

          <div style={{ position: 'relative', marginTop: '3rem' }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 28,
                width: 2,
                background: 'linear-gradient(to bottom, var(--emerald), var(--antique-brass))',
                opacity: 0.35,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {timeline.map((item, i) => (
                <div
                  key={item.id || i}
                  className="reveal-on-scroll"
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'flex-start',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: '50%',
                      background: 'var(--deep-pine)',
                      border: '3px solid var(--antique-brass)',
                      color: 'var(--warm-alabaster)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      flexShrink: 0,
                      zIndex: 2,
                      boxShadow: 'var(--shadow-md)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {item.year}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: 'white',
                      padding: '1.5rem 1.75rem',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid rgba(13,43,34,0.08)',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      e.currentTarget.style.transform = 'translateX(6px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                        {item.tag || 'FASE JEJAK'}
                      </span>
                      {item.location && (
                        <span style={{ fontSize: '0.76rem', color: 'rgba(13,43,34,0.5)', fontWeight: 600 }}>
                          📍 {item.location}
                        </span>
                      )}
                    </div>
                    <h3 style={{ color: 'var(--deep-pine)', fontSize: '1.2rem', margin: '0.25rem 0 0.5rem' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'rgba(13,43,34,0.7)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. ARTIKEL TERBARU ═══ */}
      <section className="section" style={{ background: '#F8F6F0', padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="section-header reveal-on-scroll delay-100">
            <span className="badge badge-emerald" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
              <BookOpen size={14} /> {home?.sections?.articles?.tag || 'Artikel Terbaru'}
            </span>
            <h2 style={{ color: 'var(--deep-pine)' }}>{home?.sections?.articles?.title || 'Literasi Dakwah Moderat'}</h2>
            <div className="section-divider" />
            <p style={{ color: 'rgba(13,43,34,0.6)' }}>
              {home?.sections?.articles?.desc || 'Bacaan Islami berkualitas untuk memperluas wawasan dan memperkuat iman pemuda.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {latestArticles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>

          <div className="reveal-on-scroll delay-200" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/articles" className="btn btn-secondary">
              {home?.sections?.articles?.btnText || 'Lihat Semua Artikel'} <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 6. AGENDA MENDATANG ═══ */}
      <section className="section section-pine" style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="section-header reveal-on-scroll delay-100">
            <span
              className="badge"
              style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--emerald-light)', marginBottom: '0.75rem' }}
            >
              <Calendar size={14} /> {home?.sections?.events?.tag || 'Agenda Mendatang'}
            </span>
            <h2 style={{ color: 'var(--warm-alabaster)' }}>{home?.sections?.events?.title || 'Kegiatan & Kajian ROKABA'}</h2>
            <div className="section-divider" />
            <p style={{ color: 'rgba(245,242,237,0.6)' }}>
              {home?.sections?.events?.desc || 'Ikuti berbagai kegiatan dakwah dan pengembangan diri bersama kader se-Banyumas.'}
            </p>
          </div>

          <div style={{ maxWidth: 750, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((evt, i) => <EventCard key={evt.id} event={evt} index={i} />)
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(245,242,237,0.4)' }}>
                <Calendar size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p>Belum ada agenda mendatang yang dijadwalkan.</p>
              </div>
            )}
          </div>

          <div className="reveal-on-scroll delay-200" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/events" className="btn btn-primary">
              {home?.sections?.events?.btnText || 'Lihat Seluruh Agenda Kegiatan'} <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 7. LAYANAN & DIREKTORI ═══ */}
      <section className="section" style={{ padding: '5rem 0', background: 'var(--warm-alabaster)' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="section-header reveal-on-scroll delay-100">
            <h2 style={{ color: 'var(--deep-pine)' }}>{home?.sections?.services?.title || 'Layanan & Direktori Dakwah'}</h2>
            <div className="section-divider" />
            <p style={{ color: 'rgba(13,43,34,0.6)' }}>
              {home?.sections?.services?.desc || 'Berbagai fasilitas terpadu untuk mendukung syiar dan komunikasi antar sekolah.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              {
                icon: MessageCircle,
                title: 'Konsultasi & Tanya Jawab',
                desc: 'Ruang tanya jawab keislaman dan problematika remaja bersama asatidz.',
                link: '/consultation',
                color: 'var(--emerald)',
              },
              {
                icon: Library,
                title: 'E-Library & Modul',
                desc: 'Unduh modul kaderisasi, slide materi kajian, dan kurikulum pembinaan gratis.',
                link: '/library',
                color: 'var(--antique-brass)',
              },
              {
                icon: School,
                title: 'Direktori ROHIS Sekolah',
                desc: 'Database sekolah anggota SMA/SMK/MA terdaftar se-Kabupaten Banyumas.',
                link: '/schools',
                color: '#7C3AED',
              },
            ].map((srv, i) => (
              <Link
                key={i}
                to={srv.link}
                className={`reveal-scale delay-${(i + 1) * 100}`}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  textDecoration: 'none',
                  border: '1px solid rgba(13,43,34,0.06)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                  display: 'block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    background: `${srv.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <srv.icon size={24} style={{ color: srv.color }} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--deep-pine)' }}>
                  {srv.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(13,43,34,0.6)', lineHeight: 1.6 }}>{srv.desc}</p>
                <div
                  style={{
                    marginTop: '1rem',
                    color: srv.color,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  Akses Fitur <ArrowRight size={15} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. CLOSING CTA BANNER ═══ */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--deep-pine) 0%, var(--deep-pine-light) 100%)',
          padding: '5.5rem 1.5rem',
          textAlign: 'center',
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
            background: 'radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.12) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <div className="reveal-scale delay-100" style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <span
            className="badge badge-emerald"
            style={{
              marginBottom: '1.25rem',
              padding: '0.4rem 1.1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(16, 185, 129, 0.16)',
              color: '#34D399',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.78rem',
              letterSpacing: '0.04em',
            }}
          >
            <Heart size={14} /> {closing.tag || 'MARI BERGABUNG'}
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4.5vw, 2.6rem)',
              fontWeight: 800,
              color: 'var(--warm-alabaster)',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}
          >
            {closing.headline || 'Mari Tumbuh Bersama.'}
          </h2>
          <p
            style={{
              color: 'rgba(245,242,237,0.7)',
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              marginBottom: '2.25rem',
              lineHeight: 1.8,
            }}
          >
            {closing.lead}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={closing.btnPrimaryLink || '/contact'} className="btn btn-primary btn-lg">
              {closing.btnPrimaryText || 'Daftar Menjadi Bagian ROKABA'} <ArrowRight size={18} />
            </Link>
            <Link
              to={closing.btnSecondaryLink || '/contact'}
              className="btn btn-glass btn-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#F5F2ED',
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '9999px',
                padding: '1rem 2.25rem',
                fontSize: '1rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                textDecoration: 'none',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.65)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.25)';
              }}
            >
              <MessageCircle size={18} /> {closing.btnSecondaryText || 'Hubungi Pengurus'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
