import { type FC } from 'react';

export const Skeleton: FC<{
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}> = ({ className = '', variant = 'rect' }) => {
  const baseClasses = 'bg-[#B8CFB3]/35 dark:bg-[#3A4A40]/60 animate-pulse border border-[#24302A]/10 dark:border-[#3A4A40]';
  const variantClasses =
    variant === 'circle'
      ? 'rounded-full'
      : variant === 'text'
      ? 'rounded-[4px] h-4 my-1'
      : 'rounded-lg';

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
    <div className="space-y-3 p-4 bg-white dark:bg-[#25312A] border-[1.5px] border-[#24302A] dark:border-[#3A4A40] rounded-xl shadow-[3px_3px_0px_#24302A] dark:shadow-[3px_3px_0px_#0E1410]">
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
    <div className="w-full overflow-hidden border-[1.5px] border-[#24302A] dark:border-[#3A4A40] rounded-xl shadow-[3px_3px_0px_#24302A] dark:shadow-[3px_3px_0px_#0E1410] bg-white dark:bg-[#25312A]">
      <div className="flex bg-[#FEFAF3] dark:bg-[#1C2620] p-3 gap-4 border-b-[1.5px] border-[#24302A] dark:border-[#3A4A40]">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-[#24302A]/10 dark:divide-[#3A4A40] p-2 space-y-2">
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
