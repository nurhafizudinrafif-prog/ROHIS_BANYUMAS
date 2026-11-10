import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Search,
  FileText,
  Presentation,
  File,
  ExternalLink,
  Eye,
} from 'lucide-react';

export default function LibraryManager() {
  const { library = [], updateData, addAuditLog } = useData();
  const { user } = useAuth();

  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Semua');

  const categories = useMemo(() => {
    return [
      'Semua',
      ...new Set((library || []).map((l) => l.category).filter(Boolean)),
    ];
  }, [library]);

  const filtered = useMemo(() => {
    return (library || []).filter((item) => {
      const matchCat = catFilter === 'Semua' || item.category === catFilter;
      const matchSearch =
        !search ||
        (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.size || '').toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [library, catFilter, search]);

  const handleOpenAdd = () => {
    setEditing({
      id: `lib-${Date.now()}`,
      title: '',
      category: 'Kaderisasi',
      fileUrl: '',
      type: 'pdf',
      size: '2.5 MB',
      uploadedAt: new Date().toISOString(),
    });
    setIsNew(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditing({ ...item });
    setIsNew(false);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editing || !editing.title?.trim()) {
      alert('Judul materi wajib diisi!');
      return;
    }
    if (!editing.fileUrl?.trim()) {
      alert('Tautan URL file wajib diisi!');
      return;
    }

    const itemToSave = {
      ...editing,
      title: editing.title.trim(),
      category: editing.category?.trim() || 'Kaderisasi',
      fileUrl: editing.fileUrl.trim(),
      type: (editing.type || 'pdf').toLowerCase(),
      size: editing.size?.trim() || '1.0 MB',
      updatedAt: new Date().toISOString(),
    };

    let updated;
    if (isNew) {
      updated = [itemToSave, ...(library || [])];
    } else {
      updated = (library || []).map((l) =>
        l.id === itemToSave.id ? itemToSave : l
      );
    }

    await updateData('library', updated);
    setModalOpen(false);

    if (addAuditLog && user) {
      addAuditLog(
        user.id,
        user.username,
        isNew ? 'CREATE' : 'UPDATE',
        'library',
        `${isNew ? 'Added' : 'Updated'} materi E-Library: ${itemToSave.title}`
      ).catch(() => {});
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmItem) return;
    const item = deleteConfirmItem;
    const updated = (library || []).filter((l) => l.id !== item.id);
    await updateData('library', updated);
    if (addAuditLog && user) {
      await addAuditLog(
        user.id,
        user.username,
        'DELETE',
        'library',
        `Deleted materi E-Library: ${item.title}`
      );
    }
    setDeleteConfirmItem(null);
    setModalOpen(false);
  };

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', paddingBottom: '3.5rem' }}>
      {/* Header Bar matching Image 03 panel 3 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
            Perpustakaan
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Kelola koleksi dokumen, panduan, dan materi pembinaan.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-pine">
          <Plus size={16} /> Tambah dokumen
        </button>
      </div>

      {/* Filter Row matching Image 03 panel 3 */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input-soft"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Cari dokumen"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select-soft"
          style={{ minWidth: 180, padding: '0.5rem 1rem' }}
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'Semua' ? 'Semua kategori' : c}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Data Table matching Image 03 panel 3 */}
      <div className="admin-desktop-table data-table-container-soft">
        <table className="data-table-soft">
          <thead>
            <tr>
              <th>Judul dokumen</th>
              <th style={{ width: 120 }}>Tipe</th>
              <th style={{ width: '22%' }}>Kategori</th>
              <th style={{ width: 140, textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                {/* Judul Dokumen with File Icon */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(16, 41, 31, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--pine-dark)',
                      flexShrink: 0,
                    }}>
                      <FileText size={17} />
                    </div>
                    <div>
                      <strong style={{ color: 'var(--pine-dark)', fontWeight: 700, display: 'block' }}>
                        {item.title}
                      </strong>
                      {item.size && (
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {item.size}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Tipe Dokumen */}
                <td>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--pine-dark)',
                  }}>
                    {item.type || 'PDF'}
                  </span>
                </td>

                {/* Kategori */}
                <td>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    {item.category || 'Materi'}
                  </span>
                </td>

                {/* Aksi: Lihat & Edit */}
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                    {item.fileUrl && (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary-soft btn-sm"
                        style={{ gap: '0.3rem', padding: '0.35rem 0.65rem' }}
                      >
                        <Eye size={13} /> Lihat
                      </a>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary-soft btn-sm"
                      onClick={() => handleOpenEdit(item)}
                      style={{ gap: '0.3rem', padding: '0.35rem 0.65rem' }}
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  Tidak ada dokumen yang sesuai filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="admin-mobile-cards">
        {filtered.map((item) => (
          <div key={item.id} className="admin-mobile-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 41, 31, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--pine-dark)',
                flexShrink: 0,
              }}>
                <FileText size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--pine-dark)' }}>
                  {item.title}
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {(item.type || 'PDF').toUpperCase()} • {item.category || 'Kaderisasi'} {item.size ? `(${item.size})` : ''}
                </span>
              </div>
            </div>

            <div className="admin-mobile-card-actions">
              {item.fileUrl && (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary-soft btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Eye size={14} /> Lihat
                </a>
              )}
              <button
                type="button"
                className="btn btn-secondary-soft btn-sm"
                onClick={() => handleOpenEdit(item)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Edit3 size={14} /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RESPONSIVE MODAL: EDIT / TAMBAH DOKUMEN
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
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
                    {isNew ? 'Tambah Dokumen Perpustakaan' : 'Edit Dokumen Perpustakaan'}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Koleksi modul, panduan, dan materi kaderisasi ROKABA
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
                <div className="form-group-soft">
                  <label className="form-label-soft">Judul dokumen / materi *</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={editing.title || ''}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder="Contoh: Modul Kaderisasi Pelajar Muslim v2.0"
                    required
                  />
                </div>

                <div className="form-grid-2-soft">
                  <div className="form-group-soft">
                    <label className="form-label-soft">Kategori dokumen *</label>
                    <select
                      className="form-select-soft"
                      value={editing.category || 'Kaderisasi'}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    >
                      <option value="Kaderisasi">Kaderisasi</option>
                      <option value="Panduan">Panduan</option>
                      <option value="Pembinaan">Pembinaan</option>
                      <option value="Ibadah">Ibadah</option>
                      <option value="Manajemen Organisasi">Manajemen Organisasi</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div className="form-grid-2-soft">
                    <div className="form-group-soft">
                      <label className="form-label-soft">Tipe</label>
                      <select
                        className="form-select-soft"
                        value={editing.type || 'pdf'}
                        onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                      >
                        <option value="pdf">PDF</option>
                        <option value="slide">Slide (PPT)</option>
                        <option value="doc">Dokumen (DOC)</option>
                      </select>
                    </div>
                    <div className="form-group-soft">
                      <label className="form-label-soft">Estimasi Ukuran</label>
                      <input
                        type="text"
                        className="form-input-soft"
                        value={editing.size || ''}
                        onChange={(e) => setEditing({ ...editing, size: e.target.value })}
                        placeholder="Contoh: 2.5 MB"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group-soft">
                  <label className="form-label-soft">Tautan Berkas File (URL / Google Drive) *</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={editing.fileUrl || ''}
                    onChange={(e) => setEditing({ ...editing, fileUrl: e.target.value })}
                    placeholder="https://drive.google.com/... atau URL file langsung"
                    required
                  />
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Pastikan tautan Google Drive disetel ke "Siapa saja yang memiliki link dapat melihat".
                  </p>
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div className="modal-footer-responsive">
                <div>
                  {!isNew && (
                    <button
                      type="button"
                      className="btn btn-secondary-soft"
                      style={{ color: '#EF4444' }}
                      onClick={() => setDeleteConfirmItem(editing)}
                    >
                      <Trash2 size={15} /> Hapus dokumen
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
                    <span>{isNew ? 'Tambah dokumen' : 'Simpan perubahan'}</span>
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
                Hapus dokumen?
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
                  {deleteConfirmItem.title}
                </strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Dokumen ini akan dihapus dari katalog E-Library.
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
