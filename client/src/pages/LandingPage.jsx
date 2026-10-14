import React from 'react';
import { useAppAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  Brain,
  Sparkles,
  Globe,
  FileText,
  StickyNote,
  Shield,
  ArrowRight,
  Sun,
  Moon,
  Lock,
  Cpu,
  Search,
  CheckCircle,
} from 'lucide-react';
import { YouTubeIcon } from '../components/common/YouTubeIcon.jsx';

export const LandingPage = () => {
  const { loginWithRedirect, isDemoMode, hasAuth0Credentials } = useAppAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-brand-500/20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
            <Brain className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            Second Brain
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <button
            onClick={loginWithRedirect}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            <span>Sign In with Auth0</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        {/* Modern Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 text-xs font-semibold text-brand-700 dark:text-brand-300 mb-6 shadow-xs animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Powered by Google Gemini & Auth0 Enterprise Security</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.1] mb-6">
          Your Personal Digital Vault,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-500 to-sky-500">
            Supercharged by AI
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-10">
          Save, organize, search, and retrieve YouTube videos, articles, website links, and ideas. Ask your Second Brain questions and receive synthesized answers directly from your personal knowledge.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-16 w-full sm:w-auto">
          <button
            onClick={loginWithRedirect}
            className="w-full sm:w-auto px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
          >
            <Lock className="w-4 h-4" />
            <span>Continue with Auth0 (Google / Email)</span>
          </button>

          <button
            onClick={loginWithRedirect}
            className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Demo Vault</span>
            <ArrowRight className="w-4 h-4 text-brand-500" />
          </button>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-left w-full mb-16">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4">
              <YouTubeIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              YouTube Embeds & Previews
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Automatic video ID extraction, high-res thumbnail previews, and distraction-free playback in modal.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Article & Note Reader
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Markdown-rendered clean reading mode, word counts, and estimated reading times.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-600 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              "Ask My Brain" Gemini RAG
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Conversational QA grounded exclusively in your saved items with transparent citations.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Admin & Strong Security
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Per-user strict isolation, role-based admin dashboard, user management, and activity audit trail.
            </p>
          </div>
        </div>

        {/* Live Environment Notice */}
        <div className="w-full max-w-2xl p-5 bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-left text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Ready for Production Configuration</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Configure your actual credentials in <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[11px]">client/.env</code> and <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[11px]">server/.env</code>. The templates with placeholders have been created for you in <code className="font-mono text-[11px]">.env.example</code>.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-6 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>Second Brain • Built with React, Vite, Tailwind CSS, Express, MongoDB, Auth0 & Google Gemini</p>
      </footer>
    </div>
  );
};
