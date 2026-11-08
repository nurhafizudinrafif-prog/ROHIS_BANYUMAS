import { useState } from 'react';
import { Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  Container,
  PageHeader,
  SoftCard,
  InsetField,
  PrimaryButton,
} from '../components/ui/SoftUI';

export default function Contact() {
  const { settings = {} } = useData();
  const officialEmail = settings?.contactEmail || 'rokaba.banyumas@gmail.com';
  const addressText = settings?.address || 'Kabupaten Banyumas, Jawa Tengah';
  const instagramUrl =
    settings?.socialLinks?.instagram || 'https://www.instagram.com/rohis_banyumas/';
  const youtubeUrl =
    settings?.socialLinks?.youtube || 'https://www.youtube.com/@rohisbanyumas9';

  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [copied, setCopied] = useState(false);

  const composeFormattedMessage = () => {
    return `Assalamu'alaikum Pengurus ROKABA,\n\nNama: ${name.trim()}\nAsal Sekolah / Instansi: ${
      school.trim() || '-'
    }\nEmail Balasan: ${email.trim()}\nSubjek: ${
      subject.trim() || 'Silaturahmi & Kolaborasi'
    }\n\nPesan:\n${message.trim()}\n\nTerima kasih.`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Mohon lengkapi Nama, Email, dan isi Pesan sebelum mengirim.');
      return;
    }
    setErrorMsg('');

    const mailSubject = subject.trim()
      ? `[ROKABA] ${subject.trim()} — ${name.trim()}`
      : `[ROKABA] Pesan dari ${name.trim()}`;
    const mailBody = composeFormattedMessage();

    setStatusNote(
      `Aplikasi email Anda telah disiapkan menuju ${officialEmail}. Apabila klien email belum terbuka, Anda dapat menggunakan tombol Salin Pesan di samping.`
    );
    window.location.href = `mailto:${officialEmail}?subject=${encodeURIComponent(
      mailSubject
    )}&body=${encodeURIComponent(mailBody)}`;
  };

  const handleCopyMessage = async () => {
    if (!message.trim()) {
      setErrorMsg('Tuliskan isi pesan terlebih dahulu sebelum menyalin.');
      return;
    }
    setErrorMsg('');
    try {
      await navigator.clipboard.writeText(composeFormattedMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rk-page">
      <PageHeader
        breadcrumb={[{ label: 'Beranda', to: '/' }, { label: 'Kontak' }]}
        title="Mari terhubung"
        lead="Untuk undangan kegiatan, kolaborasi sekolah, atau pertanyaan umum seputar ROKABA."
      />

      <section className="rk-section" aria-label="Informasi kontak dan formulir pesan">
        <Container>
          <div className="rk-split-40-60">
            {/* Kartu Kiri: Informasi Kontak Terverifikasi */}
            <SoftCard as="aside" style={{ display: 'grid', gap: '20px' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--rk-brass-text)',
                  }}
                >
                  Wilayah
                </span>
                <h2 style={{ fontSize: '1.22rem', marginTop: '4px' }}>
                  {addressText}
                </h2>
              </div>

              <div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--rk-brass-text)',
                  }}
                >
                  Email resmi
                </span>
                <p style={{ marginTop: '4px', fontSize: '1.02rem', fontWeight: 600 }}>
                  <a
                    href={`mailto:${officialEmail}`}
                    style={{ color: 'var(--rk-ink)', textDecoration: 'underline' }}
                  >
                    {officialEmail}
                  </a>
                </p>
              </div>

              <div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--rk-brass-text)',
                  }}
                >
                  Kanal publikasi resmi
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rk-pill"
                  >
                    Instagram @rohis_banyumas ↗
                  </a>
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rk-pill"
                  >
                    YouTube ROKABA ↗
                  </a>
                </div>
              </div>

              <div
                className="rk-inset-panel"
                style={{ padding: '16px 18px', fontSize: '0.88rem', color: 'var(--rk-muted)' }}
              >
                Untuk kerja sama kegiatan lintas sekolah, sertakan nama sekolah dan kontak pengurus yang dapat dihubungi.
              </div>
            </SoftCard>

            {/* Kartu Kanan: Formulir Pesan */}
            <SoftCard as="section" aria-labelledby="rk-contact-form-heading">
              <h2
                id="rk-contact-form-heading"
                style={{ fontSize: '1.25rem', marginBottom: '16px' }}
              >
                Kirim pesan ke pengurus
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }} noValidate>
                <div className="rk-split-50-50" style={{ gap: '12px' }}>
                  <InsetField
                    id="rk-contact-name"
                    label="Nama lengkap"
                    placeholder="Nama lengkapmu"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <InsetField
                    id="rk-contact-school"
                    label="Asal sekolah / instansi"
                    placeholder="Contoh: SMA Negeri 1 Purwokerto"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                  />
                </div>

                <div className="rk-split-50-50" style={{ gap: '12px' }}>
                  <InsetField
                    id="rk-contact-email"
                    type="email"
                    label="Email"
                    placeholder="nama@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <InsetField
                    id="rk-contact-subject"
                    label="Subjek"
                    placeholder="Contoh: Undangan Kolaborasi Kajian"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <InsetField
                  as="textarea"
                  id="rk-contact-message"
                  label="Pesan"
                  placeholder="Tuliskan maksud, agenda, atau pertanyaan yang ingin disampaikan..."
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                />

                {errorMsg && (
                  <p
                    role="alert"
                    style={{
                      margin: 0,
                      fontSize: '0.85rem',
                      color: '#8C2D19',
                      fontWeight: 600,
                    }}
                  >
                    {errorMsg}
                  </p>
                )}

                {statusNote && (
                  <div
                    role="status"
                    className="rk-inset-panel"
                    style={{
                      padding: '12px 14px',
                      fontSize: '0.86rem',
                      color: 'var(--rk-ink)',
                    }}
                  >
                    {statusNote}
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', paddingTop: '4px' }}>
                  <PrimaryButton type="submit">Kirim pesan</PrimaryButton>
                  <button
                    type="button"
                    className="rk-btn-secondary"
                    onClick={handleCopyMessage}
                  >
                    {copied ? <Check size={16} /> : null}
                    <span>{copied ? 'Pesan disalin' : 'Salin isi pesan'}</span>
                  </button>
                </div>
              </form>
            </SoftCard>
          </div>
        </Container>
      </section>
    </div>
  );
}
