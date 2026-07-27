import React from 'react';
import { 
  Award, 
  Flame, 
  BookOpen, 
  HelpCircle, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Sparkles,
  Lock,
  Calendar,
  Target
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { UserProgress, Badge, NavTab } from '../types';
import { ALL_BADGES } from '../lib/storage';

interface DashboardViewProps {
  userProgress: UserProgress;
  onNavigate: (tab: NavTab) => void;
}

const WEEKLY_ACTIVITY_DATA = [
  { day: 'Mon', minutes: 15, xp: 40 },
  { day: 'Tue', minutes: 25, xp: 75 },
  { day: 'Wed', minutes: 10, xp: 30 },
  { day: 'Thu', minutes: 30, xp: 90 },
  { day: 'Fri', minutes: 45, xp: 120 },
  { day: 'Sat', minutes: 20, xp: 60 },
  { day: 'Sun', minutes: 35, xp: 100 }
];

export const DashboardView: React.FC<DashboardViewProps> = ({ userProgress, onNavigate }) => {
  const xpForCurrentLevel = (userProgress.level - 1) * 100;
  const xpInCurrentLevel = userProgress.xp - xpForCurrentLevel;
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / 100) * 100));

  const dailyGoalPercent = Math.min(
    100,
    Math.round((userProgress.dailyMinutesCompletedToday / userProgress.dailyGoalMinutes) * 100)
  );

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>Scholar Learning Dashboard</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
              Level {userProgress.level}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your Seerah reading milestones, quiz performance, and active study streaks
          </p>
        </div>

        <button
          onClick={() => onNavigate('assistant')}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-white/5 border border-amber-500/30 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-amber-400">{userProgress.streakDays} Days</p>
            <p className="text-xs font-medium text-slate-400">Active Study Streak</p>
          </div>
        </div>

        {/* Level & XP */}
        <div className="p-5 rounded-2xl bg-white/5 border border-emerald-500/30 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-emerald-400">{userProgress.xp} XP</p>
            <p className="text-xs font-medium text-slate-400">Total Seerah XP</p>
          </div>
        </div>

        {/* Chapters Completed */}
        <div className="p-5 rounded-2xl bg-white/5 border border-indigo-500/30 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-indigo-400">{userProgress.completedChapterIds.length}</p>
            <p className="text-xs font-medium text-slate-400">Completed Chapters</p>
          </div>
        </div>

        {/* Reading Minutes */}
        <div className="p-5 rounded-2xl bg-white/5 border border-purple-500/30 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-purple-400">{userProgress.totalReadingMinutes}m</p>
            <p className="text-xs font-medium text-slate-400">Total Reading Time</p>
          </div>
        </div>

      </div>

      {/* Level Progression & Daily Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Level Progression Card */}
        <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">Level Progression</h2>
            </div>
            <span className="text-xs font-bold text-emerald-400">
              Level {userProgress.level} Scholar
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{xpInCurrentLevel} / 100 XP to next level</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/10">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Earn 50 XP per chapter completed and up to 100 XP per quiz passed!
          </p>
        </div>

        {/* Daily Goal Progress */}
        <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Daily Study Goal</h2>
            </div>
            <span className="text-xs font-bold text-emerald-400">
              {userProgress.dailyMinutesCompletedToday} / {userProgress.dailyGoalMinutes} mins
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Today's Progress</span>
              <span>{dailyGoalPercent}%</span>
            </div>
            <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/10">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                style={{ width: `${dailyGoalPercent}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-slate-400">
            {dailyGoalPercent >= 100 
              ? "🎉 Masha'Allah! You have completed today's daily goal!" 
              : `Read ${userProgress.dailyGoalMinutes - userProgress.dailyMinutesCompletedToday} more minutes today to maintain your streak!`}
          </p>
        </div>

      </div>

      {/* Activity Analytics Chart */}
      <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Weekly Seerah Study Time (Minutes)</span>
            </h2>
            <p className="text-xs text-slate-400">Consistency across the last 7 days</p>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEKLY_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.1} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#09100d', 
                  borderColor: 'rgba(255,255,255,0.1)', 
                  borderRadius: '16px',
                  color: '#fef3c7',
                  fontSize: '12px',
                  backdropFilter: 'blur(12px)'
                }} 
              />
              <Area type="monotone" dataKey="minutes" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMinutes)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badges Gallery */}
      <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Unlocked Scholar Badges ({userProgress.unlockedBadgeIds.length}/{ALL_BADGES.length})</span>
          </h2>
          <p className="text-xs text-slate-400">Earn badges by reading chapters, taking quizzes, and keeping daily study streaks</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = userProgress.unlockedBadgeIds.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={`p-3.5 rounded-2xl text-center border backdrop-blur-md transition-all ${
                  isUnlocked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-white/5 border-white/10 text-slate-500 opacity-60'
                }`}
                title={badge.description}
              >
                <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2 ${
                  isUnlocked ? 'bg-amber-400 text-slate-950 font-bold shadow-md' : 'bg-white/10 text-slate-400'
                }`}>
                  {isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>
                <p className="text-xs font-bold truncate text-white">{badge.name}</p>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{badge.category}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
