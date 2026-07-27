import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Bookmark, 
  CheckCircle, 
  ChevronRight, 
  Tag, 
  Sparkles,
  BookMarked
} from 'lucide-react';
import { Book, Chapter, UserProgress } from '../types';
import { BOOKS_DATA } from '../data/books';
import { CHAPTERS_DATA } from '../data/chapters';

interface LibraryViewProps {
  userProgress: UserProgress;
  onOpenChapter: (book: Book, chapter: Chapter) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ userProgress, onOpenChapter }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedBookId, setExpandedBookId] = useState<string | null>('sealed-nectar');

  const categories = ['All', 'Classical', 'Modern Analysis', 'Biography', 'Hadith & Seerah'];

  const filteredBooks = BOOKS_DATA.filter((book) => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>Interactive Seerah Library</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Read classical biographies, modern analyses, and Hadith-backed accounts
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, authors, or topics..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500/50 backdrop-blur-md"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBooks.map((book) => {
          const chaptersInBook = CHAPTERS_DATA.filter(c => c.bookId === book.id);
          const completedCount = chaptersInBook.filter(c => userProgress.completedChapterIds.includes(c.id)).length;
          const isExpanded = expandedBookId === book.id;

          return (
            <div 
              key={book.id}
              className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-emerald-500/40 transition-all space-y-4 p-6"
            >
              {/* Top Details */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      {book.category}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-2">
                      {book.title}
                    </h2>
                    {book.arabicTitle && (
                      <p className="font-arabic text-amber-400 text-sm">
                        {book.arabicTitle}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {book.description}
                </p>

                <p className="text-xs font-semibold text-slate-200">
                  By {book.author}
                </p>

                {/* Metadata tags */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {book.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>~{book.estimatedHours} hrs total</span>
                  </div>
                  <span>{completedCount}/{book.chaptersCount} chapters finished</span>
                </div>
              </div>

              {/* Toggle Chapters View */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <button
                  onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
                  className="w-full flex items-center justify-between text-xs font-bold text-emerald-400 hover:underline"
                >
                  <span>{isExpanded ? 'Hide Chapters' : `View Available Chapters (${chaptersInBook.length})`}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="space-y-2 pt-2">
                    {chaptersInBook.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">More chapters coming soon to this title!</p>
                    ) : (
                      chaptersInBook.map((ch) => {
                        const isDone = userProgress.completedChapterIds.includes(ch.id);
                        const isSaved = userProgress.bookmarkedChapterIds.includes(ch.id);

                        return (
                          <div
                            key={ch.id}
                            onClick={() => onOpenChapter(book, ch)}
                            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-white/10 cursor-pointer transition-all backdrop-blur-md"
                          >
                            <div className="flex items-center gap-2.5">
                              {isDone ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                              <div>
                                <p className="text-xs font-bold text-white">
                                  Ch {ch.chapterNumber}: {ch.title}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {ch.readingTimeMinutes} min read • Era: {ch.era}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {isSaved && <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
