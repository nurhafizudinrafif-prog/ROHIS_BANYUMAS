import { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Sparkles,
  Layout,
  Info,
  Layers,
  History,
  BarChart3,
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import ImageUploadField from './ImageUploadField';
import { initialHomeContent } from '../data/homeContent';
import { programs as defaultPrograms } from '../data/programs';
import { saveCloudCMSData } from '../services/cloudSync';

export default function AdminHomeCMS({
  homeContent,
  programs,
  onSaveHomeContent,
  onSaveProgram,
  showToast,
}) {
  // Local working state
  const [formData, setFormData] = useState(() => homeContent || initialHomeContent);
  const [localPrograms, setLocalPrograms] = useState(() => (programs && programs.length > 0 ? programs : defaultPrograms));
  const [activeSubTab, setActiveSubTab] = useState('hero'); // 'hero' | 'about' | 'programs' | 'timeline' | 'stats' | 'closing'
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Sync from parent ONLY if user does not have active unsaved edits
  useEffect(() => {
    if (homeContent && !isDirty) {
      setFormData(homeContent);
    }
  }, [homeContent, isDirty]);

  useEffect(() => {
    if (programs && programs.length > 0 && !isDirty) {
      setLocalPrograms(programs);
    }
  }, [programs, isDirty]);

  // Nested field updater helper
  const updateHero = (field, val) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: val },
    }));
  };

  const updateAbout = (field, val) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      about: { ...prev.about, [field]: val },
    }));
  };

  const updateClosing = (field, val) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      closing: { ...prev.closing, [field]: val },
    }));
  };

  const updateStat = (index, field, val) => {
    setIsDirty(true);
    setFormData((prev) => {
      const newStats = [...(prev.stats || [])];
      newStats[index] = { ...newStats[index], [field]: val };
      return { ...prev, stats: newStats };
    });
  };

  // Timeline handlers
  const handleAddTimeline = () => {
    setIsDirty(true);
    const newId = `tl-${Date.now()}`;
    const newMilestone = {
      id: newId,
      year: new Date().getFullYear().toString(),
      tag: 'FASE BARU',
      title: 'Judul Jejak Langkah',
      location: 'Kabupaten Banyumas',
      desc: 'Tuliskan deskripsi peristiwa atau pencapaian bersejarah pada tahun ini...',
    };
    setFormData((prev) => ({
      ...prev,
      timeline: [...(prev.timeline || []), newMilestone],
    }));
  };

  const updateTimelineItem = (index, field, val) => {
    setIsDirty(true);
    setFormData((prev) => {
      const newTl = [...(prev.timeline || [])];
      newTl[index] = { ...newTl[index], [field]: val };
      return { ...prev, timeline: newTl };
    });
  };

  const handleDeleteTimeline = (index) => {
    if (window.confirm('Yakin ingin menghapus jejak langkah ini?')) {
      setIsDirty(true);
      setFormData((prev) => {
        const newTl = (prev.timeline || []).filter((_, i) => i !== index);
        return { ...prev, timeline: newTl };
      });
    }
  };

  // Program / Divisi handlers
  const updateProgramField = (pIndex, field, val) => {
    setIsDirty(true);
    setLocalPrograms((prev) => {
      const updated = [...prev];
      updated[pIndex] = { ...updated[pIndex], [field]: val };
      return updated;
    });
  };

  const updateProgramDetailItem = (pIndex, dIndex, val) => {
    setIsDirty(true);
    setLocalPrograms((prev) => {
      const updated = [...prev];
      const details = [...(updated[pIndex].details || [])];
      details[dIndex] = val;
      updated[pIndex] = { ...updated[pIndex], details };
      return updated;
    });
  };

  const addProgramDetailItem = (pIndex) => {
    setIsDirty(true);
    setLocalPrograms((prev) => {
      const updated = [...prev];
      const details = [...(updated[pIndex].details || []), 'Program kerja baru...'];
      updated[pIndex] = { ...updated[pIndex], details };
      return updated;
    });
  };

  const removeProgramDetailItem = (pIndex, dIndex) => {
    setIsDirty(true);
    setLocalPrograms((prev) => {
      const updated = [...prev];
      const details = (updated[pIndex].details || []).filter((_, i) => i !== dIndex);
      updated[pIndex] = { ...updated[pIndex], details };
      return updated;
    });
  };

  // Save All Changes
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      if (onSaveHomeContent) {
        await onSaveHomeContent(formData);
      }
      if (onSaveProgram && localPrograms) {
        localPrograms.forEach((prog) => {
          onSaveProgram(prog.id, prog);
        });
      }

      // Explicit Cloud Save to Upstash Redis
      await saveCloudCMSData({
        homeContent: formData,
        programs: localPrograms,
      });
      setIsDirty(false);

      if (showToast) {
        showToast('Seluruh teks dan foto Beranda berhasil disimpan ke Cloud & langsung tayang!', 'success');
      }
    } catch (err) {
      console.error('Error saving home content:', err);
      if (showToast) {
        showToast('Terjadi kesalahan saat menyimpan data ke cloud.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Discard Unsaved Changes
  const handleReset = () => {
    if (window.confirm('Batalkan seluruh perubahan yang belum disimpan dan kembalikan ke data tersimpan?')) {
      setFormData(homeContent || initialHomeContent);
      setLocalPrograms(programs && programs.length > 0 ? programs : defaultPrograms);
      setIsDirty(false);
      if (showToast) showToast('Perubahan dibatalkan.', 'info');
    }
  };

  // Revert to Initial Defaults
  const handleResetDefaults = () => {
    if (window.confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh teks dan foto beranda ke data bawaan awal?')) {
      setFormData(initialHomeContent);
      setLocalPrograms(defaultPrograms);
      if (onSaveHomeContent) {
        onSaveHomeContent(initialHomeContent);
      }
      defaultPrograms.forEach((prog) => {
        if (onSaveProgram) onSaveProgram(prog.id, prog);
      });
      saveCloudCMSData({
        homeContent: initialHomeContent,
        programs: defaultPrograms,
      });
      if (showToast) {
        showToast('Konten beranda berhasil dikembalikan ke standar awal!', 'info');
      }
    }
  };

  return (
    <div className="admin-home-cms-pane tab-pane">
      {/* Header Bar */}
      <div className="admin-header-row">
        <div>
          <div className="cms-badge-title">
            <span className="badge badge-gold">
              <Sparkles size={13} /> Visual & Editorial CMS
            </span>
          </div>
          <h2>Kelola Konten & Foto Beranda (Homepage)</h2>
          <p>
            Ubah judul, narasi, foto utama, linimasa sejarah, program kerja, dan statistik website langsung dari panel ini.
          </p>
        </div>

        <div className="home-cms-top-actions">
          {isDirty && (
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#F59E0B',
              background: 'rgba(245, 158, 11, 0.12)',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
              Ada perubahan belum disimpan
            </span>
          )}
          <a
            href="https://www.rohis-banyumas.web.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <ExternalLink size={14} /> Lihat Beranda Publik
          </a>
          {isDirty && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleReset}
              disabled={isSaving}
              style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.35)' }}
            >
              <RotateCcw size={14} /> Batalkan
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary btn-sm btn-save-master"
            onClick={handleSaveAll}
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="home-cms-subnav">
        <button
          type="button"
          className={`subnav-btn ${activeSubTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('hero')}
        >
          <Layout size={16} />
          <span>1. Bagian Hero & Headline</span>
        </button>
        <button
          type="button"
          className={`subnav-btn ${activeSubTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('about')}
        >
          <Info size={16} />
          <span>2. Tentang Kami (About)</span>
        </button>
        <button
          type="button"
          className={`subnav-btn ${activeSubTab === 'programs' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('programs')}
        >
          <Layers size={16} />
          <span>3. 5 Divisi & Program Kerja</span>
        </button>
        <button
          type="button"
          className={`subnav-btn ${activeSubTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('timeline')}
        >
          <History size={16} />
          <span>4. Historia & Linimasa ({formData.timeline?.length || 0})</span>
        </button>
        <button
          type="button"
          className={`subnav-btn ${activeSubTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('stats')}
        >
          <BarChart3 size={16} />
          <span>5. Statistik Angka</span>
        </button>
        <button
          type="button"
          className={`subnav-btn ${activeSubTab === 'closing' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('closing')}
        >
          <MessageSquare size={16} />
          <span>6. Ajakan Bergabung (CTA)</span>
        </button>
      </div>

      {/* SUB-TAB 1: HERO SECTION */}
      {activeSubTab === 'hero' && (
        <div className="home-cms-section card">
          <div className="cms-section-header">
            <div>
              <h3>Pengaturan Hero Section (Header Utama)</h3>
              <p className="text-muted">
                Mengatur tampilan headline paling atas yang pertama kali dilihat oleh pengunjung website.
              </p>
            </div>
            <span className="badge badge-primary">Bagian Paling Depan</span>
          </div>

          <div className="cms-form-grid">
            <div className="form-group">
              <label className="form-label">Tagline Kecil (Badge Atas)</label>
              <input
                type="text"
                className="form-input"
                value={formData.hero?.tag || ''}
                onChange={(e) => updateHero('tag', e.target.value)}
                placeholder="PELAJAR • PEMUDA • KABUPATEN BANYUMAS"
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Judul Utama Baris 1</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.hero?.titleLine1 || ''}
                  onChange={(e) => updateHero('titleLine1', e.target.value)}
                  placeholder="ROHIS"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Judul Utama Baris 2 (Aksen Hijau-Emas)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.hero?.titleLine2 || ''}
                  onChange={(e) => updateHero('titleLine2', e.target.value)}
                  placeholder="BANYUMAS"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Sub-Headline Editorial (Lead Phrase)</label>
              <input
                type="text"
                className="form-input"
                value={formData.hero?.leadPhrase || ''}
                onChange={(e) => updateHero('leadPhrase', e.target.value)}
                placeholder="Ruang belajar, bertumbuh, dan berkontribusi bersama."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Paragraf Narasi / Deskripsi Singkat</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={formData.hero?.narrative || ''}
                onChange={(e) => updateHero('narrative', e.target.value)}
                placeholder="Wadah silaturahmi, kaderisasi kepemimpinan, dan sinergi dakwah..."
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Teks Tombol Utama</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.hero?.btnPrimaryText || ''}
                  onChange={(e) => updateHero('btnPrimaryText', e.target.value)}
                  placeholder="Kenali ROHIS Lebih Dekat"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tautan / Link Tombol Utama</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.hero?.btnPrimaryLink || ''}
                  onChange={(e) => updateHero('btnPrimaryLink', e.target.value)}
                  placeholder="/tentang"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Teks Tombol Kedua</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.hero?.btnSecondaryText || ''}
                  onChange={(e) => updateHero('btnSecondaryText', e.target.value)}
                  placeholder="5 Pilar Gerakan"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tautan / Link Tombol Kedua</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.hero?.btnSecondaryLink || ''}
                  onChange={(e) => updateHero('btnSecondaryLink', e.target.value)}
                  placeholder="#program"
                />
              </div>
            </div>

            {/* FOTO HERO SECTION */}
            <div className="cms-sub-box">
              <h4 className="sub-box-title">📸 Foto Dokumentasi Utama Hero</h4>
              <p className="text-muted sub-box-desc">
                Upload foto dari komputer Anda atau tempel link gambar. Foto ini menjadi visual utama beranda.
              </p>

              <ImageUploadField
                label="Foto Sampul Hero"
                value={formData.hero?.photoUrl || ''}
                onChange={(val) => updateHero('photoUrl', val)}
                placeholder="Pilih berkas foto dari laptop/HP atau tempel URL Unsplash/Drive..."
                tip="Rekomendasi orientasi horizontal/landscape (resolusi 1200x800 ke atas) untuk tampilan sinematik terbaik."
              />

              <div className="form-grid-2" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Label Stempel Arsip (Pojok Foto)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.hero?.photoStamp || ''}
                    onChange={(e) => updateHero('photoStamp', e.target.value)}
                    placeholder="ARCHIVE REF #01"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Label Lokasi Foto</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.hero?.photoLoc || ''}
                    onChange={(e) => updateHero('photoLoc', e.target.value)}
                    placeholder="MASJID AGUNG BAITUSSALAM"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Judul Caption Foto</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.hero?.photoTitle || ''}
                  onChange={(e) => updateHero('photoTitle', e.target.value)}
                  placeholder="Sinergi Kader Dakwah Pelajar se-Banyumas"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Keterangan / Subtitle Foto</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.hero?.photoSub || ''}
                  onChange={(e) => updateHero('photoSub', e.target.value)}
                  placeholder="Pertemuan akbar perwakilan pengurus rohis sekolah..."
                />
              </div>
            </div>

            {/* INFO BAR HERO */}
            <div className="cms-sub-box">
              <h4 className="sub-box-title">ℹ️ Bilah Keterangan Bawah (Status Bar)</h4>
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Status Organisasi</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.hero?.metaStatus || ''}
                    onChange={(e) => updateHero('metaStatus', e.target.value)}
                    placeholder="RESMI • DAKWAH SEKOLAH"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sejak Tahun & Wilayah</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.hero?.metaSince || ''}
                    onChange={(e) => updateHero('metaSince', e.target.value)}
                    placeholder="2017 • PURWOKERTO"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Jejaring Sekolah</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.hero?.metaNetwork || ''}
                    onChange={(e) => updateHero('metaNetwork', e.target.value)}
                    placeholder="15+ SMA / SMK / MA"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ABOUT SECTION */}
      {activeSubTab === 'about' && (
        <div className="home-cms-section card">
          <div className="cms-section-header">
            <div>
              <h3>Bagian Tentang Kami (Tentang ROKABA)</h3>
              <p className="text-muted">
                Ubah teks filosofi, poin keunggulan dakwah, kutipan inspiratif, serta foto dokumentasi kegiatan.
              </p>
            </div>
            <span className="badge badge-gold">Editorial Section</span>
          </div>

          <div className="cms-form-grid">
            <div className="form-group">
              <label className="form-label">Tagline Bagian</label>
              <input
                type="text"
                className="form-input"
                value={formData.about?.tag || ''}
                onChange={(e) => updateAbout('tag', e.target.value)}
                placeholder="TENTANG KAMI"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Judul Utama</label>
              <input
                type="text"
                className="form-input"
                value={formData.about?.title || ''}
                onChange={(e) => updateAbout('title', e.target.value)}
                placeholder="Bukan sekadar sebuah organisasi."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kalimat Pembuka (Lead Paragraph)</label>
              <textarea
                rows={2}
                className="form-textarea"
                value={formData.about?.lead || ''}
                onChange={(e) => updateAbout('lead', e.target.value)}
                placeholder="Didirikan pada tahun 2017 di Purwokerto..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Paragraf 1 (Visi & Nilai Gerakan)</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={formData.about?.paragraph1 || ''}
                onChange={(e) => updateAbout('paragraph1', e.target.value)}
                placeholder="Kami hadir bukan sekadar menyusun struktur formal..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Paragraf 2 (Aksi Lapangan & Sinergi)</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={formData.about?.paragraph2 || ''}
                onChange={(e) => updateAbout('paragraph2', e.target.value)}
                placeholder="Dari kajian akbar di masjid-masjid agung hingga..."
              />
            </div>

            <div className="form-grid-2">
              <div className="cms-sub-box">
                <h4 className="sub-box-title">Poin Unggulan 1</h4>
                <div className="form-group">
                  <label className="form-label">Judul Poin 1</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.about?.point1Title || ''}
                    onChange={(e) => updateAbout('point1Title', e.target.value)}
                    placeholder="Sinergi Lintas Sekolah"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Keterangan Poin 1</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    value={formData.about?.point1Desc || ''}
                    onChange={(e) => updateAbout('point1Desc', e.target.value)}
                    placeholder="Mengikis sekat sekolah, menghubungkan puluhan rohis..."
                  />
                </div>
              </div>

              <div className="cms-sub-box">
                <h4 className="sub-box-title">Poin Unggulan 2</h4>
                <div className="form-group">
                  <label className="form-label">Judul Poin 2</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.about?.point2Title || ''}
                    onChange={(e) => updateAbout('point2Title', e.target.value)}
                    placeholder="Kaderisasi Berjenjang"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Keterangan Poin 2</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    value={formData.about?.point2Desc || ''}
                    onChange={(e) => updateAbout('point2Desc', e.target.value)}
                    placeholder="Mencetak generasi muda yang kritis, berakhlak mulia..."
                  />
                </div>
              </div>
            </div>

            {/* FOTO TENTANG KAMI */}
            <div className="cms-sub-box">
              <h4 className="sub-box-title">📸 Foto Dokumentasi Bagian Tentang Kami</h4>
              <ImageUploadField
                label="Foto Dokumentasi Tentang Kami"
                value={formData.about?.photoUrl || ''}
                onChange={(val) => updateAbout('photoUrl', val)}
                placeholder="Upload berkas foto atau tempel URL..."
                tip="Foto pembinaan santri/pelajar dalam kegiatan kajian atau pelatihan."
              />

              <div className="form-grid-2" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Label Foto Atas</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.about?.photoTag || ''}
                    onChange={(e) => updateAbout('photoTag', e.target.value)}
                    placeholder="DOKUMENTASI KADERISASI • PURWOKERTO"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Badge Est. Tahun</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.about?.photoEst || ''}
                    onChange={(e) => updateAbout('photoEst', e.target.value)}
                    placeholder="EST. 2017"
                  />
                </div>
              </div>
            </div>

            {/* KUTIPAN INSPIRATIF */}
            <div className="cms-sub-box">
              <h4 className="sub-box-title">💬 Kutipan Inspiratif (Quote Card)</h4>
              <div className="form-group">
                <label className="form-label">Isi Kutipan</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  value={formData.about?.quoteText || ''}
                  onChange={(e) => updateAbout('quoteText', e.target.value)}
                  placeholder='"Di sini kami belajar bahwa dakwah terbaik..."'
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nama Pengutip / Sumber</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.about?.quoteAuthor || ''}
                  onChange={(e) => updateAbout('quoteAuthor', e.target.value)}
                  placeholder="— Catatan Lapangan Kader Pelajar, Banyumas"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: 5 PILAR PROGRAM KERJA */}
      {activeSubTab === 'programs' && (
        <div className="home-cms-section card">
          <div className="cms-section-header">
            <div>
              <h3>5 Pilar Gerakan & Program Kerja Divisi</h3>
              <p className="text-muted">
                Sesuaikan nama divisi, deskripsi misi, dan daftar program kerja unggulan masing-masing divisi.
              </p>
            </div>
            <span className="badge badge-emerald">5 Divisi Aktif</span>
          </div>

          <div className="programs-accordion-list">
            {localPrograms.map((prog, pIdx) => (
              <div key={prog.id || pIdx} className="cms-sub-box program-edit-card">
                <div className="program-edit-header">
                  <div className="program-title-group">
                    <span className="badge badge-outline">{prog.division || `Divisi ${pIdx + 1}`}</span>
                    <h4>{prog.title}</h4>
                  </div>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {prog.details?.length || 0} Butir Agenda
                  </span>
                </div>

                <div className="form-group" style={{ marginTop: '0.8rem' }}>
                  <label className="form-label">Judul Lengkap Divisi</label>
                  <input
                    type="text"
                    className="form-input"
                    value={prog.title || ''}
                    onChange={(e) => updateProgramField(pIdx, 'title', e.target.value)}
                    placeholder="Divisi SDM (Sumber Daya Manusia)"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deskripsi Gerakan Divisi</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    value={prog.description || ''}
                    onChange={(e) => updateProgramField(pIdx, 'description', e.target.value)}
                    placeholder="Fokus pada pembinaan karakter..."
                  />
                </div>

                <div className="program-details-manager">
                  <label className="form-label">Daftar Butir Program Kerja Unggulan:</label>
                  {(prog.details || []).map((item, dIdx) => (
                    <div key={dIdx} className="program-detail-edit-row">
                      <span className="detail-idx-badge">{dIdx + 1}</span>
                      <input
                        type="text"
                        className="form-input"
                        value={item}
                        onChange={(e) => updateProgramDetailItem(pIdx, dIdx, e.target.value)}
                        placeholder="Nama program kerja..."
                      />
                      <button
                        type="button"
                        className="btn-icon btn-icon-delete"
                        onClick={() => removeProgramDetailItem(pIdx, dIdx)}
                        title="Hapus butir program ini"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-outline btn-xs"
                    style={{ marginTop: '0.5rem' }}
                    onClick={() => addProgramDetailItem(pIdx)}
                  >
                    <Plus size={13} /> Tambah Butir Agenda Kerja
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: HISTORIA & LINIMASA */}
      {activeSubTab === 'timeline' && (
        <div className="home-cms-section card">
          <div className="cms-section-header">
            <div>
              <h3>Historia & Linimasa Jejak Langkah</h3>
              <p className="text-muted">
                Peristiwa bersejarah, fase transformasi, dan tonggak penting perjalanan ROHIS Banyumas.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-gold btn-sm"
              onClick={handleAddTimeline}
            >
              <Plus size={15} /> Tambah Linimasa Baru
            </button>
          </div>

          <div className="timeline-edit-list">
            {(formData.timeline || []).map((item, index) => (
              <div key={item.id || index} className="cms-sub-box timeline-edit-card">
                <div className="timeline-card-top">
                  <div className="timeline-badge-row">
                    <span className="timeline-year-tag">{item.year}</span>
                    <span className="badge badge-gold">{item.tag || 'FASE'}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-icon btn-icon-delete"
                    onClick={() => handleDeleteTimeline(index)}
                    title="Hapus tonggak sejarah ini"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="form-grid-3" style={{ marginTop: '0.8rem' }}>
                  <div className="form-group">
                    <label className="form-label">Tahun</label>
                    <input
                      type="text"
                      className="form-input"
                      value={item.year || ''}
                      onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                      placeholder="2017"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kategori / Tag</label>
                    <input
                      type="text"
                      className="form-input"
                      value={item.tag || ''}
                      onChange={(e) => updateTimelineItem(index, 'tag', e.target.value)}
                      placeholder="AWAL JEJAK"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lokasi Peristiwa</label>
                    <input
                      type="text"
                      className="form-input"
                      value={item.location || ''}
                      onChange={(e) => updateTimelineItem(index, 'location', e.target.value)}
                      placeholder="Purwokerto"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Judul Tonggak Sejarah</label>
                  <input
                    type="text"
                    className="form-input"
                    value={item.title || ''}
                    onChange={(e) => updateTimelineItem(index, 'title', e.target.value)}
                    placeholder="Inisiasi & Silaturahmi Perdana"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Uraian / Narasi Jejak</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    value={item.desc || ''}
                    onChange={(e) => updateTimelineItem(index, 'desc', e.target.value)}
                    placeholder="Tuliskan catatan sejarah..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: STATISTIK ANGKA */}
      {activeSubTab === 'stats' && (
        <div className="home-cms-section card">
          <div className="cms-section-header">
            <div>
              <h3>Statistik & Metrik Dampak Gerakan</h3>
              <p className="text-muted">
                Angka-angka pencapaian yang tampil di baris counter beranda.
              </p>
            </div>
            <span className="badge badge-primary">4 Metrik Utama</span>
          </div>

          <div className="stats-edit-grid">
            {(formData.stats || []).map((stat, sIdx) => (
              <div key={sIdx} className="cms-sub-box stat-edit-card">
                <h4 className="sub-box-title">Metrik #{sIdx + 1}</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Angka / Nilai</label>
                    <input
                      type="number"
                      className="form-input"
                      value={stat.value ?? ''}
                      onChange={(e) => updateStat(sIdx, 'value', Number(e.target.value))}
                      placeholder="15"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Suffix (Simbol)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={stat.suffix || ''}
                      onChange={(e) => updateStat(sIdx, 'suffix', e.target.value)}
                      placeholder="+"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Label Keterangan</label>
                  <input
                    type="text"
                    className="form-input"
                    value={stat.label || ''}
                    onChange={(e) => updateStat(sIdx, 'label', e.target.value)}
                    placeholder="Dari Sekolah Kab. Banyumas"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: CLOSING CTA */}
      {activeSubTab === 'closing' && (
        <div className="home-cms-section card">
          <div className="cms-section-header">
            <div>
              <h3>Bagian Penutup & Ajakan Bergabung (CTA)</h3>
              <p className="text-muted">
                Mengatur kalimat ajakan di bagian paling bawah halaman sebelum footer.
              </p>
            </div>
            <span className="badge badge-gold">Closing Banner</span>
          </div>

          <div className="cms-form-grid">
            <div className="form-group">
              <label className="form-label">Badge Tagline</label>
              <input
                type="text"
                className="form-input"
                value={formData.closing?.tag || ''}
                onChange={(e) => updateClosing('tag', e.target.value)}
                placeholder="MARI BERGABUNG"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Judul Besar Penutup</label>
              <input
                type="text"
                className="form-input"
                value={formData.closing?.headline || ''}
                onChange={(e) => updateClosing('headline', e.target.value)}
                placeholder="Mari Tumbuh Bersama."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kalimat Narasi Penutup</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={formData.closing?.lead || ''}
                onChange={(e) => updateClosing('lead', e.target.value)}
                placeholder="Pintu selalu terbuka bagi pelajar yang ingin belajar..."
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Teks Tombol Utama</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.closing?.btnPrimaryText || ''}
                  onChange={(e) => updateClosing('btnPrimaryText', e.target.value)}
                  placeholder="Daftar Menjadi Bagian ROKABA"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Link Tombol Utama</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.closing?.btnPrimaryLink || ''}
                  onChange={(e) => updateClosing('btnPrimaryLink', e.target.value)}
                  placeholder="/pendaftaran"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Teks Tombol Kedua</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.closing?.btnSecondaryText || ''}
                  onChange={(e) => updateClosing('btnSecondaryText', e.target.value)}
                  placeholder="Hubungi Pengurus"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Link Tombol Kedua</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.closing?.btnSecondaryLink || ''}
                  onChange={(e) => updateClosing('btnSecondaryLink', e.target.value)}
                  placeholder="/kontak"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Sticky Bar */}
      <div className="home-cms-sticky-footer">
        <div className="sticky-footer-info">
          <CheckCircle2 size={18} className="text-success" />
          <span>Perubahan disimpan otomatis di memori lokal dan Upstash Cloud Sync saat Anda klik Simpan.</span>
        </div>

        <div className="sticky-footer-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleResetDefaults}
            title="Kembalikan semua teks beranda ke versi awal"
          >
            <RotateCcw size={14} /> Reset ke Awal
          </button>
          <button
            type="button"
            className="btn btn-primary btn-save-master"
            onClick={handleSaveAll}
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Seluruh Konten Beranda'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
