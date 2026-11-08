import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Container,
  PageHeader,
  SoftCard,
  InsetField,
  SmartImage,
  AccessibleDialog,
  EmptyState,
  normalizeTeamData,
} from '../components/ui/SoftUI';

function detectSchoolLevel(name = '') {
  const upper = String(name).toUpperCase();
  if (upper.includes('SMK')) return 'SMK';
  if (upper.includes('SMA')) return 'SMA';
  if (upper.includes('MAN ') || upper.startsWith('MAN ') || upper.startsWith('MA ') || upper.includes(' MA ')) return 'MA';
  return 'SMA';
}

export default function Schools() {
  const { schools = [], team } = useData();
  const { allMembers } = normalizeTeamData(team);
  const location = useLocation();

  // Filter Sekolah Anggota
  const [schoolSearch, setSchoolSearch] = useState('');
  const [schoolLevel, setSchoolLevel] = useState('Semua jenjang');
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Filter Struktur Pengurus (#pengurus)
  const [activeRoleFilter, setActiveRoleFilter] = useState('Semua');
  const [memberSearch, setMemberSearch] = useState('');

  useEffect(() => {
    if (location.hash === '#pengurus') {
      const el = document.getElementById('pengurus');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80);
      }
    }
  }, [location.hash]);

  // Gabungkan daftar sekolah dari DataContext schools + sekolah asal pengurus
  const enrichedSchools = useMemo(() => {
    const map = new Map();

    schools.forEach((s) => {
      const schoolTitle = s.school || s.name || '';
      const rohisTitle = s.rohisName || (s.name?.startsWith('ROHIS') ? s.name : `ROHIS ${schoolTitle}`);
      const key = schoolTitle.toLowerCase();
      map.set(key, {
        ...s,
        displaySchool: schoolTitle,
        rohisName: rohisTitle,
        level: s.level || detectSchoolLevel(schoolTitle),
        district: s.address || 'Purwokerto, Banyumas',
      });
    });

    allMembers.forEach((member) => {
      const schoolName = String(member.school || '').trim();
      if (
        !schoolName ||
        schoolName.toLowerCase().includes('kemenag') ||
        schoolName.toLowerCase().includes('pembina')
      ) {
        return;
      }
      const key = schoolName.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          id: `net-${key.replace(/\s+/g, '-')}`,
          displaySchool: schoolName,
          name: schoolName,
          rohisName: `ROHIS ${schoolName}`,
          level: detectSchoolLevel(schoolName),
          district: 'Kabupaten Banyumas',
          status: 'active',
        });
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      String(a.displaySchool).localeCompare(String(b.displaySchool))
    );
  }, [schools, allMembers]);

  const filteredSchools = useMemo(() => {
    const q = schoolSearch.trim().toLowerCase();
    return enrichedSchools.filter((s) => {
      const matchesLevel =
        schoolLevel === 'Semua jenjang' || s.level === schoolLevel;
      const matchesSearch =
        !q ||
        String(s.displaySchool || '').toLowerCase().includes(q) ||
        String(s.rohisName || '').toLowerCase().includes(q) ||
        String(s.district || '').toLowerCase().includes(q);
      return matchesLevel && matchesSearch;
    });
  }, [enrichedSchools, schoolSearch, schoolLevel]);

  const roleCategories = useMemo(() => {
    const unique = new Set(['Semua']);
    allMembers.forEach((m) => {
      if (m.division) unique.add(m.division);
    });
    return Array.from(unique);
  }, [allMembers]);

  const filteredMembers = useMemo(() => {
    const q = memberSearch.trim().toLowerCase();
    return allMembers.filter((m) => {
      const matchesRole =
        activeRoleFilter === 'Semua' ||
        String(m.division || '').toLowerCase() === activeRoleFilter.toLowerCase();
      const matchesQuery =
        !q ||
        String(m.name || '').toLowerCase().includes(q) ||
        String(m.school || '').toLowerCase().includes(q) ||
        String(m.role || '').toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [allMembers, activeRoleFilter, memberSearch]);

  const getSchoolDelegates = (schoolName) => {
    const target = String(schoolName || '').toLowerCase();
    return allMembers.filter((m) => String(m.school || '').toLowerCase() === target);
  };

  return (
    <div className="rk-page">
      <PageHeader
        breadcrumb={[{ label: 'Beranda', to: '/' }, { label: 'Sekolah anggota' }]}
        title="Terhubung lintas sekolah"
        lead="Jaringan ROHIS SMA, SMK, dan MA yang berkolaborasi dalam kegiatan pelajar di Kabupaten Banyumas."
      />

      {/* BAGIAN 1: DIREKTORI SEKOLAH ANGGOTA */}
      <section className="rk-section" aria-label="Direktori sekolah anggota ROKABA">
        <Container>
          <div className="rk-filter-bar">
            <div style={{ flex: '1 1 320px' }}>
              <InsetField
                id="rk-school-search"
                type="search"
                aria-label="Cari nama sekolah atau kecamatan"
                placeholder="Cari nama sekolah atau kecamatan..."
                value={schoolSearch}
                onChange={(e) => setSchoolSearch(e.target.value)}
              />
            </div>

            <div style={{ flex: '0 0 220px' }}>
              <InsetField
                as="select"
                id="rk-school-level"
                aria-label="Filter jenjang sekolah"
                value={schoolLevel}
                onChange={(e) => setSchoolLevel(e.target.value)}
              >
                <option value="Semua jenjang">Semua jenjang</option>
                <option value="SMA">SMA</option>
                <option value="SMK">SMK</option>
                <option value="MA">MA</option>
              </InsetField>
            </div>
          </div>

          {filteredSchools.length === 0 ? (
            <EmptyState
              title="Sekolah tidak ditemukan"
              description="Coba ubah kata kunci pencarian atau pilih Semua jenjang."
              action={
                <button
                  type="button"
                  className="rk-btn-secondary"
                  onClick={() => {
                    setSchoolSearch('');
                    setSchoolLevel('Semua jenjang');
                  }}
                >
                  Tampilkan semua sekolah
                </button>
              }
            />
          ) : (
            <div style={{ display: 'grid', gap: '14px' }}>
              {filteredSchools.map((school) => {
                const delegates = getSchoolDelegates(school.displaySchool);
                return (
                  <SoftCard
                    key={school.id}
                    as="article"
                    interactive
                    className="rk-school-row"
                    onClick={() => setSelectedSchool({ ...school, delegates })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedSchool({ ...school, delegates });
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
                        {school.displaySchool}
                      </h3>
                      <p style={{ fontSize: '0.88rem' }}>
                        {school.level} • {school.rohisName} •{' '}
                        {school.district || 'Kabupaten Banyumas'} • Aktif
                        {delegates.length > 0
                          ? ` • ${delegates.length} delegasi pengurus`
                          : ''}
                      </p>
                    </div>

                    <span className="rk-card-link" style={{ marginTop: 0 }}>
                      <span>Lihat profil</span>
                      <span aria-hidden="true">→</span>
                    </span>
                  </SoftCard>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* BAGIAN 2: DIREKTORI STRUKTUR PENGURUS ROKABA (#pengurus) */}
      <section
        id="pengurus"
        className="rk-section"
        style={{ scrollMarginTop: '100px' }}
        aria-labelledby="rk-pengurus-heading"
      >
        <Container>
          <div className="rk-section-head">
            <div>
              <div className="rk-eyebrow">
                <span className="rk-eyebrow-bar" aria-hidden="true" />
                <span>Direktori Kader & Pengurus</span>
              </div>
              <h2 id="rk-pengurus-heading" className="rk-section-title">
                Struktur Pengurus ROKABA
              </h2>
              <p className="rk-section-subtitle">
                Kolaborasi {allMembers.length} pelajar lintas sekolah periode kepengurusan berjalan.
              </p>
            </div>
          </div>

          <div className="rk-filter-bar">
            <div className="rk-filter-pills" role="group" aria-label="Filter bidang kepengurusan">
              {roleCategories.map((role) => (
                <button
                  key={role}
                  type="button"
                  className="rk-pill"
                  aria-pressed={activeRoleFilter === role}
                  onClick={() => setActiveRoleFilter(role)}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="rk-filter-search">
              <InsetField
                id="rk-member-search"
                type="search"
                aria-label="Cari nama pengurus atau asal sekolah"
                placeholder="Cari pengurus atau sekolah..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredMembers.length === 0 ? (
            <EmptyState
              title="Pengurus tidak ditemukan"
              description="Silakan atur ulang filter divisi atau kata kunci pencarian."
              action={
                <button
                  type="button"
                  className="rk-btn-secondary"
                  onClick={() => {
                    setActiveRoleFilter('Semua');
                    setMemberSearch('');
                  }}
                >
                  Tampilkan seluruh pengurus
                </button>
              }
            />
          ) : (
            <div className="rk-grid-3">
              {filteredMembers.map((member) => (
                <SoftCard
                  key={member.id}
                  as="article"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '18px 20px',
                  }}
                >
                  {member.photo ? (
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid var(--rk-line)',
                      }}
                    >
                      <SmartImage src={member.photo} alt={member.name} />
                    </div>
                  ) : (
                    <div
                      aria-hidden="true"
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        background: 'var(--rk-surface-inset)',
                        color: 'var(--rk-pine)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        flexShrink: 0,
                      }}
                    >
                      {String(member.name || 'R').charAt(0)}
                    </div>
                  )}

                  <div style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: 'var(--rk-brass-text)',
                      }}
                    >
                      {member.role} • {member.shortDivision || member.division}
                    </span>
                    <h3
                      style={{
                        fontSize: '0.98rem',
                        marginTop: '2px',
                        marginBottom: '2px',
                        lineHeight: 1.3,
                      }}
                    >
                      {member.name}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--rk-muted)' }}>
                      {member.school}
                    </p>
                  </div>
                </SoftCard>
              ))}
            </div>
          )}
        </Container>
      </section>

      <AccessibleDialog
        open={Boolean(selectedSchool)}
        onClose={() => setSelectedSchool(null)}
        eyebrow={`${selectedSchool?.level || 'Sekolah'} Anggota ROKABA`}
        title={selectedSchool?.displaySchool || ''}
      >
        {selectedSchool && (
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="rk-inset-panel" style={{ padding: '16px 18px', display: 'grid', gap: '8px' }}>
              <div style={{ fontSize: '0.9rem' }}>
                <strong style={{ color: 'var(--rk-ink)' }}>Nama ROHIS: </strong>
                <span style={{ color: 'var(--rk-muted)' }}>
                  {selectedSchool.rohisName}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                <strong style={{ color: 'var(--rk-ink)' }}>Alamat / Wilayah: </strong>
                <span style={{ color: 'var(--rk-muted)' }}>
                  {selectedSchool.district || selectedSchool.address || 'Kabupaten Banyumas'}
                </span>
              </div>
              {selectedSchool.established && (
                <div style={{ fontSize: '0.9rem' }}>
                  <strong style={{ color: 'var(--rk-ink)' }}>Bergabung Sejak: </strong>
                  <span style={{ color: 'var(--rk-muted)' }}>{selectedSchool.established}</span>
                </div>
              )}
            </div>

            {Array.isArray(selectedSchool.delegates) && selectedSchool.delegates.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.96rem', marginBottom: '10px' }}>
                  Delegasi Pengurus di ROKABA ({selectedSchool.delegates.length})
                </h3>
                <div className="rk-grid-2">
                  {selectedSchool.delegates.map((del) => (
                    <div key={del.id} className="rk-inset-panel" style={{ padding: '12px 14px' }}>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--rk-ink)' }}>
                        {del.name}
                      </strong>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--rk-brass-text)' }}>
                        {del.role} ({del.division})
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
