import { useEffect, useRef, useState } from 'react';
import { Users, School, Calendar, Award } from 'lucide-react';
import './StatsCounter.css';

const stats = [
  { icon: School, value: 15, suffix: '+', label: 'Dari Sekolah Kab. Banyumas', colorClass: 'stat-green' },
  { icon: Users, value: 53, suffix: '+', label: 'Anggota Aktif', colorClass: 'stat-cyan' },
  { icon: Calendar, value: 7, suffix: '+', label: 'Event Besar', colorClass: 'stat-gold' },
  { icon: Award, value: 2017, suffix: '', label: 'Tahun Berdiri', noSeparator: true, colorClass: 'stat-purple' },
];

function CountUp({ target, suffix, noSeparator = false, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  return (
    <span ref={ref} className="stat-value">
      {noSeparator ? count : count.toLocaleString('id-ID')}{suffix}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={`stat-glass-card ${stat.colorClass} animate-on-scroll delay-${i + 1}`}>
                {/* Glossy Icon Box */}
                <div className="stat-glass-icon-box">
                  <Icon size={26} />
                </div>
                {/* Number Counter */}
                <CountUp target={stat.value} suffix={stat.suffix} noSeparator={stat.noSeparator} />
                {/* Label */}
                <span className="stat-label">{stat.label}</span>
                {/* Gold Diamond Accent Line */}
                <div className="stat-diamond-accent">
                  <span className="diamond-line"></span>
                  <span className="diamond-dot">◆</span>
                  <span className="diamond-line"></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
