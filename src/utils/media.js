// Utilitas pemrosesan media (Foto & Video)

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
  if (isVideoMedia(mediaItem)) {
    const ytThumb = getYouTubeThumbnail(mediaItem.url);
    if (ytThumb) return ytThumb;
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
  if (item.coverImage) return item.coverImage;
  const mediaList = normalizeMediaList(item);
  if (mediaList.length > 0) {
    return getMediaThumbnail(mediaList[0]);
  }
  return item.image || '';
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
