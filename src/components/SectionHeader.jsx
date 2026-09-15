import './SectionHeader.css';

export default function SectionHeader({ badge, title, subtitle }) {
  return (
    <div className="section-header animate-on-scroll">
      {badge && <span className="section-header-badge">{badge}</span>}
      {title && <h2 className="section-header-title">{title}</h2>}
      {subtitle && <p className="section-header-subtitle">{subtitle}</p>}
    </div>
  );
}
