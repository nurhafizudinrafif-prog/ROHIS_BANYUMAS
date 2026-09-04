import { useScrollAnimation } from '../utils';
import SectionHeader from '../components/SectionHeader';
import ProgramCard from '../components/ProgramCard';
import { programs } from '../data/programs';
import './About.css';

export default function Programs() {
  useScrollAnimation();

  return (
    <main className="page-programs">
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-primary animate-hero delay-0">Program Kerja</span>
          <h1 className="page-hero-title animate-hero delay-1">Empat Pilar Gerakan Kami</h1>
          <p className="page-hero-subtitle animate-hero delay-2">
            Setiap program dirancang untuk membentuk generasi Islam yang berilmu, berakhlak mulia, dan berdampak nyata.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            {programs.map((program, i) => (
              <ProgramCard key={program.id} program={program} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
