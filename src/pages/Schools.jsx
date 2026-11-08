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

function detectSchoolLevel(name = '') {
  const upper = String(name).toUpperCase();
  if (upper.includes('SMK')) return 'SMK';
  if (upper.includes('SMA')) return 'SMA';
  if (upper.includes('MAN ') || upper.startsWith('MA ') || upper.includes('MADRASAH'))
    return 'MA';
  return 'SMA';
}

export default function Schools() {
  const { schools, team } = useData();
  const { allMembers } = normalizeTeamData(team);
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('Semua jenjang');
  const [activeTier, setActiveTier] = useState(null);

  const schoolDirectory = useMemo(() => {
    const map = new Map();
    (Array.isArray(schools) ? schools : []).forEach((s) => {
      const name = s.name || s.schoolName;
      if (name) {
        map.set(name, {
          name,
          level: s.level || detectSchoolLevel(name),
          members: [],
        });
      }
    });

    allMembers.forEach((m) => {
      if (!m.school) return;
      const existing = map.get(m.school) || {
        name: m.school,
        level: detectSchoolLevel(m.school),
        members: [],
      };
      existing.members.push(m);
      map.set(m.school, existing);
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

  const modalSchools = useMemo(() => {
    if (!activeTier) return [];
    const q = query.trim().toLowerCase();
    return schoolDirectory.filter(
      (s) =>
        s.level === activeTier.level &&
        (!q || s.name.toLowerCase().includes(q))
    );
  }, [activeTier, schoolDirectory, query]);

  return (
    <div className="rk-page">
      {/* 1. HEADER */}
      <section className="rk-page-header">
        <Container>
          <div className="rk-eyebrow" style={{ marginBottom: '8px' }}>
            <span className="rk-eyebrow-bar" aria-hidden="true" />
          </div>

          <h1 className="rk-page-title">Terhubung lintas sekolah</h1>
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
                placeholder="Cari sekolah"
                aria-label="Cari sekolah"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
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

          <div style={{ display: 'grid', gap: '14px' }}>
            {visibleTiers.map((tier) => (
              <SoftCard
                key={tier.level}
                as="button"
                type="button"
                interactive
                className="rk-school-row"
                onClick={() => setActiveTier(tier)}
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
                  {tier.subtitle}
                </span>

                <span className="rk-card-link">
                  <span>Lihat profil</span>
                  <span aria-hidden="true">→</span>
                </span>
              </SoftCard>
            ))}
          </div>
        </Container>
      </section>

      <AccessibleDialog
        open={Boolean(activeTier)}
        onClose={() => setActiveTier(null)}
        eyebrow="Jaringan ROHIS Kabupaten Banyumas"
        title={`Sekolah Anggota Jenjang ${activeTier?.level || ''}`}
      >
        {activeTier && (
          <div style={{ display: 'grid', gap: '14px' }}>
            <p style={{ fontSize: '0.92rem' }}>{activeTier.description}</p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '10px',
              }}
            >
              {modalSchools.map((s) => (
                <div
                  key={s.name}
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
                    {s.name}
                  </strong>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      color: 'var(--rk-muted)',
                      marginTop: '2px',
                    }}
                  >
                    {s.members.length > 0
                      ? `${s.members.length} pengurus terdaftar di ROKABA`
                      : `Anggota Jaringan ${s.level} Banyumas`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </AccessibleDialog>
    </div>
  );
}
