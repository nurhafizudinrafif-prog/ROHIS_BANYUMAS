import { useState } from 'react';
import { useScrollAnimation } from '../utils';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle, AtSign, Play } from 'lucide-react';
import './Contact.css';
import './About.css';

export default function Contact() {
  useScrollAnimation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="page-contact">
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-primary animate-hero delay-0">Kontak</span>
          <h1 className="page-hero-title animate-hero delay-1">Hubungi Kami</h1>
          <p className="page-hero-subtitle animate-hero delay-2">
            Punya pertanyaan, saran, atau ingin berkolaborasi? Jangan ragu untuk menghubungi kami.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info animate-on-scroll delay-1">
              <h3>Informasi Kontak</h3>
              <p>Silakan hubungi kami melalui salah satu kanal berikut atau isi formulir di samping.</p>

              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4>Alamat Sekretariat</h4>
                    <p>Purwokerto, Kabupaten Banyumas, Jawa Tengah 53100</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4>Email</h4>
                    <p>info@rohisbanyumas.id</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4>Telepon / WhatsApp</h4>
                    <p>+62 812-3456-7890</p>
                  </div>
                </div>
              </div>

              <div className="contact-social">
                <h4>Media Sosial</h4>
                <div className="contact-social-links">
                  <a href="#" className="contact-social-link"><AtSign size={18} /> @rohisbanyumas</a>
                  <a href="#" className="contact-social-link"><Play size={18} /> ROHIS Banyumas</a>
                  <a href="#" className="contact-social-link"><MessageCircle size={18} /> WhatsApp Group</a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper animate-on-scroll delay-2">
              {submitted ? (
                <div className="contact-success">
                  <CheckCircle size={48} />
                  <h3>Pesan Terkirim!</h3>
                  <p>Terima kasih atas pesan Anda. Kami akan segera merespons. Jazakallahu khairan!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <h3>Kirim Pesan</h3>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap *</label>
                    <input className="form-input" type="text" placeholder="Nama Anda" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" placeholder="email@contoh.com" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subjek</label>
                    <input className="form-input" type="text" placeholder="Tentang apa?" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pesan *</label>
                    <textarea className="form-textarea" placeholder="Tulis pesan Anda di sini..." rows={5} required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                    <Send size={16} /> Kirim Pesan
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="contact-map animate-on-scroll" style={{ marginTop: 'var(--space-3xl)' }}>
            <h3 style={{ marginBottom: 'var(--space-lg)', textAlign: 'center' }}>Lokasi Kami</h3>
            <div className="contact-map-embed">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63282.13073281482!2d109.19676235!3d-7.43137595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655ea49d3f1bbd%3A0x5027a76e35632c0!2sPurwokerto%2C%20Banyumas%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1693000000000"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi ROHIS Kabupaten Banyumas"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
