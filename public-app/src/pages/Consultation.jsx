import { useState } from 'react';
import { useData } from '../context/DataContext';
import { MessageCircle, Send, User, CheckCircle, Clock, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function Consultation() {
  const { questions } = useData();
  const [form, setForm] = useState({ sender: '', query: '', category: 'Umum' });
  const [submitted, setSubmitted] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const published = questions.filter(q => q.isPublic && q.status === 'answered');
  const categories = ['Umum', 'Fiqih', 'Akhlak', 'Motivasi', 'Ibadah'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.query.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ sender: '', query: '', category: 'Umum' });
  };

  return (
    <div>
      <section style={{
        background: 'var(--deep-pine)', paddingTop: '8rem', paddingBottom: '3rem', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(16,185,129,0.06) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <span className="badge badge-emerald animate-fade-in-up" style={{ marginBottom: '1rem' }}><MessageCircle size={14} /> Q&A</span>
          <h1 className="animate-fade-in-up delay-100" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', fontWeight: 800, color: 'var(--warm-alabaster)' }}>
            Konsultasi & Tanya Jawab
          </h1>
          <p className="animate-fade-in-up delay-200" style={{ color: 'rgba(245,242,237,0.55)', maxWidth: 500, marginTop: '0.75rem' }}>
            Tanyakan apa saja seputar agama dan kehidupan. Bisa anonim!
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--warm-alabaster)' }}>
        <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {/* Form */}
            <div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem' }}>Ajukan Pertanyaan</h2>
              {submitted && (
                <div className="animate-fade-in-up" style={{
                  background: 'var(--emerald-glass)', border: '1px solid var(--emerald)',
                  borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  <CheckCircle size={20} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>Pertanyaan terkirim!</strong>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(13,43,34,0.6)', marginTop: '0.15rem' }}>
                      Pertanyaan Anda akan dijawab oleh ustadz/ustadzah dan ditampilkan setelah dimoderasi.
                    </p>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} style={{
                background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem',
                border: '1px solid rgba(13,43,34,0.06)', boxShadow: 'var(--shadow-sm)',
              }}>
                <div className="form-group">
                  <label className="form-label">Nama (opsional)</label>
                  <input type="text" className="form-input" placeholder="Kosongkan untuk anonim" value={form.sender} onChange={e => setForm({ ...form, sender: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pertanyaan *</label>
                  <textarea className="form-input" placeholder="Tulis pertanyaan Anda di sini..." value={form.query} onChange={e => setForm({ ...form, query: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Send size={16} /> Kirim Pertanyaan
                </button>
              </form>
            </div>

            {/* Published Q&A */}
            <div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem' }}>Pertanyaan Terjawab</h2>
              {published.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {published.map((q) => (
                    <div key={q.id} style={{
                      background: 'white', borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(13,43,34,0.06)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
                    }}>
                      <button onClick={() => setExpanded(expanded === q.id ? null : q.id)} style={{
                        width: '100%', padding: '1.25rem', background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', textAlign: 'left',
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>{q.category}</span>
                            <span style={{ fontSize: '0.72rem', color: 'rgba(13,43,34,0.35)' }}>{q.sender}</span>
                          </div>
                          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--deep-pine)', lineHeight: 1.4 }}>{q.query}</p>
                        </div>
                        {expanded === q.id ? <ChevronUp size={18} style={{ color: 'rgba(13,43,34,0.3)', flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: 'rgba(13,43,34,0.3)', flexShrink: 0 }} />}
                      </button>
                      {expanded === q.id && (
                        <div style={{
                          padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(13,43,34,0.06)',
                          paddingTop: '1rem', animation: 'fadeInUp 0.3s ease',
                        }}>
                          <p style={{ fontSize: '0.9rem', color: 'rgba(13,43,34,0.65)', lineHeight: 1.7 }}>{q.answer}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'rgba(13,43,34,0.35)' }}>
                            <Clock size={12} />
                            Dijawab {new Date(q.answeredAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(13,43,34,0.35)', background: 'white', borderRadius: 'var(--radius-xl)' }}>
                  <HelpCircle size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                  <p>Belum ada pertanyaan terjawab</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
