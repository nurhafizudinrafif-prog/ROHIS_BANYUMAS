import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import RohisLogo from '../components/RohisLogo';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '', pin: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = login(form.username, form.password, form.pin);
    if (!result.success) setError(result.error);
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--canvas-bg)',
        padding: '1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Login Card (Image 04 Panel 1) */}
        <div
          className="admin-soft-card"
          style={{
            padding: 'clamp(2rem, 5vw, 2.75rem)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--soft-shadow)',
          }}
        >
          {/* Logo & Headings */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
              <RohisLogo size={52} showGlow={false} />
            </div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--pine-dark)',
                letterSpacing: '-0.02em',
                marginBottom: '0.25rem',
              }}
            >
              Masuk ke ROKABA CMS
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              ROHIS Kabupaten Banyumas
            </p>
          </div>

          {/* Inline Error Notice */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                backgroundColor: 'var(--status-red-bg)',
                border: '1px solid var(--status-red-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                color: 'var(--status-red)',
                fontSize: '0.84rem',
              }}
              role="alert"
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label className="form-label-soft" htmlFor="login-username">
                Username
              </label>
              <input
                id="login-username"
                type="text"
                className="form-input-soft"
                placeholder="admin_contoh"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="form-label-soft" htmlFor="login-password">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input-soft"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label={showPass ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="form-label-soft" htmlFor="login-pin">
                PIN (opsional)
              </label>
              <input
                id="login-pin"
                type="password"
                className="form-input-soft"
                placeholder=""
                value={form.pin}
                onChange={(e) => setForm({ ...form, pin: e.target.value })}
                autoComplete="one-time-code"
              />
            </div>

            <button
              type="submit"
              className="btn-pine"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.94rem',
                marginTop: '0.5rem',
              }}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>

            <a
              href="https://www.rohis-banyumas.web.id/"
              className="btn-secondary-soft"
              style={{
                width: '100%',
                padding: '0.68rem',
                fontSize: '0.86rem',
                textAlign: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              Kembali ke website
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
