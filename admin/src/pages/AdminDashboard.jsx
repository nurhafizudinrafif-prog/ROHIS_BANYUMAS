import { useState, useEffect, useMemo, useCallback } from 'react';
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
  Cloud,
  CloudCheck,
  Film,
  Play,
  Check,
  Video,
} from 'lucide-react';
import { fetchCloudCMSData, saveCloudCMSData } from '../services/cloudSync';
import { articles as seedArticles } from '../data/articles';
import { events as seedEvents } from '../data/events';
import { galleryItems as seedGallery, galleryCategories } from '../data/gallery';
import { memberSchools as seedSchools } from '../data/memberSchools';
import { team as seedTeam, structurePeriod, organizationFullName } from '../data/team';
import { instagramReels as seedInstagramReels, instagramProfile as seedInstagramProfile } from '../data/instagram';
import {
  isVideoMedia,
  getMediaThumbnail,
  normalizeMediaList,
  getCoverMedia,
  getMediaSummary,
  getDirectImageUrl,
  isGoogleDriveUrl,
  extractGoogleDriveId,
} from '../utils/media';
import logoImg from '../assets/logo.png';
import './AdminDashboard.css';

const PUBLIC_WEB_URL = 'https://rohis-banyumas.vercel.app';

export default function AdminDashboard() {
  // Auth state
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

  // CMS Data States
  const [articles, setArticles] = useState(seedArticles);
  const [events, setEvents] = useState(seedEvents);
  const [galleryItems, setGalleryItems] = useState(seedGallery);
  const [memberSchools, setMemberSchools] = useState(seedSchools);
  const [team, setTeam] = useState(seedTeam);
  const [instagramReels, setInstagramReels] = useState(seedInstagramReels);
  const [instagramProfile, setInstagramProfile] = useState(seedInstagramProfile);
  const [isSyncingIg, setIsSyncingIg] = useState(false);
  const [siteSettings, setSiteSettings] = useState({
    adminUsername: 'admin',
    adminPassword: 'rohisbanyumas2026',
    email: 'info@rohisbanyumas.id',
    phone: '+62 812-3456-7890',
    whatsapp: '+62 812-3456-7890',
    address: 'Purwokerto, Kabupaten Banyumas, Jawa Tengah 53100',
    instagramUrl: 'https://www.instagram.com/rohis_banyumas/',
    youtubeUrl: 'https://youtube.com/@rohisbanyumas9?si=bJpq4dcozF81AHGr',
    period: structurePeriod,
    orgName: organizationFullName,
  });

  const [cloudStatus, setCloudStatus] = useState('connecting'); // 'connecting' | 'connected' | 'offline'
  const [isSavingCloud, setIsSavingCloud] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Modal States
  const [modalType, setModalType] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [modalDivision, setModalDivision] = useState('bph');
  const [formData, setFormData] = useState({});

  // Settings form
  const [settingsForm, setSettingsForm] = useState(siteSettings);

  // 1. Initial Load from Upstash Cloud
  useEffect(() => {
    async function loadCloud() {
      setCloudStatus('connecting');
      const cloudData = await fetchCloudCMSData();
      if (cloudData) {
        if (cloudData.articles) setArticles(cloudData.articles);
        if (cloudData.events) setEvents(cloudData.events);
        if (cloudData.galleryItems) setGalleryItems(cloudData.galleryItems);
        if (cloudData.memberSchools) setMemberSchools(cloudData.memberSchools);
        if (cloudData.instagramLivePosts && cloudData.instagramLivePosts.length > 0) {
          setInstagramReels(cloudData.instagramLivePosts);
        } else if (cloudData.instagramReels) {
          setInstagramReels(cloudData.instagramReels);
        }
        if (cloudData.instagramProfile) setInstagramProfile(cloudData.instagramProfile);
        if (cloudData.siteSettings) {
          setSiteSettings((prev) => ({ ...prev, ...cloudData.siteSettings }));
          setSettingsForm((prev) => ({ ...prev, ...cloudData.siteSettings }));
        }
        setCloudStatus('connected');
      } else {
        // Fallback or seed to cloud for first time
        setCloudStatus('offline');
      }
    }

    loadCloud();
  }, []);

  // Sync back to cloud whenever data changes (debounced & supports both object payload and positional args)
  const syncToCloud = useCallback(
    async (optionsOrArticles, updatedEvents, updatedGallery, updatedSchools, updatedTeam, updatedInstagram, updatedProfile, updatedSettings) => {
      setIsSavingCloud(true);
      let payload;
      if (
        optionsOrArticles &&
        typeof optionsOrArticles === 'object' &&
        !Array.isArray(optionsOrArticles) &&
        ('articles' in optionsOrArticles ||
          'events' in optionsOrArticles ||
          'galleryItems' in optionsOrArticles ||
          'memberSchools' in optionsOrArticles ||
          'team' in optionsOrArticles ||
          'instagramReels' in optionsOrArticles ||
          'instagramProfile' in optionsOrArticles ||
          'siteSettings' in optionsOrArticles)
      ) {
        payload = {
          articles: optionsOrArticles.articles || articles,
          events: optionsOrArticles.events || events,
          galleryItems: optionsOrArticles.galleryItems || galleryItems,
          memberSchools: optionsOrArticles.memberSchools || memberSchools,
          team: optionsOrArticles.team || team,
          instagramReels: optionsOrArticles.instagramReels || instagramReels,
          instagramProfile: optionsOrArticles.instagramProfile || instagramProfile,
          siteSettings: optionsOrArticles.siteSettings || siteSettings,
        };
      } else {
        payload = {
          articles: optionsOrArticles || articles,
          events: updatedEvents || events,
          galleryItems: updatedGallery || galleryItems,
          memberSchools: updatedSchools || memberSchools,
          team: updatedTeam || team,
          instagramReels: updatedInstagram || instagramReels,
          instagramProfile: updatedProfile || instagramProfile,
          siteSettings: updatedSettings || siteSettings,
        };
      }

      const ok = await saveCloudCMSData(payload);
      setIsSavingCloud(false);
      if (ok) {
        setCloudStatus('connected');
      }
      return ok;
    },
    [articles, events, galleryItems, memberSchools, team, instagramReels, instagramProfile, siteSettings]
  );

  // Live Sync trigger from Instagram API
  const handleSyncInstagramLive = async () => {
    setIsSyncingIg(true);
    showToast('Menghubungkan langsung ke Instagram @rohis_banyumas...');
    try {
      let res;
      try {
        res = await fetch('/api/instagram');
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
          res = await fetch('https://rohis-banyumas.vercel.app/api/instagram');
        }
      } catch (e) {
        res = await fetch('https://rohis-banyumas.vercel.app/api/instagram');
      }

      if (res && res.ok) {
        const data = await res.json();
        if (data.profile) {
          setInstagramProfile(data.profile);
        }
        if (data.posts && data.posts.length > 0) {
          setInstagramReels(data.posts);
          showToast(`Berhasil sinkron live dari Instagram! (${data.posts.length} postingan)`);
          await syncToCloud({
            instagramProfile: data.profile,
            instagramReels: data.posts,
          });
        } else {
          showToast('Berhasil sinkron profil live dari Instagram!');
          await syncToCloud({ instagramProfile: data.profile });
        }
      } else {
        showToast('Info profil telah disinkronkan dari database cloud.');
      }
    } catch (e) {
      showToast('Gagal memuat live Instagram: ' + e.message, 'warning');
    } finally {
      setIsSyncingIg(false);
    }
  };

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
      showToast('Berhasil masuk ke Dashboard Admin!', 'success');
    } else {
      setLoginError('Username atau password tidak sesuai.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('rohis_admin_auth');
    localStorage.removeItem('rohis_admin_auth');
    setIsAuthenticated(false);
    showToast('Telah keluar dari sesi admin.', 'info');
  };

  // Modal helpers & Media album state
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
    } else if (type === 'instagram') {
      setFormData({
        title: '',
        category: 'Dokumentasi',
        tag: '#RohisBanyumas #DakwahPelajar',
        image: '',
        views: '1,500',
        likes: 120,
        comments: 15,
        url: 'https://www.instagram.com/rohis_banyumas/',
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

  // Submit Modal
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (modalType === 'article') {
      let updated;
      const coverImageVal = formData.image || formData.coverImage || null;
      if (editItem) {
        updated = articles.map((a) => (a.id === editItem.id ? { ...a, ...formData, image: coverImageVal, coverImage: coverImageVal } : a));
        showToast('Artikel berhasil diperbarui & disimpan ke Cloud!');
      } else {
        const newArt = {
          id: Date.now(),
          title: formData.title || 'Artikel Baru',
          slug: formData.slug || (formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `artikel-${Date.now()}`),
          category: formData.category || 'Kajian',
          date: formData.date || new Date().toISOString().split('T')[0],
          author: formData.author || 'Admin ROHIS',
          excerpt: formData.excerpt || '',
          content: formData.content || '',
          image: coverImageVal,
          coverImage: coverImageVal,
        };
        updated = [newArt, ...articles];
        showToast('Artikel baru berhasil dipublikasikan ke Web Publik!');
      }
      setArticles(updated);
      await syncToCloud(updated, null, null, null, null, null);
    } else if (modalType === 'event') {
      let updated;
      if (editItem) {
        updated = events.map((ev) => (ev.id === editItem.id ? { ...ev, ...formData } : ev));
        showToast('Agenda kegiatan berhasil diperbarui & disinkronkan!');
      } else {
        const newEv = {
          id: Date.now(),
          title: formData.title || 'Agenda Baru',
          date: formData.date || new Date().toISOString().split('T')[0],
          time: formData.time || '08:00 - 11:30 WIB',
          location: formData.location || 'Purwokerto, Banyumas',
          speaker: formData.speaker || null,
          type: formData.type || 'Kajian',
          status: formData.status || 'upcoming',
          description: formData.description || '',
        };
        updated = [newEv, ...events];
        showToast('Agenda baru berhasil tayang di Web Publik!');
      }
      setEvents(updated);
      await syncToCloud(null, updated, null, null, null, null);
    } else if (modalType === 'gallery') {
      let updated;
      const mediaList = Array.isArray(formData.media) && formData.media.length > 0
        ? formData.media
        : (formData.image ? [{ id: `m-${Date.now()}`, type: 'image', url: formData.image, caption: formData.title || '' }] : []);
      const cover = formData.coverImage || (mediaList[0]?.url || formData.image || '');

      if (editItem) {
        updated = galleryItems.map((g) => (g.id === editItem.id ? {
          ...g,
          ...formData,
          coverImage: cover,
          image: cover,
          media: mediaList,
        } : g));
        showToast('Dokumentasi galeri kegiatan berhasil diperbarui!');
      } else {
        const newGal = {
          id: Date.now(),
          title: formData.title || 'Dokumentasi Baru',
          category: formData.category || 'Kajian',
          coverImage: cover,
          image: cover,
          emoji: formData.emoji || '📸',
          date: formData.date || 'Terkini',
          description: formData.description || '',
          media: mediaList,
        };
        updated = [newGal, ...galleryItems];
        showToast('Dokumentasi baru berhasil ditambahkan ke Galeri Web Publik!');
      }
      setGalleryItems(updated);
      await syncToCloud(null, null, updated, null, null, null);
    } else if (modalType === 'school') {
      let updated;
      if (editItem) {
        updated = memberSchools.map((s) => (s.id === editItem.id ? { ...s, ...formData, members: Number(formData.members ?? s.members) } : s));
        showToast('Data sekolah berhasil diperbarui!');
      } else {
        const newSch = {
          id: Date.now(),
          name: formData.name || 'ROHIS Sekolah',
          school: formData.school || 'Nama Sekolah',
          leader: formData.leader || '-',
          members: Number(formData.members) || 0,
          address: formData.address || 'Banyumas',
          established: Number(formData.established) || new Date().getFullYear(),
        };
        updated = [newSch, ...memberSchools];
        showToast('Sekolah berhasil didaftarkan ke Web Publik!');
      }
      setMemberSchools(updated);
      await syncToCloud(null, null, null, updated, null, null);
    } else if (modalType === 'member') {
      let updatedTeam = { ...team };
      const newMember = {
        id: editItem ? editItem.id : `member-${Date.now()}`,
        name: formData.name || 'Nama Pengurus',
        role: formData.role || 'Anggota',
        division: formData.division || modalDivision,
        school: formData.school || '-',
        instagram: formData.instagram || '',
        bio: formData.bio || '',
      };

      if (modalDivision === 'bph') {
        if (editItem) {
          updatedTeam.bph = updatedTeam.bph.map((m) => (m.id === editItem.id ? newMember : m));
        } else {
          updatedTeam.bph = [...updatedTeam.bph, newMember];
        }
      } else {
        updatedTeam.divisions = updatedTeam.divisions.map((div) => {
          if (div.shortName?.toLowerCase() === modalDivision.toLowerCase() || div.id === modalDivision) {
            const members = editItem
              ? div.members.map((m) => (m.id === editItem.id ? newMember : m))
              : [...div.members, newMember];
            return { ...div, members };
          }
          return div;
        });
      }

      setTeam(updatedTeam);
      showToast('Data pengurus berhasil diperbarui & disinkronkan!');
      await syncToCloud(null, null, null, null, updatedTeam, null, null);
    } else if (modalType === 'instagram') {
      let updated;
      const imgUrl = formData.image || '/instagram/reel-1.jpg';
      if (editItem) {
        updated = instagramReels.map((r) =>
          r.id === editItem.id
            ? {
                ...r,
                ...formData,
                image: imgUrl,
                likes: Number(formData.likes) || r.likes || 0,
                comments: Number(formData.comments) || r.comments || 0,
              }
            : r
        );
        showToast('Reel Instagram berhasil diperbarui & disinkronkan ke Web Publik!');
      } else {
        const newReel = {
          id: `ig-reel-${Date.now()}`,
          type: 'reel',
          title: formData.title || 'Reel Baru @rohis_banyumas',
          category: formData.category || 'Dokumentasi',
          tag: formData.tag || '#RohisBanyumas',
          image: imgUrl,
          views: formData.views || '1,000',
          likes: Number(formData.likes) || 0,
          comments: Number(formData.comments) || 0,
          url: formData.url || 'https://www.instagram.com/rohis_banyumas/',
        };
        updated = [newReel, ...instagramReels];
        showToast('Reel baru berhasil ditambahkan dan langsung aktif di Web Publik!');
      }
      setInstagramReels(updated);
      await syncToCloud(null, null, null, null, null, updated, null);
    }

    closeModal();
  };

  // Delete Handlers
  const handleDeleteInstagram = async (id, title) => {
    if (window.confirm(`Hapus Reel "${title}" dari website?`)) {
      const updated = instagramReels.filter((r) => r.id !== id);
      setInstagramReels(updated);
      showToast('Reel Instagram berhasil dihapus dari website.');
      await syncToCloud(null, null, null, null, null, updated, null);
    }
  };

  const handleDeleteArticle = async (id, title) => {
    if (window.confirm(`Hapus artikel "${title}"?`)) {
      const updated = articles.filter((a) => a.id !== id);
      setArticles(updated);
      showToast('Artikel dihapus.');
      await syncToCloud(updated, null, null, null, null, null, null);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (window.confirm(`Hapus agenda "${title}"?`)) {
      const updated = events.filter((e) => e.id !== id);
      setEvents(updated);
      showToast('Agenda dihapus.');
      await syncToCloud(null, updated, null, null, null, null);
    }
  };

  const handleDeleteGallery = async (id, title) => {
    if (window.confirm(`Hapus foto "${title}"?`)) {
      const updated = galleryItems.filter((g) => g.id !== id);
      setGalleryItems(updated);
      showToast('Item galeri dihapus.');
      await syncToCloud(null, null, updated, null, null, null);
    }
  };

  const handleDeleteSchool = async (id, name) => {
    if (window.confirm(`Hapus sekolah "${name}"?`)) {
      const updated = memberSchools.filter((s) => s.id !== id);
      setMemberSchools(updated);
      showToast('Sekolah dihapus.');
      await syncToCloud(null, null, null, updated, null, null);
    }
  };

  const handleDeleteMember = async (divisionKey, id, name) => {
    if (window.confirm(`Hapus pengurus "${name}"?`)) {
      let updatedTeam = { ...team };
      if (divisionKey === 'bph') {
        updatedTeam.bph = updatedTeam.bph.filter((m) => m.id !== id);
      } else {
        updatedTeam.divisions = updatedTeam.divisions.map((div) => {
          if (div.shortName?.toLowerCase() === divisionKey.toLowerCase() || div.id === divisionKey) {
            return { ...div, members: div.members.filter((m) => m.id !== id) };
          }
          return div;
        });
      }
      setTeam(updatedTeam);
      showToast('Pengurus dihapus.');
      await syncToCloud(null, null, null, null, updatedTeam, null);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSiteSettings(settingsForm);
    showToast('Pengaturan admin & kontak berhasil disimpan!');
    await syncToCloud(null, null, null, null, null, settingsForm);
  };

  // Export Backup
  const exportBackup = () => {
    const backupData = {
      articles,
      events,
      galleryItems,
      memberSchools,
      team,
      siteSettings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_rohis_banyumas_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset to default
  const handleReset = async () => {
    if (window.confirm('PERINGATAN: Kembalikan seluruh konten ke data awal bawaan website?')) {
      setArticles(seedArticles);
      setEvents(seedEvents);
      setGalleryItems(seedGallery);
      setMemberSchools(seedSchools);
      setTeam(seedTeam);
      showToast('Data dikembalikan ke versi awal & disinkronkan!');
      await syncToCloud(seedArticles, seedEvents, seedGallery, seedSchools, seedTeam, null);
    }
  };

  // Filtered lists
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.author?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === 'Semua' || a.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [articles, searchQuery, filterCategory]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location?.toLowerCase().includes(searchQuery.toLowerCase());
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
                  <Lock size={13} /> Panel Khusus Pengurus (Admin Standalone)
                </span>
                <h2>Admin CMS ROKABA</h2>
                <p>
                  Portal manajemen konten resmi. Seluruh perubahan terhubung otomatis secara real-time ke Web Publik.
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
                    placeholder="Username"
                    required
                  />
                  <small className="form-hint">Default: <code>admin</code></small>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      className="btn-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <small className="form-hint">Default: <code>rohisbanyumas2026</code></small>
                </div>

                <div className="login-options-row">
                  <label className="login-checkbox">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Ingat sesi di perangkat ini</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-lg btn-login">
                  <ShieldCheck size={18} /> Masuk ke Dashboard Admin
                </button>
              </form>

              <div className="admin-login-footer">
                <a href={PUBLIC_WEB_URL} target="_blank" rel="noopener noreferrer" className="btn-back-home">
                  &larr; Kunjungi Website Publik ({PUBLIC_WEB_URL})
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // RENDER: DASHBOARD
  // ==========================================
  return (
    <main className="admin-layout">
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          <CheckCircle size={20} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Topbar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <div className="admin-brand">
            <img src={logoImg} alt="Logo ROHIS" className="admin-brand-logo" />
            <div>
              <h3>Admin CMS ROKABA</h3>
              <div className="cloud-indicator">
                {cloudStatus === 'connected' ? (
                  <span className="cloud-connected">
                    <span className="status-dot"></span> ☁️ Upstash Cloud Synced (Online)
                  </span>
                ) : cloudStatus === 'connecting' ? (
                  <span className="cloud-connecting">
                    <span className="status-dot dot-yellow"></span> Menghubungkan ke Cloud...
                  </span>
                ) : (
                  <span className="cloud-offline">
                    <span className="status-dot dot-red"></span> Mode Offline
                  </span>
                )}
                {isSavingCloud && <span className="saving-tag">Menyimpan...</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="admin-topbar-right">
          <a
            href={PUBLIC_WEB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <ExternalLink size={14} /> Buka Web Publik
          </a>
          <button onClick={handleLogout} className="btn btn-danger-ghost btn-sm" title="Logout">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </header>

      <div className="admin-container">
        {/* Sidebar */}
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

            <button
              className={`admin-nav-item ${activeTab === 'instagram' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('instagram');
                setSearchQuery('');
                setFilterCategory('Semua');
              }}
            >
              <Video size={18} />
              <span>Reels Instagram</span>
              <span className="nav-counter">{instagramReels.length}</span>
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
              <span>Pengaturan & Cloud</span>
            </button>
          </nav>

          <div className="admin-sidebar-footer">
            <p className="org-label">ROHIS Kabupaten Banyumas</p>
            <p className="period-label">Periode {siteSettings.period}</p>
          </div>
        </aside>

        {/* Content */}
        <div className="admin-content">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Ringkasan Konten Web</h2>
                  <p>Kelola konten website ROHIS Kabupaten Banyumas. Data disinkronkan langsung via Cloud Database.</p>
                </div>
                <div className="quick-actions">
                  <button onClick={() => openAddModal('article')} className="btn btn-primary btn-sm">
                    <Plus size={16} /> Tulis Artikel
                  </button>
                  <button onClick={() => openAddModal('event')} className="btn btn-gold btn-sm">
                    <Plus size={16} /> Buat Agenda
                  </button>
                  <button onClick={() => openAddModal('instagram')} className="btn btn-outline btn-sm">
                    <Plus size={16} /> Tambah Reel IG
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-card-icon stat-icon-emerald"><FileText size={24} /></div>
                  <div className="stat-card-info">
                    <span className="stat-count">{articles.length}</span>
                    <span className="stat-name">Artikel Dakwah</span>
                  </div>
                  <button onClick={() => setActiveTab('articles')} className="stat-card-link">Kelola &rarr;</button>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon stat-icon-blue"><Calendar size={24} /></div>
                  <div className="stat-card-info">
                    <span className="stat-count">{events.length}</span>
                    <span className="stat-name">Agenda & Kajian</span>
                  </div>
                  <button onClick={() => setActiveTab('events')} className="stat-card-link">Kelola &rarr;</button>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon stat-icon-gold"><ImageIcon size={24} /></div>
                  <div className="stat-card-info">
                    <span className="stat-count">{galleryItems.length}</span>
                    <span className="stat-name">Dokumentasi Galeri</span>
                  </div>
                  <button onClick={() => setActiveTab('gallery')} className="stat-card-link">Kelola &rarr;</button>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon stat-icon-purple"><GraduationCap size={24} /></div>
                  <div className="stat-card-info">
                    <span className="stat-count">{memberSchools.length}</span>
                    <span className="stat-name">ROHIS Sekolah</span>
                  </div>
                  <button onClick={() => setActiveTab('schools')} className="stat-card-link">Kelola &rarr;</button>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon stat-icon-rose"><Users size={24} /></div>
                  <div className="stat-card-info">
                    <span className="stat-count">{totalPengurus}</span>
                    <span className="stat-name">Pengurus ROKABA</span>
                  </div>
                  <button onClick={() => setActiveTab('team')} className="stat-card-link">Kelola &rarr;</button>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon stat-icon-pink"><Video size={24} /></div>
                  <div className="stat-card-info">
                    <span className="stat-count">{instagramReels.length}</span>
                    <span className="stat-name">Reels Instagram</span>
                  </div>
                  <button onClick={() => setActiveTab('instagram')} className="stat-card-link">Kelola &rarr;</button>
                </div>
              </div>

              {/* Cloud Sync Status Card */}
              <div className="admin-sync-banner card">
                <div className="sync-banner-content">
                  <Cloud size={32} className="sync-banner-icon" />
                  <div>
                    <h4>Upstash Cloud Sync Aktif</h4>
                    <p>
                      Website Admin ini terhubung ke <strong>Upstash Redis Cloud Database</strong>. Ketika Anda mempublikasikan artikel atau agenda, seluruh pengunjung di Web Publik (<code>{PUBLIC_WEB_URL}</code>) akan langsung menerima data terbaru.
                    </p>
                  </div>
                </div>
                <div className="sync-banner-actions">
                  <button onClick={exportBackup} className="btn btn-outline btn-sm">
                    <Download size={15} /> Cadangkan Data (JSON)
                  </button>
                </div>
              </div>

              {/* Recent lists */}
              <div className="admin-overview-grid">
                <div className="overview-panel card">
                  <div className="panel-header">
                    <h4>Artikel Terbaru</h4>
                    <button onClick={() => setActiveTab('articles')} className="btn-link-sm">Lihat Semua</button>
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
                              <span className="overview-item-meta">{art.category} &bull; {art.date}</span>
                            </div>
                          </div>
                          <button onClick={() => openEditModal('article', art)} className="btn-icon">
                            <Pencil size={15} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="overview-panel card">
                  <div className="panel-header">
                    <h4>Agenda Mendatang</h4>
                    <button onClick={() => setActiveTab('events')} className="btn-link-sm">Lihat Semua</button>
                  </div>
                  <div className="overview-list">
                    {events.filter((e) => e.status === 'upcoming').slice(0, 4).map((ev) => (
                      <div key={ev.id} className="overview-item">
                        <div className="overview-item-title">
                          <strong>{ev.title}</strong>
                          <span className="overview-item-meta">📅 {ev.date} | 📍 {ev.location}</span>
                        </div>
                        <button onClick={() => openEditModal('event', ev)} className="btn-icon">
                          <Pencil size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ARTIKEL TAB */}
          {activeTab === 'articles' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Kelola Artikel Dakwah</h2>
                  <p>Tulis dan publikasikan kajian yang akan otomatis tayang di Web Publik.</p>
                </div>
                <button onClick={() => openAddModal('article')} className="btn btn-primary">
                  <Plus size={16} /> Tulis Artikel Baru
                </button>
              </div>

              <div className="admin-filter-bar">
                <div className="search-input-wrapper">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Cari judul atau penulis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
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
                  </select>
                </div>
              </div>

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
                    {filteredArticles.map((art) => {
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
                        <td><span className="badge badge-primary">{art.category}</span></td>
                        <td>{art.author || 'Admin'}</td>
                        <td>{art.date}</td>
                        <td>
                          <div className="table-actions">
                            <button onClick={() => openEditModal('article', art)} className="btn-icon btn-icon-edit">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDeleteArticle(art.id, art.title)} className="btn-icon btn-icon-delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AGENDA TAB */}
          {activeTab === 'events' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Kelola Agenda & Kajian</h2>
                  <p>Jadwalkan kegiatan dakwah, kajian Ahad pagi, dan baksos.</p>
                </div>
                <button onClick={() => openAddModal('event')} className="btn btn-gold">
                  <Plus size={16} /> Buat Agenda Baru
                </button>
              </div>

              <div className="admin-table-wrapper card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nama Kegiatan</th>
                      <th>Tanggal & Jam</th>
                      <th>Lokasi</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((ev) => (
                      <tr key={ev.id}>
                        <td>
                          <strong className="table-title">{ev.title}</strong>
                          {ev.speaker && <span className="table-speaker">Pemateri: {ev.speaker}</span>}
                        </td>
                        <td>{ev.date} &bull; {ev.time}</td>
                        <td>{ev.location}</td>
                        <td>
                          <span className={`badge ${ev.status === 'upcoming' ? 'badge-primary' : 'badge-secondary'}`}>
                            {ev.status === 'upcoming' ? 'Mendatang' : 'Selesai'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button onClick={() => openEditModal('event', ev)} className="btn-icon btn-icon-edit">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDeleteEvent(ev.id, ev.title)} className="btn-icon btn-icon-delete">
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
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Kelola Dokumentasi Galeri Kegiatan</h2>
                  <p>Kelola dokumentasi multi-media (koleksi foto dan video) yang langsung tayang di Web Publik.</p>
                </div>
                <button onClick={() => openAddModal('gallery')} className="btn btn-primary">
                  <Plus size={16} /> Tambah Kegiatan / Album
                </button>
              </div>

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
                          <span className="gallery-emoji">{item.emoji || '📸'}</span>
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
                        <button onClick={() => openEditModal('gallery', item)} className="btn btn-outline btn-xs">
                          <Pencil size={13} /> Edit ({summary.total} Media)
                        </button>
                        <button onClick={() => handleDeleteGallery(item.id, item.title)} className="btn btn-danger-ghost btn-xs">
                          <Trash2 size={13} /> Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SCHOOLS TAB */}
          {activeTab === 'schools' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Kelola ROHIS Anggota (Sekolah)</h2>
                  <p>Kelola daftar sekolah SMA/SMK/MA se-Kabupaten Banyumas.</p>
                </div>
                <button onClick={() => openAddModal('school')} className="btn btn-primary">
                  <Plus size={16} /> Daftarkan Sekolah
                </button>
              </div>

              <div className="admin-table-wrapper card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nama ROHIS & Sekolah</th>
                      <th>Ketua</th>
                      <th>Jumlah Anggota</th>
                      <th>Alamat</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchools.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <strong className="table-title">{s.name}</strong>
                          <span className="table-sub">{s.school}</span>
                        </td>
                        <td>{s.leader}</td>
                        <td><span className="badge badge-gold">{s.members} Siswa</span></td>
                        <td>{s.address}</td>
                        <td>
                          <div className="table-actions">
                            <button onClick={() => openEditModal('school', s)} className="btn-icon btn-icon-edit">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDeleteSchool(s.id, s.name)} className="btn-icon btn-icon-delete">
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
          )}

          {/* TEAM TAB */}
          {activeTab === 'team' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Struktur Pengurus ROKABA</h2>
                  <p>Kelola BPH dan 5 Divisi (SDM, Dakwah, HUMAS, Jurnalistik, DANUS).</p>
                </div>
                <div className="quick-actions">
                  <button onClick={() => openAddModal('member', 'bph')} className="btn btn-gold btn-sm">
                    <Plus size={15} /> + BPH
                  </button>
                  <button onClick={() => openAddModal('member', 'sdm')} className="btn btn-primary btn-sm">
                    <Plus size={15} /> + Divisi
                  </button>
                </div>
              </div>

              {/* BPH Table */}
              <div className="admin-subpanel card mb-4">
                <div className="subpanel-header">
                  <h3>Badan Pengurus Harian (BPH)</h3>
                  <button onClick={() => openAddModal('member', 'bph')} className="btn btn-outline btn-xs">
                    <Plus size={13} /> Tambah BPH
                  </button>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Jabatan</th>
                      <th>Asal Sekolah</th>
                      <th>Instagram</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.bph?.map((m) => (
                      <tr key={m.id}>
                        <td><strong>{m.name}</strong></td>
                        <td><span className="badge badge-gold">{m.role}</span></td>
                        <td>{m.school}</td>
                        <td>{m.instagram ? `@${m.instagram}` : '-'}</td>
                        <td>
                          <div className="table-actions">
                            <button onClick={() => openEditModal('member', m, 'bph')} className="btn-icon btn-icon-edit">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDeleteMember('bph', m.id, m.name)} className="btn-icon btn-icon-delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Divisions */}
              {team.divisions?.map((div) => (
                <div key={div.id} className="admin-subpanel card mb-4">
                  <div className="subpanel-header">
                    <h3>{div.name}</h3>
                    <button onClick={() => openAddModal('member', div.shortName || div.id)} className="btn btn-outline btn-xs">
                      <Plus size={13} /> Tambah ke {div.shortName}
                    </button>
                  </div>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>Jabatan</th>
                        <th>Asal Sekolah</th>
                        <th>Instagram</th>
                        <th style={{ textAlign: 'right' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {div.members?.map((m) => (
                        <tr key={m.id}>
                          <td><strong>{m.name}</strong></td>
                          <td><span className="badge badge-primary">{m.role || 'Anggota'}</span></td>
                          <td>{m.school}</td>
                          <td>{m.instagram ? `@${m.instagram}` : '-'}</td>
                          <td>
                            <div className="table-actions">
                              <button onClick={() => openEditModal('member', m, div.shortName || div.id)} className="btn-icon btn-icon-edit">
                                <Pencil size={16} />
                              </button>
                              <button onClick={() => handleDeleteMember(div.shortName || div.id, m.id, m.name)} className="btn-icon btn-icon-delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          {/* INSTAGRAM REELS TAB */}
          {activeTab === 'instagram' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Kelola Reels & Postingan Instagram (@rohis_banyumas)</h2>
                  <p>
                    Setiap ada Reel atau postingan baru di Instagram, perbarui di sini agar website langsung menampilkan konten terbaru secara real-time.
                  </p>
                </div>
                <div className="admin-header-actions">
                  <button
                    onClick={handleSyncInstagramLive}
                    className="btn btn-gold btn-sm"
                    disabled={isSyncingIg}
                    title="Ambil data profil terbaru langsung dari Instagram"
                  >
                    <RefreshCw size={15} className={isSyncingIg ? 'spin-icon' : ''} />
                    {isSyncingIg ? 'Menyinkronkan...' : 'Sinkronkan Live Profil IG'}
                  </button>
                  <a
                    href={siteSettings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <ExternalLink size={15} /> Buka Instagram
                  </a>
                  <button onClick={() => openAddModal('instagram')} className="btn btn-primary">
                    <Plus size={18} /> Tambah Reel Baru
                  </button>
                </div>
              </div>

              {/* Live Profile Summary Card */}
              <div className="card admin-ig-live-card mb-4">
                <div className="admin-ig-live-header">
                  <div className="admin-ig-live-avatar-wrap">
                    <img
                      src={instagramProfile?.avatar || logoImg}
                      alt="Avatar Rohis Banyumas"
                      className="admin-ig-live-avatar"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = logoImg;
                      }}
                    />
                  </div>
                  <div className="admin-ig-live-details">
                    <div className="admin-ig-live-handle-row">
                      <h3 className="admin-ig-live-handle">@{instagramProfile?.handle || 'rohis_banyumas'}</h3>
                      <span className="admin-ig-live-badge">
                        <span className="live-dot"></span> Real-Time Connected
                      </span>
                      {instagramProfile?.lastSynced && (
                        <span className="admin-ig-live-time">
                          Update: {new Date(instagramProfile.lastSynced).toLocaleTimeString('id-ID')}
                        </span>
                      )}
                    </div>
                    <div className="admin-ig-live-bio">
                      <div className="admin-ig-live-name">{instagramProfile?.displayName || 'Rohis Kabupaten Banyumas'}</div>
                      <div className="admin-ig-live-bio-text">
                        Official Account Rohis Kabupaten Banyumas<br />
                        Dibawah Naungan Kementerian Agama Kab. Banyumas (@kankemenagbanyumas)<br />
                        Email : {instagramProfile?.email || 'rohisbanyumas9@gmail.com'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Tips Box */}
              <div className="card admin-alert-card mb-4">
                <div className="alert-card-content">
                  <span className="alert-card-icon">💡</span>
                  <div>
                    <strong>Sinkronisasi Instan ke Website Publik:</strong>
                    <p>
                      Saat Anda mengunggah video Reel baru di Instagram <code>@rohis_banyumas</code>, klik tombol <strong>+ Tambah Reel Baru</strong> di atas, masukkan URL Reel dan link gambar sampul (atau link Google Drive). Begitu disimpan, video akan langsung muncul di barisan "Dokumentasi Reels & Video Resmi @rohis_banyumas terbaru" di halaman depan web publik tanpa perlu deploy ulang!
                    </p>
                  </div>
                </div>
              </div>

              {/* Reels Grid */}
              <div className="admin-ig-grid">
                {instagramReels.map((reel) => {
                  const coverImg = getDirectImageUrl(reel.image);
                  return (
                    <div key={reel.id} className="card admin-ig-card">
                      <div className="admin-ig-media">
                        <img src={coverImg} alt={reel.title} className="admin-ig-img" />
                        <span className="admin-ig-category">{reel.category}</span>
                        <div className="admin-ig-views">
                          <Play size={12} fill="white" />
                          <span>{reel.views} views</span>
                        </div>
                      </div>
                      <div className="admin-ig-info">
                        <h4 className="admin-ig-title">{reel.title}</h4>
                        <p className="admin-ig-tag">{reel.tag}</p>
                        <div className="admin-ig-stats">
                          <span>❤️ {reel.likes || 0} suka</span>
                          <span>💬 {reel.comments || 0} komentar</span>
                        </div>
                        <div className="admin-ig-actions">
                          <a
                            href={reel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-xs"
                            title="Tonton di Instagram"
                          >
                            <ExternalLink size={13} /> Tonton di IG
                          </a>
                          <button
                            onClick={() => openEditModal('instagram', reel)}
                            className="btn btn-primary-ghost btn-xs"
                            title="Edit Reel"
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteInstagram(reel.id, reel.title)}
                            className="btn btn-danger-ghost btn-xs"
                            title="Hapus Reel"
                          >
                            <Trash2 size={13} /> Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="tab-pane">
              <div className="admin-header-row">
                <div>
                  <h2>Pengaturan Akun & Sinkronisasi Cloud</h2>
                  <p>Ubah password admin dan kelola pencadangan cloud.</p>
                </div>
              </div>

              <div className="settings-layout">
                <div className="card settings-card">
                  <h3>Pengaturan Akun Admin</h3>
                  <form onSubmit={handleSaveSettings} className="settings-form">
                    <div className="form-group mb-3">
                      <label className="form-label">Username Admin</label>
                      <input
                        type="text"
                        className="form-input"
                        value={settingsForm.adminUsername}
                        onChange={(e) => setSettingsForm({ ...settingsForm, adminUsername: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Password Admin Baru</label>
                      <input
                        type="text"
                        className="form-input"
                        value={settingsForm.adminPassword}
                        onChange={(e) => setSettingsForm({ ...settingsForm, adminPassword: e.target.value })}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">Simpan Password</button>
                  </form>
                </div>

                <div className="card settings-card">
                  <h3>Cadangan Data & Pemulihan</h3>
                  <div className="backup-actions">
                    <div className="backup-box">
                      <div>
                        <strong>Unduh Backup JSON</strong>
                        <p>Simpan salinan seluruh data ke komputer.</p>
                      </div>
                      <button onClick={exportBackup} className="btn btn-gold btn-sm">
                        <Download size={16} /> Unduh
                      </button>
                    </div>

                    <div className="backup-box backup-danger-box">
                      <div>
                        <strong className="text-danger">Reset ke Data Default</strong>
                        <p>Kembalikan seluruh isi ke versi awal.</p>
                      </div>
                      <button onClick={handleReset} className="btn btn-danger-ghost btn-sm">
                        <RefreshCw size={15} /> Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL POPUP */}
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
                {modalType === 'instagram' && 'Reel Instagram (@rohis_banyumas)'}
              </h3>
              <button onClick={closeModal} className="btn-close-modal"><X size={18} /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-modal-form">
              {modalType === 'article' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Judul Artikel *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kategori</label>
                    <select
                      className="form-select"
                      value={formData.category || 'Kajian'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Motivasi">Motivasi</option>
                      <option value="Ilmu">Ilmu</option>
                      <option value="Kajian">Kajian</option>
                      <option value="Dakwah">Dakwah</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Penulis</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.author || ''}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Nama penulis atau Tim Dakwah ROHIS"
                    />
                  </div>

                  {/* FOTO SAMPUL / COVER ARTIKEL */}
                  <div className="form-group">
                    <label className="form-label">Foto Sampul / Cover Artikel (Opsional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Masukkan link Google Drive Foto (https://drive.google.com/file/d/...) atau URL Gambar (https://...)"
                      value={formData.image || formData.coverImage || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, image: val, coverImage: val });
                      }}
                    />
                  </div>

                  {(formData.image || formData.coverImage) && (
                    <div className="admin-cover-preview">
                      <span className="admin-cover-preview-label">Pratinjau Foto Sampul:</span>
                      <div className="admin-cover-preview-box">
                        <img
                          src={getDirectImageUrl(formData.image || formData.coverImage)}
                          alt="Pratinjau Cover"
                          onError={(e) => {
                            const driveId = extractGoogleDriveId(formData.image || formData.coverImage);
                            if (driveId) {
                              e.currentTarget.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200`;
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          onClick={() => setFormData({ ...formData, image: '', coverImage: '' })}
                        >
                          Hapus Sampul
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="admin-drive-tip" style={{ marginTop: '0.4rem', marginBottom: '1rem' }}>
                    💡 <strong>Tips Foto Sampul:</strong> Mendukung URL gambar langsung dan link Google Drive Foto. Jika menggunakan Google Drive, pastikan izin file diatur ke <u>"Siapa saja yang memiliki link"</u>.
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ringkasan (Excerpt)</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      placeholder="Ringkasan singkat yang tampil di kartu artikel..."
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Konten Lengkap *</label>
                    <textarea
                      rows={8}
                      className="form-textarea"
                      placeholder="Tulis materi artikel lengkap di sini..."
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}

              {modalType === 'event' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Nama Kegiatan *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal *</label>
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
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lokasi *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pemateri / Ustadz</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.speaker || ''}
                      onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                    />
                  </div>
                </>
              )}

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
                      <label className="form-label">Kategori Kegiatan</label>
                      <select
                        className="form-select"
                        value={formData.category || 'Kajian'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {galleryCategories.filter((c) => c !== 'Semua').map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tanggal / Waktu Kegiatan</label>
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
                          Tambahkan beberapa foto atau video untuk kegiatan ini. Mendukung <strong>Google Drive (Foto & Video)</strong>, Link YouTube, gambar web, dan file MP4.
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
                          <ImageIcon size={14} /> Foto (Drive / Gambar)
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
                          <Plus size={16} /> Tambah Media
                        </button>
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

              {modalType === 'school' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Nama ROHIS *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sekolah Lengkap *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.school || ''}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Ketua</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.leader || ''}
                      onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                    />
                  </div>
                </>
              )}

              {modalType === 'member' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Divisi</label>
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
                    <label className="form-label">Nama Lengkap *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jabatan *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.role || ''}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Instagram (tanpa @)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.instagram || ''}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    />
                  </div>
                </>
              )}

              {modalType === 'instagram' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Link Postingan / Reel Instagram *</label>
                    <input
                      type="url"
                      className="form-input"
                      value={formData.url || ''}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://www.instagram.com/reel/... atau https://www.instagram.com/p/..."
                      required
                    />
                    <small className="form-hint">Tautan langsung ke video Reel di akun @rohis_banyumas.</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Judul / Keterangan Reel *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Misal: Profil & Semangat Kader ROHIS Banyumas"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Kategori</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Misal: Kaderisasi, Dokumentasi, Kolaborasi, Syiar"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tagar / Hashtag</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.tag || ''}
                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                        placeholder="#RohisBanyumas #DakwahPelajar"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">URL Foto Sampul (Thumbnail) *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Bisa link gambar web, Google Drive, atau /instagram/reel-1.jpg"
                      required
                    />
                    <small className="form-hint">Mendukung file gambar dari link Google Drive publik atau URL gambar.</small>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Estimasi Tayangan (Views)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.views || ''}
                        onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                        placeholder="Misal: 4,415"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Jumlah Suka (Likes)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.likes ?? 0}
                        onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Jumlah Komentar</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.comments ?? 0}
                        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="admin-modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-outline">Batal</button>
                <button type="submit" className="btn btn-primary">
                  {editItem ? 'Simpan Perubahan' : 'Publikasikan ke Cloud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
