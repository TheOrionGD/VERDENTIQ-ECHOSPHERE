import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-stone-300">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-emerald-500/10 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-xs font-mono text-emerald-400 tracking-wider uppercase animate-pulse">
        Compiling & Loading View...
      </p>
      <span className="text-[10px] text-stone-500 mt-1 font-mono">
        VerdantIQ Spatial Engine
      </span>
    </div>
  );
}
