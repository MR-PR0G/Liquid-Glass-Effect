import React from 'react';
import { TopographicFlow } from '../topographic-flow';
import { Sparkles, Maximize2, Flame, PackageCheck } from 'lucide-react';

const FEATURES = [
  {
    num: '01 • SNELL OPTICS',
    title: 'Light Bends, Not Blurs',
    desc: 'True Snell refraction vectors bend background geometry with crystal clarity.',
    icon: Sparkles,
  },
  {
    num: '02 • MENISCUS BEVEL',
    title: 'Curved Edge Prisms',
    desc: 'Parametric edge curves sculpt natural dispersion rainbow fringe highlights.',
    icon: Maximize2,
  },
  {
    num: '03 • 120 FPS GPU',
    title: 'Surgical Sub-0.4ms',
    desc: 'Direct GLSL fragment loops execute with zero stutter on low-end hardware.',
    icon: Flame,
  },
  {
    num: '04 • EXPORT READY',
    title: 'Single-File & npm',
    desc: 'Instant standalone HTML or official @mr-prog/liquid-glass package.',
    icon: PackageCheck,
  },
];

export const FeaturesMarquee: React.FC = React.memo(() => {
  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 my-4 sm:my-6 select-none">
      <div 
        className="relative w-full h-[88px] sm:h-[96px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#030406] shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex items-center cursor-default pointer-events-auto"
        style={{ isolation: 'isolate', contain: 'strict' }}
      >
        <div 
          className="absolute inset-0 w-full h-full opacity-65 pointer-events-auto"
          style={{ transform: 'translate3d(0, 0, 0)', willChange: 'contents', isolation: 'isolate' }}
        >
          <TopographicFlow
            animateEntrance={false}
            scale={220}
            density={4}
            speed={1.4}
            distortion={0.65}
            lineWidth={1.2}
            opacity={0.8}
            dashLength={0}
            dashGap={0}
            seed={106}
            gradientDiffusion={0}
            paused={false}
            hover={0.8}
            hoverRadius={180}
            hoverFollow={0.18}
            hoverFade={0.75}
            hoverEffect="rings"
            backgroundColor="#030406"
            backgroundImage="none"
            gradientColors={[]}
            grain={0}
            lineColor="#71717a"
            accentColor="#a1a1aa"
            lineStyle="solid"
            className="w-full h-full"
          />
        </div>

        <div className="absolute inset-0 bg-black/35 pointer-events-none" />

        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#030406] via-[#030406]/90 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#030406] via-[#030406]/90 to-transparent z-20" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent z-20" />

        <div 
          className="relative z-10 w-full overflow-hidden flex items-center pointer-events-none"
          style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform', isolation: 'isolate' }}
        >
          <div className="features-marquee-glide flex items-center">
            {/* Track 1 */}
            <div className="flex items-center shrink-0">
              {FEATURES.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`h1-${index}`}
                    className="flex items-center gap-4 px-8 sm:px-10 shrink-0 select-none"
                    style={{ transform: 'translateZ(0)' }}
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-widest text-zinc-400">
                        {item.num}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                        {item.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-zinc-300 font-light whitespace-nowrap mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Track 2 */}
            <div className="flex items-center shrink-0" aria-hidden="true">
              {FEATURES.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`h2-${index}`}
                    className="flex items-center gap-4 px-8 sm:px-10 shrink-0 select-none"
                    style={{ transform: 'translateZ(0)' }}
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-widest text-zinc-400">
                        {item.num}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                        {item.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-zinc-300 font-light whitespace-nowrap mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
});
