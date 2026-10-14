import React from 'react';
import { useBrain } from '../../context/BrainContext.jsx';
import {
  Sparkles,
  Globe,
  FileText,
  StickyNote,
  Star,
  Pin,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Tag,
} from 'lucide-react';
import { YouTubeIcon } from '../common/YouTubeIcon.jsx';

export const FilterBar = () => {
  const {
    activeType,
    setActiveType,
    selectedTag,
    setSelectedTag,
    onlyFavorites,
    setOnlyFavorites,
    onlyPinned,
    setOnlyPinned,
    sortBy,
    setSortBy,
    viewMode,
    changeViewMode,
    stats,
    userTags,
  } = useBrain();

  const typeTabs = [
    { id: 'all', label: 'All Items', icon: null, count: stats.total || 0 },
    { id: 'youtube', label: 'YouTube', icon: <YouTubeIcon className="w-4 h-4 text-red-500" />, count: stats.youtube || 0 },
    { id: 'url', label: 'Links', icon: <Globe className="w-4 h-4 text-sky-500" />, count: stats.url || 0 },
    { id: 'article', label: 'Articles', icon: <FileText className="w-4 h-4 text-emerald-500" />, count: stats.article || 0 },
    { id: 'note', label: 'Notes', icon: <StickyNote className="w-4 h-4 text-amber-500" />, count: stats.note || 0 },
  ];

  return (
    <div className="flex flex-col gap-3.5 mb-6">
      {/* Type Tabs Row */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          {typeTabs.map((tab) => {
            const isActive = activeType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveType(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300'
                      : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Controls & Sort */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Favorite filter pill */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              onlyFavorites
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400' : ''}`} />
            <span className="hidden sm:inline">Favorites</span>
          </button>

          {/* Pinned filter pill */}
          <button
            onClick={() => setOnlyPinned(!onlyPinned)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              onlyPinned
                ? 'bg-brand-500/10 border-brand-500/30 text-brand-600 dark:text-brand-400'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Pin className={`w-3.5 h-3.5 ${onlyPinned ? 'fill-brand-400' : ''}`} />
            <span className="hidden sm:inline">Pinned</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer appearance-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="updated">Recently Updated</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Grid vs List Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
            <button
              onClick={() => changeViewMode('grid')}
              className={`p-1 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => changeViewMode('list')}
              className={`p-1 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tags Bar (if user has tags) */}
      {userTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0 mr-1 font-medium">
            <Tag className="w-3 h-3" />
            <span>Tags:</span>
          </span>

          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-medium shrink-0 hover:bg-rose-500/20 transition-colors"
            >
              <span>Clear #{selectedTag}</span>
              <X className="w-3 h-3" />
            </button>
          )}

          {userTags.slice(0, 10).map(({ tag, count }) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-xs font-medium transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-brand-500/40 hover:text-brand-600 dark:hover:text-brand-300'
                }`}
              >
                <span>#{tag}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
