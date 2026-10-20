/**
 * WorkspaceTopBar.tsx
 * Top bar for the Workspace page displaying mobile menu trigger,
 * title, subtitle, demo area badge, and theme toggle.
 */
import type { FC } from 'react';
import { MapPin, AlertTriangle, Menu } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface WorkspaceTopBarProps {
  scenarioName?: string;
  onToggleMobileMenu?: () => void;
}

export const WorkspaceTopBar: FC<WorkspaceTopBarProps> = ({
  scenarioName = 'Baseline',
  onToggleMobileMenu,
}) => {
  return (
    <header className="h-16 shrink-0 border-b border-border bg-surface px-4 sm:px-6 flex items-center justify-between z-20">
      {/* Title & Mobile Menu Button */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Open workspace menu"
            className="lg:hidden p-2 rounded-lg border border-border text-ink hover:bg-pink/40"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-bold font-display text-ink tracking-tight flex items-center gap-2">
            Flood Workspace
          </h1>
          <p className="text-[11px] sm:text-xs text-ink-muted line-clamp-1">
            Explore data layers, configure a rainfall scenario, and run a simulation.
          </p>
        </div>
      </div>

      {/* Right meta controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {scenarioName && (
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-background text-[11px] font-mono text-ink-muted">
            Scenario: <strong className="text-ink font-semibold">{scenarioName}</strong>
          </span>
        )}

        {/* Demo Area Label */}
        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-border bg-cream dark:bg-surface text-[11px] sm:text-xs font-mono text-ink shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-sage-700 shrink-0" />
          <span className="font-semibold truncate max-w-[140px] sm:max-w-none">
            Bengaluru (Sample)
          </span>
        </div>

        {/* Synthetic Layer Indicator */}
        <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-amber/40 bg-amber/10 text-ink text-[11px] font-mono">
          <AlertTriangle className="w-3.5 h-3.5 text-amber shrink-0" />
          <span>Synthetic Drainage</span>
        </span>

        <ThemeToggle />
      </div>
    </header>
  );
};
