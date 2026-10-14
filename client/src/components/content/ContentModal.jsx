import React, { useState, useEffect } from 'react';
import { useBrain } from '../../context/BrainContext.jsx';
import { aiService } from '../../services/aiService.js';
import {
  X,
  Globe,
  FileText,
  StickyNote,
  Sparkles,
  Tag,
  Star,
  Pin,
  Loader2,
  Check,
} from 'lucide-react';
import { YouTubeIcon } from '../common/YouTubeIcon.jsx';

export const ContentModal = () => {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    addModalInitialType,
    editingItem,
    setEditingItem,
    createItem,
    updateItem,
    addToast,
  } = useBrain();

  const isOpen = isAddModalOpen || Boolean(editingItem);
  const isEditing = Boolean(editingItem);

  const [type, setType] = useState('note');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // AI Loading states
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form values on open/edit
  useEffect(() => {
    if (editingItem) {
      setType(editingItem.type || 'note');
      setTitle(editingItem.title || '');
      setUrl(editingItem.url || '');
      setDescription(editingItem.description || '');
      setContent(editingItem.content || '');
      setSummary(editingItem.summary || '');
      setTags(editingItem.tags || []);
      setIsFavorite(Boolean(editingItem.isFavorite));
      setIsPinned(Boolean(editingItem.isPinned));
    } else if (isAddModalOpen) {
      setType(addModalInitialType || 'note');
      setTitle('');
      setUrl('');
      setDescription('');
      setContent('');
      setSummary('');
      setTags([]);
      setIsFavorite(false);
      setIsPinned(false);
    }
  }, [editingItem, isAddModalOpen, addModalInitialType]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().toLowerCase().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Helper: YouTube ID extraction preview
  const extractYouTubeId = (inputUrl) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  const ytId = type === 'youtube' && url ? extractYouTubeId(url) : null;

  // AI Summarize handler
  const handleAiSummarize = async () => {
    if (!title && !content && !description && !url) {
      addToast('Please enter a title, URL, or notes first so AI has context to summarize!', 'error');
      return;
    }
    setIsSummarizing(true);
    try {
      const res = await aiService.summarize({
        type,
        title: title || (type === 'youtube' ? 'YouTube Video' : 'Knowledge Item'),
        content,
        description,
        url,
      });
      setSummary(res.summary);
      addToast('AI summary generated with Gemini!', 'success');
    } catch (err) {
      addToast(`AI summarize error: ${err.message}`, 'error');
    } finally {
      setIsSummarizing(false);
    }
  };

  // AI Suggest Tags handler
  const handleAiTags = async () => {
    if (!title && !content && !description) {
      addToast('Please provide a title or notes first to suggest relevant tags!', 'error');
      return;
    }
    setIsGeneratingTags(true);
    try {
      const res = await aiService.suggestTags({
        type,
        title,
        content,
        description,
        currentTags: tags,
      });
      setTags(res.tags);
      addToast('Relevant tags suggested by Gemini!', 'success');
    } catch (err) {
      addToast(`AI tags error: ${err.message}`, 'error');
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Please enter a title for this item', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        type,
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        content: content.trim(),
        summary: summary.trim(),
        tags,
        isFavorite,
        isPinned,
      };

      if (isEditing) {
        await updateItem(editingItem._id, payload);
      } else {
        await createItem(payload);
      }
      handleClose();
    } catch (err) {
      // toast handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const types = [
    { id: 'youtube', label: 'YouTube Video', icon: <YouTubeIcon className="w-4 h-4 text-red-500" /> },
    { id: 'url', label: 'Website Link', icon: <Globe className="w-4 h-4 text-sky-500" /> },
    { id: 'article', label: 'Article / Essay', icon: <FileText className="w-4 h-4 text-emerald-500" /> },
    { id: 'note', label: 'Note / Idea', icon: <StickyNote className="w-4 h-4 text-amber-500" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Knowledge Item' : 'Save to Second Brain'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditing ? 'Update details, tags, and summary' : 'Add videos, web links, articles, or notes'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Content Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Content Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {types.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    type === t.id
                      ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {t.icon}
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'youtube'
                  ? 'e.g. Building an AI Agent with Google Gemini'
                  : type === 'note'
                  ? 'e.g. Brainstorming session on product features'
                  : 'e.g. React 19 architecture overview'
              }
              className="w-full px-3.5 py-2.5 bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>

          {/* URL (for YouTube, Link, Article) */}
          {type !== 'note' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {type === 'youtube' ? 'YouTube Video URL' : 'Website or Article URL'}
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={
                  type === 'youtube'
                    ? 'https://www.youtube.com/watch?v=...'
                    : 'https://example.com/article'
                }
                className="w-full px-3.5 py-2.5 bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono text-xs"
              />

              {/* YouTube Live Thumbnail Preview */}
              {ytId && (
                <div className="mt-2.5 flex items-center gap-3 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <img
                    src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                    alt="YouTube Preview"
                    className="w-24 h-14 object-cover rounded-lg shadow-sm"
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">YouTube Video Detected</p>
                    <p className="text-[11px] text-slate-500 font-mono">Video ID: {ytId}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Body Content / Notes (Markdown supported) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {type === 'note'
                  ? 'Note Body / Thoughts (Markdown supported)'
                  : type === 'article'
                  ? 'Article Content / Key Takeaways'
                  : 'Personal Notes & Highlights'}
              </label>
              <span className="text-[11px] text-slate-400">Supports Markdown</span>
            </div>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Jot down notes, insights, code snippets, or copy article paragraphs here..."
              className="w-full px-3.5 py-2.5 bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-sans leading-relaxed"
            />
          </div>

          {/* AI Summary Section with one-click generator */}
          <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-900/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Executive Summary</span>
              </div>
              <button
                type="button"
                onClick={handleAiSummarize}
                disabled={isSummarizing}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                {isSummarizing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="AI generated or custom executive summary of this knowledge item..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-brand-200/70 dark:border-brand-800/70 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 leading-relaxed"
            />
          </div>

          {/* Tags Section with AI suggestions */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tags
              </label>
              <button
                type="button"
                onClick={handleAiTags}
                disabled={isGeneratingTags}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline disabled:opacity-50"
              >
                {isGeneratingTags ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 text-brand-500" />
                )}
                <span>Auto-suggest tags</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl min-h-[42px]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-medium"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? "Type a tag and press Enter (e.g. productivity, ai)..." : "Add tag..."}
                className="flex-1 min-w-[140px] bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none px-1"
              />
            </div>
          </div>

          {/* Preferences (Favorite & Pinned) */}
          <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isFavorite
                  ? 'border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
              <span>Favorite</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isPinned
                  ? 'border-brand-500/40 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-brand-500' : ''}`} />
              <span>Pin to top</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-md hover:shadow-brand-500/25 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Save Item'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
