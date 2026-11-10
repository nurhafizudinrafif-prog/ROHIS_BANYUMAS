import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  Image as ImageIcon,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Search,
  Video,
  ExternalLink,
  Film,
  Calendar,
} from 'lucide-react';
import ImageUploadField from '../components/ImageUploadField';
import {
  getDirectImageUrl,
  isVideoMedia,
  normalizeMediaList,
  getMediaSummary,
  getCoverMedia,
} from '../utils/media';

export default function GalleryManager() {
  const { gallery, updateData, addAuditLog } = useData();
  const { user } = useAuth();

  const [mediaTypeTab, setMediaTypeTab] = useState('Foto'); // 'Foto' | 'Video' | 'Semua'
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);

  // Form State for Album / Media Item
  const [albumForm, setAlbumForm] = useState({
    title: '',
    category: 'Dokumentasi',
    date: '',
    description: '',
    type: 'Foto', // 'Foto' | 'Video'
    coverImage: '',
    media: [],
  });

  const filteredAlbums = useMemo(() => {
    return (gallery || []).filter((album) => {
      // Determine if album is video or photo based on its media or type property
      const hasVideo =
        album.type === 'video' ||
        album.media?.some((m) => isVideoMedia(m.url) || m.type === 'video');
      const matchesType =
        mediaTypeTab === 'Semua'
          ? true
          : mediaTypeTab === 'Video'
          ? hasVideo
          : !hasVideo;

      const matchesSearch =
        (album.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (album.description || '').toLowerCase().includes(search.toLowerCase()) ||
        (album.category || '').toLowerCase().includes(search.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [gallery, mediaTypeTab, search]);

  const handleOpenAdd = () => {
    setEditingAlbum(null);
    setAlbumForm({
      title: '',
      category: 'Dokumentasi',
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      description: '',
      type: mediaTypeTab === 'Video' ? 'Video' : 'Foto',
      coverImage: '',
      media: [],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (album) => {
    setEditingAlbum(album);
    const normalized = normalizeMediaList(album);
    const isVid =
      album.type === 'video' ||
      album.media?.some((m) => isVideoMedia(m.url) || m.type === 'video');

    setAlbumForm({
      title: album.title || '',
      category: album.category || 'Dokumentasi',
      date: album.date || '',
      description: album.description || '',
      type: isVid ? 'Video' : 'Foto',
      coverImage: album.coverImage || album.image || '',
      media: normalized,
    });
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmItem) return;
    const album = deleteConfirmItem;
    const updated = (gallery || []).filter((a) => a.id !== album.id);
    await updateData('gallery', updated);
    if (addAuditLog && user) {
      await addAuditLog(
        user.id,
        user.username,
        'DELETE',
        'gallery',
        `Deleted gallery media: ${album.title}`
      );
    }
    setDeleteConfirmItem(null);
    setModalOpen(false);
  };

  const handleSaveAlbum = async (e) => {
    e.preventDefault();
    if (!albumForm.title.trim()) {
      alert('Judul media wajib diisi!');
      return;
    }

    const payload = {
      id: editingAlbum ? editingAlbum.id : `gal-${Date.now()}`,
      title: albumForm.title.trim(),
      category: albumForm.category || 'Dokumentasi',
      date: albumForm.date.trim(),
      description: albumForm.description.trim(),
      type: albumForm.type.toLowerCase(),
      coverImage: albumForm.coverImage || '',
      image: albumForm.coverImage || '',
      media:
        albumForm.media.length > 0
          ? albumForm.media
          : albumForm.coverImage
          ? [{ url: albumForm.coverImage, type: albumForm.type.toLowerCase(), caption: albumForm.title }]
          : [],
    };

    let updatedList;
    if (editingAlbum) {
      updatedList = (gallery || []).map((a) => (a.id === editingAlbum.id ? payload : a));
    } else {
      updatedList = [payload, ...(gallery || [])];
    }

    await updateData('gallery', updatedList);
    setModalOpen(false);

    try {
      if (addAuditLog && user) {
        addAuditLog(
          user.id,
          user.username,
          editingAlbum ? 'UPDATE' : 'CREATE',
          'gallery',
          `${editingAlbum ? 'Updated' : 'Created'} gallery media: ${payload.title}`
        ).catch(() => {});
      }
    } catch {}
  };

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', paddingBottom: '3.5rem' }}>
      {/* Header Bar matching Image 02 panel 4 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
            Galeri
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Kelola dokumentasi foto dan video kegiatan ROHIS.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-pine">
          <Plus size={16} /> Tambah media
        </button>
      </div>

      {/* Filter Row: Foto / Video tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--surface-bg)', padding: '0.25rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--soft-shadow-sm)' }}>
          {['Foto', 'Video', 'Semua'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`btn btn-sm ${mediaTypeTab === tab ? 'btn-pine' : 'btn-secondary-soft'}`}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 1rem',
                border: mediaTypeTab === tab ? 'none' : 'transparent',
                boxShadow: mediaTypeTab === tab ? '0 2px 6px rgba(16, 41, 31, 0.2)' : 'none',
              }}
              onClick={() => setMediaTypeTab(tab)}
            >
              {tab === 'Video' ? <Film size={13} style={{ marginRight: 4 }} /> : null}
              {tab}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input-soft"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Cari media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Gallery Media Grid matching Image 02 panel 4 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem',
      }}>
        {filteredAlbums.map((album) => {
          const cover = getCoverMedia(album);
          const isVid =
            album.type === 'video' ||
            album.media?.some((m) => isVideoMedia(m.url) || m.type === 'video');

          return (
            <div
              key={album.id}
              className="admin-soft-card"
              style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div>
                {/* Thumbnail Preview with Soft Rounded Border */}
                <div style={{
                  height: 180,
                  width: '100%',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 41, 31, 0.05)',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '0.85rem',
                  border: '1px solid var(--border-subtle)',
                }}>
                  {cover ? (
                    <img
                      src={getDirectImageUrl(cover)}
                      alt={album.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}>
                      {isVid ? <Film size={32} /> : <ImageIcon size={32} />}
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Tidak ada preview</span>
                    </div>
                  )}

                  {/* Badge Type */}
                  <span style={{
                    position: 'absolute',
                    top: '0.5rem',
                    left: '0.5rem',
                    background: 'rgba(7, 20, 14, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    {isVid ? '.mp4' : '.jpg'}
                  </span>
                </div>

                {/* Title and Category */}
                <h3 style={{
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: 'var(--pine-dark)',
                  marginBottom: '0.25rem',
                  lineHeight: 1.35,
                }}>
                  {album.title || 'Dokumentasi kegiatan'}
                </h3>
                <div style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginBottom: '0.75rem',
                }}>
                  <span>{album.category || 'Dokumentasi'}</span>
                  {album.date && (
                    <>
                      <span>•</span>
                      <span>{album.date}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action row with Edit button matching Image 02 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {isVid ? 'Video' : 'Foto'}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary-soft btn-sm"
                  onClick={() => handleOpenEdit(album)}
                  style={{ gap: '0.4rem', padding: '0.35rem 0.85rem' }}
                >
                  <Edit3 size={13} /> Edit
                </button>
              </div>
            </div>
          );
        })}

        {filteredAlbums.length === 0 && (
          <div className="admin-soft-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
            <ImageIcon size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--pine-dark)' }}>Tidak ada media ditemukan</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Klik tombol Tambah Media untuk menambahkan foto atau video baru.</p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RESPONSIVE MODAL: EDIT / TAMBAH MEDIA
          ═══════════════════════════════════════════════════════════════ */}
      {modalOpen && (
        <div className="modal-backdrop-responsive" onClick={() => setModalOpen(false)}>
          <div
            className="modal-dialog-responsive"
            style={{ maxWidth: 760 }}
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
                  {albumForm.type === 'Video' ? <Film size={18} /> : <ImageIcon size={18} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
                    {editingAlbum ? 'Edit Media Galeri' : 'Tambah Media Baru'}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Dokumentasi kegiatan dan arsip resmi ROHIS
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
            <form onSubmit={handleSaveAlbum}>
              <div className="modal-body-responsive">
                <div className="form-grid-2-soft">
                  <div className="form-group-soft">
                    <label className="form-label-soft">Judul media / kegiatan *</label>
                    <input
                      type="text"
                      className="form-input-soft"
                      value={albumForm.title}
                      onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                      placeholder="Contoh: Silaturahmi Pengurus ROHIS"
                      required
                    />
                  </div>
                  <div className="form-group-soft">
                    <label className="form-label-soft">Kategori</label>
                    <select
                      className="form-select-soft"
                      value={albumForm.category}
                      onChange={(e) => setAlbumForm({ ...albumForm, category: e.target.value })}
                    >
                      <option value="Dokumentasi">Dokumentasi</option>
                      <option value="Kajian">Kajian</option>
                      <option value="Pelatihan">Pelatihan</option>
                      <option value="Sosial">Sosial</option>
                      <option value="Organisasi">Organisasi</option>
                      <option value="Lomba">Lomba</option>
                      <option value="Workshop">Workshop</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2-soft">
                  <div className="form-group-soft">
                    <label className="form-label-soft">Tipe Media</label>
                    <select
                      className="form-select-soft"
                      value={albumForm.type}
                      onChange={(e) => setAlbumForm({ ...albumForm, type: e.target.value })}
                    >
                      <option value="Foto">Foto</option>
                      <option value="Video">Video</option>
                    </select>
                  </div>
                  <div className="form-group-soft">
                    <label className="form-label-soft">Tanggal Pelaksanaan</label>
                    <input
                      type="text"
                      className="form-input-soft"
                      value={albumForm.date}
                      onChange={(e) => setAlbumForm({ ...albumForm, date: e.target.value })}
                      placeholder="Contoh: 12 Januari 2025"
                    />
                  </div>
                </div>

                <div className="form-group-soft">
                  <label className="form-label-soft">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    className="form-textarea-soft"
                    value={albumForm.description}
                    onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                    placeholder="Keterangan singkat mengenai dokumentasi kegiatan ini..."
                  />
                </div>

                {/* Cover File Upload */}
                <div style={{ marginTop: '0.5rem' }}>
                  <ImageUploadField
                    label={albumForm.type === 'Video' ? 'Foto Sampul Video (Thumbnail)' : 'Foto Utama'}
                    value={albumForm.coverImage}
                    onChange={(val) => setAlbumForm({ ...albumForm, coverImage: val })}
                    placeholder="Upload file atau tempel link Google Drive/URL..."
                  />
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div className="modal-footer-responsive">
                <div>
                  {editingAlbum && (
                    <button
                      type="button"
                      className="btn btn-secondary-soft"
                      style={{ color: '#EF4444' }}
                      onClick={() => setDeleteConfirmItem(editingAlbum)}
                    >
                      <Trash2 size={15} /> Hapus media
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
                    <span>{editingAlbum ? 'Simpan perubahan' : 'Tambah media'}</span>
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
                Hapus konten?
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
                  Media ini akan dihapus secara permanen. Pastikan Anda sudah memeriksanya.
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
