import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Check, X, Eye, EyeOff, Clock, Filter } from 'lucide-react';

export default function QAModeration() {
  const { questions, updateData, addAuditLog } = useData();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all'); // all, pending, answered
  const [answerModal, setAnswerModal] = useState(null);
  const [answer, setAnswer] = useState('');

  const filtered = questions.filter(q => {
    if (filter === 'pending') return q.status === 'pending';
    if (filter === 'answered') return q.status === 'answered';
    return true;
  });

  const handleAnswer = async () => {
    if (!answer.trim() || !answerModal) return;
    const updated = questions.map(q =>
      q.id === answerModal.id
        ? { ...q, answer, status: 'answered', answeredAt: new Date().toISOString(), isPublic: false }
        : q
    );
    await updateData('questions', updated);
    await addAuditLog(user.id, user.username, 'ANSWER', 'questions', `Answered Q&A: "${answerModal.query.slice(0, 50)}..."`);
    setAnswerModal(null);
    setAnswer('');
  };

  const togglePublic = async (qId) => {
    const updated = questions.map(q => q.id === qId ? { ...q, isPublic: !q.isPublic } : q);
    await updateData('questions', updated);
    const q = updated.find(q => q.id === qId);
    await addAuditLog(user.id, user.username, 'UPDATE', 'questions', `${q.isPublic ? 'Published' : 'Unpublished'} Q&A`);
  };

  const deleteQuestion = async (q) => {
    if (!confirm('Hapus pertanyaan ini?')) return;
    const updated = questions.filter(item => item.id !== q.id);
    await updateData('questions', updated);
    await addAuditLog(user.id, user.username, 'DELETE', 'questions', `Deleted Q&A: "${q.query.slice(0, 50)}..."`);
  };

  const pending = questions.filter(q => q.status === 'pending').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 800 }}>Moderasi Q&A</h1>
          {pending > 0 && <span className="badge badge-brass" style={{ marginTop: '0.35rem' }}>{pending} pertanyaan menunggu jawaban</span>}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['all', 'pending', 'answered'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}>
              {f === 'all' ? 'Semua' : f === 'pending' ? 'Menunggu' : 'Terjawab'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(q => (
          <div key={q.id} className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className={`badge ${q.status === 'pending' ? 'badge-brass' : 'badge-emerald'}`}>
                    {q.status === 'pending' ? 'Menunggu' : 'Terjawab'}
                  </span>
                  {q.isPublic && <span className="badge badge-emerald"><Eye size={10} /> Publik</span>}
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{q.category || 'Umum'}</span>
                </div>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{q.query}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Dari: {q.sender || 'Anonim'} • {new Date(q.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>

            {q.answer && (
              <div style={{
                background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)',
                padding: '1rem', marginBottom: '0.75rem', borderLeft: '3px solid var(--emerald)',
              }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{q.answer}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {q.status === 'pending' && (
                <button onClick={() => { setAnswerModal(q); setAnswer(''); }} className="btn btn-sm btn-primary">
                  <MessageCircle size={14} /> Jawab
                </button>
              )}
              {q.status === 'answered' && (
                <button onClick={() => togglePublic(q.id)} className="btn btn-sm btn-secondary">
                  {q.isPublic ? <><EyeOff size={14} /> Sembunyikan</> : <><Eye size={14} /> Publikasikan</>}
                </button>
              )}
              <button onClick={() => deleteQuestion(q)} className="btn btn-sm btn-danger"><X size={14} /> Hapus</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <MessageCircle size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>Tidak ada pertanyaan</p>
          </div>
        )}
      </div>

      {/* Answer Modal */}
      {answerModal && (
        <div className="modal-overlay-responsive">
          <div className="glass-card modal-card-responsive animate-fade-in-up" style={{ maxWidth: 550, padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Jawab Pertanyaan</h2>
            <div style={{
              background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', padding: '1rem',
              marginBottom: '1.25rem', borderLeft: '3px solid var(--antique-brass)',
            }}>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{answerModal.query}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Dari: {answerModal.sender || 'Anonim'}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Jawaban</label>
              <textarea className="form-input" placeholder="Tulis jawaban..." value={answer} onChange={e => setAnswer(e.target.value)} style={{ minHeight: 120 }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleAnswer} className="btn btn-primary" style={{ flex: 1 }}><Check size={16} /> Kirim Jawaban</button>
              <button onClick={() => setAnswerModal(null)} className="btn btn-secondary">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
