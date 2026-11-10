import React, { useState, useEffect, useCallback } from 'react';
import { LiquidGlassLogo } from '../liquid-glass-logo';

interface SplashScreenProps {
  onComplete: () => void;
  onStartFadeOut?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  onStartFadeOut,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [orbPhase, setOrbPhase] = useState<'hidden' | 'emerging' | 'dissolving'>('hidden');
  const [completed, setCompleted] = useState(false);

  // Initial translucent white liquid orb animation:
  // 1. Immediately blooms in center (0 - 320ms)
  // 2. Logo emerges from its center as the orb dissolves (320ms - 800ms)
  useEffect(() => {
    // Stage 1: Fast soft emergence of the translucent white droplet orb
    const timer1 = setTimeout(() => {
      setOrbPhase('emerging');
    }, 40);

    // Stage 2: Smooth dissolve as the liquid glass logo takes over
    const timer2 = setTimeout(() => {
      setOrbPhase('dissolving');
    }, 380);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const triggerExit = useCallback(() => {
    if (completed) return;
    setCompleted(true);
    setIsFadingOut(true);
    onStartFadeOut?.();
    // Fast, crisp exit transition (380ms)
    setTimeout(() => {
      onComplete();
    }, 380);
  }, [completed, onComplete, onStartFadeOut]);

  // When the WebGL logo animation settles into the original logo
  const handleLogoFinish = useCallback(() => {
    setTimeout(() => {
      triggerExit();
    }, 80);
  }, [triggerExit]);

  // Safety fallback so the splash never lingers
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerExit();
    }, 1650);

    return () => clearTimeout(timer);
  }, [triggerExit]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#000000] select-none transition-all duration-350 ease-out ${
        isFadingOut ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Loading splash screen"
    >
      {/* Background ambient radial glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden" 
        aria-hidden="true"
      >
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(56, 189, 248, 0.08) 35%, transparent 70%)',
          }}
        />
      </div>

      {/* Main Logo Stage with Center Translucent White Droplet Orb */}
      <div className="relative z-10 w-full max-w-[420px] px-6 flex items-center justify-center">
        
        {/* 
          Translucent White Sphere/Droplet:
          Rapidly manifests in the center with a soft glowing glassy contour,
          from which the liquid glass logo breaks out and refracts.
        */}
        <div
          className={`absolute z-0 w-28 h-28 sm:w-36 sm:h-36 rounded-full pointer-events-none transition-all ${
            orbPhase === 'hidden'
              ? 'scale-0 opacity-0'
              : orbPhase === 'emerging'
              ? 'scale-100 opacity-90 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]'
              : 'scale-125 opacity-0 duration-500 ease-out'
          }`}
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.5) 45%, rgba(200, 225, 255, 0.2) 70%, transparent 100%)',
            boxShadow: '0 0 50px rgba(255, 255, 255, 0.45), inset 0 0 20px rgba(255, 255, 255, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(8px)',
          }}
          aria-hidden="true"
        />

        {/* Liquid Glass Logo WebGL Motion */}
        <div className="relative z-10 w-full h-[280px] sm:h-[340px] flex items-center justify-center overflow-hidden">
          <LiquidGlassLogo
            logo="/mrprog-logo.png"
            ending="logo"
            theme="light"
            background="#000000"
            logoColor="original"
            tileColor="#080c14"
            depth={2.9}
            speed={1.35}
            style={{ width: '100%', height: '100%' }}
            onFinish={handleLogoFinish}
          />
        </div>

      </div>
    </div>
  );
};
