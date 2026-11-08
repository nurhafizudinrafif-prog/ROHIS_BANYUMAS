import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Container,
  PageHeader,
  SoftCard,
  AccessibleDialog,
  normalizeTeamData,
} from '../components/ui/SoftUI';

const CORE_PILLARS = [
  {
    id: 'sdm',
    divisionKey: 'SDM',
    title: 'Pembinaan & Kaderisasi',
    fieldLabel: 'Bidang SDM',
    summary:
      'Latihan kepemimpinan, halaqah pelajar, dan penguatan karakter pengurus ROHIS.',
    spotlightTitle: 'Program Pembinaan / SDM',
    spotlightBody:
      'Fokus pada pembentukan pengurus ROHIS yang berakhlak, terampil memimpin, dan siap menghidupkan kegiatan positif di sekolah.',
    highlights: [
      'Latihan Dasar Kepemimpinan ROHIS',
      'Pendampingan pengurus sekolah',
      'Forum silaturahmi lintas sekolah',
    ],
  },
  {
    id: 'dakwah',
    divisionKey: 'Dakwah',
    title: 'Syiar & Kegiatan Bersama',
    fieldLabel: 'Bidang Syiar',
    summary:
      'Kajian pelajar, peringatan hari besar Islam, dan kolaborasi lintas sekolah.',
    spotlightTitle: 'Program Syiar & Dakwah',
    spotlightBody:
      'Menghadirkan ruang kajian dan kegiatan keislaman yang menyejukkan, relevan dengan keseharian remaja, serta mempererat ukhuwah lintas sekolah.',
    highlights: [
      'Kajian Ahad Pagi rutin se-Kabupaten Banyumas',
      'Safari Dakwah ke sekolah-sekolah se-Banyumas',
      'Peringatan Hari Besar Islam (PHBI) bersama pelajar',
    ],
  },
  {
    id: 'jurnalistik',
    divisionKey: 'Jurnalistik',
    title: 'Media & Literasi',
    fieldLabel: 'Bidang Media',
    summary:
      'Pengelolaan publikasi, dokumentasi kegiatan, desain kreatif, dan tulisan pelajar.',
    spotlightTitle: 'Program Media & Jurnalistik',
    spotlightBody:
      'Mengembangkan kapasitas jurnalistik, desain visual, dan pengelolaan media sosial agar pesan kebaikan pelajar Banyumas tersampaikan secara jernih.',
    highlights: [
      'Produksi konten dakwah kreatif Instagram, TikTok & YouTube',
      'Penerbitan artikel dakwah dan buletin digital',
      'Workshop jurnalistik, desain grafis & media dakwah',
    ],
  },
  {
    id: 'humas',
    divisionKey: 'HUMAS',
    title: 'Hubungan Masyarakat',
    fieldLabel: 'Bidang Humas',
    summary:
      'Jembatan silaturahmi antar-sekolah anggota, kemitraan strategis, dan kepedulian sosial.',
    spotlightTitle: 'Program Hubungan Masyarakat',
    spotlightBody:
      'Menjaga komunikasi aktif dengan pembina dan pengurus ROHIS di puluhan sekolah anggota serta membangun kolaborasi strategis.',
    highlights: [
      'Koordinasi dan silaturahmi antar ROHIS sekolah se-Banyumas',
      'Aksi sosial peduli umat dan pelajar',
      'Penyelenggaraan forum konsolidasi lintas generasi',
    ],
  },
  {
    id: 'danus',
    divisionKey: 'DANUS',
    title: 'Kemandirian & Kewirausahaan',
    fieldLabel: 'Bidang Danus',
    summary:
      'Pengembangan kemandirian kas organisasi, atribut resmi kader, dan edukasi wirausaha pelajar.',
    spotlightTitle: 'Program Dana Usaha (DANUS)',
    spotlightBody:
      'Membangun kemandirian finansial organisasi melalui kegiatan kewirausahaan halal, pengadaan merchandise resmi, dan kemitraan.',
    highlights: [
      'Pengadaan merchandise resmi ROHIS (kaos, pin, totebag)',
      'Bazaar kewirausahaan pada event besar ROHIS',
      'Edukasi dasar entrepreneurship syariah untuk pelajar',
    ],
  },
];

export default function Programs() {
  const { programs = [], team } = useData();
  const { divisions } = normalizeTeamData(team);
  const [selectedId, setSelectedId] = useState(CORE_PILLARS[0].id);
  const [dialogProgram, setDialogProgram] = useState(null);

  const mergedPillars = CORE_PILLARS.map((pillar) => {
    const cmsMatch = programs.find(
      (p) =>
        String(p.division || '').toLowerCase() === pillar.divisionKey.toLowerCase() ||
        String(p.title || '').toLowerCase().includes(pillar.id)
    );
    const matchedDiv = divisions.find(
      (d) =>
        String(d.shortName || '').toLowerCase() === pillar.divisionKey.toLowerCase() ||
        String(d.id || '').toLowerCase() === pillar.id
    );

    const agendas =
      Array.isArray(cmsMatch?.details) && cmsMatch.details.length > 0
        ? cmsMatch.details
        : Array.isArray(cmsMatch?.agendas) && cmsMatch.agendas.length > 0
        ? cmsMatch.agendas
        : pillar.highlights;

    return {
      ...pillar,
      cmsTitle: cmsMatch?.title || pillar.title,
      cmsDescription: cmsMatch?.description || pillar.spotlightBody,
      agendas,
      members: matchedDiv?.members || [],
    };
  });

  const activePillar =
    mergedPillars.find((p) => p.id === selectedId) || mergedPillars[0];

  return (
    <div className="rk-page">
      <PageHeader
        breadcrumb={[{ label: 'Beranda', to: '/' }, { label: 'Program' }]}
        title="Ruang belajar dan berkarya"
        lead="Program ROKABA dirancang agar pengurus ROHIS memiliki ruang pembinaan, kepemimpinan, media kreatif, dan pelayanan sebaya."
      />

      {/* 3 Pilar Utama + 2 Bidang Pendukung */}
      <section className="rk-section" aria-label="Daftar bidang program ROKABA">
        <Container>
          <div className="rk-grid-3">
            {mergedPillars.slice(0, 3).map((pillar) => {
              const isSelected = pillar.id === activePillar.id;
              return (
                <SoftCard
                  key={pillar.id}
                  as="article"
                  interactive
                  selected={isSelected}
                  onClick={() => setSelectedId(pillar.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(pillar.id);
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '18px',
                  }}
                >
                  <div>
                    <h3>{pillar.title}</h3>
                    <p style={{ marginTop: '8px' }}>{pillar.summary}</p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--rk-line)',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: isSelected ? 'var(--rk-pine)' : 'var(--rk-brass-text)',
                    }}
                  >
                    <span>{pillar.fieldLabel}</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </SoftCard>
              );
            })}
          </div>

          {/* 2 Bidang Tambahan (Humas & Danus) */}
          <div className="rk-grid-2" style={{ marginTop: '20px' }}>
            {mergedPillars.slice(3).map((pillar) => {
              const isSelected = pillar.id === activePillar.id;
              return (
                <SoftCard
                  key={pillar.id}
                  as="article"
                  interactive
                  selected={isSelected}
                  onClick={() => setSelectedId(pillar.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(pillar.id);
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                  }}
                >
                  <div>
                    <h3>{pillar.title}</h3>
                    <p style={{ marginTop: '6px' }}>{pillar.summary}</p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--rk-line)',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: isSelected ? 'var(--rk-pine)' : 'var(--rk-brass-text)',
                    }}
                  >
                    <span>{pillar.fieldLabel}</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </SoftCard>
              );
            })}
          </div>

          {/* Panel Sorotan Program di Bawah (Sesuai Gambar 02-halaman-konten.png) */}
          <SoftCard
            style={{
              marginTop: '28px',
              padding: 'clamp(24px, 3.5vw, 34px)',
            }}
          >
            <div className="rk-program-spotlight">
              <div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--rk-brass-text)',
                  }}
                >
                  Sorotan program
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)',
                    marginTop: '6px',
                    marginBottom: '10px',
                    letterSpacing: '-0.025em',
                  }}
                >
                  {activePillar.spotlightTitle}
                </h2>
                <p style={{ maxWidth: '58ch' }}>{activePillar.spotlightBody}</p>

                <div
                  style={{
                    marginTop: '18px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <button
                    type="button"
                    className="rk-card-link"
                    onClick={() => setDialogProgram(activePillar)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                    }}
                  >
                    <span>Lihat kegiatan</span>
                    <span aria-hidden="true">→</span>
                  </button>

                  <Link to="/events" className="rk-card-link" style={{ color: 'var(--rk-muted)' }}>
                    <span>Jadwal agenda terkait</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              <div className="rk-inset-panel" style={{ padding: '20px 22px' }}>
                <ul className="rk-program-list">
                  {activePillar.highlights.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </SoftCard>
        </Container>
      </section>

      <AccessibleDialog
        open={Boolean(dialogProgram)}
        onClose={() => setDialogProgram(null)}
        eyebrow={dialogProgram?.fieldLabel || 'Sorotan Program'}
        title={dialogProgram?.spotlightTitle || ''}
      >
        {dialogProgram && (
          <div style={{ display: 'grid', gap: '18px' }}>
            <p>{dialogProgram.cmsDescription}</p>

            <div className="rk-inset-panel" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '0.96rem', marginBottom: '10px' }}>
                Rangkaian Kegiatan & Fokus Kerja
              </h3>
              <ul className="rk-program-list">
                {dialogProgram.agendas.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {dialogProgram.members.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.96rem', marginBottom: '10px' }}>
                  Tim Penggerak ({dialogProgram.members.length} pengurus)
                </h3>
                <div className="rk-grid-2">
                  {dialogProgram.members.slice(0, 6).map((m) => (
                    <div key={m.id} className="rk-inset-panel" style={{ padding: '12px 14px' }}>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--rk-ink)' }}>
                        {m.name}
                      </strong>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--rk-brass-text)' }}>
                        {m.role}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--rk-muted)' }}>
                        {m.school}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingTop: '4px' }}>
              <Link to="/events" className="rk-btn-primary" onClick={() => setDialogProgram(null)}>
                Lihat Agenda Terdekat
              </Link>
              <Link to="/schools#pengurus" className="rk-btn-secondary" onClick={() => setDialogProgram(null)}>
                Lihat Semua Pengurus
              </Link>
            </div>
          </div>
        )}
      </AccessibleDialog>
    </div>
  );
}
