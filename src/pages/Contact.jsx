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
  const [school, setSchool] = useState('');
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
        school: school.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }

    setName('');
    setSchool('');
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
            <span>Sekretariat & Hubungan Masyarakat</span>
          </div>

          <h1 className="rk-page-title">Mari terhubung</h1>
          <p className="rk-page-lead" style={{ marginTop: '8px', maxWidth: '60ch' }}>
            Hubungi Sekretariat ROHIS Kabupaten Banyumas (ROKABA) untuk informasi
            program, undangan delegasi sekolah, maupun kolaborasi kegiatan.
          </p>
        </Container>
      </section>

      {/* 2. TWO-COLUMN LAYOUT */}
      <section className="rk-section" style={{ paddingTop: '8px' }}>
        <Container>
          <div className="rk-split-40-60" style={{ alignItems: 'start' }}>
            {/* Left Info Column */}
            <div style={{ display: 'grid', gap: '16px' }}>
              <SoftCard
                style={{
                  padding: 'clamp(24px, 3vw, 32px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '14px',
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

                <p style={{ fontSize: '0.9rem', lineHeight: 1.65 }}>
                  <strong>Sekretariat Bersama ROKABA</strong>
                  <br />
                  Seksi Pendidikan Agama Islam (PAI) Kantor Kementerian Agama
                  Kabupaten Banyumas, Jl. Mayjen D.J. Panjaitan No. 1,
                  Purwokerto, Jawa Tengah 53141.
                </p>

                <div
                  className="rk-inset-panel"
                  style={{
                    padding: '12px 14px',
                    display: 'grid',
                    gap: '6px',
                  }}
                >
                  <a
                    href="mailto:rokaba.banyumas@gmail.com"
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--rk-pine)',
                      wordBreak: 'break-word',
                    }}
                  >
                    rokaba.banyumas@gmail.com
                  </a>
                  <span style={{ fontSize: '0.82rem', color: 'var(--rk-muted)' }}>
                    Surat resmi & kolaborasi: info@rohisbanyumas.id
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    paddingTop: '4px',
                  }}
                >
                  <a
                    href="https://www.instagram.com/rohis_banyumas"
                    target="_blank"
                    rel="noreferrer"
                    className="rk-pill"
                    style={{ fontSize: '0.8rem', minHeight: '36px' }}
                  >
                    Instagram @rohis_banyumas
                  </a>
                  <a
                    href="https://www.youtube.com/@rohisbanyumas9"
                    target="_blank"
                    rel="noreferrer"
                    className="rk-pill"
                    style={{ fontSize: '0.8rem', minHeight: '36px' }}
                  >
                    YouTube ROKABA
                  </a>
                </div>
              </SoftCard>

              <SoftCard style={{ padding: '18px 22px' }}>
                <strong
                  style={{
                    display: 'block',
                    fontSize: '0.88rem',
                    color: 'var(--rk-ink)',
                    marginBottom: '6px',
                  }}
                >
                  Waktu Layanan Kesekretariatan
                </strong>
                <p style={{ fontSize: '0.84rem', lineHeight: 1.55 }}>
                  Senin – Jumat: 08:00 – 16:00 WIB
                  <br />
                  Sabtu (Koordinasi Pengurus): 08:00 – 12:00 WIB
                </p>
              </SoftCard>
            </div>

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
                  label="Asal Sekolah / Instansi"
                  type="text"
                  placeholder="Contoh: SMA Negeri 4 Purwokerto"
                  value={school}
                  onChange={(e) => {
                    setSchool(e.target.value);
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
