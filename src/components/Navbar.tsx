import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Clock, 
  Bot, 
  Video, 
  Heart, 
  LayoutDashboard, 
  Flame, 
  Award, 
  Search, 
  Menu, 
  X,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';
import { NavTab, UserProgress } from '../types';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  userProgress: UserProgress;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearchModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  userProgress,
  isDarkMode,
  onToggleDarkMode,
  onOpenSearchModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'library', label: 'Library', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'assistant', label: 'AI Assistant', icon: <Bot className="w-4 h-4" />, badge: 'GROQ' },
    { id: 'quiz', label: 'Quizzes', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
    { id: 'halaqah', label: 'Live Circles', icon: <Video className="w-4 h-4" />, badge: 'LIVE' },
    { id: 'reflections', label: 'Daily Reflections', icon: <Heart className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onTabChange('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(5,150,105,0.4)] group-hover:scale-105 transition-transform">
              ﷺ
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-white">
                  SEERAH<span className="text-emerald-400">QUEST</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  AI Hub
                </span>
              </div>
              <p className="text-[11px] text-emerald-400/80 font-arabic font-medium -mt-1">
                سيرة النبي محمد ﷺ
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar: Streak, XP, Search, Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Search */}
            <button
              onClick={onOpenSearchModal}
              className="p-2 text-slate-300 hover:bg-white/5 rounded-xl border border-white/10 transition-colors flex items-center gap-1.5 text-xs bg-white/[0.02]"
              title="Search Seerah resources"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline text-xs text-slate-300">Search</span>
            </button>

            {/* Streak Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-200">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20 animate-pulse" />
              <span>{userProgress.streakDays} Day Streak</span>
            </div>

            {/* Level & XP Pill */}
            <div 
              onClick={() => onTabChange('dashboard')}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold cursor-pointer hover:bg-white/10 transition-colors"
            >
              <span className="text-xs font-semibold text-emerald-400">XP</span>
              <span className="text-xs font-mono text-white">{userProgress.xp}</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-300 hover:bg-white/5 border border-white/10 transition-colors"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-200 hover:bg-white/5 rounded-xl border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/90 backdrop-blur-xl border-b border-white/10 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                currentTab === item.id
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          
          <div className="pt-2 border-t border-white/10 flex items-center justify-between px-2 text-xs text-slate-400">
            <span>Level {userProgress.level} Scholar</span>
            <span className="font-bold text-emerald-400">{userProgress.xp} Total XP</span>
          </div>
        </div>
      )}
    </header>
  );
};
