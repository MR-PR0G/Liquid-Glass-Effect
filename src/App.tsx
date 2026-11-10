import { useState, useCallback } from 'react';
import { DEFAULT_GLASS_STEPS, computeConfigFromSteps } from './types';
import { HomePage } from './pages/HomePage';
import { SplashScreen } from './components/splash/SplashScreen';

export function App() {
  const [splashVisible, setSplashVisible] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [steps, setSteps] = useState(DEFAULT_GLASS_STEPS);
  const config = computeConfigFromSteps(steps);

  const handleChangeSteps = (updates: Partial<typeof DEFAULT_GLASS_STEPS>) => {
    setSteps((prev) => ({ ...prev, ...updates }));
  };

  const handleResetSteps = () => {
    setSteps(DEFAULT_GLASS_STEPS);
  };

  const handleStartFadeOut = useCallback(() => {
    setPageLoaded(true);
  }, []);

  const handleSplashComplete = useCallback(() => {
    setSplashVisible(false);
    setPageLoaded(true);
  }, []);

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
