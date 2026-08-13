import React, { useEffect, useRef, useState } from 'react';
import {
  Brain,
  Sparkles,
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Moon,
  Smartphone,
  Activity,
  Award,
  Zap,
  Sliders,
  RefreshCw,
  Copy,
  Check,
  FileDown,
} from 'lucide-react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { StudentData } from '../types';
import { calculateLocalMLScore } from '../services/api';
import { generateMentalHealthPDF } from '../utils/pdfGenerator';

interface ResultViewProps {
  score: number;
  data: StudentData;
  isFallback: boolean;
  message?: string;
  onRetest: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  score: initialScore,
  data: initialData,
  isFallback,
  message,
  onRetest,
}) => {
  // Normalize initial score if needed
  const normalizedInitialScore = initialScore > 10 ? initialScore / 10 : initialScore;
  const [currentData, setCurrentData] = useState<StudentData>(initialData);
  const [simulatedScore, setSimulatedScore] = useState<number>(normalizedInitialScore);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scoreDisplayRef = useRef<HTMLSpanElement | null>(null);

  // Trigger confetti if high score
  useEffect(() => {
    if (normalizedInitialScore >= 7.5) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#3b82f6'],
      });
    }
  }, [normalizedInitialScore]);

  // GSAP Number Counter animation
  useEffect(() => {
    const obj = { value: 0 };
    if (scoreDisplayRef.current) {
      gsap.to(obj, {
        value: simulatedScore,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          if (scoreDisplayRef.current) {
            scoreDisplayRef.current.innerText = obj.value.toFixed(1);
          }
        },
      });
    }
  }, [simulatedScore]);

  // Re-calculate simulation score when user adjusts sliders in What-If simulator
  const handleSimulationChange = (field: keyof StudentData, value: number) => {
    const updated = { ...currentData, [field]: value };
    setCurrentData(updated);
    const newScore = calculateLocalMLScore(updated);
    setSimulatedScore(newScore);
  };

  const getScoreBadge = (val: number) => {
    if (val >= 8.0) {
      return {
        label: 'Optimal Mental Well-Being',
        color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50',
        ring: 'stroke-emerald-400',
        gradient: 'from-emerald-500 to-teal-400',
        desc: 'Great balance between digital habits, rest, and low stress.',
      };
    } else if (val >= 6.5) {
      return {
        label: 'Moderate Balance',
        color: 'text-teal-300 bg-teal-950/80 border-teal-500/50',
        ring: 'stroke-teal-400',
        gradient: 'from-teal-400 to-cyan-400',
        desc: 'Healthy overall, but minor tweaks to sleep or screen time could boost score.',
      };
    } else if (val >= 4.8) {
      return {
        label: 'Elevated Fatigue Risk',
        color: 'text-amber-300 bg-amber-950/80 border-amber-500/50',
        ring: 'stroke-amber-400',
        gradient: 'from-amber-400 to-orange-400',
        desc: 'High digital unlocks or sleep deficits are straining daily resilience.',
      };
    } else {
      return {
        label: 'High Burnout / Stress Level',
        color: 'text-rose-400 bg-rose-950/80 border-rose-500/50',
        ring: 'stroke-rose-500',
        gradient: 'from-rose-500 to-red-600',
        desc: 'Urgent need for sleep recovery, reduced screen time, and stress management.',
      };
    }
  };

  const badge = getScoreBadge(simulatedScore);

  const handleCopySummary = () => {
    const summaryText = `🧠 MindScore Mental Health Prediction
Score: ${simulatedScore.toFixed(1)} / 10 (${badge.label})
Country: ${currentData.country} | Age: ${currentData.age}
Sleep: ${currentData.sleep_hours_per_night}h | Screen Time: ${currentData.avg_daily_usage_hours}h | Stress: ${currentData.stress_level}
Evaluated via Python ML Model & MindScore Analytics.`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Generate dynamic personalized recommendations
  const getRecommendations = () => {
    const tips = [];
    if (currentData.sleep_hours_per_night < 7) {
      tips.push({
        title: 'Sleep Debt Recovery',
        text: `Targeting 7.5–8.5 hours of sleep nightly can boost your score by up to +1.2 points.`,
        icon: Moon,
        color: 'text-cyan-400',
      });
    }
    if (currentData.avg_daily_usage_hours > 4) {
      tips.push({
        title: 'Reduce Screen Fatigue',
        text: `Reducing daily social media screen time below 3.5 hours directly lowers cortisol and screen-induced stress.`,
        icon: Smartphone,
        color: 'text-teal-400',
      });
    }
    if (currentData.daily_unlocks > 70) {
      tips.push({
        title: 'Limit Unconscious Unlocks',
        text: `You unlock your phone ~${currentData.daily_unlocks} times/day. Try turning off non-essential notifications.`,
        icon: Zap,
        color: 'text-amber-400',
      });
    }
    if (currentData.physical_activity_hours < 1) {
      tips.push({
        title: 'Incorporate 30 Min Exercise',
        text: `Adding 30–45 minutes of daily physical exercise enhances neuroplasticity and mental resilience.`,
        icon: Activity,
        color: 'text-emerald-400',
      });
    }
    if (tips.length === 0) {
      tips.push({
        title: 'Maintain Stellar Balance',
        text: 'Your current habits align with optimal student well-being baseline parameters.',
        icon: Sparkles,
        color: 'text-emerald-400',
      });
    }
    return tips;
  };

  const tips = getRecommendations();

  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);
    try {
      generateMentalHealthPDF(
        simulatedScore,
        currentData,
        badge.label,
        tips.map((t) => ({ title: t.title, text: t.text }))
      );
    } catch (err) {
      console.error('Error generating PDF report:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Top Banner & Retest */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onRetest}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center space-x-2 text-xs font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Assessment</span>
        </button>

        {/* Server or Fallback Notice */}
        {isFallback && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{message || 'Evaluated via Client Machine Learning Estimator Model'}</span>
          </div>
        )}
      </div>

      {/* SCORE DISPLAY CARD */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl relative overflow-hidden shadow-2xl space-y-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-4 max-w-xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full inline-block">
            Predicted Mental Health Score (0–10 Scale)
          </span>

          {/* Animated Gauge Number */}
          <div className="relative inline-flex items-center justify-center my-4">
            <svg className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="80"
                className="stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r="80"
                className={`transition-all duration-1000 ${badge.ring}`}
                strokeWidth="12"
                strokeDasharray={502}
                strokeDashoffset={502 - (502 * Math.min(simulatedScore, 10)) / 10}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                ref={scoreDisplayRef}
                className={`text-5xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${badge.gradient}`}
              >
                {simulatedScore.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-slate-400 mt-1">out of 10</span>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="space-y-2">
            <div
              className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${badge.color}`}
            >
              {badge.label}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              {badge.desc}
            </p>
          </div>
        </div>

        {/* Quick summary metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Sleep Hours</span>
            <span className="font-bold text-white text-sm">{currentData.sleep_hours_per_night} hrs</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Screen Usage</span>
            <span className="font-bold text-white text-sm">{currentData.avg_daily_usage_hours} hrs</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Phone Unlocks</span>
            <span className="font-bold text-white text-sm">{currentData.daily_unlocks} /day</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Stress Tier</span>
            <span className="font-bold text-amber-400 text-sm">{currentData.stress_level}</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE WHAT-IF SIMULATOR */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center space-x-3 text-teal-400">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Interactive "What-If" Habit Simulator</h3>
            <p className="text-xs text-slate-400">
              Adjust sliders to see how habit changes immediately recalculate your predicted mental health score
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Sleep Slider */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Nightly Sleep Duration</span>
              <span className="text-cyan-400 font-bold font-mono">
                {currentData.sleep_hours_per_night} hrs
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={11}
              step={0.5}
              value={currentData.sleep_hours_per_night}
              onChange={(e) =>
                handleSimulationChange('sleep_hours_per_night', parseFloat(e.target.value))
              }
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Screen time slider */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Daily Social Screen Time</span>
              <span className="text-teal-400 font-bold font-mono">
                {currentData.avg_daily_usage_hours} hrs
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={12}
              step={0.5}
              value={currentData.avg_daily_usage_hours}
              onChange={(e) =>
                handleSimulationChange('avg_daily_usage_hours', parseFloat(e.target.value))
              }
              className="w-full accent-teal-500 cursor-pointer"
            />
          </div>

          {/* Physical Activity Slider */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Physical Exercise</span>
              <span className="text-emerald-400 font-bold font-mono">
                {currentData.physical_activity_hours} hrs
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={currentData.physical_activity_hours}
              onChange={(e) =>
                handleSimulationChange('physical_activity_hours', parseFloat(e.target.value))
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Unlocks slider */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Daily Unlocks</span>
              <span className="text-amber-400 font-bold font-mono">
                {currentData.daily_unlocks}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={180}
              step={5}
              value={currentData.daily_unlocks}
              onChange={(e) =>
                handleSimulationChange('daily_unlocks', parseInt(e.target.value))
              }
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* AI RECOMMENDATION TIPS */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>Personalized Actionable Recommendations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((t, idx) => {
            const IconComp = t.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start space-x-4"
              >
                <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${t.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{t.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{t.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
        <button
          onClick={onRetest}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Test Another Profile</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleCopySummary}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2.5 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
          >
            <FileDown className="w-5 h-5" />
            <span>{isGeneratingPDF ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
