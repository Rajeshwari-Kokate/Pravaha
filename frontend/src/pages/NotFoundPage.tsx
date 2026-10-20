import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff, ArrowLeft, Layers } from 'lucide-react';

export const NotFoundPage: FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl border border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark shadow-tactile space-y-6">
        <div className="mx-auto w-14 h-14 rounded-xl border border-border-light dark:border-border-dark bg-cream dark:bg-bg-dark flex items-center justify-center text-sage-700 dark:text-sage-300 shadow-tactile-sm">
          <MapPinOff className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-sage-700 dark:text-sage-300 font-bold">
            HTTP 404
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-ink dark:text-cream font-sans">
            Route Not Located
          </h1>
          <p className="text-xs text-ink-muted dark:text-muted-dark leading-relaxed">
            The requested spatial dataset, scenario report, or application route does not exist in the current network index.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg border-2 border-ink dark:border-border-dark bg-cream dark:bg-surface-dark text-ink dark:text-cream hover:bg-pink shadow-tactile-sm transition-all active:translate-x-[2px] active:translate-y-[2px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Landing</span>
          </Link>
          <Link
            to="/workspace"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg border-2 border-ink bg-sage-500 hover:bg-sage-700 text-ink hover:text-cream shadow-tactile transition-all active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Open Flood Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
