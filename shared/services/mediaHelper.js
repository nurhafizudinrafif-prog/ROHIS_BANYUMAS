/**
 * Media Helper - Handles Google Drive (Photos & Videos), YouTube, TikTok, Instagram & Direct Media
 * Enhanced with multi-tier thumbnail fallbacks, platform detection, and no-referrer support.
 */

/**
 * Extracts Google Drive ID from any Drive link or raw ID
 */
export function extractDriveId(input = '') {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();

  // Pattern: /file/d/FILE_ID/...
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (fileMatch && fileMatch[1]) return fileMatch[1];

  // Pattern: ?id=FILE_ID or &id=FILE_ID or /open?id=FILE_ID
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (idMatch && idMatch[1]) return idMatch[1];

  // Pattern: /d/FILE_ID
  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/i);
  if (dMatch && dMatch[1]) return dMatch[1];

  // Pattern: /folders/FOLDER_ID
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/i);
  if (folderMatch && folderMatch[1]) return folderMatch[1];

  // Pattern: /thumbnail?id=FILE_ID
  const thumbMatch = trimmed.match(/\/thumbnail\?id=([a-zA-Z0-9_-]+)/i);
  if (thumbMatch && thumbMatch[1]) return thumbMatch[1];

  // Raw Drive ID: 15+ alphanumeric chars without slashes or dots
  if (!trimmed.includes('/') && !trimmed.includes('.') && trimmed.length >= 15) {
    return trimmed;
  }

  return '';
}

/**
 * Checks if a string is or contains a Google Drive URL
 */
export function isDriveUrl(input = '') {
  if (!input || typeof input !== 'string') return false;
  return (
    input.includes('drive.google.com') ||
    input.includes('docs.google.com') ||
    input.includes('lh3.googleusercontent.com') ||
    !!extractDriveId(input)
  );
}

/**
 * Official Google Drive Thumbnail CDN (Requires referrerpolicy="no-referrer")
 */
export function getDriveThumbnailUrl(driveId, size = 1200) {
  if (!driveId) return '';
  return `https://drive.google.com/thumbnail?id=${driveId}&sz=w${size}`;
}

/**
 * Secondary Drive thumbnail fallback (User Content CDN)
 */
export function getDriveFallbackThumbnailUrl(driveId, size = 1000) {
  if (!driveId) return '';
  return `https://lh3.googleusercontent.com/d/${driveId}=w${size}`;
}

/**
 * Tertiary Drive download/view fallback
 */
export function getDriveTertiaryThumbnailUrl(driveId) {
  if (!driveId) return '';
  return `https://drive.google.com/uc?export=view&id=${driveId}`;
}

/**
 * Embed URL for Google Drive preview (video player iframe & document preview)
 */
export function getDrivePreviewUrl(driveId) {
  if (!driveId) return '';
  return `https://drive.google.com/file/d/${driveId}/preview`;
}

/**
 * Direct file view/download link on Google Drive
 */
export function getDriveDirectUrl(driveId) {
  if (!driveId) return '';
  return `https://drive.google.com/file/d/${driveId}/view?usp=sharing`;
}

/**
 * Extracts TikTok video ID
 */
export function extractTikTokId(input = '') {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  const match = trimmed.match(/tiktok\.com\/(?:@[^/]+\/video\/|v\/|embed\/v2\/)(\d+)/i);
  return match && match[1] ? match[1] : '';
}

/**
 * Extracts Instagram shortcode (Reels / Posts / TV)
 */
export function extractInstagramCode(input = '') {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  const match = trimmed.match(/instagram\.com\/(?:p|reel|reels|tv)\/([a-zA-Z0-9_-]+)/i);
  return match && match[1] ? match[1] : '';
}

/**
 * Extracts YouTube 11-char video ID
 */
export function extractYouTubeId(input = '') {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  return match && match[1] ? match[1] : '';
}

/**
 * Helper to parse any general image URL (converts Drive links to direct thumbnail URL)
 */
export function parseImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  const driveId = extractDriveId(trimmed);
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }
  return trimmed;
}

/**
 * Comprehensive parser for Gallery and Media items
 * Supports: Google Drive (Photos & Videos), TikTok, Instagram, YouTube, and Direct media.
 */
export function parseMediaItem(item) {
  if (!item) {
    return {
      mediaType: 'image',
      source: 'direct',
      platformName: 'Foto',
      isDrive: false,
      driveId: '',
      thumbnailUrl: '',
      fallbackThumbnailUrl: '',
      tertiaryThumbnailUrl: '',
      embedUrl: '',
      directUrl: '',
      originalUrl: '',
    };
  }

  const rawInput =
    item.driveId ||
    item.url ||
    item.videoUrl ||
    item.link ||
    item.fileUrl ||
    item.thumbnail ||
    item.image ||
    '';

  const trimmed = typeof rawInput === 'string' ? rawInput.trim() : '';

  // 1. YouTube Source
  const ytId = extractYouTubeId(trimmed);
  if (ytId) {
    return {
      mediaType: 'video',
      source: 'youtube',
      platformName: 'YouTube',
      isDrive: false,
      driveId: '',
      thumbnailUrl: item.thumbnail || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      fallbackThumbnailUrl: `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1`,
      directUrl: `https://www.youtube.com/watch?v=${ytId}`,
      originalUrl: trimmed,
    };
  }

  // 2. TikTok Source
  const isTikTok = /tiktok\.com/i.test(trimmed);
  if (isTikTok) {
    const ttId = extractTikTokId(trimmed);
    return {
      mediaType: 'video',
      source: 'tiktok',
      platformName: 'TikTok',
      isDrive: false,
      driveId: '',
      thumbnailUrl: item.thumbnail || '',
      fallbackThumbnailUrl: '',
      embedUrl: ttId ? `https://www.tiktok.com/player/v1/${ttId}?autoplay=0` : trimmed,
      directUrl: trimmed,
      originalUrl: trimmed,
      aspectRatio: '9/16',
    };
  }

  // 3. Instagram Source (Reels & Posts)
  const isInstagram = /instagram\.com/i.test(trimmed);
  if (isInstagram) {
    const igCode = extractInstagramCode(trimmed);
    return {
      mediaType: 'video',
      source: 'instagram',
      platformName: 'Instagram',
      isDrive: false,
      driveId: '',
      thumbnailUrl: item.thumbnail || '',
      fallbackThumbnailUrl: '',
      embedUrl: igCode ? `https://www.instagram.com/p/${igCode}/embed/` : trimmed,
      directUrl: trimmed,
      originalUrl: trimmed,
      aspectRatio: 'instagram',
    };
  }

  // 4. Google Drive Source
  const driveId = extractDriveId(trimmed) || extractDriveId(item.thumbnail) || extractDriveId(item.image) || '';
  if (driveId) {
    const categoryLower = (item.category || '').toLowerCase();
    const titleLower = (item.title || '').toLowerCase();
    const isVideoExplicit = item.mediaType === 'video' || item.type === 'video' || categoryLower === 'video' || categoryLower.includes('video');
    const isVideoHint =
      trimmed.includes('.mp4') ||
      trimmed.includes('.mov') ||
      trimmed.includes('.mkv') ||
      trimmed.includes('.webm') ||
      titleLower.includes('video') ||
      titleLower.includes('aftermovie');
    const isVideo = isVideoExplicit || isVideoHint;

    const driveThumb = getDriveThumbnailUrl(driveId);
    const driveFallback = getDriveFallbackThumbnailUrl(driveId);
    const driveTertiary = getDriveTertiaryThumbnailUrl(driveId);
    const drivePreview = getDrivePreviewUrl(driveId);
    const driveDirect = getDriveDirectUrl(driveId);

    const thumb = item.thumbnail && !isDriveUrl(item.thumbnail)
      ? item.thumbnail
      : driveThumb;

    return {
      mediaType: isVideo ? 'video' : 'image',
      source: 'gdrive',
      platformName: isVideo ? 'Google Drive Video' : 'Google Drive Foto',
      isDrive: true,
      driveId,
      thumbnailUrl: thumb,
      fallbackThumbnailUrl: driveFallback,
      tertiaryThumbnailUrl: driveTertiary,
      embedUrl: drivePreview,
      directUrl: driveDirect,
      originalUrl: trimmed,
    };
  }

  // 5. Direct Video Files (.mp4, .mov, etc.)
  const isDirectVideo = /\.(mp4|webm|mov|mkv|m4v)(\?.*)?$/i.test(trimmed) || item.mediaType === 'video';
  if (isDirectVideo) {
    return {
      mediaType: 'video',
      source: 'direct-video',
      platformName: 'Video',
      isDrive: false,
      driveId: '',
      thumbnailUrl: item.thumbnail || '',
      fallbackThumbnailUrl: '',
      embedUrl: trimmed,
      directUrl: trimmed,
      originalUrl: trimmed,
    };
  }

  // 6. Regular Image
  const regularThumb = item.thumbnail || item.image || trimmed;
  return {
    mediaType: 'image',
    source: 'direct',
    platformName: 'Foto',
    isDrive: false,
    driveId: '',
    thumbnailUrl: regularThumb,
    fallbackThumbnailUrl: regularThumb,
    tertiaryThumbnailUrl: regularThumb,
    embedUrl: regularThumb,
    directUrl: regularThumb,
    originalUrl: trimmed,
  };
}
