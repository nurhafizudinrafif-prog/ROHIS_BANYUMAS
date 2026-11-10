import { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  Settings as SettingsIcon,
  Save,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  KeyRound,
  Lock,
  Database,
  UserCheck,
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '../components/SocialIcons';

export default function Settings() {
  const {
    settings,
    updateData,
    addAuditLog,
    home,
    articles,
    events,
    schools,
    gallery,
    questions,
    library,
    team,
    programs,
    users,
    auditLogs,
    loadAllData,
  } = useData();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('organisasi'); // 'organisasi' | 'kontak' | 'akun' | 'backup'
  const [form, setForm] = useState({
    orgName: 'ROHIS Kabupaten Banyumas',
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
      setForm((prev) => ({
        ...prev,
        ...settings,
        adminPassword: '',
        adminPin: '',
      }));
    }
  }, [settings]);

  const handleSaveSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
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
      if (addAuditLog && user) {
        await addAuditLog(
          user.id,
          user.username,
          'UPDATE',
          'settings',
          'Updated organizational settings'
        );
      }
      showToast('Pengaturan organisasi berhasil disimpan!', 'success');
    } catch (err) {
      console.error('Save settings failed:', err);
      showToast('Gagal menyimpan pengaturan: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Export full JSON backup matching Image 04 panel 4
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

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
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

        if (
          window.confirm(
            'PERINGATAN: Mengimpor backup akan memperbarui seluruh data sistem. Lanjutkan?'
          )
        ) {
          setSaving(true);
          for (const [key, val] of Object.entries(dataToRestore)) {
            const shortKey = key.replace('rokaba:', '');
            await updateData(shortKey, val);
          }
          await loadAllData();
          if (addAuditLog && user) {
            await addAuditLog(
              user.id,
              user.username,
              'IMPORT',
              'backup',
              'Imported data from JSON backup file'
            );
          }
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

  const navTabs = [
    { id: 'organisasi', label: 'Organisasi', icon: Building2 },
    { id: 'kontak', label: 'Kontak', icon: Phone },
    { id: 'akun', label: 'Akun', icon: ShieldCheck },
    { id: 'backup', label: 'Backup', icon: Database },
  ];

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', paddingBottom: '3.5rem' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          background: toast.type === 'success' ? '#10291F' : '#991B1B',
          color: '#F7F5F0',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--soft-shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          maxWidth: 'calc(100vw - 2rem)',
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} color="var(--brass-light)" /> : <AlertCircle size={18} />}
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{toast.message}</span>
        </div>
      )}

      {/* Header Bar matching Image 04 panel 4 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
            Pengaturan
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Atur informasi organisasi, kontak, akun, dan backup data.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          className="btn btn-pine"
          disabled={saving}
        >
          <Save size={15} />
          <span>{saving ? 'Menyimpan...' : 'Simpan pengaturan'}</span>
        </button>
      </div>

      {/* Split Layout: Left vertical nav, Right content matching Image 04 panel 4 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 240px) 1fr',
        gap: '1.5rem',
        alignItems: 'start',
      }}>
        {/* Left Vertical Sub-Nav matching Image 04 panel 4 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          background: 'var(--surface-bg)',
          padding: '0.65rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--soft-shadow-sm)',
        }}>
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--pine-dark)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 2px 6px rgba(16, 41, 31, 0.25)' : 'none',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* TAB 1: ORGANISASI (Image 04 panel 4) */}
          {activeTab === 'organisasi' && (
            <>
              <div className="admin-soft-card">
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
                    Informasi organisasi
                  </h3>
                  <p className="text-secondary" style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>
                    Informasi dasar organisasi yang ditampilkan di website.
                  </p>
                </div>

                <div className="form-group-soft">
                  <label className="form-label-soft">Nama organisasi</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={form.orgName}
                    onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                    placeholder="ROHIS Kabupaten Banyumas"
                  />
                </div>

                <div className="form-group-soft">
                  <label className="form-label-soft">Email organisasi</label>
                  <input
                    type="email"
                    className="form-input-soft"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Masukkan email organisasi..."
                  />
                </div>

                <div className="form-group-soft">
                  <label className="form-label-soft">Periode kepengurusan</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={form.period}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                    placeholder="2025/2026"
                  />
                </div>
              </div>

              {/* Backup data box below on Organisasi tab matching Image 04 panel 4 */}
              <div className="admin-soft-card">
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
                    Backup data
                  </h3>
                  <p className="text-secondary" style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>
                    Unduh salinan data CMS atau pulihkan dari file backup.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="btn btn-secondary-soft"
                    style={{ gap: '0.45rem' }}
                  >
                    <Download size={15} /> Unduh backup
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary-soft"
                    style={{ gap: '0.45rem' }}
                  >
                    <Upload size={15} /> Pulihkan backup
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleImportBackup}
                  />
                </div>
              </div>
            </>
          )}

          {/* TAB 2: KONTAK */}
          {activeTab === 'kontak' && (
            <div className="admin-soft-card">
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
                  Saluran kontak & sosial
                </h3>
                <p className="text-secondary" style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>
                  Informasi narahubung dan media sosial resmi.
                </p>
              </div>

              <div className="form-grid-2-soft">
                <div className="form-group-soft">
                  <label className="form-label-soft">Nomor WhatsApp</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="+62 812-..."
                  />
                </div>
                <div className="form-group-soft">
                  <label className="form-label-soft">Nomor Telepon Sekretariat</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+62 812-..."
                  />
                </div>
              </div>

              <div className="form-group-soft">
                <label className="form-label-soft">Alamat Sekretariat</label>
                <textarea
                  rows={2}
                  className="form-textarea-soft"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Alamat kantor sekretariat..."
                />
              </div>

              <div className="form-grid-2-soft">
                <div className="form-group-soft">
                  <label className="form-label-soft">Link Instagram</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={form.instagramUrl}
                    onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="form-group-soft">
                  <label className="form-label-soft">Link Kanal YouTube</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={form.youtubeUrl}
                    onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AKUN */}
          {activeTab === 'akun' && (
            <div className="admin-soft-card">
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
                  Pengaturan akun admin
                </h3>
                <p className="text-secondary" style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>
                  Perbarui username, kata sandi, dan PIN pengaman login CMS.
                </p>
              </div>

              <div className="form-group-soft">
                <label className="form-label-soft">Username Administrator</label>
                <input
                  type="text"
                  className="form-input-soft"
                  value={form.adminUsername}
                  onChange={(e) => setForm({ ...form, adminUsername: e.target.value })}
                  placeholder="admin_rokaba"
                />
              </div>

              <div className="form-grid-2-soft">
                <div className="form-group-soft">
                  <label className="form-label-soft">Kata Sandi Baru (Kosongkan bila tidak diganti)</label>
                  <input
                    type="password"
                    className="form-input-soft"
                    value={form.adminPassword}
                    onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <div className="form-group-soft">
                  <label className="form-label-soft">PIN Akses (Opsional)</label>
                  <input
                    type="password"
                    className="form-input-soft"
                    value={form.adminPin}
                    onChange={(e) => setForm({ ...form, adminPin: e.target.value })}
                    placeholder="6 digit angka"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP */}
          {activeTab === 'backup' && (
            <div className="admin-soft-card">
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
                  Cadangan & Pemulihan Data Sistem
                </h3>
                <p className="text-secondary" style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>
                  Seluruh data CMS (Beranda, Berita, Artikel, Agenda, Galeri, Pengurus, Sekolah, E-Library, Pertanyaan, dan Log) dapat diunduh dalam 1 berkas JSON aman.
                </p>
              </div>

              <div style={{
                background: 'rgba(16, 41, 31, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Database size={18} color="var(--pine-dark)" />
                  <strong style={{ color: 'var(--pine-dark)', fontSize: '0.92rem' }}>Upstash Redis Cloud Sync</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Data tersinkronisasi otomatis setiap ada perubahan. Membuat salinan cadangan berkala di laptop/perangkat Anda sangat disarankan sebelum perombakan besar.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="btn btn-pine"
                  style={{ gap: '0.45rem' }}
                >
                  <Download size={15} /> Unduh Full Backup (.json)
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary-soft"
                  style={{ gap: '0.45rem' }}
                >
                  <Upload size={15} /> Pulihkan dari Backup (.json)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
