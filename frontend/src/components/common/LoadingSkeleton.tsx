import { type FC } from 'react';

export const Skeleton: FC<{
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}> = ({ className = '', variant = 'rect' }) => {
  const baseClasses = 'bg-slate-200 dark:bg-slate-800 animate-pulse';
  const variantClasses =
    variant === 'circle'
      ? 'rounded-full'
      : variant === 'text'
      ? 'rounded h-4 my-1'
      : 'rounded-md';

  return (
    <div
      role="status"
      aria-label="Loading..."
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const PanelSkeleton: FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-3/4" />
      <div className="pt-2 space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    </div>
  );
};

export const TableSkeleton: FC<{ cols?: number; rows?: number }> = ({
  cols = 4,
  rows = 5,
}) => {
  return (
    <div className="w-full overflow-hidden border border-slate-200 dark:border-slate-800 rounded-md">
      <div className="flex bg-slate-100 dark:bg-slate-800 p-3 gap-4 border-b border-slate-200 dark:border-slate-700">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800 p-2 space-y-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 py-2">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartSkeleton: FC<{ height?: string }> = ({ height = 'h-48' }) => {
  return (
    <div
      className={`w-full ${height} bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-md p-4 flex flex-col justify-end gap-2`}
    >
      <div className="flex items-end gap-2 h-full w-full">
        <Skeleton className="h-2/3 flex-1" />
        <Skeleton className="h-5/6 flex-1" />
        <Skeleton className="h-1/2 flex-1" />
        <Skeleton className="h-4/5 flex-1" />
        <Skeleton className="h-3/4 flex-1" />
      </div>
      <Skeleton className="h-3 w-1/2 mx-auto mt-2" />
    </div>
  );
};
