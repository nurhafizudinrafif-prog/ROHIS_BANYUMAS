import './SectionHeader.css';

export default function SectionHeader({ badge, title, subtitle }) {
  return (
    <div className="section-header animate-on-scroll">
      {badge && <span className="section-header-badge">{badge}</span>}
      {title && <h2 className="section-header-title">{title}</h2>}
      <div className="section-header-diamond" aria-hidden="true">✦</div>
      {subtitle && <p className="section-header-subtitle">{subtitle}</p>}
    </div>
  );
}
