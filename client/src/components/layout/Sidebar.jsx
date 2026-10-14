import React from 'react';
import { useBrain } from '../../context/BrainContext.jsx';
import { useAppAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import {
  Brain,
  Plus,
  Sparkles,
  Globe,
  FileText,
  StickyNote,
  Star,
  Pin,
  Shield,
  Layers,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  ChevronRight,
} from 'lucide-react';
import { YouTubeIcon } from '../common/YouTubeIcon.jsx';

export const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const {
    activeType,
    setActiveType,
    onlyFavorites,
    setOnlyFavorites,
    onlyPinned,
    setOnlyPinned,
    stats,
    openAddModal,
    openAskBrain,
    activeView,
    setActiveView,
  } = useBrain();

  const { user, logout, isDemoMode, switchDemoRole } = useAppAuth();
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = (action) => {
    action();
    if (closeMobileSidebar) closeMobileSidebar();
  };

  const navItems = [
    {
      id: 'all',
      label: 'All Vault Items',
      icon: <Layers className="w-4 h-4" />,
      count: stats.total || 0,
      active: activeView === 'vault' && activeType === 'all' && !onlyFavorites && !onlyPinned,
      onClick: () => {
        setActiveView('vault');
        setActiveType('all');
        setOnlyFavorites(false);
        setOnlyPinned(false);
      },
    },
    {
      id: 'youtube',
      label: 'YouTube Videos',
      icon: <YouTubeIcon className="w-4 h-4 text-red-500" />,
      count: stats.youtube || 0,
      active: activeView === 'vault' && activeType === 'youtube' && !onlyFavorites && !onlyPinned,
      onClick: () => {
        setActiveView('vault');
        setActiveType('youtube');
        setOnlyFavorites(false);
        setOnlyPinned(false);
      },
    },
    {
      id: 'url',
      label: 'Web Links',
      icon: <Globe className="w-4 h-4 text-sky-500" />,
      count: stats.url || 0,
      active: activeView === 'vault' && activeType === 'url' && !onlyFavorites && !onlyPinned,
      onClick: () => {
        setActiveView('vault');
        setActiveType('url');
        setOnlyFavorites(false);
        setOnlyPinned(false);
      },
    },
    {
      id: 'article',
      label: 'Articles & Reading',
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      count: stats.article || 0,
      active: activeView === 'vault' && activeType === 'article' && !onlyFavorites && !onlyPinned,
      onClick: () => {
        setActiveView('vault');
        setActiveType('article');
        setOnlyFavorites(false);
        setOnlyPinned(false);
      },
    },
    {
      id: 'note',
      label: 'Notes & Ideas',
      icon: <StickyNote className="w-4 h-4 text-amber-500" />,
      count: stats.note || 0,
      active: activeView === 'vault' && activeType === 'note' && !onlyFavorites && !onlyPinned,
      onClick: () => {
        setActiveView('vault');
        setActiveType('note');
        setOnlyFavorites(false);
        setOnlyPinned(false);
      },
    },
  ];

  const filterNavItems = [
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Star className="w-4 h-4 text-amber-400" />,
      count: stats.favorites || 0,
      active: activeView === 'vault' && onlyFavorites,
      onClick: () => {
        setActiveView('vault');
        setOnlyFavorites(true);
        setOnlyPinned(false);
      },
    },
    {
      id: 'pinned',
      label: 'Pinned to Top',
      icon: <Pin className="w-4 h-4 text-brand-500" />,
      count: stats.pinned || 0,
      active: activeView === 'vault' && onlyPinned,
      onClick: () => {
        setActiveView('vault');
        setOnlyPinned(true);
        setOnlyFavorites(false);
      },
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="p-5 flex flex-col gap-5 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('vault')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Second Brain</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider text-brand-600 dark:text-brand-400 uppercase">
                Digital Knowledge Vault
              </span>
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => handleNavClick(() => openAddModal('note'))}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Capture New Item</span>
          </button>

          {/* Primary Vault Navigation */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Knowledge Vault
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.onClick)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  item.active
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    item.active
                      ? 'bg-brand-500/20 text-brand-700 dark:text-brand-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          {/* Highlights & Organization */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Highlights
            </div>
            {filterNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.onClick)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  item.active
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{item.count}</span>
              </button>
            ))}
          </div>

          {/* AI Features */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              AI Intelligence
            </div>
            <button
              onClick={() => handleNavClick(() => openAskBrain())}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-brand-700 dark:text-brand-300 bg-gradient-to-r from-brand-50 to-indigo-50/70 dark:from-brand-950/50 dark:to-indigo-950/30 border border-brand-200/60 dark:border-brand-800/50 hover:border-brand-400 transition-all shadow-xs group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500 group-hover:rotate-12 transition-transform" />
                <span>Ask My Brain</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-brand-400" />
            </button>
          </div>

          {/* Admin Section (Visible if user has admin role) */}
          {user?.role === 'admin' && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Administration
              </div>
              <button
                onClick={() => handleNavClick(() => setActiveView('admin'))}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeView === 'admin'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-indigo-500" />
                  <span>Admin Dashboard</span>
                </div>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600">
                  RBAC
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || 'Guest User'}
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase ${
                      user?.role === 'admin'
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {user?.role || 'User'}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Controls: Dark/Light Mode & Logout */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-brand-500" />
                  <span>Dark</span>
                </>
              )}
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
              title="Log out of session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
