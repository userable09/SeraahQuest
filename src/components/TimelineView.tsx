import React, { useState } from 'react';
import { 
  Clock, 
  Search, 
  MapPin, 
  Users, 
  BookOpen, 
  ChevronRight, 
  X, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { TimelineEvent } from '../types';
import { TIMELINE_DATA } from '../data/timeline';

export const TimelineView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const categories = [
    'All',
    'Birth & Early Life',
    'Meccan Persecution',
    'Migration (Hijrah)',
    'Battles',
    'Treaties & Diplomacy',
    'Final Years'
  ];

  const filteredEvents = TIMELINE_DATA.filter((e) => {
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.keyFigures.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-400" />
            <span>Interactive Seerah Timeline</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Chronological journey through pivotal events in the life of Prophet Muhammad ﷺ (570 CE – 632 CE)
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, locations, figures..."
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

      {/* Vertical Animated Timeline Line */}
      <div className="relative border-l-2 border-emerald-500/30 ml-4 sm:ml-8 pl-6 space-y-8">
        {filteredEvents.map((evt) => (
          <div 
            key={evt.id}
            onClick={() => setSelectedEvent(evt)}
            className="relative group cursor-pointer"
          >
            {/* Timeline Dot Indicator */}
            <div className="absolute -left-[35px] top-1.5 w-5 h-5 rounded-full bg-emerald-500 border-4 border-[#050a08] group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(16,185,129,0.5)]" />

            {/* Event Card */}
            <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 group-hover:border-emerald-500/50 group-hover:bg-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)] transition-all space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
                    {evt.yearCE} CE ({evt.yearBH_AH})
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {evt.category}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{evt.location}</span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                {evt.title}
              </h2>

              {evt.arabicTitle && (
                <p className="font-arabic text-amber-400 text-sm">
                  {evt.arabicTitle}
                </p>
              )}

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {evt.description}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Key Figures: {evt.keyFigures.slice(0, 3).join(', ')}</span>
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Event Details</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-[#050a08]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#09100d] max-w-2xl w-full rounded-3xl border border-white/10 p-6 sm:p-8 space-y-5 relative max-h-[90vh] overflow-y-auto shadow-[0_16px_64px_rgba(0,0,0,0.5)]">
            
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
                {selectedEvent.yearCE} CE • {selectedEvent.yearBH_AH}
              </span>
              <h2 className="text-2xl font-bold text-white pt-1">
                {selectedEvent.title}
              </h2>
              {selectedEvent.arabicTitle && (
                <p className="font-arabic text-amber-400 text-base">
                  {selectedEvent.arabicTitle}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-300 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>Location: <strong>{selectedEvent.location}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Category: <strong>{selectedEvent.category}</strong></span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Historical Event Record
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {selectedEvent.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md space-y-1">
              <h3 className="text-xs font-bold text-amber-400">
                Historical & Spiritual Significance
              </h3>
              <p className="text-xs text-slate-200">
                {selectedEvent.significance}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-300">
                Key Historical Figures Involved
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedEvent.keyFigures.map((fig, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium">
                    {fig}
                  </span>
                ))}
              </div>
            </div>

            {selectedEvent.quranHadithRef && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-300 backdrop-blur-md">
                📖 Primary Reference: {selectedEvent.quranHadithRef}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
              >
                Close Event
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
