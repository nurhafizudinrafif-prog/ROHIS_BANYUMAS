import { School, Users, MapPin } from 'lucide-react';
import './MemberSchoolCard.css';

export default function MemberSchoolCard({ school, index = 0 }) {
  return (
    <div className={`school-card card animate-on-scroll delay-${(index % 4) + 1}`}>
      <div className="card-body school-card-body">
        <div className="school-card-icon">
          <School size={24} />
        </div>
        <h4 className="school-card-name">{school.name}</h4>
        <p className="school-card-school">{school.school}</p>
        <div className="school-card-stats">
          <div className="school-card-stat">
            <Users size={14} />
            <span>{school.members} anggota</span>
          </div>
          <div className="school-card-stat">
            <MapPin size={14} />
            <span>{school.address}</span>
          </div>
        </div>
        <div className="school-card-footer">
          <span className="school-card-leader">Ketua: {school.leader}</span>
          <span className="badge badge-primary">Est. {school.established}</span>
        </div>
      </div>
    </div>
  );
}
