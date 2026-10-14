import React from 'react';
import { Activity, Plus, Edit, Trash2, Sparkles, LogIn, ShieldAlert } from 'lucide-react';

export const ActivityLogTable = ({ logs = [] }) => {
  const getActionBadge = (action) => {
    switch (action) {
      case 'CONTENT_CREATE':
        return {
          icon: <Plus className="w-3 h-3 text-emerald-500" />,
          label: 'Item Created',
          style: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        };
      case 'CONTENT_UPDATE':
        return {
          icon: <Edit className="w-3 h-3 text-sky-500" />,
          label: 'Item Updated',
          style: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
        };
      case 'CONTENT_DELETE':
        return {
          icon: <Trash2 className="w-3 h-3 text-rose-500" />,
          label: 'Item Deleted',
          style: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        };
      case 'AI_SUMMARIZE':
        return {
          icon: <Sparkles className="w-3 h-3 text-brand-500" />,
          label: 'AI Summarized',
          style: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20',
        };
      case 'AI_TAGS':
        return {
          icon: <Sparkles className="w-3 h-3 text-amber-500" />,
          label: 'AI Tags',
          style: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        };
      case 'AI_ASK_BRAIN':
        return {
          icon: <Sparkles className="w-3 h-3 text-indigo-500" />,
          label: 'Ask My Brain',
          style: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        };
      case 'USER_LOGIN':
        return {
          icon: <LogIn className="w-3 h-3 text-slate-500" />,
          label: 'User Logged In',
          style: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
        };
      case 'ADMIN_ROLE_CHANGE':
        return {
          icon: <ShieldAlert className="w-3 h-3 text-purple-500" />,
          label: 'Role Changed',
          style: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        };
      default:
        return {
          icon: <Activity className="w-3 h-3 text-slate-400" />,
          label: action,
          style: 'bg-slate-100 dark:bg-slate-800 text-slate-500',
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            System Activity & Audit Logs
          </h3>
          <p className="text-xs text-slate-400">
            Immutable platform activity logs for security and compliance
          </p>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Last {logs.length} operations
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 border-b border-slate-200/80 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Timestamp</th>
              <th className="py-3 px-4 font-semibold">Action</th>
              <th className="py-3 px-4 font-semibold">User</th>
              <th className="py-3 px-4 font-semibold">Event Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {logs.map((log) => {
              const badge = getActionBadge(log.action);
              const dateStr = new Date(log.createdAt || log.timestamp).toLocaleString();

              return (
                <tr key={log._id || Math.random()} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {dateStr}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[11px] font-semibold ${badge.style}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {log.userName || 'Anonymous'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {log.userEmail || log.userId}
                    </p>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    {log.details ? (
                      <span className="truncate block max-w-xs md:max-w-md">
                        {JSON.stringify(log.details).replace(/[{"}]/g, ' ')}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
