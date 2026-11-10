import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Search,
  Calendar,
  Newspaper,
  FileText,
  School,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import AdminHomeCMS from '../components/AdminHomeCMS';
import ImageUploadField from '../components/ImageUploadField';
import { getDirectImageUrl } from '../utils/media';

const schemas = {
  news: {
    label: 'Berita',
    title: 'Berita',
    subtitle: 'Kelola berita kegiatan dan informasi ROHIS Kabupaten Banyumas.',
    btnLabel: 'Tambah berita',
    searchPlaceholder: 'Cari berita...',
    fields: [
      { key: 'order', label: 'Urutan Tampil (1 = Utama)', type: 'number', placeholder: '1', gridSpan: 1 },
      { key: 'category', label: 'Kategori', type: 'select', options: ['Organisasi', 'Kajian', 'Warta Rohis', 'Sosial', 'Pelatihan', 'Liputan Acara', 'Aksi Sosial', 'Agenda'], required: true, gridSpan: 1 },
      { key: 'title', label: 'Judul', type: 'text', required: true, placeholder: 'Judul berita kegiatan...', gridSpan: 1 },
      { key: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'judul-berita-kegiatan', gridSpan: 1 },
      { key: 'date', label: 'Tanggal', type: 'date', required: true, gridSpan: 1 },
      { key: 'author', label: 'Penulis / Humas', type: 'text', placeholder: 'Humas ROKABA', gridSpan: 1 },
      { key: 'location', label: 'Lokasi', type: 'text', placeholder: 'Aula SMA N 2 Purwokerto', gridSpan: 2 },
      { key: 'excerpt', label: 'Ringkasan', type: 'textarea', placeholder: 'Ringkasan singkat berita...', rows: 3, gridSpan: 2 },
      { key: 'content', label: 'Isi berita', type: 'textarea', placeholder: 'Tuliskan teks lengkap berita...', rows: 8, gridSpan: 2 },
      { key: 'image', label: 'Foto dokumentasi', type: 'image', gridSpan: 2 },
    ],
    defaults: { id: '', order: 1, title: '', slug: '', excerpt: '', content: '', author: 'Humas ROKABA', category: 'Organisasi', location: 'Kabupaten Banyumas', date: new Date().toISOString().split('T')[0], image: '' },
  },
  articles: {
    label: 'Artikel',
    title: 'Artikel',
    subtitle: 'Kelola artikel dakwah, inspirasi, dan edukasi keislaman.',
    btnLabel: 'Tambah artikel',
    searchPlaceholder: 'Cari artikel...',
    fields: [
      { key: 'title', label: 'Judul', type: 'text', required: true, gridSpan: 1 },
      { key: 'slug', label: 'Slug', type: 'text', required: true, gridSpan: 1 },
      { key: 'category', label: 'Kategori', type: 'select', options: ['Edukasi', 'Dakwah', 'Ibadah', 'Motivasi', 'Akhlak'], gridSpan: 1 },
      { key: 'author', label: 'Penulis', type: 'text', placeholder: 'Tim ROKABA', gridSpan: 1 },
      { key: 'content', label: 'Isi artikel', type: 'textarea', rows: 8, gridSpan: 2 },
      { key: 'image', label: 'Foto artikel', type: 'image', gridSpan: 2 },
    ],
    defaults: { id: '', title: '', slug: '', content: '', author: 'Tim ROKABA', category: 'Motivasi', image: '' },
  },
  events: {
    label: 'Agenda',
    title: 'Agenda',
    subtitle: 'Kelola agenda kegiatan, kajian, dan program ROHIS.',
    btnLabel: 'Tambah agenda',
    searchPlaceholder: 'Cari agenda...',
    fields: [
      { key: 'title', label: 'Kegiatan / Judul', type: 'text', required: true, gridSpan: 2 },
      { key: 'date', label: 'Tanggal', type: 'date', required: true, gridSpan: 1 },
      { key: 'time', label: 'Waktu / Jam', type: 'text', placeholder: '08:00 - 11:30 WIB', gridSpan: 1 },
      { key: 'location', label: 'Lokasi', type: 'text', placeholder: 'Masjid Agung Baitussalam Purwokerto', gridSpan: 2 },
      { key: 'status', label: 'Status', type: 'select', options: ['upcoming', 'completed'], gridSpan: 1 },
      { key: 'speaker', label: 'Pemateri / Pembicara', type: 'text', placeholder: 'Ustadz...', gridSpan: 1 },
      { key: 'description', label: 'Deskripsi kegiatan', type: 'textarea', rows: 4, gridSpan: 2 },
    ],
    defaults: { id: '', title: '', date: new Date().toISOString().split('T')[0], time: '08:00 - 11:30 WIB', location: '', description: '', status: 'upcoming', speaker: '' },
  },
  schools: {
    label: 'Sekolah anggota',
    title: 'Sekolah anggota',
    subtitle: 'Kelola data sekolah anggota ROHIS Kabupaten Banyumas.',
    btnLabel: 'Tambah sekolah',
    searchPlaceholder: 'Cari sekolah...',
    fields: [
      { key: 'name', label: 'Nama Sekolah', type: 'text', required: true, placeholder: 'SMA Negeri 2 Purwokerto', gridSpan: 2 },
      { key: 'type', label: 'Jenjang', type: 'select', options: ['SMA', 'SMK', 'MA'], gridSpan: 1 },
      { key: 'memberCount', label: 'Jumlah Anggota', type: 'number', placeholder: '35', gridSpan: 1 },
      { key: 'pembina', label: 'Pembina / Pengelola', type: 'text', placeholder: 'Drs. H. Ahmad...', gridSpan: 1 },
      { key: 'contact', label: 'Kontak / WhatsApp', type: 'text', placeholder: '+62 8...', gridSpan: 1 },
      { key: 'address', label: 'Alamat Sekolah', type: 'textarea', rows: 2, placeholder: 'Jl. Gatot Subroto...', gridSpan: 2 },
    ],
    defaults: { id: '', name: '', type: 'SMA', pembina: '', contact: '', address: '', memberCount: 0, editorId: null },
  },
  home: {
    label: 'Kelola Beranda',
    isSingle: true,
  },
};

export default function ContentManager() {
  const { type } = useParams();
  const dataCtx = useData();
  const { user } = useAuth();
  const schema = schemas[type];

  const rawItems = type === 'home' ? null : dataCtx[type] || [];

  // Sort items for news
  const items = useMemo(() => {
    if (!rawItems) return [];
    if (type === 'news') {
      return [...rawItems].sort((a, b) => {
        const ordA = a.order !== undefined && a.order !== null && a.order !== '' ? Number(a.order) : 999999;
        const ordB = b.order !== undefined && b.order !== null && b.order !== '' ? Number(b.order) : 999999;
        if (ordA !== ordB) return ordA - ordB;
        return new Date(b.date || 0) - new Date(a.date || 0);
      });
    }
    return rawItems;
  }, [rawItems, type]);

  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [eventTab, setEventTab] = useState('upcoming'); // for events: upcoming / completed
  const [itemToDelete, setItemToDelete] = useState(null);

  // If type is home, delegate to AdminHomeCMS
  if (type === 'home') {
    return (
      <AdminHomeCMS
        homeContent={dataCtx.home}
        programs={dataCtx.programs}
        onSaveHomeContent={async (newHome) => {
          await dataCtx.updateData('home', newHome);
          if (dataCtx.addAuditLog && user) {
            await dataCtx.addAuditLog(user.id, user.username, 'UPDATE', 'home', 'Menyimpan konten beranda');
          }
        }}
        onSaveProgram={async (pId, newProg) => {
          const current = dataCtx.programs || [];
          const updated = current.map((p) => (p.id === pId ? newProg : p));
          await dataCtx.updateData('programs', updated);
        }}
      />
    );
  }

  if (!schema) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Tipe konten tidak ditemukan.
      </div>
    );
  }

  // Filter list
  const filtered = items.filter((item) => {
    // Search match
    const q = search.toLowerCase();
    const strMatch = JSON.stringify(item).toLowerCase().includes(q);

    // Category match
    if (categoryFilter !== 'Semua') {
      if (type === 'schools' && item.type !== categoryFilter) return false;
      if (item.category && item.category !== categoryFilter) return false;
    }

    // Events tab filter
    if (type === 'events') {
      if (eventTab === 'upcoming' && item.status === 'completed') return false;
      if (eventTab === 'completed' && item.status !== 'completed') return false;
    }

    return strMatch;
  });

  // Reorder news
  const handleMoveOrder = async (item, direction) => {
    if (type !== 'news') return;
    const currentIndex = items.findIndex((i) => String(i.id) === String(item.id));
    if (currentIndex === -1) return;
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const list = [...items];
    const [moved] = list.splice(currentIndex, 1);
    list.splice(targetIndex, 0, moved);

    const updated = list.map((it, idx) => ({ ...it, order: idx + 1 }));
    await dataCtx.updateData(type, updated);
  };

  const handleOpenNew = () => {
    const newItem = {
      ...schema.defaults,
      id: `${type.slice(0, 3)}-${Date.now()}`,
    };
    if (type === 'news') {
      newItem.order = (items?.length || 0) + 1;
    }
    setEditing(newItem);
    setIsNew(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!editing) return;
    let itemToSave = { ...editing };

    // Auto slug
    if ((type === 'news' || type === 'articles') && !itemToSave.slug && itemToSave.title) {
      itemToSave.slug = itemToSave.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    let updated;
    if (isNew) {
      updated = [itemToSave, ...items];
    } else {
      updated = items.map((i) => (String(i.id) === String(itemToSave.id) ? itemToSave : i));
    }

    if (type === 'news') {
      updated = [...updated]
        .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999))
        .map((it, idx) => ({ ...it, order: idx + 1 }));
    }

    await dataCtx.updateData(type, updated);
    setEditing(null);
    setIsNew(false);

    if (dataCtx.addAuditLog && user) {
      dataCtx.addAuditLog(
        user.id,
        user.username,
        isNew ? 'CREATE' : 'UPDATE',
        type,
        `${isNew ? 'Menambahkan' : 'Memperbarui'} ${schema.label}: "${itemToSave.title || itemToSave.name}"`
      ).catch(() => {});
    }
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    let updated = items.filter((i) => String(i.id) !== String(itemToDelete.id));
    if (type === 'news') {
      updated = updated.map((it, idx) => ({ ...it, order: idx + 1 }));
    }
    await dataCtx.updateData(type, updated);
    if (dataCtx.addAuditLog && user) {
      dataCtx.addAuditLog(
        user.id,
        user.username,
        'DELETE',
        type,
        `Menghapus ${schema.label}: "${itemToDelete.title || itemToDelete.name}"`
      ).catch(() => {});
    }
    setItemToDelete(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ═══════ Page Header ═══════ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.85rem)', fontWeight: 800, color: 'var(--pine-dark)' }}>
            {schema.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            {schema.subtitle}
          </p>
        </div>

        <button type="button" onClick={handleOpenNew} className="btn-pine">
          <Plus size={16} />
          <span>{schema.btnLabel}</span>
        </button>
      </div>

      {/* ═══════ Filter & Search Bar (Image 02 / 03) ═══════ */}
      <div
        className="admin-soft-card"
        style={{
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: '1 1 300px' }}>
          {/* Inset Search Field */}
          <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: '360px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder={schema.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input-soft"
              style={{ paddingLeft: '2.4rem', paddingBlock: '0.5rem', fontSize: '0.86rem' }}
            />
          </div>

          {/* Category / Jenjang Select */}
          {type !== 'events' && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-select-soft"
              style={{ width: 'auto', paddingBlock: '0.5rem', fontSize: '0.86rem' }}
            >
              <option value="Semua">{type === 'schools' ? 'Semua jenjang' : 'Semua kategori'}</option>
              {type === 'news' && ['Organisasi', 'Kajian', 'Sosial', 'Pelatihan', 'Aksi Sosial', 'Agenda'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              {type === 'articles' && ['Motivasi', 'Edukasi', 'Dakwah', 'Ibadah', 'Akhlak'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              {type === 'schools' && ['SMA', 'SMK', 'MA'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          {/* Agenda Status Tabs (Image 02 panel 3) */}
          {type === 'events' && (
            <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-inset)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
              <button
                type="button"
                onClick={() => setEventTab('upcoming')}
                style={{
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: eventTab === 'upcoming' ? 'var(--pine-dark)' : 'transparent',
                  color: eventTab === 'upcoming' ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                Mendatang
              </button>
              <button
                type="button"
                onClick={() => setEventTab('completed')}
                style={{
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: eventTab === 'completed' ? 'var(--pine-dark)' : 'transparent',
                  color: eventTab === 'completed' ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                Selesai
              </button>
            </div>
          )}
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Menampilkan {filtered.length} {schema.label.toLowerCase()}
        </span>
      </div>

      {/* ═══════ Desktop Table (Image 02 / 03) ═══════ */}
      <div className="admin-soft-card" style={{ padding: '0.5rem', overflow: 'hidden' }}>
        <div className="admin-soft-table-wrap" style={{ border: 'none' }}>
          <table className="admin-soft-table">
            <thead>
              {type === 'news' && (
                <tr>
                  <th style={{ width: '80px', textAlign: 'center' }}>Urutan</th>
                  <th style={{ width: '80px' }}>Foto</th>
                  <th>Judul</th>
                  <th style={{ width: '130px' }}>Kategori</th>
                  <th style={{ width: '120px' }}>Tanggal</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Aksi</th>
                </tr>
              )}
              {type === 'articles' && (
                <tr>
                  <th>Judul</th>
                  <th style={{ width: '140px' }}>Penulis</th>
                  <th style={{ width: '130px' }}>Kategori</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Aksi</th>
                </tr>
              )}
              {type === 'events' && (
                <tr>
                  <th>Kegiatan</th>
                  <th style={{ width: '140px' }}>Tanggal</th>
                  <th>Lokasi</th>
                  <th style={{ width: '110px' }}>Status</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Aksi</th>
                </tr>
              )}
              {type === 'schools' && (
                <tr>
                  <th>Sekolah</th>
                  <th style={{ width: '90px' }}>Jenjang</th>
                  <th>Pengelola / Pembina</th>
                  <th style={{ width: '100px' }}>Anggota</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Aksi</th>
                </tr>
              )}
            </thead>
            <tbody>
              {filtered.map((item, idx) => {
                const imgUrl = item.image ? getDirectImageUrl(item.image) : '';
                return (
                  <tr key={item.id}>
                    {/* News row */}
                    {type === 'news' && (
                      <>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--pine-dark)', minWidth: '18px' }}>
                              {item.order || idx + 1}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <button
                                type="button"
                                onClick={() => handleMoveOrder(item, -1)}
                                disabled={idx === 0}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', color: idx === 0 ? '#CBD5E1' : 'var(--pine-dark)' }}
                                aria-label="Pindah naik"
                              >
                                <ChevronUp size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveOrder(item, 1)}
                                disabled={idx === filtered.length - 1}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', color: idx === filtered.length - 1 ? '#CBD5E1' : 'var(--pine-dark)' }}
                                aria-label="Pindah turun"
                              >
                                <ChevronDown size={12} />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              width: 54,
                              height: 38,
                              borderRadius: '6px',
                              overflow: 'hidden',
                              backgroundColor: 'var(--surface-inset)',
                              border: '1px solid var(--border-default)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {imgUrl ? (
                              <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                            ) : (
                              <Newspaper size={16} style={{ color: 'var(--text-muted)' }} />
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--pine-dark)' }}>{item.title}</div>
                          {item.excerpt && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '420px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.excerpt}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="badge-soft-brass">{item.category || 'Organisasi'}</span>
                        </td>
                        <td style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                          {item.date || '—'}
                        </td>
                      </>
                    )}

                    {/* Articles row */}
                    {type === 'articles' && (
                      <>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--pine-dark)' }}>{item.title}</div>
                        </td>
                        <td style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                          {item.author || 'Tim ROKABA'}
                        </td>
                        <td>
                          <span className="badge-soft-brass">{item.category || 'Motivasi'}</span>
                        </td>
                      </>
                    )}

                    {/* Events row */}
                    {type === 'events' && (
                      <>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--pine-dark)' }}>{item.title}</div>
                        </td>
                        <td style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                          {item.date || '—'}
                        </td>
                        <td style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                          {item.location || '—'}
                        </td>
                        <td>
                          <span className={item.status === 'completed' ? 'badge-soft-brass' : 'badge-soft-pine'}>
                            {item.status === 'completed' ? 'Selesai' : 'Mendatang'}
                          </span>
                        </td>
                      </>
                    )}

                    {/* Schools row */}
                    {type === 'schools' && (
                      <>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--pine-dark)' }}>{item.name}</div>
                          {item.address && <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{item.address}</div>}
                        </td>
                        <td>
                          <span className="badge-soft-pine">{item.type || 'SMA'}</span>
                        </td>
                        <td style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                          {item.pembina || 'Tim ROHIS Sekolah'}
                        </td>
                        <td style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                          {item.memberCount || 0}
                        </td>
                      </>
                    )}

                    {/* Actions column */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="btn-secondary-soft"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                          onClick={() => {
                            setEditing({ ...item });
                            setIsNew(false);
                          }}
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="btn-secondary-soft"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', color: 'var(--status-red)' }}
                          onClick={() => setItemToDelete(item)}
                          aria-label="Hapus"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                    Tidak ada {schema.label.toLowerCase()} yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════ Responsive Edit Modal (Image 07 Upper Left) ═══════ */}
      {editing && (
        <div
          className="modal-backdrop-responsive"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditing(null);
              setIsNew(false);
            }
          }}
        >
          <div className="modal-card-responsive">
            <div className="modal-header-responsive">
              <h3>
                {isNew ? 'Tambah' : 'Edit'} {schema.label.toLowerCase()}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setEditing(null);
                  setIsNew(false);
                }}
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', overflow: 'hidden' }}>
              <div className="modal-body-responsive">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '1.15rem',
                  }}
                  className="modal-grid-2col"
                >
                  {schema.fields.map((field) => {
                    if (field.type === 'image') {
                      return (
                        <div key={field.key} style={{ gridColumn: 'span 2' }}>
                          <ImageUploadField
                            label={field.label}
                            required={field.required}
                            value={editing[field.key] || ''}
                            onChange={(val) => setEditing({ ...editing, [field.key]: val })}
                          />
                        </div>
                      );
                    }

                    return (
                      <div
                        key={field.key}
                        style={{ gridColumn: field.gridSpan === 2 ? 'span 2' : 'span 1' }}
                      >
                        <label className={`form-label-soft ${field.required ? 'form-label-required' : ''}`}>
                          {field.label}
                        </label>

                        {field.type === 'textarea' ? (
                          <textarea
                            rows={field.rows || 3}
                            className="form-textarea-soft"
                            placeholder={field.placeholder || ''}
                            value={editing[field.key] || ''}
                            onChange={(e) => setEditing({ ...editing, [field.key]: e.target.value })}
                            required={field.required}
                          />
                        ) : field.type === 'select' ? (
                          <select
                            className="form-select-soft"
                            value={editing[field.key] || field.options[0]}
                            onChange={(e) => setEditing({ ...editing, [field.key]: e.target.value })}
                          >
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type || 'text'}
                            className="form-input-soft"
                            placeholder={field.placeholder || ''}
                            value={editing[field.key] !== undefined ? editing[field.key] : ''}
                            onChange={(e) => {
                              const val = field.type === 'number' ? Number(e.target.value) : e.target.value;
                              const next = { ...editing, [field.key]: val };
                              if (field.key === 'title' && (!editing.slug || isNew)) {
                                next.slug = String(val)
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, '-')
                                  .replace(/(^-|-$)+/g, '');
                              }
                              setEditing(next);
                            }}
                            required={field.required}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="modal-footer-responsive">
                <button
                  type="button"
                  className="btn-secondary-soft"
                  onClick={() => {
                    setEditing(null);
                    setIsNew(false);
                  }}
                >
                  Batal
                </button>
                <button type="submit" className="btn-pine">
                  Simpan {schema.label.toLowerCase()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════ Confirmation Delete Dialog (Image 07 Upper Right) ═══════ */}
      {itemToDelete && (
        <div
          className="modal-backdrop-responsive"
          onClick={(e) => {
            if (e.target === e.currentTarget) setItemToDelete(null);
          }}
        >
          <div className="modal-card-responsive" style={{ maxWidth: 440 }}>
            <div className="modal-header-responsive">
              <h3>Hapus konten?</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setItemToDelete(null)}
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-responsive" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'var(--status-red)',
                }}
              >
                <Trash2 size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pine-dark)', marginBottom: '4px' }}>
                  {itemToDelete.title || itemToDelete.name || 'Item yang dipilih'}
                </h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Konten ini akan dihapus. Pastikan Anda sudah memeriksanya.
                </p>
              </div>
            </div>

            <div className="modal-footer-responsive">
              <button
                type="button"
                className="btn-secondary-soft"
                onClick={() => setItemToDelete(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-danger-soft"
                onClick={executeDelete}
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
