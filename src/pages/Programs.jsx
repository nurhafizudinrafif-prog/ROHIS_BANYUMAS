import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
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
    spotlightTitle: 'Program Pembinaan & Dakwah',
    spotlightDescription:
      'Wadah belajar, kajian rutin Ahad pagi, halaqah tarbiyah, dan penguatan nilai-nilai Islam rahmatan lil alamin bagi pelajar SMA, SMK, dan MA di Banyumas.',
  },
  {
    id: 'kepemimpinan',
    title: 'Kepemimpinan',
    subtitle: 'Pengembangan potensi dan kapasitas pelajar',
    spotlightTitle: 'Program Kepemimpinan & SDM',
    spotlightDescription:
      'Latihan Dasar Kepemimpinan (LDK) ROHIS, Musyawarah Kerja Daerah (Muskerda), upgrading manajemen organisasi, serta jurnalistik dan media kreatif pelajar.',
  },
  {
    id: 'kepedulian',
    title: 'Kepedulian',
    subtitle: 'Aksi nyata untuk lingkungan sekitar',
    spotlightTitle: 'Program Kepedulian & Sinergi Umat',
    spotlightDescription:
      'Gerakan ROKABA Peduli, distribusi paket belajar pelajar dhuafa, bakti sosial Ramadhan, bersih masjid, serta kemitraan bersama Kemenag Kabupaten Banyumas.',
  },
];

const RBC_BRANCHES = [
  {
    title: 'Lomba Da’i Muda / Pildarem',
    desc: 'Kompetisi syiar dan public speaking dakwah pelajar tingkat SMA/SMK/MA se-Banyumas.',
  },
  {
    title: 'MTQ & Tartil Al-Qur’an',
    desc: 'Musabaqah Tilawatil Qur’an untuk menumbuhkan kecintaan dan keindahan bacaan Al-Qur’an.',
  },
  {
    title: 'Cover Sholawat & Nasyid',
    desc: 'Apresiasi seni suara Islami dan kreativitas musik positif generasi muda.',
  },
  {
    title: 'Desain Poster Digital Dakwah',
    desc: 'Lomba infografis dan visual dakwah kreatif untuk syiar di media sosial.',
  },
  {
    title: 'Cerdas Cermat Agama Islam (CCAI)',
    desc: 'Adu wawasan keislaman, sejarah peradaban Islam, fiqih, dan Al-Qur’an Hadits.',
  },
];

export default function Programs() {
  const { programs, team } = useData();
  const { departments } = team || {};
  const { divisions } = normalizeTeamData(team);
  const [activeId, setActiveId] = useState('pembinaan');

  const activePillar =
    PROGRAM_PILLARS.find((p) => p.id === activeId) || PROGRAM_PILLARS[0];

  const cmsPrograms = Array.isArray(programs) ? programs : [];

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

      {/* 2. THREE SELECTABLE 3D PILLAR CARDS + SPOTLIGHT BANNER */}
      <section className="rk-section" style={{ paddingTop: '8px' }}>
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
                    minHeight: '144px',
                  }}
                >
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <h2 style={{ fontSize: '1.24rem', fontWeight: 800 }}>
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

          {/* Spotlight Card */}
          <SoftCard
            style={{
              marginTop: '18px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              padding: 'clamp(20px, 2.5vw, 28px)',
            }}
          >
            <div style={{ maxWidth: '64ch', display: 'grid', gap: '8px' }}>
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
                <h2 style={{ fontSize: 'clamp(1.28rem, 2vw, 1.6rem)' }}>
                  {activePillar.spotlightTitle}
                </h2>
              </div>

              <p
                style={{
                  paddingLeft: '15px',
                  fontSize: '0.93rem',
                  lineHeight: 1.55,
                }}
              >
                {activePillar.spotlightDescription}
              </p>
            </div>

            <PrimaryButton as="a" href="#divisi-program">
              <span>Lihat kegiatan</span>
              <span aria-hidden="true">→</span>
            </PrimaryButton>
          </SoftCard>
        </Container>
      </section>

      {/* 3. PROGRAM KERJA LENGKAP 5 DIVISI ROKABA (DARI ROHIS-BANYUMAS.WEB.ID) */}
      <section id="divisi-program" className="rk-section">
        <Container>
          <div className="rk-inline-section-head">
            <h2>Program kerja 5 divisi utama</h2>
            <span className="rk-inline-section-sep" aria-hidden="true" />
            <p>
              Rincian program kerja masing-masing divisi kepengurusan ROKABA
              Periode 2025/2026.
            </p>
          </div>

          <div className="rk-grid-2">
            {cmsPrograms.map((prog) => {
              const matchedDept = Array.isArray(departments)
                ? departments.find((d) =>
                    d.name
                      .toLowerCase()
                      .includes((prog.division || '').toLowerCase())
                  )
                : null;
              const matchedDiv = divisions.find(
                (d) =>
                  (d.shortName || '').toLowerCase() ===
                  (prog.division || '').toLowerCase()
              );
              const coordinator =
                matchedDept?.head ||
                matchedDiv?.members?.find((m) => m.role === 'Koordinator')
                  ?.name;

              return (
                <SoftCard
                  key={prog.id || prog.title}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        marginBottom: '6px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--rk-brass-text)',
                        }}
                      >
                        DIVISI {prog.division}
                      </span>
                      {coordinator && (
                        <span className="rk-doc-badge">
                          Koordinator: {coordinator}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                      {prog.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.88rem',
                        lineHeight: 1.55,
                        marginTop: '6px',
                      }}
                    >
                      {prog.description}
                    </p>
                  </div>

                  {Array.isArray(prog.details) && prog.details.length > 0 && (
                    <div className="rk-inset-panel" style={{ padding: '14px 16px' }}>
                      <strong
                        style={{
                          display: 'block',
                          fontSize: '0.82rem',
                          color: 'var(--rk-ink)',
                          marginBottom: '8px',
                        }}
                      >
                        Agenda & Rencana Kerja:
                      </strong>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: '18px',
                          display: 'grid',
                          gap: '5px',
                          fontSize: '0.84rem',
                          color: 'var(--rk-ink)',
                        }}
                      >
                        {prog.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </SoftCard>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. EVENT BESAR TAHUNAN: ROHIS BANYUMAS COMPETITION (RBC) X PECETIKAH */}
      <section className="rk-section">
        <Container>
          <SoftCard style={{ padding: 'clamp(20px, 2.8vw, 30px)' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '18px',
              }}
            >
              <div>
                <div className="rk-eyebrow" style={{ marginBottom: '6px' }}>
                  <span className="rk-eyebrow-bar" aria-hidden="true" />
                  <span>EVENT AKBAR TAHUNAN KABUPATEN</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.8rem)' }}>
                  Rohis Banyumas Competition (RBC) × PECETIKAH
                </h2>
                <p style={{ fontSize: '0.9rem', marginTop: '4px', maxWidth: '68ch' }}>
                  Ajang kompetisi syiar, bakat, dan kreativitas pelajar Muslim
                  tingkat SMA, SMK, dan MA sederajat se-Kabupaten Banyumas di
                  bawah naungan Seksi PAI Kemenag Kabupaten Banyumas.
                </p>
              </div>

              <PrimaryButton as={Link} to="/events">
                <span>Lihat jadwal agenda</span>
                <span aria-hidden="true">→</span>
              </PrimaryButton>
            </div>

            <div className="rk-grid-5">
              {RBC_BRANCHES.map((branch) => (
                <div
                  key={branch.title}
                  className="rk-inset-panel"
                  style={{ padding: '14px', borderRadius: '14px' }}
                >
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      color: 'var(--rk-ink)',
                      marginBottom: '4px',
                    }}
                  >
                    {branch.title}
                  </strong>
                  <p style={{ fontSize: '0.78rem', lineHeight: 1.45 }}>
                    {branch.desc}
                  </p>
                </div>
              ))}
            </div>
          </SoftCard>
        </Container>
      </section>
    </div>
  );
}
