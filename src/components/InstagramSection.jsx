import { CheckCircle2, ExternalLink, Heart, MessageCircle } from 'lucide-react';
import logoImg from '../assets/logo.png';
import './InstagramSection.css';

export function InstagramIcon({ size = 18, className = '' }) {
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
      className={className}
      style={{ flexShrink: 0 }}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function YoutubeIcon({ size = 18, className = '' }) {
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
      className={className}
      style={{ flexShrink: 0 }}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

const mockFeed = [
  {
    id: 1,
    category: 'KAJIAN RUTIN',
    title: 'Kajian Ahad Pagi Rutin Se-Banyumas',
    tag: '#KajianBanyumas #DakwahPelajar',
    emoji: '📖',
    likes: 384,
    comments: 42,
    gradient: 'linear-gradient(135deg, rgba(5, 150, 105, 0.4), rgba(15, 23, 42, 0.9))',
  },
  {
    id: 2,
    category: 'LEADERSHIP',
    title: 'Latihan Dasar Kepemimpinan (LDK) 2025',
    tag: '#LDKROHIS #KaderMudaIslam',
    emoji: '🎓',
    likes: 512,
    comments: 67,
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(15, 23, 42, 0.9))',
  },
  {
    id: 3,
    category: 'SOSIAL & PEDULI',
    title: 'Bakti Sosial & Santunan Ramadhan Berkah',
    tag: '#ROHISPeduli #UkhuwahIslamiyah',
    emoji: '🤝',
    likes: 429,
    comments: 38,
    gradient: 'linear-gradient(135deg, rgba(212, 168, 67, 0.4), rgba(15, 23, 42, 0.9))',
  },
  {
    id: 4,
    category: 'SYIAR DIGITAL',
    title: 'Festival Da\'i Muda Pelajar Banyumas',
    tag: '#DaiMuda #GenerasiQurani',
    emoji: '🎤',
    likes: 461,
    comments: 54,
    gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(15, 23, 42, 0.9))',
  },
];

export default function InstagramSection() {
  const igUrl = 'https://www.instagram.com/rohis_banyumas/';
  const ytUrl = 'https://youtube.com/@rohisbanyumas9?si=bJpq4dcozF81AHGr';

  return (
    <section className="section section-ig-showcase">
      <div className="container">
        {/* Profile Card Header */}
        <div className="ig-profile-card card animate-on-scroll">
          <div className="ig-profile-header">
            {/* Avatar with gradient ring */}
            <div className="ig-avatar-ring">
              <div className="ig-avatar-inner">
                <img src={logoImg} alt="Logo Rohis Kabupaten Banyumas" className="ig-avatar-img" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="ig-info">
              <div className="ig-handle-row">
                <h3 className="ig-handle">rohis_banyumas</h3>
                <span className="ig-verified-badge" title="Official Account Terverifikasi">
                  <CheckCircle2 size={18} />
                </span>
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ig-follow"
                >
                  <InstagramIcon size={16} />
                  Ikuti Akun Resmi
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="ig-stats-row">
                <div className="ig-stat">
                  <strong>701</strong> <span>postingan</span>
                </div>
                <div className="ig-stat">
                  <strong>972</strong> <span>pengikut</span>
                </div>
                <div className="ig-stat">
                  <strong>81</strong> <span>mengikuti</span>
                </div>
              </div>

              <div className="ig-bio">
                <h4 className="ig-display-name">Rohis Kabupaten Banyumas</h4>
                <p className="ig-bio-text">
                  Official Account Rohis Kabupaten Banyumas 🌟
                  <br />
                  Dibawah Naungan <strong>Kementerian Agama Kab. Banyumas</strong> (@kankemenagbanyumas)
                </p>
                <div className="ig-bio-links">
                  <a
                    href={ytUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ig-link-pill ig-link-yt"
                  >
                    <YoutubeIcon size={14} />
                    youtube.com/@rohisbanyumas9
                  </a>
                  <a
                    href={igUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ig-link-pill ig-link-ig"
                  >
                    <InstagramIcon size={14} />
                    instagram.com/rohis_banyumas
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Grid Preview */}
          <div className="ig-feed-header">
            <div className="ig-feed-title">
              <InstagramIcon size={18} />
              <span>Postingan & Dokumentasi Terbaru di Instagram</span>
            </div>
            <a
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ig-view-all"
            >
              Buka Feed Instagram <ExternalLink size={13} />
            </a>
          </div>

          <div className="ig-feed-grid">
            {mockFeed.map((post) => (
              <a
                key={post.id}
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ig-feed-card"
                style={{ background: post.gradient }}
              >
                <div className="ig-card-badge">{post.category}</div>
                <div className="ig-card-emoji">{post.emoji}</div>
                <div className="ig-card-content">
                  <h5>{post.title}</h5>
                  <span className="ig-card-tag">{post.tag}</span>
                </div>
                <div className="ig-card-overlay">
                  <div className="ig-card-metrics">
                    <span><Heart size={16} fill="white" /> {post.likes}</span>
                    <span><MessageCircle size={16} fill="white" /> {post.comments}</span>
                  </div>
                  <span className="ig-card-cta">Lihat di Instagram</span>
                </div>
              </a>
            ))}
          </div>

          {/* Footer Banner */}
          <div className="ig-card-footer">
            <p>
              ✨ <strong>Selalu update kegiatan dakwah!</strong> Follow Instagram resmi kami di{' '}
              <a href={igUrl} target="_blank" rel="noopener noreferrer" className="ig-footer-link">
                @rohis_banyumas
              </a>{' '}
              untuk info jadwal kajian, pendaftaran event, materi dakwah digital, dan siaran langsung.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
