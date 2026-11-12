/**
 * @file LiquidGlass.tsx
 * @author MR PROG (https://github.com/MR-PR0G)
 * @license MIT
 * @repository https://github.com/MR-PR0G/LiquidGlass
 * 
 * Production-grade Liquid Glass Optical Container for React.
 * Seamlessly integrates physical Snell ray-tracing WebGL shaders with
 * luxurious multi-layer CSS liquid glass optics, chromatic borders, and 3D caustics.
 * 
 * Supports 4 built-in flagship modes:
 * - 'nav': Interactive draggable liquid squircle navbar
 * - 'text': Fluid drag-elastic typography with viscosity resistance
 * - 'player': Frosted Cupertino glass audio player
 * - 'empty': Clean optical liquid glass capsule container
 */

import React, { forwardRef, useState, useRef, useImperativeHandle, useEffect, HTMLAttributes } from 'react';
import { SoapBubbleSurface } from './soap-bubble-system';
import { SoapBubbleMaterial } from './use-soap-bubble';
import { LiquidGlassNavbar, NavbarItem } from './LiquidGlassNavbar';
import { notifyBackdropChanged } from './soap-bubble-gl';

export type ShadowTone = 'dark' | 'light' | '3d';
export type LiquidGlassMode = 'nav' | 'text' | 'player' | 'empty';

export interface BorderPreset {
  id: 'white' | 'prism' | 'cyan' | 'gold' | 'chrome' | 'custom';
  name: string;
  gradient?: string;
  previewStyle: string;
}

export const BORDER_PRESETS: BorderPreset[] = [
  { id: 'white', name: 'White Glass', previewStyle: 'bg-white' },
  { id: 'prism', name: 'Prism Rainbow', gradient: 'linear-gradient(135deg, #38bdf8, #818cf8, #c084fc, #f472b6, #fb923c)', previewStyle: 'bg-gradient-to-tr from-cyan-400 via-purple-400 to-pink-400' },
  { id: 'cyan', name: 'Electric Cyan', gradient: 'linear-gradient(135deg, #22d3ee, #0284c7, #38bdf8)', previewStyle: 'bg-gradient-to-tr from-cyan-400 to-blue-600' },
  { id: 'gold', name: 'Sunset Gold', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fde68a)', previewStyle: 'bg-gradient-to-tr from-amber-300 to-orange-500' },
  { id: 'chrome', name: 'Liquid Chrome', gradient: 'linear-gradient(135deg, #ffffff, #94a3b8, #ffffff, #475569)', previewStyle: 'bg-gradient-to-tr from-white via-slate-400 to-zinc-600' },
];

/**
 * Computes external physical 3D elevation drop shadow.
 */
export function computeGlassBoxShadow(
  shadowStep: number,
  shadowTone: ShadowTone = 'dark',
  borderOpacity: number = 0.12,
  thicknessStep: number = 5,
  inverted: boolean = false
): string {
  const s = Math.min(10, Math.max(0, shadowStep)) / 10;
  
  const innerLight = borderOpacity <= 0 ? '' : `inset 0 1px 1.5px rgba(255, 255, 255, ${(borderOpacity * 0.7).toFixed(2)})`;
  const innerDark = `inset 0 -1px 1px rgba(0, 0, 0, 0.35)`;

  if (s <= 0.01 && !inverted) {
    if (borderOpacity <= 0) return 'none';
    return [innerLight, innerDark].filter(Boolean).join(', ');
  }

  const thkOffset = Math.round(thicknessStep * 1.0);

  if (inverted) {
    if (shadowTone === '3d') {
      const topRim = borderOpacity <= 0 ? '' : `inset 0 2px 3px rgba(255, 255, 255, ${(borderOpacity * 0.5).toFixed(2)})`;
      return [
        `0 ${Math.round(2 + s * 4)}px ${Math.round(8 + s * 12)}px rgba(0, 0, 0, ${(0.25 + s * 0.25).toFixed(2)})`,
        topRim,
        `inset 0 -2px 3px rgba(0, 0, 0, 0.60)`
      ].filter(Boolean).join(', ');
    }
    return [
      `0 ${Math.round(1 + s * 2)}px ${Math.round(4 + s * 6)}px rgba(0, 0, 0, ${(0.15 + s * 0.20).toFixed(2)})`,
      innerLight,
      innerDark
    ].filter(Boolean).join(', ');
  }

  if (shadowTone === '3d') {
    const contact = `0 ${Math.round(1 + s * 3)}px ${Math.round(3 + s * 4)}px rgba(0, 0, 0, ${(0.35 + s * 0.30).toFixed(2)})`;
    const elevation = `0 ${Math.round(8 + s * 20 + thkOffset)}px ${Math.round(18 + s * 28)}px rgba(0, 0, 0, ${(0.30 + s * 0.30).toFixed(2)})`;
    const ambientOcclusion = `0 ${Math.round(20 + s * 36 + thkOffset)}px ${Math.round(42 + s * 60)}px rgba(0, 0, 0, ${(0.18 + s * 0.24).toFixed(2)})`;
    const rimBounce = `0 ${Math.round(3 + s * 8)}px ${Math.round(10 + s * 20)}px rgba(56, 189, 248, ${(0.08 + s * 0.22).toFixed(2)})`;
    const physical3DTop = borderOpacity <= 0 ? '' : `inset 0 1.5px 2px rgba(255, 255, 255, ${(borderOpacity * 0.8).toFixed(2)})`;
    const physical3DBottom = `inset 0 -2.5px 3.5px rgba(0, 0, 0, 0.68)`;
    return [contact, elevation, ambientOcclusion, rimBounce, physical3DTop, physical3DBottom].filter(Boolean).join(', ');
  }

  if (shadowTone === 'light') {
    const aura = `0 0 ${Math.round(8 + s * 20)}px rgba(255, 255, 255, ${(0.08 + s * 0.22).toFixed(2)})`;
    const spread = `0 ${Math.round(2 + s * 4)}px ${Math.round(14 + s * 28)}px rgba(255, 255, 255, ${(0.04 + s * 0.14).toFixed(2)})`;
    const rim = `0 0 1.5px rgba(255, 255, 255, ${(0.15 + s * 0.30).toFixed(2)})`;
    return [rim, aura, spread, innerLight, innerDark].filter(Boolean).join(', ');
  }

  // 'dark' mode default
  const contact = `0 ${Math.round(1 + s * 2)}px ${Math.round(3 + s * 4)}px rgba(0, 0, 0, ${(0.20 + s * 0.28).toFixed(2)})`;
  const mid = `0 ${Math.round(6 + s * 12 + thkOffset)}px ${Math.round(14 + s * 22)}px rgba(0, 0, 0, ${(0.22 + s * 0.28).toFixed(2)})`;
  const diffuse = `0 ${Math.round(14 + s * 20 + thkOffset)}px ${Math.round(28 + s * 38)}px rgba(0, 0, 0, ${(0.12 + s * 0.20).toFixed(2)})`;
  return [contact, mid, diffuse, innerLight, innerDark].filter(Boolean).join(', ');
}

/**
 * Computes internal 360° caustic refraction aura falling into the glass container.
 */
export function computeInvertedGlassAura(
  shadowStep: number,
  shadowTone: ShadowTone = 'dark',
  _borderOpacity: number = 0.12
): string {
  const s = Math.min(10, Math.max(0, shadowStep)) / 10;
  if (s <= 0.005) {
    return 'none';
  }

  if (shadowTone === '3d') {
    const topLight = `inset 0 ${Math.round(3 + s * 7)}px ${Math.round(12 + s * 26)}px rgba(255, 255, 255, ${(0.32 + s * 0.48).toFixed(2)})`;
    const bottomShadow = `inset 0 -${Math.round(4 + s * 8)}px ${Math.round(14 + s * 28)}px rgba(0, 0, 0, ${(0.42 + s * 0.52).toFixed(2)})`;
    const rimContour = `inset 0 0 ${Math.round(4 + s * 12)}px rgba(0, 0, 0, ${(0.30 + s * 0.45).toFixed(2)})`;
    const deepCore = `inset 0 0 ${Math.round(24 + s * 44)}px rgba(56, 189, 248, ${(0.06 + s * 0.18).toFixed(2)})`;
    return `${topLight}, ${bottomShadow}, ${rimContour}, ${deepCore}`;
  }

  if (shadowTone === 'light') {
    const rim = `inset 0 0 ${Math.round(2 + s * 6)}px rgba(255, 255, 255, ${(0.40 + s * 0.55).toFixed(2)})`;
    const meniscus = `inset 0 0 ${Math.round(8 + s * 18)}px rgba(255, 255, 255, ${(0.28 + s * 0.50).toFixed(2)})`;
    const deepAura = `inset 0 0 ${Math.round(22 + s * 44)}px rgba(255, 255, 255, ${(0.16 + s * 0.44).toFixed(2)})`;
    const topDome = `inset 0 ${Math.round(2 + s * 6)}px ${Math.round(12 + s * 24)}px rgba(255, 255, 255, ${(0.20 + s * 0.46).toFixed(2)})`;
    const bottomDome = `inset 0 -${Math.round(2 + s * 6)}px ${Math.round(12 + s * 24)}px rgba(255, 255, 255, ${(0.20 + s * 0.46).toFixed(2)})`;
    const deepWash = s > 0.5 ? `, inset 0 0 ${Math.round(40 + s * 48)}px rgba(255, 255, 255, ${(s * 0.32).toFixed(2)})` : '';
    return `${rim}, ${meniscus}, ${deepAura}, ${topDome}, ${bottomDome}${deepWash}`;
  }

  const rim = `inset 0 0 ${Math.round(2 + s * 6)}px rgba(0, 0, 0, ${(0.42 + s * 0.55).toFixed(2)})`;
  const meniscus = `inset 0 0 ${Math.round(8 + s * 18)}px rgba(0, 0, 0, ${(0.30 + s * 0.52).toFixed(2)})`;
  const deepAura = `inset 0 0 ${Math.round(22 + s * 44)}px rgba(0, 0, 0, ${(0.18 + s * 0.48).toFixed(2)})`;
  const topDome = `inset 0 ${Math.round(2 + s * 6)}px ${Math.round(12 + s * 24)}px rgba(0, 0, 0, ${(0.22 + s * 0.50).toFixed(2)})`;
  const bottomDome = `inset 0 -${Math.round(2 + s * 6)}px ${Math.round(12 + s * 24)}px rgba(0, 0, 0, ${(0.22 + s * 0.50).toFixed(2)})`;
  const deepWash = s > 0.5 ? `, inset 0 0 ${Math.round(40 + s * 48)}px rgba(0, 0, 0, ${(s * 0.36).toFixed(2)})` : '';
  return `${rim}, ${meniscus}, ${deepAura}, ${topDome}, ${bottomDome}${deepWash}`;
}

export interface LiquidGlassProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Display mode: 'nav' (navbar), 'text' (draggable typography), 'player' (audio player), 'empty' (custom children) */
  mode?: LiquidGlassMode;
  /** Optional HTMLCanvasElement or HTMLElement backdrop for hardware Snell ray-tracing */
  backdrop?: React.RefObject<HTMLCanvasElement | HTMLElement | null> | null;
  /** Built-in high-contrast optical backdrop wallpaper ('cross' = Bold Blue Cross from flagship demo, 'none' = transparent) */
  wallpaper?: 'cross' | 'stripes' | 'none';
  /** Snell's law physical refraction index (default 0.344) */
  refraction?: number;
  /** Bevel meniscus curvature in pixels (default 28) */
  bevel?: number;
  /** Chromatic dispersion prism intensity (default 0.28) */
  dispersion?: number;
  /** Concentric Gaussian frosted blur in pixels (default 0) */
  blur?: number;
  /** Translucent dark tint opacity (0.0 = crystal clear, 0.2 = smoked, default 0.16) */
  darkTint?: number;
  /** Dark tint discrete step (0 to 10) */
  darkTintStep?: number;
  /** Base tint color hex (default #000000) */
  tintColor?: string;
  /** Volumetric dome depth / thickness in nanometers (150 to 750, default 450) */
  thickness?: number;
  /** Thickness discrete step (0 to 10, default 5) */
  thicknessStep?: number;
  /** Fluid viscosity & spring tension resistance (0.10 to 1.00, default 0.60) */
  viscosity?: number;
  /** Viscosity discrete step (0 to 10, default 5) */
  viscosityStep?: number;
  /** Global corner radius in pixels (default 9999 for pill capsule) */
  radius?: number;
  /** Independent top corner radius in pixels */
  topRadius?: number;
  /** Independent bottom corner radius in pixels */
  bottomRadius?: number;
  /** Border stroke opacity (0.0 to 1.0, default 0.18) */
  borderOpacity?: number;
  /** Optional custom CSS gradient string for chromatic glass rim */
  borderGradient?: string;
  /** Shadow elevation intensity (0 to 10, default 5) */
  shadowStep?: number;
  /** Ambient shadow tone: dark, light or 3d (default 3d) */
  shadowTone?: ShadowTone;
  /** Invert shadow into internal 360° caustic refraction aura */
  isShadowInverted?: boolean;
  /** Horizontal fluid drag tension offset in pixels */
  tensionX?: number;
  /** Callback during fluid elastic tension offset */
  onTension?: (tensionX: number) => void;
  /** Enable interactive surface wave response on pointer move/click */
  interactive?: boolean;
  /** Dynamic fluid wobble elasticity (default 0) */
  wobble?: number;
  /** Fresnel surface reflectivity (default 0.0) */
  reflectivity?: number;
  /** Meniscus light sweep and specular glint intensity (default 0.75) */
  glintIntensity?: number;

  // Mode: 'nav' props
  items?: NavbarItem[];
  activeIndex?: number;
  defaultIndex?: number;
  onChange?: (index: number, item: NavbarItem) => void;
  accentColor?: string;

  // Mode: 'text' props
  text?: string;

  // Mode: 'player' props
  audioTitle?: string;
  audioArtist?: string;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  onNextTrack?: () => void;
  onPrevTrack?: () => void;

  /** Inner content node (used when mode === 'empty' or passed directly) */
  children?: React.ReactNode;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

/**
 * Renders the flagship Bold Blue Cross wallpaper onto a canvas for Snell ray-tracing.
 */
function drawCrossPattern(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  if (w <= 0 || h <= 0) return;

  const bandW = 46;
  const period = bandW * 2;

  ctx.fillStyle = '#05060a';
  ctx.fillRect(0, 0, w, h);

  // Group 1 (+45 deg): Bold Blue bands
  ctx.fillStyle = '#2563eb';
  for (let i = -h; i < h + period * 2; i += period) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(w, i + w * 0.75);
    ctx.lineTo(w, i + w * 0.75 + bandW);
    ctx.lineTo(0, i + bandW);
    ctx.closePath();
    ctx.fill();
  }

  // Group 2 (-45 deg): Crossed Bold Blue bands with screen composite
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = 'rgba(37, 99, 235, 0.72)';
  for (let i = -h; i < h + period * 2; i += period) {
    ctx.beginPath();
    ctx.moveTo(w, i);
    ctx.lineTo(0, i + w * 0.75);
    ctx.lineTo(0, i + w * 0.75 + bandW);
    ctx.lineTo(w, i + bandW);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
}

/**
 * Renders high-contrast diagonal stripes onto a canvas for optical testing.
 */
function drawStripesPattern(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  if (w <= 0 || h <= 0) return;

  const colors = ['#ec4899', '#94a3b8', '#2563eb', '#07080d'];
  const stripeW = 32;
  const period = stripeW * colors.length;

  ctx.fillStyle = '#07080d';
  ctx.fillRect(0, 0, w, h);

  for (let i = -h; i < h + period * 2; i += stripeW) {
    const step = Math.floor(i / stripeW);
    const colorIdx = ((step % colors.length) + colors.length) % colors.length;
    ctx.fillStyle = colors[colorIdx];
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(w, i + w * 0.75);
    ctx.lineTo(w, i + w * 0.75 + stripeW);
    ctx.lineTo(0, i + stripeW);
    ctx.closePath();
    ctx.fill();
  }
}

const WALLPAPER_CANVAS_ID = 'liquid-glass-wallpaper-canvas';

function updateWallpaperCanvas(canvas: HTMLCanvasElement, type: 'cross' | 'stripes') {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const targetW = Math.round(w * dpr);
  const targetH = Math.round(h * dpr);

  if (canvas.width !== targetW || canvas.height !== targetH || canvas.dataset.wallpaper !== type) {
    canvas.width = targetW;
    canvas.height = targetH;
    canvas.dataset.wallpaper = type;
    if (type === 'stripes') {
      drawStripesPattern(canvas);
    } else {
      drawCrossPattern(canvas);
    }
    notifyBackdropChanged(canvas);
  }
}

export const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>(({
  mode = 'empty',
  backdrop,
  wallpaper = 'cross',
  refraction = 0.344,
  bevel = 28,
  dispersion = 0.28,
  blur = 0,
  darkTint = 0.15,
  darkTintStep = 2,
  tintColor = '#000000',
  thickness = 475,
  thicknessStep = 5,
  viscosity = 0.58,
  viscosityStep = 5,
  radius,
  topRadius,
  bottomRadius,
  borderOpacity = 0.18,
  borderGradient,
  shadowStep = 5,
  shadowTone = 'dark',
  isShadowInverted = false,
  tensionX: controlledTensionX,
  onTension,
  interactive = false,
  wobble = 0,
  reflectivity = 0.0,
  glintIntensity = 0,
  className = '',
  style = {},
  // Mode-specific props
  items,
  activeIndex,
  defaultIndex,
  onChange,
  accentColor = '#00e5ff',
  text = 'LIQUID GLASS',
  audioTitle = 'Cupertino Waves',
  audioArtist = 'Lossless Audio • 48kHz',
  isPlaying: externalIsPlaying,
  onPlayToggle,
  onNextTrack,
  onPrevTrack,
  children,
  ...rest
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => containerRef.current!, []);

  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const shouldRenderWallpaper = backdrop === undefined && wallpaper !== 'none';
  const [existingCanvas, setExistingCanvas] = useState<HTMLCanvasElement | null>(() => {
    if (typeof document !== 'undefined') {
      return document.getElementById(WALLPAPER_CANVAS_ID) as HTMLCanvasElement | null;
    }
    return null;
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const found = document.getElementById(WALLPAPER_CANVAS_ID) as HTMLCanvasElement | null;
      if (found && found !== internalCanvasRef.current) {
        setExistingCanvas(found);
      }
    }
  }, []);

  const isMasterCanvasOwner = !existingCanvas;

  useEffect(() => {
    if (!shouldRenderWallpaper) return;
    const canvas = isMasterCanvasOwner ? internalCanvasRef.current : existingCanvas;
    if (!canvas) return;

    const render = () => {
      updateWallpaperCanvas(canvas, wallpaper as 'cross' | 'stripes');
    };

    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, [shouldRenderWallpaper, wallpaper, isMasterCanvasOwner, existingCanvas]);

  const effectiveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  effectiveCanvasRef.current = isMasterCanvasOwner ? internalCanvasRef.current : existingCanvas;

  const effectiveBackdrop = backdrop !== undefined 
    ? backdrop 
    : (shouldRenderWallpaper ? effectiveCanvasRef : null);

  const [internalTensionX, setInternalTensionX] = useState(0);
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;
  const currentTensionX = controlledTensionX !== undefined ? controlledTensionX : internalTensionX;

  const handleTension = (tx: number) => {
    if (controlledTensionX === undefined) setInternalTensionX(tx);
    onTension?.(tx);
  };

  const isPresetMode = mode === 'nav' || mode === 'text' || mode === 'player';
  const resolvedHeight = style.height || (isPresetMode ? 92 : undefined);
  const resolvedWidth = style.width || (isPresetMode ? 'min(90vw, 620px)' : undefined);
  const resolvedMaxWidth = style.maxWidth || (isPresetMode ? '620px' : undefined);

  const numericH = typeof resolvedHeight === 'number'
    ? resolvedHeight
    : (parseInt(String(resolvedHeight), 10) || 92);

  const maxCapRad = Math.max(1, Math.round(numericH / 2));
  const effectiveTopRadius = topRadius !== undefined ? topRadius : (radius !== undefined ? radius : maxCapRad);
  const effectiveBottomRadius = bottomRadius !== undefined ? bottomRadius : (radius !== undefined ? radius : maxCapRad);
  const radiusCss = `${effectiveTopRadius}px ${effectiveTopRadius}px ${effectiveBottomRadius}px ${effectiveBottomRadius}px`;

  const darkTintRgba = darkTint > 0 ? hexToRgba(tintColor, darkTint) : 'transparent';
  const borderColorRgba = `rgba(255, 255, 255, ${borderOpacity})`;
  const glassShadow = computeGlassBoxShadow(shadowStep, shadowTone, borderOpacity, thicknessStep, isShadowInverted);
  const invertedAura = computeInvertedGlassAura(shadowStep, shadowTone, borderOpacity);

  // Scaled optical refraction and bevel matching flagship demo
  const effectiveRefraction = ((thicknessStep ?? 5) >= 9 ? refraction * 2.85 : refraction) * (0.70 + (thicknessStep / 10) * 0.75);
  const effectiveBevel = Math.round(((thicknessStep ?? 5) >= 9 ? bevel * 2.3 : bevel) * (0.75 + (thicknessStep / 10) * 0.55));

  // Dynamic fluid spring transition based on viscosityStep:
  const transitionTiming = currentTensionX !== 0
    ? 'none'
    : (viscosityStep >= 7
        ? 'transform 240ms cubic-bezier(0.25, 1, 0.5, 1), width 300ms ease, height 300ms ease'
        : viscosityStep <= 3
        ? 'transform 640ms cubic-bezier(0.12, 1.68, 0.28, 1), width 300ms ease, height 300ms ease'
        : 'transform 420ms cubic-bezier(0.16, 1.25, 0.3, 1), width 300ms ease, height 300ms ease');

  const effectiveBlur = blur;
  const backdropFilterCss = blur > 0 ? `blur(${blur}px) saturate(1.8) brightness(1.10)` : 'none';

  // Inner content renderer based on mode
  const renderInnerContent = () => {
    if (mode === 'nav') {
      return (
        <div 
          className="relative flex items-center justify-center w-full pointer-events-auto px-1"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
            height: `${numericH}px`,
            minHeight: `${numericH}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        >
          <LiquidGlassNavbar
            embedded={true}
            height={numericH}
            maxWidth={typeof resolvedMaxWidth === 'number' ? resolvedMaxWidth : 620}
            items={items}
            activeIndex={activeIndex}
            onChange={(idx) => {
              if (onChange && items && items[idx]) {
                (onChange as any)(idx, items[idx]);
              } else if (onChange) {
                (onChange as any)(idx);
              }
            }}
            onTension={handleTension}
            backdropRef={effectiveBackdrop as any}
            darkTint={darkTint}
            darkTintStep={darkTintStep ?? 2}
            refraction={refraction * (0.70 + (thicknessStep / 10) * 0.75)}
            bevel={Math.round(bevel * (0.75 + (thicknessStep / 10) * 0.55))}
            dispersion={dispersion}
            reflectivity={reflectivity}
            glintIntensity={glintIntensity}
            accentColor={accentColor}
            viscosity={viscosity}
            viscosityStep={viscosityStep}
            thickness={thickness}
            thicknessStep={thicknessStep}
            blur={blur}
            borderOpacity={borderOpacity}
            borderGradient={borderGradient}
            shadowTone={shadowTone}
            shadowStep={shadowStep}
            isShadowInverted={isShadowInverted}
          />
        </div>
      );
    }

    if (mode === 'text') {
      return (
        <div
          className="flex items-center justify-center w-full h-full cursor-grab active:cursor-grabbing select-none px-4"
          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab' }}
          onPointerDown={(e) => {
            const startX = e.clientX;
            const onMove = (ev: PointerEvent) => {
              const dx = ev.clientX - startX;
              const stiffness = 0.14 + (viscosityStep / 10) * 1.8;
              const tension = (dx / (1 + Math.abs(dx) * 0.026 * stiffness)) * 0.55;
              handleTension(tension);
            };
            const onUp = () => {
              window.removeEventListener('pointermove', onMove);
              window.removeEventListener('pointerup', onUp);
              handleTension(0);
            };
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
          }}
          title="Drag horizontally to test fluid elastic viscosity"
        >
          <span className="font-mono text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-[0.28em] text-zinc-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] uppercase truncate max-w-full">
            {text}
          </span>
        </div>
      );
    }

    if (mode === 'player') {
      return (
        <div 
          className="flex items-center justify-between w-full h-full text-zinc-200 pointer-events-auto px-4 sm:px-6 select-none"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            padding: '0 20px',
          }}
        >
          {/* Left: Track Info with Dynamic Equalizer Bars */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: 0,
              flex: '1 1 auto',
            }}
          >
            {/* Glowing Frosted Music Disc */}
            <div 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.25), rgba(59, 130, 246, 0.35))',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: isPlaying ? '0 0 16px rgba(6, 182, 212, 0.45)' : 'none',
                transition: 'box-shadow 300ms ease',
              }}
            >
              {/* Dynamic 3-Bar Equalizer Waveform */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5px', height: '14px' }}>
                <span 
                  style={{
                    width: '3px',
                    height: isPlaying ? '14px' : '6px',
                    borderRadius: '2px',
                    backgroundColor: '#22d3ee',
                    animation: isPlaying ? 'pulse 800ms ease-in-out infinite alternate' : 'none',
                    transition: 'height 200ms ease',
                  }} 
                />
                <span 
                  style={{
                    width: '3px',
                    height: isPlaying ? '10px' : '12px',
                    borderRadius: '2px',
                    backgroundColor: '#38bdf8',
                    animation: isPlaying ? 'pulse 600ms ease-in-out infinite alternate 150ms' : 'none',
                    transition: 'height 200ms ease',
                  }} 
                />
                <span 
                  style={{
                    width: '3px',
                    height: isPlaying ? '13px' : '8px',
                    borderRadius: '2px',
                    backgroundColor: '#818cf8',
                    animation: isPlaying ? 'pulse 900ms ease-in-out infinite alternate 300ms' : 'none',
                    transition: 'height 200ms ease',
                  }} 
                />
              </div>
            </div>

            {/* Typography: Title + Subtitle */}
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
              <span 
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
                }}
              >
                {audioTitle}
              </span>
              <span 
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: 'rgba(212, 212, 216, 0.75)',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {audioArtist}
              </span>
            </div>
          </div>

          {/* Right: Controls (Previous, Play/Pause, Next) */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            {/* Prev Track Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrevTrack?.();
              }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e4e4e7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 180ms ease',
              }}
              title="Previous Track"
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="19 20 9 12 19 4 19 20"/>
                <line x1="5" y1="19" x2="5" y2="5"/>
              </svg>
            </button>

            {/* Play / Pause Primary Glass Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (externalIsPlaying === undefined) setInternalIsPlaying(!isPlaying);
                onPlayToggle?.();
              }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.22)',
                border: '1px solid rgba(255, 255, 255, 0.40)',
                boxShadow: isPlaying ? '0 0 14px rgba(255, 255, 255, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.8)' : 'inset 0 1px 1px rgba(255, 255, 255, 0.6)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1.5"/>
                  <rect x="14" y="4" width="4" height="16" rx="1.5"/>
                </svg>
              ) : (
                <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              )}
            </button>

            {/* Next Track Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNextTrack?.();
              }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e4e4e7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 180ms ease',
              }}
              title="Next Track"
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4"/>
                <line x1="19" y1="5" x2="19" y2="19"/>
              </svg>
            </button>
          </div>
        </div>
      );
    }

    return children;
  };

  return (
    <>
      {shouldRenderWallpaper && isMasterCanvasOwner && (
        <canvas
          ref={internalCanvasRef}
          id={WALLPAPER_CANVAS_ID}
          data-liquid-glass-wallpaper=""
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        ref={containerRef}
      data-liquid-glass=""
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{
        height: resolvedHeight,
        minHeight: resolvedHeight,
        width: resolvedWidth,
        maxWidth: resolvedMaxWidth,
        borderRadius: radiusCss,
        backgroundColor: darkTintRgba,
        boxShadow: glassShadow,
        transform: `translate3d(${currentTensionX}px, 0, 0)`,
        transition: transitionTiming,
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
        {/* 1. Hardware WebGL Snell Ray-Tracing Layer (Always Active for True Physical Liquid Glass) */}
        <SoapBubbleSurface
          backdrop={effectiveBackdrop}
          interactive={interactive}
          wobble={wobble}
          radius={effectiveTopRadius}
          topRadius={effectiveTopRadius}
          bottomRadius={effectiveBottomRadius}
          glass={1.0}
          refraction={effectiveRefraction}
          bevel={effectiveBevel}
          dispersion={dispersion}
          blur={blur}
          clearCenter={1.0}
          reflectivity={reflectivity}
          tint={darkTintRgba}
          oilCoverage={0}
          oilOpacity={0}
          iridescence={0}
          glintIntensity={glintIntensity}
          windowLight={false}
          windowIntensity={0}
          floorLight={0}
          bottomShade={false}
          keyLight={false}
          speed={0}
          paused={!interactive && wobble === 0}
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          style={{
            borderRadius: radiusCss,
            backgroundColor: darkTintRgba,
            border: borderOpacity <= 0 ? 'none' : (borderGradient ? 'none' : `1px solid ${borderColorRgba}`),
            backdropFilter: backdropFilterCss,
            WebkitBackdropFilter: backdropFilterCss,
          }}
        />

        {/* 3. Gradient Border Overlay with CSS Mask Composite */}
        {borderGradient && borderOpacity > 0 && (
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit]"
            style={{
              borderRadius: radiusCss,
              padding: '1px',
              background: borderGradient,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              opacity: Math.min(1.0, borderOpacity * 4.0),
              zIndex: 3,
              transition: 'opacity 200ms ease, background 200ms ease',
            }}
          />
        )}

        {/* 4. Internal Inverted Caustic Aura Layer */}
        {isShadowInverted && (
          <div
            className="absolute inset-0 w-full h-full pointer-events-none rounded-[inherit]"
            style={{
              borderRadius: radiusCss,
              boxShadow: invertedAura,
              zIndex: 4,
              transition: 'box-shadow 200ms ease',
            }}
          />
        )}

        {/* 5. Content Container */}
        <div 
          className={`relative z-10 w-full rounded-[inherit] flex items-center justify-center ${
            mode === 'nav' ? 'overflow-visible' : 'overflow-hidden'
          }`}
          style={{
            position: 'relative',
            width: '100%',
            height: resolvedHeight,
            minHeight: resolvedHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderInnerContent()}
        </div>
      </div>
    </>
  );
});

LiquidGlass.displayName = 'LiquidGlass';

export const LiquidGlassProvider = SoapBubbleMaterial;
