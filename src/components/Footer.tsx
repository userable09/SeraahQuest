import React from 'react';
import { Globe, Linkedin, Heart, Sparkles, ExternalLink, Code } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90 backdrop-blur-xl py-10 text-slate-400 relative z-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          
          {/* Brand Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(5,150,105,0.4)]">
                ﷺ
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                SEERAH<span className="text-emerald-400">QUEST</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              An interactive, AI-powered Islamic educational platform dedicated to studying the noble biography of Prophet Muhammad ﷺ.
            </p>
          </div>

          {/* Durood & Islamic Greeting */}
          <div className="text-center space-y-2">
            <p className="font-arabic text-emerald-400 text-lg sm:text-xl font-medium tracking-wide">
              اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ
            </p>
            <p className="text-[11px] text-slate-400">
              Content verified against classical biographies (*Ar-Raheeq Al-Makhtum*, *Sirat Ibn Hisham*)
            </p>
          </div>

          {/* Developer Spotlight & Links */}
          <div className="flex flex-col items-center md:items-end justify-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>Developer Spotlight</span>
            </div>
            
            <p className="text-xs text-slate-300 font-medium">
              Developed with <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-rose-500/30" /> by{' '}
              <a
                href="https://www.maryamtahir.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-bold hover:text-emerald-300 underline decoration-emerald-500/40 underline-offset-4 transition-colors"
              >
                Maryam Tahir
              </a>
            </p>

            <div className="flex items-center gap-2 pt-1">
              {/* Portfolio Link */}
              <a
                href="https://www.maryamtahir.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-xs text-slate-200 hover:text-emerald-300 font-medium transition-all shadow-xs"
                title="View Portfolio"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portfolio</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>

              {/* LinkedIn Link */}
              <a
                href="https://www.linkedin.com/in/maryam-tahir-developer/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-sky-500/15 border border-white/10 hover:border-sky-500/40 text-xs text-slate-200 hover:text-sky-300 font-medium transition-all shadow-xs"
                title="Connect on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Seerah Quest Scholar. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Built for Islamic Knowledge & Education</span>
            <span>•</span>
            <a
              href="https://www.maryamtahir.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400/80 hover:text-emerald-300 hover:underline"
            >
              maryamtahir.tech
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
