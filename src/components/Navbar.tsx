import React from 'react';
import { Brain, Server, Sparkles, ExternalLink, Activity } from 'lucide-react';
import { ApiStatus } from '../types';
import { BACKEND_URL } from '../services/api';

interface NavbarProps {
  currentView: 'intro' | 'predict' | 'results';
  setCurrentView: (view: 'intro' | 'predict' | 'results') => void;
  apiStatus: ApiStatus;
  onRefreshHealth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  apiStatus,
  onRefreshHealth,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/70 border-b border-emerald-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('intro')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg text-white tracking-tight">
                Mind<span className="text-emerald-400">Score</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 font-mono border border-emerald-800/40">
                ML v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Student Mental Health Predictor
            </p>
          </div>
        </div>

        {/* Server API Health & Mode Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Render Backend Status Badge */}
          <button
            onClick={onRefreshHealth}
            title={`API Endpoint: ${BACKEND_URL}`}
            className={`hidden md:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full border transition-all ${
              apiStatus.online
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                : apiStatus.checking
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-slate-900/60 border-slate-700/50 text-slate-300 hover:border-emerald-500/30'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span className="font-medium">
              {apiStatus.checking
                ? 'Pinging Render ML...'
                : apiStatus.online
                ? 'Render API Online'
                : 'Render Standby (Auto-Sync)'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                apiStatus.online
                  ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                  : apiStatus.checking
                  ? 'bg-amber-400'
                  : 'bg-slate-500'
              }`}
            />
          </button>

          {/* Navigation Buttons */}
          <nav className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            <button
              onClick={() => setCurrentView('intro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'intro'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('predict')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                currentView === 'predict' || currentView === 'results'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Predict Mode</span>
            </button>
          </nav>

          {/* Direct API link */}
          <a
            href={BACKEND_URL}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800 transition-colors hidden lg:flex items-center"
            title="Open Render Backend Documentation / Root Endpoint"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
