import { UserProgress, Badge, ChatMessage, SavedReflection } from '../types';

const PROGRESS_KEY = 'seerah_quest_user_progress_v1';
const CHAT_HISTORY_KEY = 'seerah_quest_chat_history_v1';
const REFLECTIONS_KEY = 'seerah_quest_saved_reflections_v1';

export const ALL_BADGES: Badge[] = [
  {
    id: 'badge-seeker',
    name: 'Seeker of Knowledge',
    iconName: 'BookOpen',
    description: 'Read your first Seerah chapter',
    category: 'Reading'
  },
  {
    id: 'badge-lineage-seeker',
    name: 'Lineage Scholar',
    iconName: 'GitBranch',
    description: 'Completed Pre-Islamic Arabia quiz with high score',
    category: 'Quiz'
  },
  {
    id: 'badge-first-light',
    name: 'Dawn of Prophethood',
    iconName: 'Sun',
    description: 'Completed Meccan Period study module',
    category: 'Reading'
  },
  {
    id: 'badge-migrant-pioneer',
    name: 'Pioneer of Hijrah',
    iconName: 'Compass',
    description: 'Mastered the Medina Migration timeline and quiz',
    category: 'Mastery'
  },
  {
    id: 'badge-victorious-conqueror',
    name: 'Merciful Conqueror',
    iconName: 'ShieldCheck',
    description: 'Ached top score on Battles & Conquest Quiz',
    category: 'Quiz'
  },
  {
    id: 'badge-streak-3',
    name: '3-Day Devotion Streak',
    iconName: 'Flame',
    description: 'Maintained 3 consecutive days of Seerah study',
    category: 'Streak'
  },
  {
    id: 'badge-reflect-master',
    name: 'Reflective Heart',
    iconName: 'HeartHandshake',
    description: 'Saved 3 personal reflections',
    category: 'Reflection'
  }
];

export const INITIAL_USER_PROGRESS: UserProgress = {
  xp: 120,
  level: 1,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedChapterIds: ['ch-1'],
  bookmarkedChapterIds: ['ch-2'],
  highlights: [],
  quizScores: {},
  unlockedBadgeIds: ['badge-seeker'],
  totalReadingMinutes: 25,
  dailyGoalMinutes: 15,
  dailyMinutesCompletedToday: 12
};

export function getStoredUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      saveUserProgress(INITIAL_USER_PROGRESS);
      return INITIAL_USER_PROGRESS;
    }
    const parsed: UserProgress = JSON.parse(raw);
    
    // Check streak reset logic
    const today = new Date().toISOString().split('T')[0];
    if (parsed.lastActiveDate !== today) {
      const lastDate = new Date(parsed.lastActiveDate);
      const currDate = new Date(today);
      const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Continued streak
        parsed.streakDays += 1;
        parsed.dailyMinutesCompletedToday = 0;
      } else if (diffDays > 1) {
        // Broken streak
        parsed.streakDays = 1;
        parsed.dailyMinutesCompletedToday = 0;
      }
      parsed.lastActiveDate = today;
      saveUserProgress(parsed);
    }
    
    return parsed;
  } catch (err) {
    console.error('Error reading stored user progress:', err);
    return INITIAL_USER_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    // Check XP level progression (100 XP per level)
    const newLevel = Math.floor(progress.xp / 100) + 1;
    progress.level = newLevel;

    // Check streak badge trigger
    if (progress.streakDays >= 3 && !progress.unlockedBadgeIds.includes('badge-streak-3')) {
      progress.unlockedBadgeIds.push('badge-streak-3');
    }

    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Error saving user progress:', err);
  }
}

export function addXP(amount: number, reasonBanner?: string): { newXP: number; leveledUp: boolean } {
  const current = getStoredUserProgress();
  const oldLevel = current.level;
  current.xp += amount;
  saveUserProgress(current);
  const leveledUp = current.level > oldLevel;
  return { newXP: current.xp, leveledUp };
}

export function toggleChapterBookmark(chapterId: string): boolean {
  const progress = getStoredUserProgress();
  const index = progress.bookmarkedChapterIds.indexOf(chapterId);
  let isBookmarked = false;
  if (index >= 0) {
    progress.bookmarkedChapterIds.splice(index, 1);
    isBookmarked = false;
  } else {
    progress.bookmarkedChapterIds.push(chapterId);
    isBookmarked = true;
  }
  saveUserProgress(progress);
  return isBookmarked;
}

export function markChapterComplete(chapterId: string, readingMinutes: number = 10): void {
  const progress = getStoredUserProgress();
  if (!progress.completedChapterIds.includes(chapterId)) {
    progress.completedChapterIds.push(chapterId);
    progress.xp += 50; // 50 XP per chapter completed
    progress.totalReadingMinutes += readingMinutes;
    progress.dailyMinutesCompletedToday += readingMinutes;
    
    if (!progress.unlockedBadgeIds.includes('badge-seeker')) {
      progress.unlockedBadgeIds.push('badge-seeker');
    }
    
    saveUserProgress(progress);
  }
}

export function recordQuizScore(quizId: string, score: number, maxScore: number, timeTakenSeconds: number, badgeToUnlock?: string): void {
  const progress = getStoredUserProgress();
  progress.quizScores[quizId] = {
    score,
    maxScore,
    date: new Date().toISOString(),
    timeTakenSeconds
  };

  // Give XP based on percentage score
  const earnedXP = Math.round((score / maxScore) * 100);
  progress.xp += earnedXP;

  if (badgeToUnlock && score === maxScore && !progress.unlockedBadgeIds.includes(badgeToUnlock)) {
    progress.unlockedBadgeIds.push(badgeToUnlock);
  }

  saveUserProgress(progress);
}

// Chat History Persistence
export function getStoredChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveChatHistory(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  } catch (err) {
    console.error('Error saving chat history:', err);
  }
}

// Saved Reflections Persistence
export function getStoredReflections(): SavedReflection[] {
  try {
    const raw = localStorage.getItem(REFLECTIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveReflectionNote(lessonId: string, noteText: string): SavedReflection {
  const current = getStoredReflections();
  const existingIdx = current.findIndex(r => r.lessonId === lessonId);
  const newReflection: SavedReflection = {
    id: existingIdx >= 0 ? current[existingIdx].id : 'ref_' + Date.now(),
    lessonId,
    dateSaved: new Date().toISOString().split('T')[0],
    userNote: noteText
  };

  if (existingIdx >= 0) {
    current[existingIdx] = newReflection;
  } else {
    current.push(newReflection);
  }

  localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(current));

  // Check Reflection badge trigger
  const userProgress = getStoredUserProgress();
  if (current.length >= 3 && !userProgress.unlockedBadgeIds.includes('badge-reflect-master')) {
    userProgress.unlockedBadgeIds.push('badge-reflect-master');
    saveUserProgress(userProgress);
  }

  return newReflection;
}
