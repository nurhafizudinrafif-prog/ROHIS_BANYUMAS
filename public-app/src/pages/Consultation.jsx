import { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  AccessibleDialog,
  Container,
  PrimaryButton,
  SoftCard,
} from '../components/ui/SoftUI';

const STORAGE_KEY = 'rokaba:consultations_submitted';

const CURATED_QA = [
  {
    id: 'qa-1',
    topic: 'Keislaman',
    question:
      'Bagaimana cara menjaga konsistensi ibadah di tengah padatnya jadwal sekolah dan organisasi?',
    answer:
      'Mulailah dari amalan yang paling ringan namun rutin, seperti menjaga shalat tepat waktu dan dzikir pagi-petang. Jadikan aktivitas belajar serta berorganisasi di ROHIS sebagai bagian dari niat ibadah menuntut ilmu.',
  },
  {
    id: 'qa-2',
    topic: 'Keseharian',
    question:
      'Bagaimana tips membagi waktu antara akademik, kegiatan ROHIS, dan istirahat?',
    answer:
      'Gunakan skala prioritas harian, catat tenggat tugas sekolah lebih awal, dan komunikasikan pembagian tugas secara terbuka bersama rekan satu tim di ROHIS agar tidak dipikul sendiri.',
  },
];

export default function Consultation() {
  const { consultations } = useData();
  const [topic, setTopic] = useState('Keislaman');
  const [sender, setSender] = useState('');
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [qaOpen, setQaOpen] = useState(false);

  const cmsQa =
    Array.isArray(consultations) && consultations.length > 0
      ? consultations
      : CURATED_QA;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      existing.unshift({
        id: Date.now(),
        sender: sender.trim() || 'Anonim',
        topic,
        question: question.trim(),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }

    setSender('');
    setQuestion('');
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

          <h1 className="rk-page-title">Ruang bertanya dan berbagi</h1>
          <p className="rk-page-lead" style={{ marginTop: '6px' }}>
            Sampaikan pertanyaanmu dengan nyaman.
          </p>
        </Container>
      </section>

      {/* 2. TOPIC PILLS + FORM CARD + JAWABAN TERPILIH BAR */}
      <section className="rk-section" style={{ paddingTop: '6px' }}>
        <Container>
          <div className="rk-filter-bar" style={{ marginBottom: '16px' }}>
            <div
              className="rk-filter-pills"
              role="group"
              aria-label="Topik konsultasi"
            >
              {['Keislaman', 'Keseharian'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rk-pill"
                  aria-pressed={topic === item}
                  onClick={() => setTopic(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <SoftCard style={{ padding: 'clamp(18px, 2.4vw, 26px)' }}>
            <form
              onSubmit={handleSubmit}
              style={{ display: 'grid', gap: '14px' }}
            >
              <input
                type="text"
                className="rk-inset-control"
                placeholder="Nama atau anonim"
                aria-label="Nama atau anonim"
                value={sender}
                onChange={(e) => {
                  setSender(e.target.value);
                  if (submitted) setSubmitted(false);
                }}
              />

              <textarea
                rows={4}
                required
                className="rk-inset-control"
                placeholder="Pertanyaan"
                aria-label="Pertanyaan"
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  if (submitted) setSubmitted(false);
                }}
              />

              <PrimaryButton type="submit" style={{ width: '100%' }}>
                Kirim pertanyaan
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
                  Pertanyaanmu telah tercatat. Terima kasih telah berbagi.
                </p>
              )}
            </form>
          </SoftCard>

          <button
            type="button"
            className="rk-bar-card"
            onClick={() => setQaOpen(true)}
            style={{
              marginTop: '14px',
              width: '100%',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <strong style={{ fontSize: '1.02rem', color: 'var(--rk-ink)' }}>
              Jawaban terpilih
            </strong>
            <span aria-hidden="true" style={{ fontWeight: 700 }}>
              →
            </span>
          </button>
        </Container>
      </section>

      <AccessibleDialog
        open={qaOpen}
        onClose={() => setQaOpen(false)}
        eyebrow="Ruang Konsultasi Pelajar"
        title="Jawaban terpilih"
      >
        <div style={{ display: 'grid', gap: '12px' }}>
          {cmsQa.map((item, idx) => (
            <div
              key={item.id || idx}
              className="rk-inset-panel"
              style={{ padding: '14px 16px', borderRadius: '14px' }}
            >
              <strong
                style={{
                  display: 'block',
                  fontSize: '0.94rem',
                  color: 'var(--rk-ink)',
                }}
              >
                {item.question || item.title}
              </strong>
              <p style={{ fontSize: '0.88rem', marginTop: '6px' }}>
                {item.answer || item.response || item.description}
              </p>
            </div>
          ))}
        </div>
      </AccessibleDialog>
    </div>
  );
}
