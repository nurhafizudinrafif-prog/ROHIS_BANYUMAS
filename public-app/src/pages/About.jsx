import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Container,
  PageHeader,
  SoftCard,
  PhotoFrame,
  AccessibleDialog,
  ROKABA_REAL_PHOTOS,
  normalizeTeamData,
} from '../components/ui/SoftUI';

const VALUES = [
  {
    title: 'Ukhuwah & Inklusivitas',
    description:
      'Merangkul keberagaman latar belakang pelajar SMA, SMK, dan MA se-Kabupaten Banyumas dalam suasana persaudaraan yang hangat.',
  },
  {
    title: 'Adab & Keteladanan',
    description:
      'Menempatkan akhlak mulia, rasa hormat kepada guru, dan semangat belajar sebagai fondasi setiap gerak kader ROHIS.',
  },
  {
    title: 'Karya & Kolaborasi',
    description:
      'Mendorong pelajar menghasilkan program pembinaan, literasi kreatif, dan aksi sosial yang relevan dengan kebutuhan sekolah.',
  },
];

export default function About() {
  const { home = {}, team, programs = [] } = useData();
  const [selectedDivision, setSelectedDivision] = useState(null);

  const { bph, divisions, allMembers } = normalizeTeamData(team);

  const timelineSteps = Array.isArray(home?.timeline)
    ? home.timeline
    : Array.isArray(home?.timeline?.steps)
    ? home.timeline.steps
    : [];

  const rawStats = Array.isArray(home?.stats)
    ? home.stats
    : Array.isArray(home?.stats?.items)
    ? home.stats.items
    : [];

  const statsItems =
    rawStats.length > 0
      ? rawStats.map((s) => ({
          value: `${s.value}${s.suffix || ''}`,
          label: s.label,
        }))
      : [
          { value: '15+', label: 'Dari Sekolah Kab. Banyumas' },
          { value: '53+', label: 'Anggota Aktif' },
          { value: '7+', label: 'Event Besar' },
          { value: '2017', label: 'Tahun Berdiri' },
        ];

  const aboutPhoto =
    home?.about?.photoUrl || home?.hero?.photoUrl || ROKABA_REAL_PHOTOS[1];

  return (
    <div className="rk-page">
      <PageHeader
        breadcrumb={[{ label: 'Beranda', to: '/' }, { label: 'Tentang' }]}
        title="Mengenal ROKABA"
        lead="ROHIS Kabupaten Banyumas (ROKABA) adalah wadah silaturahmi, pembinaan karakter, dan kolaborasi pelajar Muslim tingkat SMA, SMK, dan MA se-Kabupaten Banyumas."
      />

      {/* Intro + Framed Photo */}
      <section className="rk-section">
        <Container>
          <div className="rk-split-50-50" style={{ alignItems: 'center' }}>
            <SoftCard>
              <div className="rk-eyebrow">
                <span className="rk-eyebrow-bar" aria-hidden="true" />
                <span>Identitas Organisasi</span>
              </div>
              <h2 className="rk-section-title" style={{ marginBottom: '12px' }}>
                {home?.about?.title || 'Rumah tumbuh bersama bagi pengurus ROHIS lintas sekolah.'}
              </h2>
              <p style={{ marginBottom: '12px' }}>
                {home?.about?.lead ||
                  'Berdiri sejak tahun 2017 di Purwokerto, Kabupaten Banyumas, ROKABA mempertemukan para pegiat ekstrakurikuler Kerohanian Islam agar saling menguatkan.'}
              </p>
              <p>
                {home?.about?.paragraph1 ||
                  'Melalui pertukaran modul pembinaan, pelatihan kepemimpinan, hingga kegiatan syiar bersama, setiap sekolah anggota dapat bertumbuh dan berbagi inspirasi kebaikan.'}
              </p>

              <div className="rk-grid-2" style={{ marginTop: '20px' }}>
                {statsItems.map((item, idx) => (
                  <div key={idx} className="rk-inset-panel" style={{ padding: '14px 16px' }}>
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '1.35rem',
                        color: 'var(--rk-pine)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {item.value}
                    </strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--rk-muted)' }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </SoftCard>

            <PhotoFrame
              src={aboutPhoto}
              alt="Dokumentasi Musyawarah Kerja dan Kebersamaan ROHIS Kabupaten Banyumas"
              aspect="16/10"
              captionTitle={home?.about?.photoTag || 'Dokumentasi Kegiatan ROKABA'}
              captionSub="Sinergi pelajar SMA, SMK, dan MA se-Kabupaten Banyumas"
            />
          </div>
        </Container>
      </section>

      {/* Visi & Misi */}
      <section className="rk-section" aria-labelledby="rk-visi-misi-heading">
        <Container>
          <div className="rk-section-head">
            <div>
              <h2 id="rk-visi-misi-heading" className="rk-section-title">
                Visi & Misi
              </h2>
              <p className="rk-section-subtitle">
                Arah gerak pembinaan dan pelayanan pelajar Muslim di Kabupaten Banyumas.
              </p>
            </div>
          </div>

          <div className="rk-split-50-50">
            <SoftCard as="article">
              <span className="rk-badge rk-badge--brass">Visi ROKABA</span>
              <h3 style={{ marginTop: '12px', marginBottom: '10px', fontSize: '1.25rem' }}>
                Terwujudnya pelajar Muslim Banyumas yang berakhlak mulia, berdaya kepemimpinan, dan kolaboratif dalam kebaikan.
              </h3>
              <p>
                Menjadikan ROHIS di setiap sekolah sebagai ruang yang ramah, relevan dengan perkembangan zaman, serta mampu menghadirkan keteladanan positif di lingkungan teman sebaya.
              </p>
            </SoftCard>

            <SoftCard as="article">
              <span className="rk-badge rk-badge--pine">Misi Utama</span>
              <ul
                style={{
                  margin: '12px 0 0',
                  paddingLeft: '18px',
                  display: 'grid',
                  gap: '10px',
                  color: 'var(--rk-muted)',
                  fontSize: '0.94rem',
                }}
              >
                <li>
                  Mempererat ukhuwah dan jejaring komunikasi antar-pengurus ROHIS SMA, SMK, dan MA se-Kabupaten Banyumas.
                </li>
                <li>
                  Menyelenggarakan kaderisasi, pelatihan manajemen organisasi, dan pendampingan keislaman yang sejuk serta terukur.
                </li>
                <li>
                  Mengembangkan literasi digital, jurnalistik pelajar, dan media syiar kreatif yang menginspirasi.
                </li>
              </ul>
            </SoftCard>
          </div>
        </Container>
      </section>

      {/* Nilai-nilai & Jejak Perjalanan */}
      <section className="rk-section" aria-labelledby="rk-values-heading">
        <Container>
          <div className="rk-section-head">
            <h2 id="rk-values-heading" className="rk-section-title">
              Nilai yang kami jaga
            </h2>
          </div>

          <div className="rk-grid-3">
            {VALUES.map((val) => (
              <SoftCard key={val.title} as="article">
                <h3 style={{ marginBottom: '8px' }}>{val.title}</h3>
                <p>{val.description}</p>
              </SoftCard>
            ))}
          </div>

          {timelineSteps.length > 0 && (
            <div style={{ marginTop: '36px' }}>
              <div className="rk-section-head">
                <h2 className="rk-section-title">Sejarah & jejak perjalanan</h2>
              </div>
              <div className="rk-grid-4">
                {timelineSteps.slice(0, 4).map((step, idx) => (
                  <SoftCard key={step.id || idx} as="article">
                    <span className="rk-badge rk-badge--brass">{step.year}</span>
                    <h3 style={{ marginTop: '10px', marginBottom: '6px', fontSize: '1.05rem' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem' }}>{step.desc || step.description}</p>
                  </SoftCard>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Struktur Kepengurusan Ringkas (BPH + 5 Divisi) */}
      <section className="rk-section" aria-labelledby="rk-structure-heading">
        <Container>
          <div className="rk-section-head">
            <div>
              <h2 id="rk-structure-heading" className="rk-section-title">
                Struktur kepengurusan
              </h2>
              <p className="rk-section-subtitle">
                Badan Pengurus Harian dan 5 bidang gerak ROKABA periode berjalan.
              </p>
            </div>
            <Link to="/schools#pengurus" className="rk-card-link">
              <span>Lihat direktori lengkap ({allMembers.length} pengurus)</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* BPH Strip */}
          {bph.length > 0 && (
            <div className="rk-grid-4" style={{ marginBottom: '24px' }}>
              {bph.slice(0, 8).map((member) => (
                <SoftCard key={member.id} as="article" style={{ padding: '18px' }}>
                  <span
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: 'var(--rk-brass-text)',
                    }}
                  >
                    {member.role}
                  </span>
                  <h3 style={{ fontSize: '1rem', marginTop: '4px', marginBottom: '4px' }}>
                    {member.name}
                  </h3>
                  <p style={{ fontSize: '0.84rem' }}>{member.school}</p>
                </SoftCard>
              ))}
            </div>
          )}

          {/* 5 Divisi */}
          <div className="rk-grid-3">
            {programs.map((prog) => {
              const matchedDiv = divisions.find(
                (d) =>
                  String(d.shortName || '').toLowerCase() ===
                    String(prog.division || '').toLowerCase() ||
                  String(d.name || '').toLowerCase() ===
                    String(prog.title || '').toLowerCase()
              );
              const divMembers = matchedDiv?.members || [];
              const agendas = Array.isArray(prog.details)
                ? prog.details
                : Array.isArray(prog.agendas)
                ? prog.agendas
                : [];

              return (
                <SoftCard
                  key={prog.id}
                  as="article"
                  interactive
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div className="rk-meta-line">
                      <span className="rk-badge">Bidang {prog.division || 'Gerak'}</span>
                      <span>•</span>
                      <span>{divMembers.length} pengurus</span>
                    </div>
                    <h3 style={{ marginTop: '10px', marginBottom: '8px' }}>{prog.title}</h3>
                    <p style={{ fontSize: '0.9rem' }}>{prog.description}</p>
                  </div>

                  <button
                    type="button"
                    className="rk-card-link"
                    onClick={() =>
                      setSelectedDivision({
                        ...prog,
                        agendas,
                        members: divMembers,
                      })
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>Lihat program & anggota divisi</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </SoftCard>
              );
            })}
          </div>
        </Container>
      </section>

      <AccessibleDialog
        open={Boolean(selectedDivision)}
        onClose={() => setSelectedDivision(null)}
        eyebrow={`Bidang ${selectedDivision?.division || 'ROKABA'}`}
        title={selectedDivision?.title || ''}
      >
        {selectedDivision && (
          <div style={{ display: 'grid', gap: '18px' }}>
            <p>{selectedDivision.description}</p>

            {Array.isArray(selectedDivision.agendas) &&
              selectedDivision.agendas.length > 0 && (
                <div className="rk-inset-panel" style={{ padding: '18px' }}>
                  <h3 style={{ fontSize: '0.96rem', marginBottom: '10px' }}>
                    Program & Kegiatan Utama
                  </h3>
                  <ul className="rk-program-list">
                    {selectedDivision.agendas.map((ag, i) => (
                      <li key={i}>{ag}</li>
                    ))}
                  </ul>
                </div>
              )}

            {Array.isArray(selectedDivision.members) &&
              selectedDivision.members.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '0.96rem', marginBottom: '10px' }}>
                    Anggota Divisi ({selectedDivision.members.length})
                  </h3>
                  <div className="rk-grid-2">
                    {selectedDivision.members.map((m) => (
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
          </div>
        )}
      </AccessibleDialog>
    </div>
  );
}
