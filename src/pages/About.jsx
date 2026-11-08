import { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  AccessibleDialog,
  Container,
  PhotoFrame,
  ROKABA_REAL_PHOTOS,
  SoftCard,
  normalizeTeamData,
} from '../components/ui/SoftUI';

const REFERENCE_ROLES = [
  {
    id: 'ketua',
    title: 'Ketua',
    subtitle: 'Koordinasi organisasi',
    filterKey: 'ketua',
    detailTitle: 'Ketua & Dewan Pembina ROKABA',
    detailDescription:
      'Mengoordinasikan arah gerak organisasi, menjaga ukhuwah lintas sekolah SMA/SMK/MA se-Kabupaten Banyumas, serta memastikan seluruh program berjalan selaras.',
  },
  {
    id: 'sekretaris',
    title: 'Sekretaris',
    subtitle: 'Administrasi & keberlangsungan',
    filterKey: 'sekretaris',
    detailTitle: 'Kesekretariatan ROKABA',
    detailDescription:
      'Mengelola tata persuratan, dokumentasi rapat, inventarisasi arsip organisasi, serta keberlangsungan koordinasi antar sekolah anggota.',
  },
  {
    id: 'bendahara',
    title: 'Bendahara',
    subtitle: 'Pengelolaan keuangan',
    filterKey: 'bendahara',
    detailTitle: 'Kebendaharaan ROKABA',
    detailDescription:
      'Mengelola kas organisasi, transparansi anggaran program kerja, serta pelaporan keuangan kegiatan ROHIS Kabupaten Banyumas.',
  },
  {
    id: 'program',
    title: 'Divisi Program',
    subtitle: 'Rancangan & pelaksanaan kegiatan',
    filterKey: 'program',
    detailTitle: 'Divisi Program, Kaderisasi & Syiar',
    detailDescription:
      'Merancang dan melaksanakan program pembinaan kader, kajian pelajar, latihan kepemimpinan, serta kegiatan sosial kemasyarakatan.',
  },
  {
    id: 'media',
    title: 'Divisi Media',
    subtitle: 'Publikasi & komunikasi',
    filterKey: 'media',
    detailTitle: 'Divisi Media & Jaringan Sekolah',
    detailDescription:
      'Mengelola publikasi kreatif, dokumentasi kegiatan, syiar digital, serta komunikasi jaringan ROHIS lintas SMA, SMK, dan MA.',
  },
];

export default function About() {
  const { team, settings } = useData();
  const { bph, divisions, allMembers } = normalizeTeamData(team);
  const [selectedRole, setSelectedRole] = useState(null);

  const getRoleMembers = (roleItem) => {
    if (!roleItem) return [];
    if (roleItem.filterKey === 'ketua') {
      return bph.filter((m) =>
        /ketua|pembina/i.test(`${m.role || ''} ${m.position || ''}`)
      );
    }
    if (roleItem.filterKey === 'sekretaris') {
      return bph.filter((m) =>
        /sekretaris/i.test(`${m.role || ''} ${m.position || ''}`)
      );
    }
    if (roleItem.filterKey === 'bendahara') {
      return bph.filter((m) =>
        /bendahara/i.test(`${m.role || ''} ${m.position || ''}`)
      );
    }
    if (roleItem.filterKey === 'media') {
      const mediaDivs = divisions.filter((d) =>
        /media|humas|jaringan|kominfo/i.test(`${d.name || ''} ${d.shortName || ''}`)
      );
      const members = mediaDivs.flatMap((d) => d.members || []);
      return members.length > 0 ? members : allMembers.slice(0, 8);
    }
    const progDivs = divisions.filter(
      (d) => !/media/i.test(`${d.name || ''} ${d.shortName || ''}`)
    );
    const members = progDivs.flatMap((d) => d.members || []);
    return members.length > 0 ? members : allMembers.slice(0, 10);
  };

  const activeMembers = getRoleMembers(selectedRole);

  return (
    <div className="rk-page">
      {/* 1. TOP SPLIT: TENTANG ROKABA + GROUP PHOTO */}
      <section className="rk-section" style={{ paddingTop: '20px' }}>
        <Container>
          <div className="rk-split-40-60" style={{ alignItems: 'center' }}>
            <div>
              <div className="rk-eyebrow">
                <span className="rk-eyebrow-bar" aria-hidden="true" />
                <span>Tentang ROKABA</span>
              </div>

              <h1
                className="rk-page-title"
                style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)' }}
              >
                Mengenal ROKABA
              </h1>

              <p
                className="rk-page-lead"
                style={{
                  marginTop: '12px',
                  fontSize: 'clamp(1rem, 1.3vw, 1.18rem)',
                  color: 'var(--rk-muted)',
                }}
              >
                Ukhuwah, kepemimpinan, kontribusi
              </p>
            </div>

            <div>
              <PhotoFrame
                src={ROKABA_REAL_PHOTOS[0]}
                alt="Pengurus dan kader ROHIS Kabupaten Banyumas"
                aspect="16/10"
                eager
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. PENGURUS & DIVISI (5 RAISED 3D CARDS) */}
      <section className="rk-section">
        <Container>
          <h2
            style={{
              fontSize: 'clamp(1.45rem, 2.2vw, 1.85rem)',
              marginBottom: '18px',
            }}
          >
            Pengurus & divisi
          </h2>

          <div className="rk-grid-5">
            {REFERENCE_ROLES.map((item) => (
              <SoftCard
                key={item.id}
                as="button"
                type="button"
                interactive
                onClick={() => setSelectedRole(item)}
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  gap: '8px',
                  minHeight: '118px',
                  padding: '18px',
                }}
              >
                <h3 style={{ fontSize: '1.08rem', fontWeight: 800 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.84rem', lineHeight: 1.45 }}>
                  {item.subtitle}
                </p>
              </SoftCard>
            ))}
          </div>
        </Container>
      </section>

      {/* ACCESSIBLE DIALOG FOR CMS TEAM & ORGANIZATION DETAILS */}
      <AccessibleDialog
        open={Boolean(selectedRole)}
        onClose={() => setSelectedRole(null)}
        eyebrow={`Struktur Organisasi ${settings?.period || '2025/2026'}`}
        title={selectedRole?.detailTitle || 'Pengurus ROKABA'}
      >
        {selectedRole && (
          <div style={{ display: 'grid', gap: '16px' }}>
            <p style={{ fontSize: '0.94rem', lineHeight: 1.6 }}>
              {selectedRole.detailDescription}
            </p>

            {activeMembers.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                  gap: '10px',
                }}
              >
                {activeMembers.map((member, idx) => (
                  <div
                    key={member.id || `${member.name}-${idx}`}
                    className="rk-inset-panel"
                    style={{ padding: '12px 14px', borderRadius: '12px' }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        color: 'var(--rk-ink)',
                      }}
                    >
                      {member.name}
                    </strong>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        color: 'var(--rk-brass-text)',
                        fontWeight: 600,
                        marginTop: '2px',
                      }}
                    >
                      {member.role || member.position || selectedRole.title}
                    </span>
                    {member.school && (
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.78rem',
                          color: 'var(--rk-muted)',
                          marginTop: '2px',
                        }}
                      >
                        {member.school}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </AccessibleDialog>
    </div>
  );
}
