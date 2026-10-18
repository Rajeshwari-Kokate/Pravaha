import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff, ArrowLeft, Layers } from 'lucide-react';

export const NotFoundPage: FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="mx-auto w-14 h-14 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <MapPinOff className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-teal-600 dark:text-teal-400 font-bold">
            HTTP 404
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Resource or Route Not Found
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The requested spatial dataset, scenario report, or application route does not exist in the current network index.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Landing Page</span>
          </Link>
          <Link
            to="/workspace"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-md bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Open Flood Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
