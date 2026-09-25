import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, Plus, Edit3, Trash2, Save, X, Search, 
  FileText, Presentation, File, ExternalLink, Download,
  CheckCircle2, Sparkles, FolderOpen
} from 'lucide-react';

export default function LibraryManager() {
  const { library = [], updateData, addAuditLog } = useData();
  const { user } = useAuth();
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Semua');
  const [typeFilter, setTypeFilter] = useState('Semua');

  const categories = useMemo(() => {
    return ['Semua', ...new Set((library || []).map(l => l.category).filter(Boolean))];
  }, [library]);

  const filtered = useMemo(() => {
    return (library || []).filter(item => {
      const matchCat = catFilter === 'Semua' || item.category === catFilter;
      const matchType = typeFilter === 'Semua' || (item.type || 'pdf').toLowerCase() === typeFilter.toLowerCase();
      const matchSearch = !search || 
        (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.size || '').toLowerCase().includes(search.toLowerCase());
      return matchCat && matchType && matchSearch;
    });
  }, [library, catFilter, typeFilter, search]);

  const handleNew = () => {
    setEditing({
      id: `lib-${Date.now()}`,
      title: '',
      category: 'Ibadah',
      fileUrl: '',
      type: 'pdf',
      size: '2.5 MB',
      uploadedAt: new Date().toISOString(),
    });
    setIsNew(true);
  };

  const handleSave = async () => {
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
      category: editing.category?.trim() || 'Ibadah',
      fileUrl: editing.fileUrl.trim(),
      type: (editing.type || 'pdf').toLowerCase(),
      size: editing.size?.trim() || '1.0 MB',
      updatedAt: new Date().toISOString(),
    };

    let updated;
    if (isNew) {
      updated = [itemToSave, ...(library || [])];
    } else {
      updated = (library || []).map(l => l.id === itemToSave.id ? itemToSave : l);
    }

    await updateData('library', updated);
    if (addAuditLog && user) {
      await addAuditLog(user.id, user.username, isNew ? 'CREATE' : 'UPDATE', 'library', `${isNew ? 'Added' : 'Updated'} materi E-Library: ${itemToSave.title}`);
    }
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Yakin ingin menghapus materi "${item.title}" dari E-Library?`)) return;
    const updated = (library || []).filter(l => l.id !== item.id);
    await updateData('library', updated);
    if (addAuditLog && user) {
      await addAuditLog(user.id, user.username, 'DELETE', 'library', `Deleted materi E-Library: ${item.title}`);
    }
  };

  const formatConfig = {
    pdf: { label: 'PDF', bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', icon: FileText },
    slide: { label: 'SLIDE', bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', icon: Presentation },
    doc: { label: 'DOC', bg: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', icon: File },
  };

  return (
    <div>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 800, color: 'var(--text-primary)' }}>
            Kelola E-Library (Perpustakaan Digital)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Daftarkan dan kelola materi dakwah, panduan ibadah, e-book, dan slide presentasi untuk pelajar.
          </p>
        </div>
        <button 
          onClick={handleNew} 
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}
        >
          <Plus size={18} /> Daftarkan Materi Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.85rem 1rem',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 240px', width: '100%', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Cari judul materi, kategori, atau topik..."
            style={{ paddingLeft: '2.5rem', height: 40 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Kategori:</span>
            <select
              className="form-input"
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', height: 40, width: 'auto' }}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'Semua' ? 'Semua Kategori' : c}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Format:</span>
            <select
              className="form-input"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', height: 40, width: 'auto' }}
            >
              <option value="Semua">Semua Format</option>
              <option value="pdf">PDF</option>
              <option value="slide">Slide Presentasi</option>
              <option value="doc">Dokumen Word</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="glass-card table-responsive" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 640 }}>
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                <th style={{ width: '80px' }}>FORMAT</th>
                <th>JUDUL MATERI & DOKUMEN</th>
                <th>KATEGORI</th>
                <th>UKURAN</th>
                <th>TAUTAN UNDUHAN</th>
                <th style={{ textAlign: 'right', width: '110px' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((item, index) => {
                const conf = formatConfig[item.type] || formatConfig.pdf;
                const Icon = conf.icon;
                return (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {index + 1}
                    </td>
                    <td>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        background: conf.bg,
                        color: conf.color,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        letterSpacing: '0.04em'
                      }}>
                        <Icon size={14} />
                        <span>{conf.label}</span>
                      </div>
                    </td>
                    <td style={{ minWidth: 260 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.94rem', lineHeight: 1.35 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                        ID: <code style={{ color: 'var(--emerald-light)' }}>{item.id}</code>
                        {item.uploadedAt && (
                          <span> • Ditambahkan: {new Date(item.uploadedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                        {item.category || 'Ibadah'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {item.size || '1.0 MB'}
                      </span>
                    </td>
                    <td>
                      {item.fileUrl && item.fileUrl !== '#' ? (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            color: 'var(--emerald-light)',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                          }}
                        >
                          <ExternalLink size={13} /> Buka / Unduh
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Belum ada URL</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => { setEditing({ ...item }); setIsNew(false); }}
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(255,255,255,0.04)',
                            color: 'var(--emerald)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}
                          title="Edit Materi"
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(16,185,129,0.15)';
                            e.currentTarget.style.borderColor = 'var(--emerald)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                          }}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(255,255,255,0.04)',
                            color: '#F87171',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}
                          title="Hapus Materi"
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
                            e.currentTarget.style.borderColor = '#EF4444';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                    <BookOpen size={44} style={{ opacity: 0.35, marginBottom: '0.85rem', display: 'block', margin: '0 auto 0.85rem' }} />
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      Tidak ada materi E-Library yang sesuai pencarian.
                    </p>
                    <button
                      onClick={handleNew}
                      className="btn btn-primary btn-sm"
                      style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Plus size={14} /> Tambah Materi Pertama
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {editing && (
        <div className="modal-overlay-responsive">
          <div className="glass-card modal-card-responsive animate-fade-in-up" style={{
            maxWidth: 560,
            padding: '1.75rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {isNew ? 'Tambah' : 'Edit'} Materi E-Library
              </h2>
              <button 
                onClick={() => { setEditing(null); setIsNew(false); }} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Judul Materi / Dokumen *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: Panduan Shalat Lengkap & Dzikir Pagi Petang"
                value={editing.title || ''}
                onChange={e => setEditing({ ...editing, title: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Kategori Materi</label>
                <select
                  className="form-input"
                  value={editing.category || 'Ibadah'}
                  onChange={e => setEditing({ ...editing, category: e.target.value })}
                >
                  <option value="Ibadah">Ibadah</option>
                  <option value="Dakwah">Dakwah</option>
                  <option value="Edukasi">Edukasi</option>
                  <option value="Kajian">Kajian</option>
                  <option value="Motivasi">Motivasi</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Format Dokumen</label>
                <select
                  className="form-input"
                  value={editing.type || 'pdf'}
                  onChange={e => setEditing({ ...editing, type: e.target.value })}
                >
                  <option value="pdf">PDF (.pdf)</option>
                  <option value="slide">Slide Presentasi (.pptx/.pdf)</option>
                  <option value="doc">Dokumen Word (.docx)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Estimasi Ukuran File</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contoh: 2.5 MB"
                  value={editing.size || ''}
                  onChange={e => setEditing({ ...editing, size: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tautan / URL Berkas *</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://drive.google.com/..."
                  value={editing.fileUrl || ''}
                  onChange={e => setEditing({ ...editing, fileUrl: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Google Drive Tip Box */}
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.76rem',
              color: 'var(--text-secondary)',
              marginBottom: '1.25rem',
              lineHeight: 1.5
            }}>
              <strong style={{ color: 'var(--emerald)' }}>💡 Tips Tautan Google Drive:</strong>
              <div style={{ marginTop: '0.2rem' }}>
                Pastikan akses berbagi tautan file pada Google Drive diatur ke: 
                <span style={{ color: '#FBBF24', fontWeight: 600 }}> "Siapa saja yang memiliki link"</span> agar pengunjung website dapat mengunduh materi tanpa hambatan izin akses.
              </div>
            </div>

            {/* Live Preview Box */}
            {editing.title && (
              <div style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--antique-brass)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={13} /> Pratinjau Tampilan Pengunjung:
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  background: 'white',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: '#0D2B22',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '8px',
                    background: (formatConfig[editing.type] || formatConfig.pdf).bg,
                    color: (formatConfig[editing.type] || formatConfig.pdf).color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {editing.type === 'slide' ? <Presentation size={22} /> : editing.type === 'doc' ? <File size={22} /> : <FileText size={22} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                      {editing.category} • {editing.size || 'Ukuran fleksibel'}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {editing.title}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
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
