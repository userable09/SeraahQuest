import React from 'react';
import { 
  BookOpen, 
  Bot, 
  HelpCircle, 
  Clock, 
  Video, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Heart,
  BookMarked,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { NavTab, UserProgress } from '../types';

interface HeroLandingProps {
  onNavigate: (tab: NavTab) => void;
  userProgress: UserProgress;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({ onNavigate, userProgress }) => {
  return (
    <div className="space-y-12 pb-12">
      
      {/* Main Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-950/60 backdrop-blur-xl text-amber-100 p-6 sm:p-10 lg:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10">
        
        {/* Subtle Geometric Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none" 
          style={{ 
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 0l5 15 15 5-15 5-5 15-5-15-15-5 15-5z" fill="%23ffffff" fill-rule="evenodd"/%3E%3C/svg%3E')` 
          }} 
        />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Powered by Advanced Seerah AI & Authentic Literature</span>
          </div>

          <div className="space-y-2">
            <p className="text-amber-400 font-arabic text-2xl sm:text-3xl font-medium tracking-wide">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Study the Life of Prophet Muhammad ﷺ with <span className="text-emerald-400 italic font-serif underline decoration-emerald-500/40 underline-offset-8">AI Precision</span>
            </h1>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to <strong className="text-white font-bold">Seerah Quest</strong>—an immersive Islamic educational platform combining authentic classical biography (*Ar-Raheeq Al-Makhtum*, *Sirat Ibn Hisham*), interactive timeline exploration, gamified quizzes, live study circles, and an AI companion.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('assistant')}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Seerah Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('library')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Explore Seerah Books</span>
            </button>

            <button
              onClick={() => onNavigate('quiz')}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-sm border border-white/10 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Start Quizzes</span>
            </button>
          </div>
        </div>

        {/* Quick Progress Banner Card */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-xl font-bold text-amber-400">{userProgress.streakDays} Days</p>
            <p className="text-xs text-slate-300">Active Study Streak</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-xl font-bold text-emerald-400">{userProgress.xp} XP</p>
            <p className="text-xs text-slate-300">Level {userProgress.level} Scholar</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-xl font-bold text-amber-400">{userProgress.completedChapterIds.length}</p>
            <p className="text-xs text-slate-300">Chapters Completed</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-xl font-bold text-emerald-400">{userProgress.unlockedBadgeIds.length}</p>
            <p className="text-xs text-slate-300">Badges Earned</p>
          </div>
        </div>
      </section>

      {/* Daily Hadith & Prophet's Character Quote */}
      <section className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
          <Heart className="w-7 h-7 text-emerald-400" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Hadith of the Day
            </span>
            <span className="text-xs text-slate-400">• Sahih al-Bukhari 3559</span>
          </div>
          <p className="text-base sm:text-lg italic font-serif text-slate-100 leading-relaxed">
            "The best among you are those who have the best manners and character."
          </p>
          <p className="text-xs text-slate-400">
            Narrated by Abdullah ibn 'Amr (RA) on the noble moral benchmark set by Prophet Muhammad ﷺ.
          </p>
        </div>
        <button
          onClick={() => onNavigate('reflections')}
          className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-medium text-xs shrink-0 transition-colors"
        >
          View Daily Reflections
        </button>
      </section>

      {/* Feature Navigation Modules Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Core Educational Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Select a learning pathway to deepen your understanding of Seerah
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: AI Seerah Assistant */}
          <div 
            onClick={() => onNavigate('assistant')}
            className="group p-6 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all cursor-pointer space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  AI Seerah Assistant
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AI Powered
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Ask questions, generate chapter summaries, explore Hadith references, and analyze historical events streaming in real-time.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-bold text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Launch Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Digital Library */}
          <div 
            onClick={() => onNavigate('library')}
            className="group p-6 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all cursor-pointer space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Authentic Seerah Reader
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Read *The Sealed Nectar*, *Sirat Ibn Hisham*, and *Fiqh-us-Seerah* with text-to-speech audio reader, bookmarks, and highlights.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-bold text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Gamified Quizzes */}
          <div 
            onClick={() => onNavigate('quiz')}
            className="group p-6 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all cursor-pointer space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Gamified Quiz Engine
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Test your Seerah knowledge across Meccan and Medinan eras, earn XP points, unlock badges, and climb scholar ranks.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-bold text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Take Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Interactive Timeline */}
          <div 
            onClick={() => onNavigate('timeline')}
            className="group p-6 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all cursor-pointer space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Seerah Timeline Explorer
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Chronological journey from 570 CE to 632 CE covering major battles, treaties, migrations, and key historical figures.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-bold text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Live Study Sessions */}
          <div 
            onClick={() => onNavigate('halaqah')}
            className="group p-6 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all cursor-pointer space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Live Study Halaqahs
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Jitsi
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Join weekly interactive study circles with scholar lectures, Q&A sessions, and study material downloads.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-bold text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Join Halaqah</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Daily Reflections */}
          <div 
            onClick={() => onNavigate('reflections')}
            className="group p-6 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all cursor-pointer space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Daily Reflections & Journal
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Reflect on Hadith of the day, answer introspection prompts, and save personal notes locally.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-bold text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Journal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
