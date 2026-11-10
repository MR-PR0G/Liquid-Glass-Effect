import React from 'react';
import { BACKGROUND_PATTERNS } from '../background/GeneratorBackdrop';
import { Sparkles } from 'lucide-react';

interface BackgroundSelectorProps {
  currentId: string;
  onSelect: (id: string) => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentId,
  onSelect,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-10">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
          <Sparkles size={14} className="text-cyan-400" />
          <span>Interactive Background Texture</span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">Select a backdrop to test refraction</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        {BACKGROUND_PATTERNS.map((pattern) => {
          const isActive = pattern.id === currentId;
          return (
            <button
              key={pattern.id}
              onClick={() => onSelect(pattern.id)}
              className={`group relative h-16 rounded-xl border overflow-hidden p-2 flex flex-col justify-end text-left transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'border-cyan-400/80 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-500/10'
                  : 'border-white/10 hover:border-white/25 bg-slate-900/40'
              }`}
            >
              {/* Pattern Mini Preview */}
              <div 
                className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity"
                style={pattern.style}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <span className="relative z-10 text-[10px] font-semibold text-slate-200 truncate group-hover:text-white">
                {pattern.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
