import { useState } from 'react';
import { useScrollAnimation } from '../utils';
import { Send, CheckCircle, User, School, Phone, Mail, FileText, ChevronRight } from 'lucide-react';
import './Registration.css';
import './About.css';

export default function Registration() {
  useScrollAnimation();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nama: '', tempatLahir: '', tanggalLahir: '', jenisKelamin: '',
    alamat: '', noHp: '', email: '',
    asalSekolah: '', kelas: '', namaRohis: '',
    motivasi: '', pengalaman: '',
  });

  const updateForm = (field, value) => setForm({ ...form, [field]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main>
        <section className="page-hero pattern-bg">
          <div className="container text-center">
            <div className="reg-success animate-hero delay-1">
              <CheckCircle size={64} className="reg-success-icon" />
              <h1>Pendaftaran Berhasil!</h1>
              <p>Terima kasih telah mendaftar sebagai anggota Organisasi ROHIS Kabupaten Banyumas. Tim kami akan segera menghubungi Anda melalui WhatsApp atau email.</p>
              <p className="reg-success-note">Barakallahu fiikum 🤲</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-registration">
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-gold animate-hero delay-0">Open Recruitment</span>
          <h1 className="page-hero-title animate-hero delay-1">Gabung Bersama Kami</h1>
          <p className="page-hero-subtitle animate-hero delay-2">
            Daftarkan dirimu sebagai anggota Organisasi ROHIS Kabupaten Banyumas dan jadilah bagian dari gerakan dakwah pemuda.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="reg-wrapper">
            {/* Steps indicator */}
            <div className="reg-steps">
              <div className={`reg-step ${step >= 1 ? 'active' : ''}`}>
                <div className="reg-step-num">1</div>
                <span>Data Pribadi</span>
              </div>
              <ChevronRight size={16} className="reg-step-arrow" />
              <div className={`reg-step ${step >= 2 ? 'active' : ''}`}>
                <div className="reg-step-num">2</div>
                <span>Data Sekolah</span>
              </div>
              <ChevronRight size={16} className="reg-step-arrow" />
              <div className={`reg-step ${step >= 3 ? 'active' : ''}`}>
                <div className="reg-step-num">3</div>
                <span>Motivasi</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="reg-form">
              {step === 1 && (
                <div className="reg-form-step animate-hero delay-1">
                  <h3><User size={20} /> Data Pribadi</h3>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap *</label>
                    <input className="form-input" type="text" value={form.nama} onChange={(e) => updateForm('nama', e.target.value)} placeholder="Masukkan nama lengkap" required />
                  </div>
                  <div className="reg-form-row">
                    <div className="form-group">
                      <label className="form-label">Tempat Lahir</label>
                      <input className="form-input" type="text" value={form.tempatLahir} onChange={(e) => updateForm('tempatLahir', e.target.value)} placeholder="Kota/Kabupaten" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tanggal Lahir</label>
                      <input className="form-input" type="date" value={form.tanggalLahir} onChange={(e) => updateForm('tanggalLahir', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jenis Kelamin *</label>
                    <select className="form-select" value={form.jenisKelamin} onChange={(e) => updateForm('jenisKelamin', e.target.value)} required>
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-laki">Ikhwan (Laki-laki)</option>
                      <option value="Perempuan">Akhwat (Perempuan)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Alamat</label>
                    <textarea className="form-textarea" value={form.alamat} onChange={(e) => updateForm('alamat', e.target.value)} placeholder="Alamat lengkap" rows={2} />
                  </div>
                  <div className="reg-form-row">
                    <div className="form-group">
                      <label className="form-label">No. HP / WhatsApp *</label>
                      <input className="form-input" type="tel" value={form.noHp} onChange={(e) => updateForm('noHp', e.target.value)} placeholder="08xx-xxxx-xxxx" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="email@contoh.com" />
                    </div>
                  </div>
                  <div className="reg-form-actions">
                    <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                      Lanjut <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="reg-form-step animate-hero delay-1">
                  <h3><School size={20} /> Data Sekolah & ROHIS</h3>
                  <div className="form-group">
                    <label className="form-label">Asal Sekolah *</label>
                    <input className="form-input" type="text" value={form.asalSekolah} onChange={(e) => updateForm('asalSekolah', e.target.value)} placeholder="Nama sekolah (SMA/SMK/MA)" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kelas</label>
                    <select className="form-select" value={form.kelas} onChange={(e) => updateForm('kelas', e.target.value)}>
                      <option value="">Pilih kelas</option>
                      <option value="X">Kelas X</option>
                      <option value="XI">Kelas XI</option>
                      <option value="XII">Kelas XII</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama ROHIS di Sekolah</label>
                    <input className="form-input" type="text" value={form.namaRohis} onChange={(e) => updateForm('namaRohis', e.target.value)} placeholder="Nama ROHIS di sekolahmu (jika ada)" />
                  </div>
                  <div className="reg-form-actions">
                    <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Kembali</button>
                    <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                      Lanjut <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="reg-form-step animate-hero delay-1">
                  <h3><FileText size={20} /> Motivasi & Pengalaman</h3>
                  <div className="form-group">
                    <label className="form-label">Motivasi Bergabung *</label>
                    <textarea className="form-textarea" value={form.motivasi} onChange={(e) => updateForm('motivasi', e.target.value)} placeholder="Ceritakan motivasimu bergabung dengan Organisasi ROHIS Kabupaten Banyumas..." rows={4} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pengalaman Organisasi (opsional)</label>
                    <textarea className="form-textarea" value={form.pengalaman} onChange={(e) => updateForm('pengalaman', e.target.value)} placeholder="Pengalaman organisasi yang pernah diikuti..." rows={3} />
                  </div>
                  <div className="reg-form-actions">
                    <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Kembali</button>
                    <button type="submit" className="btn btn-gold btn-lg">
                      <Send size={16} /> Kirim Pendaftaran
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
