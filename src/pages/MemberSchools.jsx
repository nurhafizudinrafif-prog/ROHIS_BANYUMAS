import { useState } from 'react';
import { useScrollAnimation } from '../utils';
import SectionHeader from '../components/SectionHeader';
import MemberSchoolCard from '../components/MemberSchoolCard';
import TeamCard from '../components/TeamCard';
import DivisionShowcase from '../components/DivisionShowcase';
import { useData } from '../context/DataContext';
import './About.css';

export default function MemberSchools() {
  useScrollAnimation();
  const { memberSchools, team, organizationFullName, structurePeriod } = useData();

  const totalMembers = memberSchools.reduce((sum, s) => sum + s.members, 0);
  const totalDivisionMembers = (team.divisions || []).reduce(
    (acc, d) => acc + (d.members?.length || 0),
    0
  );

  return (
    <main className="page-member-schools">
      {/* Page Hero */}
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-primary animate-hero delay-0">Jaringan & Kepengurusan</span>
          <h1 className="page-hero-title animate-hero delay-1">ROHIS Anggota & Struktur Kepengurusan</h1>
          <p className="page-hero-subtitle animate-hero delay-2">
            Sinergi jaringan {memberSchools.length} ROHIS sekolah, BPH, dan 5 divisi pergerakan {organizationFullName} Periode {structurePeriod}.
          </p>
        </div>
      </section>

      {/* ── 5 Divisi Gerakan ROKABA (Cinematic Interactive Cards) ── */}
      <section className="section" id="divisi">
        <div className="container">
          <SectionHeader
            badge="5 Divisi Gerakan"
            title={`Divisi Kepengurusan ${organizationFullName}`}
            subtitle={`Klik salah satu divisi di bawah untuk membuka profil lengkap, koordinator, dan seluruh ${totalDivisionMembers} anggota pengurus dengan tampilan sinematik.`}
          />

          {/* Interactive Division Showcase Component */}
          <DivisionShowcase
            divisions={team.divisions || []}
            defaultOpenId="sdm"
          />
        </div>
      </section>

      {/* ── Badan Pengurus Harian (BPH) ── */}
      <section className="section section-alt" id="bph">
        <div className="container">
          <SectionHeader
            badge={`BPH ${structurePeriod}`}
            title="Badan Pengurus Harian (BPH)"
            subtitle={`Pimpinan inti yang mengarahkan visi dan pergerakan ${organizationFullName} Periode ${structurePeriod}.`}
          />
          <div className="team-grid-bph">
            {team.bph?.map((member, i) => (
              <TeamCard key={member.id} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Jaringan ROHIS Sekolah Anggota ── */}
      <section className="section">
        <div className="container">
          <SectionHeader
            badge="Jaringan Sekolah"
            title="ROHIS Sekolah Anggota Kami"
            subtitle={`${memberSchools.length} ROHIS sekolah dengan total ${totalMembers} kader pengurus aktif yang tergabung dalam organisasi ini.`}
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
