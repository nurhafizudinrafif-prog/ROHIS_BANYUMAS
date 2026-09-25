import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  Image as ImageIcon, Plus, Edit3, Trash2, Save, X, Search,
  Video, Calendar, Star, ExternalLink, RefreshCw, Upload, Play
} from 'lucide-react';
import ImageUploadField from '../components/ImageUploadField';
import {
  getDirectImageUrl, isVideoMedia, getMediaThumbnail,
  normalizeMediaList, getMediaSummary, getCoverMedia
} from '../utils/media';

export default function GalleryManager() {
  const { gallery, updateData, addAuditLog } = useData();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);

  // Form State for Album
  const [albumForm, setAlbumForm] = useState({
    title: '',
    category: 'Kajian',
    date: '',
    description: '',
    emoji: '📸',
    coverImage: '',
    media: [],
  });

  // Working state for adding new media item to album
  const [newMedia, setNewMedia] = useState({
    type: 'image',
    url: '',
    caption: '',
  });

  const categories = ['Semua', 'Kajian', 'Pelatihan', 'Sosial', 'Organisasi', 'Lomba', 'Workshop', 'Dokumentasi'];

  const filteredAlbums = useMemo(() => {
    return (gallery || []).filter(album => {
      const matchCat = catFilter === 'Semua' || album.category === catFilter;
      const matchSearch = (album.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (album.description || '').toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [gallery, catFilter, search]);

  const handleOpenAdd = () => {
    setEditingAlbum(null);
    setAlbumForm({
      title: '',
      category: 'Kajian',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: '',
      emoji: '📸',
      coverImage: '',
      media: [],
    });
    setNewMedia({ type: 'image', url: '', caption: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (album) => {
    setEditingAlbum(album);
    const normalized = normalizeMediaList(album);
    setAlbumForm({
      title: album.title || '',
      category: album.category || 'Dokumentasi',
      date: album.date || '',
      description: album.description || '',
      emoji: album.emoji || '📸',
      coverImage: album.coverImage || album.image || '',
      media: normalized,
    });
    setNewMedia({ type: 'image', url: '', caption: '' });
    setModalOpen(true);
  };

  const handleDeleteAlbum = async (album) => {
    if (!window.confirm(`Yakin ingin menghapus album "${album.title}" beserta seluruh foto/videonya?`)) return;
    const updated = (gallery || []).filter(a => a.id !== album.id);
    await updateData('gallery', updated);
    await addAuditLog(user.id, user.username, 'DELETE', 'gallery', `Deleted gallery album: ${album.title}`);
  };

  // Media list helpers in modal
  const handleAddMediaItem = () => {
    if (!newMedia.url.trim()) return;
    const item = {
      id: `m-${Date.now()}`,
      type: newMedia.type,
      url: newMedia.url.trim(),
      caption: newMedia.caption.trim() || albumForm.title,
    };

    setAlbumForm(prev => {
      const updatedMedia = [...prev.media, item];
      return {
        ...prev,
        media: updatedMedia,
        coverImage: prev.coverImage || item.url, // auto set first as cover if none
      };
    });

    setNewMedia({ type: 'image', url: '', caption: '' });
  };

  const handleRemoveMediaItem = (idx) => {
    setAlbumForm(prev => {
      const updated = prev.media.filter((_, i) => i !== idx);
      return { ...prev, media: updated };
    });
  };

  const handleSetCover = (url) => {
    setAlbumForm(prev => ({ ...prev, coverImage: url }));
  };

  const handleSaveAlbum = async (e) => {
    e.preventDefault();
    if (!albumForm.title.trim()) return;

    const payload = {
      id: editingAlbum ? editingAlbum.id : `gal-${Date.now()}`,
      title: albumForm.title.trim(),
      category: albumForm.category,
      date: albumForm.date.trim(),
      description: albumForm.description.trim(),
      emoji: albumForm.emoji.trim() || '📸',
      coverImage: albumForm.coverImage || (albumForm.media[0]?.url || ''),
      image: albumForm.coverImage || (albumForm.media[0]?.url || ''),
      media: albumForm.media,
    };

    let updatedList;
    if (editingAlbum) {
      updatedList = (gallery || []).map(a => a.id === editingAlbum.id ? payload : a);
    } else {
      updatedList = [payload, ...(gallery || [])];
    }

    await updateData('gallery', updatedList);
    await addAuditLog(
      user.id,
      user.username,
      editingAlbum ? 'UPDATE' : 'CREATE',
      'gallery',
      `${editingAlbum ? 'Updated' : 'Created'} gallery album: ${payload.title} (${payload.media.length} media)`
    );

    setModalOpen(false);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ImageIcon size={26} color="var(--emerald)" /> Kelola Galeri & Dokumentasi Kegiatan
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Kelola album foto dan video dokumentasi kegiatan, kajian akbar, pelatihan, dan bakti sosial ROHIS Banyumas.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={16} /> Buat Album Baru
        </button>
      </div>

      {/* Filter Categories */}
      <div style={{
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
        {categories.map(cat => (
          <button
            key={cat}
            className={`btn ${catFilter === cat ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            onClick={() => setCatFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
          <Search size={18} />
        </span>
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '2.75rem' }}
          placeholder="Cari album dokumentasi kegiatan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Albums Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))',
        gap: '1.25rem',
      }}>
        {filteredAlbums.map(album => {
          const summary = getMediaSummary(album);
          const cover = getCoverMedia(album);

          return (
            <div
              key={album.id}
              className="glass-card"
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Cover Image */}
                <div style={{ height: 180, position: 'relative', background: '#05080E', overflow: 'hidden' }}>
                  {cover ? (
                    <img
                      src={cover}
                      alt={album.title}
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <ImageIcon size={32} />
                    </div>
                  )}

                  {/* Top Badges */}
                  <div style={{
                    position: 'absolute', top: '0.75rem', left: '0.75rem', right: '0.75rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'var(--emerald-light)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      backdropFilter: 'blur(4px)',
                    }}>
                      {album.category}
                    </span>

                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      background: 'rgba(0, 0, 0, 0.75)',
                      color: '#FFFFFF',
                      backdropFilter: 'blur(4px)',
                    }}>
                      {summary.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    <Calendar size={13} />
                    <span>{album.date}</span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.5rem' }}>
                    {album.title}
                  </h3>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {album.description || 'Tidak ada deskripsi.'}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{
                padding: '0.85rem 1.25rem',
                borderTop: '1px solid var(--border-glass)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.15)',
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ID: #{album.id}
                </span>

                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  <button
                    onClick={() => handleOpenEdit(album)}
                    className="btn btn-outline btn-xs"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Edit3 size={13} /> Kelola Media
                  </button>
                  <button
                    onClick={() => handleDeleteAlbum(album)}
                    className="btn btn-danger-ghost btn-xs"
                    title="Hapus Album"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAlbums.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Tidak ada album galeri yang cocok dengan pencarian / kategori ini.
        </div>
      )}

      {/* Modal Add / Edit Album */}
      {modalOpen && (
        <div className="modal-overlay-responsive">
          <div className="glass-card modal-card-responsive" style={{
            maxWidth: 720,
            padding: '1.75rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                {editingAlbum ? 'Kelola Album Dokumentasi' : 'Buat Album Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="btn btn-outline btn-xs">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAlbum}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Judul Album / Kegiatan</label>
                  <input
                    type="text"
                    className="form-input"
                    value={albumForm.title}
                    onChange={e => setAlbumForm({ ...albumForm, title: e.target.value })}
                    placeholder="Contoh: Kajian Ahad Pagi Akbar 2026"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <select
                    className="form-input"
                    value={albumForm.category}
                    onChange={e => setAlbumForm({ ...albumForm, category: e.target.value })}
                  >
                    {categories.filter(c => c !== 'Semua').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tanggal Pelaksanaan</label>
                  <input
                    type="text"
                    className="form-input"
                    value={albumForm.date}
                    onChange={e => setAlbumForm({ ...albumForm, date: e.target.value })}
                    placeholder="Contoh: 16 Februari 2026"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Emoji Ikon</label>
                  <input
                    type="text"
                    className="form-input"
                    value={albumForm.emoji}
                    onChange={e => setAlbumForm({ ...albumForm, emoji: e.target.value })}
                    placeholder="📸"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Deskripsi Album</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: 70 }}
                  value={albumForm.description}
                  onChange={e => setAlbumForm({ ...albumForm, description: e.target.value })}
                  placeholder="Ceritakan rangkuman kegiatan dakwah atau keseruan acara ini..."
                />
              </div>

              <ImageUploadField
                label="Foto Sampul (Cover Image)"
                value={albumForm.coverImage}
                onChange={val => setAlbumForm({ ...albumForm, coverImage: val })}
                placeholder="Tempel link foto atau klik Pilih Berkas Foto..."
                aspectRatioHint="Landscape 16:9 disarankan"
              />

              {/* ═══ Multi-Media Album Manager ═══ */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginTop: '1.5rem',
                marginBottom: '1.5rem',
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--emerald)', marginBottom: '0.35rem' }}>
                  Isi Media Dalam Album ({albumForm.media.length} Media)
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Tambahkan foto atau tautan video (YouTube, Instagram Reel, Google Drive) ke dalam album ini.
                </p>

                {/* Form Add New Media Item */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <select
                    className="form-input"
                    value={newMedia.type}
                    onChange={e => setNewMedia({ ...newMedia, type: e.target.value })}
                    style={{ width: '120px', flexShrink: 0 }}
                  >
                    <option value="image">📷 Foto</option>
                    <option value="video">🎥 Video</option>
                  </select>

                  <input
                    type="text"
                    className="form-input"
                    value={newMedia.url}
                    onChange={e => setNewMedia({ ...newMedia, url: e.target.value })}
                    placeholder="URL Media (Google Drive, YouTube, Web URL, dll)..."
                    style={{ flex: '1 1 200px', minWidth: 0 }}
                  />

                  <button
                    type="button"
                    onClick={handleAddMediaItem}
                    className="btn btn-primary"
                    style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    <Plus size={15} /> Tambah
                  </button>
                </div>

                {/* Media Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: 240, overflowY: 'auto' }}>
                  {albumForm.media.map((m, idx) => {
                    const isCover = albumForm.coverImage === m.url;
                    const thumb = getMediaThumbnail(m);

                    return (
                      <div
                        key={m.id || idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          flexWrap: 'wrap',
                          background: isCover ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)',
                          border: isCover ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-glass)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        <div style={{ width: 44, height: 34, borderRadius: 4, overflow: 'hidden', background: '#000', flexShrink: 0 }}>
                          {thumb ? (
                            <img src={thumb} alt="thumb" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                              {m.type === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
                            </div>
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {m.type === 'video' ? '🎥 Video' : '📷 Foto'}: {m.url}
                          </div>
                          {isCover && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--emerald)', fontWeight: 700 }}>
                              ★ Sampul Utama Album
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetCover(m.url)}
                              className="btn btn-outline btn-xs"
                              title="Jadikan Gambar Sampul Album"
                            >
                              <Star size={12} /> Set Sampul
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveMediaItem(idx)}
                            className="btn btn-danger-ghost btn-xs"
                            title="Hapus media dari album"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Simpan Seluruh Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
