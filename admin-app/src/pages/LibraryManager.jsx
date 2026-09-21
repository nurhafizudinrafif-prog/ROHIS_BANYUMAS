import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Library, Plus, Edit3, Trash2, Save, X, Search, FileText, Presentation, File } from 'lucide-react';

export default function LibraryManager() {
  const { library, updateData, addAuditLog } = useData();
  const { user } = useAuth();
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = library.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));

  const handleNew = () => {
    setEditing({ id: `lib-${Date.now()}`, title: '', category: 'Umum', fileUrl: '', type: 'pdf', size: '', uploadedAt: new Date().toISOString() });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    const updated = isNew ? [...library, editing] : library.map(l => l.id === editing.id ? editing : l);
    await updateData('library', updated);
    await addAuditLog(user.id, user.username, isNew ? 'CREATE' : 'UPDATE', 'library', `${isNew ? 'Added' : 'Updated'} library: ${editing.title}`);
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>E-Library Manager</h1>
        <button onClick={handleNew} className="btn btn-primary"><Plus size={16} /> Tambah Materi</button>
      </div>

      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" className="form-input" placeholder="Cari materi..." style={{ paddingLeft: '2.5rem', maxWidth: 400 }}
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.map(item => {
          const Icon = typeIcons[item.type] || FileText;
          const color = typeColors[item.type] || 'var(--emerald)';
          return (
            <div key={item.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <span className="badge" style={{ background: `${color}15`, color, fontSize: '0.65rem', textTransform: 'uppercase' }}>{item.type}</span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>{item.category}</span>
                </div>
                <h4 style={{ fontSize: '0.92rem', marginBottom: '0.25rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.size}</p>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.65rem' }}>
                  <button onClick={() => { setEditing({ ...item }); setIsNew(false); }} className="btn btn-sm btn-secondary"><Edit3 size={12} /> Edit</button>
                  <button onClick={() => handleDelete(item)} className="btn btn-sm btn-danger"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <Library size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>Tidak ada materi</p>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card animate-fade-in-up" style={{ width: '100%', maxWidth: 500, padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem' }}>{isNew ? 'Tambah' : 'Edit'} Materi</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            {[
              { key: 'title', label: 'Judul', type: 'text' },
              { key: 'category', label: 'Kategori', type: 'text' },
              { key: 'fileUrl', label: 'URL File (Google Drive/Cloudinary)', type: 'text' },
              { key: 'size', label: 'Ukuran File', type: 'text' },
            ].map(f => (
              <div className="form-group" key={f.key}>
                <label className="form-label">{f.label}</label>
                <input type="text" className="form-input" value={editing[f.key] || ''} onChange={e => setEditing({ ...editing, [f.key]: e.target.value })} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Tipe File</label>
              <select className="form-input" value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value })}>
                <option value="pdf">PDF</option>
                <option value="slide">Slide</option>
                <option value="doc">Dokumen</option>
              </select>
            </div>
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
