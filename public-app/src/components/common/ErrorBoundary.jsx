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
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F1F2ED',
            padding: '24px',
            color: '#10291F',
            textAlign: 'center',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          <div
            className="rk-soft-card"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '32px 24px',
            }}
          >
            <h2 style={{ fontSize: '1.35rem', marginBottom: '10px' }}>
              Terjadi kendala saat memuat halaman
            </h2>
            <p style={{ fontSize: '0.92rem', marginBottom: '20px', color: '#495A51' }}>
              Silakan segarkan halaman atau kembali ke beranda untuk melanjutkan.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={this.handleReload}
                className="rk-btn-primary"
              >
                Segarkan halaman
              </button>
              <a href="/" className="rk-btn-secondary">
                Kembali ke beranda
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
