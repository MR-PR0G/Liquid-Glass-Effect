import React from 'react';
import { RefractedText } from '../components/refracted-text/refracted-text';
import { InteractiveGlassSandbox } from '../components/generator/InteractiveGlassSandbox';
import { FeaturesMarquee } from '../components/features/FeaturesMarquee';
import { LiquidGlassConfig, DEFAULT_GLASS_STEPS } from '../types';

interface HomePageProps {
  config: LiquidGlassConfig;
  onChangeSteps: (steps: Partial<typeof DEFAULT_GLASS_STEPS>) => void;
  onResetSteps: () => void;
  isLoaded?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  config,
  onChangeSteps,
  onResetSteps,
  isLoaded = true,
}) => {
  return (
    <div className="relative z-10 w-full min-h-screen text-slate-100 flex flex-col items-center bg-[#040406] overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* 
        Matte Black Background with Zero-Cost Hardware Radial Halo Light Drift:
        Pure radial gradient fades with 0ms GPU blur filter overhead
      */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div 
          className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(148, 163, 184, 0.12) 0%, rgba(56, 189, 248, 0.05) 35%, rgba(56, 189, 248, 0.01) 60%, transparent 75%)',
          }}
        />
        <div 
          className="absolute top-[60%] -left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(203, 213, 225, 0.07) 0%, rgba(203, 213, 225, 0.02) 40%, transparent 70%)',
          }}
        />
      </div>

      {/* ===================== 1. TOP HERO: LIQUID GLASS REFRACTED TITLE ===================== */}
      {/* Grand, responsive, prominent typography; black initially until loaded */}
      <header className="relative z-10 w-full pt-16 sm:pt-24 pb-6 sm:pb-8 px-4 flex flex-col items-center justify-center text-center">
        <div 
          className="w-full max-w-2xl sm:max-w-3xl mx-auto flex items-center justify-center overflow-visible select-none py-2"
          style={{ containerType: 'inline-size' }}
        >
          {isLoaded ? (
            <RefractedText
              key="hero-refracted-revealed"
              text="LIQUID GLASS"
              theme="dark"
              topColor="auto"
              bottomColor="auto"
              beamColor="auto"
              spectrumWarmColor="auto"
              spectrumMiddleColor="auto"
              spectrumCoolColor="auto"
              reveal={true}
              stagger={0.18}
              liftDuration={1.1}
              ease="power4.out"
              beamFollowsLift={false}
              animateBeam={true}
              openingDuration={1.8}
              duration={13.2}
              intensity={1.2}
              dispersion={1}
              colorIntensity={1}
              beamPosition={0.5}
              fixedBeam={false}
              paused={false}
              cursorMovesBeam={false}
              fontSize="clamp(42px, 8.5vw, 88px)"
              fontFamily="'ReactDrops Square Display', 'Arial Black', sans-serif"
              fontWeight={900}
              letterSpacing="normal"
              extraBold={2.25}
              fontHeight={100}
              cornerRounding={1}
            />
          ) : (
            <div className="w-full h-14 bg-transparent" />
          )}
        </div>
      </header>

      {/* ===================== 2. DESCRIPTION ===================== */}
      <section className="relative z-10 w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 pt-1 pb-4 text-center space-y-1.5">
        <p className="text-sm sm:text-base md:text-lg lg:text-[17px] font-medium text-slate-200 leading-relaxed max-w-3xl lg:max-w-none mx-auto tracking-wide">
          Next-generation Liquid Glass UI engineered with physical optical simulation and zero runtime overhead.
        </p>
        <p className="text-xs sm:text-sm md:text-[13.5px] font-light text-slate-400/90 max-w-2xl lg:max-w-none mx-auto tracking-wide">
          Featuring real-time Snell ray-tracing, parametric meniscus bevels, chromatic dispersion, and interactive controls.
        </p>
      </section>

      {/* ===================== 3. SINGLE-LINE FEATURES MARQUEE WITH TOPOGRAPHIC FLOW ===================== */}
      <FeaturesMarquee />

      {/* ===================== 4. COMPACT OPTICAL SANDBOX ===================== */}
      <InteractiveGlassSandbox
        config={config}
        onChangeSteps={onChangeSteps}
        onResetSteps={onResetSteps}
      />

      {/* ===================== 5. POST-BOX: POWERED BY MR PROG ===================== */}
      {/* Prominent, balanced, tall font height, never squashed or cut off */}
      <div className="relative z-10 w-full max-w-4xl mx-auto pt-12 pb-4 px-4 flex flex-col items-center justify-center text-center">
        <div 
          className="w-full max-w-xl mx-auto flex items-center justify-center overflow-visible select-none py-2"
          style={{ containerType: 'inline-size' }}
        >
          <RefractedText
            text="POWERED BY MR PROG"
            theme="dark"
            topColor="auto"
            bottomColor="auto"
            beamColor="auto"
            spectrumWarmColor="auto"
            spectrumMiddleColor="auto"
            spectrumCoolColor="auto"
            reveal={false}
            stagger={0}
            liftDuration={0}
            ease="power4.out"
            beamFollowsLift={false}
            animateBeam={true}
            openingDuration={0}
            duration={13.2}
            intensity={1.2}
            dispersion={1}
            colorIntensity={1}
            beamPosition={0.5}
            fixedBeam={false}
            paused={false}
            cursorMovesBeam={false}
            fontSize="clamp(24px, 4.5vw, 46px)"
            fontFamily="'ReactDrops Square Display', 'Arial Black', sans-serif"
            fontWeight={900}
            letterSpacing="normal"
            extraBold={2.25}
            fontHeight={85}
            cornerRounding={1}
          />
        </div>

        <p className="mt-1 text-xs font-light text-slate-400 tracking-[0.25em] lowercase italic select-none">
          with love
        </p>

        {/* Minimalist License & Version Badges */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-mono text-zinc-400 select-none">
          <span className="px-3 py-0.5 rounded-full bg-white/10 border border-white/20 text-white font-mono font-bold tracking-wider text-xs shadow-sm">
            v0.2.7
          </span>
          <a
            href="https://github.com/MR-PR0G/LiquidGlass"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 px-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 text-zinc-300 hover:text-white transition-all active:scale-95 flex items-center gap-1.5"
            title="GitHub Repository: MR-PR0G/LiquidGlass"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="font-mono text-[11px] text-zinc-200">LiquidGlass</span>
          </a>
          <span className="text-zinc-600">•</span>
          <a
            href="https://github.com/MR-PR0G"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-white transition-colors underline-offset-2 hover:underline font-mono"
            title="MR PROG GitHub Profile"
          >
            MR PROG
          </a>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-300">
            MIT License — Open Source & Free
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-zinc-500 text-[10px]">
            Experimental Optical Lab Project
          </span>
        </div>
      </div>

    </div>
  );
};
