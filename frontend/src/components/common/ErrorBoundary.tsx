import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <div className="max-w-md w-full p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-md bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold">Application Runtime Error</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              An unexpected error occurred in the PRAVAHA application interface. The simulation and routing states have been halted to maintain system integrity.
            </p>
            {this.state.error && (
              <pre className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded text-[11px] font-mono text-left overflow-x-auto max-h-36">
                {this.state.error.message}
              </pre>
            )}
            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md bg-teal-600 hover:bg-teal-700 text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
