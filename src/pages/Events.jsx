import { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  AccessibleDialog,
  Container,
  SoftCard,
  formatIndonesianDate,
  formatShortDayMonth,
} from '../components/ui/SoftUI';

const UPCOMING_REFERENCE_EVENTS = [
  {
    id: 'kajian-pelajar',
    title: 'Kajian pelajar',
    subtitle: 'Informasi menyusul',
    description:
      'Majelis ilmu dan diskusi keislaman lintas SMA, SMK, dan MA se-Kabupaten Banyumas untuk mempererat ukhuwah serta memperkaya wawasan pelajar Muslim.',
  },
  {
    id: 'forum-silaturahmi',
    title: 'Forum silaturahmi',
    subtitle: 'Informasi menyusul',
    description:
      'Pertemuan rutin pengurus dan kader ROHIS se-Kabupaten Banyumas untuk berbagi pengalaman organisasi, kolaborasi kegiatan, dan penguatan dakwah sekolah.',
  },
];

export default function Events() {
  const { events } = useData();
  const [tab, setTab] = useState('Mendatang');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const cmsEvents = Array.isArray(events) ? events : [];

  return (
    <div className="rk-page">
      {/* 1. HEADER */}
      <section className="rk-page-header">
        <Container>
          <div className="rk-eyebrow" style={{ marginBottom: '8px' }}>
            <span className="rk-eyebrow-bar" aria-hidden="true" />
          </div>

          <h1 className="rk-page-title">Agenda bersama</h1>
        </Container>
      </section>

      {/* 2. FILTER BAR + EVENT ROWS */}
      <section className="rk-section" style={{ paddingTop: '8px' }}>
        <Container>
          <div className="rk-filter-bar">
            <div
              className="rk-filter-pills"
              role="group"
              aria-label="Filter status agenda"
            >
              {['Mendatang', 'Arsip'].map((item) => (
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
              <button
                type="button"
                onClick={() =>
                  setTab((prev) =>
                    prev === 'Mendatang' ? 'Arsip' : 'Mendatang'
                  )
                }
                aria-label="Periode sebelumnya"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontWeight: 700,
                }}
              >
                ←
              </button>
              <span>Bulan ini</span>
              <button
                type="button"
                onClick={() =>
                  setTab((prev) =>
                    prev === 'Mendatang' ? 'Arsip' : 'Mendatang'
                  )
                }
                aria-label="Periode berikutnya"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontWeight: 700,
                }}
              >
                →
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '14px' }}>
            {tab === 'Mendatang'
              ? UPCOMING_REFERENCE_EVENTS.map((ev) => (
                  <SoftCard
                    key={ev.id}
                    as="button"
                    type="button"
                    interactive
                    className="rk-event-row"
                    onClick={() => setSelectedEvent(ev)}
                    style={{ textAlign: 'left', cursor: 'pointer', width: '100%' }}
                  >
                    <div className="rk-event-date-box" aria-hidden="true">
                      <span style={{ fontSize: '1.15rem' }}>—</span>
                    </div>

                    <span
                      aria-hidden="true"
                      style={{
                        width: '1px',
                        height: '38px',
                        background: 'var(--rk-line)',
                      }}
                    />

                    <div>
                      <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                        {ev.title}
                      </h2>
                      <p style={{ fontSize: '0.88rem', marginTop: '2px' }}>
                        {ev.subtitle}
                      </p>
                    </div>

                    <span
                      aria-hidden="true"
                      style={{ fontSize: '1.05rem', fontWeight: 700 }}
                    >
                      →
                    </span>
                  </SoftCard>
                ))
              : cmsEvents.map((ev, idx) => {
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
                        <span style={{ fontSize: '0.95rem', lineHeight: 1.1 }}>
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
                          height: '38px',
                          background: 'var(--rk-line)',
                        }}
                      />

                      <div>
                        <h2 style={{ fontSize: '1.12rem', fontWeight: 800 }}>
                          {ev.title}
                        </h2>
                        <p style={{ fontSize: '0.86rem', marginTop: '2px' }}>
                          {ev.location || formatIndonesianDate(ev.date)}
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
        eyebrow="Informasi Kegiatan ROKABA"
        title={selectedEvent?.title || 'Detail Agenda'}
      >
        {selectedEvent && (
          <div style={{ display: 'grid', gap: '12px' }}>
            <p style={{ fontSize: '0.94rem', lineHeight: 1.6 }}>
              {selectedEvent.description ||
                'Kegiatan kebersamaan dan pembinaan pelajar Muslim SMA, SMK, dan MA se-Kabupaten Banyumas.'}
            </p>
            <div className="rk-inset-panel" style={{ fontSize: '0.88rem' }}>
              <strong>Waktu & Tempat: </strong>
              <span>
                {selectedEvent.date
                  ? `${formatIndonesianDate(selectedEvent.date)} • ${
                      selectedEvent.location || 'Kabupaten Banyumas'
                    }`
                  : 'Jadwal pelaksanaan akan diumumkan melalui kanal resmi ROKABA.'}
              </span>
            </div>
          </div>
        )}
      </AccessibleDialog>
    </div>
  );
}
