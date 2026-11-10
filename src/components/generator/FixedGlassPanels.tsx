import React, { useState } from 'react';
import { LiquidGlassConfig } from '../../types';
import { SoapBubbleSurface } from '../soap-bubble';
import { 
  Sliders, 
  Copy, 
  Check, 
  RotateCcw, 
  Code2, 
  ChevronUp,
  ChevronDown,
  FileCode
} from 'lucide-react';

interface FixedGlassPanelsProps {
  config: LiquidGlassConfig;
  onChangeConfig: (updates: Partial<LiquidGlassConfig>) => void;
  onResetConfig: () => void;
}

export const FixedGlassPanels: React.FC<FixedGlassPanelsProps> = ({
  config,
  onChangeConfig,
  onResetConfig,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isTunerExpanded, setIsTunerExpanded] = useState(true);

  const darkTintRgba = config.darkTint > 0 ? `rgba(0, 0, 0, ${config.darkTint})` : 'transparent';

  const handleCopyReact = () => {
    const code = `import React from 'react';
import { LiquidGlass } from '@mr-prog/liquid-glass';

export const MyGlass = () => {
  return (
    <LiquidGlass
      refraction={${config.refraction}}
      bevel={${config.bevel}}
      dispersion={${config.dispersion}}
      blur={${config.blur}}
      darkTint={${config.darkTint}}
      radius={${config.radius}}
      className="w-full max-w-xl h-[${config.height}px] rounded-full flex items-center justify-center"
    >
      <span className="text-white font-semibold tracking-wider text-sm">LIQUID GLASS</span>
    </LiquidGlass>
  );
};`;
    navigator.clipboard.writeText(code);
    setCopiedType('react');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopyTailwind = () => {
    const code = `/* Tailwind CSS Classes / Inline Spec */
className="w-[88vw] max-w-xl h-[${config.height}px] ${config.radius >= 999 ? 'rounded-full' : `rounded-[${config.radius}px]`} border border-white/[${config.borderOpacity}] ${config.blur > 0 ? `backdrop-blur-[${config.blur}px]` : ''} ${config.darkTint > 0 ? `bg-black/[${config.darkTint}]` : 'bg-transparent'}"`;
    navigator.clipboard.writeText(code);
    setCopiedType('tailwind');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedType('json');
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94vw] max-w-2xl flex flex-col items-center gap-2 select-none pointer-events-auto">
      
      {/* ==================== PANEL 1: SETTINGS & TUNER GLASS ==================== */}
      <div className="w-full rounded-2xl sm:rounded-3xl bg-slate-950/75 border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Tuner Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-400/20">
              <Sliders size={14} />
            </div>
            <div>
              <span className="text-xs font-bold text-white font-mono tracking-wide">GENERATOR CONTROLS</span>
              <span className="hidden sm:inline text-[10px] text-slate-400 ml-2 font-light">Real-time Snell optics</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetConfig}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-white transition-all active:scale-95"
              title="Reset to defaults"
            >
              <RotateCcw size={11} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={() => setIsTunerExpanded(!isTunerExpanded)}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              aria-label="Toggle panel"
            >
              {isTunerExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>

        {/* Tuner Sliders Body */}
        {isTunerExpanded && (
          <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-h-[36vh] sm:max-h-none overflow-y-auto">
            
            {/* 1. Refraction */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-300">Refraction</span>
                <span className="text-cyan-400">{(config.refraction * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.60"
                step="0.01"
                value={config.refraction}
                onChange={(e) => onChangeConfig({ refraction: parseFloat(e.target.value) })}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 2. Meniscus Bevel */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-300">Meniscus Bevel</span>
                <span className="text-cyan-400">{config.bevel}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="48"
                step="1"
                value={config.bevel}
                onChange={(e) => onChangeConfig({ bevel: parseInt(e.target.value, 10) })}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 3. Chromatic Dispersion */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-300">Dispersion</span>
                <span className="text-cyan-400">{(config.dispersion * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.50"
                step="0.05"
                value={config.dispersion}
                onChange={(e) => onChangeConfig({ dispersion: parseFloat(e.target.value) })}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 4. Surface Blur */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-300">Blur</span>
                <span className="text-cyan-400">{config.blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={config.blur}
                onChange={(e) => onChangeConfig({ blur: parseInt(e.target.value, 10) })}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 5. Dark Tint Fade */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-300">Dark Tint</span>
                <span className="text-cyan-400">{(config.darkTint * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.80"
                step="0.05"
                value={config.darkTint}
                onChange={(e) => onChangeConfig({ darkTint: parseFloat(e.target.value) })}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 6. Height Dimension */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-300">Height</span>
                <span className="text-cyan-400">{config.height}px</span>
              </div>
              <input
                type="range"
                min="48"
                max="84"
                step="2"
                value={config.height}
                onChange={(e) => onChangeConfig({ height: parseInt(e.target.value, 10) })}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

          </div>
        )}

      </div>

      {/* ==================== PANEL 2: LIQUID GLASS PREVIEW BOX ==================== */}
      <aside 
        aria-label="Liquid Glass Bottom Panel"
        className="w-full flex items-center justify-center select-none"
      >
        <SoapBubbleSurface
          as="div"
          interactive={false}
          wobble={0}
          radius={config.radius}
          glass={config.glass}
          refraction={config.refraction}
          bevel={config.bevel}
          dispersion={config.dispersion}
          blur={config.blur}
          clearCenter={config.clearCenter}
          reflectivity={0.65}
          tint={darkTintRgba}
          oilCoverage={0}
          iridescence={0}
          glintIntensity={0}
          windowLight={false}
          windowIntensity={0}
          floorLight={0}
          bottomShade={false}
          keyLight={false}
          className="w-full max-w-xl flex items-center justify-center pointer-events-none transition-all duration-150 will-change-transform"
          style={{
            height: `${config.height}px`,
            borderRadius: config.radius >= 999 ? '9999px' : `${config.radius}px`,
            boxShadow: config.darkTint > 0 
              ? `inset 0 1px 0.5px rgba(255, 255, 255, 0.14), 0 14px 34px rgba(0, 0, 0, ${config.darkTint * 0.5})`
              : 'inset 0 1px 0.5px rgba(255, 255, 255, 0.10)',
            backgroundColor: darkTintRgba,
            border: `0.75px solid rgba(255, 255, 255, ${config.borderOpacity})`,
            backdropFilter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
            WebkitBackdropFilter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
            '--soap-bubble-shadow': 'none',
            contain: 'paint',
          } as React.CSSProperties}
        >
          {/* Exact clean requested lettering */}
          <div className="flex items-center gap-2 tracking-[0.25em] text-xs sm:text-sm font-bold text-white uppercase drop-shadow-sm font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>LIQUID GLASS</span>
          </div>
        </SoapBubbleSurface>
      </aside>

      {/* ==================== ACTION & EXPORT TOOLBAR ==================== */}
      <div className="flex items-center justify-center gap-2 pt-0.5">
        
        <button
          onClick={handleCopyReact}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-xs font-mono text-cyan-300 hover:text-white shadow-lg transition-all active:scale-95"
        >
          {copiedType === 'react' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          <span>{copiedType === 'react' ? 'Copied React!' : 'Copy React'}</span>
        </button>

        <button
          onClick={handleCopyTailwind}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-xs font-mono text-slate-300 hover:text-white shadow-lg transition-all active:scale-95"
        >
          {copiedType === 'tailwind' ? <Check size={13} className="text-emerald-400" /> : <FileCode size={13} />}
          <span>{copiedType === 'tailwind' ? 'Copied CSS!' : 'Copy CSS'}</span>
        </button>

        <button
          onClick={handleCopyConfig}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-xs font-mono text-slate-300 hover:text-white shadow-lg transition-all active:scale-95"
        >
          {copiedType === 'json' ? <Check size={13} className="text-emerald-400" /> : <Code2 size={13} />}
          <span>{copiedType === 'json' ? 'Copied Config!' : 'Export JSON'}</span>
        </button>

      </div>

    </div>
  );
};
