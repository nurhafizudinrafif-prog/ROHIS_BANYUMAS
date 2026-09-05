import { Mail, GraduationCap } from 'lucide-react';
import './TeamCard.css';

function InstagramIcon({ size = 13 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function TeamCard({ member, index = 0, accentColor = null }) {
  const igUsername = (member.instagram || member.social?.instagram || '').replace(/^@/, '').trim();
  const isLeader = member.role.toLowerCase().includes('ketua') || member.role.toLowerCase().includes('koordinator');

  return (
    <div
      className={`team-card animate-on-scroll delay-${(index % 4) + 1} ${isLeader ? 'team-card-leader' : ''}`}
      style={accentColor ? { '--team-accent': accentColor } : {}}
    >
      <div className="team-card-avatar">
        <div className="team-card-avatar-placeholder">
          {member.name.charAt(0)}
        </div>
      </div>
      <div className="team-card-info">
        <h4 className="team-card-name">{member.name}</h4>
        <span className={`team-card-role ${isLeader ? 'role-highlight' : ''}`}>{member.role}</span>
        {member.school && (
          <span className="team-card-school" title={member.school}>
            <GraduationCap size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px', flexShrink: 0 }} />
            {member.school}
          </span>
        )}
        {member.bio && <p className="team-card-bio">{member.bio}</p>}
        {igUsername && (
          <div className="team-card-social">
            <a
              href={`https://instagram.com/${igUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="team-card-ig-link"
              title={`Instagram: @${igUsername}`}
              aria-label={`Instagram @${igUsername}`}
            >
              <InstagramIcon size={13} />
              <span>@{igUsername}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
