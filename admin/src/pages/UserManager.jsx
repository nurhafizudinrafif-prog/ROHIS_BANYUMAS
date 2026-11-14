import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Users,
  Search,
} from 'lucide-react';

export default function UserManager() {
  const { users, schools, updateData, addAuditLog } = useData();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [password, setPassword] = useState('');

  const filteredUsers = useMemo(() => {
    return (users || []).filter((u) => {
      const q = search.toLowerCase();
      const schoolName = (schools.find((s) => s.id === u.schoolId)?.name || u.schoolId || '').toLowerCase();
      return (
        (u.username || '').toLowerCase().includes(q) ||
        (u.role || '').toLowerCase().includes(q) ||
        schoolName.includes(q)
      );
    });
  }, [users, schools, search]);

  const handleOpenNew = () => {
    setEditing({
      id: `user-${Date.now()}`,
      username: '',
      role: 'editor_sekolah',
      schoolId: schools[0]?.id || '',
      lastLogin: null,
    });
    setPassword('');
    setIsNew(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditing({ ...u });
    setPassword('');
    setIsNew(false);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editing || !editing.username.trim()) {
      alert('Username wajib diisi!');
      return;
    }

    const payload = {
      ...editing,
      username: editing.username.trim(),
    };
    if (password.trim()) {
      payload.password = password.trim();
    }

    const updated = isNew
      ? [...(users || []), payload]
      : (users || []).map((u) => (u.id === editing.id ? payload : u));

    await updateData('users', updated);
    if (addAuditLog && user) {
      addAuditLog(
        user.id,
        user.username,
        isNew ? 'CREATE' : 'UPDATE',
        'users',
        `${isNew ? 'Created' : 'Updated'} user: ${editing.username}`
      ).catch(() => {});
    }
    setModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmItem) return;
    const u = deleteConfirmItem;
    if (u.role === 'superadmin') {
      alert('Tidak bisa menghapus akun Super Admin');
      return;
    }
    const updated = (users || []).filter((item) => item.id !== u.id);
    await updateData('users', updated);
    if (addAuditLog && user) {
      await addAuditLog(
        user.id,
        user.username,
        'DELETE',
        'users',
        `Deleted user: ${u.username}`
      );
    }
    setDeleteConfirmItem(null);
    setModalOpen(false);
  };

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', paddingBottom: '3.5rem' }}>
      {/* Header Bar matching Image 04 panel 2 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
            Pengguna
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Kelola akun pengguna CMS ROKABA.
          </p>
        </div>

        <button onClick={handleOpenNew} className="btn btn-pine">
          <Plus size={16} /> Tambah pengguna
        </button>
      </div>

      {/* Search Input matching Image 04 panel 2 */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 420, marginBottom: '1.25rem' }}>
        <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="form-input-soft"
          style={{ paddingLeft: '2.4rem' }}
          placeholder="Cari username atau sekolah..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop Data Table matching Image 04 panel 2 */}
      <div className="admin-desktop-table data-table-container-soft">
        <table className="data-table-soft">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Username</th>
              <th style={{ width: '20%' }}>Peran</th>
              <th>Sekolah</th>
              <th style={{ width: 90, textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => {
              const school = schools.find((s) => s.id === u.schoolId);
              return (
                <tr key={u.id}>
                  {/* Username */}
                  <td>
                    <strong style={{ color: 'var(--pine-dark)', fontWeight: 700 }}>
                      {u.username}
                    </strong>
                  </td>

                  {/* Peran */}
                  <td>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: u.role === 'superadmin' ? 'var(--pine-deep)' : 'var(--text-secondary)',
                    }}>
                      {u.role}
                    </span>
                  </td>

                  {/* Sekolah */}
                  <td>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                      {school ? school.name : u.role === 'superadmin' ? 'ROHIS Kabupaten Banyumas' : '—'}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-secondary-soft btn-sm"
                      onClick={() => handleOpenEdit(u)}
                      style={{ gap: '0.35rem', padding: '0.35rem 0.75rem' }}
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  Tidak ada data pengguna.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="admin-mobile-cards">
        {filteredUsers.map((u) => {
          const school = schools.find((s) => s.id === u.schoolId);
          return (
            <div key={u.id} className="admin-mobile-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--pine-dark)' }}>{u.username}</strong>
                <span className="badge badge-outline" style={{ fontSize: '0.72rem' }}>
                  {u.role}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Sekolah: <strong>{school ? school.name : u.role === 'superadmin' ? 'ROHIS Kabupaten Banyumas' : '—'}</strong>
              </div>
              <div className="admin-mobile-card-actions">
                <button
                  type="button"
                  className="btn btn-secondary-soft btn-sm"
                  onClick={() => handleOpenEdit(u)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Edit3 size={14} /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Permissions Summary Card (Image 10 Panel B) */}
      <div
        className="admin-soft-card"
        style={{
          marginTop: '1.5rem',
          padding: '1.25rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <Shield size={18} style={{ color: 'var(--pine-dark)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '0.88rem', color: 'var(--pine-dark)' }}>Peran superadmin</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.45 }}>
              Akses penuh ke seluruh modul: Kelola Beranda, Berita, Artikel, Agenda, Galeri, Sekolah, Pengurus, Moderasi Q&amp;A, Pengguna, Audit Log, dan Pengaturan.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <Users size={18} style={{ color: 'var(--accent-brass-dark)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '0.88rem', color: 'var(--pine-dark)' }}>Peran editor_sekolah</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.45 }}>
              Akses terbatas untuk pengelolaan konten Berita, Artikel, Agenda, Galeri, Sekolah, dan Moderasi Q&amp;A sesuai afiliasi sekolah.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RESPONSIVE MODAL: EDIT / TAMBAH PENGGUNA
          ═══════════════════════════════════════════════════════════════ */}
      {modalOpen && editing && (
        <div className="modal-backdrop-responsive" onClick={() => setModalOpen(false)}>
          <div
            className="modal-dialog-responsive"
            style={{ maxWidth: 720 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header-responsive">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 41, 31, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--pine-dark)',
                }}>
                  <Users size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
                    {isNew ? 'Tambah Pengguna CMS' : 'Edit Pengguna CMS'}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Hak akses dan peran administrator sistem
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-icon-soft"
                onClick={() => setModalOpen(false)}
                title="Tutup dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSave}>
              <div className="modal-body-responsive">
                <div className="form-grid-2-soft">
                  <div className="form-group-soft">
                    <label className="form-label-soft">Username *</label>
                    <input
                      type="text"
                      className="form-input-soft"
                      value={editing.username || ''}
                      onChange={(e) => setEditing({ ...editing, username: e.target.value })}
                      placeholder="Contoh: admin_rohissma1"
                      required
                    />
                  </div>

                  <div className="form-group-soft">
                    <label className="form-label-soft">Peran / Role *</label>
                    <select
                      className="form-select-soft"
                      value={editing.role}
                      onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                    >
                      <option value="editor_sekolah">editor_sekolah (Pengelola Sekolah)</option>
                      <option value="superadmin">superadmin (Akses Penuh)</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2-soft">
                  <div className="form-group-soft">
                    <label className="form-label-soft">Afiliasi Sekolah</label>
                    <select
                      className="form-select-soft"
                      value={editing.schoolId || ''}
                      onChange={(e) => setEditing({ ...editing, schoolId: e.target.value })}
                    >
                      <option value="">ROHIS Kabupaten Banyumas (Induk)</option>
                      {schools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group-soft">
                    <label className="form-label-soft">
                      {isNew ? 'Password Akun *' : 'Ganti Password (Kosongkan jika tidak diubah)'}
                    </label>
                    <input
                      type="password"
                      className="form-input-soft"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isNew ? 'Masukkan password baru' : '••••••••'}
                      required={isNew}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div className="modal-footer-responsive">
                <div>
                  {!isNew && editing.role !== 'superadmin' && (
                    <button
                      type="button"
                      className="btn btn-secondary-soft"
                      style={{ color: '#EF4444' }}
                      onClick={() => setDeleteConfirmItem(editing)}
                    >
                      <Trash2 size={15} /> Hapus pengguna
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary-soft"
                    onClick={() => setModalOpen(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-pine"
                  >
                    <Save size={15} />
                    <span>{isNew ? 'Tambah pengguna' : 'Simpan perubahan'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          DELETE CONFIRMATION DIALOG (Image 07)
          ═══════════════════════════════════════════════════════════════ */}
      {deleteConfirmItem && (
        <div className="modal-backdrop-responsive" style={{ zIndex: 10000 }} onClick={() => setDeleteConfirmItem(null)}>
          <div
            className="admin-soft-card"
            style={{
              maxWidth: 420,
              width: '90%',
              margin: 'auto',
              padding: '1.5rem',
              boxShadow: 'var(--soft-shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
                Hapus pengguna?
              </h3>
              <button
                type="button"
                className="btn-icon-soft"
                onClick={() => setDeleteConfirmItem(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                flexShrink: 0,
              }}>
                <Trash2 size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--pine-dark)' }}>
                  {deleteConfirmItem.username}
                </strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Akun pengguna ini akan dihapus dan tidak lagi dapat mengakses panel CMS.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                type="button"
                className="btn btn-secondary-soft"
                onClick={() => setDeleteConfirmItem(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-danger-soft"
                onClick={confirmDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
