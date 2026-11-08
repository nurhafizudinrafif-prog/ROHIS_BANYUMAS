import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import {
  AccessibleDialog,
  Container,
  SoftCard,
  formatIndonesianDate,
  formatShortDayMonth,
} from '../components/ui/SoftUI';

const TABS = ['Semua', 'Mendatang', 'Arsip'];

export default function Events() {
  const { events } = useData();
  const [tab, setTab] = useState('Semua');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const cmsEvents = useMemo(
    () => (Array.isArray(events) ? events : []),
    [events]
  );

  const visibleEvents = useMemo(() => {
    if (tab === 'Mendatang') {
      return cmsEvents.filter((ev) => ev.status === 'upcoming');
    }
    if (tab === 'Arsip') {
      return cmsEvents.filter((ev) => ev.status === 'completed');
    }
    return cmsEvents;
  }, [cmsEvents, tab]);

  return (
    <div className="rk-page">
      {/* 1. HEADER */}
      <section className="rk-page-header">
        <Container>
          <div className="rk-eyebrow" style={{ marginBottom: '8px' }}>
            <span className="rk-eyebrow-bar" aria-hidden="true" />
            <span>Agenda Kegiatan ROKABA</span>
          </div>

          <h1 className="rk-page-title">Agenda bersama</h1>
          <p className="rk-page-lead">
            Jadwal kajian Ahad pagi, Latihan Dasar Kepemimpinan (LDK), bakti
            sosial, workshop jurnalistik, dan perlombaan pelajar se-Kabupaten
            Banyumas.
          </p>
        </Container>
      </section>

      {/* 2. FILTER BAR + ALL 7 REAL EVENTS */}
      <section className="rk-section" style={{ paddingTop: '8px' }}>
        <Container>
          <div className="rk-filter-bar">
            <div
              className="rk-filter-pills"
              role="group"
              aria-label="Filter status agenda"
            >
              {TABS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rk-pill"
                  aria-pressed={tab === item}
                  onClick={() => setTab(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div
              className="rk-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                padding: '7px 16px',
              }}
            >
              <span>Periode 2025/2026 • {visibleEvents.length} Kegiatan</span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '14px' }}>
            {visibleEvents.map((ev, idx) => {
              const dm = formatShortDayMonth(ev.date);
              return (
                <SoftCard
                  key={ev.id || idx}
                  as="button"
                  type="button"
                  interactive
                  className="rk-event-row"
                  onClick={() => setSelectedEvent(ev)}
                  style={{
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <div className="rk-event-date-box">
                    <span style={{ fontSize: '0.96rem', lineHeight: 1.08 }}>
                      {dm.day}
                    </span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>
                      {dm.month}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    style={{
                      width: '1px',
                      height: '44px',
                      background: 'var(--rk-line)',
                    }}
                  />

                  <div style={{ display: 'grid', gap: '3px' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: 'var(--rk-brass-text)',
                      }}
                    >
                      <span>{ev.type || 'Kegiatan'}</span>
                      {ev.time && (
                        <>
                          <span aria-hidden="true">•</span>
                          <span>{ev.time}</span>
                        </>
                      )}
                      {ev.location && (
                        <>
                          <span aria-hidden="true">•</span>
                          <span>{ev.location}</span>
                        </>
                      )}
                    </div>

                    <h2 style={{ fontSize: '1.12rem', fontWeight: 800 }}>
                      {ev.title}
                    </h2>

                    <p style={{ fontSize: '0.86rem' }}>
                      {ev.speaker ? `Pemateri: ${ev.speaker} — ` : ''}
                      {ev.description}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    style={{ fontSize: '1.05rem', fontWeight: 700 }}
                  >
                    →
                  </span>
                </SoftCard>
              );
            })}
          </div>
        </Container>
      </section>

      <AccessibleDialog
        open={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        eyebrow={`Agenda ${selectedEvent?.type || 'ROKABA'}`}
        title={selectedEvent?.title || 'Detail Agenda'}
      >
        {selectedEvent && (
          <div style={{ display: 'grid', gap: '12px' }}>
            <p style={{ fontSize: '0.94rem', lineHeight: 1.6 }}>
              {selectedEvent.description}
            </p>
            <div
              className="rk-inset-panel"
              style={{ fontSize: '0.88rem', display: 'grid', gap: '6px' }}
            >
              <div>
                <strong>Tanggal & Waktu: </strong>
                <span>
                  {formatIndonesianDate(selectedEvent.date)}{' '}
                  {selectedEvent.time ? `• ${selectedEvent.time}` : ''}
                </span>
              </div>
              {selectedEvent.location && (
                <div>
                  <strong>Lokasi: </strong>
                  <span>{selectedEvent.location}</span>
                </div>
              )}
              {selectedEvent.speaker && (
                <div>
                  <strong>Narasumber / Pemateri: </strong>
                  <span>{selectedEvent.speaker}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </AccessibleDialog>
    </div>
  );
}
