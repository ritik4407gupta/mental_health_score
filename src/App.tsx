import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { StudentData, ApiStatus } from './types';
import { checkBackendHealth, predictMentalHealth } from './services/api';
import { Navbar } from './components/Navbar';
import { IntroSection } from './components/IntroSection';
import { PredictorForm } from './components/PredictorForm';
import { ResultView } from './components/ResultView';
import { BackgroundParticles } from './components/BackgroundParticles';
import { Footer } from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState<'intro' | 'predict' | 'results'>('intro');
  const [selectedData, setSelectedData] = useState<StudentData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    online: false,
    checking: true,
    message: 'Checking Render backend status...',
  });

  const [result, setResult] = useState<{
    score: number;
    data: StudentData;
    isFallback: boolean;
    message?: string;
  } | null>(null);

  const mainContainerRef = useRef<HTMLDivElement | null>(null);

  // Ping backend on app startup to wake up Render free tier cold start
  useEffect(() => {
    refreshApiHealth();
  }, []);

  const refreshApiHealth = async () => {
    setApiStatus((prev) => ({ ...prev, checking: true }));
    const status = await checkBackendHealth();
    setApiStatus(status);
  };

  // Switch view with smooth GSAP fade/slide animation
  const handleNavigateView = (newView: 'intro' | 'predict' | 'results', presetData?: StudentData) => {
    if (presetData) {
      setSelectedData(presetData);
    }

    if (mainContainerRef.current) {
      gsap.to(mainContainerRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        onComplete: () => {
          setCurrentView(newView);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          gsap.to(mainContainerRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
          });
        },
      });
    } else {
      setCurrentView(newView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle Form Submission
  const handleFormSubmit = async (data: StudentData) => {
    setIsLoading(true);
    const res = await predictMentalHealth(data);
    setIsLoading(false);

    setResult({
      score: res.score,
      data,
      isFallback: res.isFallback,
      message: res.message,
    });

    handleNavigateView('results');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col justify-between relative overflow-hidden">
      {/* Dynamic Animated Particles Canvas */}
      <BackgroundParticles />

      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={(v) => handleNavigateView(v)}
        apiStatus={apiStatus}
        onRefreshHealth={refreshApiHealth}
      />

      {/* Main View Container */}
      <main ref={mainContainerRef} className="flex-1 relative z-10">
        {currentView === 'intro' && (
          <IntroSection
            onStartPredict={(presetData) => handleNavigateView('predict', presetData)}
          />
        )}

        {currentView === 'predict' && (
          <PredictorForm
            initialData={selectedData}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            onCancel={() => handleNavigateView('intro')}
          />
        )}

        {currentView === 'results' && result && (
          <ResultView
            score={result.score}
            data={result.data}
            isFallback={result.isFallback}
            message={result.message}
            onRetest={() => handleNavigateView('predict')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
