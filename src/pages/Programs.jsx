import { useScrollAnimation } from '../utils';
import ProgramCard from '../components/ProgramCard';
import { programs } from '../data/programs';
import './About.css';
import './Home.css';

export default function Programs() {
  useScrollAnimation();

  return (
    <main className="page-programs">
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-primary animate-hero delay-0">Program Kerja & Divisi</span>
          <h1 className="page-hero-title animate-hero delay-1">Lima Pilar Gerakan Kami</h1>
          <p className="page-hero-subtitle animate-hero delay-2">
            Digerakkan secara terpadu melalui 5 divisi utama: SDM, Dakwah, Jurnalistik, HUMAS, dan DANUS untuk membentuk generasi muda Islam yang berilmu, berakhlak, dan mandiri.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="home-programs-grid">
            {programs.map((program, i) => (
              <ProgramCard key={program.id} program={program} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
