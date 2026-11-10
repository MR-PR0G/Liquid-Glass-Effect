import React from 'react';
import { LiquidGlassConfig } from '../../types';
import { SoapBubbleSurface } from '../soap-bubble';

interface LiquidDockProps {
  config: LiquidGlassConfig;
}

export const LiquidDock: React.FC<LiquidDockProps> = ({ config }) => {
  const darkTintRgba = config.darkTint > 0 ? `rgba(0, 0, 0, ${config.darkTint})` : 'transparent';

  return (
    <aside 
      aria-label="Liquid Glass Bottom Panel"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none pointer-events-none"
    >
      {/* 
        True Apple iOS Liquid Glass:
        - Physically ray-traced Snell's law refraction strictly along the curved meniscus bevel.
        - Center is 100% flat and crystal clear.
        - Isotropic Fresnel rim highlight (directional white arc lines removed).
        - Dynamic Dark Tint / Black Fade controllable from 0% to 85%.
        - Live optical blur + CSS hardware acceleration.
      */}
      <SoapBubbleSurface
        as="div"
        interactive={false}
        wobble={0}
        radius={9999}
        glass={config.glass}
        refraction={config.refraction}
        bevel={config.bevel}
        dispersion={config.dispersion}
        blur={config.blur}
        clearCenter={config.clearCenter}
        
        // Natural Fresnel edge reflectivity (ambient rim light) without fake spots
        reflectivity={0.65}
        tint={darkTintRgba}
        
        // Disable artificial promo lights, oils and glints
        oilCoverage={0}
        iridescence={0}
        glintIntensity={0}
        windowLight={false}
        windowIntensity={0}
        floorLight={0}
        bottomShade={false}
        keyLight={false}
        
        className="w-[88vw] max-w-xl h-14 sm:h-16 rounded-full flex items-center justify-center pointer-events-none transition-none will-change-transform"
        style={{
          boxShadow: config.darkTint > 0 
            ? `inset 0 1px 0.5px rgba(255, 255, 255, 0.14), 0 12px 30px rgba(0, 0, 0, ${config.darkTint * 0.5})`
            : 'inset 0 1px 0.5px rgba(255, 255, 255, 0.10)',
          backgroundColor: darkTintRgba,
          border: '0.75px solid rgba(255, 255, 255, 0.09)',
          backdropFilter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
          WebkitBackdropFilter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
          '--soap-bubble-shadow': 'none',
          contain: 'paint',
        } as React.CSSProperties}
      >
        {/* Pure, empty liquid glass body */}
      </SoapBubbleSurface>
    </aside>
  );
};
