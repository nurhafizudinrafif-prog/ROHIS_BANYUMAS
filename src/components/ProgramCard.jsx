import { BookOpen, Heart, Users, Megaphone } from 'lucide-react';
import './ProgramCard.css';

const iconMap = {
  BookOpen: BookOpen,
  Heart: Heart,
  Users: Users,
  Megaphone: Megaphone,
};

export default function ProgramCard({ program, index = 0 }) {
  const Icon = iconMap[program.icon] || BookOpen;

  return (
    <div className={`program-card card animate-on-scroll delay-${index + 1}`}>
      <div className="program-card-icon" style={{ '--accent': program.color }}>
        <Icon size={28} />
      </div>
      <div className="card-body">
        <h3 className="program-card-title">{program.title}</h3>
        <p className="program-card-desc">{program.description}</p>
        {program.details && (
          <ul className="program-card-list">
            {program.details.slice(0, 3).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
