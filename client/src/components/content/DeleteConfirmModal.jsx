import React from 'react';
import { useBrain } from '../../context/BrainContext.jsx';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteConfirmModal = () => {
  const { deleteTargetItem, setDeleteTargetItem, deleteItem } = useBrain();

  if (!deleteTargetItem) return null;

  const handleDelete = async () => {
    await deleteItem(deleteTargetItem._id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl animate-slide-up">
        <button
          onClick={() => setDeleteTargetItem(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Item</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-white">"{deleteTargetItem.title}"</span>? It will be permanently removed from your Second Brain vault.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setDeleteTargetItem(null)}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md hover:shadow-rose-500/25 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
};
