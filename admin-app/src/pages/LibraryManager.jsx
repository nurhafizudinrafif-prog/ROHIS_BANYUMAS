import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Library, Plus, Edit3, Trash2, Save, X, Search, FileText, Presentation, File, ExternalLink } from 'lucide-react';

export default function LibraryManager() {
  const { library, updateData, addAuditLog } = useData();
  const { user } = useAuth();
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Semua');
  const [typeFilter, setTypeFilter] = useState('Semua');

  const categories = ['Semua', ...new Set((library || []).map(l => l.category).filter(Boolean))];

  const filtered = (library || [])
    .filter(l => catFilter === 'Semua' || l.category === catFilter)
    .filter(l => typeFilter === 'Semua' || l.type === typeFilter)
    .filter(l => (l.title || '').toLowerCase().includes(search.toLowerCase()) || (l.category || '').toLowerCase().includes(search.toLowerCase()));

  const handleNew = () => {
    setEditing({ id: `lib-${Date.now()}`, title: '', category: 'Ibadah', fileUrl: '', type: 'pdf', size: '', uploadedAt: new Date().toISOString() });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editing || !editing.title.trim()) return;
    const itemToSave = {
      ...editing,
      title: editing.title.trim(),
      category: editing.category?.trim() || 'Umum',
      fileUrl: editing.fileUrl?.trim() || '#',
      size: editing.size?.trim() || '1.0 MB',
    };
    const updated = isNew ? [itemToSave, ...library] : library.map(l => l.id === itemToSave.id ? itemToSave : l);
    await updateData('library', updated);
    await addAuditLog(user.id, user.username, isNew ? 'CREATE' : 'UPDATE', 'library', `${isNew ? 'Added' : 'Updated'} library: ${itemToSave.title}`);
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = async (item) => {
    if (!confirm(`Hapus "${item.title}"?`)) return;
    await updateData('library', library.filter(l => l.id !== item.id));
    await addAuditLog(user.id, user.username, 'DELETE', 'library', `Deleted library: ${item.title}`);
  };

  const typeIcons = { pdf: FileText, slide: Presentation, doc: File };
  const typeColors = { pdf: '#EF4444', slide: '#F59E0B', doc: '#3B82F6' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Kelola E-Library (Perpustakaan Digital)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Kelola modul dakwah, panduan ibadah, dan materi presentasi yang dapat diunduh pelajar.
          </p>
        </div>
        <button onClick={handleNew} className="btn btn-primary"><Plus size={16} /> Tambah Materi</button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" className="form-input" placeholder="Cari judul materi..." style={{ paddingLeft: '2.5rem' }}
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`btn btn-sm ${catFilter === c ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <select
            className="form-input"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem', width: 'auto' }}
          >
            <option value="Semua">Semua Format</option>
            <option value="pdf">PDF</option>
            <option value="slide">Slide</option>
            <option value="doc">Dokumen</option>
          </select>
        </div>
      </div>

      {/* Card Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {filtered.map(item => {
          const Icon = typeIcons[item.type] || FileText;
          const color = typeColors[item.type] || 'var(--emerald)';
          return (
            <div key={item.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} style={{ color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <span className="badge" style={{ background: `${color}20`, color, fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>
                    {item.type}
                  </span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>{item.category}</span>
                </div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{item.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>{item.size || 'Ukuran disesuaikan'}</span>
                  {item.fileUrl && item.fileUrl !== '#' && (
                    <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald-light)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}>
                      <ExternalLink size={12} /> Buka Link
                    </a>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.85rem' }}>
                  <button onClick={() => { setEditing({ ...item }); setIsNew(false); }} className="btn btn-sm btn-secondary" style={{ flex: 1 }}>
                    <Edit3 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(item)} className="btn btn-sm btn-danger" title="Hapus Materi">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <Library size={44} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p style={{ fontWeight: 500 }}>Tidak ada materi ditemukan</p>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card animate-fade-in-up" style={{ width: '100%', maxWidth: 540, padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{isNew ? 'Tambah' : 'Edit'} Materi E-Library</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Judul Materi / Dokumen *</label>
              <input type="text" className="form-input" placeholder="Contoh: Panduan Shalat Lengkap" value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Kategori Materi</label>
                <select className="form-input" value={editing.category || 'Ibadah'} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                  <option value="Ibadah">Ibadah</option>
                  <option value="Dakwah">Dakwah</option>
                  <option value="Edukasi">Edukasi</option>
                  <option value="Kajian">Kajian</option>
                  <option value="Motivasi">Motivasi</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tipe File</label>
                <select className="form-input" value={editing.type || 'pdf'} onChange={e => setEditing({ ...editing, type: e.target.value })}>
                  <option value="pdf">PDF</option>
                  <option value="slide">Slide Presentasi</option>
                  <option value="doc">Dokumen / Word</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Ukuran File</label>
                <input type="text" className="form-input" placeholder="Contoh: 2.5 MB" value={editing.size || ''} onChange={e => setEditing({ ...editing, size: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">URL File (Google Drive/URL) *</label>
                <input type="url" className="form-input" placeholder="https://drive.google.com/..." value={editing.fileUrl || ''} onChange={e => setEditing({ ...editing, fileUrl: e.target.value })} required />
              </div>
            </div>

            {/* Tips Google Drive */}
            <div style={{ padding: '0.75rem 0.9rem', borderRadius: '8px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
              <strong style={{ color: 'var(--emerald-light)' }}>💡 Tips Google Drive:</strong> Pastikan opsi berbagi tautan pada Google Drive diatur ke <strong>"Siapa saja yang memiliki link"</strong> agar materi dapat langsung diunduh pengunjung tanpa batasan login.
            </div>

            {/* Card Preview */}
            {editing.title && (
              <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--antique-brass)', fontWeight: 600, marginBottom: '0.4rem' }}>Pratinjau:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.85rem', borderRadius: '8px', color: '#0D2B22' }}>
                  <div style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', background: editing.type === 'slide' ? '#FEF3C7' : editing.type === 'doc' ? '#DBEAFE' : '#FEE2E2', color: editing.type === 'slide' ? '#D97706' : editing.type === 'doc' ? '#2563EB' : '#DC2626', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {editing.type || 'PDF'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.65rem', color: '#64748B' }}>{editing.category} • {editing.size || 'Ukuran disesuaikan'}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{editing.title}</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }}>
                <Save size={16} /> Simpan Materi
              </button>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="btn btn-secondary">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
