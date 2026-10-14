import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-3.5 animate-pulse shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="flex gap-2">
          <div className="h-7 w-7 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-7 w-7 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>
      <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md mt-1" />
      <div className="h-16 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
      <div className="space-y-2 pt-1">
        <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3.5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="h-5 w-12 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>
    </div>
  );
};

export const GridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};
