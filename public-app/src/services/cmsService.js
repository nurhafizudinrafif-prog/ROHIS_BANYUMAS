import { fetchAllData, fetchData, saveData } from '@shared/services/cloudSync.js';
import { fallbackData } from '@shared/data/fallback.js';
import {
    extractDriveId,
    getDriveThumbnailUrl,
    parseImageUrl,
} from '@shared/services/mediaHelper.js';
import { normalizeTeamData } from '../components/ui/SoftUI';
import { localDocumentationPhoto } from './documentationPhotos';

export function getDriveImageUrl(raw = '') {
    if (!raw) return '';
    if (typeof raw !== 'string') return '';
    const trimmed = raw.trim();
    if (!trimmed) return '';
    const localPhoto = localDocumentationPhoto(trimmed);
    if (localPhoto) return localPhoto;
    if (trimmed.startsWith('/')) return trimmed;
    const driveId = extractDriveId(trimmed);
    if (driveId) {
        return getDriveThumbnailUrl(driveId, 1400);
    }
    return parseImageUrl(trimmed) || trimmed;
}

function mapRawToCmsShape(source = {}) {
    const home = source['rokaba:home'] || fallbackData['rokaba:home'] || {};
    const teamRaw = source['rokaba:team'] || fallbackData['rokaba:team'] || null;
    const { allMembers } = normalizeTeamData(teamRaw);

    return {
        homeHero: home.hero || home.homeHero || {},
        homeStats: home.stats || home.homeStats || [],
        homeWelcome: home.welcome || home.homeWelcome || {},
        homeAbout: home.about || home.homeAbout || {},
        homePrograms:
            home.programs ||
            home.homePrograms ||
            source['rokaba:programs'] ||
            fallbackData['rokaba:programs'] ||
            [],
        homeTimeline: home.timeline || home.homeTimeline || [],
        homeCta: home.cta || home.homeCta || {},
        sectionHeaders: home.sectionHeaders || {},
        newsList: source['rokaba:news'] || fallbackData['rokaba:news'] || [],
        articles:
            source['rokaba:articles'] || fallbackData['rokaba:articles'] || [],
        events: source['rokaba:events'] || fallbackData['rokaba:events'] || [],
        schools:
            source['rokaba:schools'] || fallbackData['rokaba:schools'] || [],
        gallery:
            source['rokaba:gallery'] || fallbackData['rokaba:gallery'] || [],
        qna:
            source['rokaba:questions'] ||
            fallbackData['rokaba:questions'] ||
            [],
        members: allMembers,
        settings:
            source['rokaba:settings'] || fallbackData['rokaba:settings'] || {},
    };
}

export async function fetchCmsData() {
    try {
        const all = await fetchAllData();
        return mapRawToCmsShape(all || fallbackData);
    } catch {
        return mapRawToCmsShape(fallbackData);
    }
}

export async function submitQuestion({ name, category, question }) {
    try {
        const existing =
            (await fetchData('rokaba:questions')) ||
            fallbackData['rokaba:questions'] ||
            [];
        const list = Array.isArray(existing) ? [...existing] : [];
        const newEntry = {
            id: `q-${Date.now()}`,
            name: name || 'Anonim',
            category: category || 'Keislaman',
            question,
            answer: '',
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        list.unshift(newEntry);
        await saveData('rokaba:questions', list);
        return { success: true, item: newEntry };
    } catch (err) {
        return { success: false, error: err?.message };
    }
}
