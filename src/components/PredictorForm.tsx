import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Smartphone,
  Moon,
  Clock,
  Activity,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Sliders,
  AlertCircle,
  Brain,
  Globe,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import gsap from 'gsap';
import {
  StudentData,
  Gender,
  AcademicLevel,
  SocialPlatform,
  PurposeOfUse,
  StressLevel,
} from '../types';
import { ALL_COUNTRIES } from '../services/api';
import { PRESET_PROFILES } from '../data/presets';

interface PredictorFormProps {
  initialData?: StudentData;
  onSubmit: (data: StudentData) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const DEFAULT_FORM_DATA: StudentData = {
  age: 20,
  gender: 'Female',
  country: 'USA',
  academic_level: 'Undergraduate',
  most_used_platform: 'Instagram',
  purpose_of_use: 'Entertainment',
  avg_daily_usage_hours: 4.5,
  daily_unlocks: 65,
  study_hours: 4.0,
  physical_activity_hours: 1.0,
  sleep_hours_per_night: 7.0,
  stress_level: 'Medium',
};

const PLATFORMS: { name: SocialPlatform; color: string; label: string }[] = [
  { name: 'Instagram', color: 'from-purple-500 to-pink-500', label: 'Instagram' },
  { name: 'TikTok', color: 'from-pink-600 to-rose-500', label: 'TikTok' },
  { name: 'YouTube', color: 'from-red-600 to-red-500', label: 'YouTube' },
  { name: 'WhatsApp', color: 'from-emerald-600 to-green-500', label: 'WhatsApp' },
  { name: 'Snapchat', color: 'from-yellow-400 to-amber-500', label: 'Snapchat' },
  { name: 'LinkedIn', color: 'from-blue-600 to-cyan-600', label: 'LinkedIn' },
  { name: 'Twitter', color: 'from-sky-500 to-blue-500', label: 'Twitter / X' },
  { name: 'Facebook', color: 'from-blue-700 to-indigo-600', label: 'Facebook' },
  { name: 'WeChat', color: 'from-green-500 to-emerald-600', label: 'WeChat' },
  { name: 'LINE', color: 'from-green-400 to-emerald-500', label: 'LINE' },
  { name: 'KakaoTalk', color: 'from-amber-400 to-yellow-500', label: 'KakaoTalk' },
  { name: 'VKontakte', color: 'from-blue-500 to-indigo-500', label: 'VKontakte' },
];

export const PredictorForm: React.FC<PredictorFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [formData, setFormData] = useState<StudentData>(initialData || DEFAULT_FORM_DATA);
  const [activeStep, setActiveStep] = useState<number>(1);
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.form-step-card', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, formRef);
    return () => ctx.revert();
  }, [activeStep]);

  const updateField = <K extends keyof StudentData>(field: K, value: StudentData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuickPreset = (preset: StudentData) => {
    setFormData(preset);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div ref={formRef} className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Preset Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive ML Input Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Student Mental Health Predictor
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Fill in your daily habits to run the Machine Learning model.
          </p>
        </div>

        {/* Quick Load Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setFormData(DEFAULT_FORM_DATA)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 flex items-center space-x-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <div className="dropdown relative">
            <select
              onChange={(e) => {
                const p = PRESET_PROFILES.find((pr) => pr.id === e.target.value);
                if (p) handleQuickPreset(p.data);
              }}
              defaultValue=""
              className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="" disabled>
                Load Preset Profile...
              </option>
              {PRESET_PROFILES.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-8">
        {/* SECTION 1: PERSONAL & DEMOGRAPHICS */}
        <div className="form-step-card p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-6">
          <div className="flex items-center space-x-3 text-emerald-400">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">1. Personal & Demographics</h2>
              <p className="text-xs text-slate-400">Basic context used by model classification</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Age Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="text-slate-300 font-medium">Age</label>
                <span className="text-emerald-400 font-bold font-mono">{formData.age} yrs</span>
              </div>
              <input
                type="range"
                min={10}
                max={80}
                value={formData.age}
                onChange={(e) => updateField('age', parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Gender Select */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Female', 'Male'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateField('gender', g)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      formData.gender === g
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Level */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Academic Level</label>
              <select
                value={formData.academic_level}
                onChange={(e) => updateField('academic_level', e.target.value as AcademicLevel)}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
                <option value="High School">High School</option>
              </select>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Country</label>
              <select
                value={formData.country}
                onChange={(e) => updateField('country', e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {ALL_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: DIGITAL USAGE & SCREEN TIME */}
        <div className="form-step-card p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-6">
          <div className="flex items-center space-x-3 text-teal-400">
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">2. Screen Time & Digital Usage</h2>
              <p className="text-xs text-slate-400">Platform preferences, usage hours & unlock frequency</p>
            </div>
          </div>

          {/* Social Platform Selection */}
          <div className="space-y-3">
            <label className="text-xs text-slate-300 font-medium block">Most Used Social Media Platform</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {PLATFORMS.map((p) => {
                const isSelected = formData.most_used_platform === p.name;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => updateField('most_used_platform', p.name)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-2.5 ${
                      isSelected
                        ? 'bg-slate-800 border-teal-500 ring-1 ring-teal-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${p.color}`} />
                    <span className="text-xs font-semibold truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Purpose of use */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Primary Purpose of Use</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Entertainment', 'Education', 'Networking', 'News'] as PurposeOfUse[]).map((purp) => (
                  <button
                    key={purp}
                    type="button"
                    onClick={() => updateField('purpose_of_use', purp)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      formData.purpose_of_use === purp
                        ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {purp}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Usage Hours */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <label className="text-slate-300 font-medium">Daily Screen Time</label>
                <span className={`font-bold font-mono ${
                  formData.avg_daily_usage_hours > 5 ? 'text-rose-400' : 'text-teal-400'
                }`}>
                  {formData.avg_daily_usage_hours} hrs/day
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={16}
                step={0.5}
                value={formData.avg_daily_usage_hours}
                onChange={(e) => updateField('avg_daily_usage_hours', parseFloat(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Avg social media & leisure screen hours
              </p>
            </div>

            {/* Daily Phone Unlocks */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <label className="text-slate-300 font-medium">Daily Phone Unlocks</label>
                <span className="text-teal-400 font-bold font-mono">{formData.daily_unlocks} unlocks</span>
              </div>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={formData.daily_unlocks}
                onChange={(e) => updateField('daily_unlocks', parseInt(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Times phone screen is turned on per day
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: SLEEP, ACADEMICS & WELL-BEING */}
        <div className="form-step-card p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-6">
          <div className="flex items-center space-x-3 text-cyan-400">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">3. Sleep, Lifestyle & Stress</h2>
              <p className="text-xs text-slate-400">Sleep duration, study schedule, physical exercise & perceived stress</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sleep Hours per night */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-xs">
                <label className="text-slate-300 font-medium">Nightly Sleep</label>
                <span className={`font-bold font-mono ${
                  formData.sleep_hours_per_night < 6 ? 'text-amber-400' : 'text-cyan-400'
                }`}>
                  {formData.sleep_hours_per_night} hrs/night
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                step={0.5}
                value={formData.sleep_hours_per_night}
                onChange={(e) => updateField('sleep_hours_per_night', parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Optimal baseline: 7.0–9.0 hours</p>
            </div>

            {/* Study Hours */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-xs">
                <label className="text-slate-300 font-medium">Daily Study Hours</label>
                <span className="text-cyan-400 font-bold font-mono">{formData.study_hours} hrs/day</span>
              </div>
              <input
                type="range"
                min={0}
                max={14}
                step={0.5}
                value={formData.study_hours}
                onChange={(e) => updateField('study_hours', parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Classes, homework & research time</p>
            </div>

            {/* Physical Activity Hours */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-xs">
                <label className="text-slate-300 font-medium">Physical Exercise</label>
                <span className="text-cyan-400 font-bold font-mono">{formData.physical_activity_hours} hrs/day</span>
              </div>
              <input
                type="range"
                min={0}
                max={6}
                step={0.5}
                value={formData.physical_activity_hours}
                onChange={(e) => updateField('physical_activity_hours', parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Sports, gym, walking, cardio</p>
            </div>
          </div>

          {/* Stress Level selector */}
          <div className="space-y-3 pt-2">
            <label className="text-xs text-slate-300 font-medium block">Perceived Stress Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(
                [
                  { level: 'Low', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40' },
                  { level: 'Medium', color: 'border-teal-500/40 text-teal-400 bg-teal-950/40' },
                  { level: 'High', color: 'border-amber-500/40 text-amber-400 bg-amber-950/40' },
                  { level: 'Very High', color: 'border-rose-500/40 text-rose-400 bg-rose-950/40' },
                ] as const
              ).map((item) => (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => updateField('stress_level', item.level as StressLevel)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                    formData.stress_level === item.level
                      ? `${item.color} ring-2 ring-emerald-400/50 scale-[1.02]`
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.level} Stress
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-sm transition-all"
          >
            Back to Overview
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-base flex items-center justify-center space-x-3 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running Prediction Model...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Predict Mental Health Score</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
