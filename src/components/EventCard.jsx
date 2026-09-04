import { MapPin, Clock, User } from 'lucide-react';
import { formatDateShort } from '../utils';
import './EventCard.css';

export default function EventCard({ event, index = 0 }) {
  const dateShort = formatDateShort(event.date);

  return (
    <div className={`event-card card animate-on-scroll delay-${(index % 4) + 1}`}>
      <div className={`event-card-date ${event.status === 'completed' ? 'completed' : ''}`}>
        <span className="event-card-day">{dateShort.day}</span>
        <span className="event-card-month">{dateShort.month}</span>
      </div>
      <div className="card-body event-card-body">
        <div className="event-card-header">
          <span className={`badge ${event.status === 'upcoming' ? 'badge-primary' : 'badge-gold'}`}>
            {event.status === 'upcoming' ? 'Mendatang' : 'Selesai'}
          </span>
          <span className="event-card-type">{event.type}</span>
        </div>
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-desc">{event.description}</p>
        <div className="event-card-details">
          <div className="event-card-detail">
            <Clock size={14} />
            <span>{event.time}</span>
          </div>
          <div className="event-card-detail">
            <MapPin size={14} />
            <span>{event.location}</span>
          </div>
          {event.speaker && (
            <div className="event-card-detail">
              <User size={14} />
              <span>{event.speaker}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
