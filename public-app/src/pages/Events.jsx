import { useData } from '../context/DataContext';
import { Calendar, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Events() {
  const { events } = useData();
  const safeEvents = Array.isArray(events) ? events : [];
  const upcoming = safeEvents.filter(e => e.status !== 'completed').sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
  const completed = safeEvents.filter(e => e.status === 'completed').sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  return (
    <div>
      <section style={{
        background: 'var(--deep-pine)', paddingTop: '8rem', paddingBottom: '3rem', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 40%, rgba(16,185,129,0.06) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <span className="badge badge-emerald animate-fade-in-up" style={{ marginBottom: '1rem' }}><Calendar size={14} /> Agenda</span>
          <h1 className="animate-fade-in-up delay-100" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', fontWeight: 800, color: 'var(--warm-alabaster)' }}>
            Agenda Kegiatan
          </h1>
          <p className="animate-fade-in-up delay-200" style={{ color: 'rgba(245,242,237,0.55)', maxWidth: 500, marginTop: '0.75rem' }}>
            Jadwal kegiatan dakwah dan pengembangan diri ROKABA.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--warm-alabaster)' }}>
        <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
          {upcoming.length > 0 && (
            <>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} style={{ color: 'var(--emerald)' }} /> Akan Datang
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                {upcoming.map((event, i) => {
                  const d = new Date(event.date);
                  return (
                    <div key={event.id} className="animate-fade-in-up" style={{
                      animationDelay: `${i * 80}ms`, background: 'white', borderRadius: 'var(--radius-xl)',
                      padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
                      border: '1px solid rgba(13,43,34,0.06)', boxShadow: 'var(--shadow-sm)',
                      borderLeft: '4px solid var(--emerald)', transition: 'all 0.3s',
                    }}>
                      <div style={{
                        minWidth: 68, textAlign: 'center', background: 'var(--emerald-glass)',
                        borderRadius: 'var(--radius-md)', padding: '0.75rem',
                      }}>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--emerald)', lineHeight: 1 }}>{d.getDate()}</div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--emerald-dark)', marginTop: '0.15rem' }}>
                          {d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{event.title}</h3>
                        <p style={{ fontSize: '0.88rem', color: 'rgba(13,43,34,0.55)', marginBottom: '0.75rem', lineHeight: 1.6 }}>{event.description}</p>
                        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'rgba(13,43,34,0.45)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} /> {event.location}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} /> {event.time} WIB</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {completed.length > 0 && (
            <>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} style={{ color: 'rgba(13,43,34,0.3)' }} /> Selesai
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {completed.map((event, i) => {
                  const d = new Date(event.date);
                  return (
                    <div key={event.id} className="animate-fade-in-up" style={{
                      animationDelay: `${i * 80}ms`, background: 'white', borderRadius: 'var(--radius-lg)',
                      padding: '1.25rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center',
                      border: '1px solid rgba(13,43,34,0.04)', opacity: 0.7,
                    }}>
                      <div style={{ minWidth: 50, textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: 'rgba(13,43,34,0.4)' }}>{d.getDate()}</div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(13,43,34,0.3)', textTransform: 'uppercase' }}>
                          {d.toLocaleDateString('id-ID', { month: 'short' })}
                        </div>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', color: 'rgba(13,43,34,0.6)' }}>{event.title}</h4>
                        <span style={{ fontSize: '0.78rem', color: 'rgba(13,43,34,0.35)' }}>{event.location}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
