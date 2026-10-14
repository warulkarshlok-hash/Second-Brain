import React, { useState } from 'react';
import { useBrain } from '../../context/BrainContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import {
  Search,
  Plus,
  Sparkles,
  Sun,
  Moon,
  Shield,
  Globe,
  FileText,
  StickyNote,
  X,
  CornerDownLeft,
} from 'lucide-react';
import { YouTubeIcon } from '../common/YouTubeIcon.jsx';

export const CommandPalette = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    contents,
    openAddModal,
    openDetailModal,
    openAskBrain,
    setActiveView,
  } = useBrain();

  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isCommandPaletteOpen) return null;

  const handleClose = () => {
    setIsCommandPaletteOpen(false);
    setSearchTerm('');
  };

  const filteredContents = searchTerm.trim()
    ? contents.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 5)
    : [];

  const actions = [
    {
      label: 'Ask My Brain AI Assistant',
      desc: 'Ask questions synthesized from your saved vault',
      icon: <Sparkles className="w-4 h-4 text-brand-500" />,
      perform: () => {
        handleClose();
        openAskBrain();
      },
    },
    {
      label: 'New Note',
      desc: 'Quick capture an idea or thought',
      icon: <StickyNote className="w-4 h-4 text-amber-500" />,
      perform: () => {
        handleClose();
        openAddModal('note');
      },
    },
    {
      label: 'Add YouTube Video',
      desc: 'Save video with thumbnail & AI summary',
      icon: <YouTubeIcon className="w-4 h-4 text-red-500" />,
      perform: () => {
        handleClose();
        openAddModal('youtube');
      },
    },
    {
      label: 'Save Web Link',
      desc: 'Bookmark an article, documentation or URL',
      icon: <Globe className="w-4 h-4 text-sky-500" />,
      perform: () => {
        handleClose();
        openAddModal('url');
      },
    },
    {
      label: 'Save Article Reader',
      desc: 'Distraction-free article saving',
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      perform: () => {
        handleClose();
        openAddModal('article');
      },
    },
    {
      label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      desc: 'Toggle application color scheme',
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-brand-500" />,
      perform: () => {
        toggleTheme();
        handleClose();
      },
    },
    {
      label: 'Open Admin Dashboard',
      desc: 'System health, users, and audit logs',
      icon: <Shield className="w-4 h-4 text-indigo-500" />,
      perform: () => {
        setActiveView('admin');
        handleClose();
      },
    },
  ];

  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh] bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200/80 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type a command, action, or search saved items..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">
            ESC
          </span>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {/* Matched Content Items */}
          {filteredContents.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Saved Items
              </div>
              {filteredContents.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    handleClose();
                    openDetailModal(item);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-600 font-semibold uppercase">
                      {item.type}
                    </span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {item.title}
                    </span>
                  </div>
                  <CornerDownLeft className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Actions
          </div>
          {filteredActions.map((action, i) => (
            <div
              key={i}
              onClick={action.perform}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {action.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {action.label}
                  </p>
                  <p className="text-xs text-slate-400">{action.desc}</p>
                </div>
              </div>
              <CornerDownLeft className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}

          {filteredActions.length === 0 && filteredContents.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No actions or items match your search.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <span>Navigate with mouse or keyboard</span>
          <span className="flex items-center gap-1 font-mono">
            <span>Second Brain Palette</span>
          </span>
        </div>
      </div>
    </div>
  );
};
