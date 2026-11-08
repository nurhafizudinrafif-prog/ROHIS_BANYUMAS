import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getMediaUrl } from '@shared/services/mediaHelper';
import {
  Container,
  PageHeader,
  SoftCard,
  AccessibleDialog,
  EmptyState,
  getJakartaToday,
  isEventUpcoming,
  formatIndonesianDate,
  formatShortDayMonth,
} from '../components/ui/SoftUI';

export default function Events() {
  const { events = [] } = useData();
  const todayStr = getJakartaToday();

  const { upcomingList, archivedList } = useMemo(() => {
    const up = [];
    const ar = [];
    events.forEach((ev) => {
      if (isEventUpcoming(ev, todayStr)) {
        up.push(ev);
      } else {
        ar.push(ev);
      }
    });
    up.sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
    ar.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    return { upcomingList: up, archivedList: ar };
  }, [events, todayStr]);

  const [statusTab, setStatusTab] = useState('Mendatang');
  const [activeType, setActiveType] = useState('Semua');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventTypes = useMemo(() => {
    const types = new Set(['Semua']);
    events.forEach((ev) => {
      if (ev.type) types.add(ev.type);
    });
    return Array.from(types);
  }, [events]);

  // Sumber daftar sesuai tab, namun jika Mendatang kosong kita tetap tampilkan arsip di bawah pemberitahuan jujur
  const baseEvents = useMemo(() => {
    if (statusTab === 'Mendatang') {
      return upcomingList.length > 0 ? upcomingList : archivedList;
    }
    if (statusTab === 'Arsip') {
      return archivedList;
    }
    return [...upcomingList, ...archivedList];
  }, [statusTab, upcomingList, archivedList]);

  const filteredEvents = useMemo(() => {
    if (activeType === 'Semua') return baseEvents;
    return baseEvents.filter(
      (ev) => String(ev.type || '').toLowerCase() === activeType.toLowerCase()
    );
  }, [baseEvents, activeType]);

  return (
    <div className="rk-page">
      <PageHeader
        breadcrumb={[{ label: 'Beranda', to: '/' }, { label: 'Agenda' }]}
        title="Agenda bersama"
        lead="Jadwal pertemuan, pelatihan, dan kegiatan kolaborasi ROHIS Kabupaten Banyumas."
      />

      <section className="rk-section" aria-label="Daftar agenda kegiatan">
        <Container>
          {/* Baris Filter Status (Mendatang / Arsip) & Jenis Kegiatan */}
          <div className="rk-filter-bar">
            <div className="rk-filter-pills" role="tablist" aria-label="Status jadwal agenda">
              {['Mendatang', 'Arsip', 'Semua'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={statusTab === tab}
                  className="rk-pill"
                  onClick={() => setStatusTab(tab)}
                >
                  {tab === 'Mendatang' && `Mendatang (${upcomingList.length})`}
                  {tab === 'Arsip' && `Arsip (${archivedList.length})`}
                  {tab === 'Semua' && `Semua (${events.length})`}
                </button>
              ))}
            </div>

            {eventTypes.length > 1 && (
              <div className="rk-filter-pills" role="group" aria-label="Filter jenis agenda">
                {eventTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="rk-pill"
                    aria-pressed={activeType === t}
                    onClick={() => setActiveType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pemberitahuan jujur apabila tab Mendatang dipilih namun jadwal mendatang belum ada */}
          {statusTab === 'Mendatang' && upcomingList.length === 0 && archivedList.length > 0 && (
            <SoftCard
              variant="inset"
              style={{
                marginBottom: '20px',
                padding: '16px 20px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--rk-ink)' }}>
                <strong>Info Jadwal:</strong> Saat ini belum ada jadwal agenda mendatang yang baru. Berikut dokumentasi agenda terakhir yang telah terlaksana (Arsip):
              </p>
              <button
                type="button"
                className="rk-pill"
                onClick={() => setStatusTab('Arsip')}
              >
                Beralih ke tab Arsip
              </button>
            </SoftCard>
          )}

          {filteredEvents.length === 0 ? (
            <EmptyState
              title="Belum ada agenda pada kategori ini"
              description="Silakan pilih filter Semua untuk melihat seluruh riwayat kegiatan ROKABA."
              action={
                <button
                  type="button"
                  className="rk-btn-secondary"
                  onClick={() => {
                    setStatusTab('Semua');
                    setActiveType('Semua');
                  }}
                >
                  Tampilkan semua agenda
                </button>
              }
            />
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {filteredEvents.map((ev) => {
                const { day, month } = formatShortDayMonth(ev.date);
                const upcoming = isEventUpcoming(ev, todayStr);

                return (
                  <SoftCard
                    key={ev.id}
                    as="article"
                    interactive
                    className="rk-event-row"
                    onClick={() => setSelectedEvent(ev)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedEvent(ev);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rk-event-date-box" aria-hidden="true">
                      <strong>{day}</strong>
                      <span>{month}</span>
                    </div>

                    <div>
                      <div className="rk-meta-line" style={{ marginBottom: '4px' }}>
                        <span
                          className={`rk-badge ${
                            upcoming ? 'rk-badge--pine' : 'rk-badge--brass'
                          }`}
                        >
                          {upcoming ? 'Mendatang' : 'Arsip • Terlaksana'}
                        </span>
                        {ev.type && (
                          <>
                            <span>•</span>
                            <span>{ev.type}</span>
                          </>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1.12rem', marginBottom: '4px' }}>
                        {ev.title}
                      </h3>

                      <p style={{ fontSize: '0.9rem' }}>
                        {ev.location || 'Kabupaten Banyumas'}
                        {ev.time ? ` • ${ev.time}` : ''}
                      </p>
                    </div>

                    <div>
                      <span className="rk-card-link" style={{ marginTop: 0 }}>
                        <span>Lihat detail</span>
                        <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </SoftCard>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      <AccessibleDialog
        open={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        eyebrow={
          selectedEvent
            ? isEventUpcoming(selectedEvent, todayStr)
              ? 'Agenda Mendatang'
              : 'Arsip Kegiatan Terlaksana'
            : 'Detail Agenda'
        }
        title={selectedEvent?.title || ''}
      >
        {selectedEvent && (
          <div style={{ display: 'grid', gap: '16px' }}>
            {selectedEvent.image && (
              <div
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid var(--rk-line)',
                  aspectRatio: '16/9',
                }}
              >
                <img
                  src={getMediaUrl(selectedEvent.image)}
                  alt={selectedEvent.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <div className="rk-inset-panel" style={{ padding: '16px 18px', display: 'grid', gap: '8px' }}>
              <div style={{ fontSize: '0.9rem' }}>
                <strong style={{ color: 'var(--rk-ink)' }}>Tanggal: </strong>
                <span style={{ color: 'var(--rk-muted)' }}>
                  {formatIndonesianDate(selectedEvent.date)}
                </span>
              </div>
              {selectedEvent.time && (
                <div style={{ fontSize: '0.9rem' }}>
                  <strong style={{ color: 'var(--rk-ink)' }}>Waktu: </strong>
                  <span style={{ color: 'var(--rk-muted)' }}>{selectedEvent.time}</span>
                </div>
              )}
              <div style={{ fontSize: '0.9rem' }}>
                <strong style={{ color: 'var(--rk-ink)' }}>Lokasi: </strong>
                <span style={{ color: 'var(--rk-muted)' }}>
                  {selectedEvent.location || 'Kabupaten Banyumas'}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                <strong style={{ color: 'var(--rk-ink)' }}>Status: </strong>
                <span style={{ color: 'var(--rk-brass-text)', fontWeight: 600 }}>
                  {isEventUpcoming(selectedEvent, todayStr)
                    ? 'Mendatang'
                    : 'Telah terlaksana (Arsip)'}
                </span>
              </div>
            </div>

            {selectedEvent.description && <p>{selectedEvent.description}</p>}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingTop: '4px' }}>
              <Link
                to="/contact"
                className="rk-btn-primary"
                onClick={() => setSelectedEvent(null)}
              >
                Hubungi Panitia / Pengurus
              </Link>
              <button
                type="button"
                className="rk-btn-secondary"
                onClick={() => setSelectedEvent(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </AccessibleDialog>
    </div>
  );
}
