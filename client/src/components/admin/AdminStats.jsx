import React from 'react';
import {
  Users,
  Database,
  Sparkles,
  Activity,
  Globe,
  FileText,
  StickyNote,
  Star,
} from 'lucide-react';

export const AdminStats = ({ stats = {} }) => {
  const cards = [
    {
      title: 'Total Registered Users',
      value: stats.totalUsers || 0,
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      change: `${stats.activeToday || 1} active today`,
      bgColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Total Vault Items',
      value: stats.totalContents || 0,
      icon: <Database className="w-5 h-5 text-brand-500" />,
      change: `${stats.favoritesCount || 0} favorited`,
      bgColor: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
    },
    {
      title: 'AI Queries Executed',
      value: stats.totalAiQueries || 0,
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      change: 'Gemini 1.5 Flash',
      bgColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Total System Logs',
      value: stats.totalLogs || 0,
      icon: <Activity className="w-5 h-5 text-emerald-500" />,
      change: 'Audit trail secured',
      bgColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
  ];

  const breakdown = stats.typeBreakdown || {
    youtube: 0,
    url: 0,
    article: 0,
    note: 0,
  };

  const totalBreakdown = Math.max(
    1,
    (breakdown.youtube || 0) +
      (breakdown.url || 0) +
      (breakdown.article || 0) +
      (breakdown.note || 0)
  );

  return (
    <div className="space-y-6">
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.bgColor}`}>{card.icon}</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </div>
              <p className="text-xs text-slate-400 mt-1">{card.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Type Breakdown Distribution */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Content Distribution by Type
        </h3>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex mb-4">
          <div
            style={{ width: `${((breakdown.youtube || 0) / totalBreakdown) * 100}%` }}
            className="bg-red-500 h-full transition-all"
            title={`YouTube: ${breakdown.youtube || 0}`}
          />
          <div
            style={{ width: `${((breakdown.url || 0) / totalBreakdown) * 100}%` }}
            className="bg-sky-500 h-full transition-all"
            title={`Links: ${breakdown.url || 0}`}
          />
          <div
            style={{ width: `${((breakdown.article || 0) / totalBreakdown) * 100}%` }}
            className="bg-emerald-500 h-full transition-all"
            title={`Articles: ${breakdown.article || 0}`}
          />
          <div
            style={{ width: `${((breakdown.note || 0) / totalBreakdown) * 100}%` }}
            className="bg-amber-500 h-full transition-all"
            title={`Notes: ${breakdown.note || 0}`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-slate-600 dark:text-slate-400">YouTube:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {breakdown.youtube || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-slate-600 dark:text-slate-400">Web Links:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {breakdown.url || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Articles:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {breakdown.article || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-400">Notes:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {breakdown.note || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
