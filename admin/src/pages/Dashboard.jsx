import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  MessageCircle,
  Edit3,
  Search,
  ArrowRight,
  Info,
  Layers,
  Newspaper,
  CheckCircle2,
  CalendarDays,
  HelpCircle,
  Image as ImageIcon,
} from 'lucide-react';

export default function Dashboard() {
  const { news = [], articles = [], events = [], gallery = [], questions = [] } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const pendingQuestions = questions.filter((q) => q.status === 'pending').length;

  // Combine recent editorial items for the "Konten terbaru" table
  const recentContent = useMemo(() => {
    const list = [];

    (news || []).slice(0, 4).forEach((item) => {
      list.push({
        id: `news-${item.id}`,
        type: 'Berita',
        icon: Newspaper,
        title: item.title || 'Tanpa Judul',
        date: item.date || item.publishedAt || '',
        link: '/content/news',
      });
    });

    (articles || []).slice(0, 3).forEach((item) => {
      list.push({
        id: `article-${item.id}`,
        type: 'Artikel',
        icon: FileText,
        title: item.title || 'Tanpa Judul',
        date: item.date || item.publishedAt || '',
        link: '/content/articles',
      });
    });

    (events || []).slice(0, 3).forEach((item) => {
      list.push({
        id: `event-${item.id}`,
        type: 'Agenda',
        icon: Calendar,
        title: item.title || 'Tanpa Judul',
        date: item.date || '',
        link: '/content/events',
      });
    });

    return list;
  }, [news, articles, events]);

  const filteredContent = useMemo(() => {
    if (!searchTerm.trim()) return recentContent.slice(0, 6);
    const q = searchTerm.toLowerCase();
    return recentContent.filter(
      (item) => item.title.toLowerCase().includes(q) || item.type.toLowerCase().includes(q)
    );
  }, [recentContent, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* ═══════ Page Header ═══════ */}
      <div>
        <div className="admin-eyebrow">
          <span className="admin-eyebrow-bar" aria-hidden="true" />
          <span className="admin-eyebrow-text">Dashboard CMS</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--pine-dark)' }}>
          Ringkasan
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '4px' }}>
          Kelola informasi dan kegiatan ROKABA dari satu tempat.
        </p>
      </div>

      {/* ═══════ 4 Real Count Summary Cards (Image 05-admin-ringkasan-login & 14-hp-admin) ═══════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
          gap: '1.15rem',
        }}
      >
        {[
          { label: 'Berita', count: news.length, sub: 'Kabar & kegiatan', to: '/content/news', Icon: Newspaper },
          { label: 'Artikel', count: articles.length, sub: 'Dakwah & literasi', to: '/content/articles', Icon: FileText },
          { label: 'Agenda', count: events.length, sub: 'Jadwal & kajian', to: '/content/events', Icon: Calendar },
          { label: 'Galeri', count: gallery.length, sub: 'Foto & video', to: '/content/gallery', Icon: ImageIcon },
        ].map(({ label, count, sub, to, Icon }) => (
          <Link
            key={label}
            to={to}
            className="admin-soft-card"
            style={{
              padding: '1.25rem 1.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              textDecoration: 'none',
            }}
          >
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                {label}
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--pine-dark)', lineHeight: 1.1 }}>
                {count}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {sub}
              </div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                backgroundColor: 'var(--surface-inset)',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--inset-shadow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: 'var(--pine-dark)',
              }}
            >
              <Icon size={20} />
            </div>
          </Link>
        ))}
      </div>

      {/* ═══════ Akses Cepat Task Panel (Image 01) ═══════ */}
      <div className="admin-soft-card" style={{ padding: '1.5rem 1.75rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--pine-dark)' }}>
            Akses cepat
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Tindakan utama untuk pengelolaan konten dan kegiatan.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <Link
            to="/content/home"
            className="btn-secondary-soft"
            style={{ padding: '0.7rem 1.25rem' }}
          >
            <Edit3 size={15} />
            <span>Edit beranda</span>
            <ArrowRight size={14} style={{ marginLeft: '4px' }} />
          </Link>

          <Link
            to="/content/news"
            className="btn-secondary-soft"
            style={{ padding: '0.7rem 1.25rem' }}
          >
            <Newspaper size={15} />
            <span>Tambah berita</span>
            <ArrowRight size={14} style={{ marginLeft: '4px' }} />
          </Link>

          <Link
            to="/content/events"
            className="btn-secondary-soft"
            style={{ padding: '0.7rem 1.25rem' }}
          >
            <CalendarDays size={15} />
            <span>Kelola agenda</span>
            <ArrowRight size={14} style={{ marginLeft: '4px' }} />
          </Link>
        </div>
      </div>

      {/* ═══════ Lower Section: Two Functional Panels (Image 01) ═══════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
          gap: '1.5rem',
        }}
        className="admin-dashboard-split"
      >
        {/* Left: Konten Terbaru Table */}
        <div className="admin-soft-card" style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pine-dark)' }}>
                Konten terbaru
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Daftar konten yang baru ditambahkan atau diperbarui.
              </p>
            </div>

            <div style={{ position: 'relative', width: '200px' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                placeholder="Cari judul konten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input-soft"
                style={{
                  padding: '0.45rem 0.65rem 0.45rem 2.2rem',
                  fontSize: '0.8rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              />
            </div>
          </div>

          <div className="admin-soft-table-wrap">
            <table className="admin-soft-table">
              <thead>
                <tr>
                  <th style={{ width: '110px' }}>Jenis</th>
                  <th>Judul</th>
                  <th style={{ width: '70px', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.map((item) => {
                  const Icon = item.icon;
                  return (
                    <tr key={item.id}>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Icon size={14} style={{ color: 'var(--accent-brass-dark)' }} />
                          <span>{item.type}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--pine-dark)' }}>
                        <span style={{ display: 'block', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          to={item.link}
                          style={{
                            fontSize: '0.84rem',
                            fontWeight: 600,
                            color: 'var(--pine-dark)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            textDecoration: 'underline',
                          }}
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filteredContent.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Belum ada konten yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Perlu Ditinjau Panel */}
        <div className="admin-soft-card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pine-dark)' }}>
              Perlu ditinjau
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Beberapa hal yang membutuhkan perhatian atau pembaruan.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to="/qa"
              className="admin-soft-card"
              style={{
                padding: '1.1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textDecoration: 'none',
                boxShadow: 'var(--soft-shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageCircle size={18} style={{ color: 'var(--pine-dark)' }} />
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--pine-dark)' }}>
                    Periksa pertanyaan masuk
                  </span>
                  {pendingQuestions > 0 && (
                    <span
                      style={{
                        marginLeft: '8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--status-amber-bg)',
                        color: 'var(--status-amber)',
                        padding: '2px 7px',
                        borderRadius: '999px',
                      }}
                    >
                      {pendingQuestions} baru
                    </span>
                  )}
                </div>
              </div>
              <ArrowRight size={15} style={{ color: 'var(--text-secondary)' }} />
            </Link>

            <Link
              to="/content/events"
              className="admin-soft-card"
              style={{
                padding: '1.1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textDecoration: 'none',
                boxShadow: 'var(--soft-shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={18} style={{ color: 'var(--pine-dark)' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--pine-dark)' }}>
                  Perbarui informasi kegiatan
                </span>
              </div>
              <ArrowRight size={15} style={{ color: 'var(--text-secondary)' }} />
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════ Subtle Bottom Info Note (Image 01) ═══════ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginTop: '0.5rem',
        }}
      >
        <Info size={14} />
        <span>Data ditampilkan sesuai akun dan hak akses ({user?.role || 'superadmin'}).</span>
      </div>
    </div>
  );
}
