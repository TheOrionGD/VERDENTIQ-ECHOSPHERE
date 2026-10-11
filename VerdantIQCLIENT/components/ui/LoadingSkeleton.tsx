import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSkeletonProps {
  type?: 'card' | 'line' | 'table' | 'gauge';
  rows?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'line',
  rows = 3,
  className,
}) => {
  if (type === 'card') {
    return (
      <div
        className={cn(
          'rounded-xl border border-stone-200 bg-white p-5 animate-pulse space-y-4',
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 bg-stone-200 rounded" />
          <div className="h-5 w-16 bg-emerald-100 rounded-full" />
        </div>
        <div className="h-8 w-24 bg-stone-200 rounded" />
        <div className="h-3 w-full bg-stone-100 rounded" />
      </div>
    );
  }

  if (type === 'gauge') {
    return (
      <div
        className={cn(
          'rounded-xl border border-stone-200 bg-white p-5 animate-pulse flex items-center justify-between',
          className
        )}
      >
        <div className="space-y-2">
          <div className="h-3 w-28 bg-stone-200 rounded" />
          <div className="h-7 w-20 bg-stone-300 rounded" />
          <div className="h-3 w-36 bg-stone-100 rounded" />
        </div>
        <div className="h-16 w-16 rounded-full bg-stone-200 border-4 border-stone-100" />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={cn('w-full animate-pulse space-y-3', className)}>
        <div className="h-9 w-full bg-stone-200 rounded-lg" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <div className="h-4 w-1/4 bg-stone-100 rounded" />
            <div className="h-4 w-1/4 bg-stone-100 rounded" />
            <div className="h-4 w-1/4 bg-stone-100 rounded" />
            <div className="h-4 w-1/4 bg-stone-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('animate-pulse space-y-2', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-3.5 bg-stone-200/80 rounded"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
};

export interface ApiLoadingSkeletonProps {
  isLoading?: boolean;
  type?: 'card' | 'line' | 'table' | 'gauge';
  rows?: number;
  skeleton?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  label?: string;
}

export const ApiLoadingSkeleton: React.FC<ApiLoadingSkeletonProps> = ({
  isLoading = false,
  type = 'card',
  rows = 3,
  skeleton,
  children,
  className,
  label = 'Fetching API Data...',
}) => {
  if (isLoading) {
    return (
      <div className={cn('relative transition-all duration-300', className)}>
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-stone-900/90 text-emerald-400 border border-emerald-500/40 rounded-full text-[10px] font-mono shadow-md animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{label}</span>
        </div>
        {skeleton || <LoadingSkeleton type={type} rows={rows} />}
      </div>
    );
  }
  return <>{children}</>;
};

