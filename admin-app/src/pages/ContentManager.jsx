import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit3, Trash2, Save, X, Search, Sparkles, Video as VideoIcon, Image as ImageIcon, ExternalLink, HelpCircle } from 'lucide-react';
import { parseMediaItem } from '@shared/services/mediaHelper.js';

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

  // ═══ HOME EDITOR (Single Object) ═══
  if (schema.isSingle) {
    const handleSaveHome = async () => {
      await dataCtx.updateData('home', homeForm);
      await dataCtx.addAuditLog(user.id, user.username, 'UPDATE', 'home', 'Updated home page content');
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{schema.label}</h1>
          <button onClick={handleSaveHome} className="btn btn-primary"><Save size={16} /> Simpan</button>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          {schema.fields.map(f => (
            <div className="form-group" key={f.key}>
              <label className="form-label">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea className="form-input" value={homeForm[f.key] || ''} onChange={e => setHomeForm({ ...homeForm, [f.key]: e.target.value })} />
              ) : (
                <input type="text" className="form-input" value={homeForm[f.key] || ''} onChange={e => setHomeForm({ ...homeForm, [f.key]: e.target.value })} />
              )}
            </div>
          ))}
        </div>
      </div>
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
    await dataCtx.addAuditLog(user.id, user.username, isNew ? 'CREATE' : 'UPDATE', type, `${isNew ? 'Created' : 'Updated'} ${type}: ${editing.title || editing.name || editing.id}`);
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = async (item) => {
    if (!confirm(`Hapus "${item.title || item.name}"?`)) return;
    const updated = items.filter(i => i.id !== item.id);
    await dataCtx.updateData(type, updated);
    await dataCtx.addAuditLog(user.id, user.username, 'DELETE', type, `Deleted ${type}: ${item.title || item.name}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Kelola {schema.label}</h1>
        <button onClick={handleNew} className="btn btn-primary"><Plus size={16} /> Tambah {schema.label}</button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" className="form-input" placeholder={`Cari ${schema.label.toLowerCase()}...`}
          style={{ paddingLeft: '2.5rem', maxWidth: 400 }} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem',
        }}>
          <div className="glass-card animate-fade-in-up" style={{
            width: '100%', maxWidth: 600, maxHeight: '85vh', overflow: 'auto', padding: '2rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem' }}>{isNew ? 'Tambah' : 'Edit'} {schema.label}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem',
              }}><X size={20} /></button>
            </div>
            {schema.fields.map(f => (
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
            ))}

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

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }}><Save size={16} /> Simpan</button>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="btn btn-secondary">Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="glass-card" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            {type === 'gallery' ? (
              <tr>
                <th>#</th>
                <th>Preview</th>
                <th>Judul Dokumentasi</th>
                <th>Tipe</th>
                <th>Kategori</th>
                <th>Tanggal</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            ) : (
              <tr>
                <th>#</th>
                {schema.fields.filter(f => f.type !== 'textarea').slice(0, 4).map(f => <th key={f.key}>{f.label}</th>)}
                <th style={{ textAlign: 'right' }}>Aksi</th>
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
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{i + 1}</td>
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

              return (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{i + 1}</td>
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
              <tr><td colSpan={99} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Tidak ada data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
