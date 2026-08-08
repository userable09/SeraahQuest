import React, { useState, useEffect } from 'react';
import { NavTab, Book, Chapter, UserProgress } from './types';
import { getStoredUserProgress } from './lib/storage';
import { BOOKS_DATA } from './data/books';
import { CHAPTERS_DATA } from './data/chapters';

import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { DashboardView } from './components/DashboardView';
import { AIChatView } from './components/AIChatView';
import { LibraryView } from './components/LibraryView';
import { BookReaderView } from './components/BookReaderView';
import { QuizView } from './components/QuizView';
import { TimelineView } from './components/TimelineView';
import { HalaqahView } from './components/HalaqahView';
import { ReflectionView } from './components/ReflectionView';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [userProgress, setUserProgress] = useState<UserProgress>(getStoredUserProgress());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Selected Reader State
  const [activeBook, setActiveBook] = useState<Book>(BOOKS_DATA[0]);
  const [activeChapter, setActiveChapter] = useState<Chapter>(CHAPTERS_DATA[0]);

  useEffect(() => {
    // Synchronize dark mode class on root element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const refreshProgress = () => {
    setUserProgress(getStoredUserProgress());
  };

  const handleOpenChapter = (book: Book, chapter: Chapter) => {
    setActiveBook(book);
    setActiveChapter(chapter);
    setCurrentTab('reader');
  };

  const handleSaveReflectionFromChat = (text: string) => {
    setCurrentTab('reflections');
  };

  return (
    <div className="min-h-screen bg-[#050a08] text-slate-100 transition-colors flex flex-col font-sans relative overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Background Islamic Geometric Pattern & Radial Glows */}
      <div 
        className="fixed inset-0 opacity-[0.035] pointer-events-none z-0" 
        style={{ 
          backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 0l5 15 15 5-15 5-5 15-5-15-15-5 15-5z" fill="%23ffffff" fill-rule="evenodd"/%3E%3C/svg%3E')` 
        }} 
      />
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top Header Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        userProgress={userProgress}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenSearchModal={() => setIsSearchOpen(true)}
      />

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 relative z-10">
        {currentTab === 'home' && (
          <HeroLanding
            onNavigate={(tab) => setCurrentTab(tab)}
            userProgress={userProgress}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            userProgress={userProgress}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'assistant' && (
          <AIChatView
            onSaveReflectionNote={handleSaveReflectionFromChat}
          />
        )}

        {currentTab === 'library' && (
          <LibraryView
            userProgress={userProgress}
            onOpenChapter={handleOpenChapter}
          />
        )}

        {currentTab === 'reader' && (
          <BookReaderView
            book={activeBook}
            chapter={activeChapter}
            userProgress={userProgress}
            onBack={() => setCurrentTab('library')}
            onSelectChapter={(ch) => setActiveChapter(ch)}
            allChaptersInBook={CHAPTERS_DATA.filter((c) => c.bookId === activeBook.id)}
            onSaveReflection={() => setCurrentTab('reflections')}
            onProgressUpdate={refreshProgress}
          />
        )}

        {currentTab === 'quiz' && (
          <QuizView
            userProgress={userProgress}
            onProgressUpdate={refreshProgress}
          />
        )}

        {currentTab === 'timeline' && (
          <TimelineView />
        )}

        {currentTab === 'halaqah' && (
          <HalaqahView />
        )}

        {currentTab === 'reflections' && (
          <ReflectionView
            onProgressUpdate={refreshProgress}
          />
        )}
      </main>

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenChapter={handleOpenChapter}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
