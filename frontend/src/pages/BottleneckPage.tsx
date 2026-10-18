import { type FC, useState } from 'react';
import { BarChart3, Layers, AlertTriangle } from 'lucide-react';
import { BottleneckRankingPanel } from '../components/workspace/BottleneckRankingPanel';
import { InterventionComparison } from '../components/workspace/InterventionComparison';
import { KpiCards } from '../components/workspace/KpiCards';
import { useBottleneck } from '../hooks/useBottleneck';
import { RAINFALL_PRESETS } from '../lib/simulation';
import type { ReturnPeriod } from '../lib/simulation';

const RETURN_PERIODS: { label: string; value: ReturnPeriod }[] = [
  { label: '5yr',   value: '5yr'   },
  { label: '10yr',  value: '10yr'  },
  { label: '25yr',  value: '25yr'  },
  { label: '50yr',  value: '50yr'  },
  { label: '100yr', value: '100yr' },
];

export const BottleneckPage: FC = () => {
  const b = useBottleneck();
  const [selectedConduitId, setSelectedConduitId] = useState<string | undefined>();
  const [activeRp, setActiveRp]                   = useState<ReturnPeriod>('10yr');
  const [activeTab, setActiveTab]                 = useState<'ranking' | 'intervention'>('ranking');

  const handleSetRp = (rp: ReturnPeriod) => {
    setActiveRp(rp);
    b.setRainfallIntensity(RAINFALL_PRESETS[rp]);
  };

  const totalConduits = b.baselineResult?.conduitResults.length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Page header */}
      <div>
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Risk Intelligence
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Bottleneck Ranking
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Score and rank drainage conduits by composite flood risk. Adjust factor weights to reflect local priorities, then model the effect of desilting, widening, or bypass interventions.
        </p>
      </div>

      {/* Storm selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
          Storm event:
        </span>
        {RETURN_PERIODS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            id={`bottleneck-rp-${value}`}
            onClick={() => handleSetRp(value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all
              ${activeRp === value
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-teal-400'
              }`}
          >
            {label}
            <span className="ml-1.5 font-normal text-[9px] opacity-70">
              {RAINFALL_PRESETS[value]}mm/hr
            </span>
          </button>
        ))}
        {b.isLoading && (
          <span className="text-[11px] font-mono text-teal-500 animate-pulse ml-2">
            Computing...
          </span>
        )}
      </div>

      {/* Live KPI strip */}
      <KpiCards
        result={b.baselineResult}
        isLoading={b.isLoading}
        totalConduits={totalConduits}
      />

      {/* Synthetic data warning */}
      <div className="flex items-start gap-3 p-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
          All conduit properties are from a synthetic drainage model (seed 42) road-aligned to OpenStreetMap geometry. Bottleneck rankings are for demonstration purposes only. Dataset origin and licence: unverified.
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Left column: Ranking panel */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
              Factor Weights + Rankings
            </h2>
          </div>
          <BottleneckRankingPanel
            rankings={b.rankings}
            weights={b.weights}
            onSetWeight={b.setWeight}
            isLoading={b.isLoading}
            onSelectConduit={setSelectedConduitId}
            selectedId={selectedConduitId}
          />
        </div>

        {/* Right column: Tabs - Intervention / Details */}
        <div className="lg:col-span-3">

          {/* Tab bar */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 text-sm font-semibold">
            <button
              type="button"
              id="tab-intervention"
              onClick={() => setActiveTab('intervention')}
              className={`px-4 py-2 transition-colors border-b-2 ${
                activeTab === 'intervention'
                  ? 'border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Intervention Comparison
            </button>
            <button
              type="button"
              id="tab-ranking-detail"
              onClick={() => setActiveTab('ranking')}
              className={`px-4 py-2 transition-colors border-b-2 ${
                activeTab === 'ranking'
                  ? 'border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Factor Detail
            </button>
          </div>

          {activeTab === 'intervention' && (
            <InterventionComparison
              baselineResult={b.baselineResult}
              interventionResult={b.interventionResult}
              selectedIntervention={b.selectedIntervention}
              onSelectIntervention={b.setIntervention}
              deltas={b.deltas}
              isLoading={b.isLoading}
            />
          )}

          {activeTab === 'ranking' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" />
                Per-Factor Score Breakdown
              </h3>
              {b.rankings.length === 0 && b.isLoading && (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  ))}
                </div>
              )}
              {b.rankings.map(r => (
                <div
                  key={r.conduitId}
                  className={`p-4 rounded-xl border transition-all
                    ${r.conduitId === selectedConduitId
                      ? 'border-teal-400 dark:border-teal-600 bg-teal-50/50 dark:bg-teal-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                      #{r.rank} {r.conduitId}
                    </span>
                    <span className="text-xs font-black font-mono text-slate-600 dark:text-slate-300">
                      {Math.round(r.score * 100)}%
                    </span>
                  </div>
                  {/* Factor breakdown bars */}
                  <div className="space-y-1.5">
                    {[
                      { label: 'Flow',       val: r.flowScore,       color: '#ef4444' },
                      { label: 'Blockage',   val: r.blockageScore,   color: '#f97316' },
                      { label: 'Downstream', val: r.downstreamScore, color: '#a855f7' },
                      { label: 'Channel',    val: r.channelScore,    color: '#3b82f6' },
                      { label: 'Slope Risk', val: r.slopeScore,      color: '#14b8a6' },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="flex items-center gap-2 text-[10px] font-mono">
                        <span className="w-16 text-slate-500 shrink-0">{label}</span>
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${val * 100}%`, backgroundColor: color }}
                          />
                        </div>
                        <span className="w-8 text-right text-slate-600 dark:text-slate-400">
                          {Math.round(val * 100)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Raw values */}
                  <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-mono text-slate-400">
                    <span>Slope: {r.slopePct}%</span>
                    <span>Blockage: {(r.blockageFactor * 100).toFixed(0)}%</span>
                    <span>Downstream edges: {r.downstreamCount}</span>
                    <span>Flow ratio: {r.flowRatio.toFixed(3)}x</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
