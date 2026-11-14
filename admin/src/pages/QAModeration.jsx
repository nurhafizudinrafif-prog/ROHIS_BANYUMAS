import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  MessageCircle,
  Check,
  X,
  Eye,
  EyeOff,
  ChevronRight,
  Clock,
  Send,
  Trash2,
  HelpCircle,
} from 'lucide-react';

export default function QAModeration() {
  const { questions, updateData, addAuditLog } = useData();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'answered'
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = useMemo(() => {
    return (questions || []).filter((q) => {
      if (activeTab === 'pending') return q.status === 'pending';
      if (activeTab === 'answered') return q.status === 'answered';
      return true;
    });
  }, [questions, activeTab]);

  // Current selected question object
  const currentQuestion = useMemo(() => {
    if (!filtered || filtered.length === 0) return null;
    if (selectedQuestionId) {
      const found = filtered.find((q) => q.id === selectedQuestionId);
      if (found) return found;
    }
    return filtered[0]; // default to first
  }, [filtered, selectedQuestionId]);

  // When selected question changes, pre-fill its answer if any
  const handleSelectQuestion = (q) => {
    setSelectedQuestionId(q.id);
    setAnswerText(q.answer || '');
  };

  const handleSaveAnswer = async () => {
    if (!currentQuestion) return;
    if (!answerText.trim()) {
      alert('Teks jawaban tidak boleh kosong!');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = (questions || []).map((q) =>
        q.id === currentQuestion.id
          ? {
              ...q,
              answer: answerText.trim(),
              status: 'answered',
              answeredAt: new Date().toISOString(),
              answeredBy: user?.username || 'Admin ROKABA',
            }
          : q
      );

      await updateData('questions', updated);
      if (addAuditLog && user) {
        await addAuditLog(
          user.id,
          user.username,
          'ANSWER',
          'questions',
          `Answered Q&A: "${currentQuestion.query.slice(0, 50)}..."`
        );
      }
    } catch (err) {
      console.error('Answer failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePublic = async (qId) => {
    const updated = (questions || []).map((q) =>
      q.id === qId ? { ...q, isPublic: !q.isPublic } : q
    );
    await updateData('questions', updated);
    const q = updated.find((item) => item.id === qId);
    if (addAuditLog && user) {
      await addAuditLog(
        user.id,
        user.username,
        'UPDATE',
        'questions',
        `${q.isPublic ? 'Published' : 'Unpublished'} Q&A: ${q.query.slice(0, 40)}`
      );
    }
  };

  const handleDelete = async (qId) => {
    if (!window.confirm('Yakin ingin menghapus pertanyaan ini?')) return;
    const target = (questions || []).find((q) => q.id === qId);
    const updated = (questions || []).filter((q) => q.id !== qId);
    await updateData('questions', updated);
    if (addAuditLog && user && target) {
      await addAuditLog(
        user.id,
        user.username,
        'DELETE',
        'questions',
        `Deleted Q&A: "${target.query.slice(0, 50)}..."`
      );
    }
  };

  const pendingCount = (questions || []).filter((q) => q.status === 'pending').length;

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', paddingBottom: '3.5rem' }}>
      {/* Header Bar matching Image 03 panel 4 */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
          Moderasi pertanyaan
        </h1>
        <p className="text-secondary" style={{ fontSize: '0.88rem', marginTop: '0.2rem' }}>
          Tinjau dan berikan jawaban atas pertanyaan dari pengunjung website.
        </p>
      </div>

      {/* Filter Tabs: Menunggu | Dijawab matching Image 03 panel 4 */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'pending' ? 'btn-pine' : 'btn-secondary-soft'}`}
          style={{
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem 1.25rem',
            border: activeTab === 'pending' ? 'none' : '1px solid var(--border-subtle)',
          }}
          onClick={() => {
            setActiveTab('pending');
            setSelectedQuestionId(null);
          }}
        >
          Menunggu {pendingCount > 0 && `(${pendingCount})`}
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'answered' ? 'btn-pine' : 'btn-secondary-soft'}`}
          style={{
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem 1.25rem',
            border: activeTab === 'answered' ? 'none' : '1px solid var(--border-subtle)',
          }}
          onClick={() => {
            setActiveTab('answered');
            setSelectedQuestionId(null);
          }}
        >
          Dijawab
        </button>
      </div>

      {/* 2-Column Layout matching Image 03 panel 4 */}
      <div className="admin-qa-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 1fr) minmax(340px, 1.8fr)',
        gap: '1.5rem',
        alignItems: 'start',
      }}>
        {/* Left Column: Question List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filtered.map((q) => {
            const isSelected = currentQuestion?.id === q.id;
            return (
              <div
                key={q.id}
                onClick={() => handleSelectQuestion(q)}
                style={{
                  padding: '1rem 1.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(16, 41, 31, 0.06)' : 'var(--surface-bg)',
                  border: isSelected
                    ? '1.5px solid var(--pine-dark)'
                    : '1px solid var(--border-subtle)',
                  boxShadow: 'var(--soft-shadow-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: 'var(--pine-dark)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {q.category ? `${q.category}` : 'Kegiatan ROHIS'}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: 2,
                  }}>
                    {q.query}
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  color={isSelected ? 'var(--pine-dark)' : 'var(--text-muted)'}
                  style={{ flexShrink: 0 }}
                />
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="admin-soft-card" style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <HelpCircle size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--pine-dark)' }}>
                Tidak ada pertanyaan {activeTab === 'pending' ? 'menunggu' : 'dijawab'}.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Question Detail & Answer Editor */}
        <div>
          {currentQuestion ? (
            <div className="admin-soft-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brass-dark)', textTransform: 'uppercase' }}>
                    {currentQuestion.category || 'Pertanyaan Umum'}
                  </span>
                  <h3 style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: 'var(--pine-dark)',
                    marginTop: '0.2rem',
                    lineHeight: 1.35,
                  }}>
                    {currentQuestion.query}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Dari: {currentQuestion.sender || 'Anonim'} • {new Date(currentQuestion.createdAt || Date.now()).toLocaleDateString('id-ID')}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {currentQuestion.status === 'answered' && (
                    <button
                      type="button"
                      className="btn btn-secondary-soft btn-sm"
                      onClick={() => togglePublic(currentQuestion.id)}
                      title={currentQuestion.isPublic ? 'Sembunyikan dari publik' : 'Tampilkan di FAQ publik'}
                    >
                      {currentQuestion.isPublic ? <Eye size={14} /> : <EyeOff size={14} />}
                      <span>{currentQuestion.isPublic ? 'Publik' : 'Privat'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary-soft btn-sm"
                    style={{ color: '#EF4444' }}
                    onClick={() => handleDelete(currentQuestion.id)}
                    title="Hapus pertanyaan"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Answer Input */}
              <div className="form-group-soft" style={{ marginTop: '1.25rem' }}>
                <label className="form-label-soft">Tulis jawaban</label>
                <textarea
                  rows={6}
                  className="form-textarea-soft"
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Tulis jawaban di sini..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-pine"
                  onClick={handleSaveAnswer}
                  disabled={isSubmitting}
                >
                  <Send size={15} />
                  <span>{isSubmitting ? 'Menyimpan...' : 'Simpan jawaban'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="admin-soft-card" style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Pilih salah satu pertanyaan di sebelah kiri untuk membaca dan menjawab.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
