import { useScrollAnimation } from '../utils';
import SectionHeader from '../components/SectionHeader';
import MemberSchoolCard from '../components/MemberSchoolCard';
import { memberSchools } from '../data/memberSchools';
import './About.css';

export default function MemberSchools() {
  useScrollAnimation();

  const totalMembers = memberSchools.reduce((sum, s) => sum + s.members, 0);

  return (
    <main className="page-member-schools">
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-primary animate-hero delay-0">Jaringan</span>
          <h1 className="page-hero-title animate-hero delay-1">ROHIS Anggota Kami</h1>
          <p className="page-hero-subtitle animate-hero delay-2">
            {memberSchools.length} ROHIS sekolah dengan total {totalMembers}+ anggota aktif tergabung dalam Organisasi ROHIS Kabupaten Banyumas.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
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
