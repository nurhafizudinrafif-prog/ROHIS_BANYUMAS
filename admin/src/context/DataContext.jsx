import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { articles as initialArticles } from '../data/articles';
import { events as initialEvents } from '../data/events';
import { galleryItems as initialGalleryItems, galleryCategories as initialGalleryCategories } from '../data/gallery';
import { memberSchools as initialMemberSchools } from '../data/memberSchools';
import { team as initialTeam, structurePeriod, organizationFullName } from '../data/team';
import { instagramReels as initialInstagramReels, instagramProfile as initialInstagramProfile } from '../data/instagram';
import { programs as initialPrograms } from '../data/programs';
import { initialHomeContent } from '../data/homeContent';
import { initialLibrary } from '../data/library';
import { fetchCloudCMSData, saveCloudCMSData } from '../services/cloudSync';

const STORAGE_KEY = 'rohis_banyumas_cms_data_v2';

const defaultSettings = {
  adminUsername: 'rohis banyumas',
  adminPassword: 'rbk banyumas',
  email: 'info@rohisbanyumas.id',
  phone: '+62 812-3456-7890',
  whatsapp: '+62 812-3456-7890',
  address: 'Purwokerto, Kabupaten Banyumas, Jawa Tengah 53100',
  instagramUrl: 'https://www.instagram.com/rohis_banyumas/',
  youtubeUrl: 'https://youtube.com/@rohisbanyumas9?si=bJpq4dcozF81AHGr',
  period: structurePeriod,
  orgName: organizationFullName,
};

function loadStoredData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading data from localStorage:', err);
    return null;
  }
}

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const stored = loadStoredData();

  const [articles, setArticles] = useState(stored?.articles || initialArticles);
  const [events, setEvents] = useState(stored?.events || initialEvents);
  const [galleryItems, setGalleryItems] = useState(stored?.galleryItems || initialGalleryItems);
  const [galleryCategories] = useState(initialGalleryCategories);
  const [memberSchools, setMemberSchools] = useState(stored?.memberSchools || initialMemberSchools);
  const [team, setTeam] = useState(stored?.team || initialTeam);
  const [library, setLibrary] = useState(stored?.library || initialLibrary);
  const [instagramReels, setInstagramReels] = useState(stored?.instagramReels || initialInstagramReels);
  const [instagramProfile, setInstagramProfile] = useState(stored?.instagramProfile || initialInstagramProfile);
  const [homeContent, setHomeContent] = useState(stored?.homeContent || initialHomeContent);
  const [programs, setPrograms] = useState(stored?.programs || initialPrograms);
  const [siteSettings, setSiteSettings] = useState(() => {
    const raw = stored?.siteSettings;
    const settings = { ...defaultSettings, ...(raw || {}) };
    if (settings.adminUsername === 'admin') settings.adminUsername = 'rohis banyumas';
    if (settings.adminPassword === 'rohisbanyumas2026') settings.adminPassword = 'rbk banyumas';
    return settings;
  });

  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'saved' | 'error'
  const [lastCloudSync, setLastCloudSync] = useState(null);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  // --- Persist to Upstash Cloud Helper ---
  const persistToCloud = useCallback(async (overrides = {}) => {
    try {
      setSyncStatus('syncing');
      const payload = {
        articles,
        events,
        galleryItems,
        memberSchools,
        team,
        library,
        instagramReels,
        instagramProfile,
        siteSettings,
        homeContent,
        programs,
        ...overrides,
      };
      const ok = await saveCloudCMSData(payload);
      if (ok) {
        setSyncStatus('saved');
        setLastCloudSync(new Date());
        return true;
      } else {
        setSyncStatus('error');
        return false;
      }
    } catch (e) {
      console.warn('Persist to cloud error:', e);
      setSyncStatus('error');
      return false;
    }
  }, [articles, events, galleryItems, memberSchools, team, library, instagramReels, instagramProfile, siteSettings, homeContent, programs]);

  // Pull latest data from Upstash Cloud Database (called on initial mount or manual refresh)
  const syncFromCloud = useCallback(async () => {
    try {
      setSyncStatus('syncing');
      const cloudData = await fetchCloudCMSData();
      if (cloudData) {
        if (cloudData.articles) setArticles(cloudData.articles);
        if (cloudData.events) setEvents(cloudData.events);
        if (cloudData.galleryItems) setGalleryItems(cloudData.galleryItems);
        if (cloudData.memberSchools) setMemberSchools(cloudData.memberSchools);
        if (cloudData.team) setTeam(cloudData.team);
        if (cloudData.library && Array.isArray(cloudData.library)) setLibrary(cloudData.library);
        if (cloudData.homeContent) setHomeContent(cloudData.homeContent);
        if (cloudData.programs) setPrograms(cloudData.programs);
        if (cloudData.instagramLivePosts && cloudData.instagramLivePosts.length > 0) {
          setInstagramReels(cloudData.instagramLivePosts);
        } else if (cloudData.instagramReels) {
          setInstagramReels(cloudData.instagramReels);
        }
        if (cloudData.instagramProfile) setInstagramProfile(cloudData.instagramProfile);
        if (cloudData.siteSettings) {
          const cloudSettings = { ...cloudData.siteSettings };
          if (cloudSettings.adminUsername === 'admin') cloudSettings.adminUsername = 'rohis banyumas';
          if (cloudSettings.adminPassword === 'rohisbanyumas2026') cloudSettings.adminPassword = 'rbk banyumas';
          setSiteSettings((prev) => ({ ...prev, ...cloudSettings }));
        }
        setLastCloudSync(new Date());
        setSyncStatus('saved');
        return true;
      } else {
        setSyncStatus('idle');
        return false;
      }
    } catch (err) {
      console.warn('Sync from cloud error:', err);
      setSyncStatus('error');
      return false;
    } finally {
      setIsInitialLoadDone(true);
    }
  }, []);

  // Sync from Upstash Cloud Database ONCE on initial load.
  // Never auto-poll or refetch on window focus to prevent interrupting active admin edits.
  useEffect(() => {
    syncFromCloud();
  }, [syncFromCloud]);

  // Maintain local offline storage cache whenever state updates
  useEffect(() => {
    try {
      const payload = {
        articles,
        events,
        galleryItems,
        memberSchools,
        team,
        library,
        instagramReels,
        instagramProfile,
        siteSettings,
        homeContent,
        programs,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [articles, events, galleryItems, memberSchools, team, library, instagramReels, instagramProfile, siteSettings, homeContent, programs]);

  // Synchronize across open browser tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const remote = JSON.parse(e.newValue);
          if (remote.articles) setArticles(remote.articles);
          if (remote.events) setEvents(remote.events);
          if (remote.galleryItems) setGalleryItems(remote.galleryItems);
          if (remote.memberSchools) setMemberSchools(remote.memberSchools);
          if (remote.team) setTeam(remote.team);
          if (remote.library && Array.isArray(remote.library)) setLibrary(remote.library);
          if (remote.instagramReels) setInstagramReels(remote.instagramReels);
          if (remote.instagramProfile) setInstagramProfile(remote.instagramProfile);
          if (remote.siteSettings) setSiteSettings(remote.siteSettings);
          if (remote.homeContent) setHomeContent(remote.homeContent);
          if (remote.programs) setPrograms(remote.programs);
        } catch (err) {
          console.error('Cross-tab sync error:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- CRUD: Articles ---
  const addArticle = useCallback((article) => {
    const newArticle = {
      id: Date.now(),
      title: article.title || 'Artikel Baru',
      slug: article.slug || (article.title ? article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `artikel-${Date.now()}`),
      category: article.category || 'Kajian',
      date: article.date || new Date().toISOString().split('T')[0],
      author: article.author || 'Admin ROHIS',
      excerpt: article.excerpt || '',
      content: article.content || '',
      image: article.image || article.coverImage || null,
      coverImage: article.coverImage || article.image || null,
    };
    setArticles((prev) => {
      const updated = [newArticle, ...prev];
      persistToCloud({ articles: updated });
      return updated;
    });
    return newArticle;
  }, [persistToCloud]);

  const updateArticle = useCallback((id, updatedFields) => {
    setArticles((prev) => {
      const updated = prev.map((a) => {
        if (a.id === id) {
          const item = { ...a, ...updatedFields };
          if (updatedFields.title && !updatedFields.slug) {
            item.slug = updatedFields.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
          }
          return item;
        }
        return a;
      });
      persistToCloud({ articles: updated });
      return updated;
    });
  }, [persistToCloud]);

  const deleteArticle = useCallback((id) => {
    setArticles((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      persistToCloud({ articles: updated });
      return updated;
    });
  }, [persistToCloud]);

  // --- CRUD: Events ---
  const addEvent = useCallback((event) => {
    const newEvent = {
      id: Date.now(),
      title: event.title || 'Kegiatan Baru',
      date: event.date || new Date().toISOString().split('T')[0],
      time: event.time || '08:00 - 11:30 WIB',
      location: event.location || 'Purwokerto, Banyumas',
      speaker: event.speaker || null,
      type: event.type || 'Kajian',
      status: event.status || 'upcoming',
      description: event.description || '',
    };
    setEvents((prev) => {
      const updated = [newEvent, ...prev];
      persistToCloud({ events: updated });
      return updated;
    });
    return newEvent;
  }, [persistToCloud]);

  const updateEvent = useCallback((id, updatedFields) => {
    setEvents((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e));
      persistToCloud({ events: updated });
      return updated;
    });
  }, [persistToCloud]);

  const deleteEvent = useCallback((id) => {
    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      persistToCloud({ events: updated });
      return updated;
    });
  }, [persistToCloud]);

  // --- CRUD: Gallery Items ---
  const addGalleryItem = useCallback((item) => {
    const mediaList = Array.isArray(item.media) && item.media.length > 0
      ? item.media
      : (item.image ? [{ id: `m-${Date.now()}`, type: 'image', url: item.image, caption: item.title || '' }] : []);
    const cover = item.coverImage || item.image || (mediaList[0]?.url || '');
    const newItem = {
      id: Date.now(),
      title: item.title || 'Dokumentasi Baru',
      category: item.category || 'Kajian',
      image: cover,
      coverImage: cover,
      emoji: item.emoji || '📸',
      date: item.date || 'Terkini',
      description: item.description || '',
      media: mediaList,
    };
    setGalleryItems((prev) => {
      const updated = [newItem, ...prev];
      persistToCloud({ galleryItems: updated });
      return updated;
    });
    return newItem;
  }, [persistToCloud]);

  const updateGalleryItem = useCallback((id, updatedFields) => {
    setGalleryItems((prev) => {
      const updated = prev.map((g) => {
        if (g.id !== id) return g;
        const merged = { ...g, ...updatedFields };
        if (updatedFields.media && !updatedFields.coverImage) {
          merged.coverImage = updatedFields.media[0]?.url || merged.coverImage || merged.image || '';
        }
        if (merged.coverImage) {
          merged.image = merged.coverImage;
        }
        return merged;
      });
      persistToCloud({ galleryItems: updated });
      return updated;
    });
  }, [persistToCloud]);

  const deleteGalleryItem = useCallback((id) => {
    setGalleryItems((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      persistToCloud({ galleryItems: updated });
      return updated;
    });
  }, [persistToCloud]);

  // --- CRUD: Member Schools ---
  const addMemberSchool = useCallback((school) => {
    const newSchool = {
      id: Date.now(),
      name: school.name || 'ROHIS Sekolah Baru',
      school: school.school || 'Sekolah Baru',
      leader: school.leader || '-',
      members: Number(school.members) || 0,
      address: school.address || 'Kabupaten Banyumas',
      established: Number(school.established) || new Date().getFullYear(),
    };
    setMemberSchools((prev) => {
      const updated = [newSchool, ...prev];
      persistToCloud({ memberSchools: updated });
      return updated;
    });
    return newSchool;
  }, [persistToCloud]);

  const updateMemberSchool = useCallback((id, updatedFields) => {
    setMemberSchools((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updatedFields, members: Number(updatedFields.members ?? s.members) } : s));
      persistToCloud({ memberSchools: updated });
      return updated;
    });
  }, [persistToCloud]);

  const deleteMemberSchool = useCallback((id) => {
    setMemberSchools((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      persistToCloud({ memberSchools: updated });
      return updated;
    });
  }, [persistToCloud]);

  // --- CRUD: Team & Pengurus ---
  const addTeamMember = useCallback((targetDivisionKey, member) => {
    const newMember = {
      id: `member-${Date.now()}`,
      name: member.name || 'Nama Pengurus',
      role: member.role || 'Anggota',
      division: member.division || targetDivisionKey,
      school: member.school || '-',
      instagram: member.instagram || '',
      bio: member.bio || '',
    };

    setTeam((prev) => {
      let updated;
      if (targetDivisionKey === 'bph') {
        updated = {
          ...prev,
          bph: [...(prev.bph || []), newMember],
        };
      } else {
        const updatedDivisions = (prev.divisions || []).map((div) => {
          if (div.shortName?.toLowerCase() === targetDivisionKey.toLowerCase() || div.id === targetDivisionKey) {
            return {
              ...div,
              members: [...(div.members || []), newMember],
            };
          }
          return div;
        });
        updated = {
          ...prev,
          divisions: updatedDivisions,
        };
      }
      persistToCloud({ team: updated });
      return updated;
    });

    return newMember;
  }, [persistToCloud]);

  const updateTeamMember = useCallback((targetDivisionKey, memberId, updatedFields) => {
    setTeam((prev) => {
      let updated;
      if (targetDivisionKey === 'bph') {
        updated = {
          ...prev,
          bph: (prev.bph || []).map((m) => (m.id === memberId ? { ...m, ...updatedFields } : m)),
        };
      } else {
        const updatedDivisions = (prev.divisions || []).map((div) => {
          if (div.shortName?.toLowerCase() === targetDivisionKey.toLowerCase() || div.id === targetDivisionKey) {
            return {
              ...div,
              members: (div.members || []).map((m) => (m.id === memberId ? { ...m, ...updatedFields } : m)),
            };
          }
          return div;
        });
        updated = {
          ...prev,
          divisions: updatedDivisions,
        };
      }
      persistToCloud({ team: updated });
      return updated;
    });
  }, [persistToCloud]);

  const deleteTeamMember = useCallback((targetDivisionKey, memberId) => {
    setTeam((prev) => {
      let updated;
      if (targetDivisionKey === 'bph') {
        updated = {
          ...prev,
          bph: (prev.bph || []).filter((m) => m.id !== memberId),
        };
      } else {
        const updatedDivisions = (prev.divisions || []).map((div) => {
          if (div.shortName?.toLowerCase() === targetDivisionKey.toLowerCase() || div.id === targetDivisionKey) {
            return {
              ...div,
              members: (div.members || []).filter((m) => m.id !== memberId),
            };
          }
          return div;
        });
        updated = {
          ...prev,
          divisions: updatedDivisions,
        };
      }
      persistToCloud({ team: updated });
      return updated;
    });
  }, [persistToCloud]);

  // --- Home Content & Programs ---
  const updateHomeContent = useCallback(async (newContent) => {
    let finalHome;
    setHomeContent((prev) => {
      const merged = { ...prev };
      if (newContent.hero) merged.hero = { ...prev.hero, ...newContent.hero };
      if (newContent.about) merged.about = { ...prev.about, ...newContent.about };
      if (newContent.closing) merged.closing = { ...prev.closing, ...newContent.closing };
      if (newContent.stats) merged.stats = newContent.stats;
      if (newContent.timeline) merged.timeline = newContent.timeline;
      finalHome = merged;
      return merged;
    });

    if (finalHome) {
      await persistToCloud({ homeContent: finalHome });
    }
  }, [persistToCloud]);

  const updateProgram = useCallback((id, updatedFields) => {
    setPrograms((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
      persistToCloud({ programs: updated });
      return updated;
    });
  }, [persistToCloud]);

  // --- Settings ---
  const updateSettings = useCallback((newSettings) => {
    setSiteSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      persistToCloud({ siteSettings: updated });
      return updated;
    });
  }, [persistToCloud]);

  const syncNow = useCallback(() => {
    return persistToCloud();
  }, [persistToCloud]);

  // --- Reset to Default Seed Data ---
  const resetToDefault = useCallback(() => {
    setArticles(initialArticles);
    setEvents(initialEvents);
    setGalleryItems(initialGalleryItems);
    setMemberSchools(initialMemberSchools);
    setTeam(initialTeam);
    setSiteSettings(defaultSettings);
    setHomeContent(initialHomeContent);
    setPrograms(initialPrograms);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // --- Backup & Restore ---
  const exportBackup = useCallback(() => {
    const backupData = {
      articles,
      events,
      galleryItems,
      memberSchools,
      team,
      siteSettings,
      homeContent,
      programs,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_rohis_banyumas_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [articles, events, galleryItems, memberSchools, team, siteSettings, homeContent, programs]);

  const importBackup = useCallback((jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.articles) setArticles(data.articles);
      if (data.events) setEvents(data.events);
      if (data.galleryItems) setGalleryItems(data.galleryItems);
      if (data.memberSchools) setMemberSchools(data.memberSchools);
      if (data.team) setTeam(data.team);
      if (data.instagramReels) setInstagramReels(data.instagramReels);
      if (data.homeContent) setHomeContent(data.homeContent);
      if (data.programs) setPrograms(data.programs);
      if (data.siteSettings) setSiteSettings((prev) => ({ ...prev, ...data.siteSettings }));
      return { success: true, message: 'Data backup berhasil dipulihkan!' };
    } catch (err) {
      return { success: false, message: 'Format file JSON backup tidak valid: ' + err.message };
    }
  }, []);

  // --- CRUD: Instagram Reels ---
  const addInstagramReel = useCallback((reel) => {
    const newReel = {
      id: reel.id || `ig-reel-${Date.now()}`,
      type: 'reel',
      title: reel.title || 'Reel Rohis Banyumas',
      category: reel.category || 'Reels',
      tag: reel.tag || '#RohisBanyumas',
      image: reel.image || '/instagram/reel-1.jpg',
      views: reel.views || '1,000',
      likes: Number(reel.likes) || 0,
      comments: Number(reel.comments) || 0,
      url: reel.url || 'https://www.instagram.com/rohis_banyumas/',
    };
    setInstagramReels((prev) => [newReel, ...prev]);
    return newReel;
  }, []);

  const updateInstagramReel = useCallback((id, updatedData) => {
    setInstagramReels((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  }, []);

  const deleteInstagramReel = useCallback((id) => {
    setInstagramReels((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // --- CRUD: E-Library ---
  const addLibraryItem = useCallback((item) => {
    const newItem = {
      id: item.id || `lib-${Date.now()}`,
      title: item.title || 'Materi Baru',
      category: item.category || 'Umum',
      fileUrl: item.fileUrl || '#',
      type: item.type || 'pdf',
      size: item.size || '1.0 MB',
      uploadedAt: new Date().toISOString(),
    };
    setLibrary((prev) => {
      const updated = [newItem, ...prev];
      persistToCloud({ library: updated });
      return updated;
    });
    return newItem;
  }, [persistToCloud]);

  const updateLibraryItem = useCallback((id, updatedFields) => {
    setLibrary((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
      persistToCloud({ library: updated });
      return updated;
    });
  }, [persistToCloud]);

  const deleteLibraryItem = useCallback((id) => {
    setLibrary((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      persistToCloud({ library: updated });
      return updated;
    });
  }, [persistToCloud]);

  const value = {
    // Data
    articles,
    events,
    galleryItems,
    galleryCategories,
    memberSchools,
    team,
    library,
    instagramReels,
    instagramProfile,
    siteSettings,
    homeContent,
    programs,
    structurePeriod: siteSettings.period || structurePeriod,
    organizationFullName: siteSettings.orgName || organizationFullName,

    // CRUD
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

    addInstagramReel,
    updateInstagramReel,
    deleteInstagramReel,
    setInstagramReels,
    setInstagramProfile,

    updateHomeContent,
    updateProgram,
    updateSettings,
    persistToCloud,
    saveCloudCMSData,
    syncStatus,
    lastCloudSync,
    syncNow,
    refreshFromCloud: syncFromCloud,
    resetToDefault,
    exportBackup,
    importBackup,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
