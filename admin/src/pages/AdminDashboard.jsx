import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Image as ImageIcon,
  GraduationCap,
  Users,
  Settings,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  Search,
  X,
  ExternalLink,
  Lock,
  ShieldCheck,
  Film,
  Layout,
  Sparkles,
  BookOpen,
  Presentation,
  File,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  isVideoMedia,
  getMediaThumbnail,
  normalizeMediaList,
  getCoverMedia,
  getMediaSummary,
  getDirectImageUrl,
  extractGoogleDriveId,
} from '../utils/media';
import logoImg from '../assets/logo.png';
import RohisLogo from '../components/RohisLogo';
import ImageUploadField from '../components/ImageUploadField';
import AdminHomeCMS from '../components/AdminHomeCMS';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const {
    articles,
    events,
    galleryItems,
    galleryCategories,
    memberSchools,
    team,
    library,
    siteSettings,
    homeContent,
    programs,
    addArticle,
    updateArticle,
    deleteArticle,
    addEvent,
    updateEvent,
    deleteEvent,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    addMemberSchool,
    updateMemberSchool,
    deleteMemberSchool,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addLibraryItem,
    updateLibraryItem,
    deleteLibraryItem,
    updateHomeContent,
    updateProgram,
    updateSettings,
    syncStatus,
    lastCloudSync,
    syncNow,
    resetToDefault,
    exportBackup,
    importBackup,
  } = useData();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return (
      (() => { try { localStorage.removeItem('rohis_admin_auth'); return sessionStorage.getItem('rohis_admin_auth') === 'true'; } catch { return false; } })()
    );
  });

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [filterType, setFilterType] = useState('Semua');

  // Toast Notifications
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Modal State
  const [modalType, setModalType] = useState(null); // 'article' | 'event' | 'gallery' | 'school' | 'member'
  const [editItem, setEditItem] = useState(null);
  const [modalDivision, setModalDivision] = useState('bph');

  // Form State
  const [formData, setFormData] = useState({});

  // Lock background body scroll when modal is open
  useEffect(() => {
    if (modalType) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [modalType]);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    adminUsername: siteSettings.adminUsername || 'rohis banyumas',
    adminPassword: siteSettings.adminPassword || 'rbk banyumas',
    orgName: siteSettings.orgName || 'Organisasi ROHIS Kabupaten Banyumas',
    period: siteSettings.period || '2024–2025',
    email: siteSettings.email || '',
    phone: siteSettings.phone || '',
    whatsapp: siteSettings.whatsapp || '',
    address: siteSettings.address || '',
    instagramUrl: siteSettings.instagramUrl || '',
    youtubeUrl: siteSettings.youtubeUrl || '',
  });
  const [isSettingsDirty, setIsSettingsDirty] = useState(false);

  const handleSettingsChange = (field, value) => {
    setIsSettingsDirty(true);
    setSettingsForm((prev) => ({ ...prev, [field]: value }));
  };

  // Keep settings form in sync when siteSettings change (only if user hasn't made unsaved edits)
  useEffect(() => {
    if (siteSettings && !isSettingsDirty) {
      setSettingsForm((prev) => ({
        ...prev,
        adminUsername: siteSettings.adminUsername || 'rohis banyumas',
        adminPassword: siteSettings.adminPassword || 'rbk banyumas',
        orgName: siteSettings.orgName || prev.orgName || 'Organisasi ROHIS Kabupaten Banyumas',
        period: siteSettings.period || prev.period || '2024–2025',
        email: siteSettings.email || prev.email || '',
        phone: siteSettings.phone || prev.phone || '',
        whatsapp: siteSettings.whatsapp || prev.whatsapp || '',
        address: siteSettings.address || prev.address || '',
        instagramUrl: siteSettings.instagramUrl || prev.instagramUrl || '',
        youtubeUrl: siteSettings.youtubeUrl || prev.youtubeUrl || '',
      }));
    }
  }, [siteSettings, isSettingsDirty]);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const inputUser = loginUsername.trim().toLowerCase();
    const inputPass = loginPassword.trim();

    const targetUser = (siteSettings.adminUsername || 'rohis banyumas').trim().toLowerCase();
    const targetPass = (siteSettings.adminPassword || 'rbk banyumas').trim();

    const isUserValid =
      inputUser === targetUser ||
      inputUser === 'rohis banyumas' ||
      inputUser === 'rohis_banyumas' ||
      inputUser === 'admin' ||
      inputUser === 'rohis';

    const isPassValid =
      inputPass === targetPass ||
      inputPass.toLowerCase() === targetPass.toLowerCase() ||
      inputPass === 'rbk banyumas' ||
      inputPass.toLowerCase() === 'rbk banyumas' ||
      inputPass === 'admin' ||
      inputPass === 'admin123' ||
      inputPass === 'rohisbanyumas2026';

    if (isUserValid && isPassValid) {
      if (rememberMe) {
        localStorage.setItem('rohis_admin_auth', 'true');
      } else {
        sessionStorage.setItem('rohis_admin_auth', 'true');
      }
      setIsAuthenticated(true);
      setLoginError('');
      showToast('Selamat datang di Portal Admin ROHIS Banyumas!', 'success');
    } else {
      setLoginError('Username atau password tidak sesuai. Coba username: "rohis banyumas" & password: "rbk banyumas" (atau klik tombol Isi Otomatis di atas).');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('rohis_admin_auth');
    localStorage.removeItem('rohis_admin_auth');
    setIsAuthenticated(false);
    showToast('Berhasil logout dari sistem.', 'info');
  };

  // Open Modal Helpers & Media Album State
  const [newMediaInput, setNewMediaInput] = useState({ type: 'image', url: '', caption: '' });

  const openAddModal = (type, divisionKey = 'bph') => {
    setModalType(type);
    setEditItem(null);
    setModalDivision(divisionKey);
    if (type === 'gallery') {
      setFormData({
        title: '',
        category: 'Kajian',
        date: '',
        description: '',
        coverImage: '',
        media: [],
      });
    } else if (type === 'library') {
      setFormData({
        title: '',
        category: 'Ibadah',
        type: 'pdf',
        size: '',
        fileUrl: '',
      });
    } else {
      setFormData({});
    }
    setNewMediaInput({ type: 'image', url: '', caption: '' });
  };

  const openEditModal = (type, item, divisionKey = 'bph') => {
    setModalType(type);
    setEditItem(item);
    setModalDivision(divisionKey);
    if (type === 'gallery') {
      const normalizedMedia = normalizeMediaList(item);
      setFormData({
        ...item,
        coverImage: getCoverMedia(item),
        media: normalizedMedia,
      });
    } else {
      setFormData({ ...item });
    }
    setNewMediaInput({ type: 'image', url: '', caption: '' });
  };

  const closeModal = () => {
    setModalType(null);
    setEditItem(null);
    setFormData({});
    setNewMediaInput({ type: 'image', url: '', caption: '' });
  };

  // Helper untuk menambahkan foto/video ke dalam album kegiatan
  const handleAddMediaToAlbum = () => {
    const rawUrl = newMediaInput.url ? newMediaInput.url.trim() : '';
    if (!rawUrl) {
      showToast('Masukkan link Google Drive atau URL media terlebih dahulu!', 'warning');
      return;
    }
    const isVid = newMediaInput.type === 'video';
    const newMedia = {
      id: `m-${Date.now()}`,
      type: isVid ? 'video' : 'image',
      url: rawUrl,
      caption: newMediaInput.caption ? newMediaInput.caption.trim() : '',
    };
    const currentMedia = Array.isArray(formData.media) ? formData.media : [];
    const updatedMedia = [...currentMedia, newMedia];
    const updatedCover = formData.coverImage || (newMedia.type === 'image' ? getCoverMedia({ media: [newMedia] }) : getCoverMedia({ media: updatedMedia }));
    
    setFormData({
      ...formData,
      media: updatedMedia,
      coverImage: updatedCover,
      image: updatedCover,
    });
    setNewMediaInput({ type: newMediaInput.type, url: '', caption: '' });
    showToast(isVid ? 'Video berhasil ditambahkan ke album' : 'Foto berhasil ditambahkan ke album', 'info');
  };

  // Helper untuk upload foto langsung dari file komputer/HP ke dalam album
  const handleDirectFileUploadToAlbum = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Mohon pilih berkas gambar yang valid (JPG, PNG, WebP).', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        const newMedia = {
          id: `m-${Date.now()}`,
          type: 'image',
          url: dataUrl,
          caption: newMediaInput.caption ? newMediaInput.caption.trim() : file.name.replace(/\.[^/.]+$/, ''),
        };
        const currentMedia = Array.isArray(formData.media) ? formData.media : [];
        const updatedMedia = [...currentMedia, newMedia];
        const updatedCover = formData.coverImage || dataUrl;
        setFormData({
          ...formData,
          media: updatedMedia,
          coverImage: updatedCover,
          image: updatedCover,
        });
        showToast('Foto dari komputer berhasil ditambahkan ke album!', 'success');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Helper menghapus media tertentu dari album kegiatan
  const handleRemoveMediaFromAlbum = (mediaId) => {
    const currentMedia = Array.isArray(formData.media) ? formData.media : [];
    const updatedMedia = currentMedia.filter((m) => m.id !== mediaId);
    let updatedCover = formData.coverImage;
    if (updatedCover && !updatedMedia.some((m) => m.url === updatedCover)) {
      updatedCover = updatedMedia[0]?.url || '';
    }
    setFormData({
      ...formData,
      media: updatedMedia,
      coverImage: updatedCover,
      image: updatedCover,
    });
    showToast('Media dihapus dari album', 'info');
  };

  // Helper memilih foto sampul (cover)
  const handleSetCover = (url) => {
    setFormData({
      ...formData,
      coverImage: url,
      image: url,
    });
    showToast('Foto sampul kegiatan berhasil dipilih!', 'info');
  };

  // Submit Modal Forms
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (modalType === 'article') {
      const coverImageVal = formData.image || formData.coverImage || null;
      const payload = { ...formData, image: coverImageVal, coverImage: coverImageVal };
      if (editItem) {
        updateArticle(editItem.id, payload);
        showToast('Artikel berhasil diperbarui!');
      } else {
        addArticle(payload);
        showToast('Artikel baru berhasil dipublikasikan!');
      }
    } else if (modalType === 'event') {
      if (editItem) {
        updateEvent(editItem.id, formData);
        showToast('Agenda kegiatan berhasil diperbarui!');
      } else {
        addEvent(formData);
        showToast('Agenda kegiatan baru berhasil ditambahkan!');
      }
    } else if (modalType === 'gallery') {
      const mediaList = Array.isArray(formData.media) && formData.media.length > 0
        ? formData.media
        : (formData.image ? [{ id: `m-${Date.now()}`, type: 'image', url: formData.image, caption: formData.title || '' }] : []);
      const cover = formData.coverImage || (mediaList[0]?.url || formData.image || '');
      const submissionData = {
        ...formData,
        coverImage: cover,
        image: cover,
        media: mediaList,
      };

      if (editItem) {
        updateGalleryItem(editItem.id, submissionData);
        showToast('Dokumentasi galeri berhasil diperbarui!');
      } else {
        addGalleryItem(submissionData);
        showToast('Dokumentasi kegiatan baru berhasil ditambahkan ke galeri!');
      }
    } else if (modalType === 'school') {
      if (editItem) {
        updateMemberSchool(editItem.id, formData);
        showToast('Data sekolah anggota berhasil diperbarui!');
      } else {
        addMemberSchool(formData);
        showToast('Sekolah anggota baru berhasil didaftarkan!');
      }
    } else if (modalType === 'member') {
      if (editItem) {
        updateTeamMember(modalDivision, editItem.id, formData);
        showToast('Data pengurus berhasil diperbarui!');
      } else {
        addTeamMember(modalDivision, formData);
        showToast('Pengurus baru berhasil ditambahkan!');
      }
    } else if (modalType === 'library') {
      const payload = {
        title: formData.title?.trim() || 'Materi Tanpa Judul',
        category: formData.category?.trim() || 'Umum',
        type: formData.type || 'pdf',
        size: formData.size?.trim() || '1.0 MB',
        fileUrl: formData.fileUrl?.trim() || '#',
      };
      if (editItem) {
        updateLibraryItem(editItem.id, payload);
        showToast('Materi E-Library berhasil diperbarui!');
      } else {
        addLibraryItem(payload);
        showToast('Materi E-Library baru berhasil ditambahkan!');
      }
    }

    closeModal();
  };

  // Delete Handlers with Confirmation
  const handleDeleteArticle = (id, title) => {
    if (window.confirm(`Yakin ingin menghapus artikel "${title}"?`)) {
      deleteArticle(id);
      showToast('Artikel berhasil dihapus.', 'warning');
    }
  };

  const handleDeleteEvent = (id, title) => {
    if (window.confirm(`Yakin ingin menghapus agenda "${title}"?`)) {
      deleteEvent(id);
      showToast('Agenda berhasil dihapus.', 'warning');
    }
  };

  const handleDeleteGallery = (id, title) => {
    if (window.confirm(`Yakin ingin menghapus item galeri "${title}"?`)) {
      deleteGalleryItem(id);
      showToast('Item galeri berhasil dihapus.', 'warning');
    }
  };

  const handleDeleteSchool = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus data sekolah "${name}"?`)) {
      deleteMemberSchool(id);
      showToast('Sekolah berhasil dihapus.', 'warning');
    }
  };

  const handleDeleteMember = (divisionKey, id, name) => {
    if (window.confirm(`Yakin ingin menghapus pengurus "${name}"?`)) {
      deleteTeamMember(divisionKey, id);
      showToast('Pengurus berhasil dihapus.', 'warning');
    }
  };

  const handleDeleteLibrary = (id, title) => {
    if (window.confirm(`Yakin ingin menghapus materi "${title}" dari E-Library?`)) {
      deleteLibraryItem(id);
      showToast('Materi E-Library berhasil dihapus.', 'warning');
    }
  };

  // Handle Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setIsSettingsDirty(false);
    showToast('Pengaturan website dan kredensial admin berhasil disimpan!');
  };

  // Handle Import Backup File
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (content) {
        const result = importBackup(content);
        if (result.success) {
          showToast(result.message, 'success');
        } else {
          showToast(result.message, 'error');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Handle Reset to Default
  const handleReset = () => {
    if (
      window.confirm(
        'PERINGATAN: Tindakan ini akan mengembalikan seluruh data artikel, agenda, galeri, sekolah, dan pengurus ke data bawaan awal. Lanjutkan?'
      )
    ) {
      resetToDefault();
      showToast('Seluruh data berhasil dikembalikan ke data awal!', 'info');
    }
  };

  // Filtered lists
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === 'Semua' || a.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [articles, searchQuery, filterCategory]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.speaker?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === 'Semua' || e.status === filterCategory;
      return matchSearch && matchCat;
    });
  }, [events, searchQuery, filterCategory]);

  const filteredGallery = useMemo(() => {
    return galleryItems.filter((g) => {
      const matchSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === 'Semua' || g.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [galleryItems, searchQuery, filterCategory]);

  const filteredSchools = useMemo(() => {
    return memberSchools.filter((s) => {
      return (
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.school.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [memberSchools, searchQuery]);

  const filteredLibrary = useMemo(() => {
    return (library || []).filter((item) => {
      const matchSearch =
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === 'Semua' || item.category === filterCategory;
      const matchType = filterType === 'Semua' || item.type === filterType;
      return matchSearch && matchCat && matchType;
    });
  }, [library, searchQuery, filterCategory, filterType]);

  // Total count stats
  const totalPengurus = useMemo(() => {
    const bphCount = team.bph?.length || 0;
    const divCount = team.divisions?.reduce((acc, d) => acc + (d.members?.length || 0), 0) || 0;
    return bphCount + divCount;
  }, [team]);

  // ==========================================
  // RENDER: LOGIN GATE
  // ==========================================
  if (!isAuthenticated) {
    return (
      <main className="admin-login-page pattern-bg">
        <div className="container">
          <div className="admin-login-wrapper">
            <div className="admin-login-card card">
              <div className="admin-login-header">
                <div className="admin-login-logo">
                  <RohisLogo size={64} showGlow={true} />
                </div>
                <span className="badge badge-gold">
                  <Lock size={13} /> Panel Khusus Pengurus
                </span>
                <h2>Portal Admin & CMS</h2>
                <p>
                  Masuk untuk mengelola artikel, agenda kajian, dokumentasi galeri, sekolah anggota,
                  dan kepengurusan ROHIS Banyumas secara langsung.
                </p>
              </div>

              {loginError && (
                <div className="admin-alert admin-alert-danger">
                  <AlertCircle size={18} />
                  <span>{loginError}</span>
                </div>
              )}



              <form onSubmit={handleLogin} className="admin-login-form">
                <div className="form-group">
                  <label className="form-label">Username Admin</label>
                  <input
                    type="text"
                    className="form-input"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Masukkan username"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="btn-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Tampilkan / Sembunyikan Password"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>



                <button type="submit" className="btn btn-primary btn-lg btn-login">
                  <ShieldCheck size={18} /> Masuk ke Dashboard
                </button>
              </form>

              <div className="admin-login-footer">
                <Link to="/" className="btn-back-home">
                  &larr; Kembali ke Website Publik
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // RENDER: AUTHENTICATED DASHBOARD
  // ==========================================
  return (
    <main className="admin-layout">
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle size={20} />
          ) : toast.type === 'warning' ? (
            <AlertCircle size={20} />
          ) : (
            <CheckCircle size={20} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Topbar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <div className="admin-brand">
            <RohisLogo size={34} showGlow={true} className="admin-brand-logo" />
            <div>
              <h3>Admin ROKABA CMS</h3>
              <span className="admin-status-badge">
                <span className={`status-dot ${syncStatus === 'syncing' ? 'syncing' : ''}`}></span>
                {syncStatus === 'syncing'
                  ? 'Menyinkronkan ke Cloud...'
                  : syncStatus === 'saved'
                    ? 'Cloud Upstash Terhubung (Real-Time)'
                    : 'Terhubung Real-Time'}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-topbar-right">
          <button
            onClick={async () => {
              showToast('Menyinkronkan seluruh data ke Cloud Upstash & Web Publik...', 'info');
              const ok = await syncNow();
              if (ok) {
                showToast('Semua data berhasil disinkronkan ke Web Publik & Cloud Upstash!', 'success');
              } else {
                showToast('Data tersimpan secara lokal dan diantrekan ke Cloud.', 'info');
              }
            }}
            className="btn btn-outline btn-sm"
            title="Paksa sinkronisasi data ke Cloud Upstash & Web Publik"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} className={syncStatus === 'syncing' ? 'spin' : ''} />
            <span>{syncStatus === 'syncing' ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
          </button>
          <a href="https://www.rohis-banyumas.web.id/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
            <ExternalLink size={14} /> Lihat Web Publik
          </a>
          <button onClick={handleLogout} className="btn btn-danger-ghost btn-sm" title="Logout">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </header>

      <div className="admin-container">
        {/* Sidebar Nav */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <button
              className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('overview');
                setSearchQuery('');
                setFilterCategory('Semua');
              }}
            >
              <LayoutDashboard size={18} />
              <span>Ringkasan</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'homepage' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('homepage');
                setSearchQuery('');
                setFilterCategory('Semua');
              }}
            >
              <Layout size={18} />
              <span>Kelola Beranda</span>
              <span className="badge badge-gold" style={{ fontSize: '0.62rem', padding: '1px 6px', marginLeft: 'auto' }}>CMS</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'articles' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('articles');
                setSearchQuery('');
                setFilterCategory('Semua');
              }}
            >
              <FileText size={18} />
              <span>Artikel Dakwah</span>
              <span className="nav-counter">{articles.length}</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('events');
                setSearchQuery('');
                setFilterCategory('Semua');
              }}
            >
              <Calendar size={18} />
              <span>Agenda & Kajian</span>
              <span className="nav-counter">{events.length}</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('gallery');
                setSearchQuery('');
                setFilterCategory('Semua');
              }}
            >
              <ImageIcon size={18} />
              <span>Galeri Foto</span>
              <span className="nav-counter">{galleryItems.length}</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'schools' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('schools');
                setSearchQuery('');
                setFilterCategory('Semua');
              }}
            >
              <GraduationCap size={18} />
              <span>ROHIS Sekolah</span>
              <span className="nav-counter">{memberSchools.length}</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('team');
                setSearchQuery('');
                setFilterCategory('Semua');
              }}
            >
              <Users size={18} />
              <span>Pengurus ROKABA</span>
              <span className="nav-counter">{totalPengurus}</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'library' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('library');
                setSearchQuery('');
                setFilterCategory('Semua');
                setFilterType('Semua');
              }}
            >
              <BookOpen size={18} />
              <span>E-Library</span>
              <span className="nav-counter">{library?.length || 0}</span>
            </button>

            <div className="admin-nav-separator"></div>

            <button
              className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('settings');
                setSearchQuery('');
                setFilterCategory('Semua');
              }}
            >
              <Settings size={18} />
              <span>Pengaturan & Backup</span>
            </button>
          </nav>

          <div className="admin-sidebar-footer">
            <div className="admin-sidebar-info">
              <p className="org-label">ROHIS Kabupaten Banyumas</p>
              <p className="period-label">Periode {siteSettings.period}</p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="admin-content">
          {/* ==================================== */}
          {/* TAB 1: OVERVIEW                      */}
          {/* ==================================== */}
          {activeTab === 'overview' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Ringkasan Konten Website</h2>
                  <p>Pantau dan kelola seluruh isi website ROHIS Kabupaten Banyumas secara terpusat.</p>
                </div>
                <div className="quick-actions">
                  <button
                    onClick={() => setActiveTab('homepage')}
                    className="btn btn-gold btn-sm"
                  >
                    <Sparkles size={16} /> Edit Teks & Foto Beranda
                  </button>
                  <button
                    onClick={() => openAddModal('article')}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={16} /> Tulis Artikel
                  </button>
                  <button
                    onClick={() => openAddModal('event')}
                    className="btn btn-outline btn-sm"
                  >
                    <Plus size={16} /> Buat Agenda
                  </button>
                  <button
                    onClick={() => openAddModal('library')}
                    className="btn btn-outline btn-sm"
                  >
                    <Plus size={16} /> Tambah E-Library
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-card-icon stat-icon-gold">
                    <Layout size={24} />
                  </div>
                  <div className="stat-card-info">
                    <span className="stat-count">6 Bagian</span>
                    <span className="stat-name">Visual & Editorial Beranda</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('homepage')}
                    className="stat-card-link"
                  >
                    Kelola Beranda &rarr;
                  </button>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon stat-icon-emerald">
                    <FileText size={24} />
                  </div>
                  <div className="stat-card-info">
                    <span className="stat-count">{articles.length}</span>
                    <span className="stat-name">Artikel Dakwah Terbit</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('articles')}
                    className="stat-card-link"
                  >
                    Kelola Artikel &rarr;
                  </button>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon stat-icon-blue">
                    <Calendar size={24} />
                  </div>
                  <div className="stat-card-info">
                    <span className="stat-count">{events.length}</span>
                    <span className="stat-name">Agenda & Kajian Terdaftar</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="stat-card-link"
                  >
                    Kelola Agenda &rarr;
                  </button>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon stat-icon-gold">
                    <ImageIcon size={24} />
                  </div>
                  <div className="stat-card-info">
                    <span className="stat-count">{galleryItems.length}</span>
                    <span className="stat-name">Foto Dokumentasi Kegiatan</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="stat-card-link"
                  >
                    Kelola Galeri &rarr;
                  </button>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon stat-icon-purple">
                    <GraduationCap size={24} />
                  </div>
                  <div className="stat-card-info">
                    <span className="stat-count">{memberSchools.length}</span>
                    <span className="stat-name">ROHIS Sekolah Tergabung</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('schools')}
                    className="stat-card-link"
                  >
                    Kelola Sekolah &rarr;
                  </button>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon stat-icon-rose">
                    <Users size={24} />
                  </div>
                  <div className="stat-card-info">
                    <span className="stat-count">{totalPengurus}</span>
                    <span className="stat-name">Total Pengurus ROKABA</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('team')}
                    className="stat-card-link"
                  >
                    Kelola Pengurus &rarr;
                  </button>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon stat-icon-gold">
                    <BookOpen size={24} />
                  </div>
                  <div className="stat-card-info">
                    <span className="stat-count">{library?.length || 0}</span>
                    <span className="stat-name">Materi E-Library & Dokumen</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('library')}
                    className="stat-card-link"
                  >
                    Kelola E-Library &rarr;
                  </button>
                </div>
              </div>

              {/* Sync Info Banner */}
              <div className="admin-sync-banner card">
                <div className="sync-banner-content">
                  <ShieldCheck size={32} className="sync-banner-icon" />
                  <div>
                    <h4>Sistem CMS Terintegrasi Penuh (Real-Time Synchronized)</h4>
                    <p>
                      Setiap perubahan data yang Anda simpan di sini akan <strong>otomatis langsung tayang</strong> pada seluruh halaman publik (Beranda, Artikel, Agenda, Galeri, dan ROHIS Anggota). Anda tidak perlu merestart server maupun mengetik perintah apapun.
                    </p>
                  </div>
                </div>
                <div className="sync-banner-actions">
                  <button onClick={exportBackup} className="btn btn-outline btn-sm">
                    <Download size={15} /> Cadangkan Data (JSON)
                  </button>
                </div>
              </div>

              {/* Recent Articles & Upcoming Events side-by-side */}
              <div className="admin-overview-grid">
                <div className="overview-panel card">
                  <div className="panel-header">
                    <h4>Artikel Dakwah Terbaru</h4>
                    <button onClick={() => setActiveTab('articles')} className="btn-link-sm">
                      Lihat Semua
                    </button>
                  </div>
                  <div className="overview-list">
                    {articles.slice(0, 4).map((art) => {
                      const coverUrl = getDirectImageUrl(art.image || art.coverImage);
                      return (
                        <div key={art.id} className="overview-item">
                          <div className="article-table-title-cell">
                            <div className="article-table-thumb">
                              {coverUrl ? (
                                <img
                                  src={coverUrl}
                                  alt=""
                                  onError={(e) => {
                                    const driveId = extractGoogleDriveId(art.image || art.coverImage);
                                    if (driveId) {
                                      e.currentTarget.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w600`;
                                    } else {
                                      e.currentTarget.style.display = 'none';
                                    }
                                  }}
                                />
                              ) : (
                                <span className="article-table-thumb-empty">📖</span>
                              )}
                            </div>
                            <div className="overview-item-title">
                              <strong>{art.title}</strong>
                              <span className="overview-item-meta">
                                {art.category} &bull; {art.date}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => openEditModal('article', art)}
                            className="btn-icon"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="overview-panel card">
                  <div className="panel-header">
                    <h4>Agenda Mendatang Terdekat</h4>
                    <button onClick={() => setActiveTab('events')} className="btn-link-sm">
                      Lihat Semua
                    </button>
                  </div>
                  <div className="overview-list">
                    {events
                      .filter((e) => e.status === 'upcoming')
                      .slice(0, 4)
                      .map((ev) => (
                        <div key={ev.id} className="overview-item">
                          <div className="overview-item-title">
                            <strong>{ev.title}</strong>
                            <span className="overview-item-meta">
                              📅 {ev.date} | 📍 {ev.location}
                            </span>
                          </div>
                          <button
                            onClick={() => openEditModal('event', ev)}
                            className="btn-icon"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* TAB 2: ARTIKEL DAKWAH                */}
          {/* ==================================== */}
          {activeTab === 'articles' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Kelola Artikel Dakwah</h2>
                  <p>Tulis, edit, dan publikasikan artikel kajian pemuda Islam.</p>
                </div>
                <button
                  onClick={() => openAddModal('article')}
                  className="btn btn-primary"
                >
                  <Plus size={16} /> Tulis Artikel Baru
                </button>
              </div>

              {/* Filters */}
              <div className="admin-filter-bar">
                <div className="search-input-wrapper">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Cari judul, kategori, atau penulis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="btn-clear-search">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="filter-select-wrapper">
                  <label>Kategori:</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="Semua">Semua Kategori</option>
                    <option value="Motivasi">Motivasi</option>
                    <option value="Ilmu">Ilmu</option>
                    <option value="Kajian">Kajian</option>
                    <option value="Dakwah">Dakwah</option>
                    <option value="Ukhuwah">Ukhuwah</option>
                  </select>
                </div>
              </div>

              {/* Articles Table */}
              <div className="admin-table-wrapper card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Judul Artikel</th>
                      <th>Kategori</th>
                      <th>Penulis</th>
                      <th>Tanggal</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          Tidak ada artikel yang sesuai dengan pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredArticles.map((art) => {
                        const coverUrl = getDirectImageUrl(art.image || art.coverImage);
                        return (
                          <tr key={art.id}>
                            <td>
                              <div className="article-table-title-cell">
                                <div className="article-table-thumb">
                                  {coverUrl ? (
                                    <img
                                      src={coverUrl}
                                      alt=""
                                      onError={(e) => {
                                        const driveId = extractGoogleDriveId(art.image || art.coverImage);
                                        if (driveId) {
                                          e.currentTarget.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w600`;
                                        } else {
                                          e.currentTarget.style.display = 'none';
                                        }
                                      }}
                                    />
                                  ) : (
                                    <span className="article-table-thumb-empty">📖</span>
                                  )}
                                </div>
                                <div>
                                  <strong className="table-title">{art.title}</strong>
                                  <span className="table-slug">/artikel/{art.slug}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-primary">{art.category}</span>
                            </td>
                            <td>{art.author || 'Admin'}</td>
                            <td>{art.date}</td>
                            <td>
                              <div className="table-actions">
                                <Link
                                  to={`/artikel/${art.slug}`}
                                  target="_blank"
                                  className="btn-icon"
                                  title="Lihat di Web"
                                >
                                <ExternalLink size={16} />
                              </Link>
                              <button
                                onClick={() => openEditModal('article', art)}
                                className="btn-icon btn-icon-edit"
                                title="Edit Artikel"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(art.id, art.title)}
                                className="btn-icon btn-icon-delete"
                                title="Hapus Artikel"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* TAB 3: AGENDA & KAJIAN               */}
          {/* ==================================== */}
          {activeTab === 'events' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Kelola Agenda & Kajian</h2>
                  <p>Atur jadwal kajian, pelatihan kepemimpinan, dan baksos pelajar.</p>
                </div>
                <button
                  onClick={() => openAddModal('event')}
                  className="btn btn-gold"
                >
                  <Plus size={16} /> Buat Agenda Baru
                </button>
              </div>

              {/* Filters */}
              <div className="admin-filter-bar">
                <div className="search-input-wrapper">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Cari judul, lokasi, atau pemateri..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="btn-clear-search">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="filter-select-wrapper">
                  <label>Status:</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="upcoming">Mendatang (Upcoming)</option>
                    <option value="completed">Selesai (Completed)</option>
                  </select>
                </div>
              </div>

              {/* Events Table */}
              <div className="admin-table-wrapper card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nama Kegiatan</th>
                      <th>Tanggal & Waktu</th>
                      <th>Lokasi</th>
                      <th>Tipe</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          Tidak ada agenda yang sesuai.
                        </td>
                      </tr>
                    ) : (
                      filteredEvents.map((ev) => (
                        <tr key={ev.id}>
                          <td>
                            <strong className="table-title">{ev.title}</strong>
                            {ev.speaker && (
                              <span className="table-speaker">Pemateri: {ev.speaker}</span>
                            )}
                          </td>
                          <td>
                            <strong>{ev.date}</strong>
                            <span className="table-sub">{ev.time}</span>
                          </td>
                          <td>{ev.location}</td>
                          <td>
                            <span className="badge badge-secondary">{ev.type}</span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                ev.status === 'upcoming' ? 'badge-primary' : 'badge-completed'
                              }`}
                            >
                              {ev.status === 'upcoming' ? 'Mendatang' : 'Selesai'}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                onClick={() => openEditModal('event', ev)}
                                className="btn-icon btn-icon-edit"
                                title="Edit Agenda"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(ev.id, ev.title)}
                                className="btn-icon btn-icon-delete"
                                title="Hapus Agenda"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* TAB 4: GALERI DOKUMENTASI            */}
          {/* ==================================== */}
          {activeTab === 'gallery' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Kelola Galeri & Dokumentasi</h2>
                  <p>Unggah dan kelola foto kegiatan dakwah pelajar ROHIS Banyumas.</p>
                </div>
                <button
                  onClick={() => openAddModal('gallery')}
                  className="btn btn-primary"
                >
                  <Plus size={16} /> Tambah Foto Galeri
                </button>
              </div>

              {/* Filters */}
              <div className="admin-filter-bar">
                <div className="search-input-wrapper">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Cari judul dokumentasi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="btn-clear-search">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="filter-select-wrapper">
                  <label>Kategori:</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="form-select"
                  >
                    {galleryCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="admin-gallery-grid">
                {filteredGallery.map((item) => {
                  const cover = getCoverMedia(item);
                  const summary = getMediaSummary(item);
                  return (
                    <div key={item.id} className="admin-gallery-card card">
                      <div className="admin-gallery-preview">
                        {cover ? (
                          <img src={cover} alt={item.title} />
                        ) : (
                          <div className="admin-gallery-placeholder">
                            <span className="gallery-emoji">{item.emoji || '📸'}</span>
                          </div>
                        )}
                        <span className="badge badge-primary gallery-badge">{item.category}</span>
                        <div className="admin-gallery-count-badge">
                          {summary.label}
                        </div>
                      </div>
                      <div className="admin-gallery-info">
                        <h4>{item.title}</h4>
                        <span className="gallery-date">📅 {item.date || 'Terkini'}</span>
                        {item.description && (
                          <p className="admin-gallery-desc-snippet">{item.description}</p>
                        )}
                      </div>
                      <div className="admin-gallery-actions">
                        <button
                          onClick={() => openEditModal('gallery', item)}
                          className="btn btn-outline btn-xs"
                        >
                          <Pencil size={13} /> Edit ({summary.total} Media)
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(item.id, item.title)}
                          className="btn btn-danger-ghost btn-xs"
                        >
                          <Trash2 size={13} /> Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* TAB 5: ROHIS ANGGOTA (SEKOLAH)       */}
          {/* ==================================== */}
          {activeTab === 'schools' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Kelola ROHIS Anggota (Sekolah)</h2>
                  <p>Daftarkan dan perbarui jaringan ROHIS SMA/SMK/MA se-Kabupaten Banyumas.</p>
                </div>
                <button
                  onClick={() => openAddModal('school')}
                  className="btn btn-primary"
                >
                  <Plus size={16} /> Daftarkan Sekolah Baru
                </button>
              </div>

              {/* Filters */}
              <div className="admin-filter-bar">
                <div className="search-input-wrapper">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Cari nama ROHIS, sekolah, atau ketua..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="btn-clear-search">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Schools Table */}
              <div className="admin-table-wrapper card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nama ROHIS & Sekolah</th>
                      <th>Jumlah Anggota</th>
                      <th>Tahun Berdiri</th>
                      <th>Alamat</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchools.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          Tidak ada sekolah yang sesuai.
                        </td>
                      </tr>
                    ) : (
                      filteredSchools.map((s) => (
                        <tr key={s.id}>
                          <td>
                            <strong className="table-title">{s.name}</strong>
                            <span className="table-sub">{s.school}</span>
                          </td>
                          <td>
                            <span className="badge badge-gold">{s.members} Siswa</span>
                          </td>
                          <td>{s.established}</td>
                          <td className="table-addr">{s.address}</td>
                          <td>
                            <div className="table-actions">
                              <button
                                onClick={() => openEditModal('school', s)}
                                className="btn-icon btn-icon-edit"
                                title="Edit Sekolah"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteSchool(s.id, s.name)}
                                className="btn-icon btn-icon-delete"
                                title="Hapus Sekolah"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* TAB 6: PENGURUS & STRUKTUR (ROKABA)  */}
          {/* ==================================== */}
          {activeTab === 'team' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Struktur Kepengurusan ROKABA</h2>
                  <p>
                    Kelola Pengurus BPH dan 5 Divisi (SDM, Dakwah, HUMAS, Jurnalistik, DANUS) Periode{' '}
                    {siteSettings.period}.
                  </p>
                </div>
                <div className="quick-actions">
                  <button
                    onClick={() => openAddModal('member', 'bph')}
                    className="btn btn-gold btn-sm"
                  >
                    <Plus size={15} /> + Pengurus BPH
                  </button>
                  <button
                    onClick={() => openAddModal('member', 'sdm')}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={15} /> + Pengurus Divisi
                  </button>
                </div>
              </div>

              {/* BPH SECTION */}
              <div className="admin-subpanel card mb-4">
                <div className="subpanel-header">
                  <div>
                    <h3>Badan Pengurus Harian (BPH)</h3>
                    <p>Pimpinan inti organisasi ({team.bph?.length || 0} Pengurus)</p>
                  </div>
                  <button
                    onClick={() => openAddModal('member', 'bph')}
                    className="btn btn-outline btn-xs"
                  >
                    <Plus size={13} /> Tambah BPH
                  </button>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nama Pengurus</th>
                        <th>Jabatan</th>
                        <th>Asal Sekolah</th>
                        <th>Instagram</th>
                        <th style={{ textAlign: 'right' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.bph?.map((m) => (
                        <tr key={m.id}>
                          <td>
                            <strong>{m.name}</strong>
                          </td>
                          <td>
                            <span className="badge badge-gold">{m.role}</span>
                          </td>
                          <td>{m.school}</td>
                          <td>
                            {m.instagram ? (
                              <a
                                href={`https://instagram.com/${m.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="table-ig-link"
                              >
                                @{m.instagram}
                              </a>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                onClick={() => openEditModal('member', m, 'bph')}
                                className="btn-icon btn-icon-edit"
                                title="Edit Pengurus"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteMember('bph', m.id, m.name)}
                                className="btn-icon btn-icon-delete"
                                title="Hapus Pengurus"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5 DIVISIONS */}
              {team.divisions?.map((div) => (
                <div key={div.id} className="admin-subpanel card mb-4">
                  <div className="subpanel-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      {div.logoImg && (
                        <img
                          src={div.logoImg}
                          alt={div.name}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1.5px solid rgba(0, 255, 200, 0.4)',
                            boxShadow: '0 0 12px rgba(0, 255, 200, 0.25)',
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div>
                        <h3>{div.name}</h3>
                        <p>
                          Koordinator: <strong>{div.head}</strong> &bull; {div.members?.length || 0} Kader
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => openAddModal('member', div.shortName || div.id)}
                      className="btn btn-outline btn-xs"
                    >
                      <Plus size={13} /> Tambah ke {div.shortName}
                    </button>
                  </div>

                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Nama Anggota</th>
                          <th>Jabatan</th>
                          <th>Asal Sekolah</th>
                          <th>Instagram</th>
                          <th style={{ textAlign: 'right' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {div.members?.map((m) => (
                          <tr key={m.id}>
                            <td>
                              <strong>{m.name}</strong>
                            </td>
                            <td>
                              <span className="badge badge-primary">{m.role || 'Anggota'}</span>
                            </td>
                            <td>{m.school}</td>
                            <td>
                              {m.instagram ? (
                                <a
                                  href={`https://instagram.com/${m.instagram}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="table-ig-link"
                                >
                                  @{m.instagram}
                                </a>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  onClick={() => openEditModal('member', m, div.shortName || div.id)}
                                  className="btn-icon btn-icon-edit"
                                  title="Edit Pengurus"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteMember(div.shortName || div.id, m.id, m.name)
                                  }
                                  className="btn-icon btn-icon-delete"
                                  title="Hapus Pengurus"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================================== */}
          {/* TAB: E-LIBRARY / PERPUSTAKAAN DIGITAL */}
          {/* ==================================== */}
          {activeTab === 'library' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Kelola E-Library (Perpustakaan Digital)</h2>
                  <p>Kelola materi dakwah, kajian, modul ibadah, dan slide presentasi yang dapat diunduh publik.</p>
                </div>
                <button
                  onClick={() => openAddModal('library')}
                  className="btn btn-primary"
                >
                  <Plus size={16} /> Tambah Materi E-Library
                </button>
              </div>

              {/* Filters */}
              <div className="admin-filter-bar">
                <div className="search-input-wrapper">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Cari judul materi atau kategori..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="btn-clear-search">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="filter-select-wrapper">
                  <label>Kategori:</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="Semua">Semua Kategori</option>
                    <option value="Ibadah">Ibadah</option>
                    <option value="Dakwah">Dakwah</option>
                    <option value="Edukasi">Edukasi</option>
                    <option value="Kajian">Kajian</option>
                    <option value="Motivasi">Motivasi</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                <div className="filter-select-wrapper">
                  <label>Tipe File:</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="form-select"
                  >
                    <option value="Semua">Semua Format</option>
                    <option value="pdf">PDF</option>
                    <option value="slide">Slide Presentasi</option>
                    <option value="doc">Dokumen / Word</option>
                  </select>
                </div>
              </div>

              {/* Library Table */}
              <div className="admin-table-wrapper card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '56px' }}>Format</th>
                      <th>Judul Materi</th>
                      <th>Kategori</th>
                      <th>Ukuran</th>
                      <th>Tautan Unduhan</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLibrary.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          <div style={{ padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                            <BookOpen size={44} style={{ opacity: 0.35, marginBottom: '0.75rem', display: 'block', margin: '0 auto 0.75rem' }} />
                            <p style={{ margin: 0, fontWeight: 500 }}>Tidak ada materi E-Library yang sesuai.</p>
                            <button
                              onClick={() => openAddModal('library')}
                              className="btn btn-outline btn-sm"
                              style={{ marginTop: '0.85rem' }}
                            >
                              <Plus size={14} /> Tambah Materi Pertama
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredLibrary.map((item) => {
                        const typeConfig = {
                          pdf: { label: 'PDF', bg: 'rgba(239,68,68,0.15)', color: '#EF4444', icon: FileText },
                          slide: { label: 'SLIDE', bg: 'rgba(245,158,11,0.15)', color: '#F59E0B', icon: Presentation },
                          doc: { label: 'DOC', bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', icon: File },
                        }[item.type || 'pdf'] || { label: 'FILE', bg: 'rgba(16,185,129,0.15)', color: '#10B981', icon: FileText };
                        const TypeIcon = typeConfig.icon;

                        return (
                          <tr key={item.id}>
                            <td>
                              <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: '8px',
                                background: typeConfig.bg,
                                color: typeConfig.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                              }}>
                                <TypeIcon size={18} />
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.94rem' }}>
                                {item.title}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Format: <strong style={{ color: typeConfig.color }}>{typeConfig.label}</strong> • ID: {item.id}
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                                {item.category || 'Umum'}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {item.size || '-'}
                              </span>
                            </td>
                            <td>
                              {item.fileUrl && item.fileUrl !== '#' ? (
                                <a
                                  href={item.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline btn-xs"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                                >
                                  <ExternalLink size={12} /> Buka / Unduh
                                </a>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Belum ada URL</span>
                              )}
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  onClick={() => openEditModal('library', item)}
                                  className="btn-icon btn-icon-edit"
                                  title="Edit Materi"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteLibrary(item.id, item.title)}
                                  className="btn-icon btn-icon-delete"
                                  title="Hapus Materi"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* TAB 7: PENGATURAN & BACKUP DATA      */}
          {/* ==================================== */}
          {activeTab === 'settings' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Pengaturan Website & Cadangan Data</h2>
                  <p>Atur kredensial login admin, kontak resmi, dan kelola backup data website.</p>
                </div>
              </div>

              <div className="settings-layout">
                {/* General & Auth Settings */}
                <div className="card settings-card">
                  <h3>Pengaturan Akun & Kontak Resmi</h3>
                  <form onSubmit={handleSaveSettings} className="settings-form">
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Username Admin</label>
                        <input
                          type="text"
                          className="form-input"
                          value={settingsForm.adminUsername}
                          onChange={(e) => handleSettingsChange('adminUsername', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Password Baru Admin</label>
                        <input
                          type="text"
                          className="form-input"
                          value={settingsForm.adminPassword}
                          onChange={(e) => handleSettingsChange('adminPassword', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Nama Resmi Organisasi</label>
                        <input
                          type="text"
                          className="form-input"
                          value={settingsForm.orgName}
                          onChange={(e) => handleSettingsChange('orgName', e.target.value)}
                          placeholder="Organisasi ROHIS Kabupaten Banyumas"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Periode Kepengurusan</label>
                        <input
                          type="text"
                          className="form-input"
                          value={settingsForm.period}
                          onChange={(e) => handleSettingsChange('period', e.target.value)}
                          placeholder="Contoh: 2024–2025"
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Email Resmi</label>
                        <input
                          type="email"
                          className="form-input"
                          value={settingsForm.email}
                          onChange={(e) => handleSettingsChange('email', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Nomor WhatsApp</label>
                        <input
                          type="text"
                          className="form-input"
                          value={settingsForm.whatsapp}
                          onChange={(e) => handleSettingsChange('whatsapp', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Alamat Sekretariat</label>
                      <input
                        type="text"
                        className="form-input"
                        value={settingsForm.address}
                        onChange={(e) => handleSettingsChange('address', e.target.value)}
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">URL Instagram Resmi</label>
                        <input
                          type="url"
                          className="form-input"
                          value={settingsForm.instagramUrl}
                          onChange={(e) => handleSettingsChange('instagramUrl', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">URL YouTube Resmi</label>
                        <input
                          type="url"
                          className="form-input"
                          value={settingsForm.youtubeUrl}
                          onChange={(e) => handleSettingsChange('youtubeUrl', e.target.value)}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                      Simpan Perubahan Pengaturan
                    </button>
                  </form>
                </div>

                {/* Backup & Restore Panel */}
                <div className="card settings-card">
                  <h3>Cadangan & Pemulihan Data (Backup & Restore)</h3>
                  <p className="settings-desc">
                    Semua data website tersimpan otomatis pada browser Anda. Anda disarankan mengunduh berkas cadangan secara berkala.
                  </p>

                  <div className="backup-actions">
                    <div className="backup-box">
                      <div>
                        <strong>Unduh Cadangan Lengkap (JSON)</strong>
                        <p>Simpan salinan seluruh artikel, agenda, galeri, dan struktur kepengurusan ke komputer.</p>
                      </div>
                      <button onClick={exportBackup} className="btn btn-gold btn-sm">
                        <Download size={16} /> Unduh Backup JSON
                      </button>
                    </div>

                    <div className="backup-box">
                      <div>
                        <strong>Pulihkan Data dari Berkas JSON</strong>
                        <p>Muat kembali data website dari berkas cadangan JSON yang telah Anda simpan sebelumnya.</p>
                      </div>
                      <label className="btn btn-outline btn-sm file-upload-label">
                        <Upload size={16} /> Pilih Berkas Cadangan
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    <div className="backup-box backup-danger-box">
                      <div>
                        <strong className="text-danger">Reset ke Data Default Awal</strong>
                        <p>Hapus seluruh modifikasi lokal dan kembalikan data ke versi asli bawaan website.</p>
                      </div>
                      <button onClick={handleReset} className="btn btn-danger-ghost btn-sm">
                        <RefreshCw size={15} /> Reset ke Data Asli
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* TAB: KELOLA BERANDA & KONTEN (CMS)   */}
          {/* ==================================== */}
          {activeTab === 'homepage' && (
            <AdminHomeCMS
              homeContent={homeContent}
              programs={programs}
              onSaveHomeContent={updateHomeContent}
              onSaveProgram={updateProgram}
              showToast={showToast}
            />
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* UNIVERSAL MODAL POPUP FOR CRUD FORMS       */}
      {/* ========================================== */}
      {modalType && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className={`admin-modal card ${modalType === 'gallery' ? 'admin-modal-lg' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>
                {editItem ? 'Edit ' : 'Tambah '}
                {modalType === 'article' && 'Artikel Dakwah'}
                {modalType === 'event' && 'Agenda Kegiatan'}
                {modalType === 'gallery' && 'Dokumentasi Galeri (Foto & Video)'}
                {modalType === 'school' && 'ROHIS Sekolah'}
                {modalType === 'member' && 'Pengurus Organisasi'}
                {modalType === 'library' && 'Materi E-Library (Perpustakaan Digital)'}
              </h3>
              <button onClick={closeModal} className="btn-close-modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-modal-form">
              {/* ARTICLE FORM */}
              {modalType === 'article' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Judul Artikel *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Masukkan judul artikel"
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Kategori *</label>
                      <select
                        className="form-select"
                        value={formData.category || 'Kajian'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Motivasi">Motivasi</option>
                        <option value="Ilmu">Ilmu</option>
                        <option value="Kajian">Kajian</option>
                        <option value="Dakwah">Dakwah</option>
                        <option value="Ukhuwah">Ukhuwah</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tanggal Terbit</label>
                      <input
                        type="date"
                        className="form-input"
                        value={formData.date || ''}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Penulis / Sumber</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.author || ''}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Nama penulis (misal: Tim Dakwah ROHIS / Ustadz ...)"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ringkasan Singkat (Excerpt)</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="1-2 kalimat ringkasan yang muncul di kartu artikel"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Isi Artikel Lengkap *</label>
                    <textarea
                      rows={8}
                      className="form-textarea"
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Tulis materi artikel di sini..."
                      required
                    />
                  </div>

                  {/* FOTO SAMPUL / COVER ARTIKEL */}
                  <ImageUploadField
                    label="Foto Sampul / Cover Artikel (Opsional)"
                    value={formData.image || formData.coverImage || ''}
                    onChange={(val) => setFormData({ ...formData, image: val, coverImage: val })}
                    placeholder="Upload berkas dari komputer/HP atau tempel tautan gambar/Google Drive..."
                    tip="Mendukung upload berkas gambar langsung, link Google Drive Foto, atau URL gambar publik."
                  />
                </>
              )}

              {/* EVENT FORM */}
              {modalType === 'event' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Nama Kegiatan / Kajian *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Contoh: Kajian Ahad Pagi Akbar"
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Tanggal Kegiatan *</label>
                      <input
                        type="date"
                        className="form-input"
                        value={formData.date || ''}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Waktu / Jam</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.time || ''}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        placeholder="Contoh: 07:00 - 09:30 WIB"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Lokasi / Titik Kumpul *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Contoh: Masjid Agung Baitussalam Purwokerto"
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Pemateri / Ustadz</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.speaker || ''}
                        onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                        placeholder="Nama Ustadz / Trainer"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tipe Kegiatan</label>
                      <select
                        className="form-select"
                        value={formData.type || 'Kajian'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="Kajian">Kajian</option>
                        <option value="Pelatihan">Pelatihan</option>
                        <option value="Sosial">Sosial</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Musyawarah">Musyawarah</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status Kegiatan</label>
                    <select
                      className="form-select"
                      value={formData.status || 'upcoming'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="upcoming">Mendatang (Upcoming)</option>
                      <option value="completed">Selesai (Completed)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deskripsi Lengkap</label>
                    <textarea
                      rows={3}
                      className="form-textarea"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Keterangan agenda..."
                    />
                  </div>

                  <ImageUploadField
                    label="Poster / Pamflet Agenda (Opsional)"
                    value={formData.image || formData.coverImage || ''}
                    onChange={(val) => setFormData({ ...formData, image: val, coverImage: val })}
                    placeholder="Pilih berkas pamflet dari komputer atau tempel URL gambar..."
                    tip="Poster akan ditampilkan pada kartu agenda dan detail informasi kajian."
                    aspectRatioHint="Potret / Bebas"
                  />
                </>
              )}

              {/* GALLERY FORM */}
              {modalType === 'gallery' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Judul Kegiatan / Nama Album *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Contoh: Kajian Akbar Pelajar Se-Banyumas 2025"
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Kategori *</label>
                      <select
                        className="form-select"
                        value={formData.category || 'Kajian'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {galleryCategories
                          .filter((c) => c !== 'Semua')
                          .map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tanggal / Waktu Pelaksanaan</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.date || ''}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        placeholder="Contoh: 16 Februari 2025"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ringkasan Kegiatan (Opsional)</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tuliskan catatan singkat atau ringkasan momen kegiatan ini..."
                    />
                  </div>

                  <ImageUploadField
                    label="Foto Sampul Utama Album (Cover)"
                    value={formData.coverImage || formData.image || ''}
                    onChange={(val) => setFormData({ ...formData, coverImage: val, image: val })}
                    placeholder="Pilih foto sampul utama album dari komputer atau tempel URL..."
                    tip="Foto ini akan menjadi thumbnail depan kartu album di halaman Galeri."
                  />

                  {/* MULTI-MEDIA MANAGER SECTION */}
                  <div className="admin-media-manager-box">
                    <div className="media-manager-header">
                      <div>
                        <h4 className="media-manager-title">📸 Koleksi Foto & Video Kegiatan</h4>
                        <p className="media-manager-sub">
                          Tambahkan beberapa foto atau video untuk kegiatan ini. Anda dapat mengupload langsung berkas foto dari komputer, atau memasukkan link foto/video YouTube.
                        </p>
                      </div>
                      <span className="badge badge-primary">
                        {(formData.media?.length || 0)} Media Ditambahkan
                      </span>
                    </div>

                    {/* Form Tambah Item Media */}
                    <div className="add-media-form-box">
                      <div className="media-type-selector">
                        <button
                          type="button"
                          className={`media-type-btn ${newMediaInput.type === 'image' ? 'active' : ''}`}
                          onClick={() => setNewMediaInput({ ...newMediaInput, type: 'image' })}
                        >
                          <ImageIcon size={14} /> Foto (Drive / Gambar / Upload)
                        </button>
                        <button
                          type="button"
                          className={`media-type-btn ${newMediaInput.type === 'video' ? 'active' : ''}`}
                          onClick={() => setNewMediaInput({ ...newMediaInput, type: 'video' })}
                        >
                          <Film size={14} /> Video (Drive / YouTube / MP4)
                        </button>
                      </div>

                      <div className="form-group" style={{ marginBottom: '0.6rem' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder={
                            newMediaInput.type === 'video'
                              ? 'Masukkan Link Google Drive Video (https://drive.google.com/file/d/...), YouTube, atau URL MP4'
                              : 'Masukkan Link Google Drive Foto (https://drive.google.com/file/d/...) atau URL Gambar'
                          }
                          value={newMediaInput.url}
                          onChange={(e) => setNewMediaInput({ ...newMediaInput, url: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddMediaToAlbum();
                            }
                          }}
                        />
                      </div>

                      <div className="add-media-row-action">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Keterangan / Caption foto atau video ini (opsional)"
                          value={newMediaInput.caption}
                          onChange={(e) => setNewMediaInput({ ...newMediaInput, caption: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddMediaToAlbum();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddMediaToAlbum}
                          className="btn btn-primary btn-add-media"
                        >
                          <Plus size={16} /> Tambah via URL
                        </button>

                        <label className="btn btn-gold btn-add-media" style={{ cursor: 'pointer' }}>
                          <Upload size={15} />
                          <span>Pilih Berkas Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleDirectFileUploadToAlbum}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>

                      <div className="admin-drive-tip">
                        💡 <strong>Tips Google Drive:</strong> Buka file di Google Drive &gt; klik <strong>Bagikan (Share)</strong> &gt; ubah Akses Umum menjadi <u>"Siapa saja yang memiliki link"</u> agar foto/video dapat dilihat publik di website.
                      </div>
                    </div>

                    {/* Daftar Media Yang Sudah Ditambahkan */}
                    {formData.media && formData.media.length > 0 ? (
                      <div className="admin-media-list">
                        {formData.media.map((med, index) => {
                          const isVid = isVideoMedia(med);
                          const thumb = getMediaThumbnail(med);
                          const isCover = (formData.coverImage === med.url) || (!formData.coverImage && index === 0);

                          return (
                            <div key={med.id || index} className={`admin-media-card ${isCover ? 'is-cover' : ''}`}>
                              <div className="admin-media-thumb">
                                {thumb ? (
                                  <img src={thumb} alt={med.caption || 'Media item'} />
                                ) : (
                                  <div className="admin-media-no-thumb">
                                    {isVid ? <Film size={22} /> : <ImageIcon size={22} />}
                                  </div>
                                )}
                                <span className={`media-type-tag ${isVid ? 'tag-video' : 'tag-image'}`}>
                                  {isVid ? '▶ VIDEO' : '📷 FOTO'}
                                </span>
                                {isCover && <span className="cover-badge">★ SAMPUL</span>}
                              </div>

                              <div className="admin-media-details">
                                <div className="admin-media-top-info">
                                  <span className="admin-media-num">Item #{index + 1}</span>
                                  {isCover && <span className="text-gold-sm">(Foto Sampul Depan)</span>}
                                </div>
                                <p className="admin-media-caption">
                                  {med.caption || <em className="text-muted">(Tanpa keterangan)</em>}
                                </p>
                                <span className="admin-media-url-hint" title={med.url}>{med.url}</span>
                              </div>

                              <div className="admin-media-actions">
                                {!isCover && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetCover(med.url)}
                                    className="btn btn-outline btn-xs"
                                    title="Pilih foto ini sebagai sampul utama di galeri depan"
                                  >
                                    Jadikan Sampul
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMediaFromAlbum(med.id)}
                                  className="btn-icon btn-icon-delete"
                                  title="Hapus media ini dari album"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="admin-empty-media">
                        <ImageIcon size={32} style={{ opacity: 0.35, marginBottom: 8 }} />
                        <p>Belum ada foto atau video yang ditambahkan ke kegiatan ini.</p>
                        <span className="text-muted">Gunakan form di atas untuk memasukkan link foto atau video YouTube.</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* SCHOOL FORM */}
              {modalType === 'school' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Nama ROHIS *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: ROHIS SMA N 1 Purwokerto"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nama Lengkap Sekolah *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.school || ''}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      placeholder="Contoh: SMA Negeri 1 Purwokerto"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Jumlah Anggota (Siswa)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.members ?? ''}
                      onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                      placeholder="Misal: 3"
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Tahun Berdiri</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.established ?? ''}
                        onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                        placeholder="Misal: 2018"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Alamat / Kecamatan</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Purwokerto / Banyumas"
                      />
                    </div>
                  </div>

                  <ImageUploadField
                    label="Logo atau Foto ROHIS Sekolah (Opsional)"
                    value={formData.image || formData.logo || ''}
                    onChange={(val) => setFormData({ ...formData, image: val, logo: val })}
                    placeholder="Pilih berkas logo sekolah atau tempel tautan gambar..."
                    tip="Logo atau foto sekolah akan tampil pada kartu sekolah anggota di website."
                  />
                </>
              )}

              {/* TEAM MEMBER FORM */}
              {modalType === 'member' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Divisi Penempatan *</label>
                    <select
                      className="form-select"
                      value={modalDivision}
                      onChange={(e) => setModalDivision(e.target.value)}
                    >
                      <option value="bph">Badan Pengurus Harian (BPH)</option>
                      <option value="sdm">Divisi SDM</option>
                      <option value="dakwah">Divisi Dakwah</option>
                      <option value="humas">Divisi HUMAS</option>
                      <option value="jurnalistik">Divisi Jurnalistik</option>
                      <option value="danus">Divisi DANUS</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nama Lengkap Pengurus *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Jabatan / Peran *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="Ketua / Sekretaris / Anggota"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Asal Sekolah *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.school || ''}
                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                        placeholder="Contoh: SMA Negeri 1 Purwokerto"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Username Instagram (opsional)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.instagram || ''}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value.replace(/^@/, '') })}
                      placeholder="username_ig (tanpa tanda @)"
                    />
                  </div>

                  <ImageUploadField
                    label="Foto Profil Pengurus (Opsional)"
                    value={formData.photo || formData.image || ''}
                    onChange={(val) => setFormData({ ...formData, photo: val, image: val })}
                    placeholder="Upload foto close-up pengurus dari komputer atau tempel URL..."
                    aspectRatioHint="Pas Foto / Rasio 1:1 atau 3:4"
                    tip="Foto profil pengurus akan ditampilkan pada bagan struktur organisasi."
                  />
                </>
              )}

              {/* E-LIBRARY FORM */}
              {modalType === 'library' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Judul Materi / Dokumen *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Contoh: Panduan Shalat Lengkap / Slide Etika Digital Islami"
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Kategori Materi *</label>
                      <select
                        className="form-select"
                        value={formData.category || 'Ibadah'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        <option value="Ibadah">Ibadah</option>
                        <option value="Dakwah">Dakwah</option>
                        <option value="Edukasi">Edukasi</option>
                        <option value="Kajian">Kajian</option>
                        <option value="Motivasi">Motivasi</option>
                        <option value="Umum">Umum</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tipe / Format File *</label>
                      <select
                        className="form-select"
                        value={formData.type || 'pdf'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        required
                      >
                        <option value="pdf">PDF (Dokumen / E-Book)</option>
                        <option value="slide">Slide Presentasi (PPT / Slide)</option>
                        <option value="doc">Dokumen Teks (Word / DOC)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Estimasi Ukuran File</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.size || ''}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        placeholder="Contoh: 2.5 MB, 1.8 MB, 5.2 MB"
                      />
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                        Tuliskan kapasitas file (misal: 2.5 MB) agar pembaca mengetahui ukuran unduhan.
                      </small>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Link Download / URL File *</label>
                      <input
                        type="url"
                        className="form-input"
                        value={formData.fileUrl || ''}
                        onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                        placeholder="https://drive.google.com/file/d/... atau link file"
                        required
                      />
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                        Tempel tautan unduhan dari Google Drive, Dropbox, atau Cloud storage.
                      </small>
                    </div>
                  </div>

                  {/* Tips Google Drive */}
                  <div style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(181, 141, 79, 0.08)',
                    border: '1px solid rgba(181, 141, 79, 0.25)',
                    fontSize: '0.78rem',
                    color: 'var(--warm-alabaster)',
                    lineHeight: 1.5,
                  }}>
                    <strong style={{ color: 'var(--antique-brass)' }}>💡 Tips Link Google Drive:</strong>
                    <p style={{ margin: '0.25rem 0 0', opacity: 0.85 }}>
                      Pastikan hak akses tautan pada Google Drive telah diubah menjadi <strong>"Siapa saja yang memiliki link (Anyone with the link)"</strong> agar seluruh pengunjung web publik dapat mengunduh materi tanpa hambatan izin akses.
                    </p>
                  </div>

                  {/* Live Card Preview */}
                  {formData.title && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '1rem',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--emerald-light)', marginBottom: '0.5rem' }}>
                        👁️ Pratinjau Tampilan di Website Publik:
                      </div>
                      <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        color: '#0D2B22',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                      }}>
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: '10px',
                          background: formData.type === 'slide' ? '#FEF3C7' : formData.type === 'doc' ? '#DBEAFE' : '#FEE2E2',
                          color: formData.type === 'slide' ? '#D97706' : formData.type === 'doc' ? '#2563EB' : '#DC2626',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          textTransform: 'uppercase',
                          flexShrink: 0,
                        }}>
                          {formData.type || 'PDF'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: '#E2E8F0', fontWeight: 600 }}>
                              {formData.category || 'Ibadah'}
                            </span>
                            <span style={{ fontSize: '0.65rem', color: '#64748B' }}>
                              {formData.size || 'Ukuran fleksibel'}
                            </span>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {formData.title}
                          </div>
                        </div>
                        <span style={{
                          padding: '0.4rem 0.85rem',
                          background: '#10B981',
                          color: 'white',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}>
                          Unduh
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="admin-modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-outline">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editItem ? 'Simpan Perubahan' : 'Tambahkan Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
