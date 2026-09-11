import { UserCheck, BookOpen, Newspaper, Megaphone, Wallet, Users, Heart, Check } from 'lucide-react';
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
    <div
      className={`program-glass-card animate-on-scroll delay-${(index % 3) + 1}`}
      style={{ '--accent-color': program.color }}
    >
      {/* Glossy App Icon */}
      <div className="program-glass-icon-wrapper">
        <div className="program-glass-icon">
          <Icon size={28} />
        </div>
      </div>

      {/* Card Content */}
      <div className="program-card-content">
        {program.division && (
          <div className="program-badge-wrapper">
            <span className="program-neon-badge">
              {program.division}
            </span>
          </div>
        )}

        <h3 className="program-card-title">{program.title}</h3>
        <p className="program-card-desc">{program.description}</p>

        {program.details && (
          <ul className="program-card-checklist">
            {program.details.map((item, i) => (
              <li key={i} className="program-check-item">
                <span className="check-icon-box">
                  <Check size={14} />
                </span>
                <span className="check-text">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
