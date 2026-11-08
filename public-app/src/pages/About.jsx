import { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Container,
  PhotoFrame,
  ROKABA_REAL_PHOTOS,
  SoftCard,
  normalizeTeamData,
} from '../components/ui/SoftUI';

const REFERENCE_ROLES = [
  {
    id: 'all',
    title: 'Ketua & BPH',
    subtitle: 'Koordinasi utama organisasi (9 Pengurus)',
  },
  {
    id: 'sdm',
    title: 'Divisi SDM',
    subtitle: 'Kaderisasi & kapasitas anggota (10 Pengurus)',
  },
  {
    id: 'dakwah',
    title: 'Divisi Dakwah',
    subtitle: 'Kajian keilmuan & syiar Islam (7 Pengurus)',
  },
  {
    id: 'humas',
    title: 'Divisi HUMAS',
    subtitle: 'Relasi & jaringan sekolah (8 Pengurus)',
  },
  {
    id: 'jurnalistik',
    title: 'Jurnalistik & Danus',
    subtitle: 'Publikasi media & kemandirian (11 Pengurus)',
  },
];

export default function About() {
  const { home, team, settings } = useData();
  const { bph, divisions } = normalizeTeamData(team);
  const [selectedDivId, setSelectedDivId] = useState('all');

  const aboutData = home?.about || {
    tag: 'TENTANG KAMI',
    title: 'Bukan sekadar sebuah organisasi.',
    lead: 'Didirikan pada tahun 2017 di Purwokerto, ROHIS Kabupaten Banyumas tumbuh dari tekad bersama para pelajar SMA, SMK, dan MA untuk merajut ukhuwah dan memperkuat dakwah sekolah.',
    paragraph1:
      'Kami hadir bukan sekadar menyusun struktur jabatan formal, melainkan membangun ruang perjumpaan yang hangat—tempat setiap pelajar Muslim dapat belajar memahami nilai-nilai Islam yang rahmatan lil alamin, mengasah kepemimpinan, dan menyalurkan kepedulian nyata bagi masyarakat.',
    paragraph2:
      'Dari kajian akbar di masjid-masjid agung hingga pelatihan literasi digital dan aksi kepedulian sosial di pelosok Banyumas, seluruh langkah kami digerakkan secara gotong-royong oleh kader pelajar bersama para pembina di bawah koordinasi Seksi Pendidikan Agama Islam (PAI) Kantor Kementerian Agama Kabupaten Banyumas.',
    photoUrl: ROKABA_REAL_PHOTOS[1],
    quoteText:
      '"Di sini kami belajar bahwa dakwah terbaik tidak diukur dari megahnya panggung, melainkan dari keteladanan akhlak dan keikhlasan melayani sesama pelajar."',
    quoteAuthor: '— Catatan Lapangan Kader Pelajar, Banyumas',
  };

  const timeline = Array.isArray(home?.timeline) ? home.timeline : [];

  const filteredDivisions =
    selectedDivId === 'all'
      ? divisions
      : selectedDivId === 'jurnalistik'
      ? divisions.filter((d) => d.id === 'jurnalistik' || d.id === 'danus')
      : divisions.filter((d) => d.id === selectedDivId);

  return (
    <div className="rk-page">
      {/* 1. TOP SPLIT: TENTANG ROKABA + GROUP PHOTO */}
      <section className="rk-section" style={{ paddingTop: '18px' }}>
        <Container>
          <div className="rk-split-40-60" style={{ alignItems: 'center' }}>
            <div>
              <div className="rk-eyebrow">
                <span className="rk-eyebrow-bar" aria-hidden="true" />
                <span>
                  Tentang ROKABA • Periode {settings?.period || '2025/2026'}
                </span>
              </div>

              <h1
                className="rk-page-title"
                style={{ fontSize: 'clamp(2.1rem, 3.6vw, 3.05rem)' }}
              >
                Mengenal ROKABA
              </h1>

              <p
                className="rk-page-lead"
                style={{
                  marginTop: '8px',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--rk-brass-text)',
                }}
              >
                Ukhuwah, kepemimpinan, kontribusi
              </p>

              <p
                style={{
                  marginTop: '12px',
                  fontSize: '0.92rem',
                  lineHeight: 1.62,
                }}
              >
                {aboutData.lead}
              </p>

              <p
                style={{
                  marginTop: '10px',
                  fontSize: '0.92rem',
                  lineHeight: 1.62,
                }}
              >
                {aboutData.paragraph1}
              </p>
            </div>

            <div style={{ display: 'grid', gap: '14px' }}>
              <PhotoFrame
                src={aboutData.photoUrl || ROKABA_REAL_PHOTOS[0]}
                alt="Pengurus dan kader ROHIS Kabupaten Banyumas"
                aspect="16/9.6"
                captionTitle="Dokumentasi Muskerda & Kader ROKABA"
                captionSub="Forum Komunikasi ROHIS SMA/SMK/MA se-Kabupaten Banyumas"
                eager
              />

              <SoftCard
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: '12px',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '3.5px',
                    borderRadius: '99px',
                    background: 'var(--rk-brass)',
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    fontSize: '0.86rem',
                    fontStyle: 'italic',
                    color: 'var(--rk-ink)',
                  }}
                >
                  {aboutData.quoteText}{' '}
                  <strong style={{ fontStyle: 'normal' }}>
                    {aboutData.quoteAuthor}
                  </strong>
                </p>
              </SoftCard>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SEJARAH & JEJAK LANGKAH ROKABA (TIMELINE 2017 - 2026) */}
      {timeline.length > 0 && (
        <section className="rk-section">
          <Container>
            <div className="rk-inline-section-head">
              <h2>Jejak langkah ROKABA (2017–2026)</h2>
              <span className="rk-inline-section-sep" aria-hidden="true" />
              <p>
                Perjalanan tumbuh bersama pelajar Muslim di Kabupaten Banyumas.
              </p>
            </div>

            <div className="rk-grid-5">
              {timeline.map((item) => (
                <SoftCard
                  key={item.id || item.year}
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <strong
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: 'var(--rk-ink)',
                      }}
                    >
                      {item.year}
                    </strong>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '99px',
                        background: 'var(--rk-surface-inset)',
                        color: 'var(--rk-brass-text)',
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.95rem', lineHeight: 1.3 }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.8rem', lineHeight: 1.48 }}>
                    {item.desc}
                  </p>
                </SoftCard>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 3. PENGURUS & DIVISI (5 PILAR INTERAKTIF + SELURUH DATA BPH & 5 DIVISI) */}
      <section className="rk-section">
        <Container>
          <div className="rk-inline-section-head">
            <h2>Pengurus & divisi</h2>
            <span className="rk-inline-section-sep" aria-hidden="true" />
            <p>
              Struktur kepengurusan resmi ROHIS Kabupaten Banyumas Periode{' '}
              {settings?.period || '2025/2026'}.
            </p>
          </div>

          {/* 5 Raised 3D Role Selector Cards (Matching 02-halaman-konten.png) */}
          <div className="rk-grid-5" style={{ marginBottom: '22px' }}>
            {REFERENCE_ROLES.map((item) => {
              const isSelected = selectedDivId === item.id;
              return (
                <SoftCard
                  key={item.id}
                  as="button"
                  type="button"
                  interactive
                  selected={isSelected}
                  onClick={() => setSelectedDivId(item.id)}
                  aria-pressed={isSelected}
                  style={{
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    gap: '6px',
                    minHeight: '108px',
                    padding: '16px',
                  }}
                >
                  <h3 style={{ fontSize: '1.04rem', fontWeight: 800 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', lineHeight: 1.42 }}>
                    {item.subtitle}
                  </p>
                </SoftCard>
              );
            })}
          </div>

          {/* BADAN PENGURUS HARIAN (BPH) - 9 PENGURUS UTAMA */}
          {(selectedDivId === 'all') && bph.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3
                style={{
                  fontSize: '1.22rem',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span className="rk-eyebrow-bar" aria-hidden="true" />
                <span>Badan Pengurus Harian (BPH) — {bph.length} Pengurus</span>
              </h3>

              <div className="rk-grid-3">
                {bph.map((member) => (
                  <SoftCard
                    key={member.id || member.name}
                    style={{
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: 'var(--rk-brass-text)',
                          marginBottom: '4px',
                        }}
                      >
                        {member.role}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                        {member.name}
                      </h4>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: 'var(--rk-ink)',
                          marginTop: '2px',
                        }}
                      >
                        {member.school}
                      </span>
                      {member.bio && (
                        <p style={{ fontSize: '0.82rem', marginTop: '6px' }}>
                          {member.bio}
                        </p>
                      )}
                    </div>

                    {member.instagram && (
                      <a
                        href={`https://instagram.com/${member.instagram.replace(/^@/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--rk-pine)',
                        }}
                      >
                        @{member.instagram.replace(/^@/, '')} ↗
                      </a>
                    )}
                  </SoftCard>
                ))}
              </div>
            </div>
          )}

          {/* 5 DIVISI LENGKAP BESERTA SELURUH ANGGOTA */}
          <div style={{ display: 'grid', gap: '20px' }}>
            {filteredDivisions.map((div) => {
              const members = Array.isArray(div.members) ? div.members : [];
              return (
                <SoftCard key={div.id || div.name} style={{ padding: '20px 22px' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      marginBottom: '14px',
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                        {div.name}
                      </h3>
                      <p style={{ fontSize: '0.88rem', marginTop: '2px' }}>
                        {div.description}
                      </p>
                    </div>

                    <span className="rk-doc-badge">
                      {members.length} Pengurus
                    </span>
                  </div>

                  <div className="rk-grid-4">
                    {members.map((m) => (
                      <div
                        key={m.id || m.name}
                        className="rk-inset-panel"
                        style={{
                          padding: '12px 14px',
                          borderRadius: '13px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '6px',
                        }}
                      >
                        <div>
                          <span
                            style={{
                              display: 'block',
                              fontSize: '0.73rem',
                              fontWeight: 700,
                              color:
                                m.role === 'Koordinator'
                                  ? 'var(--rk-pine)'
                                  : 'var(--rk-brass-text)',
                            }}
                          >
                            {m.role}
                          </span>
                          <strong
                            style={{
                              display: 'block',
                              fontSize: '0.92rem',
                              color: 'var(--rk-ink)',
                              marginTop: '2px',
                            }}
                          >
                            {m.name}
                          </strong>
                          <span
                            style={{
                              display: 'block',
                              fontSize: '0.78rem',
                              color: 'var(--rk-muted)',
                              marginTop: '2px',
                            }}
                          >
                            {m.school}
                          </span>
                        </div>

                        {m.instagram && (
                          <a
                            href={`https://instagram.com/${m.instagram.replace(/^@/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--rk-pine)',
                            }}
                          >
                            @{m.instagram.replace(/^@/, '')}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </SoftCard>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
