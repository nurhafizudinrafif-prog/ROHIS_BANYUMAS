// Utilitas pemrosesan media (Foto & Video) untuk Admin
// Mendukung Google Drive (Foto & Video), YouTube, dan Direct Media

// ============================================
// GOOGLE DRIVE HELPERS
// ============================================
export function extractGoogleDriveId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  // Pattern 1: /file/d/FILE_ID
  const match1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match1) return match1[1];
  // Pattern 2: id=FILE_ID
  const match2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2) return match2[1];
  // Pattern 3: /open?id=FILE_ID
  const match3 = trimmed.match(/\/open\?id=([a-zA-Z0-9_-]+)/);
  if (match3) return match3[1];
  // Pattern 4: /d/FILE_ID
  const match4 = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match4) return match4[1];
  return null;
}

export function isGoogleDriveUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return (
    url.includes('drive.google.com') ||
    url.includes('docs.google.com') ||
    url.includes('googleusercontent.com')
  );
}

export function getGoogleDriveEmbedUrl(url) {
  const fileId = extractGoogleDriveId(url);
  if (!fileId) return null;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export function getGoogleDriveDirectImageUrl(url) {
  const fileId = extractGoogleDriveId(url);
  if (!fileId) return url;
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

export function getGoogleDriveThumbnail(url) {
  const fileId = extractGoogleDriveId(url);
  if (!fileId) return null;
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`;
}

export function getDirectImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  if (isGoogleDriveUrl(url)) {
    return getGoogleDriveDirectImageUrl(url);
  }
  return url;
}

// ============================================
// YOUTUBE HELPERS
// ============================================
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
}

export function getYouTubeEmbedUrl(url) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

export function getYouTubeThumbnail(url) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// ============================================
// GENERAL MEDIA HELPERS
// ============================================
export function isVideoMedia(mediaItem) {
  if (!mediaItem) return false;
  if (mediaItem.type === 'video') return true;
  const url = (mediaItem.url || '').toLowerCase();
  if (url.includes('youtube.com') || url.includes('youtu.be')) return true;
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) return true;
  return false;
}

export function getMediaThumbnail(mediaItem) {
  if (!mediaItem || !mediaItem.url) return '';
  const url = mediaItem.url;
  if (isVideoMedia(mediaItem)) {
    const ytThumb = getYouTubeThumbnail(url);
    if (ytThumb) return ytThumb;
    const driveThumb = getGoogleDriveThumbnail(url);
    if (driveThumb) return driveThumb;
  } else {
    if (isGoogleDriveUrl(url)) {
      const driveThumb = getGoogleDriveThumbnail(url);
      if (driveThumb) return driveThumb;
    }
  }
  return mediaItem.url;
}

export function normalizeMediaList(item) {
  if (!item) return [];
  if (Array.isArray(item.media) && item.media.length > 0) {
    return item.media.map((m, idx) => ({
      id: m.id || `m-${idx}`,
      type: m.type || (isVideoMedia(m) ? 'video' : 'image'),
      url: m.url || '',
      caption: m.caption || '',
    }));
  }
  if (item.image) {
    return [
      {
        id: 'm-default',
        type: 'image',
        url: item.image,
        caption: item.title || '',
      },
    ];
  }
  return [];
}

export function getCoverMedia(item) {
  if (!item) return '';
  if (item.coverImage) {
    return getDirectImageUrl(item.coverImage);
  }
  const mediaList = normalizeMediaList(item);
  if (mediaList.length > 0) {
    return getMediaThumbnail(mediaList[0]);
  }
  return getDirectImageUrl(item.image || '');
}

export function getMediaSummary(item) {
  const mediaList = normalizeMediaList(item);
  let photos = 0;
  let videos = 0;
  for (const m of mediaList) {
    if (isVideoMedia(m)) {
      videos++;
    } else {
      photos++;
    }
  }
  return {
    total: mediaList.length,
    photos,
    videos,
    label: [
      photos > 0 ? `${photos} Foto` : null,
      videos > 0 ? `${videos} Video` : null,
    ].filter(Boolean).join(' • ') || '0 Media',
  };
}
