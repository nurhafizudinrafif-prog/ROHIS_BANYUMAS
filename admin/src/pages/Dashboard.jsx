import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { FileText, Calendar, School, MessageCircle, Library, Users, TrendingUp, Clock, Download, Upload, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

function StatCard({ icon: Icon, value, label, color, link }) {
  return (
    <Link to={link} className="glass-card" style={{
      padding: '1.5rem', textDecoration: 'none',
      display: 'flex', alignItems: 'flex-start', gap: '1rem',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '12px',
        background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.75rem', lineHeight: 1 }}>{value}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem', fontWeight: 500 }}>{label}</div>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { articles, events, schools, gallery, questions, library, auditLogs, team, users } = useData();
  const { user } = useAuth();

  const pendingQA = questions.filter(q => q.status === 'pending').length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const totalPengurus = Array.isArray(team)
    ? team.length
    : ((team?.bph?.length || 0) + (team?.divisions?.reduce((acc, d) => acc + (d.members?.length || 0), 0) || 0));

  // Backup handler
  const handleBackup = () => {
    const backupData = { articles, events, schools, gallery, questions, library, team, users, auditLogs };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rokaba-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          Selamat Datang, <span style={{ color: 'var(--emerald)' }}>{user?.username}</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Kelola seluruh konten ROKABA dari dashboard ini.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem',
      }}>
        <StatCard icon={FileText} value={articles.length} label="Artikel" color="var(--emerald)" link="/content/articles" />
        <StatCard icon={Calendar} value={upcomingEvents} label="Agenda Mendatang" color="var(--antique-brass)" link="/content/events" />
        <StatCard icon={ImageIcon} value={(gallery || []).length} label="Album Galeri" color="#06B6D4" link="/content/gallery" />
        <StatCard icon={School} value={schools.length} label="Sekolah" color="#7C3AED" link="/content/schools" />
        <StatCard icon={MessageCircle} value={pendingQA} label="Q&A Menunggu" color="#F59E0B" link="/qa" />
        <StatCard icon={Library} value={library.length} label="Materi Library" color="#3B82F6" link="/library" />
        <StatCard icon={Users} value={totalPengurus} label="Pengurus" color="#EC4899" link="/content/team" />
      </div>

      {/* Quick Actions & Recent Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {/* Quick Actions */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--emerald)' }} /> Aksi Cepat
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <Link to="/content/articles" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <FileText size={16} /> Tambah Artikel Baru
            </Link>
            <Link to="/content/events" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <Calendar size={16} /> Tambah Agenda Baru
            </Link>
            <Link to="/qa" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <MessageCircle size={16} /> Moderasi Pertanyaan {pendingQA > 0 && <span className="badge badge-brass">{pendingQA}</span>}
            </Link>
            <Link to="/library" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <Library size={16} /> Kelola E-Library ({library.length} Materi)
            </Link>
            <button onClick={handleBackup} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <Download size={16} /> Backup Data (JSON)
            </button>
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} style={{ color: 'var(--antique-brass)' }} /> Aktivitas Terbaru
          </h3>
          {auditLogs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {auditLogs.slice(0, 6).map(log => (
                <div key={log.id} style={{
                  padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)',
                  background: 'var(--glass-bg)', fontSize: '0.82rem',
                  borderLeft: '3px solid var(--emerald)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{log.detail}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
              Belum ada aktivitas tercatat
            </p>
          )}
          {auditLogs.length > 6 && (
            <Link to="/audit" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: 'var(--emerald)' }}>
              Lihat semua log →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
