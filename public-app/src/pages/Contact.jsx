import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle, Camera, Play } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <section style={{
        background: 'var(--deep-pine)', paddingTop: '8rem', paddingBottom: '3rem', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 50%, rgba(16,185,129,0.06) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <span className="badge badge-emerald animate-fade-in-up" style={{ marginBottom: '1rem' }}><Mail size={14} /> Kontak</span>
          <h1 className="animate-fade-in-up delay-100" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', fontWeight: 800, color: 'var(--warm-alabaster)' }}>
            Hubungi Kami
          </h1>
          <p className="animate-fade-in-up delay-200" style={{ color: 'rgba(245,242,237,0.55)', maxWidth: 500, marginTop: '0.75rem' }}>
            Silakan hubungi kami untuk pertanyaan, kerja sama, atau informasi lebih lanjut.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--warm-alabaster)' }}>
        <div className="container" style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2.5rem' }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem' }}>Informasi Kontak</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                  { icon: MapPin, label: 'Alamat', value: 'Purwokerto, Kabupaten Banyumas, Jawa Tengah 53100', color: 'var(--emerald)' },
                  { icon: Mail, label: 'Email', value: 'info@rohisbanyumas.id', color: 'var(--antique-brass)' },
                  { icon: Phone, label: 'Telepon', value: '+62 812-3456-7890', color: '#7C3AED' },
                ].map(({ icon: Icon, label, value, color }, i) => (
                  <div key={i} style={{
                    background: 'white', borderRadius: 'var(--radius-lg)', padding: '1.25rem',
                    display: 'flex', gap: '1rem', alignItems: 'flex-start',
                    border: '1px solid rgba(13,43,34,0.06)',
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '12px', background: `${color}12`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.78rem', color: 'rgba(13,43,34,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                      <p style={{ fontSize: '0.95rem', fontWeight: 500, marginTop: '0.15rem' }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Media Sosial</h3>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {[
                  { icon: Camera, label: 'Instagram', color: '#E4405F' },
                  { icon: Play, label: 'YouTube', color: '#FF0000' },
                  { icon: MessageCircle, label: 'WhatsApp', color: '#25D366' },
                ].map(({ icon: Icon, label, color }) => (
                  <a key={label} href="#" aria-label={label} style={{
                    width: 48, height: 48, borderRadius: '14px', background: `${color}10`,
                    border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color, transition: 'all 0.28s cubic-bezier(0.25, 1, 0.5, 1)', textDecoration: 'none',
                  }}>
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem' }}>Kirim Pesan</h2>
              {submitted && (
                <div className="animate-fade-in-up" style={{
                  background: 'var(--emerald-glass)', border: '1px solid var(--emerald)',
                  borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1.25rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  <CheckCircle size={20} style={{ color: 'var(--emerald)' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Pesan berhasil dikirim!</span>
                </div>
              )}
              <form onSubmit={handleSubmit} style={{
                background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem',
                border: '1px solid rgba(13,43,34,0.06)', boxShadow: 'var(--shadow-sm)',
              }}>
                <div className="form-group">
                  <label className="form-label">Nama</label>
                  <input type="text" className="form-input" required placeholder="Nama lengkap" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" required placeholder="email@contoh.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Subjek</label>
                  <input type="text" className="form-input" required placeholder="Topik pesan" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Pesan</label>
                  <textarea className="form-input" required placeholder="Tulis pesan Anda..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Send size={16} /> Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
