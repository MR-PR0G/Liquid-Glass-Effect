/**
 * @file LiquidGlass.tsx
 * @author MR PROG (https://github.com/MR-PR0G)
 * @license MIT
 * @repository https://github.com/MR-PR0G/LiquidGlass
 * 
 * Production-grade Liquid Glass Optical Container for React.
 * Seamlessly integrates physical Snell ray-tracing WebGL shaders with
 * luxurious multi-layer CSS liquid glass optics, chromatic borders, and 3D caustics.
 */

import React, { forwardRef, HTMLAttributes } from 'react';
import { SoapBubbleSurface } from './soap-bubble-system';
import { SoapBubbleMaterial } from './use-soap-bubble';

export type ShadowTone = 'dark' | 'light' | '3d';

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

export interface LiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional HTMLCanvasElement or HTMLElement backdrop for hardware Snell ray-tracing */
  backdrop?: React.RefObject<HTMLCanvasElement | HTMLElement | null> | null;
  /** Snell's law physical refraction index (default 0.35) */
  refraction?: number;
  /** Bevel meniscus curvature in pixels (default 28) */
  bevel?: number;
  /** Chromatic dispersion prism intensity (default 0.28) */
  dispersion?: number;
  /** Concentric Gaussian frosted blur in pixels (default 0) */
  blur?: number;
  /** Translucent dark tint opacity (0.0 = crystal clear, 0.2 = smoked, default 0.16) */
  darkTint?: number;
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
  /** Enable interactive surface wave response on pointer move/click */
  interactive?: boolean;
  /** Dynamic fluid wobble elasticity (default 0) */
  wobble?: number;
  /** Fresnel surface reflectivity (default 0.0) */
  reflectivity?: number;
  /** Inner content node */
  children?: React.ReactNode;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

export const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>(({
  backdrop,
  refraction = 0.35,
  bevel = 28,
  dispersion = 0.28,
  blur = 0,
  darkTint = 0.16,
  tintColor = '#000000',
  thickness = 450,
  thicknessStep = 5,
  viscosity = 0.60,
  viscosityStep = 5,
  radius = 9999,
  topRadius,
  bottomRadius,
  borderOpacity = 0.18,
  borderGradient,
  shadowStep = 5,
  shadowTone = '3d',
  isShadowInverted = false,
  tensionX = 0,
  interactive = false,
  wobble = 0,
  reflectivity = 0.0,
  className = '',
  style = {},
  children,
  ...rest
}, ref) => {
  const effectiveTopRadius = topRadius !== undefined ? topRadius : radius;
  const effectiveBottomRadius = bottomRadius !== undefined ? bottomRadius : radius;
  const radiusCss = `${effectiveTopRadius}px ${effectiveTopRadius}px ${effectiveBottomRadius}px ${effectiveBottomRadius}px`;

  const darkTintRgba = darkTint > 0 ? hexToRgba(tintColor, darkTint) : 'transparent';
  const borderColorRgba = `rgba(255, 255, 255, ${borderOpacity})`;
  const glassShadow = computeGlassBoxShadow(shadowStep, shadowTone, borderOpacity, thicknessStep, isShadowInverted);
  const invertedAura = computeInvertedGlassAura(shadowStep, shadowTone, borderOpacity);

  // Dynamic fluid spring transition based on viscosityStep:
  const transitionTiming = tensionX !== 0
    ? 'none'
    : (viscosityStep >= 7
        ? 'transform 240ms cubic-bezier(0.25, 1, 0.5, 1), width 300ms ease, height 300ms ease'
        : viscosityStep <= 3
        ? 'transform 640ms cubic-bezier(0.12, 1.68, 0.28, 1), width 300ms ease, height 300ms ease'
        : 'transform 420ms cubic-bezier(0.16, 1.25, 0.3, 1), width 300ms ease, height 300ms ease');

  // Fallback CSS liquid glass filters (when no backdrop canvas is attached)
  const effectiveBlur = blur > 0 ? blur : 14;
  const backdropFilterCss = `blur(${effectiveBlur}px) saturate(1.8) brightness(1.10)`;

  return (
    <div
      ref={ref}
      className={`relative select-none ${className}`}
      style={{
        borderRadius: radiusCss,
        backgroundColor: darkTintRgba,
        boxShadow: glassShadow,
        transform: `translate3d(${tensionX}px, 0, 0)`,
        transition: transitionTiming,
        ...style,
      }}
      {...rest}
    >
      {/* 1. Hardware WebGL Snell Ray-Tracing Layer (Active if backdrop is attached) */}
      {backdrop && (
        <SoapBubbleSurface
          backdrop={backdrop}
          interactive={interactive}
          wobble={wobble}
          radius={radius}
          topRadius={effectiveTopRadius}
          bottomRadius={effectiveBottomRadius}
          glass={1.0}
          refraction={refraction}
          bevel={bevel}
          dispersion={dispersion}
          blur={blur}
          clearCenter={1.0}
          reflectivity={reflectivity}
          tint={darkTintRgba}
          oilCoverage={0}
          iridescence={0}
          glintIntensity={0}
          windowLight={false}
          windowIntensity={0}
          floorLight={0}
          bottomShade={false}
          keyLight={false}
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          style={{
            borderRadius: radiusCss,
            backgroundColor: darkTintRgba,
            border: borderOpacity <= 0 ? 'none' : (borderGradient ? 'none' : `1px solid ${borderColorRgba}`),
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
          }}
        />
      )}

      {/* 2. Pristine Multi-Layer CSS Liquid Glass Layer (Fallback or enhance when backdrop canvas is not attached) */}
      {!backdrop && (
        <div
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          style={{
            borderRadius: radiusCss,
            backgroundColor: darkTintRgba,
            border: borderOpacity <= 0 ? 'none' : (borderGradient ? 'none' : `1px solid ${borderColorRgba}`),
            backdropFilter: backdropFilterCss,
            WebkitBackdropFilter: backdropFilterCss,
          }}
        />
      )}

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
        className="relative z-10 w-full h-full rounded-[inherit] flex items-center justify-center"
      >
        {children}
      </div>
    </div>
  );
});

LiquidGlass.displayName = 'LiquidGlass';

export const LiquidGlassProvider = SoapBubbleMaterial;
