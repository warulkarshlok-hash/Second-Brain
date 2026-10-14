import React, { useState } from 'react';
import { adminService } from '../../services/adminService.js';
import { useBrain } from '../../context/BrainContext.jsx';
import { Shield, ShieldAlert, User, Check, RefreshCw } from 'lucide-react';

export const UsersTable = ({ users = [], onRoleUpdated }) => {
  const { addToast } = useBrain();
  const [updatingId, setUpdatingId] = useState(null);

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    setUpdatingId(user.auth0Id || user._id);
    try {
      await adminService.updateUserRole(user.auth0Id || user._id, newRole);
      addToast(`Updated ${user.name}'s role to ${newRole}`, 'success');
      if (onRoleUpdated) onRoleUpdated();
    } catch (err) {
      addToast(`Role update failed: ${err.message}`, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            User Management & Authorization
          </h3>
          <p className="text-xs text-slate-400">
            Control Role-Based Access Control (RBAC) across tenant accounts
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          {users.length} Users Registered
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 border-b border-slate-200/80 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">User</th>
              <th className="py-3 px-4 font-semibold">Auth0 Subject ID</th>
              <th className="py-3 px-4 font-semibold">Current Role</th>
              <th className="py-3 px-4 font-semibold">Saved Items</th>
              <th className="py-3 px-4 font-semibold">Last Active</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {users.map((u) => {
              const isUpdating = updatingId === (u.auth0Id || u._id);
              const isAdmin = u.role === 'admin';

              return (
                <tr key={u.auth0Id || u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      {u.picture ? (
                        <img
                          src={u.picture}
                          alt={u.name}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {u.auth0Id || u._id}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold ${
                        isAdmin
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      <span className="capitalize">{u.role}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {u.contentCount ?? 0} items
                  </td>

                  <td className="py-3 px-4 text-slate-400">
                    {u.lastLogin
                      ? new Date(u.lastLogin).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Never'}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRoleToggle(u)}
                      disabled={isUpdating}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        isAdmin
                          ? 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          : 'border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100'
                      }`}
                    >
                      {isUpdating ? (
                        <RefreshCw className="w-3 h-3 animate-spin inline" />
                      ) : isAdmin ? (
                        'Demote to User'
                      ) : (
                        'Promote to Admin'
                      )}
                    </button>
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
