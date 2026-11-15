import React, { useEffect, useMemo, useState } from 'react';
import {
    MessageCircleQuestion,
    Send,
    ChevronDown,
    CheckCircle2,
    Sparkles,
    BookOpen,
    Heart,
    Users,
} from 'lucide-react';
import { fetchCmsData, submitQuestion } from '../services/cmsService';
import {
    Eyebrow,
    GlassChip,
    SoftCard,
} from '../components/ui/SoftUI';

const DEFAULT_QNA = [
    {
        id: 'q-1',
        category: 'Keseharian',
        question: 'Bagaimana mengatur waktu belajar dan ROHIS?',
        asker: 'Pelajar SMA di Purwokerto',
        answer:
            'Susun jadwal mingguan sederhana, utamakan kewajiban akademik dan ibadah tepat waktu, lalu komunikasikan pembagian tugas secara terbuka dengan rekan pengurus satu divisi agar amanah organisasi terasa ringan.',
    },
    {
        id: 'q-2',
        category: 'Organisasi',
        question: 'Bagaimana memulai kajian rutin di sekolah?',
        asker: 'Pengurus ROHIS SMK',
        answer:
            'Mulailah dari format yang hangat dan singkat (25–30 menit) selepas sekolah, pilih tema yang dekat dengan keseharian pelajar, serta libatkan pembina ROHIS atau Divisi Dakwah ROKABA untuk pendampingan pemateri.',
    },
    {
        id: 'q-3',
        category: 'Keislaman',
        question:
            'Bagaimana cara menjaga istiqamah tilawah Al-Qur’an di tengah padatnya jadwal praktikum?',
        asker: 'Siswa Kelas XI',
        answer:
            'Kunci istiqamah adalah menetapkan target yang realistis namun rutin, misalnya satu halaman setiap selesai shalat Maghrib atau Subuh. Simpan mushaf di tempat yang mudah dijangkau agar ringan memulai.',
    },
    {
        id: 'q-4',
        category: 'Organisasi',
        question:
            'Bagaimana alur mengundang pengurus ROKABA untuk silaturahmi atau mengisi LDK di sekolah kami?',
        asker: 'BPH ROHIS Sekolah Anggota',
        answer:
            'Sekolah anggota dapat menghubungi Divisi Humas ROKABA melalui halaman Kontak & Aspirasi atau Instagram resmi @rohis_banyumas dengan menyertakan rencana tanggal dan bentuk kegiatan.',
    },
];

const CATEGORIES = [
    { key: 'Semua', label: 'Semua', icon: Sparkles },
    { key: 'Keislaman', label: 'Keislaman', icon: BookOpen },
    { key: 'Keseharian', label: 'Keseharian', icon: Heart },
    { key: 'Organisasi', label: 'Organisasi', icon: Users },
];

export default function Consultation() {
    const [cms, setCms] = useState(null);
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [openId, setOpenId] = useState('q-1');

    // Form state
    const [name, setName] = useState('');
    const [formCategory, setFormCategory] = useState('Keseharian');
    const [questionText, setQuestionText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        let mounted = true;
        fetchCmsData().then((data) => {
            if (mounted && data) setCms(data);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const qnaList = useMemo(() => {
        const raw = Array.isArray(cms?.qna) ? cms.qna : [];
        const answeredCms = raw
            .filter((q) => q.answer && String(q.answer).trim() !== '')
            .map((q, idx) => ({
                id: q.id || `cms-q-${idx}`,
                category: q.category || 'Keislaman',
                question: q.question,
                asker: q.name || q.asker || 'Anonim',
                answer: q.answer,
            }));

        return answeredCms.length > 0
            ? [...answeredCms, ...DEFAULT_QNA]
            : DEFAULT_QNA;
    }, [cms]);

    const filteredQna = useMemo(() => {
        if (activeCategory === 'Semua') return qnaList;
        return qnaList.filter(
            (item) =>
                (item.category || '').toLowerCase() ===
                activeCategory.toLowerCase()
        );
    }, [qnaList, activeCategory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!questionText.trim()) return;
        setSubmitting(true);
        try {
            if (typeof submitQuestion === 'function') {
                await submitQuestion({
                    name: name.trim() || 'Hamba Allah (Anonim)',
                    category: formCategory,
                    question: questionText.trim(),
                });
            }
        } catch {
            // Fallback graceful handling
        } finally {
            setSubmitting(false);
            setSubmitted(true);
            setQuestionText('');
            setName('');
        }
    };

    return (
        <div className="rk-page">
            <section className="rk-hero-section">
                <div className="rk-container">
                    <div className="rk-section-head">
                        <div>
                            <Eyebrow>Ruang Bertanya Santun</Eyebrow>
                            <h1 className="rk-page-title">
                                Tanya Jawab & Konsultasi
                            </h1>
                            <p className="rk-page-lead" style={{ marginTop: 10 }}>
                                Ruang bertanya secara santun seputar keislaman,
                                belajar, dan aktivitas ROHIS.
                            </p>
                        </div>
                    </div>

                    {/* KATEGORI PILLS (PAPAN 12-KONTAK-KONSULTASI-PC) */}
                    <div className="rk-filter-bar" style={{ marginBottom: 20 }}>
                        <div
                            className="rk-filter-pills"
                            role="tablist"
                            aria-label="Kategori tanya jawab"
                        >
                            {CATEGORIES.map((cat) => {
                                const IconComp = cat.icon;
                                const active = activeCategory === cat.key;
                                return (
                                    <button
                                        key={cat.key}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        className={`rk-filter-pill ${
                                            active ? 'is-active' : ''
                                        }`}
                                        onClick={() => {
                                            setActiveCategory(cat.key);
                                            if (cat.key !== 'Semua') {
                                                setFormCategory(cat.key);
                                            }
                                        }}
                                    >
                                        <IconComp size={14} />
                                        <span>{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rk-consultation-grid">
                        {/* FORM AJUKAN PERTANYAAN */}
                        <SoftCard className="rk-qna-form-card">
                            <div className="rk-qna-form-head">
                                <span className="rk-service-icon-badge">
                                    <MessageCircleQuestion size={20} />
                                </span>
                                <div>
                                    <h2>Tulis pertanyaanmu</h2>
                                    <small>
                                        Identitas boleh dikosongkan (anonim)
                                    </small>
                                </div>
                            </div>

                            {submitted ? (
                                <div className="rk-form-success">
                                    <CheckCircle2 size={28} />
                                    <h3>Pertanyaan berhasil dikirim</h3>
                                    <p>
                                        Jazakumullahu khairan. Pertanyaanmu akan
                                        ditinjau oleh tim pembina dan Divisi Dakwah
                                        ROKABA sebelum ditampilkan.
                                    </p>
                                    <button
                                        type="button"
                                        className="rk-btn-secondary"
                                        onClick={() => setSubmitted(false)}
                                    >
                                        Kirim pertanyaan lain
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="rk-soft-form"
                                >
                                    <div className="rk-form-field">
                                        <label htmlFor="qna-question">
                                            Tulis pertanyaanmu
                                        </label>
                                        <textarea
                                            id="qna-question"
                                            rows={4}
                                            required
                                            value={questionText}
                                            onChange={(e) =>
                                                setQuestionText(e.target.value)
                                            }
                                            placeholder="Tuliskan pertanyaan dengan bahasa yang jelas dan santun..."
                                        />
                                    </div>

                                    <div className="rk-form-field">
                                        <label htmlFor="qna-name">
                                            Nama (opsional)
                                        </label>
                                        <input
                                            id="qna-name"
                                            type="text"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            placeholder="Misal: Fulan - SMAN 1..."
                                        />
                                    </div>

                                    <div className="rk-form-field">
                                        <label htmlFor="qna-category">
                                            Topik pertanyaan
                                        </label>
                                        <select
                                            id="qna-category"
                                            value={formCategory}
                                            onChange={(e) =>
                                                setFormCategory(e.target.value)
                                            }
                                        >
                                            <option value="Keislaman">
                                                Keislaman & Ibadah
                                            </option>
                                            <option value="Keseharian">
                                                Keseharian & Belajar
                                            </option>
                                            <option value="Organisasi">
                                                Organisasi ROHIS
                                            </option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="rk-btn-primary"
                                        disabled={submitting}
                                        style={{ width: '100%' }}
                                    >
                                        <Send size={16} />
                                        <span>
                                            {submitting
                                                ? 'Mengirim...'
                                                : 'Kirim pertanyaan'}
                                        </span>
                                    </button>
                                </form>
                            )}
                        </SoftCard>

                        {/* JAWABAN TERPILIH (ACCORDION) */}
                        <div className="rk-qna-list-col">
                            <h2
                                className="rk-section-title"
                                style={{
                                    fontSize: '1.45rem',
                                    marginBottom: 16,
                                }}
                            >
                                Jawaban terpilih
                            </h2>

                            <div className="rk-qna-accordion">
                                {filteredQna.map((item) => {
                                    const isOpen = openId === item.id;
                                    return (
                                        <SoftCard
                                            key={item.id}
                                            className={`rk-qna-item ${
                                                isOpen ? 'is-open' : ''
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                className="rk-qna-trigger"
                                                onClick={() =>
                                                    setOpenId(
                                                        isOpen ? '' : item.id
                                                    )
                                                }
                                                aria-expanded={isOpen}
                                            >
                                                <div className="rk-qna-trigger-head">
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 8,
                                                            marginBottom: 6,
                                                        }}
                                                    >
                                                        <GlassChip>
                                                            {item.category}
                                                        </GlassChip>
                                                        <small
                                                            style={{
                                                                color: 'var(--rk-muted)',
                                                            }}
                                                        >
                                                            Ditanyakan oleh{' '}
                                                            {item.asker}
                                                        </small>
                                                    </div>
                                                    <h3>{item.question}</h3>
                                                </div>
                                                <ChevronDown
                                                    size={18}
                                                    className="rk-qna-chevron"
                                                />
                                            </button>

                                            {isOpen && (
                                                <div className="rk-qna-answer">
                                                    <p>{item.answer}</p>
                                                </div>
                                            )}
                                        </SoftCard>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
