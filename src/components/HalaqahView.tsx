import React, { useState } from 'react';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  X,
  ExternalLink
} from 'lucide-react';
import { LiveHalaqah } from '../types';
import { HALAQAHS_DATA } from '../data/halaqahs';

export const HalaqahView: React.FC = () => {
  const [activeMeetingRoom, setActiveMeetingRoom] = useState<LiveHalaqah | null>(null);
  const [rsvpedIds, setRsvpedIds] = useState<string[]>([]);

  const handleToggleRSVP = (id: string) => {
    if (rsvpedIds.includes(id)) {
      setRsvpedIds(rsvpedIds.filter((i) => i !== id));
    } else {
      setRsvpedIds([...rsvpedIds, id]);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-rose-400" />
            <span>Live Seerah Study Halaqahs</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Join weekly live study circles with scholar lectures, Q&A discussions, and study material downloads
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Jitsi Meet Integration Active</span>
        </span>
      </div>

      {/* Live Active Room Banner */}
      <div className="bg-emerald-950/40 backdrop-blur-xl border border-emerald-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.37)] p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-rose-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]">
            ● Live Right Now
          </span>
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>142 Scholars Attending</span>
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Weekly Seerah Circle: Lessons from the Treaty of Hudaybiyyah
          </h2>
          <p className="text-xs text-amber-200/80 mt-1">
            Led by Dr. Yasir Qadhi • Dean of Islamic Studies
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          Interactive study session discussing how prophetic diplomacy during Hudaybiyyah paved the way for the peaceful expansion of Islam across the Arabian Peninsula.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => setActiveMeetingRoom(HALAQAHS_DATA[0])}
            className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            <span>Join Live Halaqah Room</span>
          </button>
        </div>
      </div>

      {/* Upcoming Halaqahs Schedule */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">
          Upcoming Scheduled Sessions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HALAQAHS_DATA.map((hal) => {
            const isRSVP = rsvpedIds.includes(hal.id);

            return (
              <div
                key={hal.id}
                className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      {hal.platform}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {hal.date} at {hal.time}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {hal.title}
                  </h3>

                  <p className="text-xs font-bold text-slate-300">
                    {hal.speaker} ({hal.speakerTitle})
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {hal.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {hal.topics.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleRSVP(hal.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isRSVP
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 backdrop-blur-md'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isRSVP ? 'RSVP Confirmed' : 'RSVP for Session'}</span>
                  </button>

                  <button
                    onClick={() => setActiveMeetingRoom(hal)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1"
                  >
                    <span>Launch Room</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Jitsi Meet Embed Modal */}
      {activeMeetingRoom && (
        <div className="fixed inset-0 z-50 bg-[#050a08]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#09100d] max-w-5xl w-full h-[85vh] rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-[0_16px_64px_rgba(0,0,0,0.5)] relative">
            
            {/* Room Header */}
            <div className="p-4 bg-white/5 border-b border-white/10 backdrop-blur-md flex items-center justify-between text-amber-100 z-10">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-white">{activeMeetingRoom.title}</h3>
                  <p className="text-[11px] text-slate-400">Jitsi Meet Room: {activeMeetingRoom.meetRoomName}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveMeetingRoom(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Jitsi Iframe */}
            <div className="flex-1 w-full bg-slate-950 relative z-0">
              <iframe
                src={`https://meet.jit.si/${activeMeetingRoom.meetRoomName}#userInfo.displayName="Seerah%20Quest%20Scholar"`}
                allow="camera; microphone; display-capture; autoplay"
                className="w-full h-full border-0"
                title="Live Jitsi Study Room"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
