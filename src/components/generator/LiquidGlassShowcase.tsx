import React, { useState } from 'react';
import { LiquidGlassConfig } from '../../types';
import { SoapBubbleSurface } from '../soap-bubble';
import { Copy, Check, FileCode, Code2, Terminal } from 'lucide-react';

interface LiquidGlassShowcaseProps {
  config: LiquidGlassConfig;
}

export const LiquidGlassShowcase: React.FC<LiquidGlassShowcaseProps> = ({ config }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const darkTintRgba = config.darkTint > 0 ? `rgba(0, 0, 0, ${config.darkTint})` : 'transparent';

  const handleCopyReact = () => {
    const code = `import React from 'react';
import { LiquidGlass } from '@mr-prog/liquid-glass';

export const MyCustomGlassBox = () => {
  return (
    <LiquidGlass
      refraction={${config.refraction}}
      bevel={${config.bevel}}
      dispersion={${config.dispersion}}
      blur={${config.blur}}
      darkTint={${config.darkTint}}
      radius={${config.radius}}
      style={{
        width: '${config.width}px',
        height: '${config.height}px',
      }}
      className="flex items-center justify-center mx-auto"
    >
      <span className="text-white font-mono font-bold tracking-widest text-sm">
        LIQUID GLASS
      </span>
    </LiquidGlass>
  );
};`;
    navigator.clipboard.writeText(code);
    setCopiedType('react');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopyTailwind = () => {
    const code = `/* Tailwind CSS / Inline Styling Snippet */
<div 
  style={{
    width: '${config.width}px',
    height: '${config.height}px',
    borderRadius: '${config.radius >= 999 ? '9999px' : `${config.radius}px`}',
    border: '0.75px solid rgba(255, 255, 255, ${config.borderOpacity})',
    backgroundColor: '${darkTintRgba}',
    backdropFilter: '${config.blur > 0 ? `blur(${config.blur}px)` : 'none'}',
    WebkitBackdropFilter: '${config.blur > 0 ? `blur(${config.blur}px)` : 'none'}',
    boxShadow: '${config.darkTint > 0 ? `0 14px 34px rgba(0, 0, 0, ${config.darkTint * 0.5})` : 'none'}',
  }}
  className="flex items-center justify-center"
>
  <span className="text-white font-mono text-sm tracking-widest">LIQUID GLASS</span>
</div>`;
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
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-10 flex flex-col items-center">
      
      {/* Title & Dimension Badge */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-4 px-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
          <Terminal size={14} className="text-cyan-400" />
          <span>LIVE REFRACTIVE PREVIEW</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Width: <strong className="text-cyan-300">{config.width}px</strong></span>
          <span>•</span>
          <span>Height: <strong className="text-cyan-300">{config.height}px</strong></span>
        </div>
      </div>

      {/* The Liquid Glass Box / Surface */}
      <div className="w-full min-h-[300px] py-12 flex items-center justify-center relative overflow-visible">
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
          className="flex items-center justify-center transition-all duration-150 will-change-transform shadow-2xl"
          style={{
            width: `min(92vw, ${config.width}px)`,
            height: `${config.height}px`,
            borderRadius: config.radius >= 999 ? '9999px' : `${config.radius}px`,
            border: `0.75px solid rgba(255, 255, 255, ${config.borderOpacity})`,
            backgroundColor: darkTintRgba,
            backdropFilter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
            WebkitBackdropFilter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
            boxShadow: config.darkTint > 0 
              ? `inset 0 1px 0.5px rgba(255, 255, 255, 0.14), 0 16px 36px rgba(0, 0, 0, ${config.darkTint * 0.5})`
              : 'inset 0 1px 0.5px rgba(255, 255, 255, 0.10)',
            '--soap-bubble-shadow': 'none',
            contain: 'paint',
          } as React.CSSProperties}
        >
          {/* Text inside the glass */}
          <div className="flex items-center gap-2.5 tracking-[0.25em] text-xs sm:text-base font-bold text-white uppercase drop-shadow-md font-mono select-none pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
            <span>LIQUID GLASS</span>
          </div>
        </SoapBubbleSurface>
      </div>

      {/* Copy / Export Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        <button
          onClick={handleCopyReact}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-400/30 hover:border-cyan-400/60 text-xs font-mono text-cyan-300 hover:text-white shadow-xl transition-all active:scale-95"
        >
          {copiedType === 'react' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copiedType === 'react' ? 'Copied Component!' : 'Copy React Component'}</span>
        </button>

        <button
          onClick={handleCopyTailwind}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 hover:border-white/30 text-xs font-mono text-slate-300 hover:text-white shadow-xl transition-all active:scale-95"
        >
          {copiedType === 'tailwind' ? <Check size={14} className="text-emerald-400" /> : <FileCode size={14} />}
          <span>{copiedType === 'tailwind' ? 'Copied Tailwind CSS!' : 'Copy Tailwind CSS'}</span>
        </button>

        <button
          onClick={handleCopyConfig}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 hover:border-white/30 text-xs font-mono text-slate-300 hover:text-white shadow-xl transition-all active:scale-95"
        >
          {copiedType === 'json' ? <Check size={14} className="text-emerald-400" /> : <Code2 size={14} />}
          <span>{copiedType === 'json' ? 'Copied JSON Config!' : 'Export JSON Config'}</span>
        </button>
      </div>

    </section>
  );
};
