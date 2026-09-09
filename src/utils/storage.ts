import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityAttempt, Chapter, Progress } from '../types';
import type { ComicScenario } from './aiScenario';

const CHAPTERS_KEY = '@ethicore_chapters';
const PROGRESS_KEY = '@ethicore_progress';
const LAST_TOPIC_KEY = '@ethicore_last_topic';
const ACTIVITY_ATTEMPTS_KEY = '@ethicore_activity_attempts';
const DATA_VERSION_KEY = '@ethicore_data_version';
const COMPLETION_MODAL_KEY = '@ethicore_completion_modal_dismissed';
const TOPIC_NOTES_KEY = '@ethicore_topic_notes';

// Increment when course structure changes (questions added/removed, etc)
const CURRENT_DATA_VERSION = 8;

export interface LastVisitedTopic {
  chapterId: number;
  topicId: string;
  progress?: number;
}

export const saveChapters = async (chapters: Chapter[]): Promise<void> => {
  try {
    // Ensure we don't persist duplicate chapters (preserve first occurrence)
    const seen = new Set<number>();
    const uniqueChapters = chapters.filter(ch => {
      if (seen.has(ch.id)) return false;
      seen.add(ch.id);
      return true;
    });
    // DEBUG: log chapter order when saving
    try {
      console.log('saveChapters: saving order ->', uniqueChapters.map(c => c.id));
    } catch (e) {}
    await AsyncStorage.setItem(CHAPTERS_KEY, JSON.stringify(uniqueChapters));
    await AsyncStorage.setItem(DATA_VERSION_KEY, String(CURRENT_DATA_VERSION));
    const metadata = await getCacheMetadata();
    metadata.chapters = { timestamp: Date.now(), synced: false };
    await AsyncStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Error saving chapters:', error);
  }
};

export const loadChapters = async (): Promise<Chapter[] | null> => {
  try {
    const storedVersion = await AsyncStorage.getItem(DATA_VERSION_KEY);
    if (storedVersion !== String(CURRENT_DATA_VERSION)) {
      return null;
    }
    const data = await AsyncStorage.getItem(CHAPTERS_KEY);
    try {
      if (data) {
        const parsed = JSON.parse(data) as Chapter[];
        // Deduplicate loaded chapters, preserving first occurrence
        const seen = new Set<number>();
        const unique = parsed.filter(c => {
          if (seen.has(c.id)) return false;
          seen.add(c.id);
          return true;
        });
        try { console.log('loadChapters: loaded order ->', parsed.map((c: Chapter) => c.id)); } catch (e) {}
        if (unique.length !== parsed.length) {
          try { console.log('loadChapters: deduped order ->', unique.map(c => c.id)); } catch (e) {}
        }
        return unique;
      } else {
        try { console.log('loadChapters: no chapters saved'); } catch (e) {}
        return null;
      }
    } catch (e) {
      console.error('loadChapters parse/dedupe error:', e);
      return null;
    }
  } catch (error) {
    console.error('Error loading chapters:', error);
    return null;
  }
};

export const saveProgress = async (progress: Progress): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    const metadata = await getCacheMetadata();
    metadata.progress = { timestamp: Date.now(), synced: false };
    await AsyncStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const saveLastVisitedTopic = async (topic: LastVisitedTopic | null): Promise<void> => {
  try {
    if (topic) {
      await AsyncStorage.setItem(LAST_TOPIC_KEY, JSON.stringify(topic));
    } else {
      await AsyncStorage.removeItem(LAST_TOPIC_KEY);
    }
  } catch (error) {
    console.error('Error saving last visited topic:', error);
  }
};

export const loadLastVisitedTopic = async (): Promise<LastVisitedTopic | null> => {
  try {
    const data = await AsyncStorage.getItem(LAST_TOPIC_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading last visited topic:', error);
    return null;
  }
};

export const loadProgress = async (): Promise<Progress | null> => {
  try {
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
};

const getActivityAttemptKey = (chapterId: number, topicId: string) => `${chapterId}:${topicId}`;

export const saveActivityAttempt = async (attempt: ActivityAttempt): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(ACTIVITY_ATTEMPTS_KEY);
    const attempts: Record<string, ActivityAttempt> = data ? JSON.parse(data) : {};
    attempts[getActivityAttemptKey(attempt.chapterId, attempt.topicId)] = attempt;
    await AsyncStorage.setItem(ACTIVITY_ATTEMPTS_KEY, JSON.stringify(attempts));
    const metadata = await getCacheMetadata();
    metadata.activityAttempts = { timestamp: Date.now(), synced: false };
    await AsyncStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Error saving activity attempt:', error);
  }
};

export const loadActivityAttempt = async (chapterId: number, topicId: string): Promise<ActivityAttempt | null> => {
  try {
    const data = await AsyncStorage.getItem(ACTIVITY_ATTEMPTS_KEY);
    const attempts: Record<string, ActivityAttempt> = data ? JSON.parse(data) : {};
    return attempts[getActivityAttemptKey(chapterId, topicId)] ?? null;
  } catch (error) {
    console.error('Error loading activity attempt:', error);
    return null;
  }
};

export const loadAllActivityAttempts = async (): Promise<ActivityAttempt[]> => {
  try {
    const data = await AsyncStorage.getItem(ACTIVITY_ATTEMPTS_KEY);
    const attemptsMap: Record<string, ActivityAttempt> = data ? JSON.parse(data) : {};
    return Object.values(attemptsMap);
  } catch (error) {
    console.error('Error loading activity attempts:', error);
    return [];
  }
};

export const clearActivityAttempts = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ACTIVITY_ATTEMPTS_KEY);
  } catch (error) {
    console.error('Error clearing activity attempts:', error);
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([CHAPTERS_KEY, PROGRESS_KEY, LAST_TOPIC_KEY, ACTIVITY_ATTEMPTS_KEY, COMPLETION_MODAL_KEY, SCENARIO_CATALOG_KEY]);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

export const saveCompletionModalDismissed = async (dismissed: boolean): Promise<void> => {
  try {
    if (dismissed) {
      await AsyncStorage.setItem(COMPLETION_MODAL_KEY, 'true');
    } else {
      await AsyncStorage.removeItem(COMPLETION_MODAL_KEY);
    }
  } catch (error) {
    console.error('Error saving completion modal state:', error);
  }
};

export const loadCompletionModalDismissed = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(COMPLETION_MODAL_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error loading completion modal state:', error);
    return false;
  }
};

const createTopicNoteId = (): string => {
  if (typeof globalThis !== 'undefined' && typeof (globalThis as { crypto?: { randomUUID?: () => string } }).crypto?.randomUUID === 'function') {
    return (globalThis as { crypto?: { randomUUID?: () => string } }).crypto!.randomUUID!();
  }
  return `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizeTopicNote = (item: unknown, fallbackId?: string): TopicNote | null => {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const candidate = item as Partial<TopicNote>;
  const normalizedTitle = typeof candidate.title === 'string' ? candidate.title.trim() : '';
  const normalizedContent = typeof candidate.content === 'string' ? candidate.content.trim() : '';

  if (!normalizedTitle && !normalizedContent) {
    return null;
  }

  return {
    id: typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : fallbackId || createTopicNoteId(),
    title: normalizedTitle || 'Untitled note',
    content: normalizedContent,
  };
};

const notesMatch = (left: TopicNote | null | undefined, right: TopicNote | null | undefined): boolean => {
  if (!left || !right) {
    return false;
  }

  if (left.id && right.id && left.id === right.id) {
    return true;
  }

  const leftTitle = (left.title || '').trim().toLowerCase();
  const leftContent = (left.content || '').trim().toLowerCase();
  const rightTitle = (right.title || '').trim().toLowerCase();
  const rightContent = (right.content || '').trim().toLowerCase();

  if (!rightTitle && !rightContent) {
    return false;
  }

  return leftTitle === rightTitle && leftContent === rightContent;
};

export interface TopicNote {
  id?: string;
  title: string;
  content: string;
}

export const saveTopicNote = async (chapterId: number, topicId: string, title: string, content: string): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(TOPIC_NOTES_KEY);
    const notesByTopic: Record<string, TopicNote[]> = data ? JSON.parse(data) : {};
    const key = `${chapterId}:${topicId}`;
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      delete notesByTopic[key];
    } else {
      const existingNotes = Array.isArray(notesByTopic[key]) ? notesByTopic[key] : [];
      const normalizedNotes = existingNotes
        .map((item) => normalizeTopicNote(item, createTopicNoteId()))
        .filter((item): item is TopicNote => Boolean(item));

      normalizedNotes.push({
        id: createTopicNoteId(),
        title: trimmedTitle || 'Untitled note',
        content: trimmedContent,
      });

      notesByTopic[key] = normalizedNotes;
    }

    await AsyncStorage.setItem(TOPIC_NOTES_KEY, JSON.stringify(notesByTopic));
  } catch (error) {
    console.error('Error saving topic note:', error);
  }
};

export const loadTopicNotes = async (chapterId: number, topicId: string): Promise<TopicNote[]> => {
  try {
    const data = await AsyncStorage.getItem(TOPIC_NOTES_KEY);
    const notesByTopic: Record<string, unknown> = data ? JSON.parse(data) : {};
    const key = `${chapterId}:${topicId}`;
    const savedNotes = notesByTopic[key];

    if (Array.isArray(savedNotes)) {
      const normalizedNotes = savedNotes
        .map((item) => normalizeTopicNote(item, createTopicNoteId()))
        .filter((item): item is TopicNote => Boolean(item));

      const needsPersist = normalizedNotes.length !== savedNotes.length || normalizedNotes.some((note, index) => {
        const original = savedNotes[index];
        return !original || typeof original !== 'object' || !(original as Partial<TopicNote>).id || (original as Partial<TopicNote>).id !== note.id;
      });

      if (needsPersist) {
        notesByTopic[key] = normalizedNotes;
        await AsyncStorage.setItem(TOPIC_NOTES_KEY, JSON.stringify(notesByTopic));
      }

      return normalizedNotes;
    }

    if (typeof savedNotes === 'string' && savedNotes.trim()) {
      return [{ id: createTopicNoteId(), title: 'Untitled note', content: savedNotes.trim() }];
    }

    return [];
  } catch (error) {
    console.error('Error loading topic notes:', error);
    return [];
  }
};

export const loadTopicNote = async (chapterId: number, topicId: string): Promise<string> => {
  try {
    const notes = await loadTopicNotes(chapterId, topicId);
    return notes[notes.length - 1]?.content ?? '';
  } catch (error) {
    console.error('Error loading topic note:', error);
    return '';
  }
};

export const updateTopicNote = async (chapterId: number, topicId: string, index: number, title: string, content: string): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(TOPIC_NOTES_KEY);
    const notesByTopic: Record<string, TopicNote[]> = data ? JSON.parse(data) : {};
    const key = `${chapterId}:${topicId}`;
    const existingNotes = Array.isArray(notesByTopic[key]) ? notesByTopic[key] : [];

    if (index < 0 || index >= existingNotes.length) {
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      existingNotes.splice(index, 1);
    } else {
      existingNotes[index] = {
        id: existingNotes[index]?.id || createTopicNoteId(),
        title: trimmedTitle || 'Untitled note',
        content: trimmedContent,
      };
    }

    if (existingNotes.length === 0) {
      delete notesByTopic[key];
    } else {
      notesByTopic[key] = existingNotes;
    }

    await AsyncStorage.setItem(TOPIC_NOTES_KEY, JSON.stringify(notesByTopic));
  } catch (error) {
    console.error('Error updating topic note:', error);
  }
};

export const replaceTopicNotes = async (chapterId: number, topicId: string, notes: TopicNote[]): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(TOPIC_NOTES_KEY);
    const notesByTopic: Record<string, TopicNote[]> = data ? JSON.parse(data) : {};
    const key = `${chapterId}:${topicId}`;
    const normalizedNotes = notes
      .map((item) => normalizeTopicNote(item, createTopicNoteId()))
      .filter((item): item is TopicNote => Boolean(item));

    if (normalizedNotes.length === 0) {
      delete notesByTopic[key];
    } else {
      notesByTopic[key] = normalizedNotes;
    }

    // DEBUG: log replacement operation
    try { console.log(`replaceTopicNotes: key=${key} count=${normalizedNotes.length}`); } catch (e) {}

    await AsyncStorage.setItem(TOPIC_NOTES_KEY, JSON.stringify(notesByTopic));
  } catch (error) {
    console.error('Error replacing topic notes:', error);
  }
};

export const deleteTopicNote = async (chapterId: number, topicId: string, index: number, noteToDelete?: TopicNote): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(TOPIC_NOTES_KEY);
    const notesByTopic: Record<string, unknown> = data ? JSON.parse(data) : {};
    const key = `${chapterId}:${topicId}`;
    const currentNotes = Array.isArray(notesByTopic[key])
      ? notesByTopic[key].map((item) => normalizeTopicNote(item, createTopicNoteId())).filter((item): item is TopicNote => Boolean(item))
      : [];

    const resolvedIndex = index >= 0 && index < currentNotes.length ? index : -1;
    const targetIndex = resolvedIndex >= 0
      ? resolvedIndex
      : (noteToDelete ? currentNotes.findIndex((note) => notesMatch(note, noteToDelete)) : -1);

    if (targetIndex < 0) {
      return;
    }

    const updatedNotes = currentNotes.filter((_, noteIndex) => noteIndex !== targetIndex);

    if (updatedNotes.length === 0) {
      delete notesByTopic[key];
    } else {
      notesByTopic[key] = updatedNotes;
    }

    await AsyncStorage.setItem(TOPIC_NOTES_KEY, JSON.stringify(notesByTopic));
  } catch (error) {
    console.error('Error deleting topic note:', error);
  }
};

export const clearTopicNote = async (chapterId: number, topicId: string): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(TOPIC_NOTES_KEY);
    if (!data) return;
    const notesByTopic: Record<string, TopicNote[]> = JSON.parse(data);
    delete notesByTopic[`${chapterId}:${topicId}`];
    await AsyncStorage.setItem(TOPIC_NOTES_KEY, JSON.stringify(notesByTopic));
  } catch (error) {
    console.error('Error clearing topic note:', error);
  }
};

export const getDataVersion = async (): Promise<number> => {
  try {
    const version = await AsyncStorage.getItem(DATA_VERSION_KEY);
    return version ? parseInt(version, 10) : 0;
  } catch (error) {
    console.error('Error getting data version:', error);
    return 0;
  }
};

export const setDataVersion = async (version: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(DATA_VERSION_KEY, String(version));
  } catch (error) {
    console.error('Error setting data version:', error);
  }
};

// Scenario catalog persistence
const SCENARIO_CATALOG_KEY = '@ethicore_scenario_catalog_v1';

export const saveScenarioCatalog = async (scenarios: ComicScenario[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(SCENARIO_CATALOG_KEY, JSON.stringify(scenarios));
  } catch (error) {
    console.error('Error saving scenario catalog:', error);
  }
};

export const loadScenarioCatalog = async (): Promise<ComicScenario[]> => {
  try {
    const data = await AsyncStorage.getItem(SCENARIO_CATALOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading scenario catalog:', error);
    return [];
  }
};

export const seedScenarioCatalogIfNeeded = async (defaults: ComicScenario[]): Promise<ComicScenario[]> => {
  try {
    const current = await loadScenarioCatalog();
    if (current.length > 0) {
      return current;
    }
    await saveScenarioCatalog(defaults);
    return defaults;
  } catch (error) {
    console.error('Error seeding scenario catalog:', error);
    return defaults;
  }
};

// Offline cache metadata
const CACHE_METADATA_KEY = '@ethicore_cache_metadata';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface CacheMetadata {
  chapters: { timestamp: number; synced: boolean };
  progress: { timestamp: number; synced: boolean };
  activityAttempts: { timestamp: number; synced: boolean };
  lastSyncAttempt: number;
}

const defaultCacheMetadata: CacheMetadata = {
  chapters: { timestamp: 0, synced: false },
  progress: { timestamp: 0, synced: false },
  activityAttempts: { timestamp: 0, synced: false },
  lastSyncAttempt: 0,
};

export const getCacheMetadata = async (): Promise<CacheMetadata> => {
  try {
    const data = await AsyncStorage.getItem(CACHE_METADATA_KEY);
    return data ? JSON.parse(data) : defaultCacheMetadata;
  } catch (error) {
    console.error('Error getting cache metadata:', error);
    return defaultCacheMetadata;
  }
};

export const updateCacheMetadata = async (updates: Partial<CacheMetadata>): Promise<void> => {
  try {
    const current = await getCacheMetadata();
    const updated = { ...current, ...updates };
    await AsyncStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating cache metadata:', error);
  }
};

export const isCacheValid = async (key: keyof Omit<CacheMetadata, 'lastSyncAttempt'>): Promise<boolean> => {
  try {
    const metadata = await getCacheMetadata();
    const cacheData = metadata[key];
    if (!cacheData.timestamp) return false;
    return Date.now() - cacheData.timestamp < CACHE_EXPIRY_MS;
  } catch (error) {
    console.error('Error checking cache validity:', error);
    return false;
  }
};

export const markDataAsSynced = async (key: keyof Omit<CacheMetadata, 'lastSyncAttempt'>): Promise<void> => {
  try {
    const metadata = await getCacheMetadata();
    metadata[key].synced = true;
    metadata.lastSyncAttempt = Date.now();
    await AsyncStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Error marking data as synced:', error);
  }
};

// Scenario history persistence (simple append-prepend list)
const SCENARIO_HISTORY_KEY = '@ethicore_scenario_history_v1';

export type SavedScenario = {
  id: string;
  title: string;
  decisionTitle: string;
  verdict: 'Ethical' | 'Mixed' | 'Unethical';
  timestamp: string;
  violatedPrinciples?: string[];
  mappedModules?: Record<string, string[]>;
  raw?: any;
};

export const saveScenarioResult = async (item: SavedScenario): Promise<boolean> => {
  try {
    const raw = await AsyncStorage.getItem(SCENARIO_HISTORY_KEY);
    const list: SavedScenario[] = raw ? JSON.parse(raw) : [];
    list.unshift(item);
    await AsyncStorage.setItem(SCENARIO_HISTORY_KEY, JSON.stringify(list));
    return true;
  } catch (err) {
    console.warn('Error saving scenario result:', err);
    return false;
  }
};

export const getScenarioHistory = async (): Promise<SavedScenario[]> => {
  try {
    const raw = await AsyncStorage.getItem(SCENARIO_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Error loading scenario history:', err);
    return [];
  }
};
