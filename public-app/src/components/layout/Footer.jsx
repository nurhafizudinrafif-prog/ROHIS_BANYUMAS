import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="rk-footer-wrap">
      <div className="rk-footer-bar">
        <span className="rk-footer-brand">ROHIS Kabupaten Banyumas</span>

        <div className="rk-footer-right">
          <span className="rk-footer-divider" aria-hidden="true" />
          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#F7F5F0',
              fontWeight: 600,
            }}
          >
            <span>Hubungi kami</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
