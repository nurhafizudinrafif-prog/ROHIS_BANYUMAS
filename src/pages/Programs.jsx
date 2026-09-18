import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollAnimation } from '../utils';
import SectionHeader from '../components/SectionHeader';
import ProgramCard from '../components/ProgramCard';
import EventCard from '../components/EventCard';
import { programs as defaultPrograms } from '../data/programs';
import { eventTypes } from '../data/events';
import { useData } from '../context/DataContext';
import { Sparkles, Calendar, Layers, CheckCircle2 } from 'lucide-react';
import './About.css';
import './Home.css';
import './Articles.css';
import './Programs.css';

export default function Programs() {
  useScrollAnimation();
  const location = useLocation();
  const { events, programs: contextPrograms } = useData();
  const programs = (contextPrograms && contextPrograms.length > 0) ? contextPrograms : defaultPrograms;

  // Active section view: 'all' | 'programs' | 'agenda'
  const [activeSection, setActiveSection] = useState('all');

  // Agenda Filters
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeType, setActiveType] = useState('Semua');

  // Respond to hash navigation (e.g., #agenda or #programs)
  useEffect(() => {
    if (location.hash === '#agenda') {
      setActiveSection('agenda');
      setTimeout(() => {
        const el = document.getElementById('agenda-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (location.hash === '#programs' || location.hash === '#divisi') {
      setActiveSection('programs');
      setTimeout(() => {
        const el = document.getElementById('programs-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash]);

  // Filtered Events
  const filteredEvents = events.filter((e) => {
    const matchType = activeType === 'Semua' || e.type === activeType;
    const matchStatus = activeStatus === 'all' || e.status === activeStatus;
    return matchType && matchStatus;
  });

  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
  const completedCount = events.filter((e) => e.status === 'completed').length;

  return (
    <main className="page-programs">
      {/* Page Hero */}
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-primary animate-hero delay-0">Program & Agenda</span>
          <h1 className="page-hero-title animate-hero delay-1">Pilar Gerakan & Agenda Kegiatan</h1>
          <p className="page-hero-subtitle animate-hero delay-2">
            Sinergi 5 divisi utama dalam merealisasikan program dakwah, pelatihan, dan kegiatan kepemudaan Islam se-Kabupaten Banyumas.
          </p>

          {/* Quick Section Switcher / Filter */}
          <div className="programs-page-switcher animate-hero delay-3">
            <button
              className={`programs-tab-btn ${activeSection === 'all' ? 'active' : ''}`}
              onClick={() => setActiveSection('all')}
            >
              <Layers size={16} />
              <span>Semua Konten</span>
            </button>

            <button
              className={`programs-tab-btn ${activeSection === 'programs' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('programs');
                const el = document.getElementById('programs-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Sparkles size={16} />
              <span>Program Kerja 5 Divisi</span>
              <span className="programs-tab-counter">{programs.length}</span>
            </button>

            <button
              className={`programs-tab-btn ${activeSection === 'agenda' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('agenda');
                const el = document.getElementById('agenda-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Calendar size={16} />
              <span>Jadwal Agenda & Kajian</span>
              <span className="programs-tab-counter">{events.length}</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 1: PROGRAM KERJA 5 DIVISI */}
      {(activeSection === 'all' || activeSection === 'programs') && (
        <section className="section" id="programs-section">
          <div className="container">
            <SectionHeader
              badge="5 Pilar Divisi"
              title="Program Kerja & Fokus Gerakan"
              subtitle="Digerakkan secara terpadu melalui 5 divisi utama: SDM, Dakwah, Jurnalistik, HUMAS, dan DANUS untuk membentuk generasi muda Islam yang mandiri."
            />

            <div className="home-programs-grid">
              {programs.map((program, i) => (
                <ProgramCard key={program.id} program={program} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Divider between sections if 'all' is active */}
      {activeSection === 'all' && (
        <div className="programs-section-divider container">
          <div className="programs-divider-line"></div>
        </div>
      )}

      {/* SECTION 2: JADWAL AGENDA & KEGIATAN */}
      {(activeSection === 'all' || activeSection === 'agenda') && (
        <section className="section section-alt" id="agenda-section">
          <div className="container">
            <SectionHeader
              badge="Agenda & Jadwal"
              title="Jadwal Kegiatan & Kajian Terjadwal"
              subtitle="Ikuti berbagai kajian rutin, pelatihan kepemimpinan, bakti sosial, dan workshop dakwah yang diselenggarakan ROHIS Kabupaten Banyumas."
            />

            {/* Status Filter */}
            <div className="articles-filter" style={{ marginBottom: 'var(--space-md)' }}>
              <button
                className={`articles-filter-btn ${activeStatus === 'all' ? 'active' : ''}`}
                onClick={() => setActiveStatus('all')}
              >
                Semua Status ({events.length})
              </button>
              <button
                className={`articles-filter-btn ${activeStatus === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveStatus('upcoming')}
              >
                Mendatang ({upcomingCount})
              </button>
              <button
                className={`articles-filter-btn ${activeStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveStatus('completed')}
              >
                Selesai ({completedCount})
              </button>
            </div>

            {/* Event Type Filter */}
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

            {/* Event Cards List */}
            <div className="programs-events-list">
              {filteredEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>

            {/* Empty State */}
            {filteredEvents.length === 0 && (
              <div className="programs-empty-state">
                <CheckCircle2 size={32} style={{ color: '#00F0CF', margin: '0 auto var(--space-md)' }} />
                <p style={{ margin: 0, fontWeight: 600, color: '#ffffff' }}>
                  Belum ada agenda pada filter ini.
                </p>
                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.875rem' }}>
                  Silakan pilih filter status atau tipe kegiatan lainnya.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
