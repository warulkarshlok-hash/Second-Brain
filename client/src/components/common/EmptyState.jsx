import React from 'react';
import { useBrain } from '../../context/BrainContext.jsx';
import { Sparkles, Plus, FolderSearch, Globe, FileText, StickyNote } from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon.jsx';

export const EmptyState = ({ type = 'all', isSearching = false }) => {
  const { openAddModal, openAskBrain, setSearchQuery, setActiveType, setSelectedTag } = useBrain();

  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/50 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 shadow-sm">
          <FolderSearch className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No matching knowledge found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          We couldn't find any saved items matching your criteria. Try adjusting your search keywords or clearing active filters.
        </p>
        <button
          onClick={() => {
            setSearchQuery('');
            setActiveType('all');
            setSelectedTag(null);
          }}
          className="px-4 py-2 text-sm font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 hover:bg-brand-100 dark:hover:bg-brand-900/50 rounded-xl transition-colors border border-brand-200 dark:border-brand-800"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  const typeConfig = {
    all: {
      title: 'Your Second Brain is ready for knowledge',
      desc: 'Capture YouTube videos, website links, in-depth articles, and your personal ideas in one central vault.',
      actionType: 'note',
    },
    youtube: {
      title: 'No YouTube videos saved yet',
      desc: 'Bookmark educational videos, lectures, and tutorials with instant thumbnail previews and AI summaries.',
      actionType: 'youtube',
    },
    url: {
      title: 'No website links bookmarked',
      desc: 'Save documentation, web apps, repositories, and articles with automatic domain icons.',
      actionType: 'url',
    },
    article: {
      title: 'No reading articles in your library',
      desc: 'Save long-form essays and industry deep-dives to read in clean distraction-free reader mode.',
      actionType: 'article',
    },
    note: {
      title: 'No notes or thoughts captured',
      desc: 'Quick-capture brainstorms, meeting takeaways, and roadmap ideas with markdown support.',
      actionType: 'note',
    },
  };

  const config = typeConfig[type] || typeConfig.all;

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-lg mx-auto">
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/20">
          <Sparkles className="w-10 h-10 animate-pulse" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2.5 tracking-tight">
        {config.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-sm">
        {config.desc}
      </p>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => openAddModal(config.actionType)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {config.actionType === 'all' ? 'Item' : config.actionType.toUpperCase()}</span>
        </button>

        <button
          onClick={() => openAskBrain()}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-xl transition-all"
        >
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>Ask My Brain AI</span>
        </button>
      </div>

      {/* Quick Type Selection Pills */}
      <div className="grid grid-cols-4 gap-2 mt-8 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 w-full">
        <button
          onClick={() => openAddModal('youtube')}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
        >
          <YouTubeIcon className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">YouTube</span>
        </button>
        <button
          onClick={() => openAddModal('url')}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
        >
          <Globe className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Link</span>
        </button>
        <button
          onClick={() => openAddModal('article')}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
        >
          <FileText className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Article</span>
        </button>
        <button
          onClick={() => openAddModal('note')}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
        >
          <StickyNote className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Note</span>
        </button>
      </div>
    </div>
  );
};
