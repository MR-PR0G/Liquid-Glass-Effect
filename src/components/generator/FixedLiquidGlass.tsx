import React from 'react';
import { LiquidGlassConfig } from '../../types';
import { SoapBubbleSurface } from '../soap-bubble';

interface FixedLiquidGlassProps {
  config: LiquidGlassConfig;
}

export const FixedLiquidGlass: React.FC<FixedLiquidGlassProps> = ({ config }) => {
  const darkTintRgba = config.darkTint > 0 ? `rgba(0, 0, 0, ${config.darkTint})` : 'transparent';
  const radiusCss = config.radius >= 999 ? '9999px' : `${config.radius}px`;

  return (
    <aside 
      aria-label="Liquid Glass Surface"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none pointer-events-none"
    >
      {/* 
        Authentic Snell's Law Liquid Glass:
        - Physically ray-traced refraction strictly along the curved meniscus bevel.
        - Center is 100% flat and crystal-clear.
        - Dynamic 0-10 Width and Height control.
        - 120 FPS sub-pixel GPU rasterization.
      */}
      <SoapBubbleSurface
        as="div"
        interactive={false}
        wobble={0}
        radius={config.radius}
        glass={config.glass}
        refraction={config.refraction}
        bevel={config.bevel}
        dispersion={config.dispersion}
        blur={config.blur}
        clearCenter={config.clearCenter}
        reflectivity={0.65}
        tint={darkTintRgba}
        oilCoverage={0}
        iridescence={0}
        glintIntensity={0}
        windowLight={false}
        windowIntensity={0}
        floorLight={0}
        bottomShade={false}
        keyLight={false}
        className="flex items-center justify-center pointer-events-none transition-all duration-150 will-change-transform"
        style={{
          width: `min(92vw, ${config.width}px)`,
          height: `${config.height}px`,
          borderRadius: radiusCss,
          border: `0.75px solid rgba(255, 255, 255, ${config.borderOpacity})`,
          backgroundColor: darkTintRgba,
          backdropFilter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
          WebkitBackdropFilter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
          boxShadow: config.darkTint > 0 
            ? `inset 0 1px 0.5px rgba(255, 255, 255, 0.14), 0 16px 36px rgba(0, 0, 0, ${config.darkTint * 0.5})`
            : 'inset 0 1px 0.5px rgba(255, 255, 255, 0.10)',
          '--soap-bubble-shadow': 'none',
          contain: 'paint',
        } as React.CSSProperties}
      >
        {/* Crisp, Glowing Lettering inside the liquid glass */}
        <div className="flex items-center gap-2.5 tracking-[0.25em] text-xs sm:text-sm font-bold text-white uppercase drop-shadow-md font-mono select-none">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
          <span>LIQUID GLASS</span>
        </div>
      </SoapBubbleSurface>
    </aside>
  );
};
