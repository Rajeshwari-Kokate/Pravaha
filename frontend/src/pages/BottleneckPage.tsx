/**
 * BottleneckPage.tsx
 * Segment detail view and bottleneck ranking lab:
 * Back to map link, Segment title with Candidate Bottleneck amber tag,
 * tabs for Overview, Upstream, Downstream, Related Hotspots,
 * Overview table, Water Gauge, Mini Map with legend, and Flow Profile chart.
 */
import { useState, type FC } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Tag } from 'lucide-react';
import { WaterGauge } from '../components/bottleneck/WaterGauge';
import { SegmentOverviewTable } from '../components/bottleneck/SegmentOverviewTable';
import { SegmentMiniMap } from '../components/bottleneck/SegmentMiniMap';
import { SegmentFlowProfileChart } from '../components/bottleneck/SegmentFlowProfileChart';
import { BottleneckRankingCard } from '../components/bottleneck/BottleneckRankingCard';
import { useBottleneck } from '../hooks/useBottleneck';

export const BottleneckPage: FC = () => {
  const [searchParams] = useSearchParams();
  const b = useBottleneck();

  const [activeTab, setActiveTab] = useState<'overview' | 'upstream' | 'downstream' | 'hotspots'>('overview');
  const [selectedConduitId, setSelectedConduitId] = useState<string>(
    searchParams.get('id') || 'D-104'
  );

  const selectedConduit =
    b.conduits.find(c => c.id === selectedConduitId) ||
    b.conduits[0] || {
      id: 'D-104',
      fromNode: 'N-23',
      toNode: 'N-24',
      channelType: 'Stormwater Drain',
      lengthM: 328,
      nominalCapacityM3s: 2.5,
      effectiveCapacityM3s: 2.5,
      blockageFactor: 0.35,
    };

  const simResult = b.baselineResult?.conduitResults.find(r => r.conduitId === selectedConduit.id);
  const currentFlow = simResult?.inflowM3s ?? 4.1;
  const utilizationPct = Math.round((currentFlow / (selectedConduit.effectiveCapacityM3s || 1)) * 100);
  const isOverloaded = simResult?.isOverloaded ?? (utilizationPct >= 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Navigation Row: Back to Map */}
      <div className="flex items-center justify-between">
        <Link
          to="/workspace"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-sage-700 hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to map</span>
        </Link>
        <span className="text-[11px] font-mono text-ink-muted">
          Catchment: Koramangala Valley
        </span>
      </div>

      {/* Title & Candidate Bottleneck Amber Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold font-display text-ink">
            Drainage Segment {selectedConduit.id}
          </h1>
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber/15 text-amber border border-amber/40 shadow-sm flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber" />
            <span>Candidate Bottleneck</span>
          </span>
        </div>

        {/* Synthetic Data Notice */}
        <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-border bg-background text-ink-muted">
          Synthetic Network Layer
        </span>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1 border-b border-border text-xs font-semibold">
        {([
          { id: 'overview', label: 'Overview' },
          { id: 'upstream', label: 'Upstream Network' },
          { id: 'downstream', label: 'Downstream Network' },
          { id: 'hotspots', label: 'Related Hotspots' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-sage-500 text-ink font-bold bg-sage-300/20'
                : 'border-transparent text-ink-muted hover:text-ink hover:bg-pink/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main 2-Column: Overview Table + Mini Map & Water Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 cols: Attributes Table */}
            <div className="lg:col-span-6 space-y-4">
              <SegmentOverviewTable
                segmentId={selectedConduit.id}
                channelType={selectedConduit.channelType}
                lengthM={selectedConduit.lengthM}
                nominalCapacityM3s={selectedConduit.nominalCapacityM3s}
                currentFlowM3s={currentFlow}
                capacityUtilizationPct={utilizationPct}
                fromNode={selectedConduit.fromNode}
                toNode={selectedConduit.toNode}
                isOverloaded={isOverloaded}
              />
            </div>

            {/* Right 6 cols: Water Gauge & Topology Mini Map */}
            <div className="lg:col-span-6 space-y-4">
              <WaterGauge
                utilizationPct={utilizationPct}
                nominalCapacityM3s={selectedConduit.nominalCapacityM3s}
                currentFlowM3s={currentFlow}
              />
              <SegmentMiniMap
                segmentId={selectedConduit.id}
                fromNode={selectedConduit.fromNode}
                toNode={selectedConduit.toNode}
                isOverloaded={isOverloaded}
              />
            </div>
          </div>

          {/* Bottom Row: Flow Profile Chart & Bottleneck Ranking Model */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SegmentFlowProfileChart
              lengthM={selectedConduit.lengthM}
              nominalCapacityM3s={selectedConduit.nominalCapacityM3s}
              currentFlowM3s={currentFlow}
            />
            <BottleneckRankingCard
              weights={b.weights}
              onWeightChange={b.setWeight}
              rankedBottlenecks={b.rankings}
              selectedId={selectedConduit.id}
              onSelectId={setSelectedConduitId}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Upstream Network */}
      {activeTab === 'upstream' && (
        <div className="p-6 rounded-xl border border-border bg-surface shadow-offset text-xs text-ink space-y-3">
          <h3 className="font-display font-bold text-sm">Contributing Upstream Reach</h3>
          <p className="text-ink-muted">
            Inflow arrives from node <strong className="text-ink font-mono">{selectedConduit.fromNode}</strong> collecting tertiary road runoff across 42 hectares of high-density impervious urban surface.
          </p>
        </div>
      )}

      {/* Tab 3: Downstream Network */}
      {activeTab === 'downstream' && (
        <div className="p-6 rounded-xl border border-border bg-surface shadow-offset text-xs text-ink space-y-3">
          <h3 className="font-display font-bold text-sm">Discharge Route & Valleys</h3>
          <p className="text-ink-muted">
            Discharges via node <strong className="text-ink font-mono">{selectedConduit.toNode}</strong> along the central storm axis toward the Bellandur lake outfall culvert.
          </p>
        </div>
      )}

      {/* Tab 4: Related Hotspots */}
      {activeTab === 'hotspots' && (
        <div className="p-6 rounded-xl border border-border bg-surface shadow-offset text-xs text-ink space-y-3">
          <h3 className="font-display font-bold text-sm">Modeled Surface Water Accumulation</h3>
          <p className="text-ink-muted">
            Capacity exceedance on segment <strong className="text-ink font-mono">{selectedConduit.id}</strong> directly contributes to a 150m surface ponding cluster at the adjacent intersection.
          </p>
        </div>
      )}
    </div>
  );
};
