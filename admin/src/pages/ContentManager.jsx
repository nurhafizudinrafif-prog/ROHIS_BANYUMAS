import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit3, Trash2, Save, X, Search, Sparkles, Video as VideoIcon, Image as ImageIcon, ExternalLink, HelpCircle, FileText, Calendar, MapPin, School, Phone, Users, Clock } from 'lucide-react';
import { parseMediaItem } from '@shared/services/mediaHelper.js';
import { getDirectImageUrl, extractGoogleDriveId } from '../utils/media';
import AdminHomeCMS from '../components/AdminHomeCMS';
import ImageUploadField from '../components/ImageUploadField';

const schemas = {
  articles: {
    label: 'Artikel',
    fields: [
      { key: 'title', label: 'Judul', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'category', label: 'Kategori', type: 'select', options: ['Edukasi', 'Dakwah', 'Ibadah', 'Motivasi', 'Akhlak'] },
      { key: 'author', label: 'Penulis', type: 'text' },
      { key: 'content', label: 'Konten (HTML)', type: 'textarea' },
      { key: 'image', label: 'URL Gambar', type: 'text' },
    ],
    defaults: { id: '', title: '', slug: '', content: '', author: 'ROKABA', category: 'Edukasi', image: '', publishedAt: '', updatedAt: '' },
  },
  events: {
    label: 'Agenda',
    fields: [
      { key: 'title', label: 'Judul Kegiatan', type: 'text', required: true },
      { key: 'date', label: 'Tanggal', type: 'date', required: true },
      { key: 'time', label: 'Jam', type: 'text' },
      { key: 'location', label: 'Lokasi', type: 'text' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'select', options: ['upcoming', 'completed'] },
    ],
    defaults: { id: '', title: '', date: '', time: '08:00', location: '', description: '', status: 'upcoming' },
  },
  schools: {
    label: 'Sekolah',
    fields: [
      { key: 'name', label: 'Nama Sekolah', type: 'text', required: true },
      { key: 'type', label: 'Jenis', type: 'select', options: ['SMA', 'SMK', 'MA'] },
      { key: 'pembina', label: 'Pembina', type: 'text' },
      { key: 'contact', label: 'Kontak', type: 'text' },
      { key: 'address', label: 'Alamat', type: 'text' },
      { key: 'memberCount', label: 'Jumlah Anggota', type: 'number' },
    ],
    defaults: { id: '', name: '', type: 'SMA', pembina: '', contact: '', address: '', memberCount: 0, editorId: null },
  },
  gallery: {
    label: 'Galeri Media (Foto & Video)',
    fields: [
      { key: 'title', label: 'Judul Dokumentasi', type: 'text', required: true },
      { key: 'mediaType', label: 'Tipe Media', type: 'select', options: ['image', 'video'], required: true },
      { key: 'driveId', label: 'Link Media (Google Drive, TikTok, Instagram, YouTube, URL)', type: 'text', required: true },
      { key: 'thumbnail', label: 'URL Custom Cover/Thumbnail (Opsional)', type: 'text' },
      { key: 'category', label: 'Kategori', type: 'select', options: ['Kajian', 'Pelatihan', 'Sosial', 'Organisasi', 'Lomba', 'Dokumentasi', 'Video'] },
      { key: 'date', label: 'Tanggal', type: 'date' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
    ],
    defaults: { id: '', title: '', mediaType: 'image', driveId: '', thumbnail: '', category: 'Dokumentasi', date: '', description: '' },
  },
  team: {
    label: 'Tim Pengurus',
    fields: [
      { key: 'name', label: 'Nama', type: 'text', required: true },
      { key: 'position', label: 'Jabatan', type: 'text', required: true },
      { key: 'division', label: 'Divisi', type: 'select', options: [
        'BPH',
        'Divisi SDM (Sumber Daya Manusia)',
        'Divisi Dakwah',
        'Divisi HUMAS (Hubungan Masyarakat)',
        'Divisi Jurnalistik',
        'Divisi DANUS (Dana Usaha)'
      ], required: true },
      { key: 'school', label: 'Asal Sekolah', type: 'text' },
      { key: 'instagram', label: 'Username IG (tanpa @)', type: 'text' },
      { key: 'photo', label: 'URL Foto', type: 'text' },
      { key: 'period', label: 'Periode', type: 'text' },
    ],
    defaults: { id: '', name: '', position: '', division: 'BPH', school: '', instagram: '', photo: '', period: '2025/2026' },
  },
  home: {
    label: 'Home Editor',
    isSingle: true,
    fields: [
      { key: 'hero_title', label: 'Hero Title', type: 'text' },
      { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
      { key: 'welcome_msg', label: 'Welcome Message', type: 'textarea' },
    ],
  },
};

export default function ContentManager() {
  const { type } = useParams();
  const dataCtx = useData();
  const { user } = useAuth();
  const schema = schemas[type];

  const items = type === 'home' ? null : (dataCtx[type] || []);
  const homeData = type === 'home' ? (dataCtx.home || {}) : null;

  const [editing, setEditing] = useState(null); // null or item object
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState('');
  const [homeForm, setHomeForm] = useState(homeData || {});

  // Sync homeForm when data loads
  useMemo(() => { if (type === 'home' && dataCtx.home) setHomeForm(dataCtx.home); }, [type, dataCtx.home]);

  if (!schema) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Tipe konten tidak ditemukan.</div>;

  // ═══ HOME EDITOR (Full Visual Section Editor) ═══
  if (type === 'home') {
    return (
      <AdminHomeCMS
        homeContent={dataCtx.home}
        programs={dataCtx.programs}
        onSaveHomeContent={async (newHome) => {
          await dataCtx.updateData('home', newHome);
          await dataCtx.addAuditLog(user.id, user.username, 'UPDATE', 'home', 'Updated home page content');
        }}
        onSaveProgram={async (pId, newProg) => {
          const currentPrograms = dataCtx.programs || [];
          const updated = currentPrograms.map(p => p.id === pId ? newProg : p);
          await dataCtx.updateData('programs', updated);
        }}
      />
    );
  }

  // ═══ LIST CRUD ═══
  const filtered = items.filter(item => {
    const text = JSON.stringify(item).toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const handleNew = () => {
    const newItem = { ...schema.defaults, id: `${type.slice(0, 3)}-${Date.now()}` };
    if (type === 'articles') {
      newItem.publishedAt = new Date().toISOString();
      newItem.updatedAt = new Date().toISOString();
    }
    setEditing(newItem);
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    let updated;
    if (isNew) {
      updated = [...items, editing];
    } else {
      updated = items.map(i => i.id === editing.id ? editing : i);
    }
    await dataCtx.updateData(type, updated);
    setEditing(null);
    setIsNew(false);

    try {
      if (dataCtx.addAuditLog) {
        dataCtx.addAuditLog(user?.id || 'admin', user?.username || 'admin', isNew ? 'CREATE' : 'UPDATE', type, `${isNew ? 'Created' : 'Updated'} ${type}: ${editing.title || editing.name || editing.id}`).catch(() => {});
      }
    } catch {}
  };

  const handleDelete = async (item) => {
    if (!confirm(`Hapus "${item.title || item.name}"?`)) return;
    const updated = items.filter(i => i.id !== item.id);
    await dataCtx.updateData(type, updated);
    try {
      if (dataCtx.addAuditLog) {
        dataCtx.addAuditLog(user?.id || 'admin', user?.username || 'admin', 'DELETE', type, `Deleted ${type}: ${item.title || item.name}`).catch(() => {});
      }
    } catch {}
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 800 }}>Kelola {schema.label}</h1>
        <button onClick={handleNew} className="btn btn-primary"><Plus size={16} /> Tambah {schema.label}</button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" className="form-input" placeholder={`Cari ${schema.label.toLowerCase()}...`}
          style={{ paddingLeft: '2.5rem', maxWidth: 400, width: '100%' }} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="modal-overlay-responsive" onClick={(e) => { if (e.target === e.currentTarget) { setEditing(null); setIsNew(false); } }}>
          <div className="glass-card modal-card-responsive animate-fade-in-up" style={{ maxWidth: 600 }}>
            {/* Modal Header */}
            <div className="modal-header-responsive">
              <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>{isNew ? 'Tambah' : 'Edit'} {schema.label}</h2>
              <button
                type="button"
                onClick={() => { setEditing(null); setIsNew(false); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                aria-label="Tutup Modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="modal-body-responsive">
            {schema.fields.map(f => {
              if (f.key === 'image' || f.key === 'coverImage') {
                return (
                  <ImageUploadField
                    key={f.key}
                    label={f.label}
                    required={f.required}
                    value={editing[f.key] || ''}
                    onChange={val => setEditing({ ...editing, [f.key]: val })}
                    placeholder="Tempel URL gambar atau klik Pilih Berkas Foto..."
                  />
                );
              }

              return (
              <div className="form-group" key={f.key}>
                <label className="form-label">{f.label} {f.required && <span style={{ color: '#F87171' }}>*</span>}</label>
                {f.type === 'textarea' ? (
                  <textarea className="form-input" value={editing[f.key] || ''} onChange={e => setEditing({ ...editing, [f.key]: e.target.value })} />
                ) : f.type === 'select' ? (
                  <select className="form-input" value={editing[f.key] || ''} onChange={e => setEditing({ ...editing, [f.key]: e.target.value })}>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type || 'text'}
                    className="form-input"
                    value={editing[f.key] || ''}
                    placeholder={type === 'gallery' && f.key === 'driveId' ? 'Tempel link Google Drive / YouTube / TikTok / Instagram / URL...' : ''}
                    onChange={e => {
                      const val = f.type === 'number' ? Number(e.target.value) : e.target.value;
                      // Auto-detect video type if URL indicates video
                      const next = { ...editing, [f.key]: val };
                      if (type === 'gallery' && f.key === 'driveId' && typeof val === 'string') {
    const isVid = val.includes('.mp4') || val.includes('.mov') || val.includes('youtube') || val.includes('youtu.be') || val.includes('tiktok') || val.includes('instagram.com/reel') || val.includes('instagram.com/p');
    if (isVid) next.mediaType = 'video';
  }
  setEditing(next);
                    }}
                  />
                )}

                {/* Helpful instructions for Google Drive, TikTok, IG, YouTube */}
  {type === 'gallery' && f.key === 'driveId' && (
    <div style={{
      marginTop: '0.45rem',
      padding: '0.75rem 0.9rem',
      borderRadius: 'var(--radius-sm)',
      background: 'rgba(16, 185, 129, 0.08)',
      border: '1px solid rgba(16, 185, 129, 0.25)',
      fontSize: '0.76rem',
      color: 'var(--warm-alabaster)',
      lineHeight: 1.5,
    }}>
      <div style={{ fontWeight: 700, marginBottom: '0.35rem', color: 'var(--emerald)' }}>
        💡 Format Link Media yang Didukung:
      </div>
      <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <li><strong>Google Drive (Foto / Video):</strong> Copy link bagikan Drive. <span style={{ color: '#FBBF24', fontWeight: 600 }}>(Wajib diatur ke: "Siapa saja yang memiliki link")</span></li>
        <li><strong>TikTok:</strong> Link video TikTok (contoh: <code>https://www.tiktok.com/@user/video/...</code> atau <code>vt.tiktok.com/...</code>)</li>
        <li><strong>Instagram:</strong> Link Reels atau Post IG (contoh: <code>https://www.instagram.com/reel/...</code>)</li>
        <li><strong>YouTube:</strong> Link video atau Shorts (contoh: <code>https://youtu.be/...</code>)</li>
      </ul>
    </div>
  )}
              </div>
              );
            })}

            {/* Live Media Preview for Gallery */}
  {type === 'gallery' && (editing.driveId || editing.thumbnail) && (() => {
    const media = parseMediaItem(editing);
    const isTikTok = media.source === 'tiktok';
    const isIG = media.source === 'instagram';
    return (
      <div style={{
        marginTop: '1.25rem',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--emerald)',
          marginBottom: '0.6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.4rem',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} /> Live Preview: {media.platformName} ({media.mediaType === 'video' ? 'Video Player' : 'Foto'})
          </span>
          {media.directUrl && (
            <a href={media.directUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--antique-brass-light)', fontSize: '0.74rem', textDecoration: 'underline' }}>
              Buka Link Asli ↗
            </a>
          )}
        </div>

        {media.mediaType === 'video' ? (
          <div style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            background: '#000',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            padding: isTikTok || isIG ? '0.75rem' : 0,
          }}>
            <iframe
              src={media.embedUrl}
              title="Preview Video"
              allow="autoplay; fullscreen"
              allowFullScreen
              style={isTikTok || isIG ? {
                width: '100%',
                maxWidth: 320,
                height: 420,
                border: 'none',
                borderRadius: 8,
                background: 'white',
              } : {
                width: '100%',
                height: 240,
                border: 'none',
              }}
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', background: '#051410', borderRadius: 'var(--radius-sm)', padding: '0.5rem', position: 'relative' }}>
            <img
              src={media.thumbnailUrl}
              alt="Preview"
              referrerPolicy="no-referrer"
              style={{
                maxHeight: 220,
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: 'var(--radius-sm)',
              }}
              onError={(e) => {
                const cur = e.currentTarget.src;
                if (media.fallbackThumbnailUrl && cur !== media.fallbackThumbnailUrl) {
                  e.currentTarget.src = media.fallbackThumbnailUrl;
                } else if (media.tertiaryThumbnailUrl && cur !== media.tertiaryThumbnailUrl) {
                  e.currentTarget.src = media.tertiaryThumbnailUrl;
                }
              }}
            />
          </div>
        )}
      </div>
    );
  })()}
            </div>

            {/* Modal Sticky Footer */}
            <div className="modal-footer-responsive">
              <button
                type="button"
                onClick={handleSave}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.75rem 1rem', fontWeight: 700, fontSize: '0.95rem' }}
              >
                <Save size={18} /> Simpan {schema.label}
              </button>
              <button
                type="button"
                onClick={() => { setEditing(null); setIsNew(false); }}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.25rem' }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Data Table */}
      <div className="admin-desktop-table glass-card table-responsive">
        <table className="data-table" style={{ minWidth: type === 'gallery' ? 640 : (type === 'articles' ? 680 : 540) }}>
          <thead>
            {type === 'gallery' ? (
              <tr>
                <th style={{ width: 40, textAlign: 'center' }}>#</th>
                <th style={{ width: 80 }}>Preview</th>
                <th>Judul Dokumentasi</th>
                <th style={{ width: 90 }}>Tipe</th>
                <th style={{ width: 110 }}>Kategori</th>
                <th style={{ width: 110 }}>Tanggal</th>
                <th style={{ textAlign: 'right', width: 100 }}>Aksi</th>
              </tr>
            ) : type === 'articles' ? (
              <tr>
                <th style={{ width: 40, textAlign: 'center' }}>#</th>
                <th style={{ width: 80 }}>Sampul Foto</th>
                <th>Judul Artikel</th>
                <th style={{ width: 110 }}>Kategori</th>
                <th style={{ width: 130 }}>Penulis</th>
                <th style={{ width: 120 }}>Tanggal Terbit</th>
                <th style={{ textAlign: 'right', width: 100 }}>Aksi</th>
              </tr>
            ) : (
              <tr>
                <th style={{ width: 40, textAlign: 'center' }}>#</th>
                {schema.fields.filter(f => f.type !== 'textarea').slice(0, 4).map(f => <th key={f.key}>{f.label}</th>)}
                <th style={{ textAlign: 'right', width: 100 }}>Aksi</th>
              </tr>
            )}
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map((item, i) => {
              if (type === 'gallery') {
                const media = parseMediaItem(item);
                const isVideo = media.mediaType === 'video';
                return (
                  <tr key={item.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center' }}>{i + 1}</td>
                    <td style={{ width: 80 }}>
                      <div style={{
                        width: 64,
                        height: 44,
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        background: '#0D2B22',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {media.thumbnailUrl ? (
                          <img
                            src={media.thumbnailUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              const cur = e.currentTarget.src;
                              if (media.fallbackThumbnailUrl && cur !== media.fallbackThumbnailUrl) {
                                e.currentTarget.src = media.fallbackThumbnailUrl;
                              } else if (media.tertiaryThumbnailUrl && cur !== media.tertiaryThumbnailUrl) {
                                e.currentTarget.src = media.tertiaryThumbnailUrl;
                              } else {
                                e.currentTarget.style.display = 'none';
                              }
                            }}
                          />
                        ) : (
                          isVideo ? <VideoIcon size={20} color="var(--emerald)" /> : <ImageIcon size={20} color="var(--antique-brass)" />
                        )}
                        {isVideo && (
                          <span style={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            background: 'rgba(0,0,0,0.75)',
                            color: '#34D399',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            padding: '1px 3px',
                            borderRadius: 3,
                          }}>
                            ▶
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 240 }}>
                      {item.title}
                      {item.description && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${isVideo ? 'badge-emerald' : 'badge-brass'}`} style={{ fontSize: '0.7rem' }}>
                        {isVideo ? 'Video' : 'Foto'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {item.category || '-'}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {item.date || '-'}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button onClick={() => { setEditing({ ...item }); setIsNew(false); }} className="btn btn-sm btn-ghost" style={{ color: 'var(--emerald)' }} title="Edit">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(item)} className="btn btn-sm btn-ghost" style={{ color: '#F87171' }} title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              }

              if (type === 'articles') {
                const imgUrl = item.image ? getDirectImageUrl(item.image) : '';
                const driveId = extractGoogleDriveId(item.image);
                return (
                  <tr key={item.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center' }}>{i + 1}</td>
                    <td style={{ width: 80 }}>
                      <div style={{
                        width: 64,
                        height: 44,
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        background: '#0D2B22',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              if (driveId && !e.currentTarget.src.includes('thumbnail?id=')) {
                                e.currentTarget.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w600`;
                              } else {
                                e.currentTarget.style.display = 'none';
                              }
                            }}
                          />
                        ) : (
                          <FileText size={20} color="var(--emerald)" />
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 260 }}>
                      {item.title}
                      {item.slug && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          /{item.slug}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                        {item.category || 'Dakwah'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {item.author || 'ROKABA'}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {item.date || (item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-')}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button onClick={() => { setEditing({ ...item }); setIsNew(false); }} className="btn btn-sm btn-ghost" style={{ color: 'var(--emerald)' }} title="Edit Artikel">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(item)} className="btn btn-sm btn-ghost" style={{ color: '#F87171' }} title="Hapus Artikel">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center' }}>{i + 1}</td>
                  {schema.fields.filter(f => f.type !== 'textarea').slice(0, 4).map(f => (
                    <td key={f.key} style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item[f.key]}
                    </td>
                  ))}
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button onClick={() => { setEditing({ ...item }); setIsNew(false); }} className="btn btn-sm btn-ghost" style={{ color: 'var(--emerald)' }}>
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDelete(item)} className="btn btn-sm btn-ghost" style={{ color: '#F87171' }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={99} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>Tidak ada data {schema.label.toLowerCase()} yang sesuai.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (Touch-Optimized for HP) */}
      <div className="admin-mobile-cards">
        {filtered.length > 0 ? (
          filtered.map((item, i) => {
            if (type === 'articles') {
              const imgUrl = item.image ? getDirectImageUrl(item.image) : '';
              const driveId = extractGoogleDriveId(item.image);
              return (
                <div key={item.id} className="admin-mobile-card">
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 76,
                      height: 56,
                      borderRadius: '10px',
                      overflow: 'hidden',
                      background: '#0D2B22',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            if (driveId && !e.currentTarget.src.includes('thumbnail?id=')) {
                              e.currentTarget.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w600`;
                            } else {
                              e.currentTarget.style.display = 'none';
                            }
                          }}
                        />
                      ) : (
                        <FileText size={22} color="var(--emerald)" />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                          {item.category || 'Dakwah'}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>#{i + 1}</span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <span>{item.author || 'ROKABA'}</span>
                        <span>•</span>
                        <span>{item.date || (item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-')}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.25rem 0 0.2rem', lineHeight: 1.4 }}>
                      {item.title}
                    </h3>
                    {item.slug && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--emerald-light)', fontFamily: 'monospace' }}>
                        /{item.slug}
                      </div>
                    )}
                  </div>

                  <div className="admin-mobile-card-actions">
                    <button
                      onClick={() => { setEditing({ ...item }); setIsNew(false); }}
                      className="btn btn-primary"
                      title="Edit Artikel"
                    >
                      <Edit3 size={15} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="btn btn-secondary"
                      style={{ color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.35)' }}
                      title="Hapus Artikel"
                    >
                      <Trash2 size={15} /> Hapus
                    </button>
                  </div>
                </div>
              );
            }

            if (type === 'events') {
              const isUpcoming = (item.status || 'upcoming') === 'upcoming';
              return (
                <div key={item.id} className="admin-mobile-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <span className={`badge ${isUpcoming ? 'badge-emerald' : 'badge-brass'}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                        {isUpcoming ? 'Mendatang' : 'Selesai'}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>#{i + 1}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      <Calendar size={13} />
                      <span>{item.date || '-'}</span>
                      {item.time && <span>• {item.time}</span>}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.2rem 0 0.35rem', lineHeight: 1.35 }}>
                      {item.title}
                    </h3>
                    {item.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--antique-brass-light)', marginBottom: '0.35rem' }}>
                        <MapPin size={13} style={{ flexShrink: 0 }} />
                        <span>{item.location}</span>
                      </div>
                    )}
                    {item.description && (
                      <p style={{
                        fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.45
                      }}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="admin-mobile-card-actions">
                    <button
                      onClick={() => { setEditing({ ...item }); setIsNew(false); }}
                      className="btn btn-primary"
                      title="Edit Agenda"
                    >
                      <Edit3 size={15} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="btn btn-secondary"
                      style={{ color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.35)' }}
                      title="Hapus Agenda"
                    >
                      <Trash2 size={15} /> Hapus
                    </button>
                  </div>
                </div>
              );
            }

            if (type === 'schools') {
              return (
                <div key={item.id} className="admin-mobile-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                        {item.type || 'SMA'}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>#{i + 1}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: 'var(--antique-brass-light)', fontWeight: 600 }}>
                      <School size={13} />
                      <span>{item.memberCount || (item.members?.length || 0)} Anggota</span>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.2rem 0 0.35rem', lineHeight: 1.35 }}>
                      {item.name || item.school}
                    </h3>
                    {item.pembina && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                        Pembina: <strong style={{ color: 'var(--text-primary)' }}>{item.pembina}</strong>
                      </div>
                    )}
                    {item.address && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                        <MapPin size={13} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.address}</span>
                      </div>
                    )}
                    {item.contact && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.76rem', color: 'var(--emerald-light)' }}>
                        <Phone size={13} />
                        <span>{item.contact}</span>
                      </div>
                    )}
                  </div>

                  <div className="admin-mobile-card-actions">
                    <button
                      onClick={() => { setEditing({ ...item }); setIsNew(false); }}
                      className="btn btn-primary"
                      title="Edit Sekolah"
                    >
                      <Edit3 size={15} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="btn btn-secondary"
                      style={{ color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.35)' }}
                      title="Hapus Sekolah"
                    >
                      <Trash2 size={15} /> Hapus
                    </button>
                  </div>
                </div>
              );
            }

            // Generic Schema Fallback
            return (
              <div key={item.id} className="admin-mobile-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>#{i + 1}</span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>{schema.label}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    {item.title || item.name || item.id}
                  </h3>
                  {schema.fields.filter(f => f.type !== 'textarea').slice(0, 3).map(f => (
                    <div key={f.key} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{f.label}:</span> {item[f.key] || '-'}
                    </div>
                  ))}
                </div>
                <div className="admin-mobile-card-actions">
                  <button onClick={() => { setEditing({ ...item }); setIsNew(false); }} className="btn btn-primary">
                    <Edit3 size={15} /> Edit
                  </button>
                  <button onClick={() => handleDelete(item)} className="btn btn-secondary" style={{ color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.35)' }}>
                    <Trash2 size={15} /> Hapus
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="admin-mobile-card" style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
            <p style={{ margin: '0 0 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tidak ada data {schema.label.toLowerCase()} yang sesuai.</p>
            <button onClick={handleNew} className="btn btn-primary btn-sm" style={{ margin: '0 auto', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={14} /> Tambah {schema.label} Baru
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
