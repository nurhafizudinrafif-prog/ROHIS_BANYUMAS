import { useMemo, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  AccessibleDialog,
  Container,
  SoftCard,
  normalizeTeamData,
} from '../components/ui/SoftUI';

const SCHOOL_TIERS = [
  {
    level: 'SMA',
    subtitle: 'Jaringan ROHIS Banyumas',
    description:
      'Jaringan ROHIS Sekolah Menengah Atas (SMA) negeri dan swasta se-Kabupaten Banyumas.',
  },
  {
    level: 'SMK',
    subtitle: 'Jaringan ROHIS Banyumas',
    description:
      'Jaringan ROHIS Sekolah Menengah Kejuruan (SMK) negeri dan swasta se-Kabupaten Banyumas.',
  },
  {
    level: 'MA',
    subtitle: 'Jaringan ROHIS Banyumas',
    description:
      'Jaringan ikatan pelajar dan kerohanian Madrasah Aliyah (MA) negeri dan swasta se-Kabupaten Banyumas.',
  },
];

const ROHIS_UNIT_NAMES = {
  'SMA Negeri 4 Purwokerto': 'ROHIS Akhdir SMAN 4 Purwokerto',
  'SMA Negeri 1 Purwokerto': 'ROHIS Al-Irsyad SMAN 1 Purwokerto',
  'SMA Negeri 2 Purwokerto': 'ROHIS Al-Hidayah SMAN 2 Purwokerto',
  'SMA Negeri 5 Purwokerto': 'ROHIS Al-Falah SMAN 5 Purwokerto',
  'SMK Telkom Purwokerto': 'ROHIS Al-Kautsar SMK Telkom Purwokerto',
  'SMK Negeri 1 Purwokerto': 'ROHIS Ash-Shiddiq SMKN 1 Purwokerto',
  'MAN 1 Banyumas': 'Kerohanian & Dakwah MAN 1 Banyumas',
  'MAN 2 Banyumas': 'Kerohanian & Dakwah MAN 2 Banyumas',
};

function detectSchoolLevel(name = '') {
  const upper = String(name).toUpperCase();
  if (upper.includes('SMK')) return 'SMK';
  if (upper.includes('SMA')) return 'SMA';
  if (
    upper.includes('MAN ') ||
    upper.startsWith('MA ') ||
    upper.includes('MADRASAH')
  )
    return 'MA';
  return 'SMA';
}

export default function Schools() {
  const { schools, team } = useData();
  const { allMembers } = normalizeTeamData(team);
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('Semua jenjang');
  const [selectedSchool, setSelectedSchool] = useState(null);

  const schoolDirectory = useMemo(() => {
    const map = new Map();
    const normalizeKey = (raw = '') =>
      String(raw)
        .replace(/^ROHIS\s+/i, '')
        .trim();

    (Array.isArray(schools) ? schools : []).forEach((s) => {
      const rawName = s.name || s.schoolName;
      const cleanName = normalizeKey(rawName);
      if (cleanName) {
        map.set(cleanName, {
          id: s.id || cleanName,
          name: cleanName,
          rohisUnit:
            ROHIS_UNIT_NAMES[cleanName] ||
            (String(rawName).toUpperCase().startsWith('ROHIS')
              ? rawName
              : `ROHIS ${cleanName}`),
          level: s.level || detectSchoolLevel(cleanName),
          address: s.address || 'Kabupaten Banyumas, Jawa Tengah',
          established: s.established || '2017',
          memberCount: s.members && s.members > 10 ? s.members : 45,
          pengurusList: [],
        });
      }
    });

    allMembers.forEach((m) => {
      if (!m.school) return;
      const cleanName = normalizeKey(m.school);
      const existing = map.get(cleanName) || {
        id: cleanName,
        name: cleanName,
        rohisUnit: ROHIS_UNIT_NAMES[cleanName] || `ROHIS ${cleanName}`,
        level: detectSchoolLevel(cleanName),
        address: 'Kabupaten Banyumas, Jawa Tengah',
        established: '2018',
        memberCount: 45,
        pengurusList: [],
      };
      existing.pengurusList.push(m);
      map.set(cleanName, existing);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [schools, allMembers]);

  const visibleTiers = useMemo(() => {
    return SCHOOL_TIERS.filter((tier) => {
      const matchLevel =
        levelFilter === 'Semua jenjang' || tier.level === levelFilter;
      if (!matchLevel) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const hasMatchingSchool = schoolDirectory.some(
        (s) => s.level === tier.level && s.name.toLowerCase().includes(q)
      );
      return (
        tier.level.toLowerCase().includes(q) ||
        tier.subtitle.toLowerCase().includes(q) ||
        hasMatchingSchool
      );
    });
  }, [levelFilter, query, schoolDirectory]);

  const visibleSchools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return schoolDirectory.filter((s) => {
      const matchLevel =
        levelFilter === 'Semua jenjang' || s.level === levelFilter;
      const matchQuery =
        !q ||
        `${s.name} ${s.rohisUnit} ${s.address} ${s.level}`
          .toLowerCase()
          .includes(q);
      return matchLevel && matchQuery;
    });
  }, [schoolDirectory, levelFilter, query]);

  return (
    <div className="rk-page">
      {/* 1. HEADER */}
      <section className="rk-page-header">
        <Container>
          <div className="rk-eyebrow" style={{ marginBottom: '8px' }}>
            <span className="rk-eyebrow-bar" aria-hidden="true" />
            <span>Sekolah Anggota ROKABA</span>
          </div>

          <h1 className="rk-page-title">Terhubung lintas sekolah</h1>
          <p className="rk-page-lead" style={{ marginTop: '8px', maxWidth: '62ch' }}>
            Jaringan kolaborasi ROHIS dari {schoolDirectory.length} SMA, SMK, dan
            MA di Kabupaten Banyumas yang saling menguatkan dalam dakwah pelajar.
          </p>
        </Container>
      </section>

      {/* 2. SEARCH + LEVEL SELECT + 3 TIER ROWS */}
      <section className="rk-section" style={{ paddingTop: '8px' }}>
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              gap: '14px',
              marginBottom: '18px',
            }}
          >
            <div className="rk-search-well">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                className="rk-inset-control"
                placeholder="Cari sekolah atau unit ROHIS..."
                aria-label="Cari sekolah"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <select
                aria-label="Filter jenjang sekolah"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="rk-pill"
                style={{
                  appearance: 'none',
                  paddingRight: '38px',
                  minHeight: '42px',
                  cursor: 'pointer',
                }}
              >
                <option value="Semua jenjang">Semua jenjang</option>
                <option value="SMA">SMA</option>
                <option value="SMK">SMK</option>
                <option value="MA">MA</option>
              </select>
              <ChevronDown
                size={15}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: '14px',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* 3 Reference Tier Rows */}
          <div style={{ display: 'grid', gap: '14px', marginBottom: '28px' }}>
            {visibleTiers.map((tier) => {
              const count = schoolDirectory.filter(
                (s) => s.level === tier.level
              ).length;
              const isSelected = levelFilter === tier.level;
              return (
                <SoftCard
                  key={tier.level}
                  as="button"
                  type="button"
                  interactive
                  selected={isSelected}
                  className="rk-school-row"
                  onClick={() =>
                    setLevelFilter(isSelected ? 'Semua jenjang' : tier.level)
                  }
                  style={{
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <strong style={{ fontSize: '1.22rem', fontWeight: 800 }}>
                    {tier.level}
                  </strong>

                  <span
                    aria-hidden="true"
                    style={{
                      width: '1px',
                      height: '28px',
                      background: 'var(--rk-line)',
                    }}
                  />

                  <span
                    style={{
                      fontSize: '0.96rem',
                      fontWeight: 500,
                      color: 'var(--rk-ink)',
                    }}
                  >
                    {tier.subtitle} ({count} Sekolah)
                  </span>

                  <span className="rk-card-link">
                    <span>{isSelected ? 'Semua jenjang' : 'Lihat profil'}</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </SoftCard>
              );
            })}
          </div>

          {/* 3. FULL DIRECTORY OF 17 MEMBER SCHOOLS */}
          <div className="rk-section-head" style={{ marginBottom: '16px' }}>
            <h2>
              Direktori Sekolah Anggota ({visibleSchools.length} Sekolah)
            </h2>
          </div>

          <div className="rk-grid-3">
            {visibleSchools.map((s) => (
              <SoftCard
                key={s.id}
                as="button"
                type="button"
                interactive
                onClick={() => setSelectedSchool(s)}
                style={{
                  padding: '20px 22px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <span className="rk-doc-badge">{s.level}</span>
                    <span
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: 'var(--rk-brass)',
                      }}
                    >
                      Est. {s.established} • {s.memberCount}+ Kader
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.08rem', lineHeight: 1.25 }}>
                    {s.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--rk-pine)',
                      marginTop: '4px',
                    }}
                  >
                    {s.rohisUnit}
                  </p>
                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--rk-muted)',
                      marginTop: '6px',
                      lineHeight: 1.5,
                    }}
                  >
                    {s.address}
                  </p>
                </div>

                <div
                  style={{
                    paddingTop: '10px',
                    borderTop: '1px solid var(--rk-line)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--rk-muted)',
                      fontWeight: 600,
                    }}
                  >
                    {s.pengurusList.length > 0
                      ? `${s.pengurusList.length} Delegasi Pengurus ROKABA`
                      : 'Anggota Jaringan ROKABA'}
                  </span>
                  <span className="rk-card-link" style={{ fontSize: '0.84rem' }}>
                    <span>Detail</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </SoftCard>
            ))}
          </div>
        </Container>
      </section>

      <AccessibleDialog
        open={Boolean(selectedSchool)}
        onClose={() => setSelectedSchool(null)}
        eyebrow={`Sekolah Anggota • Jenjang ${selectedSchool?.level || 'SMA'}`}
        title={selectedSchool?.name || 'Profil Sekolah'}
      >
        {selectedSchool && (
          <div style={{ display: 'grid', gap: '14px' }}>
            <div className="rk-inset-panel" style={{ padding: '14px 16px' }}>
              <strong
                style={{
                  display: 'block',
                  fontSize: '0.94rem',
                  color: 'var(--rk-pine)',
                }}
              >
                {selectedSchool.rohisUnit}
              </strong>
              <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>
                Alamat: {selectedSchool.address}
              </p>
              <p style={{ fontSize: '0.84rem', marginTop: '4px' }}>
                Tahun Berdiri: {selectedSchool.established} • Estimasi Anggota
                Aktif: {selectedSchool.memberCount}+ Pelajar
              </p>
            </div>

            {selectedSchool.pengurusList.length > 0 && (
              <div>
                <strong
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    marginBottom: '8px',
                    color: 'var(--rk-ink)',
                  }}
                >
                  Delegasi Pengurus di ROKABA ({selectedSchool.pengurusList.length}{' '}
                  Pelajar):
                </strong>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '8px',
                  }}
                >
                  {selectedSchool.pengurusList.map((p) => (
                    <div
                      key={p.id}
                      className="rk-inset-panel"
                      style={{ padding: '10px 12px', borderRadius: '12px' }}
                    >
                      <strong
                        style={{
                          display: 'block',
                          fontSize: '0.86rem',
                          color: 'var(--rk-ink)',
                        }}
                      >
                        {p.name}
                      </strong>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.76rem',
                          color: 'var(--rk-brass)',
                          fontWeight: 600,
                        }}
                      >
                        {p.role}
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
