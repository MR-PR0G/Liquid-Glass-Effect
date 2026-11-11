import { LiquidGlassConfig, ShadowTone, computeGlassBoxShadow, computeInvertedGlassAura } from '../types';

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
  const darkTintVal = (config.darkTint ?? 0.20).toFixed(3);
  const hVal = config.height ?? 56;
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
  const dispersionVal = (config.dispersion ?? 0.25).toFixed(4);
  const blurVal = (config.blur ?? 0).toFixed(1);
  const borderOpacityVal = (config.borderOpacity ?? 0.12).toFixed(3);
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
    innerHtml = `    <!-- Liquid Glass Responsive Navigation Bar -->
    <nav class="liquid-glass-nav" aria-label="Tab Navigation">
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
      </button>

      <!-- Active Liquid Meniscus Lens Indicator -->
      <div id="liquid-nav-lens" class="liquid-nav-lens"></div>
    </nav>`;
  } else if (innerContentMode === 'player') {
    innerHtml = `    <!-- Liquid Glass Minimalist Audio Player -->
    <div class="liquid-glass-player">
      <div class="player-info">
        <svg class="player-icon pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        <span class="player-title">Cupertino Waves</span>
      </div>
      <div class="player-controls">
        <button class="ctrl-btn" aria-label="Play"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>
        <button class="ctrl-btn" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg></button>
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
  <!-- Hardware-Accelerated Snell Ray-Tracing WebGL Canvas -->
  <canvas id="liquid-glass-canvas" class="liquid-glass-canvas"></canvas>
${isShadowInverted ? `  <!-- Inverted Curvature Light / Shadow Aura Layer -->
  <div class="liquid-glass-aura"></div>\n` : ''}
  <!-- Interactive Content Layer (Flat Core) -->
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
  width: min(92vw, ${config.width}px);
  height: ${config.height}px;
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

/* WebGL Snell Refraction Layer */
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

/* Inner Flat Core Content Layer */
.liquid-glass-content {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  padding: 0 10px;
  box-sizing: border-box;
}

/* Navigation Bar Tabs */
.liquid-glass-nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100%;
}

.nav-tab {
  position: relative;
  z-index: 2;
  background: transparent;
  border: none;
  padding: 8px 16px;
  color: #a1a1aa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 240ms ease, transform 240ms ease;
  outline: none;
}

.nav-tab:hover {
  color: #f4f4f5;
  transform: scale(1.06);
}

.nav-tab.active {
  color: #38bdf8;
  opacity: 1;
}

.nav-icon {
  width: 22px;
  height: 22px;
  filter: drop-shadow(0 0 6px currentColor);
}

.nav-tab.active .nav-icon {
  filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.95)) drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.98)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.85));
}

/* Active Fluid Meniscus Lens Indicator (Min 1, always exactly +1 step darker than parent back glass) */
.liquid-nav-lens {
  position: absolute;
  top: 50%;
  height: calc(100% - 10px);
  transform: translateY(-50%);
  border-radius: 9999px;
  background: rgba(8, 12, 20, ${lensDarkTintVal});
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 1.2px 1.8px rgba(255, 255, 255, 0.45), inset 0 -1.2px 1.8px rgba(0, 0, 0, 0.40), 0 4px 14px -1px rgba(0, 0, 0, 0.45);
  pointer-events: none;
  z-index: 1;
  transition: left 380ms cubic-bezier(0.22, 1, 0.36, 1), width 380ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* Editorial Typography Mode */
.liquid-glass-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.28em;
  color: #f4f4f5;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
}

/* Minimalist Audio Player Mode */
.liquid-glass-player {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 12px;
  color: #f4f4f5;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
}
.player-info { display: flex; align-items: center; gap: 8px; }
.player-icon { width: 16px; height: 16px; color: #38bdf8; }
.pulse { animation: liquid-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
@keyframes liquid-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.player-controls { display: flex; align-items: center; gap: 12px; }
.ctrl-btn { background: none; border: none; color: #fff; cursor: pointer; padding: 4px; display: flex; transition: opacity 0.2s; }
.ctrl-btn:hover { opacity: 0.75; }
.ctrl-btn svg { width: 16px; height: 16px; }`;

  // -------------------------------------------------------------
  // 3. JAVASCRIPT & WEBGL ENGINE
  // -------------------------------------------------------------
  const js = `// ============================================================
// 3. LIQUID GLASS JAVASCRIPT & WEBGL SNELL ENGINE
// Zero dependencies - 120 FPS hardware-accelerated Snell ray-tracing
// ============================================================

/**
 * Initializes physical Liquid Glass Snell refraction on any element.
 * @param {string|HTMLElement} container - Selector or element of the capsule
 * @param {string|HTMLCanvasElement} canvas - Selector or element of the refraction canvas
 * @param {Object} options - Custom optical parameters
 */
function initLiquidGlass(container, canvas, options = {}) {
  const host = typeof container === 'string' ? document.querySelector(container) : container;
  const cvs = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
  if (!host || !cvs) {
    console.warn('LiquidGlass: Invalid container or canvas');
    return null;
  }

  const config = {
    refraction: options.refraction ?? ${computedRefraction},
    bevel: options.bevel ?? ${computedBevel},
    dispersion: options.dispersion ?? ${dispersionVal},
    darkTint: options.darkTint ?? ${darkTintVal},
    blur: options.blur ?? ${blurVal},
    radius: options.radius ?? ${topRadiusVal},
    topRadius: options.topRadius ?? ${topRadiusVal},
    bottomRadius: options.bottomRadius ?? ${botRadiusVal},
    ...options
  };

  const gl = cvs.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: false });
  if (!gl) {
    console.warn('WebGL2 not supported. CSS fallback active.');
    return null;
  }

  // --- GLSL SHADERS ---
  const vsSource = \`#version 300 es
    in vec2 aPosition;
    out vec2 vUv;
    void main() {
      vUv = (aPosition + 1.0) * 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  \`;

  const fsSource = \`#version 300 es
    precision highp float;
    in vec2 vUv;
    out vec4 fragColor;

    uniform sampler2D uBackdrop;
    uniform bool uHasBackdrop;
    uniform vec2 uScreenSize;
    uniform vec2 uLensPos;
    uniform vec2 uLensSize;
    uniform float uRadius;
    uniform float uRefraction;
    uniform float uBevel;
    uniform float uDispersion;
    uniform float uDarkTint;
    uniform float uBlur;

    // Exact analytical 2D Rounded Box SDF
    float sdRoundedBox(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
    }

    void main() {
      vec2 pixelPos = vUv * uLensSize;
      vec2 halfSize = uLensSize * 0.5;
      vec2 p = pixelPos - halfSize;
      float r = min(uRadius, min(halfSize.x, halfSize.y));
      float d = sdRoundedBox(p, halfSize, r);

      if (d > 0.0) {
        fragColor = vec4(0.0);
        return;
      }

      // If no external canvas is attached, keep canvas transparent so CSS liquid glass renders cleanly
      if (!uHasBackdrop) {
        fragColor = vec4(0.0);
        return;
      }

      float distInward = -d;

      // Analytical surface normal gradient
      vec2 grad = normalize(vec2(
        sdRoundedBox(p + vec2(1.0, 0.0), halfSize, r) - sdRoundedBox(p - vec2(1.0, 0.0), halfSize, r),
        sdRoundedBox(p + vec2(0.0, 1.0), halfSize, r) - sdRoundedBox(p - vec2(0.0, 1.0), halfSize, r)
      ));

      // Meniscus bevel slope
      float bevelWidth = clamp(uBevel, 6.0, min(halfSize.y * 0.9, 48.0));
      float t = clamp(distInward / bevelWidth, 0.0, 1.0);
      float slope = cos(t * 1.5707963) * (1.0 - t);

      // Snell lateral refraction displacement
      vec2 refractDisp = -grad * slope * (uRefraction * 36.0);

      // Normalized screen backdrop UV coordinates
      vec2 screenUv = (uLensPos + pixelPos) / uScreenSize;
      screenUv.y = 1.0 - screenUv.y; // Invert for WebGL

      // Snell Chromatic Dispersion (separates red & blue spectrums)
      float disp = uDispersion * 0.45;
      vec2 uvR = screenUv + (refractDisp * (1.0 - disp)) / uScreenSize;
      vec2 uvG = screenUv + refractDisp / uScreenSize;
      vec2 uvB = screenUv + (refractDisp * (1.0 + disp)) / uScreenSize;

      vec3 color = vec3(
        texture(uBackdrop, clamp(uvR, 0.0, 1.0)).r,
        texture(uBackdrop, clamp(uvG, 0.0, 1.0)).g,
        texture(uBackdrop, clamp(uvB, 0.0, 1.0)).b
      );

      // Gaussian frosted blur
      if (uBlur > 0.1) {
        float bStep = (uBlur * 0.35 + 0.3) * 0.0022;
        vec3 blurred = color * 0.24;
        blurred += texture(uBackdrop, clamp(uvG + vec2(bStep, 0.0), 0.0, 1.0)).rgb * 0.14;
        blurred += texture(uBackdrop, clamp(uvG - vec2(bStep, 0.0), 0.0, 1.0)).rgb * 0.14;
        blurred += texture(uBackdrop, clamp(uvG + vec2(0.0, bStep), 0.0, 1.0)).rgb * 0.14;
        blurred += texture(uBackdrop, clamp(uvG - vec2(0.0, bStep), 0.0, 1.0)).rgb * 0.14;
        blurred += texture(uBackdrop, clamp(uvG + vec2(bStep * 0.707, bStep * 0.707), 0.0, 1.0)).rgb * 0.05;
        blurred += texture(uBackdrop, clamp(uvG + vec2(-bStep * 0.707, bStep * 0.707), 0.0, 1.0)).rgb * 0.05;
        blurred += texture(uBackdrop, clamp(uvG + vec2(bStep * 0.707, -bStep * 0.707), 0.0, 1.0)).rgb * 0.05;
        blurred += texture(uBackdrop, clamp(uvG + vec2(-bStep * 0.707, -bStep * 0.707), 0.0, 1.0)).rgb * 0.05;
        color = blurred;
      }

      // Dark tint absorption
      color = mix(color, vec3(0.0), uDarkTint);

      // Subpixel edge antialiasing
      float edgeAlpha = clamp(distInward + 0.5, 0.0, 1.0);
      fragColor = vec4(color, edgeAlpha);
    }
  \`;

  function createShader(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(program);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const locs = {
    uBackdrop: gl.getUniformLocation(program, 'uBackdrop'),
    uHasBackdrop: gl.getUniformLocation(program, 'uHasBackdrop'),
    uScreenSize: gl.getUniformLocation(program, 'uScreenSize'),
    uLensPos: gl.getUniformLocation(program, 'uLensPos'),
    uLensSize: gl.getUniformLocation(program, 'uLensSize'),
    uRadius: gl.getUniformLocation(program, 'uRadius'),
    uRefraction: gl.getUniformLocation(program, 'uRefraction'),
    uBevel: gl.getUniformLocation(program, 'uBevel'),
    uDispersion: gl.getUniformLocation(program, 'uDispersion'),
    uDarkTint: gl.getUniformLocation(program, 'uDarkTint'),
    uBlur: gl.getUniformLocation(program, 'uBlur'),
  };

  let backdropSource = null;
  let hasBackdrop = false;

  function setBackdrop(sourceCanvasOrImage) {
    backdropSource = sourceCanvasOrImage;
    hasBackdrop = !!sourceCanvasOrImage;
    updateTexture();
  }

  function updateTexture() {
    if (!backdropSource) return;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, backdropSource);
  }

  function render() {
    gl.viewport(0, 0, cvs.width, cvs.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const rect = host.getBoundingClientRect();
    gl.uniform1i(locs.uHasBackdrop, hasBackdrop ? 1 : 0);
    gl.uniform2f(locs.uScreenSize, window.innerWidth, window.innerHeight);
    gl.uniform2f(locs.uLensPos, rect.left, rect.top);
    gl.uniform2f(locs.uLensSize, rect.width, rect.height);
    gl.uniform1f(locs.uRadius, config.radius);
    gl.uniform1f(locs.uRefraction, config.refraction);
    gl.uniform1f(locs.uBevel, config.bevel);
    gl.uniform1f(locs.uDispersion, config.dispersion);
    gl.uniform1f(locs.uDarkTint, config.darkTint);
    gl.uniform1f(locs.uBlur, config.blur);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(locs.uBackdrop, 0);

    const aPos = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function resize() {
    const rect = host.getBoundingClientRect();
    cvs.width = Math.round(rect.width);
    cvs.height = Math.round(rect.height);
    render();
  }

  // Handle Tab navigation interaction
  const tabs = host.querySelectorAll('.nav-tab');
  const lens = host.querySelector('#liquid-nav-lens');
  if (tabs.length && lens) {
    function updateLens(tab) {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      lens.style.left = tab.offsetLeft + 'px';
      lens.style.width = tab.offsetWidth + 'px';
    }
    tabs.forEach(tab => {
      tab.addEventListener('click', () => updateLens(tab));
    });
    const initialActive = host.querySelector('.nav-tab.active') || tabs[0];
    if (initialActive) updateLens(initialActive);
  }

  window.addEventListener('resize', resize);
  resize();

  return {
    render,
    setBackdrop,
    updateTexture,
    resize,
    destroy() {
      window.removeEventListener('resize', resize);
    }
  };
}

// Auto-initialization
document.addEventListener('DOMContentLoaded', () => {
  const bgCanvas = document.getElementById('backdrop-canvas');
  const engine = initLiquidGlass('#liquid-glass-capsule', '#liquid-glass-canvas');
  if (engine && bgCanvas) {
    engine.setBackdrop(bgCanvas);
    engine.render();
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
    // ============================================================
    // DEMO BACKDROP PATTERN GENERATOR (STRIPES, CROSS, TYPOGRAPHY)
    // ============================================================
    const backdropCanvas = document.getElementById('backdrop-canvas');
    const backdropCtx = backdropCanvas.getContext('2d');
    let currentPatternIdx = 0;
    const patterns = ['stripes', 'cross', 'typography'];
    let userImg = null;

    function cyclePattern() {
      currentPatternIdx = (currentPatternIdx + 1) % patterns.length;
      drawBackdrop();
      if (glassInstance) glassInstance.updateTexture();
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
            if (glassInstance) glassInstance.updateTexture();
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
        const colors = ['#ec4899', '#94a3b8', '#2563eb', '#06070b'];
        const stripeW = 44;
        const period = stripeW * colors.length;
        backdropCtx.fillStyle = '#06070b';
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
        backdropCtx.fillStyle = '#040508';
        backdropCtx.fillRect(0, 0, w, h);

        backdropCtx.fillStyle = '#2563eb';
        const crossW = Math.min(w, h) * 0.28;
        backdropCtx.fillRect((w - crossW) / 2, 0, crossW, h);
        backdropCtx.fillRect(0, (h - crossW) / 2, w, crossW);

        backdropCtx.fillStyle = 'rgba(236, 72, 153, 0.85)';
        backdropCtx.beginPath();
        backdropCtx.arc(w * 0.25, h * 0.35, Math.min(w, h) * 0.16, 0, Math.PI * 2);
        backdropCtx.fill();
      } else if (mode === 'typography') {
        backdropCtx.fillStyle = '#030406';
        backdropCtx.fillRect(0, 0, w, h);

        backdropCtx.textAlign = 'center';
        backdropCtx.textBaseline = 'middle';
        backdropCtx.font = 'bold 26px ui-monospace, monospace';
        backdropCtx.fillStyle = '#ffffff';
        backdropCtx.fillText('LIQUID GLASS SNELL REFRACTION', w / 2, h * 0.36);

        backdropCtx.font = 'bold 15px ui-monospace, monospace';
        backdropCtx.fillStyle = '#38bdf8';
        backdropCtx.fillText('120 FPS REAL-TIME GPU RAY-TRACING', w / 2, h * 0.64);
      } else if (mode === 'image' && userImg) {
        backdropCtx.fillStyle = '#06070b';
        backdropCtx.fillRect(0, 0, w, h);
        const iw = userImg.naturalWidth || userImg.width;
        const ih = userImg.naturalHeight || userImg.height;
        const scale = Math.max(w / iw, h / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        backdropCtx.drawImage(userImg, (w - dw) / 2, (h - dh) / 2, dw, dh);
      }
    }

${js}

    // Initialize Demo
    let glassInstance = null;

    function resizeDemo() {
      backdropCanvas.width = window.innerWidth;
      backdropCanvas.height = window.innerHeight;
      drawBackdrop();

      if (!glassInstance) {
        glassInstance = initLiquidGlass('#liquid-glass-capsule', '#liquid-glass-canvas');
        glassInstance.setBackdrop(backdropCanvas);
      } else {
        glassInstance.updateTexture();
        glassInstance.resize();
      }
    }

    window.addEventListener('resize', resizeDemo);
    window.addEventListener('load', resizeDemo);
    resizeDemo();

    // Drag-Anywhere Physics
    const wrapper = document.getElementById('capsule-wrapper');
    let isDragging = false;
    let startX = 0, startY = 0, initLeft = 0, initTop = 0;

    wrapper.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.nav-tab') || e.target.closest('.ctrl-btn')) return;
      isDragging = true;
      wrapper.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      const rect = wrapper.getBoundingClientRect();
      initLeft = rect.left + rect.width / 2;
      initTop = rect.top + rect.height / 2;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      wrapper.style.left = (initLeft + dx) + 'px';
      wrapper.style.top = (initTop + dy) + 'px';
      if (glassInstance) glassInstance.render();
    });

    const endDrag = (e) => {
      if (isDragging) {
        isDragging = false;
        try { if (wrapper.hasPointerCapture(e.pointerId)) wrapper.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };
    wrapper.addEventListener('pointerup', endDrag);
    wrapper.addEventListener('pointercancel', endDrag);
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
  const darkTint = (config.darkTint ?? 0.20).toFixed(3);
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
  const dispersionVal = (config.dispersion ?? 0.25).toFixed(4);
  const blurVal = (config.blur ?? 0).toFixed(1);
  const borderOpacityVal = (config.borderOpacity ?? 0.12).toFixed(3);
  const shadowStepVal = config.shadowStep ?? 5;
  const viscosityVal = (config.viscosity ?? 0.6).toFixed(2);
  const thicknessVal = (config.thickness ?? 450).toString();
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
  style={{ width: 'min(90vw, ${config.width}px)', height: '${config.height}px' }}
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
        style={{ width: 'min(90vw, ${config.width}px)', height: '${config.height}px' }}
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
