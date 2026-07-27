import React, { useState } from 'react';
import { Search, X, BookOpen, Clock, HelpCircle, ChevronRight } from 'lucide-react';
import { NavTab, Book, Chapter } from '../types';
import { BOOKS_DATA } from '../data/books';
import { CHAPTERS_DATA } from '../data/chapters';
import { TIMELINE_DATA } from '../data/timeline';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  onOpenChapter: (book: Book, chapter: Chapter) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenChapter
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredChapters = CHAPTERS_DATA.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.summary.toLowerCase().includes(query.toLowerCase()) ||
    c.content.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredTimeline = TIMELINE_DATA.filter((e) =>
    e.title.toLowerCase().includes(query.toLowerCase()) ||
    e.description.toLowerCase().includes(query.toLowerCase()) ||
    e.location.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 bg-[#050a08]/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-[#09100d] max-w-2xl w-full rounded-3xl border border-white/10 p-6 space-y-4 shadow-[0_16px_64px_rgba(0,0,0,0.5)] relative">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-emerald-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search books, chapters, timeline events, or figures..."
              autoFocus
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-hidden"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto space-y-4 pt-2 border-t border-white/10">
          {query.trim().length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              Type keywords like "Badr", "Hira", "Khadijah", or "Treaty" to search across Seerah resources...
            </p>
          ) : (
            <>
              {/* Chapters Results */}
              {filteredChapters.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Book Chapters
                  </span>
                  {filteredChapters.map((ch) => {
                    const book = BOOKS_DATA.find((b) => b.id === ch.bookId) || BOOKS_DATA[0];
                    return (
                      <div
                        key={ch.id}
                        onClick={() => {
                          onOpenChapter(book, ch);
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 backdrop-blur-md cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-white">{ch.title}</p>
                          <p className="text-[10px] text-slate-400">{book.title} • {ch.readingTimeMinutes} min read</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Timeline Results */}
              {filteredTimeline.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Timeline Events
                  </span>
                  {filteredTimeline.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => {
                        onNavigate('timeline');
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 backdrop-blur-md cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">{evt.title} ({evt.yearCE} CE)</p>
                        <p className="text-[10px] text-slate-400">{evt.location} • {evt.category}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
