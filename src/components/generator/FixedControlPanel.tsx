import React, { useState } from 'react';
import { LiquidGlassConfig, DEFAULT_GLASS_STEPS } from '../../types';
import { generateStandaloneHtml, generateNodeReactCode } from '../../utils/exportCode';
import { 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Copy, 
  Download, 
  Check, 
  Sparkles,
  Maximize2,
  Flame,
  Shield,
  MoveHorizontal,
  MoveVertical,
  Package
} from 'lucide-react';

interface FixedControlPanelProps {
  config: LiquidGlassConfig;
  onChangeSteps: (steps: Partial<typeof DEFAULT_GLASS_STEPS>) => void;
  onResetSteps: () => void;
}

export const FixedControlPanel: React.FC<FixedControlPanelProps> = ({
  config,
  onChangeSteps,
  onResetSteps,
}) => {
  const [isOpen, setIsOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 640 : true);
  const [copiedAction, setCopiedAction] = useState<string | null>(null);

  const handleCopyHtml = () => {
    const html = generateStandaloneHtml(config);
    navigator.clipboard.writeText(html);
    setCopiedAction('copy-html');
    setTimeout(() => setCopiedAction(null), 2500);
  };

  const handleDownloadHtml = () => {
    const html = generateStandaloneHtml(config);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `liquid-glass-${config.width}x${config.height}.html`;
    link.click();
    URL.revokeObjectURL(url);
    setCopiedAction('download-html');
    setTimeout(() => setCopiedAction(null), 2500);
  };

  const handleCopyReactModule = () => {
    const { installCommand, importCode, componentSnippet } = generateNodeReactCode(config);
    const fullSnippet = `// 1. Install Library\n${installCommand}\n\n// 2. Usage in React / Next.js\n${importCode}\n\nexport const MyGlass = () => (\n  ${componentSnippet}\n);`;
    navigator.clipboard.writeText(fullSnippet);
    setCopiedAction('copy-react');
    setTimeout(() => setCopiedAction(null), 2500);
  };

  const sliders = [
    {
      id: 'refractionStep',
      name: 'Refraction',
      icon: <Sparkles size={13} className="text-cyan-400" />,
      value: config.refractionStep,
      display: `${config.refractionStep}/10`,
      unit: `${(config.refraction * 100).toFixed(0)}%`,
    },
    {
      id: 'bevelStep',
      name: 'Meniscus Bevel',
      icon: <Maximize2 size={13} className="text-sky-400" />,
      value: config.bevelStep,
      display: `${config.bevelStep}/10`,
      unit: `${config.bevel}px`,
    },
    {
      id: 'dispersionStep',
      name: 'Dispersion',
      icon: <Flame size={13} className="text-indigo-400" />,
      value: config.dispersionStep,
      display: `${config.dispersionStep}/10`,
      unit: `${(config.dispersion * 100).toFixed(0)}%`,
    },
    {
      id: 'blurStep',
      name: 'Surface Blur',
      icon: <Shield size={13} className="text-purple-400" />,
      value: config.blurStep,
      display: `${config.blurStep}/10`,
      unit: `${config.blur}px`,
    },
    {
      id: 'darkTintStep',
      name: 'Dark Tint',
      icon: <Sliders size={13} className="text-slate-400" />,
      value: config.darkTintStep,
      display: `${config.darkTintStep}/10`,
      unit: `${(config.darkTint * 100).toFixed(0)}%`,
    },
    {
      id: 'widthStep',
      name: 'Width',
      icon: <MoveHorizontal size={13} className="text-cyan-400" />,
      value: config.widthStep,
      display: `${config.widthStep}/10`,
      unit: `${config.width}px`,
    },
    {
      id: 'heightStep',
      name: 'Height',
      icon: <MoveVertical size={13} className="text-sky-400" />,
      value: config.heightStep,
      display: `${config.heightStep}/10`,
      unit: `${config.height}px`,
    },
    {
      id: 'radiusStep',
      name: 'Rounding',
      icon: <Maximize2 size={13} className="text-emerald-400" />,
      value: config.radiusStep,
      display: config.radiusStep >= 10 ? 'Capsule' : `${config.radiusStep}/10`,
      unit: config.radiusStep >= 10 ? '9999px' : `${config.radius}px`,
    },
  ];

  return (
    <div 
      className="fixed left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-2xl select-none transition-all duration-300"
      style={{
        bottom: `calc(${config.height}px + 44px)`,
      }}
    >
      {/* Control Panel Shell */}
      <div className="rounded-2xl sm:rounded-3xl bg-slate-950/85 border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 bg-white/[0.03] border-b border-white/10">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 group-hover:bg-cyan-500/20 transition-colors">
              <Sliders size={14} />
            </div>
            <div>
              <span className="text-xs font-bold text-white font-mono tracking-wider flex items-center gap-2">
                LIQUID GLASS CONTROLS
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-400/10 text-cyan-300 font-normal">0–10 Scale</span>
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetSteps}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-slate-300 hover:text-white transition-all active:scale-95"
              title="Reset sliders"
            >
              <RotateCcw size={11} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
              aria-label="Toggle Controls"
            >
              {isOpen ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
            </button>
          </div>
        </div>

        {/* Sliders Area (Collapsible) */}
        {isOpen && (
          <div className="p-4 sm:p-5 max-h-[38vh] sm:max-h-none overflow-y-auto space-y-4">
            
            {/* Sliders Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sliders.map((s) => (
                <div key={s.id} className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-300 truncate">{s.name}</span>
                    <span className="text-cyan-400 font-bold">{s.display}</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={s.value}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onChangeSteps({ [s.id]: val });
                    }}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                  />

                  <div className="text-[9px] font-mono text-slate-500 text-right">
                    {s.unit}
                  </div>
                </div>
              ))}
            </div>

            {/* Export Toolbar Inside Control Panel */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-400">Export Options:</span>

              <div className="flex items-center gap-2">
                {/* 1. Copy Standalone HTML */}
                <button
                  onClick={handleCopyHtml}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 hover:text-white transition-all active:scale-95"
                  title="Copy complete HTML file with embedded CSS and WebGL shader"
                >
                  {copiedAction === 'copy-html' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedAction === 'copy-html' ? 'HTML Copied!' : 'Copy HTML'}</span>
                </button>

                {/* 2. Download Standalone HTML */}
                <button
                  onClick={handleDownloadHtml}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all active:scale-95"
                  title="Download self-contained .html file"
                >
                  {copiedAction === 'download-html' ? <Check size={12} className="text-emerald-400" /> : <Download size={12} />}
                  <span>{copiedAction === 'download-html' ? 'Downloaded!' : 'Download .html'}</span>
                </button>

                {/* 3. Copy Node/React Module Snippet */}
                <button
                  onClick={handleCopyReactModule}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-xs font-mono text-cyan-300 hover:text-white transition-all active:scale-95"
                  title="Copy 1-line npm install & React component"
                >
                  {copiedAction === 'copy-react' ? <Check size={12} className="text-emerald-400" /> : <Package size={12} />}
                  <span>{copiedAction === 'copy-react' ? 'React Copied!' : 'npm Module'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
