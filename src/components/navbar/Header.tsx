import React from 'react';
import { Logo } from './Logo';
import { Sliders, Image as ImageIcon } from 'lucide-react';

interface HeaderProps {
  onToggleTuner: () => void;
  onNextWallpaper: () => void;
  currentWallpaperName: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleTuner,
  onNextWallpaper,
  currentWallpaperName,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3.5">
          <Logo size={42} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base md:text-lg tracking-tight text-white">
                پوریا عسگری
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                آماده همکاری
              </span>
            </div>
            <span className="text-xs text-slate-400 font-normal">
              Software Engineer & Liquid Interface Architect
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Wallpaper Switcher */}
          <button
            onClick={onNextWallpaper}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-colors backdrop-blur-md"
            title="تغییر پس‌زمینه برای مشاهده شکست نور مایع شیشه‌ای"
          >
            <ImageIcon size={14} className="text-sky-400" />
            <span className="hidden sm:inline">پس‌زمینه:</span>
            <span className="text-sky-300 font-mono text-[11px]">{currentWallpaperName}</span>
          </button>

          {/* Liquid Glass Parameters Inspector */}
          <button
            onClick={onToggleTuner}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-sky-500/20 to-purple-500/20 hover:from-sky-500/30 hover:to-purple-500/30 border border-sky-400/30 text-white transition-all shadow-sm"
            title="تنظیمات فیزیک شیشه مایع (شکست، انحنا، تلألؤ)"
          >
            <Sliders size={14} className="text-purple-300" />
            <span className="hidden sm:inline">تنظیم فیزیک شیشه</span>
          </button>
        </div>

      </div>
    </header>
  );
};
