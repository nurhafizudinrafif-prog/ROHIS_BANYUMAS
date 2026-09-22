import { useState } from 'react';
import { useData } from '../context/DataContext';
import { School, Search, Users, Phone, MapPin, User } from 'lucide-react';

export default function Schools() {
  const { schools } = useData();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');

  const types = ['Semua', ...new Set((schools || []).map(s => s.type || 'SMA/SMK').filter(Boolean))];
  const filtered = (schools || [])
    .filter(s => typeFilter === 'Semua' || (s.type || 'SMA/SMK') === typeFilter)
    .filter(s =>
      (s.name || s.school || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (s.pembina || s.leader || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (s.address || '').toLowerCase().includes((search || '').toLowerCase())
    );

  return (
    <div>
      <section style={{
        background: 'var(--deep-pine)', paddingTop: '8rem', paddingBottom: '3rem', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 60%, rgba(16,185,129,0.06) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <span className="badge badge-emerald animate-fade-in-up" style={{ marginBottom: '1rem' }}><School size={14} /> Direktori</span>
          <h1 className="animate-fade-in-up delay-100" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', fontWeight: 800, color: 'var(--warm-alabaster)' }}>
            Direktori Sekolah
          </h1>
          <p className="animate-fade-in-up delay-200" style={{ color: 'rgba(245,242,237,0.55)', maxWidth: 500, marginTop: '0.75rem' }}>
            Database ROHIS SMA/SMK/MA se-Kabupaten Banyumas.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--warm-alabaster)' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(13,43,34,0.3)' }} />
              <input type="text" placeholder="Cari sekolah atau pembina..." value={search} onChange={e => setSearch(e.target.value)} className="form-input" style={{ paddingLeft: '2.75rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {types.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)} className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-ghost'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1.25rem' }}>
            {filtered.map((school, i) => (
              <div key={school.id} className="animate-fade-in-up" style={{
                animationDelay: `${i * 60}ms`, background: 'white', borderRadius: 'var(--radius-xl)',
                padding: '1.75rem', border: '1px solid rgba(13,43,34,0.06)', boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span className="badge badge-pine" style={{ marginBottom: '0.5rem' }}>{school.type || 'SMA/SMK'}</span>
                    <h3 style={{ fontSize: '1.05rem' }}>{school.name || school.school}</h3>
                  </div>
                  <div style={{
                    width: 44, height: 44, borderRadius: '12px', background: 'var(--emerald-glass)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <School size={20} style={{ color: 'var(--emerald)' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem', color: 'rgba(13,43,34,0.55)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={14} style={{ color: 'var(--antique-brass)', flexShrink: 0 }} /> {school.pembina || school.leader || 'Pembina ROHIS'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={14} style={{ color: 'var(--emerald)', flexShrink: 0 }} /> {school.memberCount || school.members || 0} anggota</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} style={{ color: 'rgba(13,43,34,0.3)', flexShrink: 0 }} /> {school.address || 'Kabupaten Banyumas'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} style={{ color: 'rgba(13,43,34,0.3)', flexShrink: 0 }} /> {school.contact || '-'}</span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(13,43,34,0.35)' }}>
              <School size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>Tidak ada sekolah ditemukan</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
