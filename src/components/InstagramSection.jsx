import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Heart, MessageCircle, Play, Eye, Mail, RefreshCw } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { instagramReels, instagramProfile } from '../data/instagram';
import { useData } from '../context/DataContext';
import { getDirectImageUrl } from '../utils/media';
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

export function ReelsCameraIcon({ size = 16, className = '' }) {
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
    >
      <rect width="18" height="18" x="3" y="3" rx="4" />
      <path d="m10 9 5 3-5 3V9z" fill="currentColor" />
      <path d="M3 8h4" />
      <path d="M17 8h4" />
      <path d="M3 16h4" />
      <path d="M17 16h4" />
    </svg>
  );
}

export default function InstagramSection() {
  const { siteSettings, instagramReels: liveReels } = useData() || {};

  const [profile, setProfile] = useState(instagramProfile);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  const igUrl = profile?.instagramUrl || siteSettings?.instagramUrl || instagramProfile.instagramUrl;
  const ytUrl = profile?.youtubeUrl || siteSettings?.youtubeUrl || instagramProfile.youtubeUrl;
  const reels = (liveReels && liveReels.length > 0) ? liveReels : (siteSettings?.instagramPosts || instagramReels);

  // Live Auto-Sync directly from Instagram via /api/instagram
  const syncInstagramLive = useCallback(async (isManual = false) => {
    if (isManual) setIsSyncing(true);
    try {
      const res = await fetch('/api/instagram');
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
          setIsLiveConnected(true);
        }
      }
    } catch (err) {
      console.log('Using cached profile data');
    } finally {
      if (isManual) {
        setTimeout(() => setIsSyncing(false), 500);
      }
    }
  }, []);

  useEffect(() => {
    syncInstagramLive();
    // Auto-check for updates every 60 seconds
    const interval = setInterval(() => syncInstagramLive(), 60000);
    window.addEventListener('focus', syncInstagramLive);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', syncInstagramLive);
    };
  }, [syncInstagramLive]);

  return (
    <section className="section section-ig-showcase">
      <div className="container">
        {/* Profile Card Header */}
        <div className="ig-profile-card card animate-on-scroll">
          <div className="ig-profile-header">
            {/* Avatar with gradient ring */}
            <div className="ig-avatar-ring">
              <div className="ig-avatar-inner">
                <img
                  src={profile.avatar || logoImg}
                  alt="Logo Rohis Kabupaten Banyumas"
                  className="ig-avatar-img"
                  onError={(e) => {
                    e.currentTarget.src = logoImg;
                  }}
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="ig-info">
              <div className="ig-handle-row">
                <h3 className="ig-handle">{profile.handle || 'rohis_banyumas'}</h3>

                {/* Real-time Live Badge */}
                <div className="ig-live-status-badge" title="Data statistik tersinkronisasi otomatis dari Instagram @rohis_banyumas">
                  <span className="ig-live-pulse-dot-sm"></span>
                  <span>{isLiveConnected ? 'REAL-TIME SYNC' : 'INSTAGRAM RESMI'}</span>
                </div>

                <button
                  type="button"
                  onClick={() => syncInstagramLive(true)}
                  className={`btn-ig-sync-small ${isSyncing ? 'syncing' : ''}`}
                  title="Klik untuk menyinkronkan live dari Instagram sekarang"
                  disabled={isSyncing}
                >
                  <RefreshCw size={11} className={isSyncing ? 'spin-icon' : ''} />
                  <span>{isSyncing ? 'Sinkron...' : 'Live Sync'}</span>
                </button>

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
                  <strong>{profile.postsCount || '701'}</strong> <span>postingan</span>
                </div>
                <div className="ig-stat">
                  <strong>{profile.followersCount || '973'}</strong> <span>pengikut</span>
                </div>
                <div className="ig-stat">
                  <strong>{profile.followingCount || '81'}</strong> <span>mengikuti</span>
                </div>
              </div>

              <div className="ig-bio">
                <h4 className="ig-display-name">{profile.displayName || 'Rohis Kabupaten Banyumas'}</h4>
                <p className="ig-bio-text">
                  Official Account Rohis Kabupaten Banyumas
                  <br />
                  Dibawah Naungan <strong>Kementerian Agama Kab. Banyumas</strong>{' '}
                  <a
                    href="https://www.instagram.com/kankemenagbanyumas/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ig-mention-tag"
                  >
                    @kankemenagbanyumas
                  </a>
                  <br />
                  Email :{' '}
                  <a href="mailto:rohisbanyumas9@gmail.com" className="ig-email-tag">
                    rohisbanyumas9@gmail.com
                  </a>
                </p>
                <div className="ig-bio-links">
                  <a
                    href={ytUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ig-link-pill ig-link-yt"
                  >
                    <YoutubeIcon size={14} />
                    youtube.com/@rohisbanyumas9?si=bJpq4dcozF81AHGr
                  </a>
                  <a
                    href="mailto:rohisbanyumas9@gmail.com"
                    className="ig-link-pill ig-link-email"
                  >
                    <Mail size={14} />
                    rohisbanyumas9@gmail.com
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

          {/* Header Seksi: Dokumentasi Reels & Video Resmi @rohis_banyumas terbaru */}
          <div className="ig-reels-header-pro">
            <div className="ig-reels-header-left">
              <div className="ig-badge-live">
                <span className="ig-live-pulse-dot"></span>
                <ReelsCameraIcon size={13} />
                <span>FEED REELS TERBARU</span>
              </div>
              <h3 className="ig-reels-pro-title">
                Dokumentasi Reels & Video Resmi <span className="ig-handle-highlight">@rohis_banyumas</span> terbaru
              </h3>
              <p className="ig-reels-pro-subtitle">
                Update liputan kegiatan, syiar dakwah, dan keseruan pelajar Islam se-Kabupaten Banyumas yang terhubung langsung dengan Instagram resmi.
              </p>
            </div>
            <div className="ig-reels-header-right">
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-instagram-pro"
              >
                <InstagramIcon size={15} />
                <span>Buka Instagram</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Authentic Instagram Reels Grid */}
          <div className="ig-reels-grid">
            {reels.map((item, index) => {
              const coverImg = getDirectImageUrl(item.image);
              return (
                <a
                  key={item.id || index}
                  href={item.url || igUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-reel-card"
                >
                  {/* Reel Media Preview */}
                  <div className="ig-reel-media">
                    <img
                      src={coverImg}
                      alt={item.title}
                      className="ig-reel-image"
                      loading="lazy"
                    />

                    {/* Top Badges */}
                    <div className="ig-reel-top">
                      <span className="ig-reel-category">{item.category || 'Reels'}</span>
                      <div className="ig-reel-indicator" title="Instagram Reel">
                        <ReelsCameraIcon size={14} />
                      </div>
                    </div>

                    {/* Bottom Persistent Info (Views & Title like real Reels) */}
                    <div className="ig-reel-bottom">
                      <div className="ig-reel-viewcount">
                        <Play size={13} fill="white" />
                        <span>{item.views}</span>
                      </div>
                      <h5 className="ig-reel-title">{item.title}</h5>
                    </div>

                    {/* Hover Overlay: Likes & Comments with dark backdrop */}
                    <div className="ig-reel-hover-overlay">
                      <div className="ig-reel-metrics">
                        <div className="ig-metric-item">
                          <Heart size={20} fill="white" />
                          <span>{item.likes}</span>
                        </div>
                        <div className="ig-metric-item">
                          <MessageCircle size={20} fill="white" />
                          <span>{item.comments}</span>
                        </div>
                      </div>
                      <span className="ig-reel-watch-btn">
                        <Play size={12} fill="white" /> Tonton Reel
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Footer Banner */}
          <div className="ig-card-footer">
            <p>
              ✨ <strong>Selalu update kegiatan dakwah!</strong> Kunjungi Instagram resmi kami di{' '}
              <a href={igUrl} target="_blank" rel="noopener noreferrer" className="ig-footer-link">
                @rohis_banyumas
              </a>{' '}
              untuk melihat 700+ video reels, dokumentasi agenda, podcast, dan informasi kajian pelajar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
