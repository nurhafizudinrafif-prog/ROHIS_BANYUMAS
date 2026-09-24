import { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  Settings as SettingsIcon, Save, Download, Upload, RotateCcw,
  CheckCircle2, AlertCircle, Building2, Phone, Mail, MapPin,
  ShieldCheck, KeyRound, Lock
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '../components/SocialIcons';

export default function Settings() {
  const {
    settings, updateData, addAuditLog,
    home, articles, events, schools, gallery, questions, library, team, programs, users, auditLogs, loadAllData
  } = useData();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    orgName: 'Organisasi ROHIS Kabupaten Banyumas',
    period: '2025/2026',
    email: 'info@rohisbanyumas.id',
    phone: '+62 812-3456-7890',
    whatsapp: '+62 812-3456-7890',
    address: 'Purwokerto, Kabupaten Banyumas, Jawa Tengah 53100',
    instagramUrl: 'https://www.instagram.com/rohis_banyumas/',
    youtubeUrl: 'https://youtube.com/@rohisbanyumas9?si=bJpq4dcozF81AHGr',
    adminUsername: 'admin_rokaba',
    adminPassword: '',
    adminPin: '',
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (settings) {
      setForm(prev => ({
        ...prev,
        ...settings,
        adminPassword: '',
        adminPin: '',
      }));
    }
  }, [settings]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        orgName: form.orgName,
        period: form.period,
        email: form.email,
        phone: form.phone,
        whatsapp: form.whatsapp,
        address: form.address,
        instagramUrl: form.instagramUrl,
        youtubeUrl: form.youtubeUrl,
      };

      if (form.adminUsername) payload.adminUsername = form.adminUsername;
      if (form.adminPassword) payload.adminPassword = form.adminPassword;
      if (form.adminPin) payload.adminPin = form.adminPin;

      await updateData('settings', payload);
      await addAuditLog(user.id, user.username, 'UPDATE', 'settings', 'Updated organizational settings');
      showToast('Pengaturan organisasi berhasil disimpan!', 'success');
    } catch (err) {
      console.error('Save settings failed:', err);
      showToast('Gagal menyimpan pengaturan: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Export full JSON backup
  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      platform: 'ROKABA Digital Ecosystem v2.0',
      data: {
        'rokaba:home': home,
        'rokaba:articles': articles,
        'rokaba:events': events,
        'rokaba:schools': schools,
        'rokaba:gallery': gallery,
        'rokaba:questions': questions,
        'rokaba:library': library,
        'rokaba:team': team,
        'rokaba:programs': programs,
        'rokaba:settings': settings,
        'rokaba:users': users,
        'rokaba:audit_logs': auditLogs,
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rokaba-full-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('File backup data berhasil diunduh!', 'success');
  };

  // Import JSON backup
  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const raw = evt.target.result;
        const parsed = JSON.parse(raw);
        const dataToRestore = parsed.data || parsed;

        if (window.confirm('PERINGATAN: Mengimpor backup akan memperbarui data sistem. Lanjutkan?')) {
          setSaving(true);
          for (const [key, val] of Object.entries(dataToRestore)) {
            const shortKey = key.replace('rokaba:', '');
            await updateData(shortKey, val);
          }
          await loadAllData();
          await addAuditLog(user.id, user.username, 'IMPORT', 'backup', 'Imported data from JSON backup file');
          showToast('Data berhasil dipulihkan dari backup!', 'success');
        }
      } catch (err) {
        alert('Format berkas backup tidak valid: ' + err.message);
      } finally {
        setSaving(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
          background: toast.type === 'success' ? '#065F46' : '#991B1B',
          color: '#FFFFFF', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: '0.65rem',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <SettingsIcon size={26} color="var(--emerald)" /> Pengaturan & Cadangan Sistem
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Kelola identitas resmi organisasi, informasi kontak, tautan media sosial, serta pencadangan database.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button type="button" onClick={handleExportBackup} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Download size={16} /> Unduh Backup JSON
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Upload size={16} /> Pulihkan Backup
          </button>
          <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportBackup} />
        </div>
      </div>

      <form onSubmit={handleSaveSettings}>
        {/* Card 1: Identitas Organisasi */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald)' }}>
            <Building2 size={18} /> Identitas Resmi Organisasi
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Nama Lengkap Organisasi</label>
              <input
                type="text"
                className="form-input"
                value={form.orgName}
                onChange={e => setForm({ ...form, orgName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Periode Kepengurusan</label>
              <input
                type="text"
                className="form-input"
                value={form.period}
                onChange={e => setForm({ ...form, period: e.target.value })}
                placeholder="2025/2026"
                required
              />
            </div>
          </div>
        </div>

        {/* Card 2: Kontak & Sekretariat */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald)' }}>
            <Phone size={18} /> Saluran Kontak & Sekretariat
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Email Resmi</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="info@rohisbanyumas.id"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nomor WhatsApp / Narahubung</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Phone size={16} />
                </span>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={form.whatsapp}
                  onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="+62 812-3456-7890"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Alamat Sekretariat / Domisili</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.85rem', top: '0.85rem', color: 'var(--text-muted)' }}>
                <MapPin size={16} />
              </span>
              <textarea
                className="form-input"
                style={{ paddingLeft: '2.5rem', minHeight: 70 }}
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="Purwokerto, Kabupaten Banyumas, Jawa Tengah 53100"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Media Sosial */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald)' }}>
            <InstagramIcon size={18} /> Media Sosial Resmi
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">URL Instagram Resmi</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <InstagramIcon size={16} />
                </span>
                <input
                  type="url"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={form.instagramUrl}
                  onChange={e => setForm({ ...form, instagramUrl: e.target.value })}
                  placeholder="https://www.instagram.com/rohis_banyumas/"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">URL Channel YouTube</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <YoutubeIcon size={16} />
                </span>
                <input
                  type="url"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={form.youtubeUrl}
                  onChange={e => setForm({ ...form, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/@rohisbanyumas9"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}>
            <Save size={18} />
            <span>{saving ? 'Menyimpan...' : 'Simpan Seluruh Pengaturan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
