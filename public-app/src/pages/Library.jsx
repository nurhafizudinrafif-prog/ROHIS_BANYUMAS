import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Library as LibraryIcon, Download, Search, FileText, Presentation, File } from 'lucide-react';

const typeIcons = { pdf: FileText, slide: Presentation, doc: File };
const typeColors = { pdf: '#EF4444', slide: '#F59E0B', doc: '#3B82F6' };

export default function Library() {
  const { library } = useData();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Semua');

  const safeLibrary = Array.isArray(library) ? library : [];
  const categories = ['Semua', ...new Set(safeLibrary.map(l => l.category).filter(Boolean))];
  const filtered = safeLibrary
    .filter(l => catFilter === 'Semua' || l.category === catFilter)
    .filter(l => (l.title || '').toLowerCase().includes((search || '').toLowerCase()));

  return (
    <div>
      <section style={{
        background: 'var(--deep-pine)', paddingTop: '8rem', paddingBottom: '3rem', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 40%, rgba(181,141,79,0.06) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <span className="badge badge-brass animate-fade-in-up" style={{ marginBottom: '1rem' }}><LibraryIcon size={14} /> E-Library</span>
          <h1 className="animate-fade-in-up delay-100" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', fontWeight: 800, color: 'var(--warm-alabaster)' }}>
            Perpustakaan Digital
          </h1>
          <p className="animate-fade-in-up delay-200" style={{ color: 'rgba(245,242,237,0.55)', maxWidth: 500, marginTop: '0.75rem' }}>
            Unduh materi dakwah, kajian, dan slide presentasi secara gratis.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--warm-alabaster)' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(13,43,34,0.3)' }} />
              <input type="text" placeholder="Cari materi..." value={search} onChange={e => setSearch(e.target.value)} className="form-input" style={{ paddingLeft: '2.75rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map(c => (
                <button key={c} onClick={() => setCatFilter(c)} className={`btn btn-sm ${catFilter === c ? 'btn-brass' : 'btn-ghost'}`}>{c}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
            {filtered.map((item, i) => {
              const Icon = typeIcons[item.type] || FileText;
              const color = typeColors[item.type] || 'var(--emerald)';
              return (
                <div key={item.id} className="animate-fade-in-up" style={{
                  animationDelay: `${i * 60}ms`, background: 'white', borderRadius: 'var(--radius-xl)',
                  padding: '1.75rem', border: '1px solid rgba(13,43,34,0.06)', boxShadow: 'var(--shadow-sm)',
                  display: 'flex', gap: '1.25rem', alignItems: 'flex-start', transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: '14px', background: `${color}12`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={24} style={{ color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="badge" style={{ background: `${color}15`, color, fontSize: '0.68rem', textTransform: 'uppercase' }}>
                        {item.type}
                      </span>
                      <span className="badge badge-pine" style={{ fontSize: '0.68rem' }}>{item.category}</span>
                    </div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.78rem', color: 'rgba(13,43,34,0.35)' }}>{item.size}</span>
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary" style={{ padding: '0.4rem 1rem' }}>
                        <Download size={14} /> Unduh
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(13,43,34,0.35)' }}>
              <LibraryIcon size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>Tidak ada materi ditemukan</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
