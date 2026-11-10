import React from 'react';
import { LiquidGlassConfig, DEFAULT_GLASS_STEPS } from '../../types';
import { Sliders, RotateCcw, Sparkles, Maximize2, MoveHorizontal, MoveVertical, Shield, Flame } from 'lucide-react';

interface LiquidGlassControlsProps {
  config: LiquidGlassConfig;
  onChangeSteps: (steps: Partial<typeof DEFAULT_GLASS_STEPS>) => void;
  onReset: () => void;
}

export const LiquidGlassControls: React.FC<LiquidGlassControlsProps> = ({
  config,
  onChangeSteps,
  onReset,
}) => {
  const sliders = [
    {
      id: 'refractionStep',
      name: 'Refraction (Snell\'s Law)',
      description: 'Physical light deflection angle along the meniscus border',
      value: config.refractionStep,
      display: `${config.refractionStep} / 10`,
      icon: <Sparkles size={15} className="text-cyan-400" />,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      id: 'bevelStep',
      name: 'Meniscus Bevel Width',
      description: 'Thickness of the curved liquid perimeter in pixels',
      value: config.bevelStep,
      display: `${config.bevelStep} / 10 (${config.bevel}px)`,
      icon: <Maximize2 size={15} className="text-sky-400" />,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      id: 'dispersionStep',
      name: 'Chromatic Dispersion',
      description: 'Multi-wavelength spectral ray splitting (prismatic color fringing)',
      value: config.dispersionStep,
      display: `${config.dispersionStep} / 10`,
      icon: <Flame size={15} className="text-indigo-400" />,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      id: 'blurStep',
      name: 'Surface Blur',
      description: 'Glass body frosted transmission (0 = 100% crystal clear)',
      value: config.blurStep,
      display: `${config.blurStep} / 10 (${config.blur}px)`,
      icon: <Shield size={15} className="text-purple-400" />,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      id: 'darkTintStep',
      name: 'Dark Tint / Opacity',
      description: 'Translucent dark fluid overlay (0 = transparent pure glass)',
      value: config.darkTintStep,
      display: `${config.darkTintStep} / 10 (${(config.darkTint * 100).toFixed(0)}%)`,
      icon: <Sliders size={15} className="text-slate-400" />,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      id: 'widthStep',
      name: 'Panel Width',
      description: 'Horizontal dimension of the generated liquid glass element',
      value: config.widthStep,
      display: `${config.widthStep} / 10 (${config.width}px)`,
      icon: <MoveHorizontal size={15} className="text-cyan-400" />,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      id: 'heightStep',
      name: 'Panel Height',
      description: 'Vertical dimension of the generated liquid glass element',
      value: config.heightStep,
      display: `${config.heightStep} / 10 (${config.height}px)`,
      icon: <MoveVertical size={15} className="text-sky-400" />,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      id: 'radiusStep',
      name: 'Corner Rounding',
      description: 'Border curvature (10 = Full Capsule Pill)',
      value: config.radiusStep,
      display: config.radiusStep >= 10 ? 'Capsule' : `${config.radiusStep} / 10 (${config.radius}px)`,
      icon: <Maximize2 size={15} className="text-emerald-400" />,
      min: 0,
      max: 10,
      step: 1,
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-8">
      {/* Material 3 Surface Container */}
      <div className="relative rounded-3xl bg-slate-900/80 border border-white/10 p-5 sm:p-7 backdrop-blur-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shadow-sm">
              <Sliders size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Liquid Glass Controls
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Fine-tuned 0–10 scale controls mapped to physical WebGL shader parameters
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all active:scale-95"
            title="Reset to default settings"
          >
            <RotateCcw size={12} />
            <span>Reset to Defaults</span>
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {sliders.map((slider) => (
            <div 
              key={slider.id} 
              className="p-3.5 rounded-2xl bg-black/30 border border-white/5 hover:border-white/15 transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {slider.icon}
                  <span className="text-xs font-semibold text-slate-200">{slider.name}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 font-mono text-xs font-bold">
                  {slider.display}
                </span>
              </div>

              {/* M3 Custom Slider Track */}
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={slider.value}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onChangeSteps({ [slider.id]: val });
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              />

              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                {slider.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
