import { useEffect, useRef, useState } from 'react';
import { Users, School, Calendar, Award } from 'lucide-react';
import './StatsCounter.css';

const stats = [
  { icon: School, value: 15, suffix: '+', label: 'Dari Sekolah Kab. Banyumas' },
  { icon: Users, value: 53, suffix: '+', label: 'Anggota Aktif' },
  { icon: Calendar, value: 7, suffix: '+', label: 'Event Besar' },
  { icon: Award, value: 2017, suffix: '', label: 'Tahun Berdiri', noSeparator: true },
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
      { threshold: 0.5 }
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
              <div key={i} className="stat-item animate-on-scroll">
                <div className="stat-icon">
                  <Icon size={28} />
                </div>
                <CountUp target={stat.value} suffix={stat.suffix} noSeparator={stat.noSeparator} />
                <span className="stat-label">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
