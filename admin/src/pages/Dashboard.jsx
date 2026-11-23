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
  Newspaper,
  CalendarDays,
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

  const isSchoolEditor = user?.role === 'editor_sekolah';
  const sections = [
    { label: 'Berita', count: news.length, to: '/content/news', Icon: Newspaper },
    { label: 'Artikel', count: articles.length, to: '/content/articles', Icon: FileText },
    { label: 'Agenda', count: events.length, to: '/content/events', Icon: Calendar },
    { label: 'Galeri', count: gallery.length, to: '/content/gallery', Icon: ImageIcon },
  ];
  const shortcuts = [
    { label: 'Edit beranda', to: '/content/home', Icon: Edit3 },
    { label: 'Kelola berita', to: '/content/news', Icon: Newspaper },
    { label: 'Kelola agenda', to: '/content/events', Icon: CalendarDays },
    { label: 'Moderasi Q&A', to: '/qa', Icon: MessageCircle, count: pendingQuestions },
  ];

  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard-hero" aria-labelledby="dashboard-title">
        <div className="admin-dashboard-intro">
          <h1 id="dashboard-title">Ringkasan</h1>
          <p>Kelola konten, kegiatan, dan direktori ROHIS Kabupaten Banyumas.</p>
          <Link to={isSchoolEditor ? '/content/schools' : '/content/home'} className="btn-pine">
            <Edit3 size={16} aria-hidden="true" />
            {isSchoolEditor ? 'Kelola sekolah' : 'Edit beranda'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="admin-documentary-frame">
          <img src="/documentation/hero.jpg" alt="Dokumentasi kegiatan ROKABA" />
        </div>
      </section>

      {!isSchoolEditor && (
        <>
          <section className="admin-dashboard-stats admin-glass" aria-label="Jumlah konten">
            {sections.map(({ label, count, to, Icon }) => (
              <Link key={label} to={to} className="admin-dashboard-stat">
                <span className="admin-stat-icon"><Icon size={20} aria-hidden="true" /></span>
                <div><strong>{count}</strong><span>{label}</span></div>
                <ArrowRight className="admin-row-arrow" size={16} aria-hidden="true" />
              </Link>
            ))}
          </section>

          <div className="admin-dashboard-columns">
            <section className="admin-soft-card" aria-labelledby="admin-content-title">
              <div className="admin-panel-heading">
                <h2 id="admin-content-title">Konten terbaru</h2>
                <label className="admin-dashboard-search">
                  <Search size={16} aria-hidden="true" />
                  <input
                    type="search"
                    aria-label="Cari judul konten"
                    placeholder="Cari judul konten"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="form-input-soft"
                  />
                </label>
              </div>
              <ul className="admin-dashboard-list">
                {filteredContent.map(({ id, type, icon: Icon, title, link }) => (
                  <li key={id}>
                    <Link to={link} className="admin-dashboard-row">
                      <span className="admin-stat-icon"><Icon size={16} aria-hidden="true" /></span>
                      <span className="admin-dashboard-row-copy"><small>{type}</small><strong>{title}</strong></span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              {filteredContent.length === 0 && <p className="admin-empty-content">Belum ada konten yang ditemukan.</p>}
            </section>

            <section className="admin-soft-card" aria-labelledby="admin-shortcuts-title">
              <div className="admin-panel-heading"><h2 id="admin-shortcuts-title">Akses cepat</h2></div>
              <ul className="admin-dashboard-list">
                {shortcuts.map(({ label, to, Icon, count }) => (
                  <li key={to}>
                    <Link to={to} className="admin-dashboard-row">
                      <span className="admin-stat-icon"><Icon size={16} aria-hidden="true" /></span>
                      <strong>{label}</strong>
                      {count > 0 && <span className="badge-soft-brass">{count} baru</span>}
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
