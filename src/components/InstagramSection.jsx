import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Mail, RefreshCw } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { instagramProfile } from '../data/instagram';
import { useData } from '../context/DataContext';
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

export default function InstagramSection() {
  const { siteSettings, instagramProfile: cloudProfile } = useData() || {};

  const [localProfile, setLocalProfile] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  const profile = localProfile || cloudProfile || instagramProfile;
  const igUrl = profile?.instagramUrl || siteSettings?.instagramUrl || instagramProfile.instagramUrl;
  const ytUrl = profile?.youtubeUrl || siteSettings?.youtubeUrl || instagramProfile.youtubeUrl;

  // Live Auto-Sync directly from Instagram via /api/instagram (with seamless fallback)
  const syncInstagramLive = useCallback(async (isManual = false) => {
    if (isManual) setIsSyncing(true);
    try {
      let res;
      try {
        res = await fetch('/api/instagram');
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
          res = await fetch('https://www.rohis-banyumas.web.id/api/instagram');
        }
      } catch {
        res = await fetch('https://www.rohis-banyumas.web.id/api/instagram');
      }

      if (res && res.ok) {
        const data = await res.json();
        if (data.profile) {
          setLocalProfile(data.profile);
          setIsLiveConnected(true);
        }
      }
    } catch (err) {
      console.log('Using cached profile data', err);
    } finally {
      if (isManual) {
        setTimeout(() => setIsSyncing(false), 500);
      }
    }
  }, []);

  useEffect(() => {
    syncInstagramLive();
    const interval = setInterval(() => syncInstagramLive(), 45000);
    window.addEventListener('focus', () => syncInstagramLive());
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', () => syncInstagramLive());
    };
  }, [syncInstagramLive]);

  return (
    <section className="section section-ig-showcase">
      <div className="container">
        {/* Profile Card Header */}
        <div className="ig-profile-card">
          <div className="ig-profile-header">
            {/* Avatar with gradient ring */}
            <div className="ig-avatar-ring">
              <div className="ig-avatar-inner">
                <img
                  src={profile.avatar || logoImg}
                  alt="Logo Rohis Kabupaten Banyumas"
                  className="ig-avatar-img"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = logoImg;
                  }}
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="ig-info">
              <div className="ig-handle-row">
                <div className="ig-handle-meta">
                  <div className="ig-handle-title-wrap">
                    <h3 className="ig-handle">@{profile.handle?.replace(/^@/, '') || 'rohis_banyumas'}</h3>
                  </div>
                  <div className="ig-live-status-badge" title="Data statistik tersinkronisasi otomatis dari Instagram @rohis_banyumas">
                    <span className="ig-live-pulse-dot-sm"></span>
                    <span>{isLiveConnected ? 'REAL-TIME SYNC' : 'INSTAGRAM RESMI'}</span>
                  </div>
                </div>

                <div className="ig-action-buttons">
                  <button
                    type="button"
                    onClick={() => syncInstagramLive(true)}
                    className={`btn-ig-sync-small ${isSyncing ? 'syncing' : ''}`}
                    title="Klik untuk menyinkronkan live dari Instagram sekarang"
                    disabled={isSyncing}
                  >
                    <RefreshCw size={12} className={isSyncing ? 'spin-icon' : ''} />
                    <span>{isSyncing ? 'Sinkron...' : 'Live Sync'}</span>
                  </button>

                  <a
                    href={igUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ig-follow"
                  >
                    <InstagramIcon size={16} />
                    <span>Ikuti Akun Resmi</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="ig-bio">
                <h4 className="ig-display-name">{profile.displayName || 'Rohis Kabupaten Banyumas'}</h4>
                <div className="ig-bio-text">
                  <p>Official Account Rohis Kabupaten Banyumas</p>
                  <p>
                    Dibawah Naungan <strong>Kementerian Agama Kab. Banyumas</strong>{' '}
                    <a
                      href="https://www.instagram.com/kankemenagbanyumas/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ig-mention-tag"
                    >
                      @kankemenagbanyumas
                    </a>
                  </p>
                  <p>
                    Email :{' '}
                    <a href="mailto:rohisbanyumas9@gmail.com" className="ig-email-tag">
                      rohisbanyumas9@gmail.com
                    </a>
                  </p>
                </div>

                <div className="ig-bio-links">
                  <a
                    href={ytUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ig-link-pill ig-link-yt"
                    title="Kunjungi Channel YouTube Resmi"
                  >
                    <YoutubeIcon size={15} />
                    <span>YouTube @rohisbanyumas9</span>
                  </a>
                  <a
                    href="mailto:rohisbanyumas9@gmail.com"
                    className="ig-link-pill ig-link-email"
                    title="Kirim Email"
                  >
                    <Mail size={15} />
                    <span>rohisbanyumas9@gmail.com</span>
                  </a>
                  <a
                    href={igUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ig-link-pill ig-link-ig"
                    title="Buka Instagram Resmi"
                  >
                    <InstagramIcon size={15} />
                    <span>@rohis_banyumas</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Banner */}
          <div className="ig-card-footer">
            <p>
              ✨ <strong>Selalu update kegiatan dakwah!</strong> Kunjungi Instagram resmi kami di{' '}
              <a href={igUrl} target="_blank" rel="noopener noreferrer" className="ig-footer-link">
                @rohis_banyumas
              </a>{' '}
              untuk melihat video reels, dokumentasi agenda, podcast, dan informasi kajian pelajar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
