import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Search,
  Shield,
  GraduationCap,
  User,
  CheckCircle2,
} from 'lucide-react';
import ImageUploadField from '../components/ImageUploadField';
import { getDirectImageUrl } from '../utils/media';

export default function TeamManager() {
  const { team, updateData, addAuditLog } = useData();
  const { user } = useAuth();

  const [filterGroup, setFilterGroup] = useState('Semua');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [targetGroup, setTargetGroup] = useState('bph'); // 'bph' or division shortName/id
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    school: '',
    instagram: '',
    photo: '',
  });

  const bphList = useMemo(() => team?.bph || [], [team]);
  const divisionsList = useMemo(() => team?.divisions || [], [team]);

  // Flatten all members for unified table view matching Image 03 panel 2
  const allMembers = useMemo(() => {
    const list = [];
    bphList.forEach((m) =>
      list.push({ ...m, groupKey: 'bph', groupName: 'BPH' })
    );
    divisionsList.forEach((div) => {
      (div.members || []).forEach((m) => {
        list.push({
          ...m,
          groupKey: div.shortName || div.id,
          groupName: div.name || div.title,
        });
      });
    });
    return list;
  }, [bphList, divisionsList]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    let list = allMembers;
    if (filterGroup !== 'Semua') {
      list = list.filter((m) => {
        if (filterGroup === 'bph') return m.groupKey === 'bph';
        return m.groupKey.toLowerCase() === filterGroup.toLowerCase();
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          (m.name || '').toLowerCase().includes(q) ||
          (m.role || '').toLowerCase().includes(q) ||
          (m.school || '').toLowerCase().includes(q) ||
          (m.groupName || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [allMembers, filterGroup, search]);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setTargetGroup('bph');
    setFormData({
      name: '',
      role: 'Ketua Umum',
      school: '',
      instagram: '',
      photo: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setTargetGroup(member.groupKey || 'bph');
    setFormData({
      name: member.name || '',
      role: member.role || '',
      school: member.school || '',
      instagram: member.instagram || '',
      photo: member.photo || '',
    });
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmItem) return;
    const member = deleteConfirmItem;

    try {
      let updatedTeam;
      if (member.groupKey === 'bph') {
        updatedTeam = {
          ...team,
          bph: (team.bph || []).filter((m) => m.id !== member.id),
        };
      } else {
        updatedTeam = {
          ...team,
          divisions: (team.divisions || []).map((div) => {
            if (
              div.shortName?.toLowerCase() === member.groupKey?.toLowerCase() ||
              div.id === member.groupKey
            ) {
              return {
                ...div,
                members: (div.members || []).filter((m) => m.id !== member.id),
              };
            }
            return div;
          }),
        };
      }

      await updateData('team', updatedTeam);
      if (addAuditLog && user) {
        await addAuditLog(
          user.id,
          user.username,
          'DELETE',
          'team',
          `Deleted member: ${member.name} (${member.role})`
        );
      }
    } catch (err) {
      console.error('Delete member failed:', err);
    } finally {
      setDeleteConfirmItem(null);
      setModalOpen(false);
    }
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama pengurus wajib diisi!');
      return;
    }

    const payload = {
      id: editingMember ? editingMember.id : `tm-${Date.now()}`,
      name: formData.name.trim(),
      role: formData.role.trim() || 'Pengurus',
      school: formData.school.trim() || 'ROHIS Banyumas',
      instagram: formData.instagram.trim(),
      photo: formData.photo.trim(),
    };

    try {
      let updatedTeam;

      if (editingMember) {
        // Edit existing
        if (targetGroup === 'bph') {
          // If was bph, update in bph
          const existsInBph = (team.bph || []).some((m) => m.id === editingMember.id);
          if (existsInBph) {
            updatedTeam = {
              ...team,
              bph: (team.bph || []).map((m) => (m.id === editingMember.id ? payload : m)),
            };
          } else {
            // Moved to bph: remove from divisions and add to bph
            updatedTeam = {
              ...team,
              bph: [...(team.bph || []), payload],
              divisions: (team.divisions || []).map((div) => ({
                ...div,
                members: (div.members || []).filter((m) => m.id !== editingMember.id),
              })),
            };
          }
        } else {
          // Target is division
          const existsInDiv = (team.divisions || []).some((d) =>
            (d.members || []).some((m) => m.id === editingMember.id)
          );
          updatedTeam = {
            ...team,
            bph: (team.bph || []).filter((m) => m.id !== editingMember.id),
            divisions: (team.divisions || []).map((div) => {
              const isTarget =
                div.shortName?.toLowerCase() === targetGroup.toLowerCase() ||
                div.id === targetGroup;
              const cleanMembers = (div.members || []).filter((m) => m.id !== editingMember.id);
              if (isTarget) {
                return { ...div, members: [...cleanMembers, payload] };
              }
              return { ...div, members: cleanMembers };
            }),
          };
        }
      } else {
        // Add new
        if (targetGroup === 'bph') {
          updatedTeam = {
            ...team,
            bph: [...(team.bph || []), payload],
          };
        } else {
          updatedTeam = {
            ...team,
            divisions: (team.divisions || []).map((div) => {
              const isTarget =
                div.shortName?.toLowerCase() === targetGroup.toLowerCase() ||
                div.id === targetGroup;
              if (isTarget) {
                return { ...div, members: [...(div.members || []), payload] };
              }
              return div;
            }),
          };
        }
      }

      await updateData('team', updatedTeam);
      if (addAuditLog && user) {
        await addAuditLog(
          user.id,
          user.username,
          editingMember ? 'UPDATE' : 'CREATE',
          'team',
          `${editingMember ? 'Updated' : 'Added'} member: ${payload.name} (${payload.role})`
        );
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Save member failed:', err);
      alert('Gagal menyimpan pengurus: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', paddingBottom: '3.5rem' }}>
      {/* Header Bar matching Image 03 panel 2 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
            Pengurus
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Kelola struktur kepengurusan ROHIS Kabupaten Banyumas (ROKABA).
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-pine">
          <Plus size={16} /> Tambah pengurus
        </button>
      </div>

      {/* Filter Row matching Image 03 panel 2 */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <select
          className="form-select-soft"
          style={{ minWidth: 200, padding: '0.5rem 1rem' }}
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
        >
          <option value="Semua">Semua BPH/Divisi</option>
          <option value="bph">Badan Pengurus Harian (BPH)</option>
          {divisionsList.map((div) => (
            <option key={div.id || div.shortName} value={div.shortName || div.id}>
              {div.name || div.title}
            </option>
          ))}
        </select>

        <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input-soft"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Cari pengurus"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Data Table matching Image 03 panel 2 */}
      <div className="admin-desktop-table data-table-container-soft">
        <table className="data-table-soft">
          <thead>
            <tr>
              <th style={{ width: 100 }}>Foto</th>
              <th style={{ width: '22%' }}>Jabatan</th>
              <th style={{ width: '28%' }}>Nama pengurus</th>
              <th>Asal sekolah</th>
              <th style={{ width: 90, textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                {/* Foto Column: Avatar or neutral rounded box with user icon + "Foto" */}
                <td>
                  <div style={{
                    width: 48,
                    height: 56,
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(16, 41, 31, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    {member.photo ? (
                      <img
                        src={getDirectImageUrl(member.photo)}
                        alt={member.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <>
                        <User size={18} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>Foto</span>
                      </>
                    )}
                  </div>
                </td>

                {/* Jabatan */}
                <td>
                  <strong style={{ color: 'var(--pine-dark)', fontWeight: 700 }}>
                    {member.role || 'Pengurus'}
                  </strong>
                </td>

                {/* Nama Pengurus */}
                <td>
                  <span style={{ fontWeight: 600, color: 'var(--pine-dark)' }}>
                    {member.name}
                  </span>
                </td>

                {/* Asal Sekolah */}
                <td>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    {member.school || 'ROHIS Banyumas'}
                  </span>
                </td>

                {/* Aksi */}
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="btn btn-secondary-soft btn-sm"
                    onClick={() => handleOpenEdit(member)}
                    style={{ gap: '0.35rem', padding: '0.35rem 0.75rem' }}
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                </td>
              </tr>
            ))}

            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  Tidak ada data pengurus yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="admin-mobile-cards">
        {filteredMembers.map((member) => (
          <div key={member.id} className="admin-mobile-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: 48,
                height: 56,
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 41, 31, 0.05)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                {member.photo ? (
                  <img
                    src={getDirectImageUrl(member.photo)}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <User size={18} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>Foto</span>
                  </>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--pine-dark)' }}>
                  {member.name}
                </strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--pine-deep)', fontWeight: 600 }}>
                  {member.role}
                </span>
                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {member.school || 'ROHIS Banyumas'}
                </span>
              </div>
            </div>

            <div className="admin-mobile-card-actions">
              <button
                type="button"
                className="btn btn-secondary-soft btn-sm"
                onClick={() => handleOpenEdit(member)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Edit3 size={14} /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RESPONSIVE MODAL: EDIT / TAMBAH PENGURUS
          ═══════════════════════════════════════════════════════════════ */}
      {modalOpen && (
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
                    {editingMember ? 'Edit Data Pengurus' : 'Tambah Pengurus Baru'}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Struktur kepengurusan resmi ROKABA
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
            <form onSubmit={handleSaveMember}>
              <div className="modal-body-responsive">
                <div className="form-grid-2-soft">
                  <div className="form-group-soft">
                    <label className="form-label-soft">Nama lengkap pengurus *</label>
                    <input
                      type="text"
                      className="form-input-soft"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Muhammad Rayyan"
                      required
                    />
                  </div>

                  <div className="form-group-soft">
                    <label className="form-label-soft">Grup / Divisi *</label>
                    <select
                      className="form-select-soft"
                      value={targetGroup}
                      onChange={(e) => setTargetGroup(e.target.value)}
                    >
                      <option value="bph">Badan Pengurus Harian (BPH)</option>
                      {divisionsList.map((div) => (
                        <option key={div.id || div.shortName} value={div.shortName || div.id}>
                          {div.name || div.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid-2-soft">
                  <div className="form-group-soft">
                    <label className="form-label-soft">Jabatan / Amanah *</label>
                    <input
                      type="text"
                      className="form-input-soft"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Contoh: Ketua Umum / Kadiv SDM"
                      required
                    />
                  </div>

                  <div className="form-group-soft">
                    <label className="form-label-soft">Asal Sekolah</label>
                    <input
                      type="text"
                      className="form-input-soft"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      placeholder="Contoh: SMAN 1 Purwokerto"
                    />
                  </div>
                </div>

                <div className="form-group-soft">
                  <label className="form-label-soft">Akun Instagram (Opsional)</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="Contoh: @nama_kader"
                  />
                </div>

                {/* Foto Pengurus */}
                <div style={{ marginTop: '0.5rem' }}>
                  <ImageUploadField
                    label="Foto Resmi Pengurus"
                    value={formData.photo}
                    onChange={(val) => setFormData({ ...formData, photo: val })}
                    placeholder="Upload foto profil atau tempel Google Drive..."
                    tip="Gunakan foto formal/semi-formal berbusana muslim rapi."
                  />
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div className="modal-footer-responsive">
                <div>
                  {editingMember && (
                    <button
                      type="button"
                      className="btn btn-secondary-soft"
                      style={{ color: '#EF4444' }}
                      onClick={() => setDeleteConfirmItem(editingMember)}
                    >
                      <Trash2 size={15} /> Hapus pengurus
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
                    <span>{editingMember ? 'Simpan perubahan' : 'Tambah pengurus'}</span>
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
                Hapus pengurus?
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
                  {deleteConfirmItem.name}
                </strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {deleteConfirmItem.role} • {deleteConfirmItem.school || 'ROHIS Banyumas'}
                  <br />
                  Data pengurus ini akan dihapus dari kepengurusan.
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
