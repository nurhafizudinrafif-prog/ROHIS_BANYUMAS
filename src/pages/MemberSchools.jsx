import { useState } from 'react';
import { useScrollAnimation } from '../utils';
import SectionHeader from '../components/SectionHeader';
import MemberSchoolCard from '../components/MemberSchoolCard';
import TeamCard from '../components/TeamCard';
import { memberSchools } from '../data/memberSchools';
import { team } from '../data/team';
import './About.css';

export default function MemberSchools() {
  useScrollAnimation();
  const [activeDivision, setActiveDivision] = useState('Semua');

  const totalMembers = memberSchools.reduce((sum, s) => sum + s.members, 0);

  const displayedDivisions =
    activeDivision === 'Semua'
      ? team.divisions
      : team.divisions.filter((d) => d.shortName === activeDivision);

  return (
    <main className="page-member-schools">
      {/* Page Hero */}
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-primary animate-hero delay-0">Jaringan & Kepengurusan</span>
          <h1 className="page-hero-title animate-hero delay-1">ROHIS Anggota & Divisi Kepengurusan</h1>
          <p className="page-hero-subtitle animate-hero delay-2">
            Sinergi jaringan {memberSchools.length} ROHIS sekolah dan 5 divisi gerakan Organisasi ROHIS Kabupaten Banyumas Periode 2025/2026.
          </p>
        </div>
      </section>

      {/* 5 Divisi Kepengurusan ROKABA Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            badge="5 Pilar Gerakan"
            title="Divisi Kepengurusan ROKABA 2025/2026"
            subtitle="Kader-kader dakwah terpilih dari sekolah-sekolah se-Banyumas yang mengemban amanah di setiap divisi."
          />

          {/* Division Filter Tabs */}
          <div className="about-div-tabs">
            <button
              className={`about-div-tab ${activeDivision === 'Semua' ? 'active' : ''}`}
              onClick={() => setActiveDivision('Semua')}
            >
              Semua Divisi ({team.divisions.reduce((acc, d) => acc + d.members.length, 0)})
            </button>
            {team.divisions.map((d) => (
              <button
                key={d.id}
                className={`about-div-tab ${activeDivision === d.shortName ? 'active' : ''}`}
                onClick={() => setActiveDivision(d.shortName)}
              >
                {d.shortName} ({d.members.length})
              </button>
            ))}
          </div>

          {/* Division Blocks */}
          {displayedDivisions.map((div) => (
            <div key={div.id} className="about-division-block">
              <div className="about-division-header">
                <div className="about-division-header-info">
                  <span
                    className="badge badge-primary"
                    style={{
                      borderColor: div.color,
                      color: div.color,
                      background: `color-mix(in srgb, ${div.color} 12%, transparent)`,
                      marginBottom: '6px',
                      display: 'inline-block',
                    }}
                  >
                    {div.shortName}
                  </span>
                  <h3>{div.name}</h3>
                  <p>{div.description}</p>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {div.members.length} Pengurus
                </span>
              </div>

              <div className="grid grid-3">
                {div.members.map((member, i) => (
                  <TeamCard
                    key={member.id}
                    member={member}
                    index={i}
                    accentColor={div.color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Jaringan ROHIS Sekolah Anggota */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeader
            badge="Jaringan Sekolah"
            title="ROHIS Sekolah Anggota Kami"
            subtitle={`${memberSchools.length} ROHIS sekolah dengan total ${totalMembers}+ anggota aktif tergabung dalam organisasi ini.`}
          />
          <div className="grid grid-3">
            {memberSchools.map((school, i) => (
              <MemberSchoolCard key={school.id} school={school} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
