import React from 'react';
import { Brain, Heart, ExternalLink, Github, Sparkles } from 'lucide-react';
import { BACKEND_URL } from '../services/api';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand info */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base">
                Mind<span className="text-emerald-400">Score</span> AI
              </span>
              <p className="text-xs text-slate-400">
                Machine Learning Mental Health Prediction Engine
              </p>
            </div>
          </div>

          {/* Links & API URL */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <a
              href={BACKEND_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 flex items-center space-x-1 transition-colors bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
            >
              <span>Render FastAPI Endpoint</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400">FastAPI + Scikit-Learn Model</span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400">GSAP Animations</span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MindScore AI. Built for student mental health awareness.</p>
          <div className="flex items-center space-x-1 text-slate-500">
            <span>Powered by</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>& AI Analytics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
