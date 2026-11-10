import React, { useRef } from 'react';
import { BACKGROUND_PATTERNS, BackgroundPattern } from '../background/GeneratorBackdrop';
import { Check, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

interface Material3BackgroundSelectorProps {
  currentId: string;
  onSelect: (id: string) => void;
}

export const Material3BackgroundSelector: React.FC<Material3BackgroundSelectorProps> = ({
  currentId,
  onSelect,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-8">
      {/* Material 3 Surface Container High */}
      <div className="relative rounded-3xl bg-slate-900/70 border border-white/10 p-5 sm:p-6 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
        
        {/* Subtle M3 Surface Tint Layer */}
        <div className="absolute inset-0 bg-cyan-500/[0.02] pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shadow-sm">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Select a Background for Testing...
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Choose a bold pattern or fluid gradient to observe Snell's law refraction in action
              </p>
            </div>
          </div>

          {/* Scroll Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95"
              title="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95"
              title="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Responsive Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="relative z-10 flex items-stretch gap-3.5 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: 'thin' }}
        >
          {BACKGROUND_PATTERNS.map((pattern: BackgroundPattern) => {
            const isSelected = pattern.id === currentId;

            return (
              <button
                key={pattern.id}
                onClick={() => onSelect(pattern.id)}
                className={`group flex-shrink-0 w-44 sm:w-52 rounded-2xl p-2.5 flex flex-col justify-between border text-left transition-all duration-200 snap-start active:scale-95 ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-400/80 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/15'
                    : 'bg-black/40 border-white/10 hover:border-white/25 hover:bg-black/60'
                }`}
              >
                {/* Real Visual Pattern Preview Thumbnail */}
                <div 
                  className="w-full h-24 rounded-xl border border-white/10 overflow-hidden relative shadow-inner"
                  style={pattern.thumbnailStyle}
                >
                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Pattern Info */}
                <div className="mt-3 px-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-cyan-300' : 'text-slate-200 group-hover:text-white'}`}>
                      {pattern.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-light">
                    {pattern.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
