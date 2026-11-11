/**
 * @file LiquidGlassNavbar.tsx
 * @author MR PROG (https://github.com/MR-PR0G)
 * @license MIT
 * @repository https://github.com/MR-PR0G/LiquidGlass
 * 
 * Flagship Liquid Glass Navbar component by MR PROG.
 * Features viscoelastic drag physics, 3D meniscus wave refraction,
 * caustic light sweep, and autonomous self-contained liquid glass capsule.
 */

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { SoapBubbleSurface } from './soap-bubble-system';
import type { SoapBubbleRenderer } from './soap-bubble-renderer';
import { LiquidGlass, ShadowTone } from './LiquidGlass';

export interface NavbarItem {
  id: string;
  label?: string;
  icon?: any;
  badge?: boolean | string | number;
  onClick?: () => void;
}

export interface LiquidGlassNavbarProps {
  /** Array of items to display in navbar. Defaults to the 4 flagship demo icons: Home, Search, Explore, Alerts */
  items?: NavbarItem[];
  /** Controlled active item index */
  activeIndex?: number;
  /** Uncontrolled initial active index (default 0) */
  defaultIndex?: number;
  /** Callback fired when active item changes */
  onChange?: (index: number, item: NavbarItem) => void;
  /** Callback fired during boundary drag tension */
  onTension?: (tensionX: number) => void;
  /** Custom CSS classes for the outer glass container */
  className?: string;
  /** Custom inline style for the outer glass container */
  style?: React.CSSProperties;
  /** Custom accent color for refracted icon glow & specular glint (default #00e5ff) */
  accentColor?: string;
  /** Optional HTMLCanvasElement backdrop for hardware Snell ray-tracing */
  backdropRef?: React.RefObject<HTMLCanvasElement | null>;
  /** Translucent glass body dark tint (0.0 = crystal clear to 1.0 = deep obsidian, default 0.16) */
  darkTint?: number;
  /** Dark tint discrete step (0 to 10) */
  darkTintStep?: number;
  /** Optical refraction bending power (default 0.34) */
  refraction?: number;
  /** Meniscus border curvature width in px (default 28) */
  bevel?: number;
  /** Fluid viscosity & spring resistance (0.10 to 1.00, default 0.60) */
  viscosity?: number;
  /** Viscosity discrete step (0 to 10, default 5) */
  viscosityStep?: number;
  /** Lens volumetric thickness in px (default 450) */
  thickness?: number;
  /** Thickness discrete step (0 to 10, default 5) */
  thicknessStep?: number;
  /** Chromatic dispersion prism intensity (default 0.28) */
  dispersion?: number;
  /** Concentric Gaussian frosted diffusion blur in px (default 0, falls back gracefully to 14px in CSS) */
  blur?: number;
  /** Border stroke opacity (default 0.18) */
  borderOpacity?: number;
  /** Optional custom CSS gradient string for chromatic glass rim */
  borderGradient?: string;
  /** 3D elevation shadow personality: dark, light, or 3d (default 3d) */
  shadowTone?: ShadowTone;
  /** Shadow elevation intensity (0 to 10, default 5) */
  shadowStep?: number;
  /** Invert shadow into internal 360° caustic refraction aura */
  isShadowInverted?: boolean;
  /** Outer capsule height in pixels (default 74) */
  height?: number;
  /** Outer capsule max width in pixels (default 560) */
  maxWidth?: number;
  /** When true, renders only the inner track without the outer capsule container */
  embedded?: boolean;
}

// Built-in minimalist SVG icons (ensures zero external dependencies)
const HomeIcon: React.FC<{ size?: number; className?: string; strokeWidth?: number }> = ({ size = 22, className = '', strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const SearchIcon: React.FC<{ size?: number; className?: string; strokeWidth?: number }> = ({ size = 22, className = '', strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const CompassIcon: React.FC<{ size?: number; className?: string; strokeWidth?: number }> = ({ size = 22, className = '', strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

const BellIcon: React.FC<{ size?: number; className?: string; strokeWidth?: number }> = ({ size = 22, className = '', strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

const DEFAULT_DEMO_ITEMS: NavbarItem[] = [
  { id: 'home', icon: HomeIcon, label: 'Home' },
  { id: 'search', icon: SearchIcon, label: 'Search' },
  { id: 'explore', icon: CompassIcon, label: 'Explore' },
  { id: 'notifications', icon: BellIcon, label: 'Alerts', badge: true },
];

export const LiquidGlassNavbar: React.FC<LiquidGlassNavbarProps> = ({
  items = DEFAULT_DEMO_ITEMS,
  activeIndex: controlledIndex,
  defaultIndex = 0,
  onChange,
  onTension,
  className = '',
  style = {},
  accentColor = '#00e5ff',
  backdropRef,
  darkTint = 0.16,
  darkTintStep,
  refraction = 0.34,
  bevel = 28,
  viscosity = 0.60,
  viscosityStep = 5,
  thickness = 450,
  thicknessStep = 5,
  dispersion = 0.28,
  blur = 0,
  borderOpacity = 0.18,
  borderGradient,
  shadowTone = '3d',
  shadowStep = 5,
  isShadowInverted = false,
  height = 74,
  maxWidth = 560,
  embedded = false,
}) => {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const trackRef = useRef<HTMLDivElement>(null);
  const lensRendererRef = useRef<SoapBubbleRenderer | null>(null);
  const lensSurfaceRef = useRef<HTMLElement | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [trackHeight, setTrackHeight] = useState(height);

  // Drag & Physics states
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [squashScaleX, setSquashScaleX] = useState(1);
  const [dragStretchX, setDragStretchX] = useState(0);
  const [jellyWobble, setJellyWobble] = useState(0);
  const [flightStretch, setFlightStretch] = useState(0);
  const [panelTensionX, setPanelTensionX] = useState(0);

  const pointerStateRef = useRef<{
    startX: number;
    startY: number;
    centerStartX: number;
    hasMoved: boolean;
    isActive: boolean;
    isDirectOnBubble: boolean;
    pointerId: number;
  }>({
    startX: 0,
    startY: 0,
    centerStartX: 0,
    hasMoved: false,
    isActive: false,
    isDirectOnBubble: false,
    pointerId: -1,
  });

  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const moveRafRef = useRef<number | null>(null);
  const lastPointerEventRef = useRef<PointerEvent | null>(null);
  const lastTensionRef = useRef(0);

  // Track dimensions with ResizeObserver
  useEffect(() => {
    if (!trackRef.current) return;
    const updateDimensions = () => {
      if (trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        if (rect.width > 0) setTrackWidth(rect.width);
        if (rect.height > 0) setTrackHeight(rect.height);
      }
    };

    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  const numItems = items.length;

  // Smart responsive padding & slot distribution
  const sidePadding = useMemo(() => {
    if (trackWidth <= 0) return 16;
    if (trackWidth < 380) return 12;
    if (trackWidth < 600) return Math.round(trackWidth * 0.035);
    return Math.round(trackWidth * 0.04);
  }, [trackWidth]);

  const usableWidth = useMemo(() => {
    return Math.max(60, trackWidth - sidePadding * 2);
  }, [trackWidth, sidePadding]);

  const slotWidth = useMemo(() => {
    return numItems > 0 ? usableWidth / numItems : 60;
  }, [usableWidth, numItems]);

  // Exact center coordinate of each slot i
  const getSlotCenterX = useCallback(
    (index: number) => {
      return sidePadding + (index + 0.5) * slotWidth;
    },
    [sidePadding, slotWidth]
  );

  // 1. Smart Responsive Resting Geometry:
  const rawH = trackHeight || height || 74;
  const restingHeight = useMemo(() => {
    const verticalPadding = Math.max(4, Math.min(8, Math.round(rawH * 0.095)));
    return Math.max(36, rawH - verticalPadding * 2);
  }, [rawH]);

  // Native luxury squircle aspect ratio (1.76:1)
  const NATIVE_ASPECT_RATIO = 1.76;
  const restingWidth = useMemo(() => {
    const idealW = Math.round(restingHeight * NATIVE_ASPECT_RATIO);
    const maxAllowedW = Math.round(slotWidth * 0.90);
    return Math.max(76, Math.min(maxAllowedW, idealW));
  }, [restingHeight, slotWidth]);

  // 2. Smart Responsive Grabbed Geometry:
  const grabbedHeight = useMemo(() => {
    const protrusionY = Math.max(5, Math.min(8, Math.round(rawH * 0.10)));
    return rawH + protrusionY * 2;
  }, [rawH]);

  const grabbedWidth = useMemo(() => {
    const scaleMultiplier = restingHeight > 0 ? grabbedHeight / restingHeight : 1.48;
    return Math.round(restingWidth * scaleMultiplier);
  }, [restingWidth, restingHeight, grabbedHeight]);

  const currentWidth = isDragging ? grabbedWidth : restingWidth;
  const currentHeight = isDragging ? grabbedHeight : restingHeight;

  // Proportional icon size matching generator
  const iconSize = useMemo(() => {
    return Math.max(21, Math.min(32, Math.round(restingHeight * 0.50)));
  }, [restingHeight]);

  // Volumetric Jelly Physics Engine:
  const activeScaleX = isDragging
    ? squashScaleX + dragStretchX
    : (1 + flightStretch + jellyWobble);
  const activeScaleY = isDragging
    ? 1 - (squashScaleX - 1 + Math.abs(dragStretchX)) * 0.60
    : 1 - (flightStretch + jellyWobble) * 0.65;

  const effectiveScaleX = Math.max(0.68, Math.min(1.42, activeScaleX));
  const effectiveScaleY = Math.max(0.68, Math.min(1.42, activeScaleY));

  // Full-travel boundary collision limits:
  const edgePadding = 4;
  const hardMinCenterX = useMemo(() => {
    return Math.round(currentWidth / 2 + edgePadding);
  }, [currentWidth]);

  const hardMaxCenterX = useMemo(() => {
    return Math.max(hardMinCenterX, Math.round(trackWidth - currentWidth / 2 - edgePadding));
  }, [hardMinCenterX, trackWidth, currentWidth]);

  // Synchronized Position Engine:
  const [bubbleCenterX, setBubbleCenterX] = useState<number>(() => getSlotCenterX(activeIndex));
  const bubbleCenterXRef = useRef(bubbleCenterX);
  bubbleCenterXRef.current = bubbleCenterX;

  const animRafRef = useRef<number | null>(null);
  const viscStepRef = useRef(viscosityStep);
  viscStepRef.current = viscosityStep;

  // Warm, organic liquid jelly physics transition
  const animateTo = useCallback((targetX: number, duration = 400) => {
    if (animRafRef.current !== null) {
      cancelAnimationFrame(animRafRef.current);
      animRafRef.current = null;
    }

    const startX = bubbleCenterXRef.current;
    const distance = targetX - startX;
    if (Math.abs(distance) < 0.5) {
      setBubbleCenterX(targetX);
      lensRendererRef.current?.invalidate();
      setJellyWobble(0);
      setFlightStretch(0);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const t = progress;

      // Harmonic underdamped fluid spring dynamic to viscosity:
      const vNorm = Math.min(10, Math.max(0, viscStepRef.current)) / 10;
      const fluidFactor = Math.pow(1 - vNorm, 1.4); // 1.0 (ultra-fluid) to 0.0 (viscous)

      // Damping tau: 2.3 for fluid (gentle fluid settle) to 5.6 for viscous
      const tau = 2.3 + vNorm * 3.3;
      // Oscillation omega: 8.6 for fluid to 5.0 for viscous
      const omega = 8.6 - vNorm * 3.6;
      const springEase = t === 1 
        ? 1 
        : 1 - Math.exp(-tau * t) * (Math.cos(omega * t) + (tau / omega) * Math.sin(omega * t));

      const nextX = startX + distance * springEase;
      setBubbleCenterX(nextX);
      lensRendererRef.current?.invalidate();

      // Fluid elongation in flight:
      let flight = 0;
      if (t < 0.65) {
        const maxFlight = 0.03 + fluidFactor * 0.15;
        flight = Math.sin((t / 0.65) * Math.PI) * maxFlight;
      }

      // On arrival (t >= 0.42): Smooth-envelope viscoelastic jelly ripple
      let wobble = 0;
      if (t >= 0.42) {
        const settleT = (t - 0.42) / 0.58;
        const wobbleAmp = 0.018 + fluidFactor * 0.165;
        const wobbleFreq = (2.2 + fluidFactor * 2.2) * Math.PI;
        const wobbleDecay = 1.8 + vNorm * 3.2;
        const smoothEnv = Math.sin(settleT * Math.PI);
        wobble = -Math.sin(settleT * wobbleFreq) * Math.exp(-settleT * wobbleDecay) * (0.35 + 0.65 * smoothEnv) * wobbleAmp;
      }

      setFlightStretch(flight);
      setJellyWobble(wobble);

      if (progress < 1) {
        animRafRef.current = requestAnimationFrame(frame);
      } else {
        setBubbleCenterX(targetX);
        lensRendererRef.current?.invalidate();
        setFlightStretch(0);
        setJellyWobble(0);
        setIsAnimating(false);
        animRafRef.current = null;
      }
    };

    animRafRef.current = requestAnimationFrame(frame);
  }, []);

  // Update bubble position if active index changes from outside
  useEffect(() => {
    if (trackWidth > 0 && !isDragging) {
      animateTo(getSlotCenterX(activeIndex), 400);
    }
  }, [activeIndex, trackWidth, getSlotCenterX, animateTo, isDragging]);

  // Clean-up on unmount
  useEffect(() => {
    return () => {
      if (animRafRef.current !== null) cancelAnimationFrame(animRafRef.current);
      if (moveRafRef.current !== null) cancelAnimationFrame(moveRafRef.current);
    };
  }, []);

  // Update capsule tension state and call onTension
  const applyTension = useCallback((tX: number) => {
    setPanelTensionX(tX);
    onTension?.(tX);
  }, [onTension]);

  // Pointer dragging handler
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const localX = e.clientX - rect.left;

    const currentX = bubbleCenterXRef.current;
    const bubbleHalfW = currentWidth / 2;
    const distToBubbleCenter = Math.abs(localX - currentX);
    const isDirectOnBubble = distToBubbleCenter <= bubbleHalfW + 6;

    if (animRafRef.current !== null) {
      cancelAnimationFrame(animRafRef.current);
      animRafRef.current = null;
      setIsAnimating(false);
    }
    setJellyWobble(0);
    setFlightStretch(0);

    pointerStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      centerStartX: currentX,
      hasMoved: false,
      isActive: true,
      isDirectOnBubble,
      pointerId: e.pointerId,
    };
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    if (isDirectOnBubble) {
      setIsDragging(true);
    }

    const onWindowPointerMove = (ev: PointerEvent) => {
      if (!pointerStateRef.current.isActive) return;
      lastPointerEventRef.current = ev;

      if (moveRafRef.current === null) {
        moveRafRef.current = requestAnimationFrame(() => {
          moveRafRef.current = null;
          const currentEv = lastPointerEventRef.current;
          if (!currentEv || !pointerStateRef.current.isActive) return;

          const dx = currentEv.clientX - pointerStateRef.current.startX;
          const dy = currentEv.clientY - pointerStateRef.current.startY;

          if (!pointerStateRef.current.hasMoved) {
            if (Math.hypot(dx, dy) > 4) {
              pointerStateRef.current.hasMoved = true;
              setIsDragging(true);
            } else {
              return;
            }
          }

          // Measure pointer velocity for inertial squash & stretch:
          const now = performance.now();
          const dt = Math.max(1, now - lastTimeRef.current);
          const instVel = (currentEv.clientX - lastXRef.current) / dt;
          velocityRef.current = velocityRef.current * 0.70 + instVel * 0.30;
          lastXRef.current = currentEv.clientX;
          lastTimeRef.current = now;

          // Target unconstrained position
          const rawTargetX = pointerStateRef.current.centerStartX + dx;

          // Boundary tension resistance
          let clampedX = rawTargetX;
          let boundaryOvershoot = 0;

          if (rawTargetX < hardMinCenterX) {
            boundaryOvershoot = rawTargetX - hardMinCenterX;
            const stiffness = 0.14 + (viscStepRef.current / 10) * 1.8;
            clampedX = hardMinCenterX + (boundaryOvershoot / (1 + Math.abs(boundaryOvershoot) * 0.026 * stiffness));
          } else if (rawTargetX > hardMaxCenterX) {
            boundaryOvershoot = rawTargetX - hardMaxCenterX;
            const stiffness = 0.14 + (viscStepRef.current / 10) * 1.8;
            clampedX = hardMaxCenterX + (boundaryOvershoot / (1 + Math.abs(boundaryOvershoot) * 0.026 * stiffness));
          }

          setBubbleCenterX(clampedX);
          lensRendererRef.current?.invalidate();

          // Elastic capsule tension response (Requirement: full-container viscosity give)
          const tension = boundaryOvershoot !== 0 ? (boundaryOvershoot * 0.28) : (dx * 0.04);
          if (Math.abs(tension - lastTensionRef.current) > 0.1) {
            lastTensionRef.current = tension;
            applyTension(tension);
          }

          // Dynamic fluid stretch along velocity vector
          const v = velocityRef.current;
          const velStretch = Math.max(-0.25, Math.min(0.35, v * 0.08));
          setDragStretchX(velStretch);

          // Boundary corner squash resistance
          if (boundaryOvershoot !== 0) {
            const compression = Math.max(0.72, 1 - Math.abs(boundaryOvershoot) * 0.0035);
            setSquashScaleX(compression);
          } else {
            setSquashScaleX(1);
          }
        });
      }
    };

    const onWindowPointerUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('pointercancel', onWindowPointerUp);

      if (moveRafRef.current !== null) {
        cancelAnimationFrame(moveRafRef.current);
        moveRafRef.current = null;
      }

      applyTension(0);
      lastTensionRef.current = 0;
      setIsDragging(false);
      setSquashScaleX(1);
      setDragStretchX(0);

      const hadMoved = pointerStateRef.current.hasMoved;
      pointerStateRef.current.isActive = false;

      if (!hadMoved) {
        // Direct tap selection
        if (!trackRef.current) return;
        const r = trackRef.current.getBoundingClientRect();
        const tapX = ev.clientX - r.left;

        let bestIndex = 0;
        let bestDist = Infinity;
        for (let i = 0; i < numItems; i++) {
          const d = Math.abs(tapX - getSlotCenterX(i));
          if (d < bestDist) {
            bestDist = d;
            bestIndex = i;
          }
        }

        if (controlledIndex === undefined) setInternalIndex(bestIndex);
        onChange?.(bestIndex, items[bestIndex]);
        items[bestIndex]?.onClick?.();
        animateTo(getSlotCenterX(bestIndex), 400);
      } else {
        // Find closest slot factoring inertia
        const v = velocityRef.current;
        const currentX = bubbleCenterXRef.current;
        const projectedX = currentX + v * 90;

        let bestIndex = 0;
        let bestDist = Infinity;
        for (let i = 0; i < numItems; i++) {
          const d = Math.abs(projectedX - getSlotCenterX(i));
          if (d < bestDist) {
            bestDist = d;
            bestIndex = i;
          }
        }

        if (controlledIndex === undefined) setInternalIndex(bestIndex);
        onChange?.(bestIndex, items[bestIndex]);
        items[bestIndex]?.onClick?.();
        animateTo(getSlotCenterX(bestIndex), 420);
      }
    };

    window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
    window.addEventListener('pointerup', onWindowPointerUp);
    window.addEventListener('pointercancel', onWindowPointerUp);
  };

  // Lens dark tint is always +1 step deeper than base glass
  const computedDarkTintStep = darkTintStep !== undefined ? darkTintStep : Math.round(darkTint * 10);
  const lensDarkTint = Math.min(0.85, ((computedDarkTintStep + 1) / 10) * 0.75);

  // The inner track content
  const trackContent = (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onWheel={(e) => e.stopPropagation()}
      className="relative w-full h-full select-none touch-none cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    >
      {/* 1. Base Track Icons (Stable resting layer, yields cleanly as lens approaches) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center">
        {items.map((item, idx) => {
          const iconCenterX = getSlotCenterX(idx);
          const deltaX = iconCenterX - bubbleCenterX;
          const bubbleHalfW = currentWidth / 2;
          const u = bubbleHalfW > 0 ? deltaX / bubbleHalfW : 0;
          const absU = Math.abs(u);

          const baseOpacity = absU >= 1.0
            ? 1.0
            : Math.max(0, Math.pow(Math.max(0, (absU - 0.15) / 0.85), 1.6));
          const baseScale = 0.88 + 0.12 * Math.min(1, absU);

          return (
            <div
              key={`base-${item.id}`}
              className="absolute pointer-events-auto cursor-pointer group"
              style={{
                top: 0,
                bottom: 0,
                height: '100%',
                left: `${iconCenterX}px`,
                transform: 'translate3d(-50%, 0, 0)',
                width: `${slotWidth}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (controlledIndex === undefined) setInternalIndex(idx);
                onChange?.(idx, item);
                item.onClick?.();
                animateTo(getSlotCenterX(idx), 400);
              }}
              title={item.label}
            >
              <div
                className="relative flex items-center justify-center transition-colors duration-200"
                style={{
                  color: baseOpacity < 0.05 ? 'transparent' : `rgba(161, 161, 170, ${baseOpacity})`,
                  transform: `scale(${baseScale})`,
                  transition: (isDragging || isAnimating) ? 'none' : 'color 220ms ease, transform 220ms ease',
                  willChange: 'transform, opacity',
                }}
              >
                {renderIcon(item.icon, iconSize)}
                {item.badge && baseOpacity > 0.1 && (
                  <span 
                    className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: accentColor }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Draggable Liquid Glass Bubble / Pill Lens */}
      <div
        className="absolute pointer-events-none overflow-hidden will-change-transform rounded-full"
        style={{
          top: '50%',
          left: `${bubbleCenterX}px`,
          width: `${currentWidth}px`,
          height: `${currentHeight}px`,
          transform: `translate3d(-50%, -50%, 0) scale(${effectiveScaleX}, ${effectiveScaleY})`,
          transformOrigin: 'center center',
          borderRadius: '9999px',
          zIndex: 20,
          transition: 'width 380ms cubic-bezier(0.22, 1, 0.36, 1), height 380ms cubic-bezier(0.22, 1, 0.36, 1), background-color 280ms ease, box-shadow 280ms ease, border 280ms ease',
          
          border: isDragging ? '1px solid rgba(255, 255, 255, 0.38)' : '1px solid rgba(255, 255, 255, 0.22)',
          backgroundColor: `rgba(6, 10, 18, ${lensDarkTint})`,
          backdropFilter: blur > 0
            ? `blur(${blur}px) brightness(${isDragging ? 1.15 : 1.08})`
            : `blur(3px) brightness(${isDragging ? 1.15 : 1.08})`,
          WebkitBackdropFilter: blur > 0
            ? `blur(${blur}px) brightness(${isDragging ? 1.15 : 1.08})`
            : `blur(3px) brightness(${isDragging ? 1.15 : 1.08})`,

          boxShadow: isDragging
            ? 'inset 0 1.8px 2.2px rgba(255, 255, 255, 0.85), inset 0 -1.8px 2.2px rgba(0, 0, 0, 0.55), inset 0 0 18px rgba(0, 229, 255, 0.30), 0 14px 32px -4px rgba(0, 0, 0, 0.70), 0 0 24px rgba(0, 229, 255, 0.35)'
            : 'inset 0 1.4px 2px rgba(255, 255, 255, 0.65), inset 0 -1.4px 2px rgba(0, 0, 0, 0.45), inset 0 0 12px rgba(0, 229, 255, 0.18), 0 6px 18px -2px rgba(0, 0, 0, 0.55), 0 0 14px rgba(0, 229, 255, 0.20)',
        }}
      >
        {/* Hardware WebGL Snell Ray-Tracing Layer (if canvas backdrop provided) */}
        {backdropRef && (
          <div className="absolute inset-0 w-full h-full pointer-events-none rounded-full overflow-hidden">
            <SoapBubbleSurface
              ref={lensSurfaceRef}
              rendererRef={lensRendererRef}
              backdrop={backdropRef as React.RefObject<HTMLElement | null>}
              interactive={false}
              wobble={0}
              tilt={0}
              radius={Math.round(currentHeight / 2)}
              glass={1}
              refraction={((thicknessStep ?? 5) >= 9 ? refraction * 2.85 : refraction) * 1.25}
              bevel={Math.round(((thicknessStep ?? 5) >= 9 ? bevel * 2.3 : bevel) * 0.85)}
              dispersion={dispersion}
              blur={blur}
              clearCenter={1}
              oilCoverage={0}
              oilOpacity={0}
              iridescence={0}
              glintIntensity={0}
              reflectivity={0.0}
              thickness={thickness}
              windowLight={false}
              windowIntensity={0}
              floorLight={0}
              bottomShade={false}
              keyLight={false}
              speed={0}
              paused={false}
              tint="transparent"
              className="absolute inset-0 w-full h-full pointer-events-none rounded-full"
            />
          </div>
        )}

        {/* Dynamic Optical Caustic Radial Light Pool (پخش نور کریستالی درون لنز) */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background: `radial-gradient(circle at center, rgba(0, 229, 255, ${isDragging ? 0.36 : 0.24}) 0%, rgba(14, 165, 233, 0.08) 55%, transparent 75%)`,
          }}
        />

        {/* 3. Refracted Optical Icon Layer (Continuous Corner Meniscus Wave + 3D Spherical Curvature) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 35 }}>
          {items.map((item, idx) => {
            const iconCenterX = getSlotCenterX(idx);
            const deltaX = iconCenterX - bubbleCenterX;
            const bubbleHalfW = currentWidth / 2;
            const u = bubbleHalfW > 0 ? deltaX / bubbleHalfW : 0;
            const absU = Math.abs(u);

            if (absU > 1.25) return null;

            const clampedU = Math.max(-1, Math.min(1, u));
            const signedEdge = Math.sin((Math.PI / 2) * clampedU);
            const edgeFactor = Math.pow(Math.abs(clampedU), 1.20);
            const coreFactor = Math.pow(Math.cos(Math.abs(clampedU) * (Math.PI / 2)), 1.35);

            const baseScale = isDragging ? 1.10 : 1.00;
            const microStretchX = 1.0 + edgeFactor * 0.20;
            const microCompressY = 1.0 - edgeFactor * 0.07;
            const microPullX = signedEdge * 3.5;
            const domeCurvatureY = -edgeFactor * 11.0;
            const domeCurvatureX = signedEdge * 12.0;
            const danceTwistZ = jellyWobble * 2.8;
            const microSkewX = -signedEdge * 5.5;

            const iconBounce = 1.0 + coreFactor * 0.06 + jellyWobble * 0.26;
            const totalScaleX = baseScale * iconBounce * microStretchX;
            const totalScaleY = baseScale * iconBounce * microCompressY;

            const glintOffset = -signedEdge * 4.8;
            const glintIntensity = edgeFactor * 0.95 + coreFactor * 0.35;
            const lightCenterX = Math.max(10, Math.min(90, Math.round(50 - signedEdge * 38)));
            const lightCenterY = Math.round(50 - edgeFactor * 14);

            return (
              <div
                key={`refracted-${item.id}`}
                className="absolute flex items-center justify-center"
                style={{
                  top: 0,
                  bottom: 0,
                  height: '100%',
                  left: `calc(50% + ${deltaX}px)`,
                  transform: 'translate3d(-50%, 0, 0)',
                  width: `${slotWidth}px`,
                  opacity: 1,
                  willChange: 'transform',
                }}
              >
                {/* Dynamic Curved Optical Light Sweep */}
                <div
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    width: `${iconSize * 1.85}px`,
                    height: `${iconSize * 1.85}px`,
                    background: `radial-gradient(circle at ${lightCenterX}% ${lightCenterY}%, rgba(0, 229, 255, ${0.34 * (coreFactor * 0.65 + edgeFactor * 0.45)}) 0%, rgba(14, 165, 233, 0.09) 45%, transparent 70%)`,
                    opacity: Math.max(coreFactor, edgeFactor * 0.88),
                    transform: `scale(${0.92 + coreFactor * 0.18 + jellyWobble * 0.15})`,
                    transition: (isAnimating || isDragging) ? 'none' : 'opacity 220ms ease, transform 220ms ease',
                  }}
                />

                <div
                  className="relative flex items-center justify-center font-bold"
                  style={{
                    color: accentColor,
                    transform: `perspective(180px) translate3d(${microPullX}px, 0, 0) rotateX(${domeCurvatureY}deg) rotateY(${domeCurvatureX}deg) rotateZ(${danceTwistZ}deg) skewX(${microSkewX}deg) scale(${totalScaleX}, ${totalScaleY})`,
                    transformOrigin: 'center center',
                    filter: `drop-shadow(0 0 ${3 + coreFactor * 6}px ${accentColor}) drop-shadow(${glintOffset}px 0 ${1.5 + edgeFactor * 1.5}px rgba(0, 240, 255, ${glintIntensity})) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.90))`,
                    transition: (isAnimating || isDragging) ? 'none' : 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
                    willChange: 'transform',
                    isolation: 'isolate',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {renderIcon(item.icon, iconSize)}
                  {item.badge && (
                    <span 
                      className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Natural Inner Specular Rim */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            borderRadius: '9999px',
            boxShadow: isDragging
              ? 'inset 0 1.5px 2px rgba(255, 255, 255, 0.75), inset 0 -1.5px 2px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.28), inset 0 0 14px rgba(0, 229, 255, 0.22)'
              : 'inset 0 1px 1.5px rgba(255, 255, 255, 0.40), inset 0 -1px 1.5px rgba(0, 0, 0, 0.35), inset 0 0 0 0.75px rgba(255, 255, 255, 0.15), inset 0 0 10px rgba(0, 229, 255, 0.15)',
            transition: 'box-shadow 260ms ease',
          }}
        />
      </div>
    </div>
  );

  // If embedded in a parent container (e.g. InteractiveGlassSandbox), render track directly
  if (embedded) {
    return trackContent;
  }

  // Standalone mode: wrap inside the flagship LiquidGlass optical container!
  return (
    <LiquidGlass
      backdrop={backdropRef}
      refraction={refraction}
      bevel={bevel}
      dispersion={dispersion}
      blur={blur}
      darkTint={darkTint}
      thickness={thickness}
      thicknessStep={thicknessStep}
      viscosity={viscosity}
      viscosityStep={viscosityStep}
      radius={9999}
      borderOpacity={borderOpacity}
      borderGradient={borderGradient}
      shadowStep={shadowStep}
      shadowTone={shadowTone}
      isShadowInverted={isShadowInverted}
      tensionX={panelTensionX}
      className={`mx-auto ${className}`}
      style={{
        height: `${height}px`,
        maxWidth: `${maxWidth}px`,
        width: '100%',
        padding: '0 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflow: 'visible',
        ...style,
      }}
    >
      {trackContent}
    </LiquidGlass>
  );
};

// Robust component & element renderer
function renderIcon(Icon: any, size: number): React.ReactNode {
  if (!Icon) return null;
  if (React.isValidElement(Icon)) return Icon;
  if (typeof Icon === 'function' || (typeof Icon === 'object' && Icon !== null)) {
    const Component = Icon;
    return <Component size={size} strokeWidth={2.2} />;
  }
  return null;
}
