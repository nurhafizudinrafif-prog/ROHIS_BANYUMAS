import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Shield, Plus, Edit3, Trash2, Save, X, Users } from 'lucide-react';

export default function UserManager() {
  const { users, schools, updateData, addAuditLog } = useData();
  const { user } = useAuth();
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const handleNew = () => {
    setEditing({ id: `user-${Date.now()}`, username: '', role: 'editor_sekolah', schoolId: '', lastLogin: null });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editing || !editing.username) return;
    const updated = isNew ? [...users, editing] : users.map(u => u.id === editing.id ? editing : u);
    await updateData('users', updated);
    await addAuditLog(user.id, user.username, isNew ? 'CREATE' : 'UPDATE', 'users', `${isNew ? 'Created' : 'Updated'} user: ${editing.username}`);
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = async (u) => {
    if (u.role === 'superadmin') return alert('Tidak bisa menghapus Super Admin');
    if (!confirm(`Hapus user "${u.username}"?`)) return;
    await updateData('users', users.filter(item => item.id !== u.id));
    await addAuditLog(user.id, user.username, 'DELETE', 'users', `Deleted user: ${u.username}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 800 }}>Manajemen User</h1>
        <button onClick={handleNew} className="btn btn-primary"><Plus size={16} /> Tambah User</button>
      </div>

      <div className="admin-desktop-table glass-card table-responsive">
        <table className="data-table" style={{ minWidth: 540 }}>
          <thead>
            <tr><th>Username</th><th>Role</th><th>Sekolah</th><th>Login Terakhir</th><th style={{ textAlign: 'right' }}>Aksi</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>{u.username}</td>
                <td><span className={`badge ${u.role === 'superadmin' ? 'badge-emerald' : 'badge-brass'}`}>{u.role}</span></td>
                <td>{u.schoolId ? (schools.find(s => s.id === u.schoolId)?.name || u.schoolId) : '—'}</td>
                <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('id-ID') : '—'}</td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button onClick={() => { setEditing({ ...u }); setIsNew(false); }} className="btn btn-sm btn-ghost" style={{ color: 'var(--emerald)' }}><Edit3 size={14} /></button>
                  <button onClick={() => handleDelete(u)} className="btn btn-sm btn-ghost" style={{ color: '#F87171' }}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Tidak ada user</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="admin-mobile-cards">
        {users.length > 0 ? (
          users.map(u => (
            <div key={u.id} className="admin-mobile-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>{u.username}</span>
                <span className={`badge ${u.role === 'superadmin' ? 'badge-emerald' : 'badge-brass'}`} style={{ fontSize: '0.68rem' }}>
                  {u.role}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Sekolah: <strong style={{ color: 'var(--text-primary)' }}>{u.schoolId ? (schools.find(s => s.id === u.schoolId)?.name || u.schoolId) : '—'}</strong>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Login Terakhir: {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('id-ID') : 'Belum pernah login'}
              </div>
              <div className="admin-mobile-card-actions">
                <button onClick={() => { setEditing({ ...u }); setIsNew(false); }} className="btn btn-primary">
                  <Edit3 size={15} /> Edit User
                </button>
                <button onClick={() => handleDelete(u)} className="btn btn-secondary" style={{ color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.35)' }}>
                  <Trash2 size={15} /> Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="admin-mobile-card" style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <p style={{ margin: '0 0 1rem', fontWeight: 600 }}>Tidak ada user terdaftar.</p>
            <button onClick={handleNew} className="btn btn-primary btn-sm" style={{ margin: '0 auto', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={14} /> Tambah User Baru
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="modal-overlay-responsive">
          <div className="glass-card modal-card-responsive animate-fade-in-up" style={{ maxWidth: 450, padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem' }}>{isNew ? 'Tambah' : 'Edit'} User</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input type="text" className="form-input" value={editing.username} onChange={e => setEditing({ ...editing, username: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-input" value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })}>
                <option value="superadmin">Super Admin</option>
                <option value="editor_sekolah">Editor Sekolah</option>
              </select>
            </div>
            {editing.role === 'editor_sekolah' && (
              <div className="form-group">
                <label className="form-label">Sekolah</label>
                <select className="form-input" value={editing.schoolId || ''} onChange={e => setEditing({ ...editing, schoolId: e.target.value })}>
                  <option value="">Pilih sekolah...</option>
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }}><Save size={16} /> Simpan</button>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="btn btn-secondary">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
