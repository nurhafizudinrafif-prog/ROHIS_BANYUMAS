import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  ClipboardList,
  Search,
  Download,
  Upload,
  Trash2,
  Clock,
  Filter,
} from 'lucide-react';

export default function AuditLogs() {
  const { auditLogs, updateData } = useData();

  const [userFilter, setUserFilter] = useState('Semua');
  const [actionFilter, setActionFilter] = useState('Semua');
  const [timeFilter, setTimeFilter] = useState('Semua');

  // Unique usernames in logs
  const usernames = useMemo(() => {
    return [
      'Semua',
      ...new Set((auditLogs || []).map((l) => l.username).filter(Boolean)),
    ];
  }, [auditLogs]);

  // Unique actions in logs
  const actions = useMemo(() => {
    return [
      'Semua',
      ...new Set((auditLogs || []).map((l) => l.action).filter(Boolean)),
    ];
  }, [auditLogs]);

  const filteredLogs = useMemo(() => {
    const now = Date.now();
    return (auditLogs || []).filter((log) => {
      // User match
      if (userFilter !== 'Semua' && log.username !== userFilter) return false;
      // Action match
      if (actionFilter !== 'Semua' && log.action !== actionFilter) return false;
      // Time match
      if (timeFilter !== 'Semua') {
        const logTime = new Date(log.timestamp).getTime();
        const diffHours = (now - logTime) / (1000 * 60 * 60);
        if (timeFilter === 'today' && diffHours > 24) return false;
        if (timeFilter === '7days' && diffHours > 24 * 7) return false;
        if (timeFilter === '30days' && diffHours > 24 * 30) return false;
      }
      return true;
    });
  }, [auditLogs, userFilter, actionFilter, timeFilter]);

  const handleClearLogs = async () => {
    if (!window.confirm('Yakin ingin membersihkan seluruh riwayat audit log?')) return;
    await updateData('audit_logs', []);
  };

  const formatActivitySummary = (log) => {
    if (log.detail) return log.detail;
    const actionLabel =
      log.action === 'CREATE'
        ? 'Menambahkan'
        : log.action === 'UPDATE'
        ? 'Memperbarui'
        : log.action === 'DELETE'
        ? 'Menghapus'
        : log.action === 'ANSWER'
        ? 'Menjawab'
        : log.action;
    return `${actionLabel} data pada modul ${log.module || 'sistem'}.`;
  };

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', paddingBottom: '3.5rem' }}>
      {/* Header Bar matching Image 10 panel C (Read-only Audit Log) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
            Audit aktivitas
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Riwayat aktivitas penting di CMS ROKABA (hanya-baca).
          </p>
        </div>
      </div>

      {/* Filter Row matching Image 04 panel 3: Pengguna, Jenis aktivitas, Rentang waktu */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div className="form-group-soft" style={{ marginBottom: 0 }}>
          <label className="form-label-soft">Pengguna</label>
          <select
            className="form-select-soft"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          >
            {usernames.map((u) => (
              <option key={u} value={u}>
                {u === 'Semua' ? 'Semua pengguna' : u}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group-soft" style={{ marginBottom: 0 }}>
          <label className="form-label-soft">Jenis aktivitas</label>
          <select
            className="form-select-soft"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            {actions.map((a) => (
              <option key={a} value={a}>
                {a === 'Semua' ? 'Semua aktivitas' : a}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group-soft" style={{ marginBottom: 0 }}>
          <label className="form-label-soft">Rentang waktu</label>
          <select
            className="form-select-soft"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="Semua">Semua waktu</option>
            <option value="today">24 Jam Terakhir</option>
            <option value="7days">7 Hari Terakhir</option>
            <option value="30days">30 Hari Terakhir</option>
          </select>
        </div>
      </div>

      {/* Desktop Data Table matching Image 04 panel 3 */}
      <div className="admin-desktop-table data-table-container-soft">
        <table className="data-table-soft">
          <thead>
            <tr>
              <th style={{ width: 180 }}>Waktu</th>
              <th style={{ width: 220 }}>Pengguna</th>
              <th>Aktivitas</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                {/* Waktu */}
                <td>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {log.timestamp
                      ? new Date(log.timestamp).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </span>
                </td>

                {/* Pengguna */}
                <td>
                  <strong style={{ color: 'var(--pine-dark)', fontWeight: 600 }}>
                    {log.username || 'Admin'}
                  </strong>
                </td>

                {/* Aktivitas */}
                <td>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                    {formatActivitySummary(log)}
                  </span>
                </td>
              </tr>
            ))}

            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  Tidak ada riwayat aktivitas yang sesuai filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="admin-mobile-cards">
        {filteredLogs.map((log) => (
          <div key={log.id} className="admin-mobile-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: 'var(--pine-dark)', fontSize: '0.92rem' }}>{log.username || 'Admin'}</strong>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {log.timestamp
                  ? new Date(log.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
                  : '—'}
              </span>
            </div>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
              {formatActivitySummary(log)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
