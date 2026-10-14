import React from 'react';
import { useBrain } from '../../context/BrainContext.jsx';
import { useAppAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import {
  Search,
  Plus,
  Sparkles,
  Menu,
  Sun,
  Moon,
  Command,
  ShieldCheck,
  UserCheck,
  Info,
} from 'lucide-react';

export const Navbar = ({ openMobileSidebar }) => {
  const {
    searchQuery,
    setSearchQuery,
    openAddModal,
    openAskBrain,
    toggleCommandPalette,
    activeView,
    setActiveView,
  } = useBrain();

  const { isDemoMode, user, switchDemoRole } = useAppAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={openMobileSidebar}
          className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 lg:hidden rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar with Ctrl+K hook */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, summaries, notes, or tags... (Ctrl+K)"
            className="w-full pl-10 pr-20 py-2 bg-slate-100/70 dark:bg-slate-800/60 border border-transparent dark:border-slate-700/50 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-brand-500 transition-all"
          />
          <button
            onClick={toggleCommandPalette}
            className="hidden sm:flex items-center gap-1 absolute right-2.5 top-2 px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-400 border border-slate-200 dark:border-slate-600 text-[11px] font-mono shadow-xs hover:text-slate-600 dark:hover:text-slate-200"
            title="Open Command Palette"
          >
            <Command className="w-3 h-3" />
            <span>K</span>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Demo Mode Role Switcher Pill (if in demo mode) */}
        {isDemoMode && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Preview Mode:</span>
            <button
              onClick={() => switchDemoRole(user?.role === 'admin' ? 'user' : 'admin')}
              className="underline hover:text-amber-700 dark:hover:text-amber-300 ml-0.5"
            >
              Toggle {user?.role === 'admin' ? 'to User role' : 'to Admin role'}
            </button>
          </div>
        )}

        {/* Ask My Brain AI Button */}
        <button
          onClick={() => openAskBrain()}
          className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask My Brain</span>
        </button>

        {/* Quick Add Content Button */}
        <button
          onClick={() => openAddModal('note')}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
        >
          <Plus className="w-4 h-4 text-brand-500" />
          <span className="hidden md:inline">Capture</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
};
