import { useMemo, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  Container,
  PageHeader,
  SoftCard,
  InsetField,
  PrimaryButton,
  EmptyState,
  formatIndonesianDate,
} from '../components/ui/SoftUI';

const TOPIC_CATEGORIES = [
  'Semua',
  'Keislaman harian',
  'Organisasi ROHIS',
  'Belajar & pertemanan',
];

export default function Consultation() {
  const { questions = [], settings = {} } = useData();
  const officialEmail = settings?.contactEmail || 'rokaba.banyumas@gmail.com';

  const [activeCategory, setActiveCategory] = useState('Semua');
  const [openQuestionId, setOpenQuestionId] = useState(null);

  // State formulir pertanyaan
  const [senderName, setSenderName] = useState('');
  const [topic, setTopic] = useState('Organisasi ROHIS');
  const [questionText, setQuestionText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const answeredQuestions = useMemo(() => {
    return questions.filter((q) => q.status === 'answered' && q.answer);
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    if (activeCategory === 'Semua') return answeredQuestions;
    const target = activeCategory.toLowerCase();
    return answeredQuestions.filter((q) => {
      const cat = String(q.category || '').toLowerCase();
      if (target === 'keislaman harian') {
        return (
          cat.includes('ibadah') ||
          cat.includes('akhlak') ||
          cat.includes('fiqih') ||
          cat.includes('islam')
        );
      }
      if (target === 'organisasi rohis') {
        return (
          cat.includes('organisasi') ||
          cat.includes('rohis') ||
          cat.includes('kader')
        );
      }
      if (target === 'belajar & pertemanan') {
        return (
          cat.includes('remaja') ||
          cat.includes('belajar') ||
          cat.includes('teman') ||
          cat.includes('motivasi')
        );
      }
      return cat === target;
    });
  }, [answeredQuestions, activeCategory]);

  const buildFormattedBody = () => {
    const sender = senderName.trim() || 'Pelajar Banyumas (Tanpa Nama)';
    return `Assalamu'alaikum Tim Pembina & Konsultasi ROKABA,\n\nNama / Inisial: ${sender}\nTopik: ${topic}\n\nPertanyaan:\n${questionText.trim()}\n\nTerima kasih.`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionText.trim() || questionText.trim().length < 10) {
      setErrorMsg(
        'Mohon tuliskan pertanyaanmu minimal 10 karakter agar dapat dipahami dengan jelas.'
      );
      return;
    }
    setErrorMsg('');

    const subject = `[Konsultasi ROKABA - ${topic}] Pertanyaan dari ${
      senderName.trim() || 'Pelajar'
    }`;
    const body = buildFormattedBody();
    const mailtoUrl = `mailto:${officialEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setStatusMessage(
      `Aplikasi email Anda telah disiapkan untuk mengirim pertanyaan ke ${officialEmail}. Jika belum terbuka otomatis, Anda dapat menyalin teks pertanyaan di bawah.`
    );
    window.location.href = mailtoUrl;
  };

  const handleCopyQuestion = async () => {
    if (!questionText.trim()) {
      setErrorMsg('Tuliskan pertanyaanmu terlebih dahulu sebelum menyalin.');
      return;
    }
    setErrorMsg('');
    try {
      await navigator.clipboard.writeText(buildFormattedBody());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rk-page">
      <PageHeader
        breadcrumb={[{ label: 'Beranda', to: '/' }, { label: 'Konsultasi' }]}
        title="Ruang bertanya dan berbagi"
        lead="Sampaikan pertanyaan seputar kegiatan ROHIS, belajar, atau keseharian pelajar dengan santun dan nyaman."
      />

      <section className="rk-section" aria-label="Ruang konsultasi dan tanya jawab pelajar">
        <Container>
          {/* Filter Kategori Topik */}
          <div className="rk-filter-bar">
            <div className="rk-filter-pills" role="group" aria-label="Topik konsultasi">
              {TOPIC_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className="rk-pill"
                  aria-pressed={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="rk-split-50-50">
            {/* Formulir Pertanyaan Jujur */}
            <SoftCard as="section" aria-labelledby="rk-consult-form-title">
              <h2
                id="rk-consult-form-title"
                style={{ fontSize: '1.25rem', marginBottom: '6px' }}
              >
                Sampaikan pertanyaanmu dengan nyaman.
              </h2>
              <p style={{ fontSize: '0.9rem', marginBottom: '18px' }}>
                Pertanyaan akan dikirimkan melalui email resmi pengurus dan pembina ROKABA ({officialEmail}) untuk ditanggapi secara santun.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }} noValidate>
                <div className="rk-split-50-50" style={{ gap: '12px' }}>
                  <InsetField
                    id="rk-consult-name"
                    label="Nama atau inisial (opsional)"
                    placeholder="Contoh: Ahmad / Hamba Allah"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />

                  <InsetField
                    as="select"
                    id="rk-consult-topic"
                    label="Topik bahasan"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    <option value="Keislaman harian">Keislaman harian</option>
                    <option value="Organisasi ROHIS">Organisasi ROHIS</option>
                    <option value="Belajar & pertemanan">Belajar & pertemanan</option>
                  </InsetField>
                </div>

                <InsetField
                  as="textarea"
                  id="rk-consult-question"
                  label="Pertanyaanmu"
                  placeholder="Tuliskan pertanyaan atau hal yang ingin kamu diskusikan..."
                  rows={4}
                  required
                  value={questionText}
                  onChange={(e) => {
                    setQuestionText(e.target.value);
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

                {statusMessage && (
                  <div
                    role="status"
                    className="rk-inset-panel"
                    style={{
                      padding: '12px 14px',
                      fontSize: '0.86rem',
                      color: 'var(--rk-ink)',
                    }}
                  >
                    {statusMessage}
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', paddingTop: '4px' }}>
                  <PrimaryButton type="submit">Kirim pertanyaan</PrimaryButton>
                  <button
                    type="button"
                    className="rk-btn-secondary"
                    onClick={handleCopyQuestion}
                  >
                    {copied ? <Check size={16} /> : null}
                    <span>{copied ? 'Pertanyaan disalin' : 'Salin teks pertanyaan'}</span>
                  </button>
                </div>
              </form>
            </SoftCard>

            {/* Daftar Jawaban Terpilih */}
            <div style={{ display: 'grid', gap: '14px', alignContent: 'start' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.2rem' }}>Jawaban terpilih</h2>
                <span className="rk-badge">{filteredQuestions.length} diskusi</span>
              </div>

              {filteredQuestions.length === 0 ? (
                <EmptyState
                  title="Belum ada tanya-jawab pada topik ini"
                  description="Pilih kategori Semua untuk membaca tanggapan yang telah dipublikasikan."
                  action={
                    <button
                      type="button"
                      className="rk-btn-secondary"
                      onClick={() => setActiveCategory('Semua')}
                    >
                      Lihat semua topik
                    </button>
                  }
                />
              ) : (
                filteredQuestions.map((item, idx) => {
                  const isOpen =
                    openQuestionId === item.id ||
                    (openQuestionId === null && idx === 0);

                  const questionTitle = item.question || item.query || '';
                  const senderLabel = item.askerName || item.sender || 'Anonim';

                  return (
                    <SoftCard key={item.id} as="article" style={{ padding: '20px 22px' }}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() =>
                          setOpenQuestionId(isOpen ? -1 : item.id)
                        }
                        style={{
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div>
                          <div className="rk-meta-line" style={{ marginBottom: '6px' }}>
                            <span>{item.category || 'Diskusi Pelajar'}</span>
                            <span>•</span>
                            <span>Oleh {senderLabel}</span>
                          </div>
                          <h3
                            style={{
                              fontSize: '1.02rem',
                              lineHeight: 1.4,
                              color: 'var(--rk-ink)',
                            }}
                          >
                            {questionTitle}
                          </h3>
                        </div>

                        <ChevronDown
                          size={18}
                          style={{
                            flexShrink: 0,
                            marginTop: '4px',
                            color: 'var(--rk-muted)',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 160ms ease',
                          }}
                        />
                      </button>

                      {isOpen && (
                        <div
                          className="rk-inset-panel"
                          style={{
                            marginTop: '14px',
                            padding: '16px 18px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              color: 'var(--rk-brass-text)',
                              marginBottom: '6px',
                            }}
                          >
                            Tanggapan {item.answeredBy || 'Dewan Pembina ROKABA'} •{' '}
                            {formatIndonesianDate(item.answeredAt || item.createdAt)}
                          </div>
                          <p style={{ fontSize: '0.92rem', color: 'var(--rk-ink)', lineHeight: 1.65 }}>
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </SoftCard>
                  );
                })
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
