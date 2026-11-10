import React from 'react';
import { Sparkles, Compass, Music, Camera, Mail, Shield, Terminal, Cpu } from 'lucide-react';

interface DynamicBackdropProps {
  wallpaperIndex: number;
}

export const WALLPAPERS = [
  {
    id: 'nebula',
    name: 'iOS 27 Nebula Fluid',
    description: 'گرادیان‌های امواج سیال فرابنفش و فیروزه‌ای برای مشاهده تغییر فرم مایع',
  },
  {
    id: 'app-grid',
    name: 'آیکون‌ها و ساختار برنامه‌ها',
    description: 'ردیف آیکون‌های شناور برای تست مستقیم خمیدگی و عبور نور پشت داک',
  },
  {
    id: 'geometric',
    name: 'شبکه خطوط هندسی (Grid)',
    description: 'خطوط دقیق هندسی برای ارزیابی دقیق شکست نور و انحنای منیسک',
  },
  {
    id: 'sunset',
    name: 'شفق نارنجی و بنفش متالیک',
    description: 'کنتراست گرم و سرد برای مشاهده تلألؤ حاشیه‌ای شیشه مایع',
  },
];

export const DynamicBackdrop: React.FC<DynamicBackdropProps> = ({
  wallpaperIndex,
}) => {
  const current = WALLPAPERS[wallpaperIndex % WALLPAPERS.length];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      
      {/* 1. Nebula Aurora Fluid Gradient Wallpaper */}
      {current.id === 'nebula' && (
        <div className="absolute inset-0 bg-[#090b10] transition-opacity duration-1000">
          {/* Animated vibrant fluid color blobs */}
          <div 
            className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] rounded-full blur-[120px] opacity-60 animate-float"
            style={{
              background: 'radial-gradient(circle, #38bdf8 0%, #6366f1 50%, transparent 80%)',
            }}
          />
          <div 
            className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] rounded-full blur-[130px] opacity-50"
            style={{
              background: 'radial-gradient(circle, #ec4899 0%, #8b5cf6 50%, transparent 80%)',
              animation: 'float 8s ease-in-out infinite reverse',
            }}
          />
          <div 
            className="absolute -bottom-[20%] left-[20%] w-[65vw] h-[55vw] rounded-full blur-[140px] opacity-70"
            style={{
              background: 'radial-gradient(circle, #06b6d4 0%, #3b82f6 50%, #4f46e5 80%, transparent 100%)',
            }}
          />
          {/* Soft ambient vignette */}
          <div className="absolute inset-0 bg-radial-vignette opacity-40" />
        </div>
      )}

      {/* 2. Floating App Icons Grid (Simulating iOS home screen background behind dock) */}
      {current.id === 'app-grid' && (
        <div className="absolute inset-0 bg-[#0b0f19] transition-opacity duration-1000 flex flex-col justify-between p-8 pb-32">
          {/* Background subtle glow */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] rounded-full blur-[100px] opacity-40"
            style={{
              background: 'radial-gradient(circle, #38bdf8 0%, #a855f7 60%, transparent 80%)',
            }}
          />

          {/* Top grid of mock apps */}
          <div className="max-w-4xl mx-auto w-full pt-20 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6 opacity-60">
            {[
              { label: 'Files', icon: Compass, color: 'from-blue-500 to-cyan-500' },
              { label: 'Camera', icon: Camera, color: 'from-slate-700 to-slate-900' },
              { label: 'Music', icon: Music, color: 'from-pink-500 to-rose-600' },
              { label: 'Mail', icon: Mail, color: 'from-sky-400 to-blue-600' },
              { label: 'Security', icon: Shield, color: 'from-emerald-500 to-teal-600' },
              { label: 'Terminal', icon: Terminal, color: 'from-zinc-800 to-black' },
              { label: 'System', icon: Cpu, color: 'from-purple-500 to-indigo-700' },
              { label: 'AI Studio', icon: Sparkles, color: 'from-amber-400 to-orange-600' },
            ].map((app, idx) => {
              const Icon = app.icon;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-lg border border-white/20`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{app.label}</span>
                </div>
              );
            })}
          </div>

          {/* Lower row of mock apps right above and passing behind the dock */}
          <div className="max-w-3xl mx-auto w-full grid grid-cols-4 sm:grid-cols-6 gap-6 opacity-75">
            {[
              { label: 'Analytics', icon: Cpu, color: 'from-cyan-500 to-blue-600' },
              { label: 'Podcast', icon: Music, color: 'from-purple-600 to-pink-500' },
              { label: 'Browser', icon: Compass, color: 'from-blue-600 to-indigo-700' },
              { label: 'Messages', icon: Mail, color: 'from-emerald-500 to-green-600' },
              { label: 'Code', icon: Terminal, color: 'from-slate-800 to-slate-950' },
              { label: 'Vault', icon: Shield, color: 'from-amber-500 to-red-600' },
            ].map((app, idx) => {
              const Icon = app.icon;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-xl border border-white/25`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium">{app.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Geometric Optical Grid (To verify Snell's refraction law bending) */}
      {current.id === 'geometric' && (
        <div className="absolute inset-0 bg-[#08090d] transition-opacity duration-1000">
          {/* High precision SVG grid */}
          <svg className="w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              </pattern>
              <radialGradient id="gridGlow" cx="50%" cy="85%" r="45%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#818cf8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#08090d" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#gridGlow)" />
            
            {/* Concentric evaluation circles behind dock area */}
            <circle cx="50%" cy="92%" r="180" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
            <circle cx="50%" cy="92%" r="280" fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="6 6" opacity="0.3" />
          </svg>
        </div>
      )}

      {/* 4. Warm Metallic Sunset Liquid Wallpaper */}
      {current.id === 'sunset' && (
        <div className="absolute inset-0 bg-[#0c0812] transition-opacity duration-1000">
          <div 
            className="absolute -top-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full blur-[130px] opacity-60"
            style={{
              background: 'radial-gradient(circle, #f97316 0%, #db2777 50%, transparent 80%)',
            }}
          />
          <div 
            className="absolute bottom-0 left-[10%] w-[65vw] h-[45vw] rounded-full blur-[140px] opacity-70"
            style={{
              background: 'radial-gradient(circle, #a855f7 0%, #6366f1 40%, #0ea5e9 80%, transparent 100%)',
            }}
          />
        </div>
      )}

    </div>
  );
};
