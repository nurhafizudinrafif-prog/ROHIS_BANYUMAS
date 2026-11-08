import { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  AccessibleDialog,
  Container,
  PrimaryButton,
  SoftCard,
  normalizeTeamData,
} from '../components/ui/SoftUI';

const PROGRAM_PILLARS = [
  {
    id: 'pembinaan',
    title: 'Pembinaan',
    subtitle: 'Penguatan ilmu dan karakter pelajar',
    spotlightTitle: 'Program Pembinaan',
    spotlightDescription:
      'Wadah belajar dan penguatan nilai-nilai Islam bagi pelajar SMA, SMK, dan MA di Banyumas.',
    keywords: /kader|psdm|syiar|keputrian|annisa|pembinaan|kajian/i,
  },
  {
    id: 'kepemimpinan',
    title: 'Kepemimpinan',
    subtitle: 'Pengembangan potensi dan kapasitas pelajar',
    spotlightTitle: 'Program Kepemimpinan',
    spotlightDescription:
      'Ruang latihan manajemen organisasi, kolaborasi lintas sekolah, dan pengembangan kapasitas kepemimpinan pelajar Muslim.',
    keywords: /kepemimpinan|kader|jaringan|humas|media|organisasi/i,
  },
  {
    id: 'kepedulian',
    title: 'Kepedulian',
    subtitle: 'Aksi nyata untuk lingkungan sekitar',
    spotlightTitle: 'Program Kepedulian',
    spotlightDescription:
      'Gerakan kepedulian sosial, aksi kemanusiaan, dan kontribusi nyata pelajar ROHIS untuk masyarakat Banyumas.',
    keywords: /sosial|peduli|syiar|aksi|masyarakat|ekonomi/i,
  },
];

export default function Programs() {
  const { programs, team } = useData();
  const { divisions } = normalizeTeamData(team);
  const [activeId, setActiveId] = useState('pembinaan');
  const [modalOpen, setModalOpen] = useState(false);

  const activePillar =
    PROGRAM_PILLARS.find((p) => p.id === activeId) || PROGRAM_PILLARS[0];

  const cmsPrograms = Array.isArray(programs) ? programs : [];
  const cmsDivisions = Array.isArray(divisions) ? divisions : [];

  return (
    <div className="rk-page">
      {/* 1. HEADER */}
      <section className="rk-page-header">
        <Container>
          <div className="rk-eyebrow">
            <span className="rk-eyebrow-bar" aria-hidden="true" />
            <span>Program ROKABA</span>
          </div>

          <h1 className="rk-page-title">Ruang belajar dan berkarya</h1>
        </Container>
      </section>

      {/* 2. THREE SELECTABLE 3D PILLAR CARDS */}
      <section className="rk-section" style={{ paddingTop: '10px' }}>
        <Container>
          <div className="rk-grid-3">
            {PROGRAM_PILLARS.map((pillar) => {
              const isSelected = pillar.id === activeId;
              return (
                <SoftCard
                  key={pillar.id}
                  as="button"
                  type="button"
                  interactive
                  selected={isSelected}
                  onClick={() => setActiveId(pillar.id)}
                  aria-pressed={isSelected}
                  style={{
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '154px',
                  }}
                >
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                      {pillar.title}
                    </h2>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.48 }}>
                      {pillar.subtitle}
                    </p>
                  </div>

                  <span className="rk-card-link-right">
                    <span aria-hidden="true">→</span>
                  </span>
                </SoftCard>
              );
            })}
          </div>

          {/* 3. BOTTOM SPOTLIGHT CARD */}
          <SoftCard
            style={{
              marginTop: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              padding: 'clamp(22px, 2.8vw, 30px)',
            }}
          >
            <div style={{ maxWidth: '60ch', display: 'grid', gap: '8px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '3px',
                    height: '24px',
                    borderRadius: '99px',
                    background: 'var(--rk-brass)',
                    flexShrink: 0,
                  }}
                />
                <h2 style={{ fontSize: 'clamp(1.3rem, 2vw, 1.65rem)' }}>
                  {activePillar.spotlightTitle}
                </h2>
              </div>

              <p
                style={{
                  paddingLeft: '15px',
                  fontSize: '0.94rem',
                  lineHeight: 1.55,
                }}
              >
                {activePillar.spotlightDescription}
              </p>
            </div>

            <PrimaryButton type="button" onClick={() => setModalOpen(true)}>
              <span>Lihat kegiatan</span>
              <span aria-hidden="true">→</span>
            </PrimaryButton>
          </SoftCard>
        </Container>
      </section>

      {/* ACCESSIBLE DIALOG WITH CMS PROGRAMS & DIVISION WORKPROGRAMS */}
      <AccessibleDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        eyebrow="Daftar Kegiatan & Divisi ROKABA"
        title={activePillar.spotlightTitle}
      >
        <div style={{ display: 'grid', gap: '14px' }}>
          <p style={{ fontSize: '0.92rem' }}>
            {activePillar.spotlightDescription}
          </p>

          <div style={{ display: 'grid', gap: '10px' }}>
            {(cmsPrograms.length > 0 ? cmsPrograms : cmsDivisions).map(
              (item, idx) => (
                <div
                  key={item.id || `${item.name || item.title}-${idx}`}
                  className="rk-inset-panel"
                  style={{ padding: '14px 16px', borderRadius: '14px' }}
                >
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '0.96rem',
                      color: 'var(--rk-ink)',
                    }}
                  >
                    {item.title || item.name}
                  </strong>
                  {(item.description || item.vision) && (
                    <p style={{ fontSize: '0.86rem', marginTop: '4px' }}>
                      {item.description || item.vision}
                    </p>
                  )}
                  {Array.isArray(item.programs) && item.programs.length > 0 && (
                    <ul
                      style={{
                        margin: '8px 0 0',
                        paddingLeft: '18px',
                        fontSize: '0.84rem',
                        color: 'var(--rk-muted)',
                      }}
                    >
                      {item.programs.map((prog, pIdx) => (
                        <li key={pIdx}>
                          {typeof prog === 'string' ? prog : prog.name || prog.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </AccessibleDialog>
    </div>
  );
}
