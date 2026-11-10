import './AdminHomeCMS.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Newspaper,
  FileText,
  ShieldCheck,
  User,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Clock,
  Eye,
} from 'lucide-react';
import ImageUploadField from './ImageUploadField';
import { fallbackData } from '@shared/data/fallback.js';
const initialHomeContent = fallbackData['rokaba:home'];
const defaultPrograms = fallbackData['rokaba:programs'];
import { saveData } from '@shared/services/cloudSync.js';

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
  const [activeSubTab, setActiveSubTab] = useState('hero'); // 'hero' | 'sambutan' | 'about' | 'programs' | 'timeline' | 'stats' | 'closing' | 'sections'
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [expandedDivisions, setExpandedDivisions] = useState({ 0: true });
  const [expandedSections, setExpandedSections] = useState({ news: true });

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
      hero: { ...(prev.hero || {}), [field]: val },
    }));
  };

  const updateAbout = (field, val) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      about: { ...(prev.about || {}), [field]: val },
    }));
  };

  const updateSambutan = (field, val) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      sambutan: { ...(prev.sambutan || {}), [field]: val },
    }));
  };

  const updateClosing = (field, val) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      closing: { ...(prev.closing || {}), [field]: val },
    }));
  };

  const updateSection = (secName, field, val) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...(prev.sections || {}),
        [secName]: {
          ...(prev.sections?.[secName] || {}),
          [field]: val,
        },
      },
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

  const handleAddStat = () => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      stats: [...(prev.stats || []), { value: 10, suffix: '+', label: 'Statistik Baru' }],
    }));
  };

  const handleDeleteStat = (index) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      stats: (prev.stats || []).filter((_, i) => i !== index),
    }));
  };

  // Timeline handlers
  const handleAddTimeline = () => {
    setIsDirty(true);
    const newId = `tl-${Date.now()}`;
    const newMilestone = {
      id: newId,
      year: new Date().getFullYear().toString(),
      tag: 'FASE BARU',
      title: 'Judul Peristiwa',
      location: 'Kabupaten Banyumas',
      desc: 'Deskripsikan peristiwa atau pencapaian bersejarah pada tahun ini...',
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
    if (window.confirm('Yakin ingin menghapus peristiwa linimasa ini?')) {
      setIsDirty(true);
      setFormData((prev) => ({
        ...prev,
        timeline: (prev.timeline || []).filter((_, i) => i !== index),
      }));
    }
  };

  const handleMoveTimeline = (index, direction) => {
    setIsDirty(true);
    setFormData((prev) => {
      const list = [...(prev.timeline || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, timeline: list };
    });
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

  const toggleDivisionExpand = (idx) => {
    setExpandedDivisions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleSectionExpand = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveIndividualProgram = async (prog) => {
    setIsSaving(true);
    try {
      if (onSaveProgram) {
        await onSaveProgram(prog.id, prog);
      }
      await saveData('rokaba:programs', localPrograms);
      if (showToast) showToast(`Program "${prog.title || prog.name}" berhasil disimpan!`, 'success');
    } catch (err) {
      console.error('Error saving program:', err);
      if (showToast) showToast('Gagal menyimpan program.', 'error');
    } finally {
      setIsSaving(false);
    }
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

      await saveData('rokaba:home', formData);
      await saveData('rokaba:programs', localPrograms);
      setIsDirty(false);

      if (showToast) {
        showToast('Konten beranda berhasil disimpan ke Cloud & sinkron ke web publik!', 'success');
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

  const handleReset = () => {
    if (window.confirm('Batalkan seluruh perubahan yang belum disimpan dan kembalikan ke data tersimpan?')) {
      setFormData(homeContent || initialHomeContent);
      setLocalPrograms(programs && programs.length > 0 ? programs : defaultPrograms);
      setIsDirty(false);
      if (showToast) showToast('Perubahan dibatalkan.', 'info');
    }
  };

  const subSectionsList = [
    { id: 'hero', label: 'Hero & Headline', short: 'Hero' },
    { id: 'sambutan', label: 'Pimpinan & Ketua', short: 'Sambutan & tiga ketua' },
    { id: 'about', label: 'Tentang Kami', short: 'Tentang kami' },
    { id: 'programs', label: 'Divisi & Program', short: 'Divisi & program' },
    { id: 'timeline', label: 'Linimasa', short: 'Linimasa' },
    { id: 'stats', label: 'Statistik', short: 'Statistik' },
    { id: 'closing', label: 'Ajakan Bergabung', short: 'Ajakan bergabung' },
    { id: 'sections', label: 'Judul Bagian', short: 'Judul bagian' },
  ];

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', paddingBottom: '3.5rem' }}>
      {/* Header Bar matching Image 05 & 06 */}
      <div className="admin-home-header">
        <div className="admin-home-title-area">
          <h1>Kelola beranda</h1>
          {isDirty && (
            <span className="admin-unsaved-badge">
              <Clock size={13} />
              Perubahan belum disimpan
            </span>
          )}
        </div>

        <div className="admin-home-actions">
          <a
            href="https://www.rohis-banyumas.web.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary-soft"
          >
            <ExternalLink size={14} /> Lihat web
          </a>
          {isDirty && (
            <button
              type="button"
              className="btn btn-secondary-soft"
              onClick={handleReset}
              disabled={isSaving}
              style={{ color: '#EF4444' }}
            >
              <RotateCcw size={14} /> Batal
            </button>
          )}
          <button
            type="button"
            className="btn btn-pine"
            onClick={handleSaveAll}
            disabled={isSaving}
          >
            <Save size={15} />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan perubahan'}</span>
          </button>
        </div>
      </div>

      {/* Local Sub-Navigation matching Image 05 & 06 */}
      <div className="admin-section-nav-wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="admin-section-dropdown-label">Bagian beranda:</span>
          <select
            className="form-select-soft"
            style={{ minWidth: 200, padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            value={activeSubTab}
            onChange={(e) => setActiveSubTab(e.target.value)}
          >
            {subSectionsList.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.short}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-section-pills">
          {subSectionsList.map((sec) => (
            <button
              key={sec.id}
              type="button"
              className={`admin-section-pill ${activeSubTab === sec.id ? 'active' : ''}`}
              onClick={() => setActiveSubTab(sec.id)}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SUB-TAB 1: HERO & HEADLINE (Image 05 panel 1)
          ═══════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'hero' && (
        <div className="admin-soft-card">
          <div className="admin-editor-split">
            {/* Left Form Inputs */}
            <div>
              <div className="form-group-soft">
                <label className="form-label-soft">Tagline</label>
                <input
                  type="text"
                  className="form-input-soft"
                  value={formData.hero?.tag || ''}
                  onChange={(e) => updateHero('tag', e.target.value)}
                  placeholder="Forum Komunikasi ROHIS Kabupaten Banyumas"
                />
              </div>

              <div className="form-group-soft">
                <label className="form-label-soft">Judul baris 1</label>
                <input
                  type="text"
                  className="form-input-soft"
                  value={formData.hero?.titleLine1 || ''}
                  onChange={(e) => updateHero('titleLine1', e.target.value)}
                  placeholder="Satu ukhuwah."
                />
              </div>

              <div className="form-group-soft">
                <label className="form-label-soft">Judul baris 2</label>
                <input
                  type="text"
                  className="form-input-soft"
                  value={formData.hero?.titleLine2 || ''}
                  onChange={(e) => updateHero('titleLine2', e.target.value)}
                  placeholder="Banyak langkah kebaikan."
                />
              </div>

              <div className="form-group-soft">
                <label className="form-label-soft">Deskripsi</label>
                <textarea
                  rows={3}
                  className="form-textarea-soft"
                  value={formData.hero?.narrative || ''}
                  onChange={(e) => updateHero('narrative', e.target.value)}
                  placeholder="Ruang bertumbuh bagi pelajar Muslim untuk belajar, berkarya, dan memberi manfaat bersama."
                />
              </div>

              <div className="form-grid-2-soft">
                <div className="form-group-soft">
                  <label className="form-label-soft">Teks tombol</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={formData.hero?.btnPrimaryText || ''}
                    onChange={(e) => updateHero('btnPrimaryText', e.target.value)}
                    placeholder="Mengenal ROKABA"
                  />
                </div>
                <div className="form-group-soft">
                  <label className="form-label-soft">Tautan tombol</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={formData.hero?.btnPrimaryLink || ''}
                    onChange={(e) => updateHero('btnPrimaryLink', e.target.value)}
                    placeholder="/tentang"
                  />
                </div>
              </div>
            </div>

            {/* Right Photo Upload */}
            <div>
              <ImageUploadField
                label="Foto utama"
                value={formData.hero?.photoUrl || ''}
                onChange={(val) => updateHero('photoUrl', val)}
                placeholder="Pilih file foto atau tempel URL..."
                tip="Foto landscape utama beranda (dokumentasi kegiatan ROKABA)."
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SUB-TAB 2: SAMBUTAN & TIGA KETUA (Image 05 panel 2)
          ═══════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'sambutan' && (
        <div className="admin-soft-card">
          <div className="admin-editor-split">
            {/* Left Column: Teks Sambutan */}
            <div>
              <div className="form-group-soft">
                <label className="form-label-soft">Judul sambutan</label>
                <input
                  type="text"
                  className="form-input-soft"
                  value={formData.sambutan?.titleLine1 || formData.sambutan?.title || ''}
                  onChange={(e) => updateSambutan('titleLine1', e.target.value)}
                  placeholder="Sambutan pimpinan ROHIS Banyumas"
                />
              </div>

              <div className="form-group-soft">
                <label className="form-label-soft">Isi sambutan (Paragraf 1)</label>
                <textarea
                  rows={4}
                  className="form-textarea-soft"
                  value={formData.sambutan?.paragraph1 || ''}
                  onChange={(e) => updateSambutan('paragraph1', e.target.value)}
                  placeholder="Alhamdulillah, ROKABA hadir sebagai ruang kolaborasi ROHIS SMA, SMK, dan MA di Kabupaten Banyumas..."
                />
              </div>

              <div className="form-group-soft">
                <label className="form-label-soft">Isi sambutan (Paragraf 2 - Harapan & Ajakan)</label>
                <textarea
                  rows={4}
                  className="form-textarea-soft"
                  value={formData.sambutan?.paragraph2 || ''}
                  onChange={(e) => updateSambutan('paragraph2', e.target.value)}
                  placeholder="Mari bersama memperkuat ukhuwah, menebar manfaat, dan menghadirkan kebaikan di lingkungan sekolah dan masyarakat."
                />
              </div>
            </div>

            {/* Right Column: Foto dan Nama Tiga Ketua */}
            <div>
              <label className="form-label-soft" style={{ marginBottom: '0.85rem' }}>
                Foto dan nama tiga ketua
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* 1. Ketua Umum */}
                <div style={{
                  background: 'var(--surface-bg)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  boxShadow: 'var(--soft-shadow-sm)',
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--pine-dark)', marginBottom: '0.65rem' }}>
                    Ketua Umum
                  </div>
                  <ImageUploadField
                    label="Foto Ketua Umum"
                    value={formData.sambutan?.ketuaUmumPhoto || ''}
                    onChange={(val) => updateSambutan('ketuaUmumPhoto', val)}
                    placeholder="Link / upload foto Ketua Umum..."
                  />
                  <div className="form-group-soft" style={{ marginTop: '0.65rem', marginBottom: 0 }}>
                    <label className="form-label-soft" style={{ fontSize: '0.78rem' }}>Nama Ketua Umum</label>
                    <input
                      type="text"
                      className="form-input-soft"
                      value={formData.sambutan?.ketuaUmumName || ''}
                      onChange={(e) => updateSambutan('ketuaUmumName', e.target.value)}
                      placeholder="Ketua Umum ROKABA"
                    />
                  </div>
                </div>

                {/* 2. Ketua Akhwat */}
                <div style={{
                  background: 'var(--surface-bg)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  boxShadow: 'var(--soft-shadow-sm)',
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--pine-dark)', marginBottom: '0.65rem' }}>
                    Ketua Akhwat
                  </div>
                  <ImageUploadField
                    label="Foto Ketua Akhwat"
                    value={formData.sambutan?.ketuaAkhwatPhoto || ''}
                    onChange={(val) => updateSambutan('ketuaAkhwatPhoto', val)}
                    placeholder="Link / upload foto Ketua Akhwat..."
                  />
                  <div className="form-group-soft" style={{ marginTop: '0.65rem', marginBottom: 0 }}>
                    <label className="form-label-soft" style={{ fontSize: '0.78rem' }}>Nama Ketua Akhwat</label>
                    <input
                      type="text"
                      className="form-input-soft"
                      value={formData.sambutan?.ketuaAkhwatName || ''}
                      onChange={(e) => updateSambutan('ketuaAkhwatName', e.target.value)}
                      placeholder="Ketua Akhwat ROKABA"
                    />
                  </div>
                </div>

                {/* 3. Ketua Ikhwan */}
                <div style={{
                  background: 'var(--surface-bg)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  boxShadow: 'var(--soft-shadow-sm)',
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--pine-dark)', marginBottom: '0.65rem' }}>
                    Ketua Ikhwan
                  </div>
                  <ImageUploadField
                    label="Foto Ketua Ikhwan"
                    value={formData.sambutan?.ketuaIkhwanPhoto || ''}
                    onChange={(val) => updateSambutan('ketuaIkhwanPhoto', val)}
                    placeholder="Link / upload foto Ketua Ikhwan..."
                  />
                  <div className="form-group-soft" style={{ marginTop: '0.65rem', marginBottom: 0 }}>
                    <label className="form-label-soft" style={{ fontSize: '0.78rem' }}>Nama Ketua Ikhwan</label>
                    <input
                      type="text"
                      className="form-input-soft"
                      value={formData.sambutan?.ketuaIkhwanName || ''}
                      onChange={(e) => updateSambutan('ketuaIkhwanName', e.target.value)}
                      placeholder="Ketua Ikhwan ROKABA"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SUB-TAB 3: TENTANG KAMI (Image 05 panel 3)
          ═══════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'about' && (
        <div className="admin-soft-card">
          <div className="admin-editor-split">
            {/* Left Inputs */}
            <div>
              <div className="form-group-soft">
                <label className="form-label-soft">Judul bagian</label>
                <input
                  type="text"
                  className="form-input-soft"
                  value={formData.about?.title || ''}
                  onChange={(e) => updateAbout('title', e.target.value)}
                  placeholder="Tentang ROKABA"
                />
              </div>

              <div className="form-group-soft">
                <label className="form-label-soft">Pengantar</label>
                <textarea
                  rows={2}
                  className="form-textarea-soft"
                  value={formData.about?.lead || ''}
                  onChange={(e) => updateAbout('lead', e.target.value)}
                  placeholder="Forum Komunikasi ROHIS Kabupaten Banyumas (ROKABA) adalah wadah kolaborasi ROHIS di tingkat SMA, SMK, dan MA se-Kabupaten Banyumas."
                />
              </div>

              <div className="form-group-soft">
                <label className="form-label-soft">Paragraf profil</label>
                <textarea
                  rows={4}
                  className="form-textarea-soft"
                  value={formData.about?.paragraph1 || ''}
                  onChange={(e) => updateAbout('paragraph1', e.target.value)}
                  placeholder="ROKABA berkomitmen menjadi ruang silaturahmi, berbagi inspirasi, menguatkan kapasitas pelajar Muslim, serta mendorong lahirnya program-program kebaikan yang berdampak di sekolah dan masyarakat."
                />
              </div>

              <div className="form-grid-2-soft">
                <div className="form-group-soft">
                  <label className="form-label-soft">Nilai pertama</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={formData.about?.point1Title || ''}
                    onChange={(e) => updateAbout('point1Title', e.target.value)}
                    placeholder="Kolaborasi"
                  />
                </div>
                <div className="form-group-soft">
                  <label className="form-label-soft">Nilai kedua</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={formData.about?.point2Title || ''}
                    onChange={(e) => updateAbout('point2Title', e.target.value)}
                    placeholder="Kepedulian"
                  />
                </div>
              </div>
            </div>

            {/* Right Photo */}
            <div>
              <ImageUploadField
                label="Foto dokumentasi"
                value={formData.about?.photoUrl || ''}
                onChange={(val) => updateAbout('photoUrl', val)}
                placeholder="Pilih file foto atau tempel URL..."
                tip="Foto dokumentasi pembinaan santri/pelajar dan kebersamaan."
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SUB-TAB 4: DIVISI & PROGRAM (Image 05 panel 4)
          ═══════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'programs' && (
        <div className="admin-soft-card">
          <p className="text-secondary" style={{ fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            Kelola nama program dan deskripsi program kerja untuk 5 divisi resmi ROKABA.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {localPrograms.map((prog, pIdx) => {
              const isExpanded = !!expandedDivisions[pIdx];
              return (
                <div key={prog.id || pIdx} className="admin-accordion-card">
                  <div
                    className="admin-accordion-header"
                    onClick={() => toggleDivisionExpand(pIdx)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      <h3>{prog.division || prog.title || `Divisi ${pIdx + 1}`}</h3>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {(prog.details || []).length} Butir Agenda
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="admin-accordion-body">
                      <div className="form-group-soft">
                        <label className="form-label-soft">Nama program</label>
                        <input
                          type="text"
                          className="form-input-soft"
                          value={prog.title || ''}
                          onChange={(e) => updateProgramField(pIdx, 'title', e.target.value)}
                          placeholder="SDM (Sumber Daya Manusia)"
                        />
                      </div>

                      <div className="form-group-soft">
                        <label className="form-label-soft">Deskripsi program</label>
                        <textarea
                          rows={3}
                          className="form-textarea-soft"
                          value={prog.description || ''}
                          onChange={(e) => updateProgramField(pIdx, 'description', e.target.value)}
                          placeholder="Program pengembangan kapasitas dan pembinaan kader ROHIS di Kabupaten Banyumas."
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button
                          type="button"
                          className="btn btn-pine"
                          style={{ padding: '0.45rem 1.25rem' }}
                          onClick={() => handleSaveIndividualProgram(prog)}
                          disabled={isSaving}
                        >
                          Simpan program
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SUB-TAB 5: LINIMASA ORGANISASI (Image 06 panel 1)
          ═══════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'timeline' && (
        <div className="admin-soft-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
                Linimasa organisasi
              </h2>
              <p className="text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Kelola urutan peristiwa penting perjalanan organisasi di ROKABA.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-pine"
              onClick={handleAddTimeline}
            >
              <Plus size={15} /> Tambah peristiwa
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(formData.timeline || []).map((item, index) => (
              <div key={item.id || index} className="admin-timeline-item-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div style={{ color: 'var(--text-muted)', paddingTop: '0.5rem', cursor: 'grab' }}>
                    <GripVertical size={20} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
                      <div className="form-group-soft" style={{ marginBottom: 0 }}>
                        <label className="form-label-soft">Tahun</label>
                        <input
                          type="text"
                          className="form-input-soft"
                          value={item.year || ''}
                          onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                          placeholder="Tahun"
                        />
                      </div>
                      <div className="form-group-soft" style={{ marginBottom: 0 }}>
                        <label className="form-label-soft">Judul</label>
                        <input
                          type="text"
                          className="form-input-soft"
                          value={item.title || ''}
                          onChange={(e) => updateTimelineItem(index, 'title', e.target.value)}
                          placeholder="Judul peristiwa"
                        />
                      </div>
                      <div className="form-group-soft" style={{ marginBottom: 0 }}>
                        <label className="form-label-soft">Lokasi</label>
                        <input
                          type="text"
                          className="form-input-soft"
                          value={item.location || ''}
                          onChange={(e) => updateTimelineItem(index, 'location', e.target.value)}
                          placeholder="Lokasi kegiatan"
                        />
                      </div>
                    </div>

                    <div className="form-group-soft" style={{ marginBottom: '0.85rem' }}>
                      <label className="form-label-soft">Deskripsi</label>
                      <textarea
                        rows={2}
                        className="form-textarea-soft"
                        value={item.desc || ''}
                        onChange={(e) => updateTimelineItem(index, 'desc', e.target.value)}
                        placeholder="Deskripsikan peristiwa ini secara singkat."
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.85rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary-soft"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => handleMoveTimeline(index, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp size={13} /> Pindah naik
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary-soft"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => handleMoveTimeline(index, 'down')}
                        disabled={index === (formData.timeline?.length || 0) - 1}
                      >
                        <ArrowDown size={13} /> Pindah turun
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary-soft"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#EF4444' }}
                        onClick={() => handleDeleteTimeline(index)}
                      >
                        <Trash2 size={13} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SUB-TAB 6: STATISTIK BERANDA (Image 06 panel 2)
          ═══════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'stats' && (
        <div className="admin-soft-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
                Statistik beranda
              </h2>
              <p className="text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Kelola daftar statistik ringkas yang ditampilkan di beranda.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-pine"
              onClick={handleAddStat}
            >
              <Plus size={15} /> Tambah statistik
            </button>
          </div>

          <div className="admin-desktop-table data-table-container-soft">
            <table className="data-table-soft">
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th style={{ width: '22%' }}>Nilai</th>
                  <th style={{ width: '22%' }}>Sufiks</th>
                  <th>Label</th>
                  <th style={{ width: 90, textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(formData.stats || []).map((stat, sIdx) => (
                  <tr key={sIdx}>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      <GripVertical size={16} />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input-soft"
                        style={{ width: '100%' }}
                        value={stat.value ?? ''}
                        onChange={(e) => updateStat(sIdx, 'value', Number(e.target.value))}
                        placeholder="Jumlah"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input-soft"
                        style={{ width: '100%' }}
                        value={stat.suffix || ''}
                        onChange={(e) => updateStat(sIdx, 'suffix', e.target.value)}
                        placeholder="Contoh: +"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input-soft"
                        style={{ width: '100%' }}
                        value={stat.label || ''}
                        onChange={(e) => updateStat(sIdx, 'label', e.target.value)}
                        placeholder="Label statistik"
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-secondary-soft"
                        style={{ color: '#EF4444', padding: '0.35rem 0.65rem' }}
                        onClick={() => handleDeleteStat(sIdx)}
                        title="Hapus baris statistik"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SUB-TAB 7: AJAKAN BERGABUNG (Image 06 panel 3)
          ═══════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'closing' && (
        <div className="admin-soft-card">
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
              Ajakan bergabung
            </h2>
            <p className="text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Atur teks dan tautan ajakan untuk bergabung di beranda.
            </p>
          </div>

          <div className="admin-editor-split">
            {/* Left Form */}
            <div>
              <div className="form-group-soft">
                <label className="form-label-soft">Judul</label>
                <input
                  type="text"
                  className="form-input-soft"
                  value={formData.closing?.headline || ''}
                  onChange={(e) => updateClosing('headline', e.target.value)}
                  placeholder="Judul ajakan bergabung"
                />
              </div>

              <div className="form-group-soft">
                <label className="form-label-soft">Deskripsi</label>
                <textarea
                  rows={3}
                  className="form-textarea-soft"
                  value={formData.closing?.lead || ''}
                  onChange={(e) => updateClosing('lead', e.target.value)}
                  placeholder="Deskripsi singkat ajakan bergabung."
                />
              </div>

              <div className="form-grid-2-soft">
                <div className="form-group-soft">
                  <label className="form-label-soft">Teks tombol utama</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={formData.closing?.btnPrimaryText || ''}
                    onChange={(e) => updateClosing('btnPrimaryText', e.target.value)}
                    placeholder="Contoh: Gabung Sekarang"
                  />
                </div>
                <div className="form-group-soft">
                  <label className="form-label-soft">Tautan utama</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={formData.closing?.btnPrimaryLink || ''}
                    onChange={(e) => updateClosing('btnPrimaryLink', e.target.value)}
                    placeholder="https://"
                  />
                </div>
              </div>

              <div className="form-grid-2-soft">
                <div className="form-group-soft">
                  <label className="form-label-soft">Teks tombol kedua</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={formData.closing?.btnSecondaryText || ''}
                    onChange={(e) => updateClosing('btnSecondaryText', e.target.value)}
                    placeholder="Contoh: Pelajari Lebih Lanjut"
                  />
                </div>
                <div className="form-group-soft">
                  <label className="form-label-soft">Tautan kedua</label>
                  <input
                    type="text"
                    className="form-input-soft"
                    value={formData.closing?.btnSecondaryLink || ''}
                    onChange={(e) => updateClosing('btnSecondaryLink', e.target.value)}
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>

            {/* Right: Contoh Tampilan Preview */}
            <div>
              <label className="form-label-soft" style={{ marginBottom: '0.85rem' }}>
                Contoh tampilan
              </label>

              <div className="admin-join-preview-card">
                <h3 style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--pine-dark)',
                  lineHeight: 1.25,
                  marginBottom: '0.65rem',
                }}>
                  {formData.closing?.headline || 'Ayo bergabung bersama ROKABA'}
                </h3>
                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: '1.5rem',
                  maxWidth: 320,
                }}>
                  {formData.closing?.lead || 'Menjadi bagian dari gerakan kebaikan pelajar Muslim di Banyumas.'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%', maxWidth: 260 }}>
                  <button
                    type="button"
                    className="btn btn-pine"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {formData.closing?.btnPrimaryText || 'Gabung Sekarang'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary-soft"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {formData.closing?.btnSecondaryText || 'Pelajari Lebih Lanjut'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SUB-TAB 8: JUDUL DAN DESKRIPSI BAGIAN (Image 06 panel 4)
          ═══════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'sections' && (
        <div className="admin-soft-card">
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pine-dark)', margin: 0 }}>
              Judul dan deskripsi bagian
            </h2>
            <p className="text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Atur judul, deskripsi, dan teks tautan untuk beberapa bagian di beranda.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* 1. Berita */}
            <div className="admin-accordion-card">
              <div
                className="admin-accordion-header"
                onClick={() => toggleSectionExpand('news')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {expandedSections.news ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  <Newspaper size={17} color="var(--pine-dark)" />
                  <h3>Berita</h3>
                </div>
              </div>

              {expandedSections.news && (
                <div className="admin-accordion-body">
                  <div className="form-grid-2-soft">
                    <div className="form-group-soft">
                      <label className="form-label-soft">Label</label>
                      <input
                        type="text"
                        className="form-input-soft"
                        value={formData.sections?.news?.tag || ''}
                        onChange={(e) => updateSection('news', 'tag', e.target.value)}
                        placeholder="Contoh: Kabar dari ROKABA"
                      />
                    </div>
                    <div className="form-group-soft">
                      <label className="form-label-soft">Judul</label>
                      <input
                        type="text"
                        className="form-input-soft"
                        value={formData.sections?.news?.title || ''}
                        onChange={(e) => updateSection('news', 'title', e.target.value)}
                        placeholder="Contoh: Berita Terkini"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2-soft">
                    <div className="form-group-soft">
                      <label className="form-label-soft">Deskripsi</label>
                      <textarea
                        rows={2}
                        className="form-textarea-soft"
                        value={formData.sections?.news?.desc || ''}
                        onChange={(e) => updateSection('news', 'desc', e.target.value)}
                        placeholder="Deskripsi singkat bagian berita."
                      />
                    </div>
                    <div className="form-group-soft">
                      <label className="form-label-soft">Teks tautan</label>
                      <input
                        type="text"
                        className="form-input-soft"
                        value={formData.sections?.news?.btnText || ''}
                        onChange={(e) => updateSection('news', 'btnText', e.target.value)}
                        placeholder="Contoh: Lihat Semua"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Artikel */}
            <div className="admin-accordion-card">
              <div
                className="admin-accordion-header"
                onClick={() => toggleSectionExpand('articles')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {expandedSections.articles ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  <FileText size={17} color="var(--pine-dark)" />
                  <h3>Artikel</h3>
                </div>
              </div>

              {expandedSections.articles && (
                <div className="admin-accordion-body">
                  <div className="form-grid-2-soft">
                    <div className="form-group-soft">
                      <label className="form-label-soft">Label</label>
                      <input
                        type="text"
                        className="form-input-soft"
                        value={formData.sections?.articles?.tag || ''}
                        onChange={(e) => updateSection('articles', 'tag', e.target.value)}
                        placeholder="Contoh: Opini & Inspirasi"
                      />
                    </div>
                    <div className="form-group-soft">
                      <label className="form-label-soft">Judul</label>
                      <input
                        type="text"
                        className="form-input-soft"
                        value={formData.sections?.articles?.title || ''}
                        onChange={(e) => updateSection('articles', 'title', e.target.value)}
                        placeholder="Contoh: Artikel Dakwah & Pendidikan"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2-soft">
                    <div className="form-group-soft">
                      <label className="form-label-soft">Deskripsi</label>
                      <textarea
                        rows={2}
                        className="form-textarea-soft"
                        value={formData.sections?.articles?.desc || ''}
                        onChange={(e) => updateSection('articles', 'desc', e.target.value)}
                        placeholder="Deskripsi singkat bagian artikel."
                      />
                    </div>
                    <div className="form-group-soft">
                      <label className="form-label-soft">Teks tautan</label>
                      <input
                        type="text"
                        className="form-input-soft"
                        value={formData.sections?.articles?.btnText || ''}
                        onChange={(e) => updateSection('articles', 'btnText', e.target.value)}
                        placeholder="Contoh: Baca Artikel Lainnya"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Agenda */}
            <div className="admin-accordion-card">
              <div
                className="admin-accordion-header"
                onClick={() => toggleSectionExpand('agenda')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {expandedSections.agenda ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  <Clock size={17} color="var(--pine-dark)" />
                  <h3>Agenda</h3>
                </div>
              </div>

              {expandedSections.agenda && (
                <div className="admin-accordion-body">
                  <div className="form-grid-2-soft">
                    <div className="form-group-soft">
                      <label className="form-label-soft">Label</label>
                      <input
                        type="text"
                        className="form-input-soft"
                        value={formData.sections?.events?.tag || ''}
                        onChange={(e) => updateSection('events', 'tag', e.target.value)}
                        placeholder="Contoh: Jadwal Kegiatan"
                      />
                    </div>
                    <div className="form-group-soft">
                      <label className="form-label-soft">Judul</label>
                      <input
                        type="text"
                        className="form-input-soft"
                        value={formData.sections?.events?.title || ''}
                        onChange={(e) => updateSection('events', 'title', e.target.value)}
                        placeholder="Contoh: Agenda & Kajian Pelajar"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2-soft">
                    <div className="form-group-soft">
                      <label className="form-label-soft">Deskripsi</label>
                      <textarea
                        rows={2}
                        className="form-textarea-soft"
                        value={formData.sections?.events?.desc || ''}
                        onChange={(e) => updateSection('events', 'desc', e.target.value)}
                        placeholder="Deskripsi singkat bagian agenda."
                      />
                    </div>
                    <div className="form-group-soft">
                      <label className="form-label-soft">Teks tautan</label>
                      <input
                        type="text"
                        className="form-input-soft"
                        value={formData.sections?.events?.btnText || ''}
                        onChange={(e) => updateSection('events', 'btnText', e.target.value)}
                        placeholder="Contoh: Lihat Semua Agenda"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Layanan */}
            <div className="admin-accordion-card">
              <div
                className="admin-accordion-header"
                onClick={() => toggleSectionExpand('services')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {expandedSections.services ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  <Sparkles size={17} color="var(--pine-dark)" />
                  <h3>Layanan</h3>
                </div>
              </div>

              {expandedSections.services && (
                <div className="admin-accordion-body">
                  <div className="form-grid-2-soft">
                    <div className="form-group-soft">
                      <label className="form-label-soft">Judul</label>
                      <input
                        type="text"
                        className="form-input-soft"
                        value={formData.sections?.services?.title || ''}
                        onChange={(e) => updateSection('services', 'title', e.target.value)}
                        placeholder="Layanan & Program Unggulan Kami"
                      />
                    </div>
                    <div className="form-group-soft">
                      <label className="form-label-soft">Deskripsi</label>
                      <textarea
                        rows={2}
                        className="form-textarea-soft"
                        value={formData.sections?.services?.desc || ''}
                        onChange={(e) => updateSection('services', 'desc', e.target.value)}
                        placeholder="ROKABA hadir sebagai wadah sinergi dan kolaborasi bagi seluruh Rohis sekolah di Banyumas."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
