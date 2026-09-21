import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  ArrowRight, Users, School, Calendar, BookOpen, Star, 
  ChevronRight, Sparkles, TrendingUp, Heart, MessageCircle,
  Library, FileText
} from 'lucide-react';

function StatCard({ icon: Icon, value, label, delay }) {
  return (
    <div className="animate-fade-in-up" style={{
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.75rem',
      textAlign: 'center',
      animationDelay: `${delay}ms`,
      transition: 'transform 0.3s ease, background 0.3s ease',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.background = 'rgba(16,185,129,0.08)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
    }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: '14px',
        background: 'linear-gradient(135deg, var(--emerald), var(--emerald-dark))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1rem',
        boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
      }}>
        <Icon size={22} color="white" />
      </div>
      <div style={{
        fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem',
        color: 'var(--warm-alabaster)', lineHeight: 1,
      }}>
        {value}+
      </div>
      <div style={{
        color: 'rgba(245,242,237,0.5)', fontSize: '0.82rem', marginTop: '0.35rem',
        fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {label}
      </div>
    </div>
  );
}

function ArticleCard({ article, index }) {
  const categoryColors = {
    'Edukasi': 'var(--emerald)',
    'Dakwah': 'var(--antique-brass)',
    'Ibadah': '#7C3AED',
    'Motivasi': '#F59E0B',
  };

  return (
    <Link to={`/articles/${article.slug}`} className="card-editorial animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms`, textDecoration: 'none' }}>
      <div style={{
        height: 180,
        background: `linear-gradient(135deg, var(--deep-pine) 0%, var(--deep-pine-light) 50%, ${categoryColors[article.category] || 'var(--emerald)'}22 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 70% 30%, rgba(16,185,129,0.15) 0%, transparent 60%)',
        }} />
        <FileText size={40} style={{ color: 'rgba(245,242,237,0.15)' }} />
        <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
          <span className="badge badge-emerald">{article.category}</span>
        </div>
      </div>
      <div className="card-body">
        <h3 style={{ color: 'var(--deep-pine)', marginBottom: '0.5rem' }}>{article.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: 'rgba(13,43,34,0.45)' }}>
          <span>{article.author}</span>
          <span>•</span>
          <span>{new Date(article.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </Link>
  );
}

function EventCard({ event, index }) {
  const isUpcoming = event.status === 'upcoming';
  const eventDate = new Date(event.date);

  return (
    <div className="animate-fade-in-up" style={{
      animationDelay: `${index * 100}ms`,
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      display: 'flex',
      gap: '1.25rem',
      alignItems: 'flex-start',
      border: '1px solid rgba(13,43,34,0.06)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all 0.3s ease',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    }}
    >
      <div style={{
        minWidth: 60, textAlign: 'center',
        background: isUpcoming ? 'var(--emerald-glass)' : 'rgba(13,43,34,0.05)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 0.5rem',
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)', fontWeight: 800,
          fontSize: '1.5rem', color: isUpcoming ? 'var(--emerald)' : 'rgba(13,43,34,0.4)',
          lineHeight: 1,
        }}>
          {eventDate.getDate()}
        </div>
        <div style={{
          fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
          color: isUpcoming ? 'var(--emerald-dark)' : 'rgba(13,43,34,0.35)',
          letterSpacing: '0.05em', marginTop: '0.2rem',
        }}>
          {eventDate.toLocaleDateString('id-ID', { month: 'short' })}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className={`badge ${isUpcoming ? 'badge-emerald' : 'badge-pine'}`}>
            {isUpcoming ? 'Akan Datang' : 'Selesai'}
          </span>
        </div>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>{event.title}</h4>
        <p style={{ fontSize: '0.82rem', color: 'rgba(13,43,34,0.5)' }}>
          📍 {event.location} • 🕐 {event.time}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const { home, articles, events, schools, loading } = useData();
  const stats = home?.stats || { kader: 1200, schools: 45, events: 120, articles: 85 };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--deep-pine)' }}>
        <div className="animate-float" style={{ textAlign: 'center' }}>
          <img src="/logo.png" alt="ROKABA" style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: '1rem', filter: 'drop-shadow(0 4px 16px rgba(16,185,129,0.4))' }} />
          <p style={{ color: 'rgba(245,242,237,0.5)', fontFamily: 'var(--font-heading)' }}>Memuat data...</p>
        </div>
      </div>
    );
  }

  const latestArticles = [...articles].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 3);
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section style={{
        background: 'var(--deep-pine)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decorations */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(181,141,79,0.06) 0%, transparent 40%),
            radial-gradient(ellipse at 60% 80%, rgba(16,185,129,0.05) 0%, transparent 45%)
          `,
          pointerEvents: 'none',
        }} />
        {/* Geometric pattern overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310B981' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ maxWidth: 720, paddingTop: '6rem' }}>
            <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
              <span className="badge badge-emerald" style={{ fontSize: '0.78rem', padding: '0.4rem 1rem' }}>
                <Sparkles size={14} /> Forum Komunikasi Rohis
              </span>
            </div>

            <h1 className="animate-fade-in-up delay-100" style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
              fontWeight: 800,
              color: 'var(--warm-alabaster)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
            }}>
              {home?.hero_title || 'Rohis Kabupaten'}{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--emerald-light), var(--antique-brass))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Banyumas
              </span>
            </h1>

            <p className="animate-fade-in-up delay-200" style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'rgba(245,242,237,0.6)',
              lineHeight: 1.8,
              marginBottom: '2.5rem',
              maxWidth: 560,
            }}>
              {home?.welcome_msg || 'Membangun generasi pelajar Muslim yang berkarakter, cerdas, dan berakhlak mulia melalui wadah dakwah yang modern dan inklusif.'}
            </p>

            <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/articles" className="btn btn-primary btn-lg">
                Jelajahi Artikel <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn btn-lg" style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--warm-alabaster)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
              }}>
                Tentang Kami
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            marginTop: '4rem',
            paddingBottom: '4rem',
          }}>
            <StatCard icon={Users} value={stats.kader} label="Kader Aktif" delay={400} />
            <StatCard icon={School} value={stats.schools} label="Pangkalan" delay={500} />
            <StatCard icon={Calendar} value={stats.events} label="Kegiatan" delay={600} />
            <StatCard icon={BookOpen} value={stats.articles} label="Artikel" delay={700} />
          </div>
        </div>
      </section>

      {/* ═══ LATEST ARTICLES ═══ */}
      <section className="section" style={{ background: 'var(--warm-alabaster)' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-header">
            <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
              <BookOpen size={14} /> Artikel Terbaru
            </span>
            <h2>Literasi Dakwah Moderat</h2>
            <div className="section-divider" />
            <p>Bacaan Islami berkualitas untuk memperluas wawasan dan memperkuat iman.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            {latestArticles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/articles" className="btn btn-secondary">
              Lihat Semua Artikel <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ UPCOMING EVENTS ═══ */}
      <section className="section section-pine">
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-header">
            <span className="badge" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--emerald-light)', marginBottom: '0.75rem' }}>
              <Calendar size={14} /> Agenda Mendatang
            </span>
            <h2>Kegiatan ROKABA</h2>
            <div className="section-divider" />
            <p>Ikuti berbagai kegiatan dakwah dan pengembangan diri bersama ROKABA.</p>
          </div>

          <div style={{
            maxWidth: 700,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {upcomingEvents.length > 0 ? upcomingEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            )) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(245,242,237,0.4)' }}>
                <Calendar size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p>Belum ada agenda mendatang</p>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/events" className="btn btn-primary">
              Lihat Semua Agenda <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES CTA ═══ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-header">
            <h2>Layanan Kami</h2>
            <div className="section-divider" />
            <p>Berbagai fasilitas digital untuk mendukung syiar dan pengembangan ROHIS.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              { icon: MessageCircle, title: 'Konsultasi Q&A', desc: 'Tanya jawab anonim seputar agama dan kehidupan bersama asatidz.', link: '/consultation', color: 'var(--emerald)' },
              { icon: Library, title: 'E-Library', desc: 'Unduh materi dakwah, kajian, dan slide presentasi secara gratis.', link: '/library', color: 'var(--antique-brass)' },
              { icon: School, title: 'Direktori Sekolah', desc: 'Database lengkap ROHIS SMA/SMK/MA se-Kabupaten Banyumas.', link: '/schools', color: '#7C3AED' },
            ].map((feature, i) => (
              <Link to={feature.link} key={i} className="animate-fade-in-up" style={{
                animationDelay: `${i * 100}ms`,
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                textDecoration: 'none',
                border: '1px solid rgba(13,43,34,0.06)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s ease',
                display: 'block',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: '14px',
                  background: `${feature.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  <feature.icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--deep-pine)' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(13,43,34,0.55)', lineHeight: 1.6 }}>{feature.desc}</p>
                <div style={{ marginTop: '1rem', color: feature.color, fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Selengkapnya <ArrowRight size={15} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section style={{
        background: 'linear-gradient(135deg, var(--deep-pine) 0%, var(--deep-pine-light) 100%)',
        padding: '5rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.1) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <Heart size={40} style={{ color: 'var(--emerald)', marginBottom: '1.5rem' }} />
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            fontWeight: 800, color: 'var(--warm-alabaster)', marginBottom: '1rem',
          }}>
            Bergabung Bersama ROKABA
          </h2>
          <p style={{ color: 'rgba(245,242,237,0.55)', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.7 }}>
            Mari bersama-sama membangun generasi pelajar Muslim yang unggul dan berakhlak mulia.
          </p>
          <Link to="/contact" className="btn btn-primary btn-lg">
            Hubungi Kami <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
