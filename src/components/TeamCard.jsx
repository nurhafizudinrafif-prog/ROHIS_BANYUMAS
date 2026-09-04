import { AtSign, Mail } from 'lucide-react';
import './TeamCard.css';

export default function TeamCard({ member, index = 0 }) {
  return (
    <div className={`team-card animate-on-scroll delay-${(index % 4) + 1}`}>
      <div className="team-card-avatar">
        <div className="team-card-avatar-placeholder">
          {member.name.charAt(0)}
        </div>
      </div>
      <div className="team-card-info">
        <h4 className="team-card-name">{member.name}</h4>
        <span className="team-card-role">{member.role}</span>
        <span className="team-card-school">{member.school}</span>
        {member.bio && <p className="team-card-bio">{member.bio}</p>}
        {member.social && (
          <div className="team-card-social">
            {member.social.instagram && (
              <a href={member.social.instagram} className="team-card-social-link" aria-label="Instagram">
                <AtSign size={14} />
              </a>
            )}
            {member.social.email && (
              <a href={`mailto:${member.social.email}`} className="team-card-social-link" aria-label="Email">
                <Mail size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
