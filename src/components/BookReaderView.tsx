import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  Type, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Share2,
  Heart
} from 'lucide-react';
import { Book, Chapter, UserProgress } from '../types';
import { markChapterComplete, toggleChapterBookmark } from '../lib/storage';

interface BookReaderViewProps {
  book: Book;
  chapter: Chapter;
  userProgress: UserProgress;
  onBack: () => void;
  onSelectChapter: (ch: Chapter) => void;
  allChaptersInBook: Chapter[];
  onSaveReflection: (text: string) => void;
  onProgressUpdate: () => void;
}

export const BookReaderView: React.FC<BookReaderViewProps> = ({
  book,
  chapter,
  userProgress,
  onBack,
  onSelectChapter,
  allChaptersInBook,
  onSaveReflection,
  onProgressUpdate
}) => {
  const [fontSize, setFontSize] = useState<number>(16); // px
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const isCompleted = userProgress.completedChapterIds.includes(chapter.id);
  const isBookmarked = userProgress.bookmarkedChapterIds.includes(chapter.id);

  const handleToggleBookmark = () => {
    toggleChapterBookmark(chapter.id);
    onProgressUpdate();
  };

  const handleToggleComplete = () => {
    markChapterComplete(chapter.id, chapter.readingTimeMinutes);
    onProgressUpdate();
  };

  const handleAudioRead = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const textToRead = `${chapter.title}. ${chapter.summary}. ${chapter.content.replace(/[*#_`]/g, '')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.03] backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-200 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Font Resizer */}
          <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg text-xs font-bold">
            <Type className="w-3.5 h-3.5 text-slate-300" />
            <button 
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="px-1 hover:text-emerald-400"
            >
              A-
            </button>
            <span className="text-[10px] text-slate-400">|</span>
            <button 
              onClick={() => setFontSize(Math.min(22, fontSize + 2))}
              className="px-1 hover:text-emerald-400"
            >
              A+
            </button>
          </div>

          {/* Audio TTS */}
          <button
            onClick={handleAudioRead}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              isSpeaking
                ? 'bg-rose-500/20 text-rose-300'
                : 'bg-white/10 text-amber-200 hover:bg-white/20'
            }`}
            title="Read Chapter Aloud"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Pause' : 'Listen'}</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-white/10 text-amber-200 hover:bg-white/20'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          {/* Mark Complete Button */}
          <button
            onClick={handleToggleComplete}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isCompleted ? 'Completed (+50 XP)' : 'Mark as Read (+50 XP)'}</span>
          </button>
        </div>
      </div>

      {/* Chapter Title Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-950/60 text-amber-100 p-6 sm:p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
          <span className="uppercase tracking-wider">{book.title}</span>
          <span>•</span>
          <span>Chapter {chapter.chapterNumber} of {book.chaptersCount}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
          {chapter.title}
        </h1>

        {chapter.subtitle && (
          <p className="text-sm text-slate-200 font-medium italic">
            {chapter.subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200/80 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{chapter.readingTimeMinutes} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Era: {chapter.era}</span>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-white/[0.03] backdrop-blur-md p-5 rounded-3xl border border-white/10 space-y-2">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Chapter Summary</span>
        </h2>
        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          {chapter.summary}
        </p>
      </div>

      {/* Arabic Verses Box if present */}
      {chapter.arabicVerses && chapter.arabicVerses.length > 0 && (
        <div className="space-y-4">
          {chapter.arabicVerses.map((v, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
              <p className="font-arabic text-2xl text-amber-400 text-right leading-loose">
                {v.arabic}
              </p>
              <p className="text-xs sm:text-sm italic text-slate-300">
                "{v.translation}"
              </p>
              <p className="text-[11px] font-bold text-emerald-400">
                — {v.reference}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Main Chapter Content */}
      <article 
        className="prose prose-invert max-w-none bg-white/[0.03] backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] leading-relaxed text-slate-100"
        style={{ fontSize: `${fontSize}px` }}
      >
        <div className="whitespace-pre-wrap">
          {chapter.content}
        </div>
      </article>

      {/* Hadith References Box if present */}
      {chapter.hadiths && chapter.hadiths.length > 0 && (
        <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-amber-400">
            Hadith References
          </h3>
          {chapter.hadiths.map((h, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <p className="text-xs italic text-slate-200">"{h.text}"</p>
              <p className="text-[11px] font-bold text-amber-400">— Narrated by {h.narrator} ({h.reference})</p>
            </div>
          ))}
        </div>
      )}

      {/* Key Takeaways */}
      <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-emerald-400">
          Key Takeaways & Moral Guidance
        </h3>
        <ul className="space-y-2">
          {chapter.keyTakeaways.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Reflection Prompt */}
      <div className="p-6 rounded-3xl bg-amber-500/5 backdrop-blur-md border border-amber-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Personal Reflection Prompt</span>
          </h3>
          <button
            onClick={() => onSaveReflection(chapter.reflectionPrompt)}
            className="text-xs font-bold text-emerald-400 hover:underline"
          >
            Save to Journal
          </button>
        </div>
        <p className="text-xs sm:text-sm italic text-amber-100 font-medium">
          "{chapter.reflectionPrompt}"
        </p>
      </div>

      {/* Chapter Navigator Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <p className="text-xs text-slate-400">
          Chapter {chapter.chapterNumber} of {allChaptersInBook.length}
        </p>
        <button
          onClick={handleToggleComplete}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          {isCompleted ? 'Finished Reading' : 'Mark Complete & Next'}
        </button>
      </div>

    </div>
  );
};
