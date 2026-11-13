import { useState, useCallback } from 'react';
import { DEFAULT_GLASS_STEPS, computeConfigFromSteps } from './types';
import { HomePage } from './pages/HomePage';
import { SplashScreen } from './components/splash/SplashScreen';
import { InteractiveGlassSandbox } from './components/generator/InteractiveGlassSandbox';

export function App() {
  const isBypass = typeof window !== 'undefined' && (new URLSearchParams(window.location.search).get('showcase') === 'true' || new URLSearchParams(window.location.search).get('clean') === 'true');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const [splashVisible, setSplashVisible] = useState(!isBypass);
  const [pageLoaded, setPageLoaded] = useState(isBypass);
  const [steps, setSteps] = useState(() => (
    isMobile
      ? { ...DEFAULT_GLASS_STEPS, widthStep: 2, heightStep: 1 }
      : DEFAULT_GLASS_STEPS
  ));
  const config = computeConfigFromSteps(steps);

  const handleChangeSteps = (updates: Partial<typeof DEFAULT_GLASS_STEPS>) => {
    setSteps((prev) => ({ ...prev, ...updates }));
  };

  const handleResetSteps = () => {
    const isNowMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    setSteps(
      isNowMobile
        ? { ...DEFAULT_GLASS_STEPS, widthStep: 2, heightStep: 1 }
        : DEFAULT_GLASS_STEPS
    );
  };

  const handleStartFadeOut = useCallback(() => {
    setPageLoaded(true);
  }, []);

  const handleSplashComplete = useCallback(() => {
    setSplashVisible(false);
    setPageLoaded(true);
  }, []);

  if (isBypass) {
    return (
      <div className="relative min-h-screen w-full bg-[#05060a] overflow-hidden">
        <InteractiveGlassSandbox
          config={config}
          onChangeSteps={handleChangeSteps}
          onResetSteps={handleResetSteps}
        />
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen w-full bg-[#020204] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30"
      data-theme="dark"
    >
      {/* Real Splash Screen with Liquid Glass Logo Motion */}
      {splashVisible && (
        <SplashScreen 
          onStartFadeOut={handleStartFadeOut}
          onComplete={handleSplashComplete} 
        />
      )}

      {/* Main Experience */}
      <HomePage 
        config={config}
        onChangeSteps={handleChangeSteps}
        onResetSteps={handleResetSteps}
        isLoaded={pageLoaded}
      />
    </div>
  );
}

export default App;
