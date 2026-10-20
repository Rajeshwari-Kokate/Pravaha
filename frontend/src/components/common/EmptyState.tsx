import type { FC } from 'react';

export type EmptyStateType = 'drain-grate' | 'pipe' | 'raindrop' | 'simulation';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: FC<EmptyStateProps> = ({
  type = 'simulation',
  title = 'No simulation yet',
  description = "Pick a storm, press Run, then see which pipes can't keep up.",
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto space-y-4">
      {/* Original Line SVG based on type */}
      <div className="w-16 h-16 rounded-xl border border-border-light dark:border-border-dark bg-cream dark:bg-surface-dark flex items-center justify-center text-sage-700 dark:text-sage-300 shadow-tactile-sm">
        {type === 'drain-grate' || type === 'simulation' ? (
          /* Original Line SVG Drain Grate */
          <svg className="w-8 h-8 stroke-current fill-none stroke-[1.75]" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="7" y1="3" x2="7" y2="21" />
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="17" y1="3" x2="17" y2="21" />
            <line x1="3" y1="12" x2="21" y2="12" strokeDasharray="2 2" />
          </svg>
        ) : type === 'pipe' ? (
          /* Original Line SVG Pipe */
          <svg className="w-8 h-8 stroke-current fill-none stroke-[1.75]" viewBox="0 0 24 24">
            <ellipse cx="6" cy="12" rx="3" ry="6" />
            <path d="M6 6h12a3 6 0 0 1 0 12H6" />
            <ellipse cx="18" cy="12" rx="3" ry="6" />
            <line x1="9" y1="12" x2="15" y2="12" strokeDasharray="2 2" />
          </svg>
        ) : (
          /* Original Line SVG Raindrop */
          <svg className="w-8 h-8 stroke-current fill-none stroke-[1.75]" viewBox="0 0 24 24">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            <path d="M12 11v6" strokeDasharray="2 2" />
            <circle cx="12" cy="18" r="0.5" fill="currentColor" />
          </svg>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-ink dark:text-cream font-sans">
          {title}
        </h3>
        <p className="text-xs text-ink-muted dark:text-muted-dark leading-relaxed font-sans">
          {description}
        </p>
      </div>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary text-xs font-bold"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
