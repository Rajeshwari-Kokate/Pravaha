/**
 * SimulationResultsPanel.tsx
 * Bottom summary area containing 3 KPI tiles, accumulation legend,
 * and tabs for Timeline, Asset Table, Comparison, Events, and Regional Factors.
 */
import { useState, type FC } from 'react';
import { Activity, Table, GitCompare, Clock, Database, ChevronUp, ChevronDown } from 'lucide-react';
import type { SimulationOutput } from '../../hooks/useSimulation';
import { TimelineScrubber } from './TimelineScrubber';
import { ConduitResultsTable } from './ConduitResultsTable';
import { WorkspaceComparisonTab } from './WorkspaceComparisonTab';
import { WorkspaceEventsTab } from './WorkspaceEventsTab';
import { RegionalFactorsView } from './RegionalFactorsView';

interface Props {
  result: SimulationOutput | null;
  _isLoading?: boolean;
  totalConduits: number;
  activeStep: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSeek: (step: number) => void;
  onSelectConduitId?: (id: string) => void;
  selectedId?: string;
}

export const SimulationResultsPanel: FC<Props> = ({
  result,
  _isLoading: _isLoadingProp,
  totalConduits,
  activeStep,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onSeek,
  onSelectConduitId,
  selectedId,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'table' | 'compare' | 'events' | 'regional'>('timeline');
  const [isExpanded, setIsExpanded] = useState(true);

  const overloaded = result?.summaryOverloaded ?? 0;
  const potentialHotspots = result ? Math.round(overloaded * 1.5) : 0;
  const affectedRoads = result ? Math.round(overloaded * 0.6) : 0;

  return (
    <div className="border-t border-border bg-surface/95 backdrop-blur-sm z-30 flex flex-col shadow-offset transition-all">
      {/* Top Summary Bar & KPIs */}
      <div className="px-4 py-2 border-b border-border flex flex-wrap items-center justify-between gap-3">
        {/* KPI Tiles Row */}
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-xs text-ink uppercase tracking-wider shrink-0 hidden md:inline">
            Simulation Results (Summary)
          </span>

          <div className="flex items-center gap-2">
            {/* KPI 1 */}
            <div className="px-3 py-1 rounded-lg border border-border bg-cream dark:bg-background flex items-center gap-2">
              <span className="text-[11px] text-ink-muted">Potential hotspots:</span>
              <span className="font-mono font-bold text-sm text-ink">{potentialHotspots}</span>
            </div>

            {/* KPI 2 */}
            <div className="px-3 py-1 rounded-lg border border-border bg-cream dark:bg-background flex items-center gap-2">
              <span className="text-[11px] text-ink-muted">Drainage segments over capacity:</span>
              <span className={`font-mono font-bold text-sm ${overloaded > 0 ? 'text-critical' : 'text-sage-700'}`}>
                {overloaded} <span className="text-[11px] font-normal text-ink-muted">of {totalConduits}</span>
              </span>
            </div>

            {/* KPI 3 */}
            <div className="px-3 py-1 rounded-lg border border-border bg-cream dark:bg-background flex items-center gap-2">
              <span className="text-[11px] text-ink-muted">Road segments affected:</span>
              <span className="font-mono font-bold text-sm text-ink">{affectedRoads}</span>
            </div>
          </div>
        </div>

        {/* Legend & Collapse */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-ink-muted">
            <span className="font-semibold text-ink">Legend:</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#B8CFB3]" /> Low
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#E8C468]" /> Moderate
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#E0803A]" /> High
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#B3261E] hatch-pattern" /> Very High
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1 rounded border border-border text-ink-muted hover:text-ink hover:bg-pink/40"
            aria-label={isExpanded ? 'Collapse results drawer' : 'Expand results drawer'}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col">
          {/* Tab buttons */}
          <div className="flex items-center gap-1 px-4 py-1.5 border-b border-border bg-cream/40 dark:bg-background/40 text-xs">
            {([
              { id: 'timeline', label: 'Timeline Scrubber', icon: Activity },
              { id: 'table', label: 'Asset Table & CSV', icon: Table },
              { id: 'compare', label: 'Comparison', icon: GitCompare },
              { id: 'events', label: 'Events', icon: Clock },
              { id: 'regional', label: 'Regional Factors (Dataset ML)', icon: Database },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === id
                    ? 'bg-surface text-ink border border-border shadow-sm'
                    : 'text-ink-muted hover:text-ink hover:bg-pink/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div className="p-3">
            {activeTab === 'timeline' && (
              <TimelineScrubber
                result={result}
                activeStep={activeStep}
                isPlaying={isPlaying}
                onPlay={onPlay}
                onPause={onPause}
                onReset={onReset}
                onSeek={onSeek}
              />
            )}
            {activeTab === 'table' && (
              <div className="max-h-64 overflow-y-auto">
                <ConduitResultsTable
                  result={result}
                  selectedId={selectedId}
                  onSelectId={onSelectConduitId}
                />
              </div>
            )}
            {activeTab === 'compare' && <WorkspaceComparisonTab result={result} />}
            {activeTab === 'events' && <WorkspaceEventsTab result={result} />}
            {activeTab === 'regional' && (
              <div className="max-h-72 overflow-y-auto">
                <RegionalFactorsView />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
