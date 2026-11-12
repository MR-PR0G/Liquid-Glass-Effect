import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Home, Search, Compass, Bell, LucideIcon } from 'lucide-react';
import { SoapBubbleSurface } from './soap-bubble-system';
import type { SoapBubbleRenderer } from './soap-bubble-renderer';
import { LiquidGlass, type ShadowTone } from './LiquidGlass';


export interface NavbarItem {
  id: string;
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  badge?: boolean;
  label?: string;
}

export interface LiquidGlassNavbarProps {
  items?: NavbarItem[];
  activeIndex?: number;
  onChange?: (index: number) => void;
  onTension?: (tensionX: number) => void;
  className?: string;
  style?: React.CSSProperties;
  backdropRef?: React.RefObject<HTMLCanvasElement | null>;
  darkTint?: number;
  darkTintStep?: number;
  refraction?: number;
  bevel?: number;
  saturation?: number;
  specular?: number;
  viscosity?: number;
  viscosityStep?: number;
  thickness?: number;
  thicknessStep?: number;
  fresnel?: number;
  iridescence?: number;
  shadowStep?: number;
  shadowTone?: ShadowTone;
  borderOpacity?: number;
  blur?: number;
  borderGradient?: string;
  isShadowInverted?: boolean;
  height?: number;
  maxWidth?: number;
  embedded?: boolean;
}

const DEFAULT_NAVBAR_ITEMS: NavbarItem[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'explore', icon: Compass, label: 'Explore' },
  { id: 'notifications', icon: Bell, label: 'Alerts', badge: true },
];

export const LiquidGlassNavbar: React.FC<LiquidGlassNavbarProps> = ({
  items = DEFAULT_NAVBAR_ITEMS,
  activeIndex: controlledIndex,
  onChange,
  onTension,
  className = '',
  style = {},
  backdropRef,
  darkTint = 0.2,
  darkTintStep,
  refraction = 0.34,
  bevel = 28,
  viscosity = 0.60,
  viscosityStep = 5,
  thickness = 450,
  thicknessStep = 5,
  blur = 0,
  borderOpacity = 0.18,
  borderGradient,
  shadowTone = 'dark',
  shadowStep = 5,
  isShadowInverted = false,
  height = 92,
  maxWidth = 620,
  embedded = false,
}) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const trackRef = useRef<HTMLDivElement>(null);
  const lensRendererRef = useRef<SoapBubbleRenderer | null>(null);
  const lensSurfaceRef = useRef<HTMLElement | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [trackHeight, setTrackHeight] = useState(0);

  // Drag & Physics states
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [squashScaleX, setSquashScaleX] = useState(1);
  const [dragStretchX, setDragStretchX] = useState(0);
  const [jellyWobble, setJellyWobble] = useState(0);
  const [flightStretch, setFlightStretch] = useState(0);

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
        setTrackWidth(rect.width);
        setTrackHeight(rect.height);
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
  // Proportional vertical padding ensures the resting lens always sits perfectly balanced in any bar height.
  const rawH = trackHeight || height || 92;
  const restingHeight = useMemo(() => {
    const verticalPadding = Math.max(4, Math.min(8, Math.round(rawH * 0.095)));
    return Math.max(36, rawH - verticalPadding * 2);
  }, [rawH]);

  // Native luxury squircle aspect ratio (1.67:1 for exact 127px x 76px flagship lens)
  const NATIVE_ASPECT_RATIO = 1.67;
  const restingWidth = useMemo(() => {
    const idealW = Math.round(restingHeight * NATIVE_ASPECT_RATIO);
    const maxAllowedW = Math.round(slotWidth * 0.90);
    return Math.max(76, Math.min(maxAllowedW, idealW));
  }, [restingHeight, slotWidth]);

  // 2. Smart Responsive Grabbed Geometry:
  // Strictly preserves the EXACT same aspect ratio as resting state (restingWidth / restingHeight).
  // Multiplied by uniform scaleMultiplier so it never distorts, surfboards, or changes proportion!
  const grabbedHeight = useMemo(() => {
    const protrusionY = Math.max(5, Math.min(8, Math.round(rawH * 0.10)));
    return rawH + protrusionY * 2;
  }, [rawH]);

  const grabbedWidth = useMemo(() => {
    const scaleMultiplier = restingHeight > 0 ? grabbedHeight / restingHeight : 1.48;
    return Math.round(restingWidth * scaleMultiplier);
  }, [restingWidth, restingHeight, grabbedHeight]);

  // Physical geometry of current state
  const currentWidth = isDragging ? grabbedWidth : restingWidth;
  const currentHeight = isDragging ? grabbedHeight : restingHeight;

  // Dynamically responsive icon size proportional to the resting lens height
  const iconSize = useMemo(() => {
    return Math.max(21, Math.min(32, Math.round(restingHeight * 0.44)));
  }, [restingHeight]);

  // Volumetric Jelly Physics Engine:
  // Dynamically preserves 2D area (deltaX * deltaY ≈ constant)
  // During drag: responds to inertia & mouse velocity stretch + corner boundary resistance
  // During landing: multi-wave viscoelastic jelly ripple
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

  // 100% Synchronized Position Engine:
  const [bubbleCenterX, setBubbleCenterX] = useState<number>(() => getSlotCenterX(activeIndex));
  const bubbleCenterXRef = useRef(bubbleCenterX);
  bubbleCenterXRef.current = bubbleCenterX;

  // Animation controller & dynamic viscosity ref
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

      // Silky smooth fluid spring: tau: 2.0 (fluid) to 3.8 (viscous)
      const tau = 2.0 + vNorm * 2.2;
      // Oscillation omega: 9.2 (fluid) to 6.2 (viscous)
      const omega = 9.2 - vNorm * 3.0;
      const springEase = t === 1 
        ? 1 
        : 1 - Math.exp(-tau * t) * (Math.cos(omega * t) + (tau / omega) * Math.sin(omega * t));

      const currentX = startX + distance * springEase;
      setBubbleCenterX(currentX);
      lensRendererRef.current?.invalidate();

      // Fluid elongation in flight:
      let flight = 0;
      if (t < 0.68) {
        // Fluid stretches dynamically up to +18%
        const maxFlight = 0.035 + fluidFactor * 0.16;
        flight = Math.sin((t / 0.68) * Math.PI) * maxFlight;
      }

      // On arrival (t >= 0.40): Smooth-envelope viscoelastic jelly ripple
      let wobble = 0;
      if (t >= 0.40) {
        const settleT = (t - 0.40) / 0.60; // 0 to 1
        const wobbleAmp = 0.02 + fluidFactor * 0.18;
        const wobbleFreq = (2.2 + fluidFactor * 2.2) * Math.PI;
        const wobbleDecay = 1.6 + vNorm * 2.6;
        // Smooth envelope guarantees C1 continuous derivative at entry and exit
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

  // Sync position on external activeIndex change (clicks, touch, or parent scroll)
  const prevActiveRef = useRef(activeIndex);
  useEffect(() => {
    if (prevActiveRef.current !== activeIndex) {
      prevActiveRef.current = activeIndex;
      if (!isDragging) {
        const targetX = getSlotCenterX(activeIndex);
        animateTo(targetX, 400);
      }
    }
  }, [activeIndex, getSlotCenterX, isDragging, animateTo]);

  useEffect(() => {
    if (!isDragging && animRafRef.current === null) {
      const targetX = getSlotCenterX(activeIndex);
      setBubbleCenterX(targetX);
      lensRendererRef.current?.invalidate();
    }
  }, [trackWidth, activeIndex, getSlotCenterX, isDragging]);

  useEffect(() => {
    return () => {
      if (animRafRef.current !== null) {
        cancelAnimationFrame(animRafRef.current);
      }
      if (moveRafRef.current !== null) {
        cancelAnimationFrame(moveRafRef.current);
      }
    };
  }, []);

  // Window pointer listeners callbacks with 120 FPS requestAnimationFrame batching
  const onWindowPointerMove = useCallback((e: PointerEvent) => {
    const state = pointerStateRef.current;
    if (!state.isActive) return;

    lastPointerEventRef.current = e;

    if (!state.hasMoved) {
      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;
      if (Math.hypot(dx, dy) > 3) {
        state.hasMoved = true;
        if (!isDragging) {
          setIsDragging(true);
        }
      }
    }

    if (!moveRafRef.current) {
      moveRafRef.current = requestAnimationFrame(() => {
        moveRafRef.current = null;
        const ev = lastPointerEventRef.current;
        if (!ev || !state.isActive) return;

        if (state.isDirectOnBubble || state.hasMoved) {
          const now = performance.now();
          const dt = now - lastTimeRef.current;
          if (dt > 8) {
            const rawVx = (ev.clientX - lastXRef.current) / dt;
            velocityRef.current = velocityRef.current * 0.60 + rawVx * 0.40;
            lastXRef.current = ev.clientX;
            lastTimeRef.current = now;

            // Fluid dynamic velocity inertia stretch (Requirement 3):
            const vNorm = viscStepRef.current / 10;
            const fluidFactor = Math.pow(1 - vNorm, 1.3);
            const dynamicStretch = Math.min(0.18, Math.abs(velocityRef.current) * 0.08 * fluidFactor);
            setDragStretchX(dynamicStretch);
          }

          const dx = ev.clientX - state.startX;
          const rawTargetX = state.centerStartX + dx;
          let targetCenterX = rawTargetX;
          let sX = 1;
          let tension = 0;

          // 2-Stage Liquid Physics Boundary Resistance (Softer yield for fluid, firm for viscous):
          const stiffness = 0.20 + Math.pow(viscosity, 1.8) * 3.2;
          const yieldFactor = 1 / stiffness;

          if (rawTargetX < hardMinCenterX) {
            const overshoot = hardMinCenterX - rawTargetX;
            if (overshoot <= 18) {
              const progress = overshoot / 18;
              targetCenterX = hardMinCenterX - progress * 2.2 * yieldFactor;
              sX = 1 - progress * 0.035 * yieldFactor;
              tension = -progress * 4.0 * Math.min(1.6, stiffness);
            } else {
              const extra = overshoot - 18;
              const extraOvershoot = Math.min(3.2, Math.pow(extra, 0.42) * 0.7) * yieldFactor;
              targetCenterX = hardMinCenterX - (2.2 * yieldFactor) - extraOvershoot;
              sX = (1 - 0.035 * yieldFactor) - Math.min(0.06, Math.pow(extra, 0.38) * 0.012 * yieldFactor);
              tension = -(4.0 + Math.min(4.0, Math.pow(extra, 0.45) * 0.8)) * Math.min(1.6, stiffness);
            }
          } else if (rawTargetX > hardMaxCenterX) {
            const overshoot = rawTargetX - hardMaxCenterX;
            if (overshoot <= 18) {
              const progress = overshoot / 18;
              targetCenterX = hardMaxCenterX + progress * 2.2 * yieldFactor;
              sX = 1 - progress * 0.035 * yieldFactor;
              tension = progress * 4.0 * Math.min(1.6, stiffness);
            } else {
              const extra = overshoot - 18;
              const extraOvershoot = Math.min(3.2, Math.pow(extra, 0.42) * 0.7) * yieldFactor;
              targetCenterX = hardMaxCenterX + (2.2 * yieldFactor) + extraOvershoot;
              sX = (1 - 0.035 * yieldFactor) - Math.min(0.06, Math.pow(extra, 0.38) * 0.012 * yieldFactor);
              tension = (4.0 + Math.min(4.0, Math.pow(extra, 0.45) * 0.8)) * Math.min(1.6, stiffness);
            }
          }

          setBubbleCenterX(targetCenterX);
          lensRendererRef.current?.invalidate();
          setSquashScaleX(sX);

          // Only notify parent when tension actually changes across the elastic edge
          if (Math.abs(tension - lastTensionRef.current) > 0.05 || (tension === 0 && lastTensionRef.current !== 0)) {
            lastTensionRef.current = tension;
            onTension?.(tension);
          }
        }
      });
    }
  }, [hardMinCenterX, hardMaxCenterX, onTension, isDragging, viscosity]);

  const onWindowPointerUp = useCallback((e: PointerEvent) => {
    window.removeEventListener('pointermove', onWindowPointerMove);
    window.removeEventListener('pointerup', onWindowPointerUp);
    window.removeEventListener('pointercancel', onWindowPointerUp);

    if (moveRafRef.current !== null) {
      cancelAnimationFrame(moveRafRef.current);
      moveRafRef.current = null;
    }
    lastTensionRef.current = 0;

    const state = pointerStateRef.current;
    if (!state.isActive) return;
    state.isActive = false;

    if (state.hasMoved) {
      // User dragged across the bar!
      const vx = velocityRef.current;
      const speed = Math.abs(vx);
      let finalIdx = activeIndex;

      // Realistic fling physics: hard flick can propel up to 2 tabs away
      if (speed > 0.28) {
        const direction = Math.sign(vx);
        const steps = speed > 0.85 ? 2 : 1;
        finalIdx = Math.max(0, Math.min(numItems - 1, activeIndex + direction * steps));
      } else {
        const relativeSlot = (bubbleCenterXRef.current - sidePadding) / slotWidth - 0.5;
        finalIdx = Math.max(0, Math.min(numItems - 1, Math.round(relativeSlot)));
      }

      setIsDragging(false);
      setSquashScaleX(1);
      setDragStretchX(0);
      onTension?.(0);

      if (controlledIndex === undefined) {
        setInternalIndex(finalIdx);
      }
      onChange?.(finalIdx);

      // Smoothly spring-glide into destination slot with warm jelly settle
      const targetX = getSlotCenterX(finalIdx);
      animateTo(targetX, 380);
    } else if (state.isDirectOnBubble) {
      // User grabbed the bubble and released in place without dragging:
      // Softly contracts back to resting size!
      setIsDragging(false);
      setSquashScaleX(1);
      setDragStretchX(0);
      onTension?.(0);
    } else {
      // User clicked or tapped another tab!
      // isDragging was NEVER true, so NO flash or swelling occurred!
      if (trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left - sidePadding;
        const clickedIdx = Math.max(0, Math.min(numItems - 1, Math.floor(clickX / slotWidth)));

        if (controlledIndex === undefined) {
          setInternalIndex(clickedIdx);
        }
        onChange?.(clickedIdx);

        // Glide immediately with warm jelly spring physics
        animateTo(getSlotCenterX(clickedIdx), 380);
      }
    }
  }, [activeIndex, controlledIndex, getSlotCenterX, numItems, onChange, onTension, sidePadding, slotWidth, animateTo, onWindowPointerMove]);

  // Pointer down on track initiates interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (!trackRef.current) return;

    // Use track-relative local coordinates for 100% accurate hit-testing across all devices
    const rect = trackRef.current.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const currentX = bubbleCenterXRef.current;
    const bubbleHalfW = currentWidth / 2;
    const distToBubbleCenter = Math.abs(localX - currentX);

    // Direct hit test: did the user click/touch directly on the bubble?
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
      // User clicked/touched directly on the bubble!
      // Enlarge IMMEDIATELY and softly right under their finger!
      setIsDragging(true);
    }

    window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
    window.addEventListener('pointerup', onWindowPointerUp);
    window.addEventListener('pointercancel', onWindowPointerUp);
  };

  // Parent liquid glass background dark tint step (0 - 10):
  const parentStep = typeof darkTintStep === 'number'
    ? Math.min(10, Math.max(0, darkTintStep))
    : (typeof darkTint === 'number' ? Math.round((darkTint / 0.75) * 10) : 2);

  // User requirement 1: Lens dark tint is minimum 1, and always exactly 1 number higher than its parent (0->1, 10->11)
  // Constant, unwavering deep dark tint whether resting or grabbed!
  const lensDarkTintStep = Math.max(1, parentStep + 1);
  const lensDarkTint = Number(((lensDarkTintStep / 10) * 0.78).toFixed(3));

  const trackContent = (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onWheel={(e) => e.stopPropagation()}
      className={`relative w-full h-full select-none touch-none cursor-grab active:cursor-grabbing ${className}`}
      style={{
        height: `${height || 92}px`,
        minHeight: `${height || 92}px`,
        touchAction: 'none',
        ...style,
      }}
    >
      {/* 1. Base Track Icons (Stable resting layer across the tab bar, always visible until lens covers them) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const iconCenterX = getSlotCenterX(idx);
          const deltaX = iconCenterX - bubbleCenterX;
          const bubbleHalfW = currentWidth / 2;
          const u = bubbleHalfW > 0 ? deltaX / bubbleHalfW : 0;
          const absU = Math.abs(u);

          // Base track icon yields smoothly right as the lens corner reaches it (|u| <= 1.0)
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
                if (controlledIndex === undefined) {
                  setInternalIndex(idx);
                }
                onChange?.(idx);
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
                <Icon size={iconSize} strokeWidth={2.0} className="group-hover:text-zinc-200 transition-colors duration-150" />
                {item.badge && baseOpacity > 0.1 && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Draggable Liquid Glass Bubble / Pill Lens */}
      {/* Unified container locked to top: 50% with transformOrigin: center center - ZERO vertical drop */}
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
          // Always smooth fluid size and styling transitions (fixes stiff jump on tab release)
          transition: 'width 380ms cubic-bezier(0.22, 1, 0.36, 1), height 380ms cubic-bezier(0.22, 1, 0.36, 1), background-color 280ms ease, box-shadow 280ms ease, border 280ms ease',

          // Outer border: subtle rim when resting, crisp highlight when grabbed
          border: (borderOpacity !== undefined && borderOpacity <= 0)
            ? 'none'
            : (isDragging ? '1px solid rgba(255, 255, 255, 0.32)' : '1px solid rgba(255, 255, 255, 0.16)'),

          // Requirement 1: Lens dark tint is always +1 step darker than parent back glass (unwavering when grabbed)
          backgroundColor: `rgba(6, 10, 18, ${lensDarkTint})`,
          backdropFilter: blur > 0
            ? `blur(${blur}px) brightness(${isDragging ? 1.08 : 1.04})`
            : (isDragging ? 'blur(1px) brightness(1.06)' : 'none'),
          WebkitBackdropFilter: blur > 0
            ? `blur(${blur}px) brightness(${isDragging ? 1.08 : 1.04})`
            : (isDragging ? 'blur(1px) brightness(1.06)' : 'none'),

          // Crisp 3D lens elevation and inner specular highlight
          boxShadow: isDragging
            ? 'inset 0 1.5px 2px rgba(255, 255, 255, 0.75), inset 0 -1.5px 2px rgba(0, 0, 0, 0.50), 0 12px 28px -4px rgba(0, 0, 0, 0.65)'
            : 'inset 0 1.2px 1.8px rgba(255, 255, 255, 0.45), inset 0 -1.2px 1.8px rgba(0, 0, 0, 0.40), 0 4px 14px -1px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* 1. Physical Snell Ray-Tracing Layer (WebGL wallpaper refraction & curved meniscus dome) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none rounded-full overflow-hidden"
          style={{ borderRadius: '9999px' }}
        >
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
            dispersion={0}
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
            style={{ borderRadius: '9999px' }}
          />
        </div>

        {/* 1.5. Lens Dark Tint Absorption Layer - strictly above WebGL canvas (Requirement 1: constant dark depth) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none rounded-full"
          style={{
            borderRadius: '9999px',
            backgroundColor: `rgba(4, 7, 14, ${lensDarkTint})`,
          }}
        />

        {/* 2. Refracted Optical Content Layer (Strictly clipped inside the real bubble capsule!) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 35 }}>
          {items.map((item, idx) => {
            const Icon = item.icon;
            const iconCenterX = getSlotCenterX(idx);

            // Real physical distance from active animated bubble center to this icon (1:1 screen pixels)
            const deltaX = iconCenterX - bubbleCenterX;
            const bubbleHalfW = currentWidth / 2;
            const u = deltaX / bubbleHalfW;
            const absU = Math.abs(u);

            // Skip rendering if outside lens influence for peak mobile GPU efficiency
            if (absU > 1.25) return null;

            // Mathematical continuous progression:
            // Starts at MAXIMUM at the corner (u = +/-1.0) and smoothly finishes at ZERO at the center (u = 0.0)
            const clampedU = Math.max(-1, Math.min(1, u));
            const signedEdge = Math.sin((Math.PI / 2) * clampedU);
            const edgeFactor = Math.pow(Math.abs(clampedU), 1.20);

            // Core presence factor: 1 at dead center, 0 at corners
            const coreFactor = Math.pow(Math.cos(Math.abs(clampedU) * (Math.PI / 2)), 1.35);

            // Base scale:
            // Resting: 1.00 (standard factory size)
            // Grabbed: exactly 1.10
            const baseScale = isDragging ? 1.10 : 1.00;

            // 1. Rich Meniscus Corner Curvature (Starts at peak at corner, finishes at center):
            // Elastic radial stretch along curved meniscus lip (up to 20% right at the corner):
            const microStretchX = 1.0 + edgeFactor * 0.20;
            // Transverse micro-compression preserving liquid volume:
            const microCompressY = 1.0 - edgeFactor * 0.07;
            // Smooth continuous optical shift (peaks at corner, vanishes to 0 at center):
            const microPullX = signedEdge * 3.5;
            // 3D Spherical Dome curvature: convex bulge bowing toward viewer in 3D perspective
            const domeCurvatureY = -edgeFactor * 11.0; // X-axis dome arching
            const domeCurvatureX = signedEdge * 12.0;  // Y-axis dome turning
            // Liquid astigmatic shear:
            const microSkewX = -signedEdge * 5.5;

            // 2. Dynamic Liquid Resonance on Settle:
            const iconBounce = 1.0 + coreFactor * 0.06 + jellyWobble * 0.26;
            const danceTwistZ = jellyWobble * 2.8;

            const totalScaleX = baseScale * iconBounce * microStretchX;
            const totalScaleY = baseScale * iconBounce * microCompressY;

            return (
              <div
                key={`refracted-${item.id}`}
                className="absolute top-0 bottom-0 h-full flex items-center justify-center pointer-events-none"
                style={{
                  left: `calc(50% + ${deltaX}px)`,
                  transform: 'translate3d(-50%, 0, 0)',
                  width: `${slotWidth}px`,
                  opacity: 1, // Naturally clipped by lens capsule overflow-hidden with zero blur dip
                }}
              >
                <div
                  className="relative flex items-center justify-center text-zinc-100 font-bold"
                  style={{
                    // Rich 3D spherical liquid glass meniscus curvature & organic settle dance
                    transform: `perspective(180px) translate3d(${microPullX}px, 0, 0) rotateX(${domeCurvatureY}deg) rotateY(${domeCurvatureX}deg) rotateZ(${danceTwistZ}deg) skewX(${microSkewX}deg) scale(${totalScaleX}, ${totalScaleY})`,
                    transformOrigin: 'center center',
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.90))',
                    transition: (isAnimating || isDragging) ? 'none' : 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
                    willChange: 'transform',
                    isolation: 'isolate',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <Icon size={iconSize} strokeWidth={2.2} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Natural Inner Glass Rim (Internal Specular Bevel & Caustic Reflection Layer) */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            borderRadius: '9999px',
            boxShadow: isDragging
              ? 'inset 0 1.5px 2px rgba(255, 255, 255, 0.65), inset 0 -1.5px 2px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.28)'
              : 'inset 0 1px 1.5px rgba(255, 255, 255, 0.40), inset 0 -1px 1.5px rgba(0, 0, 0, 0.35), inset 0 0 0 0.75px rgba(255, 255, 255, 0.15)',
            transition: 'box-shadow 260ms ease',
          }}
        />
      </div>
    </div>
  );

  if (embedded) {
    return trackContent;
  }

  return (
    <LiquidGlass
      backdrop={backdropRef}
      refraction={refraction}
      bevel={bevel}
      blur={blur}
      darkTint={darkTint}
      darkTintStep={darkTintStep}
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
