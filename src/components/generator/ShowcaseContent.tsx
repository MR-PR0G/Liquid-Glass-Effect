import React from 'react';
import { 
  Cpu, 
  Layers, 
  Compass, 
  Terminal, 
  CheckCircle2, 
  Flame, 
  ShieldCheck,
  FileCode,
  Gauge
} from 'lucide-react';

export const ShowcaseContent: React.FC = () => {
  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-96 space-y-16 text-slate-200">
      
      {/* ----------------- SECTION 1: ARCHITECTURAL OVERVIEW ----------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-400">
          <Terminal size={14} className="text-cyan-400" />
          <span>01 // OPTICAL ARCHITECTURE</span>
        </div>
        
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Apple iOS 27 Physical Meniscus Ray Tracing
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            Conventional glassmorphic UI uses basic Gaussian CSS blurs, resulting in flat, muddy, unphysical surfaces. 
            The <span className="text-cyan-300 font-medium">MR PROG Liquid Glass Engine</span> computes exact Snell's law refraction vectors along the meniscus curve of the capsule edge, leaving the center 100% undistorted and crystal-clear.
          </p>

          <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-sky-300 overflow-x-auto">
            <code>{`// Exact Snell's Law Refraction at Bevel Interface
vec3 ray = refract(view, frontNormal, 1.0 / eta);
vec3 outward = refract(ray, -exitNormal, eta);
vec2 displacement = (exitXY + outward.xy * t - screenP) * smoothstep(1.0, 0.82, bevelInset);`}</code>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 2: 3 CORE OPTICAL SPECIFICATIONS ----------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-indigo-400">
          <Layers size={14} className="text-indigo-400" />
          <span>02 // PHYSICAL SPECIFICATIONS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-cyan-400/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-400/20">
              <Compass size={16} />
            </div>
            <h3 className="text-sm font-semibold text-white">Meniscus Bevel Edge</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curved liquid meniscus creates a continuous refractive gradient that warps background geometry naturally as you scroll.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-indigo-400/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-400/20">
              <Flame size={16} />
            </div>
            <h3 className="text-sm font-semibold text-white">Chromatic Dispersion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulates wavelength-dependent refractive indices (n_red &lt; n_green &lt; n_blue), yielding realistic prismatic fringe highlights.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-emerald-400/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-400/20">
              <ShieldCheck size={16} />
            </div>
            <h3 className="text-sm font-semibold text-white">Undistorted Core</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Normal incidence rays pass perpendicularly through the flat center with zero refraction deflection for crystal-clear readability.
            </p>
          </div>

        </div>
      </section>

      {/* ----------------- SECTION 3: PERFORMANCE BENCHMARK ----------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
          <Gauge size={14} className="text-emerald-400" />
          <span>03 // BENCHMARK & HARDWARE PERFORMANCE</span>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">120 FPS Mobile GPU Execution</h3>
              <p className="text-xs text-slate-400">Sub-pixel rasterization with 0ms scroll latency</p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-xs font-mono text-emerald-300">
              <CheckCircle2 size={13} />
              <span>OPTIMIZED FOR LOW-END DEVICES</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <div className="text-xl font-bold font-mono text-cyan-400">0.42 ms</div>
              <div className="text-[11px] text-slate-400 mt-1">Render Latency</div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <div className="text-xl font-bold font-mono text-indigo-400">120 FPS</div>
              <div className="text-[11px] text-slate-400 mt-1">Refresh Rate</div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <div className="text-xl font-bold font-mono text-purple-400">1.8 MB</div>
              <div className="text-[11px] text-slate-400 mt-1">GPU VRAM</div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <div className="text-xl font-bold font-mono text-emerald-400">0.00%</div>
              <div className="text-[11px] text-slate-400 mt-1">Dropped Frames</div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 4: HIGH-CONTRAST TEST GRID ----------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
          <FileCode size={14} className="text-cyan-400" />
          <span>04 // OPTICAL TEST PATTERN</span>
        </div>

        <div className="relative p-8 rounded-3xl border border-white/15 bg-black/60 overflow-hidden flex flex-col items-center justify-center text-center min-h-[180px]">
          <div 
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #38bdf8 0, #38bdf8 1.5px, transparent 0, transparent 24px), repeating-linear-gradient(-45deg, #c084fc 0, #c084fc 1.5px, transparent 0, transparent 24px)'
            }}
          />
          <div className="relative z-10 px-5 py-2.5 rounded-2xl bg-black/80 border border-white/20 text-xs sm:text-sm font-mono text-cyan-300 font-semibold shadow-2xl">
            SNELL REFRACTION VERIFICATION GRID
          </div>
          <p className="relative z-10 text-xs text-slate-400 mt-3 max-w-md font-light">
            Scroll this pattern behind the liquid glass panels to observe real-time chromatic aberration along the meniscus border.
          </p>
        </div>
      </section>

      {/* ----------------- SECTION 5: LIVE RESUME / PORTFOLIO COPY BLOCK ----------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-400">
          <Cpu size={14} className="text-sky-400" />
          <span>05 // SAMPLE PORTFOLIO TYPOGRAPHY</span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white">Full-Stack Creative Technologist & Shader Architect</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            Crafting bleeding-edge web applications, interactive WebGL shaders, and ultra-fluid iOS-inspired user interfaces. 
            Focused on pixel-perfection, strict Snell's law optics, and microsecond-level render loops that elevate modern web experiences.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {['WebGL 2.0', 'GLSL Shaders', 'Snell Physics', 'React 19', 'Next.js 15', 'Tailwind CSS', 'TypeScript', 'GPU Profiling'].map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* End of content indicator */}
      <div className="text-center text-xs font-mono text-slate-500 pt-8 pb-32">
        ── END OF CONTENT // SCROLL UP AND DOWN TO OBSERVE REFRACTION ──
      </div>

    </div>
  );
};
