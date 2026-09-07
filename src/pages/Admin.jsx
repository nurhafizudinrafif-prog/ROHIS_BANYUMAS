import { useState, useMemo } from 'react';
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
  Play,
  Check,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { InstagramIcon, YoutubeIcon } from '../components/InstagramSection';
import {
  isVideoMedia,
  getMediaThumbnail,
  normalizeMediaList,
  getCoverMedia,
  getMediaSummary,
} from '../utils/media';
import logoImg from '../assets/logo.png';
import './Admin.css';

export default function Admin() {
  const {
    articles,
    events,
    galleryItems,
    galleryCategories,
    memberSchools,
    team,
    siteSettings,
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
    updateSettings,
    resetToDefault,
    exportBackup,
    importBackup,
  } = useData();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return (
      sessionStorage.getItem('rohis_admin_auth') === 'true' ||
      localStorage.getItem('rohis_admin_auth') === 'true'
    );
  });

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');

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

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    adminUsername: siteSettings.adminUsername || 'admin',
    adminPassword: siteSettings.adminPassword || 'rohisbanyumas2026',
    email: siteSettings.email || '',
    phone: siteSettings.phone || '',
    whatsapp: siteSettings.whatsapp || '',
    address: siteSettings.address || '',
    instagramUrl: siteSettings.instagramUrl || '',
    youtubeUrl: siteSettings.youtubeUrl || '',
  });

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (
      loginUsername === siteSettings.adminUsername &&
      loginPassword === siteSettings.adminPassword
    ) {
      if (rememberMe) {
        localStorage.setItem('rohis_admin_auth', 'true');
      } else {
        sessionStorage.setItem('rohis_admin_auth', 'true');
      }
      setIsAuthenticated(true);
      setLoginError('');
      showToast('Selamat datang di Portal Admin ROHIS Banyumas!', 'success');
    } else {
      setLoginError('Username atau password tidak sesuai. Silakan coba kembali.');
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
    if (!newMediaInput.url || !newMediaInput.url.trim()) {
      showToast('Masukkan URL gambar atau link YouTube terlebih dahulu!', 'warning');
      return;
    }
    const isVid = isVideoMedia(newMediaInput) || newMediaInput.type === 'video';
    const newMedia = {
      id: `m-${Date.now()}`,
      type: isVid ? 'video' : 'image',
      url: newMediaInput.url.trim(),
      caption: newMediaInput.caption ? newMediaInput.caption.trim() : '',
    };
    const currentMedia = Array.isArray(formData.media) ? formData.media : [];
    const updatedMedia = [...currentMedia, newMedia];
    const updatedCover = formData.coverImage || (newMedia.type === 'image' ? newMedia.url : getCoverMedia({ media: updatedMedia }));
    
    setFormData({
      ...formData,
      media: updatedMedia,
      coverImage: updatedCover,
      image: updatedCover,
    });
    setNewMediaInput({ type: 'image', url: '', caption: '' });
    showToast(isVid ? 'Video berhasil ditambahkan ke album' : 'Foto berhasil ditambahkan ke album', 'info');
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
      if (editItem) {
        updateArticle(editItem.id, formData);
        showToast('Artikel berhasil diperbarui!');
      } else {
        addArticle(formData);
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

  // Handle Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(settingsForm);
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
        s.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.leader.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [memberSchools, searchQuery]);

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
                  <img src={logoImg} alt="Logo ROHIS Kabupaten Banyumas" />
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
                  <small className="form-hint">Username bawaan: <code>admin</code></small>
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
                  <small className="form-hint">Password bawaan: <code>rohisbanyumas2026</code></small>
                </div>

                <div className="login-options-row">
                  <label className="login-checkbox">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Ingat saya di perangkat ini</span>
                  </label>
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
            <img src={logoImg} alt="Logo ROHIS" className="admin-brand-logo" />
            <div>
              <h3>Admin ROKABA CMS</h3>
              <span className="admin-status-badge">
                <span className="status-dot"></span> Saling Terhubung Real-Time
              </span>
            </div>
          </div>
        </div>

        <div className="admin-topbar-right">
          <Link to="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
            <ExternalLink size={14} /> Lihat Web Publik
          </Link>
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
                    onClick={() => openAddModal('article')}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={16} /> Tulis Artikel
                  </button>
                  <button
                    onClick={() => openAddModal('event')}
                    className="btn btn-gold btn-sm"
                  >
                    <Plus size={16} /> Buat Agenda
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="admin-stats-grid">
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
                    {articles.slice(0, 4).map((art) => (
                      <div key={art.id} className="overview-item">
                        <div className="overview-item-title">
                          <strong>{art.title}</strong>
                          <span className="overview-item-meta">
                            {art.category} &bull; {art.date}
                          </span>
                        </div>
                        <button
                          onClick={() => openEditModal('article', art)}
                          className="btn-icon"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                      </div>
                    ))}
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
                      filteredArticles.map((art) => (
                        <tr key={art.id}>
                          <td>
                            <strong className="table-title">{art.title}</strong>
                            <span className="table-slug">/artikel/{art.slug}</span>
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
                      ))
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
                      <th>Ketua ROHIS</th>
                      <th>Jumlah Anggota</th>
                      <th>Tahun Berdiri</th>
                      <th>Alamat</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchools.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
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
                          <td>{s.leader}</td>
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
                    <div>
                      <h3>{div.name}</h3>
                      <p>
                        Koordinator: <strong>{div.head}</strong> &bull; {div.members?.length || 0} Kader
                      </p>
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
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, adminUsername: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Password Baru Admin</label>
                        <input
                          type="text"
                          className="form-input"
                          value={settingsForm.adminPassword}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, adminPassword: e.target.value })
                          }
                          required
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
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Nomor WhatsApp</label>
                        <input
                          type="text"
                          className="form-input"
                          value={settingsForm.whatsapp}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, whatsapp: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Alamat Sekretariat</label>
                      <input
                        type="text"
                        className="form-input"
                        value={settingsForm.address}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, address: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">URL Instagram Resmi</label>
                        <input
                          type="url"
                          className="form-input"
                          value={settingsForm.instagramUrl}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">URL YouTube Resmi</label>
                        <input
                          type="url"
                          className="form-input"
                          value={settingsForm.youtubeUrl}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })
                          }
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

                  <div className="form-group">
                    <label className="form-label">URL Gambar (Opsional)</label>
                    <input
                      type="url"
                      className="form-input"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
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

                  {/* MULTI-MEDIA MANAGER SECTION */}
                  <div className="admin-media-manager-box">
                    <div className="media-manager-header">
                      <div>
                        <h4 className="media-manager-title">📸 Koleksi Foto & Video Kegiatan</h4>
                        <p className="media-manager-sub">
                          Tambahkan beberapa foto atau video untuk kegiatan ini. Mendukung foto (URL/Unsplash) dan video (Link YouTube atau direct MP4).
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
                          <ImageIcon size={14} /> Foto (Gambar)
                        </button>
                        <button
                          type="button"
                          className={`media-type-btn ${newMediaInput.type === 'video' ? 'active' : ''}`}
                          onClick={() => setNewMediaInput({ ...newMediaInput, type: 'video' })}
                        >
                          <Film size={14} /> Video (YouTube / MP4)
                        </button>
                      </div>

                      <div className="form-group" style={{ marginBottom: '0.6rem' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder={
                            newMediaInput.type === 'video'
                              ? 'Masukkan Link YouTube (https://youtu.be/... atau https://www.youtube.com/watch?v=...) atau URL MP4'
                              : 'Masukkan URL Foto (https://images.unsplash.com/... atau /gallery/foto.jpg)'
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
                          <Plus size={16} /> Tambah Media
                        </button>
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

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Ketua ROHIS</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.leader || ''}
                        onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                        placeholder="Nama Ketua"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Jumlah Anggota (Siswa)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.members ?? ''}
                        onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                        placeholder="Misal: 45"
                      />
                    </div>
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
                    <label className="form-label">Akun Instagram (Tanpa @)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.instagram || ''}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="misal: a1frbee"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio / Tugas Utama</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.bio || ''}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tugas atau deskripsi peran..."
                    />
                  </div>
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
