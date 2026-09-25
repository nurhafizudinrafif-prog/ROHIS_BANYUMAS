import { useState } from 'react';
import { useData } from '../context/DataContext';
import { ClipboardList, Search, Download, Upload, Trash2 } from 'lucide-react';

export default function AuditLogs() {
  const { auditLogs, updateData, articles, events, schools, questions, library, team, users, home } = useData();
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter(log => {
    const text = `${log.action} ${log.module} ${log.detail} ${log.username}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const handleBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      data: { home, articles, events, schools, questions, library, team, users, auditLogs },
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rokaba-full-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const backup = JSON.parse(text);
        const d = backup.data || backup;
        if (d.articles) await updateData('articles', d.articles);
        if (d.events) await updateData('events', d.events);
        if (d.schools) await updateData('schools', d.schools);
        if (d.questions) await updateData('questions', d.questions);
        if (d.library) await updateData('library', d.library);
        if (d.team) await updateData('team', d.team);
        if (d.home) await updateData('home', d.home);
        alert('Data berhasil di-restore!');
      } catch (err) {
        alert('Gagal membaca file: ' + err.message);
      }
    };
    input.click();
  };

  const handleClearLogs = async () => {
    if (!confirm('Hapus semua audit log?')) return;
    await updateData('audit_logs', []);
  };

  const actionColors = {
    CREATE: 'var(--emerald)',
    UPDATE: 'var(--antique-brass)',
    DELETE: '#EF4444',
    ANSWER: '#3B82F6',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 800 }}>Audit Log & Backup</h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleBackup} className="btn btn-sm btn-secondary"><Download size={14} /> Backup</button>
          <button onClick={handleRestore} className="btn btn-sm btn-secondary"><Upload size={14} /> Restore</button>
          <button onClick={handleClearLogs} className="btn btn-sm btn-danger"><Trash2 size={14} /> Clear Logs</button>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" className="form-input" placeholder="Cari log..." style={{ paddingLeft: '2.5rem', maxWidth: 400, width: '100%' }}
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="glass-card table-responsive">
        <table className="data-table" style={{ minWidth: 540 }}>
          <thead>
            <tr><th>Waktu</th><th>User</th><th>Aksi</th><th>Modul</th><th>Detail</th></tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(log => (
              <tr key={log.id}>
                <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(log.timestamp).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td style={{ fontWeight: 500 }}>{log.username}</td>
                <td>
                  <span className="badge" style={{
                    background: `${actionColors[log.action] || 'var(--emerald)'}15`,
                    color: actionColors[log.action] || 'var(--emerald)',
                    fontSize: '0.68rem',
                  }}>
                    {log.action}
                  </span>
                </td>
                <td style={{ fontSize: '0.82rem', textTransform: 'capitalize' }}>{log.module}</td>
                <td style={{ fontSize: '0.82rem', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.detail}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <ClipboardList size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} /><br />Tidak ada log
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
