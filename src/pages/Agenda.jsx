import { useState } from 'react';
import { useScrollAnimation } from '../utils';
import EventCard from '../components/EventCard';
import { events, eventTypes } from '../data/events';
import './Articles.css';
import './About.css';

export default function Agenda() {
  useScrollAnimation();
  const [activeType, setActiveType] = useState('Semua');
  const [activeStatus, setActiveStatus] = useState('all');

  const filtered = events.filter((e) => {
    const matchType = activeType === 'Semua' || e.type === activeType;
    const matchStatus = activeStatus === 'all' || e.status === activeStatus;
    return matchType && matchStatus;
  });

  return (
    <main className="page-agenda">
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-primary animate-hero delay-0">Agenda</span>
          <h1 className="page-hero-title animate-hero delay-1">Jadwal Kegiatan & Kajian</h1>
          <p className="page-hero-subtitle animate-hero delay-2">
            Ikuti berbagai kegiatan dakwah, pelatihan, dan sosial yang kami selenggarakan.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="articles-filter" style={{ marginBottom: 'var(--space-md)' }}>
            <button
              className={`articles-filter-btn ${activeStatus === 'all' ? 'active' : ''}`}
              onClick={() => setActiveStatus('all')}
            >
              Semua Status
            </button>
            <button
              className={`articles-filter-btn ${activeStatus === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveStatus('upcoming')}
            >
              Mendatang
            </button>
            <button
              className={`articles-filter-btn ${activeStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveStatus('completed')}
            >
              Selesai
            </button>
          </div>
          <div className="articles-filter">
            {eventTypes.map((type) => (
              <button
                key={type}
                className={`articles-filter-btn ${activeType === type ? 'active' : ''}`}
                onClick={() => setActiveType(type)}
              >
                {type}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {filtered.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center" style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2xl)' }}>
              Belum ada kegiatan di filter ini.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
