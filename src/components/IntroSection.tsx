import React, { useEffect, useRef } from 'react';
import {
  Brain,
  Sparkles,
  ArrowRight,
  BarChart3,
  Smartphone,
  Moon,
  Activity,
  ShieldCheck,
  Zap,
  Globe,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import gsap from 'gsap';
import { PRESET_PROFILES } from '../data/presets';
import { StudentData } from '../types';

interface IntroSectionProps {
  onStartPredict: (presetData?: StudentData) => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onStartPredict }) => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const presetsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero elements entrance animation
      gsap.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
      });

      gsap.from('.hero-sub', {
        y: 25,
        opacity: 0,
        duration: 1.0,
        delay: 0.2,
        ease: 'power3.out',
      });

      gsap.from('.hero-cta', {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'back.out(1.7)',
      });

      // Feature cards stagger reveal
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.5,
          ease: 'power2.out',
        });
      }

      // Preset cards stagger reveal
      if (presetsRef.current) {
        gsap.from(presetsRef.current.children, {
          x: -30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          delay: 0.8,
          ease: 'power2.out',
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-20">
      {/* HERO BANNER SECTION */}
      <div className="text-center max-w-4xl mx-auto space-y-8">
        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium shadow-lg shadow-emerald-950/50 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
          <span>AI & Machine Learning Mental Health Model</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-slate-400 font-normal">Scored 0–10</span>
        </div>

        {/* Big Animated Title */}
        <h1
          ref={titleRef}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]"
        >
          Predict Your <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-sm">
            Mental Health Score
          </span>{' '}
          In Seconds
        </h1>

        {/* Subtitle */}
        <p className="hero-sub text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Uncover how your daily digital habits—screen time, phone unlocks, sleep patterns, study routine, and stress triggers—impact your mental well-being using trained ML algorithms.
        </p>

        {/* Call To Action Buttons */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onStartPredict()}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-lg flex items-center justify-center space-x-3 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all group cursor-pointer"
          >
            <Brain className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Start Mental Health Assessment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#presets"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-base flex items-center justify-center space-x-2 transition-all"
          >
            <Sliders className="w-5 h-5 text-emerald-400" />
            <span>Explore Sample Profiles</span>
          </a>
        </div>

        {/* Quick Highlights Bar */}
        <div className="hero-sub pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>12 Predictive Biomarkers</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>FastAPI Python Backend</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Instant Results & Tips</span>
          </span>
        </div>
      </div>

      {/* FEATURE METRIC CARDS (4 CARDS GRID) */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/30 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Digital Habits</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Analyzes daily usage hours across 12 platforms (TikTok, Instagram, YouTube) and phone unlock count.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-950/30 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
            <Moon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Sleep & Fitness</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evaluates nighttime sleep hours and physical activity against student stress thresholds.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-950/30 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Academic Pressure</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Correlates study hours and academic levels (High School, Undergrad, Grad) with burnout risks.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-950/30 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">ML Backend API</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Connects live to Python ML model hosted on Render for real-time predictions and score outputs.
          </p>
        </div>
      </div>

      {/* SAMPLE PROFILES SHOWCASE */}
      <div id="presets" className="space-y-8 pt-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Try A Sample Student Archetype
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Click any profile below to instantly load its parameters into the machine learning predictor.
          </p>
        </div>

        <div ref={presetsRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PRESET_PROFILES.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onStartPredict(preset.data)}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                    {preset.tag}
                  </span>
                  <span className="text-xs text-slate-500 group-hover:text-emerald-400 flex items-center space-x-1 transition-colors">
                    <span>Load & Run</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {preset.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  {preset.description}
                </p>
              </div>

              {/* Quick stats badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-xs">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Screen Time</span>
                  <span className="font-semibold text-slate-200">
                    {preset.data.avg_daily_usage_hours} hrs/day
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Sleep</span>
                  <span className="font-semibold text-slate-200">
                    {preset.data.sleep_hours_per_night} hrs/night
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Stress Level</span>
                  <span className="font-semibold text-amber-400">
                    {preset.data.stress_level}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS / ARCHITECTURE SECTION */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            <Globe className="w-4 h-4" />
            <span>Machine Learning Pipeline</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How The Prediction Model Works
          </h2>

          <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              The application sends your structured habit inputs to a FastAPI Python backend serving a serialized Machine Learning model (<code className="text-emerald-300 font-mono text-xs bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">Mental_Health_Model.pkl</code>).
            </p>
            <p>
              The model evaluates nonlinear interactions between high screen time, sleep deprivation, phone unlocks frequency, and self-reported stress levels to generate a standardized mental health score from <strong className="text-emerald-400">0.0 (Critical)</strong> to <strong className="text-emerald-400">10.0 (Optimal)</strong>.
            </p>
          </div>

          <div className="pt-4 flex items-center space-x-4">
            <button
              onClick={() => onStartPredict()}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Test My Mental Health Score</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
