export interface LiquidGlassConfig {
  // Physical parameters
  width: number;          // Width in pixels (320 - 920)
  height: number;         // Height in pixels (50 - 260)
  radius: number;         // Corner rounding (12 - 9999px)
  refraction: number;     // Physical Snell's law refraction (0.05 - 0.55)
  bevel: number;          // Meniscus bevel width (8 - 48px)
  blur: number;           // Background blur (0 - 25px)
  dispersion: number;     // Chromatic dispersion (0.0 - 1.50)
  darkTint: number;       // Translucent dark tint (0.0 - 0.80)
  specular: number;       // Specular rim glare intensity (0.0 - 1.0)
  lightAngle: number;     // Directional glare angle in degrees (-60 to 60)
  glass: number;          // Glass body mode (1.0)
  clearCenter: number;    // Undistorted flat transmission (1.0)
  borderOpacity: number;  // Border opacity (0.05 - 0.30)

  // Advanced Liquid Optics & Physics
  saturation?: number;    // Legacy fallback
  viscosity: number;      // Fluid viscosity / drag boundary tension stiffness (0.10 - 1.00)
  thickness: number;      // Optical dome depth / thickness (150 - 750 nm)
  fresnel: number;        // Fresnel rim reflection & edge glow intensity (0.00 - 1.00)
  iridescence: number;    // Rainbow chromatic dispersion / prism interference (0.00 - 2.00)

  // Color & Asymmetric Geometry Extension
  tintColor?: string;         // Hex color for tint (e.g. '#000000', '#0a192f', etc.)
  topRadiusStep?: number;     // 0 - 10 top corner rounding
  bottomRadiusStep?: number;  // 0 - 10 bottom corner rounding
  topRadius?: number;         // Top corner radius in pixels
  bottomRadius?: number;      // Bottom corner radius in pixels
  borderColor?: string;       // Custom border color or hex
  borderGradient?: string;    // CSS gradient string for border

  // 0 - 10 Step Values for UI
  refractionStep: number;
  bevelStep: number;
  dispersionStep: number;
  blurStep: number;
  darkTintStep: number;
  shadowStep: number;
  saturationStep?: number;
  radiusStep: number;
  borderStep: number;
  widthStep: number;
  heightStep: number;
  viscosityStep: number;
  thicknessStep: number;
  specularStep?: number;
  lightAngleStep?: number;
  fresnelStep?: number;
  iridescenceStep?: number;
}

export type ShadowTone = 'dark' | 'light' | '3d';

export function computeGlassBoxShadow(
  shadowStep: number,
  shadowTone: ShadowTone = 'dark',
  borderOpacity: number = 0.12,
  thicknessStep: number = 5,
  inverted: boolean = false
): string {
  const s = Math.min(10, Math.max(0, shadowStep)) / 10;
  
  // Base inner physical caustics (only present when border is enabled)
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
    // Inverted Mode: outer container receives subtle grounding contact shadow
    return [
      `0 ${Math.round(1 + s * 2)}px ${Math.round(4 + s * 6)}px rgba(0, 0, 0, ${(0.15 + s * 0.20).toFixed(2)})`,
      innerLight,
      innerDark
    ].filter(Boolean).join(', ');
  }

  if (shadowTone === '3d') {
    // 3D Stereoscopic Emboss: Tactile elevation, directional key-light offset, volumetric rim bounce
    const contact = `0 ${Math.round(1 + s * 3)}px ${Math.round(3 + s * 4)}px rgba(0, 0, 0, ${(0.35 + s * 0.30).toFixed(2)})`;
    const elevation = `0 ${Math.round(8 + s * 20 + thkOffset)}px ${Math.round(18 + s * 28)}px rgba(0, 0, 0, ${(0.30 + s * 0.30).toFixed(2)})`;
    const ambientOcclusion = `0 ${Math.round(20 + s * 36 + thkOffset)}px ${Math.round(42 + s * 60)}px rgba(0, 0, 0, ${(0.18 + s * 0.24).toFixed(2)})`;
    const rimBounce = `0 ${Math.round(3 + s * 8)}px ${Math.round(10 + s * 20)}px rgba(56, 189, 248, ${(0.08 + s * 0.22).toFixed(2)})`;
    const physical3DTop = borderOpacity <= 0 ? '' : `inset 0 1.5px 2px rgba(255, 255, 255, ${(borderOpacity * 0.8).toFixed(2)})`;
    const physical3DBottom = `inset 0 -2.5px 3.5px rgba(0, 0, 0, 0.68)`;
    return [contact, elevation, ambientOcclusion, rimBounce, physical3DTop, physical3DBottom].filter(Boolean).join(', ');
  }

  if (shadowTone === 'light') {
    // Subtle luxury luminous white aura + soft diffuse halo
    const aura = `0 0 ${Math.round(8 + s * 20)}px rgba(255, 255, 255, ${(0.08 + s * 0.22).toFixed(2)})`;
    const spread = `0 ${Math.round(2 + s * 4)}px ${Math.round(14 + s * 28)}px rgba(255, 255, 255, ${(0.04 + s * 0.14).toFixed(2)})`;
    const rim = `0 0 1.5px rgba(255, 255, 255, ${(0.15 + s * 0.30).toFixed(2)})`;
    return [rim, aura, spread, innerLight, innerDark].filter(Boolean).join(', ');
  }

  // 'dark' mode: Refined, organic dark ambient drop shadow (never muddy or harsh)
  const contact = `0 ${Math.round(1 + s * 2)}px ${Math.round(3 + s * 4)}px rgba(0, 0, 0, ${(0.20 + s * 0.28).toFixed(2)})`;
  const mid = `0 ${Math.round(6 + s * 12 + thkOffset)}px ${Math.round(14 + s * 22)}px rgba(0, 0, 0, ${(0.22 + s * 0.28).toFixed(2)})`;
  const diffuse = `0 ${Math.round(14 + s * 20 + thkOffset)}px ${Math.round(28 + s * 38)}px rgba(0, 0, 0, ${(0.12 + s * 0.20).toFixed(2)})`;
  return [contact, mid, diffuse, innerLight, innerDark].filter(Boolean).join(', ');
}

/**
 * Computes physical inner light/aura falling onto the glass from outside to inside,
 * grading smoothly from heavy at the borders to light/clear in the center.
 * Modulated directly by the shadow slider (0 - 10).
 * Pure Gaussian multi-tier falloff with 0 spread to guarantee zero banding seams.
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
    // 3D Directional Prism Inward Falloff: crisp top specular, deep bottom occlusion, stereoscopic depth
    const topLight = `inset 0 ${Math.round(3 + s * 7)}px ${Math.round(12 + s * 26)}px rgba(255, 255, 255, ${(0.32 + s * 0.48).toFixed(2)})`;
    const bottomShadow = `inset 0 -${Math.round(4 + s * 8)}px ${Math.round(14 + s * 28)}px rgba(0, 0, 0, ${(0.42 + s * 0.52).toFixed(2)})`;
    const rimContour = `inset 0 0 ${Math.round(4 + s * 12)}px rgba(0, 0, 0, ${(0.30 + s * 0.45).toFixed(2)})`;
    const deepCore = `inset 0 0 ${Math.round(24 + s * 44)}px rgba(56, 189, 248, ${(0.06 + s * 0.18).toFixed(2)})`;
    return `${topLight}, ${bottomShadow}, ${rimContour}, ${deepCore}`;
  }

  if (shadowTone === 'light') {
    // Pure luminous white optical aura: heavy at perimeter, grading softly to light/clear center
    const rim = `inset 0 0 ${Math.round(2 + s * 6)}px rgba(255, 255, 255, ${(0.40 + s * 0.55).toFixed(2)})`;
    const meniscus = `inset 0 0 ${Math.round(8 + s * 18)}px rgba(255, 255, 255, ${(0.28 + s * 0.50).toFixed(2)})`;
    const deepAura = `inset 0 0 ${Math.round(22 + s * 44)}px rgba(255, 255, 255, ${(0.16 + s * 0.44).toFixed(2)})`;
    const topDome = `inset 0 ${Math.round(2 + s * 6)}px ${Math.round(12 + s * 24)}px rgba(255, 255, 255, ${(0.20 + s * 0.46).toFixed(2)})`;
    const bottomDome = `inset 0 -${Math.round(2 + s * 6)}px ${Math.round(12 + s * 24)}px rgba(255, 255, 255, ${(0.20 + s * 0.46).toFixed(2)})`;
    const deepWash = s > 0.5 ? `, inset 0 0 ${Math.round(40 + s * 48)}px rgba(255, 255, 255, ${(s * 0.32).toFixed(2)})` : '';
    return `${rim}, ${meniscus}, ${deepAura}, ${topDome}, ${bottomDome}${deepWash}`;
  }

  // Pure neutral obsidian black vignette: heavy at perimeter, grading softly to clear center
  const rim = `inset 0 0 ${Math.round(2 + s * 6)}px rgba(0, 0, 0, ${(0.42 + s * 0.55).toFixed(2)})`;
  const meniscus = `inset 0 0 ${Math.round(8 + s * 18)}px rgba(0, 0, 0, ${(0.30 + s * 0.52).toFixed(2)})`;
  const deepAura = `inset 0 0 ${Math.round(22 + s * 44)}px rgba(0, 0, 0, ${(0.18 + s * 0.48).toFixed(2)})`;
  const topDome = `inset 0 ${Math.round(2 + s * 6)}px ${Math.round(12 + s * 24)}px rgba(0, 0, 0, ${(0.22 + s * 0.50).toFixed(2)})`;
  const bottomDome = `inset 0 -${Math.round(2 + s * 6)}px ${Math.round(12 + s * 24)}px rgba(0, 0, 0, ${(0.22 + s * 0.50).toFixed(2)})`;
  const deepWash = s > 0.5 ? `, inset 0 0 ${Math.round(40 + s * 48)}px rgba(0, 0, 0, ${(s * 0.36).toFixed(2)})` : '';
  return `${rim}, ${meniscus}, ${deepAura}, ${topDome}, ${bottomDome}${deepWash}`;
}

export function computeConfigFromSteps(steps: {
  refractionStep: number;
  bevelStep: number;
  dispersionStep: number;
  blurStep: number;
  darkTintStep: number;
  shadowStep?: number;
  saturationStep?: number;
  radiusStep: number;
  borderStep?: number;
  widthStep: number;
  heightStep: number;
  viscosityStep?: number;
  thicknessStep?: number;
  specularStep?: number;
  lightAngleStep?: number;
  fresnelStep?: number;
  iridescenceStep?: number;
  topRadiusStep?: number;
  bottomRadiusStep?: number;
  tintColor?: string;
  borderColor?: string;
  borderGradient?: string;
}): LiquidGlassConfig {
  const rStep = Math.min(10, Math.max(0, steps.refractionStep));
  const bStep = Math.min(10, Math.max(0, steps.bevelStep));
  const dStep = Math.min(10, Math.max(0, steps.dispersionStep));
  const blStep = Math.min(10, Math.max(0, steps.blurStep));
  const tStep = Math.min(10, Math.max(0, steps.darkTintStep));
  const shdStep = Math.min(10, Math.max(0, steps.shadowStep ?? 5));
  const satStep = Math.min(10, Math.max(0, steps.saturationStep ?? 6));
  const radStep = Math.min(10, Math.max(0, steps.radiusStep));
  const brdStep = Math.min(10, Math.max(0, steps.borderStep ?? 5));
  const wStep = Math.min(10, Math.max(0, steps.widthStep));
  const hStep = Math.min(10, Math.max(0, steps.heightStep));
  const viscStep = Math.min(10, Math.max(0, steps.viscosityStep ?? 5));
  const thkStep = Math.min(10, Math.max(0, steps.thicknessStep ?? 5));
  const spStep = Math.min(10, Math.max(0, steps.specularStep ?? 0));
  const laStep = Math.min(10, Math.max(0, steps.lightAngleStep ?? 5));
  const frsStep = Math.min(10, Math.max(0, steps.fresnelStep ?? 0));
  const iriStep = Math.min(10, Math.max(0, steps.iridescenceStep ?? 0));
  const topRadStep = Math.min(10, Math.max(0, steps.topRadiusStep ?? radStep));
  const botRadStep = Math.min(10, Math.max(0, steps.bottomRadiusStep ?? radStep));
  const computedH = Math.round(56 + (hStep / 10) * 180);
  const maxCapRad = Math.max(1, Math.round(computedH / 2));
  const stepToRadius = (s: number) => (s <= 0 ? 0 : s >= 10 ? maxCapRad : Math.round((s / 10) * maxCapRad));
  const topRadPx = stepToRadius(topRadStep);
  const botRadPx = stepToRadius(botRadStep);

  return {
    refractionStep: rStep,
    bevelStep: bStep,
    dispersionStep: dStep,
    blurStep: blStep,
    darkTintStep: tStep,
    shadowStep: shdStep,
    saturationStep: satStep,
    radiusStep: radStep,
    borderStep: brdStep,
    widthStep: wStep,
    heightStep: hStep,
    viscosityStep: viscStep,
    thicknessStep: thkStep,
    specularStep: spStep,
    lightAngleStep: laStep,
    fresnelStep: frsStep,
    iridescenceStep: iriStep,
    topRadiusStep: topRadStep,
    bottomRadiusStep: botRadStep,
    topRadius: topRadPx,
    bottomRadius: botRadPx,
    tintColor: steps.tintColor ?? '#000000',
    borderColor: steps.borderColor,
    borderGradient: steps.borderGradient,

    // Mathematical mapping to shader uniforms & CSS filters
    refraction: Number((0.08 + (rStep / 10) * 0.44).toFixed(3)),
    bevel: Math.round(10 + (bStep / 10) * 36),
    dispersion: Number(((dStep / 10) * 1.40).toFixed(2)),
    blur: Math.round((blStep / 10) * 22),
    darkTint: Number(((tStep / 10) * 0.75).toFixed(2)),
    specular: 0,
    lightAngle: Math.round(-60 + (laStep / 10) * 120),
    width: Math.round(360 + (wStep / 10) * 520),
    height: Math.round(56 + (hStep / 10) * 180),
    radius: radStep >= 10 ? maxCapRad : Math.round((radStep / 10) * maxCapRad),
    saturation: 1.0,
    viscosity: Number((0.15 + (viscStep / 10) * 0.85).toFixed(2)),
    thickness: Math.round(150 + (thkStep / 10) * 650),
    fresnel: 0,
    iridescence: 0,
    glass: 1.0,
    clearCenter: 1.0,
    borderOpacity: brdStep === 0 ? 0 : Number((0.06 + (brdStep / 10) * 0.24).toFixed(2)),
  };
}

export const DEFAULT_GLASS_STEPS = {
  refractionStep: 6,
  bevelStep: 5,
  dispersionStep: 2,
  blurStep: 0,
  darkTintStep: 2,
  shadowStep: 5,
  radiusStep: 10,
  borderStep: 5,
  widthStep: 5,
  heightStep: 2,
  viscosityStep: 5,
  thicknessStep: 5,
  topRadiusStep: 10,
  bottomRadiusStep: 10,
};

export const DEFAULT_GLASS_CONFIG: LiquidGlassConfig = computeConfigFromSteps(DEFAULT_GLASS_STEPS);
