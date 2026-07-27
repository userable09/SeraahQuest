import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  BookOpen, 
  Save, 
  Check, 
  Trash2, 
  Sparkles, 
  Calendar, 
  Quote
} from 'lucide-react';
import { SavedReflection } from '../types';
import { REFLECTIONS_DATA } from '../data/reflections';
import { getStoredReflections, saveReflectionNote } from '../lib/storage';

interface ReflectionViewProps {
  onProgressUpdate: () => void;
}

export const ReflectionView: React.FC<ReflectionViewProps> = ({ onProgressUpdate }) => {
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [userNote, setUserNote] = useState<string>('');
  const [savedReflections, setSavedReflections] = useState<SavedReflection[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const currentLesson = REFLECTIONS_DATA[activeLessonIndex];

  useEffect(() => {
    const list = getStoredReflections();
    setSavedReflections(list);
    const existing = list.find((r) => r.lessonId === currentLesson.id);
    if (existing) {
      setUserNote(existing.userNote);
    } else {
      setUserNote('');
    }
    setIsSaved(false);
  }, [activeLessonIndex]);

  const handleSaveNote = () => {
    if (!userNote.trim()) return;
    saveReflectionNote(currentLesson.id, userNote);
    const updated = getStoredReflections();
    setSavedReflections(updated);
    setIsSaved(true);
    onProgressUpdate();
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-400" />
            <span>Daily Seerah Reflections</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Nurture spiritual growth, internalize prophetic character, and record personal reflections
          </p>
        </div>

        {/* Lesson Switcher */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 backdrop-blur-md p-1 rounded-xl">
          {REFLECTIONS_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveLessonIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLessonIndex === idx
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Day {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Reflection Lesson Card */}
      <div className="bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-6">
        
        {/* Title & Date */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
            {currentLesson.date}
          </span>
          <h2 className="text-2xl font-extrabold text-white pt-1">
            {currentLesson.title}
          </h2>
        </div>

        {/* Hadith of the Day Box */}
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-amber-400 flex items-center gap-1.5">
              <Quote className="w-4 h-4 text-amber-500" />
              <span>Hadith of the Day</span>
            </span>
            <span className="text-xs font-semibold text-slate-300">
              {currentLesson.hadithOfTheDay.reference}
            </span>
          </div>

          <p className="text-base sm:text-lg italic font-serif text-white leading-relaxed">
            "{currentLesson.hadithOfTheDay.text}"
          </p>

          <p className="text-xs text-slate-300">
            Narrated by <strong>{currentLesson.hadithOfTheDay.narrator}</strong>. {currentLesson.hadithOfTheDay.explanation}
          </p>
        </div>

        {/* Seerah Context */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Prophetic Seerah Context
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {currentLesson.seerahContext}
          </p>
        </div>

        {/* Introspection Questions */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Introspection Questions
          </h3>
          <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-200">
            {currentLesson.reflectionQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>

        {/* Personal Journal Note Editor */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Your Personal Reflection Journal</span>
            </h3>
            {isSaved && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Saved locally</span>
              </span>
            )}
          </div>

          <textarea
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            rows={4}
            placeholder="Write your thoughts, personal commitments, or dua inspired by today's lesson..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white focus:outline-hidden focus:border-emerald-500/50 backdrop-blur-md font-sans"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveNote}
              disabled={!userNote.trim()}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Reflection Note</span>
            </button>
          </div>
        </div>

      </div>

      {/* Saved History Gallery */}
      {savedReflections.length > 0 && (
        <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Saved Reflections Journal History ({savedReflections.length})</span>
          </h2>

          <div className="space-y-3">
            {savedReflections.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Saved on {item.dateSaved}</span>
                  <span className="font-bold text-emerald-400">Day Note</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  "{item.userNote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
