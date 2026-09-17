import { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Unlock,
  Terminal,
  Send,
  GitBranch,
  GitCommit,
  RotateCcw,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RefreshCw,
  LogOut,
  Code2,
  Layers,
  Check,
  Camera,
  X,
  Image as ImageIcon,
  Paperclip,
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import './CloudAgent.css';

const PRESETS = [
  {
    label: 'Ubah Judul / Hero',
    icon: Sparkles,
    prompt: 'Tolong ubah teks headline hero di halaman utama menjadi "..." dan sesuaikan kalimat penjelasannya agar lebih menarik.',
  },
  {
    label: 'Ubah Warna & Styling',
    icon: Code2,
    prompt: 'Tolong sesuaikan warna tombol CTA dan border aksen di seluruh halaman agar memiliki efek kilauan neon cyan emerald yang lebih kuat.',
  },
  {
    label: 'Update Agenda / Kajian',
    icon: Layers,
    prompt: 'Tolong tambahkan jadwal kajian baru untuk hari Ahad besok dengan tema "Generasi Qurani Pemimpin Peradaban" di Masjid Baitussalam Purwokerto.',
  },
  {
    label: 'Perbaiki Tampilan Mobile',
    icon: Terminal,
    prompt: 'Tolong periksa apakah ada elemen yang kepanjangan atau padding yang terlalu besar pada tampilan HP di halaman tentang dan kontak.',
  },
];

export default function CloudAgent() {
  const [pin, setPin] = useState(() => localStorage.getItem('cloud_agent_pin') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [logs, setLogs] = useState([
    `[${new Date().toLocaleTimeString('id-ID')}] Antigravity Cloud Console siap. Hubungkan instruksi Anda.`
  ]);
  const [resultSummary, setResultSummary] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Photo / Screenshot Revision Attachment
  const [attachedPhoto, setAttachedPhoto] = useState(null); // { data, mimeType, name, sizeFormatted }
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const logsEndRef = useRef(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Check saved PIN on mount
  useEffect(() => {
    if (pin) {
      verifyPin(pin);
    }
  }, []);

  async function verifyPin(enteredPin) {
    setAuthError('');
    try {
      const res = await fetch('/api/cloud-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin, action: 'status' }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setPin(enteredPin);
        localStorage.setItem('cloud_agent_pin', enteredPin);
        setStatusData(data);
      } else {
        setAuthError(data.error || 'PIN tidak valid.');
        setIsAuthenticated(false);
        localStorage.removeItem('cloud_agent_pin');
      }
    } catch {
      // If running locally without /api serverless, allow dev pass
      if (window.location.hostname === 'localhost') {
        setIsAuthenticated(true);
        setPin(enteredPin);
      } else {
        setAuthError('Gagal menghubungi Cloud Agent API.');
      }
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    if (!pinInput.trim()) {
      setAuthError('Masukkan PIN terlebih dahulu.');
      return;
    }
    verifyPin(pinInput.trim());
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setPin('');
    localStorage.removeItem('cloud_agent_pin');
    setPinInput('');
  }

  async function refreshStatus() {
    try {
      const res = await fetch('/api/cloud-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, action: 'status' }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusData(data);
      }
    } catch {}
  }

  function handlePhotoSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Harap pilih berkas gambar (JPG, PNG, WEBP).');
      return;
    }

    setIsCompressingPhoto(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress image to max 1280px to keep payload snappy and under 250KB
        const maxDim = 1280;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        const approxKb = Math.round((compressedDataUrl.length * 0.75) / 1024);

        setAttachedPhoto({
          data: compressedDataUrl,
          mimeType: 'image/jpeg',
          name: file.name,
          sizeFormatted: `${approxKb} KB`,
        });
        setIsCompressingPhoto(false);
      };
      img.onerror = () => {
        setIsCompressingPhoto(false);
        alert('Gagal membaca gambar.');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function removeAttachedPhoto() {
    setAttachedPhoto(null);
  }

  async function handleExecute(e) {
    e?.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResultSummary(null);
    const userPrompt = prompt.trim();
    const photoPayload = attachedPhoto
      ? {
          data: attachedPhoto.data,
          mimeType: attachedPhoto.mimeType,
          name: attachedPhoto.name,
        }
      : null;

    setPrompt('');

    const newLogs = [
      ...logs,
      `--- INTRUKSI BARU ---`,
      `[User]: "${userPrompt}"`,
      ...(attachedPhoto ? [`[User]: Melampirkan foto revisi (${attachedPhoto.name} - ${attachedPhoto.sizeFormatted})`] : []),
      `[Cloud]: Mengirim instruksi ke Antigravity Cloud Engine...`,
    ];
    setLogs(newLogs);

    try {
      const res = await fetch('/api/cloud-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin,
          action: 'execute',
          prompt: userPrompt,
          photo: photoPayload,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResultSummary({
          type: 'success',
          summary: data.summary,
          commit: data.commit,
          files: data.updatedFiles,
        });

        const returnedLogs = data.logs || [];
        setLogs((prev) => [
          ...prev,
          ...returnedLogs,
          `[SUCCESS]: Commit ${data.commit?.sha} berhasil di-push ke GitHub main!`,
          `[DEPLOY]: Vercel auto-deploy sedang berjalan. Web live dalam ~30 detik.`,
        ]);
        refreshStatus();
      } else {
        setResultSummary({
          type: 'error',
          error: data.error,
          missingKeys: data.missingKeys,
        });
        setLogs((prev) => [
          ...prev,
          `[ERROR]: ${data.error}`,
          ...(data.missingKeys ? [`[SETUP]: Tambahkan ${data.missingKeys.join(', ')} di Vercel Settings.`] : []),
        ]);
      }
    } catch (err) {
      setResultSummary({
        type: 'error',
        error: err.message,
      });
      setLogs((prev) => [...prev, `[NETWORK ERROR]: Gagal terhubung ke API Cloud: ${err.message}`]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRollback() {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan (rollback) commit terakhir di GitHub?')) {
      return;
    }

    setIsLoading(true);
    setLogs((prev) => [...prev, `[Cloud]: Menjalankan rollback commit terakhir...`]);

    try {
      const res = await fetch('/api/cloud-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, action: 'rollback' }),
      });
      const data = await res.json();
      if (data.success) {
        setLogs((prev) => [...prev, `[SUCCESS]: ${data.message}`]);
        alert(data.message);
        refreshStatus();
      } else {
        setLogs((prev) => [...prev, `[ROLLBACK ERROR]: ${data.error}`]);
        alert('Gagal rollback: ' + data.error);
      }
    } catch (e) {
      setLogs((prev) => [...prev, `[ROLLBACK ERROR]: ${e.message}`]);
    } finally {
      setIsLoading(false);
    }
  }

  // ── 1. PIN Lock Screen ──
  if (!isAuthenticated) {
    return (
      <div className="cloud-agent-page">
        <div className="pin-lock-wrapper">
          <form className="pin-lock-card" onSubmit={handleLogin}>
            <div className="pin-lock-icon-box">
              <Lock size={28} />
            </div>
            <h2 className="pin-lock-title">Antigravity Cloud</h2>
            <p className="pin-lock-subtitle">
              Akses kendali website ROHIS Banyumas langsung dari HP tanpa membuka laptop. Masukkan PIN keamanan Anda.
            </p>

            <div className="pin-input-group">
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                placeholder="••••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="pin-input"
                autoFocus
              />
            </div>

            {authError && (
              <p style={{ color: '#FF6B6B', fontSize: '0.82rem', marginBottom: '14px' }}>
                {authError}
              </p>
            )}

            <button type="submit" className="btn-unlock">
              <Unlock size={18} />
              <span>Buka Remote Console</span>
            </button>

            <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', marginTop: '16px' }}>
              Default PIN awal: <code>123456</code> (dapat diubah di Vercel)
            </span>
          </form>
        </div>
      </div>
    );
  }

  // ── 2. Authenticated Dashboard ──
  return (
    <div className="cloud-agent-page">
      <div className="cloud-agent-container">
        {/* Topbar */}
        <header className="agent-topbar">
          <div className="agent-topbar-brand">
            <img src={logoImg} alt="ROHIS" className="agent-topbar-logo" />
            <div className="agent-topbar-text">
              <h1>ROHIS Banyumas</h1>
              <div className="agent-status-pill">
                <span className="status-dot-pulse" />
                <span>Cloud Agent 24/7</span>
              </div>
            </div>
          </div>

          <div className="agent-topbar-actions">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="btn-icon-topbar"
              title="Petunjuk Setup Cloud"
            >
              <HelpCircle size={17} />
            </button>
            <a
              href="https://www.rohis-banyumas.web.id"
              target="_blank"
              rel="noreferrer"
              className="btn-icon-topbar"
              title="Buka Web Live"
            >
              <ExternalLink size={17} />
            </a>
            <button onClick={handleLogout} className="btn-icon-topbar" title="Kunci / Keluar">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Setup Help Warning (if keys not set) */}
        {(showHelp || (statusData && !statusData.hasGeminiKey)) && (
          <div className="config-warning-banner">
            <div className="config-warning-title">
              <AlertTriangle size={18} />
              <span>Konfigurasi Vercel Environment Variables</span>
            </div>
            <p className="config-warning-desc">
              Agar Cloud Agent bisa mengedit kode di GitHub saat laptop Anda mati, pastikan 2 Environment Variable ini sudah ditambahkan di <strong>Vercel Project Settings &gt; Environment Variables</strong>:
            </p>
            <div className="config-warning-code">
              1. GITHUB_TOKEN = (Personal Access Token GitHub)<br />
              2. GEMINI_API_KEY = (API Key dari aistudio.google.com)<br />
              3. AGENT_PIN = 123456 (opsional, ganti PIN Anda)
            </div>
          </div>
        )}

        {/* Repo & Branch Status Card */}
        <div className="repo-info-card">
          <div className="repo-info-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GitBranch size={15} color="#00F0CF" />
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>
                {statusData?.repo || 'nurhafizudinrafif-prog/ROHIS_BANYUMAS'}
              </span>
            </div>
            <span className="repo-badge-branch">main</span>
          </div>

          <div className="repo-commit-row">
            <GitCommit size={15} color="#00F0CF" />
            <span className="commit-sha-badge">
              {statusData?.latestCommit?.sha || 'live'}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'rgba(220, 240, 235, 0.9)' }}>
              {statusData?.latestCommit?.message || 'Sinkronisasi cloud repositori aktif'}
            </span>
          </div>
        </div>

        {/* Quick Action Presets */}
        <div className="presets-wrap">
          <span className="presets-label">⚡ Template Cepat</span>
          <div className="presets-scroll">
            {PRESETS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setPrompt(p.prompt)}
                  className="preset-chip"
                >
                  <Icon size={13} color="#00F0CF" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Command Input Card */}
        <div className="command-card">
          <div className="command-label-row">
            <span className="command-label">
              <Terminal size={15} />
              <span>Instruksi untuk AI Agent</span>
            </span>
            <span className="mode-tag-auto">Auto-Approve Active</span>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ketik apa yang ingin Anda ubah pada website... (Contoh: Tolong ganti tulisan di hero section menjadi 'Bersatu dalam Iman, Unggul dalam Karya', lalu push ke main)"
            className="command-textarea"
            rows={3}
            disabled={isLoading}
          />

          {/* Photo Attachment Zone */}
          <div className="photo-attachment-zone">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoSelect}
              style={{ display: 'none' }}
              id="cloud-agent-photo-input"
            />

            {!attachedPhoto ? (
              <button
                type="button"
                className="btn-attach-photo"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isCompressingPhoto}
              >
                {isCompressingPhoto ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Mengompres foto di HP...</span>
                  </>
                ) : (
                  <>
                    <Camera size={16} color="#00F0CF" />
                    <span>+ Lampirkan Foto / Screenshot Revisi</span>
                  </>
                )}
              </button>
            ) : (
              <div className="attached-photo-preview-card">
                <div className="photo-thumb-wrap">
                  <img src={attachedPhoto.data} alt="Foto Revisi" className="photo-thumb-img" />
                </div>
                <div className="photo-meta-info">
                  <div className="photo-meta-badge">
                    <CheckCircle2 size={12} color="#00F0CF" />
                    <span>Foto Revisi Terlampir</span>
                  </div>
                  <span className="photo-file-name">
                    {attachedPhoto.name} ({attachedPhoto.sizeFormatted})
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-remove-photo"
                  onClick={removeAttachedPhoto}
                  disabled={isLoading}
                  title="Hapus foto"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleExecute}
            disabled={isLoading || !prompt.trim()}
            className="btn-execute"
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Cloud Agent Sedang Bekerja...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Kirim Perintah ke Cloud</span>
              </>
            )}
          </button>
        </div>

        {/* Result Summary Card */}
        {resultSummary && (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '20px',
              background:
                resultSummary.type === 'success'
                  ? 'rgba(0, 255, 200, 0.12)'
                  : 'rgba(255, 107, 107, 0.12)',
              border:
                resultSummary.type === 'success'
                  ? '1.2px solid rgba(0, 255, 200, 0.4)'
                  : '1.2px solid rgba(255, 107, 107, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
              {resultSummary.type === 'success' ? (
                <>
                  <CheckCircle2 size={18} color="#00F0CF" />
                  <span style={{ color: '#00F0CF' }}>Eksekusi Cloud Sukses</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={18} color="#FF6B6B" />
                  <span style={{ color: '#FF6B6B' }}>Eksekusi Gagal</span>
                </>
              )}
            </div>
            <p style={{ fontSize: '0.86rem', color: '#FFFFFF', margin: 0, lineHeight: 1.5 }}>
              {resultSummary.summary || resultSummary.error}
            </p>
            {resultSummary.commit && (
              <a
                href={resultSummary.commit.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '0.78rem',
                  color: '#00F0CF',
                  textDecoration: 'underline',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                }}
              >
                <span>Lihat Commit di GitHub ({resultSummary.commit.sha})</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}

        {/* Live Terminal Output Console */}
        <div className="terminal-card">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="terminal-dot dot-red" />
              <span className="terminal-dot dot-yellow" />
              <span className="terminal-dot dot-green" />
            </div>
            <span>agent_execution.log</span>
            <button
              onClick={handleRollback}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#E5C378',
                fontSize: '0.72rem',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
              }}
              title="Rollback commit terakhir"
            >
              <RotateCcw size={12} />
              <span>Rollback</span>
            </button>
          </div>

          <div className="terminal-body">
            {logs.map((line, idx) => {
              const isSuccess = line.includes('[SUCCESS]') || line.includes('[DEPLOY]');
              const isError = line.includes('[ERROR]');
              return (
                <div
                  key={idx}
                  className={`terminal-line ${
                    isSuccess
                      ? 'terminal-line-success'
                      : isError
                      ? 'terminal-line-error'
                      : ''
                  }`}
                >
                  {line}
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
