import { LiquidGlassConfig, ShadowTone, computeGlassBoxShadow, computeInvertedGlassAura } from '../types/index';

export interface SeparatedExportCode {
  html: string;
  css: string;
  js: string;
  fullStandaloneHtml: string;
}

/**
 * Generates three clean, readable, separated code sections (HTML, CSS, JS)
 * along with the complete standalone ready-to-run HTML document.
 * 100% faithful to the customized parameters in the demo.
 */
export function generateSeparatedExportCode(
  config: LiquidGlassConfig,
  shadowTone: ShadowTone = 'dark',
  innerContentMode: 'text' | 'nav' | 'player' = 'nav',
  isShadowInverted: boolean = false
): SeparatedExportCode {
  const darkTintVal = (config.darkTint ?? 0.15).toFixed(3);
  const hVal = config.height ?? 92;
  const maxCapRad = Math.max(1, Math.round(hVal / 2));
  const topRadiusVal = typeof config.topRadius === 'number' ? config.topRadius : maxCapRad;
  const botRadiusVal = typeof config.bottomRadius === 'number' ? config.bottomRadius : maxCapRad;
  const radiusCss = (topRadiusVal === botRadiusVal)
    ? `${topRadiusVal}px`
    : `${topRadiusVal}px ${topRadiusVal}px ${botRadiusVal}px ${botRadiusVal}px`;
  
  const tintColorHex = config.tintColor ?? '#000000';
  const cleanHex = tintColorHex.replace('#', '');
  const tintR = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const tintG = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const tintB = parseInt(cleanHex.substring(4, 6), 16) || 0;
  const tintRgbaCss = `rgba(${tintR}, ${tintG}, ${tintB}, ${darkTintVal})`;
  const isUltra = (config.thicknessStep ?? 5) >= 9;
  const computedRefraction = (isUltra
    ? config.refraction * 2.85
    : config.refraction * (0.70 + ((config.thicknessStep ?? 5) / 10) * 0.75)
  ).toFixed(4);
  const computedBevel = Math.round(isUltra
    ? config.bevel * 2.3
    : config.bevel * (0.75 + ((config.thicknessStep ?? 5) / 10) * 0.55)
  );
  const dispersionVal = (config.dispersion ?? 0.28).toFixed(4);
  const blurVal = (config.blur ?? 0).toFixed(1);
  const borderOpacityVal = (config.borderOpacity ?? 0.18).toFixed(3);
  const shadowStepVal = config.shadowStep ?? 5;
  const thicknessStepVal = config.thicknessStep ?? 5;
  const boxShadowCss = computeGlassBoxShadow(shadowStepVal, shadowTone, config.borderOpacity, thicknessStepVal, isShadowInverted);
  const parentTintStep = typeof config.darkTintStep === 'number'
    ? config.darkTintStep
    : (typeof config.darkTint === 'number' ? Math.round((config.darkTint / 0.75) * 10) : 2);
  const lensDarkTintStep = Math.max(1, parentTintStep + 1);
  const lensDarkTintVal = ((lensDarkTintStep / 10) * 0.78).toFixed(3);

  // -------------------------------------------------------------
  // 1. HTML MARKUP
  // -------------------------------------------------------------
  let innerHtml = '';
  if (innerContentMode === 'nav') {
    innerHtml = `    <!-- Liquid Glass Responsive Navigation Bar with Draggable Physical Lens -->
    <nav class="liquid-glass-nav" aria-label="Tab Navigation">
      <!-- 1. Base Track Icons (Stable resting layer) -->
      <div class="nav-base-track">
        <button class="nav-tab active" data-index="0" aria-label="Home">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </button>
        <button class="nav-tab" data-index="1" aria-label="Search">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </button>
        <button class="nav-tab" data-index="2" aria-label="Explore">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
        </button>
        <button class="nav-tab" data-index="3" aria-label="Alerts">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <span class="nav-badge"></span>
        </button>
      </div>

      <!-- 2. Draggable Liquid Meniscus Lens with Dedicated WebGL Snell Refraction & 3D Optics -->
      <div id="liquid-nav-lens" class="liquid-nav-lens">
        <!-- Physical Snell Ray-Tracing Layer for the Active Lens -->
        <canvas id="liquid-lens-canvas" class="liquid-lens-canvas"></canvas>
        <!-- Dark Tint Absorption Layer -->
        <div class="liquid-lens-tint"></div>
        <!-- 3D Refracted Optical Content Layer (Icons with Meniscus Curvature) -->
        <div id="liquid-lens-refracted" class="liquid-lens-refracted"></div>
        <!-- Natural Inner Specular Rim Highlight -->
        <div class="liquid-lens-specular"></div>
      </div>
    </nav>`;
  } else if (innerContentMode === 'player') {
    innerHtml = `    <!-- Liquid Glass Luxury Cupertino Audio Player -->
    <div class="liquid-glass-player">
      <div class="player-info">
        <div class="player-disc">
          <div class="player-eq">
            <span class="eq-bar bar-1"></span>
            <span class="eq-bar bar-2"></span>
            <span class="eq-bar bar-3"></span>
          </div>
        </div>
        <div class="player-meta">
          <span class="player-title">Cupertino Waves</span>
          <span class="player-sub">Lossless Audio • 48kHz</span>
        </div>
      </div>
      <div class="player-controls">
        <button class="ctrl-btn btn-secondary" aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
        </button>
        <button class="ctrl-btn btn-primary" aria-label="Play">
          <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>
        <button class="ctrl-btn btn-secondary" aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
        </button>
      </div>
    </div>`;
  } else {
    innerHtml = `    <!-- Liquid Glass Editorial Typography -->
    <span class="liquid-glass-text">LIQUID GLASS</span>`;
  }

  const html = `<!-- ============================================================ -->
<!-- 1. LIQUID GLASS HTML MARKUP                                 -->
<!-- Paste this element wherever you want the liquid glass widget -->
<!-- ============================================================ -->
<div id="liquid-glass-capsule" class="liquid-glass-capsule">
  <!-- Hardware-Accelerated Snell Ray-Tracing WebGL Canvas for the Track -->
  <canvas id="liquid-glass-canvas" class="liquid-glass-canvas"></canvas>
${isShadowInverted ? `  <!-- Inverted Curvature Light / Shadow Aura Layer -->
  <div class="liquid-glass-aura"></div>\n` : ''}
  <!-- Interactive Content Layer -->
  <div class="liquid-glass-content">
${innerHtml}
  </div>
</div>`;

  // -------------------------------------------------------------
  // 2. CSS STYLESHEET
  // -------------------------------------------------------------
  const css = `/* ============================================================ */
/* 2. LIQUID GLASS CSS STYLESHEET                               */
/* Copy into your CSS file or inside a <style> tag              */
/* ============================================================ */

/* Reusable Glass Capsule Container */
.liquid-glass-capsule {
  position: relative;
  width: min(92vw, ${config.width ?? 540}px);
  height: ${config.height ?? 82}px;
  border-radius: ${radiusCss};
  background-color: ${tintRgbaCss};
  border: 1px solid rgba(255, 255, 255, ${borderOpacityVal});
  box-shadow: ${boxShadowCss};
  backdrop-filter: blur(${blurVal}px);
  -webkit-backdrop-filter: blur(${blurVal}px);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
  overflow: visible;
  touch-action: none;
  box-sizing: border-box;
}

/* WebGL Snell Refraction Layer for Parent Track */
.liquid-glass-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  pointer-events: none;
}
${isShadowInverted ? `
/* Inverted Curvature Light / Shadow Aura Layer */
.liquid-glass-aura {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  box-shadow: ${computeInvertedGlassAura(shadowStepVal, shadowTone, config.borderOpacity)};
  pointer-events: none;
  z-index: 4;
}
` : ''}

/* Inner Content Layer */
.liquid-glass-content {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  box-sizing: border-box;
}

/* ------------------------------------------------------------- */
/* Navigation Bar Track & Tabs                                   */
/* ------------------------------------------------------------- */
.liquid-glass-nav {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}

.nav-base-track {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
}

.nav-tab {
  position: relative;
  background: transparent;
  border: none;
  width: 25%;
  height: 100%;
  color: #a1a1aa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 240ms ease, opacity 180ms ease, transform 180ms ease;
  outline: none;
  pointer-events: auto;
}

.nav-tab:hover {
  color: #f4f4f5;
}

.nav-icon {
  width: 24px;
  height: 24px;
  transition: transform 220ms ease;
}

.nav-badge {
  position: absolute;
  top: 30%;
  right: calc(50% - 16px);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #22d3ee;
  box-shadow: 0 0 8px #00e5ff;
}

/* ------------------------------------------------------------- */
/* Active Draggable Liquid Lens (Physical Snell Refraction)      */
/* ------------------------------------------------------------- */
.liquid-nav-lens {
  position: absolute;
  top: 50%;
  left: 12.5%;
  width: 127px;
  height: calc(100% - 16px);
  transform: translate3d(-50%, -50%, 0);
  border-radius: 9999px;
  clip-path: inset(0 round 9999px);
  -webkit-clip-path: inset(0 round 9999px);
  isolation: isolate;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: inset 0 1.2px 1.8px rgba(255, 255, 255, 0.45), inset 0 -1.2px 1.8px rgba(0, 0, 0, 0.40), 0 4px 14px -1px rgba(0, 0, 0, 0.45);
  cursor: grab;
  z-index: 20;
  overflow: hidden;
  box-sizing: border-box;
  touch-action: none;
  will-change: transform, left;
  transition: width 380ms cubic-bezier(0.22, 1, 0.36, 1), height 380ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 280ms ease;
}

.liquid-nav-lens:active {
  cursor: grabbing;
  box-shadow: inset 0 1.5px 2px rgba(255, 255, 255, 0.75), inset 0 -1.5px 2px rgba(0, 0, 0, 0.50), 0 12px 28px -4px rgba(0, 0, 0, 0.65);
}

.liquid-lens-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  pointer-events: none;
}

.liquid-lens-tint {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-color: rgba(4, 7, 14, ${lensDarkTintVal});
  pointer-events: none;
}

.liquid-lens-refracted {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  clip-path: inset(0 round 9999px);
  -webkit-clip-path: inset(0 round 9999px);
  isolation: isolate;
  pointer-events: none;
  z-index: 35;
}

.refracted-icon-slot {
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  transform: translate3d(-50%, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: #ffffff;
}

.refracted-icon-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.85));
  transform-origin: center center;
  will-change: transform;
}
.refracted-icon-inner svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
}

.liquid-lens-specular {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 1.2px 1.8px rgba(255, 255, 255, 0.45), inset 0 -1.2px 1.8px rgba(0, 0, 0, 0.40);
  pointer-events: none;
  z-index: 40;
}

/* ------------------------------------------------------------- */
/* Editorial Typography Mode                                     */
/* ------------------------------------------------------------- */
.liquid-glass-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: clamp(14px, 2.2vw, 18px);
  font-weight: 800;
  letter-spacing: 0.28em;
  color: #f4f4f5;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
}

/* ------------------------------------------------------------- */
/* Luxury Cupertino Audio Player Mode                            */
/* ------------------------------------------------------------- */
.liquid-glass-player {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 clamp(16px, 3vw, 24px);
  color: #f4f4f5;
  box-sizing: border-box;
}
.player-info { display: flex; align-items: center; gap: clamp(12px, 2vw, 16px); min-width: 0; flex: 1 1 auto; }
.player-disc {
  width: clamp(40px, 5.2vw, 46px);
  height: clamp(40px, 5.2vw, 46px);
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.25), rgba(59, 130, 246, 0.35));
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 16px rgba(6, 182, 212, 0.35);
}
.player-eq { display: flex; align-items: flex-end; gap: 3px; height: 16px; }
.eq-bar { width: 3.5px; border-radius: 2px; }
.bar-1 { height: 16px; background-color: #22d3ee; animation: eq-pulse 800ms ease-in-out infinite alternate; }
.bar-2 { height: 11px; background-color: #38bdf8; animation: eq-pulse 600ms ease-in-out infinite alternate 150ms; }
.bar-3 { height: 14px; background-color: #818cf8; animation: eq-pulse 900ms ease-in-out infinite alternate 300ms; }
@keyframes eq-pulse { 0% { height: 4px; } 100% { height: 16px; } }
.player-meta { display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
.player-title { font-size: clamp(15px, 2vw, 17px); font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 3px rgba(0,0,0,0.8); }
.player-sub { font-size: clamp(11px, 1.3vw, 13px); font-family: monospace; color: rgba(212, 212, 216, 0.75); letter-spacing: 0.05em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.player-controls { display: flex; align-items: center; gap: clamp(8px, 1.5vw, 12px); flex-shrink: 0; }
.ctrl-btn { border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.18s ease; }
.btn-primary { width: clamp(42px, 5.4vw, 48px); height: clamp(42px, 5.4vw, 48px); border-radius: 50%; background: rgba(255, 255, 255, 0.22); border: 1px solid rgba(255, 255, 255, 0.40); color: #fff; box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.6); }
.btn-primary svg { width: clamp(18px, 2.2vw, 20px); height: clamp(18px, 2.2vw, 20px); margin-left: 2px; fill: currentColor; }
.btn-secondary { width: clamp(34px, 4.4vw, 40px); height: clamp(34px, 4.4vw, 40px); border-radius: 50%; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); color: #e4e4e7; }
.btn-secondary svg { width: clamp(15px, 1.8vw, 17px); height: clamp(15px, 1.8vw, 17px); }
.ctrl-btn:hover { transform: scale(1.06); }
.ctrl-btn:active { transform: scale(0.95); }`;

  // -------------------------------------------------------------
  // 3. JAVASCRIPT & WEBGL ENGINE
  // -------------------------------------------------------------
  const js = `// ============================================================
// 3. LIQUID GLASS JAVASCRIPT & DUAL-LENS WEBGL SNELL ENGINE
// Zero external dependencies - 120 FPS hardware ray-tracing
// ============================================================

/**
 * Creates a dedicated WebGL2 Snell refraction renderer for any glass canvas.
 */
function createSnellRenderer(canvas, opt) {
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: false });
  if (!gl) return null;

  const vs = \`#version 300 es
    in vec2 aPos;
    out vec2 vUv;
    void main() {
      vUv = (aPos + 1.0) * 0.5;
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  \`;

  const fs = \`#version 300 es
    precision highp float;
    in vec2 vUv;
    out vec4 fragColor;

    uniform sampler2D uBackdrop;
    uniform bool uHasBackdrop;
    uniform vec2 uScreenSize;
    uniform vec4 uRect;            // left, top, width, height (device pixels)
    uniform float uRadius;         // corner radius in pixels
    uniform float uBevel;          // bevel width in pixels
    uniform float uRefraction;     // Snell refraction index
    uniform float uDispersion;     // chromatic dispersion
    uniform float uDarkTint;       // dark tint factor
    uniform vec3 uTintColor;       // dark tint RGB
    uniform float uBlur;           // Gaussian blur level
    uniform float uReflectivity;   // specular glaze reflection

    float squircleProfile(float x) {
      float r = 1.0 - clamp(x, 0.0, 1.0);
      return sqrt(sqrt(max(0.0, 1.0 - r * r * r * r)));
    }

    float getBoxSdf(vec2 pt, vec2 halfExt, float r) {
      vec2 d = abs(pt) - halfExt + r;
      return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
    }

    void main() {
      float rad = uRect.w * 0.5;
      vec2 halfExtent = (uRect.zw * 0.5) / rad;
      vec2 p = vec2((vUv.x - 0.5) * uRect.z, (vUv.y - 0.5) * uRect.w) / rad;
      float rc = min(uRadius / rad, min(halfExtent.x, halfExtent.y));

      // Signed distance function of squircle box in units of rad
      float sdf = getBoxSdf(p, halfExtent, rc);

      float pixel = 1.0 / rad;
      float coverage = clamp(0.5 - sdf / pixel, 0.0, 1.0);
      if (coverage <= 0.0) {
        fragColor = vec4(0.0);
        return;
      }

      if (!uHasBackdrop) {
        fragColor = vec4(uTintColor * uDarkTint, coverage * uDarkTint);
        return;
      }

      // Analytical central-difference gradient
      vec2 e = vec2(pixel * 0.75, 0.0);
      vec2 grad = vec2(
        getBoxSdf(p + e.xy, halfExtent, rc) - getBoxSdf(p - e.xy, halfExtent, rc),
        getBoxSdf(p + e.yx, halfExtent, rc) - getBoxSdf(p - e.yx, halfExtent, rc)
      );
      grad /= max(length(grad), 1e-5);

      float bevelW = clamp(uBevel / rad, 0.04, min(rc, 1.0));
      float inset = clamp(-sdf / bevelW, 0.0, 1.0);

      float lift = bevelW * squircleProfile(inset);
      float delta = 0.002;
      float slope = (squircleProfile(inset + delta) - squircleProfile(max(inset - delta, 0.0))) / 0.004;
      vec3 frontNormal = normalize(vec3(grad * slope, 1.0));
      vec3 frontPoint = vec3(p, lift);
      vec3 view = vec3(0.0, 0.0, -1.0);

      float eta = 1.0 + 0.333 * uRefraction + 0.25;
      vec2 exitXY = p;
      vec3 outward = view;
      float exitZ = -lift;

      if (eta > 1.0003 && inset < 0.999) {
        vec3 ray = refract(view, frontNormal, 1.0 / eta);
        float nearT = 0.0;
        float farT = (lift + 1.0) / max(-ray.z, 0.05);
        for (int i = 0; i < 10; i++) {
          float midT = 0.5 * (nearT + farT);
          vec3 x = frontPoint + ray * midT;
          float sdBack = getBoxSdf(x.xy, halfExtent, rc);
          float backLift = bevelW * squircleProfile(clamp(-sdBack / bevelW, 0.0, 1.0));
          if (x.z > -backLift && sdBack < 0.0) nearT = midT; else farT = midT;
        }
        vec3 xExit = frontPoint + ray * nearT;
        exitXY = xExit.xy;
        exitZ = xExit.z;

        vec2 exitGrad = vec2(
          getBoxSdf(xExit.xy + e.xy, halfExtent, rc) - getBoxSdf(xExit.xy - e.xy, halfExtent, rc),
          getBoxSdf(xExit.xy + e.yx, halfExtent, rc) - getBoxSdf(xExit.xy - e.yx, halfExtent, rc)
        );
        exitGrad /= max(length(exitGrad), 1e-5);
        float exitInset = clamp(-getBoxSdf(xExit.xy, halfExtent, rc) / bevelW, 0.0, 1.0);
        float exitSlope = (squircleProfile(exitInset + delta) - squircleProfile(max(exitInset - delta, 0.0))) / 0.004;
        vec3 exitNormal = normalize(vec3(exitGrad * exitSlope, -1.0));
        outward = refract(ray, -exitNormal, eta);
        if (dot(outward, outward) < 1e-4) outward = ray;
      }

      float projT = (-1.3 - exitZ) / min(outward.z, -0.05);
      vec2 target = exitXY + outward.xy * projT;
      vec2 shift = target - p;

      float bevelTransition = 1.0 - smoothstep(0.82, 1.0, inset);
      shift *= bevelTransition;
      target = p + shift;

      vec2 originUv = vec2(uRect.x + uRect.z * 0.5, uRect.y + uRect.w * 0.5) / uScreenSize;
      vec2 scaleUv = vec2(rad) / uScreenSize;
      vec2 uvG = originUv + vec2(target.x, -target.y) * scaleUv;

      float split = 0.75 * uDispersion;
      float shiftLen = length(shift);
      vec2 uvR = uvG;
      vec2 uvB = uvG;
      if (split > 0.01 && shiftLen > 1e-4) {
        vec2 shiftDir = shift / shiftLen;
        float dispOffset = split * (shiftLen * 0.75 + 0.015 * bevelTransition);
        vec2 targetR = p + shift - shiftDir * dispOffset;
        vec2 targetB = p + shift + shiftDir * dispOffset;
        uvR = originUv + vec2(targetR.x, -targetR.y) * scaleUv;
        uvB = originUv + vec2(targetB.x, -targetB.y) * scaleUv;
      }

      vec3 color = vec3(
        texture(uBackdrop, clamp(uvR, 0.0, 1.0)).r,
        texture(uBackdrop, clamp(uvG, 0.0, 1.0)).g,
        texture(uBackdrop, clamp(uvB, 0.0, 1.0)).b
      );

      if (uBlur > 0.01) {
        float r = clamp(uBlur * 0.0014, 0.0004, 0.0075);
        vec3 acc = color * 0.28;
        float r1 = r * 0.45;
        acc += texture(uBackdrop, clamp(uvG + vec2(r1, 0.0), 0.0, 1.0)).rgb * 0.12;
        acc += texture(uBackdrop, clamp(uvG - vec2(r1, 0.0), 0.0, 1.0)).rgb * 0.12;
        acc += texture(uBackdrop, clamp(uvG + vec2(0.0, r1), 0.0, 1.0)).rgb * 0.12;
        acc += texture(uBackdrop, clamp(uvG - vec2(0.0, r1), 0.0, 1.0)).rgb * 0.12;
        float r2 = r * 0.85;
        acc += texture(uBackdrop, clamp(uvG + vec2(r2 * 0.707, r2 * 0.707), 0.0, 1.0)).rgb * 0.06;
        acc += texture(uBackdrop, clamp(uvG + vec2(-r2 * 0.707, r2 * 0.707), 0.0, 1.0)).rgb * 0.06;
        acc += texture(uBackdrop, clamp(uvG + vec2(r2 * 0.707, -r2 * 0.707), 0.0, 1.0)).rgb * 0.06;
        acc += texture(uBackdrop, clamp(uvG + vec2(-r2 * 0.707, -r2 * 0.707), 0.0, 1.0)).rgb * 0.06;
        color = acc;
      }

      float cosI = max(frontNormal.z, 0.0);
      float topGlaze = pow(max(grad.y - 0.3, 0.0), 2.2) * pow(1.0 - cosI, 2.0) * 0.12 * uReflectivity;
      color += vec3(1.0) * topGlaze;

      if (uDarkTint > 0.001) {
        color = mix(color, uTintColor, uDarkTint);
      }

      fragColor = vec4(color, coverage);
    }
  \`;

  function createShader(gl, type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, createShader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, createShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const locs = {
    uBackdrop: gl.getUniformLocation(prog, 'uBackdrop'),
    uHasBackdrop: gl.getUniformLocation(prog, 'uHasBackdrop'),
    uScreenSize: gl.getUniformLocation(prog, 'uScreenSize'),
    uRect: gl.getUniformLocation(prog, 'uRect'),
    uRadius: gl.getUniformLocation(prog, 'uRadius'),
    uRefraction: gl.getUniformLocation(prog, 'uRefraction'),
    uBevel: gl.getUniformLocation(prog, 'uBevel'),
    uDispersion: gl.getUniformLocation(prog, 'uDispersion'),
    uDarkTint: gl.getUniformLocation(prog, 'uDarkTint'),
    uTintColor: gl.getUniformLocation(prog, 'uTintColor'),
    uBlur: gl.getUniformLocation(prog, 'uBlur'),
    uReflectivity: gl.getUniformLocation(prog, 'uReflectivity'),
  };

  let hasSource = false;

  return {
    updateTexture(source) {
      if (!source) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      hasSource = true;
    },
    render(rect) {
      canvas.width = Math.round(rect.width);
      canvas.height = Math.round(rect.height);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(prog);
      gl.uniform1i(locs.uHasBackdrop, hasSource ? 1 : 0);
      gl.uniform2f(locs.uScreenSize, window.innerWidth, window.innerHeight);
      gl.uniform4f(locs.uRect, rect.left, rect.top, rect.width, rect.height);
      gl.uniform1f(locs.uRadius, opt.radius ?? 9999);
      gl.uniform1f(locs.uRefraction, opt.refraction ?? ${computedRefraction});
      gl.uniform1f(locs.uBevel, opt.bevel ?? ${computedBevel});
      gl.uniform1f(locs.uDispersion, opt.dispersion ?? ${dispersionVal});
      gl.uniform1f(locs.uDarkTint, opt.darkTint ?? 0.0);
      gl.uniform3f(locs.uTintColor, ${tintR / 255}, ${tintG / 255}, ${tintB / 255});
      gl.uniform1f(locs.uBlur, opt.blur ?? ${blurVal});
      gl.uniform1f(locs.uReflectivity, opt.reflectivity ?? 0.65);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(locs.uBackdrop, 0);

      const aPos = gl.getAttribLocation(prog, 'aPos');
      gl.enableVertexAttribArray(aPos);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  };
}

/**
 * Initializes the full Liquid Glass optical engine matching the interactive demo.
 */
function initLiquidGlass(containerSelector = '#liquid-glass-capsule') {
  const container = document.querySelector(containerSelector);
  if (!container) return null;

  const trackCanvas = container.querySelector('.liquid-glass-canvas') || container.querySelector('#liquid-glass-canvas');
  const lens = container.querySelector('.liquid-nav-lens') || container.querySelector('#liquid-nav-lens');
  const lensCanvas = lens ? (lens.querySelector('.liquid-lens-canvas') || lens.querySelector('#liquid-lens-canvas')) : null;
  const refractedContainer = lens ? (lens.querySelector('.liquid-lens-refracted') || lens.querySelector('#liquid-lens-refracted')) : null;
  const nav = container.querySelector('.liquid-glass-nav');
  const tabs = nav ? Array.from(nav.querySelectorAll('.nav-tab')) : [];

  const rawH = container.offsetHeight || ${config.height};
  const restingHeight = Math.max(36, rawH - 16);
  const restingWidth = Math.round(restingHeight * 1.67);
  if (lens) {
    lens.style.height = restingHeight + 'px';
    lens.style.width = restingWidth + 'px';
  }

  const trackRenderer = trackCanvas ? createSnellRenderer(trackCanvas, {
    refraction: ${computedRefraction},
    bevel: ${computedBevel},
    dispersion: ${dispersionVal},
    darkTint: 0.0,
    blur: ${blurVal},
    reflectivity: 0.65,
    radius: ${topRadiusVal}
  }) : null;

  const lensRenderer = lensCanvas ? createSnellRenderer(lensCanvas, {
    refraction: (${computedRefraction} * 1.25),
    bevel: Math.round(restingHeight * 0.42),
    dispersion: 0.0,
    darkTint: 0.0,
    blur: ${blurVal},
    reflectivity: 0.0,
    radius: 9999
  }) : null;

  // Build 3D refracted icon duplicates inside the active lens
  const refractedSlots = [];
  if (refractedContainer && tabs.length) {
    refractedContainer.innerHTML = '';
    tabs.forEach((tab, i) => {
      const slot = document.createElement('div');
      slot.className = 'refracted-icon-slot';
      slot.style.width = tab.offsetWidth + 'px';
      const inner = document.createElement('div');
      inner.className = 'refracted-icon-inner';
      const svg = tab.querySelector('svg');
      if (svg) inner.appendChild(svg.cloneNode(true));
      slot.appendChild(inner);
      refractedContainer.appendChild(slot);
      refractedSlots.push(slot);
    });
  }

  let backdropSource = null;
  const initialActive = tabs.findIndex(t => t.classList.contains('active'));
  let activeTabIdx = initialActive >= 0 ? initialActive : 0;
  let bubbleCenterX = 0;
  let currentCenterX = 0;
  let targetCenterX = 0;
  let isDraggingLens = false;
  let dragStartX = 0;
  let dragStartCenterX = 0;
  let animId = null;

  function getSlotCenter(idx) {
    if (!tabs.length) return 0;
    const totalW = (nav && nav.offsetWidth > 0) ? nav.offsetWidth : (container.offsetWidth || ${config.width ?? 540});
    const slotW = totalW / tabs.length;
    return (idx + 0.5) * slotW;
  }

  function updateOptics(centerX) {
    currentCenterX = centerX;
    const trackRect = container.getBoundingClientRect();
    if (trackRenderer && backdropSource) trackRenderer.render(trackRect);

    if (lens && nav && tabs.length) {
      lens.style.left = centerX + 'px';
      const lensRect = lens.getBoundingClientRect();
      if (lensRenderer && backdropSource) lensRenderer.render(lensRect);

      const tabCount = tabs.length;
      const trackWidth = (nav.offsetWidth > 0) ? nav.offsetWidth : (container.offsetWidth || ${config.width ?? 540});
      const slotWidth = trackWidth / tabCount;
      const bubbleHalfW = (lens.offsetWidth > 0) ? lens.offsetWidth / 2 : restingWidth / 2;

      for (let i = 0; i < tabCount; i++) {
        const iconCenterX = (i + 0.5) * slotWidth;
        const deltaX = iconCenterX - centerX;
        const u = bubbleHalfW > 0 ? deltaX / bubbleHalfW : 0;
        const absU = Math.abs(u);

        // 1. Base track icon yields smoothly under the lens
        const baseTab = tabs[i];
        const baseOpacity = absU >= 0.85 ? 1.0 : Math.max(0, Math.pow(Math.max(0, (absU - 0.20) / 0.65), 1.5));
        baseTab.style.opacity = (absU < 0.28 ? 0 : baseOpacity).toFixed(3);
        baseTab.style.transform = \`scale(\${(0.88 + 0.12 * Math.min(1, absU)).toFixed(3)})\`;

        // 2. Refracted icon with physical spherical dome curvature
        const refrSlot = refractedSlots[i];
        if (!refrSlot) continue;
        refrSlot.style.width = slotWidth + 'px';

        if (absU >= 1.0) {
          refrSlot.style.display = 'none';
        } else {
          refrSlot.style.display = 'flex';
          refrSlot.style.left = \`calc(50% + \${deltaX}px)\`;

          const clampedU = Math.max(-1, Math.min(1, u));
          const signedEdge = Math.sin((Math.PI / 2) * clampedU);
          const edgeFactor = Math.pow(Math.abs(clampedU), 1.20);
          const rimFade = absU < 0.70 ? 1.0 : Math.cos(((absU - 0.70) / 0.30) * (Math.PI / 2));

          const microStretchX = 1.0 + edgeFactor * 0.16;
          const microCompressY = 1.0 - edgeFactor * 0.06;
          const microPullX = signedEdge * 2.8;
          const domeCurvatureY = -edgeFactor * 8.0;
          const domeCurvatureX = signedEdge * 9.0;
          const microSkewX = -signedEdge * 4.0;

          refrSlot.style.opacity = rimFade.toFixed(3);
          const inner = refrSlot.firstElementChild;
          if (inner) {
            inner.style.transform = \`perspective(180px) translate3d(\${microPullX.toFixed(2)}px, 0, 0) rotateX(\${domeCurvatureY.toFixed(2)}deg) rotateY(\${domeCurvatureX.toFixed(2)}deg) skewX(\${microSkewX.toFixed(2)}deg) scale(\${microStretchX.toFixed(3)}, \${microCompressY.toFixed(3)})\`;
          }
        }
      }
    }
  }

  function snapToTab(idx, duration = 380) {
    activeTabIdx = idx;
    tabs.forEach((t, i) => {
      if (i === idx) t.classList.add('active');
      else t.classList.remove('active');
    });

    targetCenterX = getSlotCenter(idx);
    const startX = currentCenterX;
    const startTime = performance.now();

    if (animId) cancelAnimationFrame(animId);
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth cubic-bezier spring easing
      const ease = 1 - Math.pow(1 - progress, 3);
      const nextX = startX + (targetCenterX - startX) * ease;
      updateOptics(nextX);
      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    }
    animId = requestAnimationFrame(step);
  }

  // Interactive Lens Dragging with Touch & Mouse
  if (lens && nav) {
    lens.addEventListener('pointerdown', (e) => {
      isDraggingLens = true;
      lens.setPointerCapture(e.pointerId);
      dragStartX = e.clientX;
      dragStartCenterX = currentCenterX;
      if (animId) cancelAnimationFrame(animId);
      e.stopPropagation();
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDraggingLens) return;
      const dx = e.clientX - dragStartX;
      const slotW = nav.offsetWidth / tabs.length;
      const minX = slotW * 0.45;
      const maxX = nav.offsetWidth - slotW * 0.45;
      let nextX = dragStartCenterX + dx;
      if (nextX < minX) nextX = minX - Math.pow(minX - nextX, 0.7);
      if (nextX > maxX) nextX = maxX + Math.pow(nextX - maxX, 0.7);
      updateOptics(nextX);
    });

    const endLensDrag = (e) => {
      if (!isDraggingLens) return;
      isDraggingLens = false;
      try { lens.releasePointerCapture(e.pointerId); } catch (_) {}
      const slotW = nav.offsetWidth / tabs.length;
      const nearestIdx = Math.max(0, Math.min(tabs.length - 1, Math.round((currentCenterX / slotW) - 0.5)));
      snapToTab(nearestIdx);
    };

    window.addEventListener('pointerup', endLensDrag);
    window.addEventListener('pointercancel', endLensDrag);

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        snapToTab(i);
      });
    });
  }

  function resize() {
    if (tabs.length) {
      currentCenterX = getSlotCenter(activeTabIdx);
      targetCenterX = currentCenterX;
      updateOptics(currentCenterX);
    }
  }

  window.addEventListener('resize', resize);
  setTimeout(resize, 30);

  return {
    setBackdrop(canvasOrImg) {
      backdropSource = canvasOrImg;
      if (trackRenderer) trackRenderer.updateTexture(backdropSource);
      if (lensRenderer) lensRenderer.updateTexture(backdropSource);
      updateOptics(currentCenterX || getSlotCenter(activeTabIdx));
    },
    updateTexture() {
      if (backdropSource) {
        if (trackRenderer) trackRenderer.updateTexture(backdropSource);
        if (lensRenderer) lensRenderer.updateTexture(backdropSource);
        updateOptics(currentCenterX);
      }
    },
    snapToTab,
    render() {
      updateOptics(currentCenterX);
    },
    resize
  };
}

// Auto-boot on load
document.addEventListener('DOMContentLoaded', () => {
  const bgCanvas = document.getElementById('backdrop-canvas');
  const engine = initLiquidGlass('#liquid-glass-capsule');
  if (engine && bgCanvas) {
    engine.setBackdrop(bgCanvas);
  }
});`;

  // -------------------------------------------------------------
  // 4. FULL STANDALONE HTML (READY TO RUN)
  // -------------------------------------------------------------
  const fullStandaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Liquid Glass Effect - Physical Snell Ray-Tracing (MR PROG)</title>
  
  <style>
    /* ============================================================ */
    /* 0. BASE DEMO STYLES                                          */
    /* ============================================================ */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: #040508;
      user-select: none;
      -webkit-user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    #backdrop-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }

    .demo-hud {
      position: fixed;
      top: 18px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      padding: 6px 16px;
      background: rgba(8, 10, 16, 0.85);
      border: 0.5px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border-radius: 9999px;
      color: #94a3b8;
      font-size: 11px;
      font-family: ui-monospace, SFMono-Regular, monospace;
      letter-spacing: 0.08em;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 12px 36px rgba(0,0,0,0.6);
      white-space: nowrap;
    }
    .demo-hud .brand { color: #38bdf8; font-weight: 700; }
    .demo-hud button {
      background: rgba(255, 255, 255, 0.08);
      border: 0.5px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      padding: 3px 10px;
      border-radius: 9999px;
      cursor: pointer;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 10px;
      transition: all 0.2s;
    }
    .demo-hud button:hover {
      background: rgba(56, 189, 248, 0.25);
      border-color: #38bdf8;
    }

    /* Centered Capsule Placement with Drag Handle */
    #capsule-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 50;
      cursor: grab;
    }
    #capsule-wrapper:active { cursor: grabbing; }

${css}
  </style>
</head>
<body>

  <!-- Background Canvas for Real Snell Optical Ray-Tracing -->
  <canvas id="backdrop-canvas"></canvas>

  <!-- Demo HUD Switcher -->
  <div class="demo-hud">
    <span class="brand">MR PROG</span>
    <span>LIQUID GLASS</span>
    <button onclick="cyclePattern()">Switch Backdrop ⚡</button>
    <button onclick="document.getElementById('file-upload').click()">Upload Image 📁</button>
    <input type="file" id="file-upload" accept="image/*" style="display:none" onchange="loadCustomImage(this)" />
  </div>

  <!-- Draggable Capsule Wrapper -->
  <div id="capsule-wrapper">
${html}
  </div>

  <script>
${js}

    // ============================================================
    // DEMO BACKDROP PATTERN GENERATOR (STRIPES, CROSS, TYPOGRAPHY)
    // ============================================================
    const backdropCanvas = document.getElementById('backdrop-canvas');
    const backdropCtx = backdropCanvas.getContext('2d');
    let currentPatternIdx = 0;
    const patterns = ['stripes', 'cross', 'typography'];
    let userImg = null;
    let glassEngine = null;

    function cyclePattern() {
      currentPatternIdx = (currentPatternIdx + 1) % patterns.length;
      drawBackdrop();
      if (glassEngine) glassEngine.updateTexture();
    }

    function loadCustomImage(input) {
      const file = input.files && input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            userImg = img;
            if (!patterns.includes('image')) patterns.push('image');
            currentPatternIdx = patterns.indexOf('image');
            drawBackdrop();
            if (glassEngine) glassEngine.updateTexture();
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }

    function drawBackdrop() {
      const w = backdropCanvas.width;
      const h = backdropCanvas.height;
      if (w <= 0 || h <= 0) return;

      const mode = patterns[currentPatternIdx];

      if (mode === 'stripes') {
        const colors = ['#ec4899', '#94a3b8', '#2563eb', '#07080d'];
        const stripeW = 32;
        const period = stripeW * colors.length;
        backdropCtx.fillStyle = '#07080d';
        backdropCtx.fillRect(0, 0, w, h);

        const totalSteps = Math.ceil((h * 2 + period * 4) / stripeW);
        const startI = -h;
        for (let step = 0; step < totalSteps; step++) {
          const i = startI + step * stripeW;
          backdropCtx.fillStyle = colors[step % colors.length];
          backdropCtx.beginPath();
          backdropCtx.moveTo(0, i);
          backdropCtx.lineTo(w, i + w * 0.75);
          backdropCtx.lineTo(w, i + w * 0.75 + stripeW);
          backdropCtx.lineTo(0, i + stripeW);
          backdropCtx.closePath();
          backdropCtx.fill();
        }
      } else if (mode === 'cross') {
        const bandW = 46;
        const period = bandW * 2;
        backdropCtx.fillStyle = '#05060a';
        backdropCtx.fillRect(0, 0, w, h);

        backdropCtx.fillStyle = '#2563eb';
        for (let i = -h; i < h + period * 2; i += period) {
          backdropCtx.beginPath();
          backdropCtx.moveTo(0, i);
          backdropCtx.lineTo(w, i + w * 0.75);
          backdropCtx.lineTo(w, i + w * 0.75 + bandW);
          backdropCtx.lineTo(0, i + bandW);
          backdropCtx.closePath();
          backdropCtx.fill();
        }

        backdropCtx.globalCompositeOperation = 'screen';
        backdropCtx.fillStyle = 'rgba(37, 99, 235, 0.72)';
        for (let i = -h; i < h + period * 2; i += period) {
          backdropCtx.beginPath();
          backdropCtx.moveTo(w, i);
          backdropCtx.lineTo(0, i + w * 0.75);
          backdropCtx.lineTo(0, i + w * 0.75 + bandW);
          backdropCtx.lineTo(w, i + bandW);
          backdropCtx.closePath();
          backdropCtx.fill();
        }
        backdropCtx.globalCompositeOperation = 'source-over';
      } else if (mode === 'typography') {
        backdropCtx.fillStyle = '#05070d';
        backdropCtx.fillRect(0, 0, w, h);

        backdropCtx.font = '900 64px -apple-system, sans-serif';
        backdropCtx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        for (let y = 80; y < h + 80; y += 100) {
          backdropCtx.fillText('LIQUID GLASS • SNELL RAY TRACING • MR PROG', 20, y);
        }

        const cx = w / 2;
        const cy = h / 2;
        const grad = backdropCtx.createRadialGradient(cx, cy, 10, cx, cy, 340);
        grad.addColorStop(0, '#06b6d4');
        grad.addColorStop(0.5, '#3b82f6');
        grad.addColorStop(1, 'transparent');
        backdropCtx.fillStyle = grad;
        backdropCtx.beginPath();
        backdropCtx.arc(cx, cy, 340, 0, Math.PI * 2);
        backdropCtx.fill();
      } else if (mode === 'image' && userImg) {
        backdropCtx.drawImage(userImg, 0, 0, w, h);
      }
    }

    function resizeDemo() {
      backdropCanvas.width = window.innerWidth;
      backdropCanvas.height = window.innerHeight;
      drawBackdrop();

      if (!glassEngine) {
        glassEngine = initLiquidGlass('#liquid-glass-capsule');
        if (glassEngine) glassEngine.setBackdrop(backdropCanvas);
      } else {
        glassEngine.updateTexture();
        glassEngine.resize();
      }
    }

    window.addEventListener('resize', resizeDemo);
    window.addEventListener('load', resizeDemo);
    resizeDemo();

    // Drag-Anywhere Physics for the whole capsule wrapper
    const wrapper = document.getElementById('capsule-wrapper');
    let isDraggingWrapper = false;
    let startX = 0, startY = 0, initLeft = 0, initTop = 0;

    wrapper.addEventListener('pointerdown', (e) => {
      if (e.target.closest('#liquid-nav-lens') || e.target.closest('.nav-tab') || e.target.closest('.ctrl-btn')) return;
      isDraggingWrapper = true;
      wrapper.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      const rect = wrapper.getBoundingClientRect();
      initLeft = rect.left + rect.width / 2;
      initTop = rect.top + rect.height / 2;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDraggingWrapper) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      wrapper.style.left = (initLeft + dx) + 'px';
      wrapper.style.top = (initTop + dy) + 'px';
      if (glassEngine) glassEngine.render();
    });

    const endWrapperDrag = (e) => {
      if (isDraggingWrapper) {
        isDraggingWrapper = false;
        try { if (wrapper.hasPointerCapture(e.pointerId)) wrapper.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };
    window.addEventListener('pointerup', endWrapperDrag);
    window.addEventListener('pointercancel', endWrapperDrag);
  </script>
</body>
</html>`;

  return {
    html,
    css,
    js,
    fullStandaloneHtml,
  };
}

/**
 * Backwards-compatible standalone HTML generator.
 */
export function generateStandaloneHtml(
  config: LiquidGlassConfig,
  shadowTone: ShadowTone = 'dark',
  innerContentMode: 'text' | 'nav' | 'player' = 'nav'
): string {
  return generateSeparatedExportCode(config, shadowTone, innerContentMode).fullStandaloneHtml;
}

/**
 * Generates zero-dependency React / Node TypeScript code matching preview.
 */
export function generateNodeReactCode(
  config: LiquidGlassConfig,
  shadowTone: ShadowTone = 'dark',
  isShadowInverted: boolean = false,
  innerContentMode: 'text' | 'nav' | 'player' = 'nav',
  borderGradient?: string
): {
  installCommand: string;
  importCode: string;
  componentSnippet: string;
  fullComponentCode: string;
} {
  const darkTint = (config.darkTint ?? 0.15).toFixed(3);
  const radius = config.radius >= 999 ? 9999 : config.radius;
  const isUltra = (config.thicknessStep ?? 5) >= 9;
  const refractionVal = (isUltra
    ? config.refraction * 2.85
    : config.refraction * (0.70 + ((config.thicknessStep ?? 5) / 10) * 0.75)
  ).toFixed(4);
  const bevelVal = Math.round(isUltra
    ? config.bevel * 2.3
    : config.bevel * (0.75 + ((config.thicknessStep ?? 5) / 10) * 0.55)
  );
  const dispersionVal = (config.dispersion ?? 0.28).toFixed(4);
  const blurVal = (config.blur ?? 0).toFixed(1);
  const borderOpacityVal = (config.borderOpacity ?? 0.18).toFixed(3);
  const shadowStepVal = config.shadowStep ?? 5;
  const viscosityVal = (config.viscosity ?? 0.58).toFixed(2);
  const thicknessVal = (config.thickness ?? 475).toString();
  const tintColorVal = config.tintColor ?? '#000000';

  const installCommand = `npm i @mr-prog/liquid-glass`;

  const importCode = `import { LiquidGlass } from '@mr-prog/liquid-glass';
import '@mr-prog/liquid-glass/liquid-glass.css';`;

  const componentSnippet = `{/* Flagship Liquid Glass Component by MR PROG */}
{/* 1. Minimal One-Line Call */}
<LiquidGlass mode="${innerContentMode}" />

{/* 2. Configured with Your Exact Generator Settings */}
<LiquidGlass
  mode="${innerContentMode}"
  refraction={${refractionVal}}
  bevel={${bevelVal}}
  dispersion={${dispersionVal}}
  darkTint={${darkTint}}
  tintColor="${tintColorVal}"
  blur={${blurVal}}
  viscosity={${viscosityVal}}
  thickness={${thicknessVal}}
  radius={${radius}}
  shadowTone="${shadowTone}"
  shadowStep={${shadowStepVal}}
  isShadowInverted={${isShadowInverted}}
  borderOpacity={${borderOpacityVal}}${borderGradient ? `\n  borderGradient="${borderGradient}"` : ''}
  style={{ width: 'min(90vw, ${config.width ?? 540}px)', height: '${config.height ?? 82}px' }}
/>`;

  const fullComponentCode = `import React from 'react';
import { LiquidGlass } from '@mr-prog/liquid-glass';
import '@mr-prog/liquid-glass/liquid-glass.css';

/**
 * Liquid Glass Showcase Component
 * Author: MR PROG (https://github.com/MR-PR0G)
 * License: MIT
 */
export default function LiquidGlassShowcase() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#07070c] p-6">
      <LiquidGlass
        mode="${innerContentMode}"
        refraction={${refractionVal}}
        bevel={${bevelVal}}
        dispersion={${dispersionVal}}
        darkTint={${darkTint}}
        tintColor="${tintColorVal}"
        blur={${blurVal}}
        viscosity={${viscosityVal}}
        thickness={${thicknessVal}}
        radius={${radius}}
        shadowTone="${shadowTone}"
        shadowStep={${shadowStepVal}}
        isShadowInverted={${isShadowInverted}}
        borderOpacity={${borderOpacityVal}}${borderGradient ? `\n        borderGradient="${borderGradient}"` : ''}
        style={{ width: 'min(90vw, ${config.width ?? 540}px)', height: '${config.height ?? 82}px' }}
      />
    </div>
  );
}
`;

  return {
    installCommand,
    importCode,
    componentSnippet,
    fullComponentCode,
  };
}
