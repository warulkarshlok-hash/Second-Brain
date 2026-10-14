import React, { useState, useEffect } from 'react';
import { useBrain } from '../context/BrainContext.jsx';
import { useAppAuth } from '../context/AuthContext.jsx';
import { adminService } from '../services/adminService.js';
import { AdminStats } from '../components/admin/AdminStats.jsx';
import { UsersTable } from '../components/admin/UsersTable.jsx';
import { ActivityLogTable } from '../components/admin/ActivityLogTable.jsx';
import {
  Shield,
  ArrowLeft,
  RefreshCw,
  Users,
  Activity,
  Layers,
  AlertCircle,
} from 'lucide-react';

export const AdminPage = () => {
  const { setActiveView } = useBrain();
  const { user } = useAppAuth();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'logs'

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes, logsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getActivityLogs(50),
      ]);
      setStats(statsRes.stats);
      setUsers(usersRes.data || []);
      setLogs(logsRes.data || []);
    } catch (err) {
      console.error('Admin data fetch error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-500 mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Administrator Access Required
        </h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          Your current account role is <span className="font-mono font-semibold">{user?.role || 'user'}</span>. You must have the <span className="font-mono font-semibold">admin</span> role to view platform metrics and user logs.
        </p>
        <button
          onClick={() => setActiveView('vault')}
          className="px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl"
        >
          Return to My Vault
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <button
            onClick={() => setActiveView('vault')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Personal Vault</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Admin & Governance Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Role-Based Access
            </span>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>System Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'logs'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Activity Audit ({logs.length})</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-3 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <AdminStats stats={stats || {}} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UsersTable users={users.slice(0, 5)} onRoleUpdated={fetchAdminData} />
            <ActivityLogTable logs={logs.slice(0, 10)} />
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <UsersTable users={users} onRoleUpdated={fetchAdminData} />
      )}

      {activeTab === 'logs' && (
        <ActivityLogTable logs={logs} />
      )}
    </div>
  );
};
