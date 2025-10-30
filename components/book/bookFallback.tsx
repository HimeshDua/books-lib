import React from 'react';

export default function BookFallback() {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-6">
      {Array.from({length: 12}).map((_, i) => (
        <li
          key={i}
          className="group relative overflow-hidden rounded-md backdrop-blur-md bg-white/5 dark:bg-slate-800/30 shadow-sm border border-white/10 animate-pulse"
        >
          {/* Cover Skeleton */}
          <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-md">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200/60 via-slate-300/40 to-slate-100/60 dark:from-slate-700/40 dark:via-slate-800/50 dark:to-slate-900/40 shimmer" />
          </div>

          {/* Content Skeleton */}
          <div className="p-3 space-y-2">
            <div className="h-4 w-3/4 rounded bg-slate-300/60 dark:bg-slate-700/60 shimmer" />
            <div className="h-3 w-1/2 rounded bg-slate-300/40 dark:bg-slate-700/40 shimmer" />

            <div className="mt-4 flex justify-between items-center">
              <div className="h-3 w-1/3 rounded bg-slate-300/40 dark:bg-slate-700/40 shimmer" />
              <div className="h-5 w-10 rounded-full bg-slate-200/50 dark:bg-slate-700/50 shimmer" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
