export type NavTab = 
  | 'home'
  | 'dashboard'
  | 'library'
  | 'reader'
  | 'quiz'
  | 'timeline'
  | 'assistant'
  | 'halaqah'
  | 'reflections';

export interface Book {
  id: string;
  title: string;
  arabicTitle?: string;
  author: string;
  coverImage?: string;
  description: string;
  chaptersCount: number;
  estimatedHours: number;
  category: 'Classical' | 'Modern Analysis' | 'Biography' | 'Hadith & Seerah';
  tags: string[];
}

export interface Chapter {
  id: string;
  bookId: string;
  chapterNumber: number;
  title: string;
  subtitle?: string;
  readingTimeMinutes: number;
  era: 'Pre-Islamic' | 'Meccan Period' | 'Medinan Period' | 'Post-Prophetic';
  summary: string;
  content: string; // Markdown or rich text with paragraphs
  arabicVerses?: { arabic: string; translation: string; reference: string }[];
  hadiths?: { narrator: string; text: string; reference: string }[];
  keyTakeaways: string[];
  reflectionPrompt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hadithReference?: string;
}

export interface Quiz {
  id: string;
  title: string;
  chapterId?: string;
  era: 'Meccan Period' | 'Medinan Period' | 'General Knowledge' | 'Battles & Diplomacy';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimitSeconds: number;
  xpReward: number;
  badgeToUnlock?: string;
  description: string;
  questions: QuizQuestion[];
}

export interface TimelineEvent {
  id: string;
  yearCE: number;
  yearBH_AH: string; // e.g. "53 BH" or "2 AH"
  title: string;
  arabicTitle?: string;
  category: 'Birth & Early Life' | 'Meccan Persecution' | 'Migration (Hijrah)' | 'Battles' | 'Treaties & Diplomacy' | 'Final Years';
  location: string;
  description: string;
  significance: string;
  keyFigures: string[];
  quranHadithRef?: string;
  imageTag?: string;
}

export interface ReflectionLesson {
  id: string;
  date: string;
  title: string;
  hadithOfTheDay: {
    text: string;
    narrator: string;
    reference: string;
    explanation: string;
  };
  seerahContext: string;
  reflectionQuestions: string[];
  practicalActionItems: string[];
}

export interface SavedReflection {
  id: string;
  lessonId: string;
  dateSaved: string;
  userNote: string;
  rating?: number;
}

export interface Badge {
  id: string;
  name: string;
  iconName: string;
  description: string;
  unlockedAt?: string;
  category: 'Reading' | 'Quiz' | 'Streak' | 'Reflection' | 'Mastery';
}

export interface LiveHalaqah {
  id: string;
  title: string;
  speaker: string;
  speakerTitle: string;
  date: string;
  time: string;
  durationMinutes: number;
  platform: 'Jitsi Meet' | 'Zoom' | 'Agora Interactive';
  meetRoomName: string;
  description: string;
  topics: string[];
  attendeesCount: number;
  isLiveNow?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  modelUsed?: string;
  text: string;
  timestamp: string;
  sources?: string[];
}

export interface UserProgress {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedChapterIds: string[];
  bookmarkedChapterIds: string[];
  highlights: { chapterId: string; text: string; note?: string; date: string }[];
  quizScores: { [quizId: string]: { score: number; maxScore: number; date: string; timeTakenSeconds: number } };
  unlockedBadgeIds: string[];
  totalReadingMinutes: number;
  dailyGoalMinutes: number;
  dailyMinutesCompletedToday: number;
}
