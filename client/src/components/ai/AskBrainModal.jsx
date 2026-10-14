import React, { useState, useEffect, useRef } from 'react';
import { useBrain } from '../../context/BrainContext.jsx';
import { aiService } from '../../services/aiService.js';
import {
  Sparkles,
  Send,
  X,
  Loader2,
  Bot,
  User,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Info,
} from 'lucide-react';

export const AskBrainModal = () => {
  const {
    isAskBrainOpen,
    setIsAskBrainOpen,
    askBrainInitialQuery,
    openDetailModal,
    contents,
    addToast,
  } = useBrain();

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your Second Brain AI Assistant. I can search through your saved YouTube videos, articles, links, and notes to synthesize answers with source citations. What would you like to know?",
      citations: [],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Set initial query if passed
  useEffect(() => {
    if (askBrainInitialQuery) {
      setQuery(askBrainInitialQuery);
    }
  }, [askBrainInitialQuery]);

  if (!isAskBrainOpen) return null;

  const handleClose = () => {
    setIsAskBrainOpen(false);
  };

  const handleSend = async (userQuestion) => {
    const q = (userQuestion || query).trim();
    if (!q) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: q,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await aiService.askBrain(q);

      const aiMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: res.answer,
        citations: res.citations || [],
        isDemo: res.isDemo,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        id: `ai_err_${Date.now()}`,
        sender: 'ai',
        text: `Sorry, I encountered an issue querying your vault: ${err.message}`,
        citations: [],
      };
      setMessages((prev) => [...prev, errorMessage]);
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitationClick = (citation) => {
    const found = contents.find((c) => c._id === citation.id);
    if (found) {
      openDetailModal(found);
    } else {
      addToast(`Opening "${citation.title}"`, 'info');
    }
  };

  const suggestedPrompts = [
    'What key frameworks or methods are in my notes?',
    'Summarize my YouTube videos on knowledge management',
    'What did I save about RAG and semantic search?',
    'List all action items mentioned across my saved items',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 animate-slide-up flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/80 dark:border-slate-800 shrink-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Ask My Brain</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20">
                  Gemini RAG
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI answers synthesized exclusively from your {contents.length} personal vault items
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                    isUser
                      ? 'bg-slate-800 dark:bg-slate-700'
                      : 'bg-gradient-to-tr from-brand-600 to-indigo-500'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-3">
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-tr-none shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Citations Box */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-2 shadow-xs">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5 text-brand-500" />
                        <span>Sources Referenced ({msg.citations.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.citations.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => handleCitationClick(c)}
                            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 hover:bg-brand-50/40 dark:hover:bg-brand-950/30 cursor-pointer transition-all group"
                          >
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 mb-0.5">
                              <span className="truncate">{c.title}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {c.snippet}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shrink-0 text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 p-3.5 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-brand-600 dark:text-brand-400 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Reading your saved vault and synthesizing with Gemini...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompts */}
        {messages.length <= 2 && (
          <div className="px-6 py-2 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-slate-400 font-medium shrink-0">Ideas:</span>
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 whitespace-nowrap transition-colors flex items-center gap-1"
              >
                <span>{p}</span>
                <ArrowRight className="w-3 h-3 text-brand-500" />
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about your saved videos, articles, and notes..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-5 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-semibold rounded-2xl shadow-md hover:shadow-brand-500/25 transition-all flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
