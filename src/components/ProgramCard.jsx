import { UserCheck, BookOpen, Newspaper, Megaphone, Wallet, Users, Heart } from 'lucide-react';
import './ProgramCard.css';

const iconMap = {
  UserCheck: UserCheck,
  BookOpen: BookOpen,
  Newspaper: Newspaper,
  Megaphone: Megaphone,
  Wallet: Wallet,
  Users: Users,
  Heart: Heart,
};

export default function ProgramCard({ program, index = 0 }) {
  const Icon = iconMap[program.icon] || BookOpen;

  return (
    <div className={`program-card card animate-on-scroll delay-${(index % 3) + 1}`}>
      <div className="program-card-icon" style={{ '--accent': program.color }}>
        <Icon size={32} />
      </div>
      <div className="card-body">
        {program.division && (
          <span
            className="badge badge-primary program-card-badge"
            style={{
              borderColor: program.color,
              color: program.color,
              background: `color-mix(in srgb, ${program.color} 12%, transparent)`,
            }}
          >
            {program.division}
          </span>
        )}
        <h3 className="program-card-title">{program.title}</h3>
        <p className="program-card-desc">{program.description}</p>
        {program.details && (
          <ul className="program-card-list">
            {program.details.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
