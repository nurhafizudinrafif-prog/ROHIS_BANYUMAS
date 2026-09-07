import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { articles as initialArticles } from '../data/articles';
import { events as initialEvents } from '../data/events';
import { galleryItems as initialGalleryItems, galleryCategories as initialGalleryCategories } from '../data/gallery';
import { memberSchools as initialMemberSchools } from '../data/memberSchools';
import { team as initialTeam, structurePeriod, organizationFullName } from '../data/team';
import { fetchCloudCMSData, saveCloudCMSData } from '../services/cloudSync';

const STORAGE_KEY = 'rohis_banyumas_cms_data_v1';

const defaultSettings = {
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
  const [siteSettings, setSiteSettings] = useState({ ...defaultSettings, ...(stored?.siteSettings || {}) });

  // Sync from Upstash Cloud Database on load, periodically, and on tab focus
  useEffect(() => {
    let isMounted = true;
    async function syncFromCloud() {
      const cloudData = await fetchCloudCMSData();
      if (cloudData && isMounted) {
        if (cloudData.articles) setArticles(cloudData.articles);
        if (cloudData.events) setEvents(cloudData.events);
        if (cloudData.galleryItems) setGalleryItems(cloudData.galleryItems);
        if (cloudData.memberSchools) setMemberSchools(cloudData.memberSchools);
        if (cloudData.team) setTeam(cloudData.team);
        if (cloudData.siteSettings) setSiteSettings((prev) => ({ ...prev, ...cloudData.siteSettings }));
      }
    }

    syncFromCloud();

    const interval = setInterval(syncFromCloud, 30000);
    window.addEventListener('focus', syncFromCloud);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', syncFromCloud);
    };
  }, []);

  // Save to localStorage whenever any state changes
  useEffect(() => {
    try {
      const payload = {
        articles,
        events,
        galleryItems,
        memberSchools,
        team,
        siteSettings,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [articles, events, galleryItems, memberSchools, team, siteSettings]);

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
          if (remote.siteSettings) setSiteSettings(remote.siteSettings);
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
      image: article.image || null,
    };
    setArticles((prev) => [newArticle, ...prev]);
    return newArticle;
  }, []);

  const updateArticle = useCallback((id, updatedFields) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...updatedFields };
          if (updatedFields.title && !updatedFields.slug) {
            updated.slug = updatedFields.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
          }
          return updated;
        }
        return a;
      })
    );
  }, []);

  const deleteArticle = useCallback((id) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }, []);

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
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id, updatedFields) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e)));
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

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
    setGalleryItems((prev) => [newItem, ...prev]);
    return newItem;
  }, []);

  const updateGalleryItem = useCallback((id, updatedFields) => {
    setGalleryItems((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const merged = { ...g, ...updatedFields };
        if (updatedFields.media && !updatedFields.coverImage) {
          merged.coverImage = updatedFields.media[0]?.url || merged.coverImage || merged.image || '';
        }
        if (merged.coverImage) {
          merged.image = merged.coverImage;
        }
        return merged;
      })
    );
  }, []);

  const deleteGalleryItem = useCallback((id) => {
    setGalleryItems((prev) => prev.filter((g) => g.id !== id));
  }, []);

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
    setMemberSchools((prev) => [newSchool, ...prev]);
    return newSchool;
  }, []);

  const updateMemberSchool = useCallback((id, updatedFields) => {
    setMemberSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields, members: Number(updatedFields.members ?? s.members) } : s))
    );
  }, []);

  const deleteMemberSchool = useCallback((id) => {
    setMemberSchools((prev) => prev.filter((s) => s.id !== id));
  }, []);

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
      if (targetDivisionKey === 'bph') {
        return {
          ...prev,
          bph: [...prev.bph, newMember],
        };
      }

      // Add to specific division under divisions array
      const updatedDivisions = prev.divisions.map((div) => {
        if (div.shortName?.toLowerCase() === targetDivisionKey.toLowerCase() || div.id === targetDivisionKey) {
          return {
            ...div,
            members: [...div.members, newMember],
          };
        }
        return div;
      });

      return {
        ...prev,
        divisions: updatedDivisions,
      };
    });

    return newMember;
  }, []);

  const updateTeamMember = useCallback((targetDivisionKey, memberId, updatedFields) => {
    setTeam((prev) => {
      if (targetDivisionKey === 'bph') {
        return {
          ...prev,
          bph: prev.bph.map((m) => (m.id === memberId ? { ...m, ...updatedFields } : m)),
        };
      }

      const updatedDivisions = prev.divisions.map((div) => {
        if (div.shortName?.toLowerCase() === targetDivisionKey.toLowerCase() || div.id === targetDivisionKey) {
          return {
            ...div,
            members: div.members.map((m) => (m.id === memberId ? { ...m, ...updatedFields } : m)),
          };
        }
        return div;
      });

      return {
        ...prev,
        divisions: updatedDivisions,
      };
    });
  }, []);

  const deleteTeamMember = useCallback((targetDivisionKey, memberId) => {
    setTeam((prev) => {
      if (targetDivisionKey === 'bph') {
        return {
          ...prev,
          bph: prev.bph.filter((m) => m.id !== memberId),
        };
      }

      const updatedDivisions = prev.divisions.map((div) => {
        if (div.shortName?.toLowerCase() === targetDivisionKey.toLowerCase() || div.id === targetDivisionKey) {
          return {
            ...div,
            members: div.members.filter((m) => m.id !== memberId),
          };
        }
        return div;
      });

      return {
        ...prev,
        divisions: updatedDivisions,
      };
    });
  }, []);

  // --- Settings ---
  const updateSettings = useCallback((newSettings) => {
    setSiteSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // --- Reset to Default Seed Data ---
  const resetToDefault = useCallback(() => {
    setArticles(initialArticles);
    setEvents(initialEvents);
    setGalleryItems(initialGalleryItems);
    setMemberSchools(initialMemberSchools);
    setTeam(initialTeam);
    setSiteSettings(defaultSettings);
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
  }, [articles, events, galleryItems, memberSchools, team, siteSettings]);

  const importBackup = useCallback((jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.articles) setArticles(data.articles);
      if (data.events) setEvents(data.events);
      if (data.galleryItems) setGalleryItems(data.galleryItems);
      if (data.memberSchools) setMemberSchools(data.memberSchools);
      if (data.team) setTeam(data.team);
      if (data.siteSettings) setSiteSettings((prev) => ({ ...prev, ...data.siteSettings }));
      return { success: true, message: 'Data backup berhasil dipulihkan!' };
    } catch (err) {
      return { success: false, message: 'Format file JSON backup tidak valid: ' + err.message };
    }
  }, []);

  const value = {
    // Data
    articles,
    events,
    galleryItems,
    galleryCategories,
    memberSchools,
    team,
    siteSettings,
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

    updateSettings,
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
