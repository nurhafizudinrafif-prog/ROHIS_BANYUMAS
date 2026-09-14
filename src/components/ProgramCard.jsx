import { useState } from 'react';
import { UserCheck, BookOpen, Newspaper, Megaphone, Wallet, Users, Heart, Check, ChevronDown } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = iconMap[program.icon] || BookOpen;

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className={`program-glass-card ${isExpanded ? 'is-expanded' : ''}`}
      style={{ '--accent-color': program.color }}
      onClick={toggleExpand}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleExpand();
        }
      }}
      aria-expanded={isExpanded}
      aria-label={`${program.title}, klik untuk ${isExpanded ? 'menutup' : 'melihat'} detail`}
    >
      {/* Glossy App Icon */}
      <div className="program-glass-icon-wrapper">
        <div className={`program-glass-icon ${program.logoImg ? 'has-custom-logo' : ''}`}>
          {program.logoImg ? (
            <img src={program.logoImg} alt={program.title} className="program-custom-logo-img" />
          ) : (
            <Icon size={28} />
          )}
        </div>
      </div>

      {/* Card Header Content */}
      <div className="program-card-content">
        {program.division && (
          <div className="program-badge-wrapper">
            <span className="program-neon-badge">
              {program.division}
            </span>
          </div>
        )}

        <h3 className="program-card-title">{program.title}</h3>

        {/* Action Toggle Indicator */}
        <div className="program-card-action">
          <div className="program-expand-btn">
            <span>{isExpanded ? 'Tutup Detail' : 'Detail Program'}</span>
            <ChevronDown size={15} className={`program-chevron ${isExpanded ? 'rotated' : ''}`} />
          </div>
        </div>

        {/* Expandable Body: Description + Checklist */}
        <div className={`program-card-expandable ${isExpanded ? 'open' : ''}`}>
          <div className="program-card-expandable-inner">
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
      </div>
    </div>
  );
}
