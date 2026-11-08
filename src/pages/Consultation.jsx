import { useMemo, useState } from 'react';
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
    id: 'qa-curated-1',
    sender: 'Pelajar SMA di Purwokerto',
    category: 'Keislaman',
    query:
      'Bagaimana cara menjaga konsistensi ibadah di tengah padatnya jadwal sekolah dan organisasi?',
    answer:
      'Mulailah dari amalan yang paling ringan namun rutin (mudawamah), seperti menjaga shalat tepat waktu, membaca Al-Qur’an beberapa ayat setelah Maghrib, dan dzikir pagi-petang. Niatkan aktivitas belajar serta berorganisasi di ROHIS sebagai bagian dari ibadah menuntut ilmu dan memberi manfaat bagi sesama.',
  },
  {
    id: 'qa-curated-2',
    sender: 'Kader ROHIS Kelas XI',
    category: 'Keseharian',
    query:
      'Bagaimana tips membagi waktu antara akademik, kegiatan ROHIS, dan istirahat?',
    answer:
      'Gunakan skala prioritas harian, catat tenggat tugas sekolah lebih awal, dan komunikasikan pembagian tugas secara terbuka bersama rekan satu tim di ROHIS agar tidak dipikul sendiri. Jangan ragu meminta bantuan pembina atau kakak kelas ketika menghadapi masa ujian.',
  },
  {
    id: 'qa-curated-3',
    sender: 'Pengurus ROHIS Sekolah',
    category: 'Organisasi',
    query:
      'Bagaimana cara mengajak teman-teman sekolah agar tertarik mengikuti kegiatan kajian ROHIS?',
    answer:
      'Gunakan pendekatan yang ramah, hangat, dan relevan dengan dunia remaja. Kemas kajian dengan tema yang dekat dengan keseharian pelajar, manfaatkan desain publikasi yang kreatif, serta tunjukkan teladan akhlak yang menyenangkan dalam pergaulan sehari-hari.',
  },
];

export default function Consultation() {
  const { questions } = useData();
  const [topic, setTopic] = useState('Keislaman');
  const [sender, setSender] = useState('');
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [qaOpen, setQaOpen] = useState(false);

  const allQaItems = useMemo(() => {
    const raw = Array.isArray(questions) ? questions : [];
    const normalized = raw
      .filter((q) => (q.query || q.question) && (q.answer || q.response))
      .map((q, idx) => ({
        id: q.id || `cms-qa-${idx}`,
        sender: q.sender || 'Pelajar Muslim Banyumas',
        category: q.category || q.topic || 'Keislaman',
        query: q.query || q.question,
        answer: q.answer || q.response,
      }));

    CURATED_QA.forEach((item) => {
      if (
        !normalized.some(
          (n) => n.query.toLowerCase() === item.query.toLowerCase()
        )
      ) {
        normalized.push(item);
      }
    });

    return normalized;
  }, [questions]);

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
            <span>Ruang Konsultasi Pelajar</span>
          </div>

          <h1 className="rk-page-title">Ruang bertanya dan berbagi</h1>
          <p className="rk-page-lead" style={{ marginTop: '6px' }}>
            Sampaikan pertanyaanmu seputar keislaman, akhlak, maupun dinamika
            pelajar dengan nyaman.
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
              {['Keislaman', 'Keseharian', 'Organisasi'].map((item) => (
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
              Jawaban terpilih ({allQaItems.length} Tanya Jawab)
            </strong>
            <span aria-hidden="true" style={{ fontWeight: 700 }}>
              →
            </span>
          </button>

          {/* 3. DIRECTLY VISIBLE TANYA JAWAB ARCHIVE */}
          <div style={{ marginTop: '28px' }}>
            <div className="rk-section-head" style={{ marginBottom: '16px' }}>
              <h2>Arsip Tanya Jawab Pelajar</h2>
            </div>

            <div style={{ display: 'grid', gap: '14px' }}>
              {allQaItems.map((item) => (
                <SoftCard
                  key={item.id}
                  style={{
                    padding: 'clamp(18px, 2.4vw, 24px)',
                    display: 'grid',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span className="rk-doc-badge">{item.category}</span>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--rk-muted)',
                        fontWeight: 600,
                      }}
                    >
                      Penanya: {item.sender}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.04rem', lineHeight: 1.35 }}>
                    “{item.query}”
                  </h3>

                  <div
                    className="rk-inset-panel"
                    style={{ padding: '14px 16px', borderRadius: '14px' }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        color: 'var(--rk-pine)',
                        marginBottom: '4px',
                      }}
                    >
                      Jawaban Tim Pembina & Dakwah ROKABA:
                    </strong>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.65 }}>
                      {item.answer}
                    </p>
                  </div>
                </SoftCard>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <AccessibleDialog
        open={qaOpen}
        onClose={() => setQaOpen(false)}
        eyebrow="Ruang Konsultasi Pelajar"
        title="Jawaban terpilih"
      >
        <div style={{ display: 'grid', gap: '12px' }}>
          {allQaItems.map((item, idx) => (
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
                {item.query}
              </strong>
              <p style={{ fontSize: '0.88rem', marginTop: '6px' }}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </AccessibleDialog>
    </div>
  );
}
