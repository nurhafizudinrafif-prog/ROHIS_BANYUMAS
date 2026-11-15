import React, { useEffect, useState } from 'react';
import {
    MapPin,
    Mail,
    AtSign,
    Send,
    CheckCircle2,
    Clock,
} from 'lucide-react';
import { fetchCmsData } from '../services/cmsService';
import {
    Eyebrow,
    SoftCard,
} from '../components/ui/SoftUI';

const STORAGE_KEY = 'rokaba:contact_submissions';

export default function Contact() {
    const [cms, setCms] = useState(null);
    const [name, setName] = useState('');
    const [school, setSchool] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
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

    const orgEmail = cms?.settings?.email || 'rokaba.banyumas@gmail.com';
    const orgInstagram = cms?.settings?.instagram || '@rohis_banyumas';
    const orgAddress =
        cms?.settings?.address ||
        'Seksi Pendidikan Agama Islam (PAI) Kantor Kementerian Agama Kabupaten Banyumas, Purwokerto, Jawa Tengah.';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        try {
            const existing = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || '[]'
            );
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
            <section className="rk-hero-section">
                <div className="rk-container">
                    <div className="rk-section-head">
                        <div>
                            <Eyebrow>Sekretariat & Hubungan Masyarakat</Eyebrow>
                            <h1 className="rk-page-title">Kontak & Aspirasi</h1>
                            <p className="rk-page-lead" style={{ marginTop: 10 }}>
                                Terbuka untuk komunikasi kegiatan, kolaborasi
                                antar-ROHIS sekolah, dan silaturahmi organisasi.
                            </p>
                        </div>
                    </div>

                    <div className="rk-contact-grid">
                        {/* KARTU INFO SEKRETARIAT (PAPAN 12-KONTAK-KONSULTASI-PC) */}
                        <SoftCard className="rk-contact-info-card">
                            <h2
                                style={{
                                    fontFamily:
                                        "var(--font-serif, 'Fraunces', Georgia, serif)",
                                    fontSize: '1.45rem',
                                }}
                            >
                                Sekretariat ROKABA
                            </h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--rk-muted)', lineHeight: 1.6 }}>
                                {orgAddress}
                            </p>

                            <div className="rk-contact-list">
                                <div className="rk-contact-item">
                                    <span className="rk-service-icon-badge">
                                        <MapPin size={19} />
                                    </span>
                                    <div>
                                        <span>Wilayah Koordinasi</span>
                                        <strong>Kabupaten Banyumas</strong>
                                        <small>Jawa Tengah (17 Sekolah Anggota)</small>
                                    </div>
                                </div>

                                <div className="rk-contact-item">
                                    <span className="rk-service-icon-badge">
                                        <Mail size={19} />
                                    </span>
                                    <div>
                                        <span>Email Resmi Organisasi</span>
                                        <strong>{orgEmail}</strong>
                                        <small>Korespondensi surat & undangan</small>
                                    </div>
                                </div>

                                <div className="rk-contact-item">
                                    <span className="rk-service-icon-badge">
                                        <AtSign size={19} />
                                    </span>
                                    <div>
                                        <span>Instagram Resmi</span>
                                        <strong>{orgInstagram}</strong>
                                        <small>Informasi terkini & dokumentasi</small>
                                    </div>
                                </div>

                                <div className="rk-contact-item">
                                    <span className="rk-service-icon-badge">
                                        <Clock size={19} />
                                    </span>
                                    <div>
                                        <span>Waktu Layanan Koordinasi</span>
                                        <strong>Senin – Sabtu, 08.00 – 16.00 WIB</strong>
                                        <small>Melalui Divisi Humas & Kesekretariatan</small>
                                    </div>
                                </div>
                            </div>
                        </SoftCard>

                        {/* FORM KIRIM PESAN */}
                        <SoftCard className="rk-contact-form-card">
                            <h2
                                style={{
                                    fontFamily:
                                        "var(--font-serif, 'Fraunces', Georgia, serif)",
                                    fontSize: '1.45rem',
                                }}
                            >
                                Kirim pesan
                            </h2>
                            <p style={{ fontSize: '0.88rem', color: 'var(--rk-muted)', marginTop: 4 }}>
                                Sampaikan aspirasi, ajakan kolaborasi, atau permohonan
                                informasi kegiatan.
                            </p>

                            {submitted ? (
                                <div className="rk-form-success">
                                    <CheckCircle2 size={28} />
                                    <h3>Pesan berhasil tercatat</h3>
                                    <p>
                                        Terima kasih atas pesan dan silaturahmi yang
                                        dikirimkan. Tim Humas ROKABA akan menindaklanjuti
                                        melalui kontak yang tertera.
                                    </p>
                                    <button
                                        type="button"
                                        className="rk-btn-secondary"
                                        onClick={() => setSubmitted(false)}
                                    >
                                        Kirim pesan baru
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="rk-soft-form">
                                    <div className="rk-form-field">
                                        <label htmlFor="contact-name">Nama</label>
                                        <input
                                            id="contact-name"
                                            type="text"
                                            required
                                            placeholder="Nama lengkap..."
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div className="rk-form-field">
                                        <label htmlFor="contact-school">
                                            Asal sekolah / instansi
                                        </label>
                                        <input
                                            id="contact-school"
                                            type="text"
                                            placeholder="Contoh: ROHIS SMAN 1 Purwokerto"
                                            value={school}
                                            onChange={(e) => setSchool(e.target.value)}
                                        />
                                    </div>

                                    <div className="rk-form-field">
                                        <label htmlFor="contact-email">
                                            Email / Kontak (opsional)
                                        </label>
                                        <input
                                            id="contact-email"
                                            type="text"
                                            placeholder="Email atau nomor WhatsApp..."
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="rk-form-field">
                                        <label htmlFor="contact-message">Pesan</label>
                                        <textarea
                                            id="contact-message"
                                            rows={4}
                                            required
                                            placeholder="Tuliskan pesan, undangan, atau aspirasi..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="rk-btn-primary"
                                        style={{ width: '100%' }}
                                    >
                                        <Send size={16} />
                                        <span>Kirim pesan</span>
                                    </button>
                                </form>
                            )}
                        </SoftCard>
                    </div>
                </div>
            </section>
        </div>
    );
}
