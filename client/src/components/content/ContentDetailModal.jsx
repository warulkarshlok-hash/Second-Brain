import React, { useState } from 'react';
import { useBrain } from '../../context/BrainContext.jsx';
import {
  X,
  Globe,
  FileText,
  StickyNote,
  Star,
  Pin,
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles,
  Clock,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import { YouTubeIcon } from '../common/YouTubeIcon.jsx';

export const ContentDetailModal = () => {
  const {
    detailItem,
    setDetailItem,
    openEditModal,
    setDeleteTargetItem,
    toggleFavorite,
    togglePin,
    setSelectedTag,
    addToast,
  } = useBrain();

  const [copied, setCopied] = useState(false);

  if (!detailItem) return null;

  const handleClose = () => {
    setDetailItem(null);
  };

  const handleCopy = () => {
    const textToCopy =
      detailItem.url || detailItem.content || detailItem.summary || detailItem.title;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    addToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const typeConfig = {
    youtube: {
      label: 'YouTube Video',
      icon: <YouTubeIcon className="w-4 h-4 text-red-500" />,
      badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    },
    url: {
      label: 'Web Resource',
      icon: <Globe className="w-4 h-4 text-sky-500" />,
      badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    },
    article: {
      label: 'Article Reader',
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    note: {
      label: 'Personal Note',
      icon: <StickyNote className="w-4 h-4 text-amber-500" />,
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
  };

  const currentType = typeConfig[detailItem.type] || typeConfig.note;

  const formattedDate = new Date(detailItem.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${currentType.badge}`}
            >
              {currentType.icon}
              <span>{currentType.label}</span>
            </span>

            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
              {detailItem.readingTimeMinutes && <span>• {detailItem.readingTimeMinutes} min read</span>}
            </span>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Copy link or content"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={() => togglePin(detailItem._id)}
              className={`p-2 rounded-xl transition-colors ${
                detailItem.isPinned
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Toggle pin"
            >
              <Pin className={`w-4 h-4 ${detailItem.isPinned ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={() => toggleFavorite(detailItem._id)}
              className={`p-2 rounded-xl transition-colors ${
                detailItem.isFavorite
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Toggle favorite"
            >
              <Star className={`w-4 h-4 ${detailItem.isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => {
                const item = detailItem;
                handleClose();
                openEditModal(item);
              }}
              className="p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit item"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const item = detailItem;
                setDeleteTargetItem(item);
              }}
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
          {/* YouTube Video Player Embed (if YouTube) */}
          {detailItem.type === 'youtube' && detailItem.youtubeId && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-800">
              <iframe
                src={`https://www.youtube.com/embed/${detailItem.youtubeId}?autoplay=0&rel=0`}
                title={detailItem.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Title & URL */}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
              {detailItem.title}
            </h1>

            {detailItem.url && (
              <a
                href={detailItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                <span>{detailItem.url}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* AI Executive Summary Card */}
          {detailItem.summary && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-50 to-indigo-50/50 dark:from-brand-950/40 dark:to-indigo-950/30 border border-brand-200/80 dark:border-brand-800/60 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span>Gemini AI Executive Summary</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                {detailItem.summary}
              </p>
            </div>
          )}

          {/* Description */}
          {detailItem.description && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Overview
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {detailItem.description}
              </p>
            </div>
          )}

          {/* Content / Markdown Reading View */}
          {detailItem.content && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                {detailItem.type === 'note' ? 'Note Content' : 'Article Body'}
              </h4>
              <div className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                {detailItem.content}
              </div>
            </div>
          )}

          {/* Tags */}
          {detailItem.tags?.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Tags
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                {detailItem.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(tag);
                      handleClose();
                    }}
                    className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 px-6 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 shrink-0">
          <div className="text-xs text-slate-400">
            Vault ID: <span className="font-mono">{detailItem._id}</span>
          </div>

          <div className="flex items-center gap-3">
            {detailItem.url && (
              <a
                href={detailItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
              >
                <span>Visit Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
