import { useState } from 'react';
import {
  Container,
  InsetField,
  PrimaryButton,
  SoftCard,
} from '../components/ui/SoftUI';

const STORAGE_KEY = 'rokaba:contact_submissions';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      existing.unshift({
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }

    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(true);
  };

  return (
    <div className="rk-page">
      {/* 1. HEADER */}
      <section className="rk-page-header">
        <Container>
          <div className="rk-eyebrow" style={{ marginBottom: '8px' }}>
            <span className="rk-eyebrow-bar" aria-hidden="true" />
          </div>

          <h1 className="rk-page-title">Mari terhubung</h1>
        </Container>
      </section>

      {/* 2. TWO-COLUMN LAYOUT */}
      <section className="rk-section" style={{ paddingTop: '8px' }}>
        <Container>
          <div className="rk-split-40-60" style={{ alignItems: 'start' }}>
            {/* Left Info Card */}
            <SoftCard
              style={{
                padding: 'clamp(24px, 3vw, 34px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '16px',
                minHeight: '260px',
              }}
            >
              <h2
                style={{
                  fontSize: 'clamp(1.45rem, 2.2vw, 1.85rem)',
                  lineHeight: 1.2,
                }}
              >
                Kabupaten
                <br />
                Banyumas
              </h2>

              <span className="rk-eyebrow-bar" aria-hidden="true" />

              <a
                href="mailto:rokaba.banyumas@gmail.com"
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: 'var(--rk-ink)',
                  wordBreak: 'break-word',
                }}
              >
                rokaba.banyumas@gmail.com
              </a>
            </SoftCard>

            {/* Right Form Card */}
            <SoftCard style={{ padding: 'clamp(20px, 2.5vw, 28px)' }}>
              <form
                onSubmit={handleSubmit}
                style={{ display: 'grid', gap: '14px' }}
              >
                <InsetField
                  label="Nama"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (submitted) setSubmitted(false);
                  }}
                />

                <InsetField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (submitted) setSubmitted(false);
                  }}
                />

                <InsetField
                  label="Pesan"
                  as="textarea"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (submitted) setSubmitted(false);
                  }}
                />

                <PrimaryButton
                  type="submit"
                  style={{ width: '100%', marginTop: '4px' }}
                >
                  Kirim pesan
                </PrimaryButton>

                {submitted && (
                  <p
                    role="status"
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: 'var(--rk-pine)',
                      textAlign: 'center',
                    }}
                  >
                    Pesan berhasil disimpan. Terima kasih telah menghubungi
                    ROKABA.
                  </p>
                )}
              </form>
            </SoftCard>
          </div>
        </Container>
      </section>
    </div>
  );
}
