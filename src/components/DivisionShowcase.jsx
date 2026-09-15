import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Users, Shield, ArrowRight, X } from 'lucide-react';
import TeamCard from './TeamCard';
import './DivisionShowcase.css';

export default function DivisionShowcase({ divisions = [], bph = null, defaultOpenId = null }) {
  const [activeDivisionId, setActiveDivisionId] = useState(defaultOpenId);
  const detailRef = useRef(null);

  const handleToggle = (id) => {
    if (activeDivisionId === id) {
      setActiveDivisionId(null);
    } else {
      setActiveDivisionId(id);
    }
  };

  // Smooth scroll into detail view when a division is opened
  useEffect(() => {
    if (activeDivisionId && detailRef.current) {
      const yOffset = -90; // offset for sticky navbar
      const y = detailRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [activeDivisionId]);

  const activeDivision = divisions.find((d) => d.id === activeDivisionId) || 
    (bph && bph.id === activeDivisionId ? bph : null);

  return (
    <div className="division-showcase">
      {/* ── Division Cards Grid (Default View: Logo + Division Title) ── */}
      <div className="division-cards-grid">
        {divisions.map((div) => {
          const isOpen = activeDivisionId === div.id;
          return (
            <div
              key={div.id}
              className={`division-card ${isOpen ? 'is-active' : ''}`}
              style={{
                '--div-accent': div.color || 'var(--color-emerald)',
              }}
              onClick={() => handleToggle(div.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleToggle(div.id);
                }
              }}
              aria-expanded={isOpen}
              aria-label={`Buka detail ${div.name}`}
            >
              {/* Division Logo */}
              <div className="division-card-logo-wrap">
                {div.logoImg ? (
                  <img
                    src={div.logoImg}
                    alt={`Logo ${div.name}`}
                    className="division-card-logo-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="division-card-logo-fallback">
                    <span>{div.shortName}</span>
                  </div>
                )}
                <div className="division-card-logo-halo" />
              </div>

              {/* Division Identity */}
              <div className="division-card-body">
                <span className="division-card-badge">
                  {div.shortName}
                </span>
                <h3 className="division-card-title">{div.name}</h3>
                <p className="division-card-count">
                  <Users size={14} />
                  <span>{div.members?.length || 0} Pengurus Aktif</span>
                </p>
              </div>

              {/* Action Indicator */}
              <div className="division-card-indicator">
                <span className="division-card-action-text">
                  {isOpen ? 'Tutup' : 'Buka Detail'}
                </span>
                <div className="division-card-icon-circle">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Cinematic Detailed Division Showcase ── */}
      {activeDivision && (
        <div 
          className="division-detail-stage animate-cinematic" 
          ref={detailRef}
          style={{
            '--stage-accent': activeDivision.color || 'var(--color-emerald)',
          }}
        >
          {/* Header Banner */}
          <div className="division-detail-header">
            <div className="division-detail-info">
              <div className="division-detail-logo">
                {activeDivision.logoImg ? (
                  <img
                    src={activeDivision.logoImg}
                    alt={activeDivision.name}
                    className="division-detail-img"
                  />
                ) : (
                  <div className="division-detail-fallback">
                    <span>{activeDivision.shortName}</span>
                  </div>
                )}
              </div>
              <div className="division-detail-text">
                <div className="division-detail-tags">
                  <span className="badge badge-primary division-detail-badge">
                    {activeDivision.shortName}
                  </span>
                  <span className="division-detail-meta">
                    {activeDivision.members?.length || 0} Pengurus Aktif
                  </span>
                </div>
                <h2 className="division-detail-title">{activeDivision.name}</h2>
                <p className="division-detail-desc">{activeDivision.description}</p>
              </div>
            </div>

            <button
              className="division-detail-close-btn"
              onClick={() => setActiveDivisionId(null)}
              aria-label="Tutup detail divisi"
            >
              <X size={18} />
              <span>Tutup</span>
            </button>
          </div>

          {/* Koordinator Highlight Card if exists */}
          {(() => {
            const koordinator = activeDivision.members?.find((m) =>
              m.role?.toLowerCase().includes('koordinator') || m.role?.toLowerCase().includes('ketua')
            );
            if (!koordinator) return null;
            return (
              <div className="division-koordinator-banner">
                <div className="division-koordinator-badge">
                  <Shield size={16} />
                  <span>Koordinator Divisi</span>
                </div>
                <div className="division-koordinator-content">
                  <span className="division-koordinator-name">{koordinator.name}</span>
                  <span className="division-koordinator-school">{koordinator.school}</span>
                </div>
              </div>
            );
          })()}

          {/* Member Cards Grid with Staggered Fade-in */}
          <div className="division-members-section">
            <h4 className="division-members-headline">
              Daftar Seluruh Pengurus ({activeDivision.members?.length || 0} Orang)
            </h4>
            <div className="grid grid-3 division-members-grid">
              {activeDivision.members?.map((member, idx) => (
                <div
                  key={member.id || idx}
                  className="division-member-stagger-item"
                  style={{ animationDelay: `${Math.min(idx * 0.05, 0.45)}s` }}
                >
                  <TeamCard
                    member={member}
                    index={idx}
                    accentColor={activeDivision.color}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Collapse Action */}
          <div className="division-detail-footer">
            <button
              className="btn btn-outline division-collapse-btn"
              onClick={() => setActiveDivisionId(null)}
            >
              <ChevronUp size={16} />
              <span>Tutup Tampilan Divisi {activeDivision.shortName}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
