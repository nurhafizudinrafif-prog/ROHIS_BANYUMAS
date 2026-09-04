import './SectionHeader.css';

export default function SectionHeader({ badge, title, subtitle, light = false }) {
  return (
    <div className={`section-header ${light ? 'section-header-light' : ''}`}>
      {badge && (
        <span className="section-header-badge badge badge-primary">{badge}</span>
      )}
      <h2 className="section-header-title">{title}</h2>
      <div className="ornament-separator">
        <span className="ornament-diamond"></span>
      </div>
      {subtitle && <p className="section-header-subtitle">{subtitle}</p>}
    </div>
  );
}
