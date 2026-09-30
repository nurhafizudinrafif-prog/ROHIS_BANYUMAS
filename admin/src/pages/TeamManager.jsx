import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  Users, Plus, Edit3, Trash2, Save, X, Search, Shield,
  GraduationCap, User, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import ImageUploadField from '../components/ImageUploadField';
import { InstagramIcon } from '../components/SocialIcons';
import { getDirectImageUrl } from '../utils/media';

export default function TeamManager() {
  const { team, updateData, addAuditLog } = useData();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'bph', or division id/shortName
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [targetGroup, setTargetGroup] = useState('bph'); // 'bph' or division shortName
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    school: '',
    instagram: '',
    photo: '',
  });

  const bphList = useMemo(() => team?.bph || [], [team]);
  const divisionsList = useMemo(() => team?.divisions || [], [team]);

  // Flatten all members for 'all' tab with division tag
  const allMembers = useMemo(() => {
    const list = [];
    bphList.forEach(m => list.push({ ...m, groupKey: 'bph', groupName: 'Badan Pengurus Harian (BPH)' }));
    divisionsList.forEach(div => {
      (div.members || []).forEach(m => {
        list.push({ ...m, groupKey: div.shortName || div.id, groupName: div.name });
      });
    });
    return list;
  }, [bphList, divisionsList]);

  // Filtered members by tab & search
  const filteredMembers = useMemo(() => {
    let list = allMembers;
    if (activeTab === 'bph') {
      list = allMembers.filter(m => m.groupKey === 'bph');
    } else if (activeTab !== 'all') {
      list = allMembers.filter(m => m.groupKey.toLowerCase() === activeTab.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        (m.name || '').toLowerCase().includes(q) ||
        (m.role || '').toLowerCase().includes(q) ||
        (m.school || '').toLowerCase().includes(q) ||
        (m.groupName || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [allMembers, activeTab, search]);

  const handleOpenAdd = (defaultGroup = 'bph') => {
    setEditingMember(null);
    setTargetGroup(defaultGroup);
    setFormData({
      name: '',
      role: defaultGroup === 'bph' ? 'Ketua Umum' : 'Staf Divisi',
      school: '',
      instagram: '',
      photo: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setTargetGroup(member.groupKey);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      school: member.school || '',
      instagram: member.instagram || '',
      photo: member.photo || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Yakin ingin menghapus ${member.name} (${member.role}) dari kepengurusan?`)) return;

    try {
      let updatedTeam;
      if (member.groupKey === 'bph') {
        updatedTeam = {
          ...team,
          bph: (team.bph || []).filter(m => m.id !== member.id),
        };
      } else {
        updatedTeam = {
          ...team,
          divisions: (team.divisions || []).map(div => {
            if ((div.shortName || div.id).toLowerCase() === member.groupKey.toLowerCase()) {
              return {
                ...div,
                members: (div.members || []).filter(m => m.id !== member.id),
              };
            }
            return div;
          }),
        };
      }

      await updateData('team', updatedTeam);
      try {
        if (addAuditLog) {
          await addAuditLog(user?.id || 'admin', user?.username || 'admin', 'DELETE', 'team', `Deleted member: ${member.name}`);
        }
      } catch {}
    } catch (err) {
      console.error('Delete member error:', err);
      alert('Gagal menghapus data pengurus: ' + (err.message || 'Terjadi kesalahan sistem'));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      let updatedTeam = { ...team };

      // Sanitize Google Drive URL if duplicated or pasted awkwardly
      let cleanPhoto = (formData.photo || '').trim();
      const driveMatch = cleanPhoto.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i) || cleanPhoto.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
      if (driveMatch && driveMatch[1]) {
        cleanPhoto = `https://drive.google.com/file/d/${driveMatch[1]}/view?usp=sharing`;
      }

      const memberPayload = {
        id: editingMember ? editingMember.id : `member-${Date.now()}`,
        name: formData.name.trim(),
        role: formData.role.trim() || 'Anggota',
        school: formData.school.trim() || '-',
        instagram: (formData.instagram || '').trim().replace(/^@/, ''),
        photo: cleanPhoto,
      };

      if (editingMember) {
        // If group didn't change:
        if (editingMember.groupKey === targetGroup) {
          if (targetGroup === 'bph') {
            updatedTeam.bph = (team.bph || []).map(m => m.id === editingMember.id ? { ...m, ...memberPayload } : m);
          } else {
            updatedTeam.divisions = (team.divisions || []).map(div => {
              if ((div.shortName || div.id).toLowerCase() === targetGroup.toLowerCase()) {
                return {
                  ...div,
                  members: (div.members || []).map(m => m.id === editingMember.id ? { ...m, ...memberPayload } : m),
                };
              }
              return div;
            });
          }
        } else {
          // Group changed: remove from old, add to new
          if (editingMember.groupKey === 'bph') {
            updatedTeam.bph = (team.bph || []).filter(m => m.id !== editingMember.id);
          } else {
            updatedTeam.divisions = (team.divisions || []).map(div => {
              if ((div.shortName || div.id).toLowerCase() === editingMember.groupKey.toLowerCase()) {
                return { ...div, members: (div.members || []).filter(m => m.id !== editingMember.id) };
              }
              return div;
            });
          }
          // Add to new group
          if (targetGroup === 'bph') {
            updatedTeam.bph = [...(updatedTeam.bph || []), memberPayload];
          } else {
            updatedTeam.divisions = (updatedTeam.divisions || []).map(div => {
              if ((div.shortName || div.id).toLowerCase() === targetGroup.toLowerCase()) {
                return { ...div, members: [...(div.members || []), memberPayload] };
              }
              return div;
            });
          }
        }
      } else {
        // Create new
        if (targetGroup === 'bph') {
          updatedTeam.bph = [...(updatedTeam.bph || []), memberPayload];
        } else {
          updatedTeam.divisions = (updatedTeam.divisions || []).map(div => {
            if ((div.shortName || div.id).toLowerCase() === targetGroup.toLowerCase()) {
              return { ...div, members: [...(div.members || []), memberPayload] };
            }
            return div;
          });
        }
      }

      await updateData('team', updatedTeam);
      setModalOpen(false);

      try {
        if (addAuditLog) {
          addAuditLog(
            user?.id || 'admin',
            user?.username || 'admin',
            editingMember ? 'UPDATE' : 'CREATE',
            'team',
            `${editingMember ? 'Updated' : 'Added'} member: ${memberPayload.name} (${targetGroup.toUpperCase()})`
          );
        }
      } catch (logErr) {
        console.warn('Audit log write failed:', logErr);
      }
    } catch (err) {
      console.error('Save member error:', err);
      alert('Gagal menyimpan data: ' + (err.message || 'Terjadi kendala jaringan.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Header */}
      <div className="reveal-on-scroll" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Users size={26} color="var(--emerald)" /> Struktur Kepengurusan ROKABA
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Kelola data pengurus Badan Pengurus Harian (BPH) dan 5 Divisi Gerakan ROHIS Kabupaten Banyumas.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd(activeTab === 'all' ? 'bph' : activeTab)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={16} /> Tambah Pengurus
        </button>
      </div>

      {/* Tabs */}
      <div className="reveal-on-scroll delay-100" style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        padding: '0.5rem',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-glass)',
        marginBottom: '1.5rem',
      }}>
        <button
          className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
          onClick={() => setActiveTab('all')}
        >
          Semua ({allMembers.length})
        </button>
        <button
          className={`btn ${activeTab === 'bph' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
          onClick={() => setActiveTab('bph')}
        >
          BPH ({bphList.length})
        </button>
        {divisionsList.map(div => {
          const key = div.shortName || div.id;
          const count = div.members?.length || 0;
          return (
            <button
              key={div.id}
              className={`btn ${activeTab.toLowerCase() === key.toLowerCase() ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              onClick={() => setActiveTab(key)}
            >
              {div.shortName || div.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="reveal-on-scroll delay-150" style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
          <Search size={18} />
        </span>
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '2.75rem' }}
          placeholder="Cari nama pengurus, jabatan, atau asal sekolah..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Members Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
        gap: '1rem',
      }}>
        {filteredMembers.map((member, idx) => (
          <div
            key={member.id}
            className={`glass-card reveal-on-scroll delay-${Math.min((idx % 8 + 1) * 50, 400)}`}
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <div>
              {/* Badge Group */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  background: member.groupKey === 'bph' ? 'rgba(181, 141, 79, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                  color: member.groupKey === 'bph' ? 'var(--antique-brass-light)' : 'var(--emerald)',
                  border: member.groupKey === 'bph' ? '1px solid rgba(181, 141, 79, 0.35)' : '1px solid rgba(16, 185, 129, 0.25)',
                }}>
                  {member.groupKey === 'bph' ? 'BPH' : member.groupName}
                </span>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="btn btn-outline btn-xs"
                    title="Edit Pengurus"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="btn btn-danger-ghost btn-xs"
                    title="Hapus Pengurus"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Avatar + Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
                <div style={{
                  width: 56,
                  height: 68,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(181,141,79,0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1.5px solid rgba(255,255,255,0.12)',
                }}>
                  {member.photo ? (
                    <img
                      src={getDirectImageUrl(member.photo)}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                    />
                  ) : (
                    <User size={26} color="var(--emerald)" />
                  )}
                </div>

                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{member.name}</h4>
                  <span style={{ fontSize: '0.82rem', color: 'var(--emerald)', fontWeight: 600 }}>{member.role}</span>
                </div>
              </div>

              {/* Meta items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {member.school && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <GraduationCap size={14} />
                    <span>{member.school}</span>
                  </div>
                )}
                {member.instagram && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <InstagramIcon size={14} />
                    <a
                      href={`https://instagram.com/${member.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--antique-brass-light)' }}
                    >
                      @{member.instagram}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Tidak ada pengurus yang cocok dengan pencarian / tab ini.
        </div>
      )}

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div 
          className="modal-overlay-responsive" 
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div 
            className="glass-card modal-card-responsive animate-fade-in-up" 
            style={{ maxWidth: 700 }}
          >
            {/* Modal Header */}
            <div className="modal-header-responsive">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  background: 'rgba(200, 168, 91, 0.12)',
                  border: '1px solid rgba(200, 168, 91, 0.28)',
                  color: 'var(--antique-brass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Users size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
                    {editingMember ? 'Edit Data Pengurus' : 'Tambah Pengurus Baru'}
                  </h3>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {editingMember ? 'Perbarui informasi profil dan amanah kepengurusan' : 'Tambahkan personalia pengurus ke dalam struktur resmi'}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setModalOpen(false)} 
                className="btn btn-outline btn-xs"
                style={{
                  width: 34,
                  height: 34,
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  color: 'var(--text-muted)',
                }}
                aria-label="Tutup Modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body-responsive" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* 2 Kolom: Divisi & Jabatan */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
                  gap: '1.25rem',
                }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--warm-alabaster)', marginBottom: '0.45rem' }}>
                      Divisi / Bagian <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <select
                      className="form-input"
                      value={targetGroup}
                      onChange={e => setTargetGroup(e.target.value)}
                      required
                      style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}
                    >
                      <option value="bph">Badan Pengurus Harian (BPH)</option>
                      {divisionsList.map(d => (
                        <option key={d.id} value={d.shortName || d.id}>
                          {d.name} ({d.shortName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--warm-alabaster)', marginBottom: '0.45rem' }}>
                      Jabatan / Amanah <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Contoh: Ketua Umum / Kadiv SDM / Anggota"
                      required
                      style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* 2 Kolom: Nama Lengkap & Asal Sekolah */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
                  gap: '1.25rem',
                }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--warm-alabaster)', marginBottom: '0.45rem' }}>
                      Nama Lengkap <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Muhammad Al-Fatih"
                      required
                      style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--warm-alabaster)', marginBottom: '0.45rem' }}>
                      Asal Sekolah
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.school}
                      onChange={e => setFormData({ ...formData, school: e.target.value })}
                      placeholder="Contoh: SMA Negeri 2 Purwokerto"
                      style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Akun Instagram */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--warm-alabaster)', marginBottom: '0.45rem' }}>
                    Akun Instagram <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(Opsional)</span>
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span style={{
                      position: 'absolute',
                      left: '0.9rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      pointerEvents: 'none',
                    }}>
                      @
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.instagram}
                      onChange={e => setFormData({ ...formData, instagram: e.target.value.replace(/^@/, '') })}
                      placeholder="alfatih (tanpa @)"
                      style={{ padding: '0.75rem 1rem 0.75rem 2.2rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Card Foto Profil */}
                <div style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(200, 168, 91, 0.16)',
                }}>
                  <ImageUploadField
                    label="Foto Profil Pengurus"
                    value={formData.photo}
                    onChange={val => setFormData({ ...formData, photo: val })}
                    placeholder="Tempel URL foto atau klik Pilih Berkas Foto..."
                    aspectRatioHint="Rasio 1:1 (Pas Foto / Persegi)"
                    tip="Disarankan menggunakan foto resmi atau semi-formal berlatar rapi dengan rasio 1:1."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer-responsive">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                  style={{ minWidth: 100, padding: '0.65rem 1.25rem' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.65rem 1.4rem',
                    fontWeight: 700,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="spin-icon" /> Menyimpan Data...
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Simpan Data Pengurus
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
