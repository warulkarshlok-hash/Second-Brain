import React from 'react';
import { useBrain } from '../../context/BrainContext.jsx';
import {
  Globe,
  FileText,
  StickyNote,
  Star,
  Pin,
  ExternalLink,
  MoreVertical,
  Edit2,
  Trash2,
  Sparkles,
  Clock,
  Play,
} from 'lucide-react';
import { YouTubeIcon } from '../common/YouTubeIcon.jsx';

export const ContentCard = ({ item, isList = false }) => {
  const {
    openDetailModal,
    openEditModal,
    setDeleteTargetItem,
    toggleFavorite,
    togglePin,
    setSelectedTag,
  } = useBrain();

  const [menuOpen, setMenuOpen] = React.useState(false);

  const typeConfig = {
    youtube: {
      label: 'YouTube',
      icon: <YouTubeIcon className="w-3.5 h-3.5 text-red-500" />,
      badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    },
    url: {
      label: 'Website',
      icon: <Globe className="w-3.5 h-3.5 text-sky-500" />,
      badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    },
    article: {
      label: 'Article',
      icon: <FileText className="w-3.5 h-3.5 text-emerald-500" />,
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    note: {
      label: 'Note',
      icon: <StickyNote className="w-3.5 h-3.5 text-amber-500" />,
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
  };

  const currentType = typeConfig[item.type] || typeConfig.note;

  // Format date
  const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  if (isList) {
    return (
      <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 transition-all duration-200 hover:shadow-lg hover:border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Thumbnail / Type Icon preview */}
          {item.type === 'youtube' && item.thumbnailUrl ? (
            <div
              onClick={() => openDetailModal(item)}
              className="relative w-28 h-18 sm:w-32 sm:h-20 rounded-xl overflow-hidden shrink-0 cursor-pointer bg-slate-900 group-hover:brightness-105 transition-all shadow-sm"
            >
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
          ) : (
            <div
              onClick={() => openDetailModal(item)}
              className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center shrink-0 cursor-pointer text-slate-600 dark:text-slate-300 group-hover:border-brand-500/40"
            >
              {currentType.icon}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${currentType.badge}`}
              >
                {currentType.icon}
                <span>{currentType.label}</span>
              </span>
              {item.isPinned && (
                <span className="inline-flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                  <Pin className="w-3 h-3 fill-amber-500" />
                  <span>Pinned</span>
                </span>
              )}
              {item.summary && (
                <span className="inline-flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 font-medium bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded border border-brand-200/60 dark:border-brand-800/50">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>AI Summarized</span>
                </span>
              )}
            </div>

            <h3
              onClick={() => openDetailModal(item)}
              className="text-base font-semibold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer truncate transition-colors"
            >
              {item.title}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {item.summary || item.description || item.content || 'No description provided.'}
            </p>

            {/* Tags */}
            {item.tags?.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {item.tags.slice(0, 4).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <span className="text-xs text-slate-400 dark:text-slate-500 hidden md:inline">
            {formattedDate}
          </span>

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Open external link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={() => togglePin(item._id)}
            className={`p-1.5 rounded-lg transition-colors ${
              item.isPinned
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={item.isPinned ? 'Unpin' : 'Pin to top'}
          >
            <Pin className={`w-4 h-4 ${item.isPinned ? 'fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={() => toggleFavorite(item._id)}
            className={`p-1.5 rounded-lg transition-colors ${
              item.isFavorite
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={item.isFavorite ? 'Remove favorite' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => openEditModal(item)}
            className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit item"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDeleteTargetItem(item)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Grid Card View
  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-brand-500/30 flex flex-col">
      {/* YouTube Thumbnail Preview */}
      {item.type === 'youtube' && item.thumbnailUrl && (
        <div
          onClick={() => openDetailModal(item)}
          className="relative w-full h-44 overflow-hidden bg-slate-950 cursor-pointer group/thumb"
        >
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </div>
          {item.readingTimeMinutes && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[11px] font-medium text-white flex items-center gap-1 backdrop-blur-sm">
              <Clock className="w-3 h-3" />
              <span>{item.readingTimeMinutes} min watch</span>
            </div>
          )}
        </div>
      )}

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Top bar: Type badge & quick controls */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${currentType.badge}`}
            >
              {currentType.icon}
              <span>{currentType.label}</span>
            </span>

            {item.isPinned && (
              <span className="p-1 rounded-md text-amber-500 bg-amber-50 dark:bg-amber-950/40" title="Pinned">
                <Pin className="w-3.5 h-3.5 fill-amber-500" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleFavorite(item._id)}
              className={`p-1.5 rounded-lg transition-colors ${
                item.isFavorite
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={item.isFavorite ? 'Remove favorite' : 'Add to favorites'}
            >
              <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Overflow Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-8 z-30 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 text-xs font-medium animate-slide-up">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        togglePin(item._id);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-left"
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>{item.isPinned ? 'Unpin' : 'Pin to top'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        openEditModal(item);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-left"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setDeleteTargetItem(item);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => openDetailModal(item)}
          className="text-base font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer line-clamp-2 transition-colors mb-2"
        >
          {item.title}
        </h3>

        {/* AI Summary Highlight Box */}
        {item.summary ? (
          <div
            onClick={() => openDetailModal(item)}
            className="mb-3 p-3 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-900/50 cursor-pointer hover:border-brand-400/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-700 dark:text-brand-300 mb-1">
              <Sparkles className="w-3 h-3 text-brand-500" />
              <span>AI Executive Summary</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
              {item.summary}
            </p>
          </div>
        ) : (
          <p
            onClick={() => openDetailModal(item)}
            className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed cursor-pointer"
          >
            {item.description || item.content || 'Click to read or view full content details...'}
          </p>
        )}

        {/* Tags */}
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2.5">
          {item.tags?.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {item.tags.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  #{tag}
                </button>
              ))}
              {item.tags.length > 3 && (
                <span className="text-[10px] text-slate-400">+{item.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Footer Metadata */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formattedDate}</span>
              {item.readingTimeMinutes && <span>• {item.readingTimeMinutes} min read</span>}
            </span>

            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                title={item.url}
              >
                <span>{item.domain || 'External'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
