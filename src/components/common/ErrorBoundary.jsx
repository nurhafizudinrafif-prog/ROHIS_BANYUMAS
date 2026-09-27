import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ROKABA ErrorBoundary Caught]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--deep-pine)',
          padding: '2rem',
          color: 'var(--warm-alabaster)',
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
        }}>
          <div style={{
            maxWidth: 480,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 2rem',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontSize: '1.75rem',
            }}>
              ⚠️
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--warm-alabaster)',
              marginBottom: '0.6rem',
            }}>
              Terjadi Kendala Memuat Halaman
            </h2>
            <p style={{
              fontSize: '0.88rem',
              color: 'rgba(245, 242, 237, 0.7)',
              lineHeight: 1.6,
              marginBottom: '1.75rem',
            }}>
              Sistem mendeteksi kendala pada cache peramban atau data sementara. Silakan segarkan halaman untuk melanjutkan.
            </p>
            {this.state.error && (
              <details style={{ textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.25)', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--antique-brass-light)' }}>Informasi Masalah (Debug)</summary>
                <div style={{ marginTop: '0.4rem', fontFamily: 'monospace', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                  {this.state.error?.message || String(this.state.error)}
                </div>
              </details>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={this.handleReload}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.4rem' }}
              >
                Segarkan Halaman
              </button>
              <a
                href="/"
                className="btn btn-outline"
                style={{ padding: '0.65rem 1.4rem', color: 'var(--warm-alabaster)' }}
              >
                Kembali ke Beranda
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
