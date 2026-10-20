import { type FC } from 'react';
import { X, AlertTriangle, Layers } from 'lucide-react';
import type { SelectedFeature } from '../map/MapLibreView';

interface FeatureDetailPanelProps {
  feature: SelectedFeature | null;
  onClose: () => void;
}

export const FeatureDetailPanel: FC<FeatureDetailPanelProps> = ({ feature, onClose }) => {
  if (!feature) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-ink-muted">
        <Layers className="w-8 h-8 mb-2 opacity-50 text-sage-700" />
        <p className="text-xs font-medium">Select an asset or conduit on the map to inspect its hydraulic attributes.</p>
      </div>
    );
  }

  const { type, id, name, properties } = feature;

  return (
    <div className="h-full flex flex-col bg-surface border-l border-border overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-sage-700 uppercase font-semibold">
            <span>{type}</span>
            <span>/</span>
            <span>{id}</span>
          </div>
          <h2 className="text-sm font-bold text-ink mt-0.5">{name || id}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close feature details"
          className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-pink/40 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-5 text-xs">
        {/* Synthetic Warning Badge for Drainage */}
        {type === 'drainage' && (
          <div className="p-2.5 rounded-lg border border-amber/40 bg-amber/10 text-ink space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber">
              <AlertTriangle className="w-3.5 h-3.5 text-amber" />
              <span>Synthetic Infrastructure Layer</span>
            </div>
            <p className="text-[11px] leading-tight text-ink">
              Conduit cross-section and flow capacity are deterministically generated from road centerlines (Seed 42).
              Not derived from municipal underground surveys.
            </p>
          </div>
        )}

        {/* Drainage Attributes */}
        {type === 'drainage' && (
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-muted font-semibold">
              Hydraulic Parameters
            </h3>
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-border bg-background font-mono text-[11px]">
              <div>
                <span className="text-ink-muted block text-[10px]">Nominal Cap.</span>
                <span className="font-bold text-ink">
                  {properties.nominal_capacity_m3s} m³/s
                </span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px]">Effective Cap.</span>
                <span className="font-bold text-sage-700">
                  {properties.effective_capacity_m3s} m³/s
                </span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px]">Blockage</span>
                <span className={`font-bold ${properties.blockage_factor > 0.3 ? 'text-critical' : 'text-ink'}`}>
                  {Math.round((properties.blockage_factor || 0) * 100)}%
                </span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px]">Length</span>
                <span className="font-bold text-ink">{properties.length_m} m</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px]">Channel Type</span>
                <span className="font-bold text-ink uppercase">{properties.channel_type}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px]">Hydraulic Slope</span>
                <span className="font-bold text-ink">{properties.slope_pct}%</span>
              </div>
            </div>

            {/* Topological Nodes */}
            <div className="space-y-1.5 pt-1">
              <span className="font-mono text-[10px] text-ink-muted uppercase">Graph Connectivity</span>
              <div className="p-2.5 rounded-lg border border-border bg-background text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Inflow Node:</span>
                  <span className="text-ink">{properties.from_node}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Discharge Node:</span>
                  <span className="text-ink">{properties.to_node}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Road Attributes */}
        {type === 'road' && (
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-muted font-semibold">
              Roadway Properties
            </h3>
            <div className="space-y-2 p-3 rounded-lg border border-border bg-background font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-ink-muted">Hierarchy:</span>
                <span className="font-semibold text-ink uppercase">{properties.highway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Segment Length:</span>
                <span className="font-semibold text-ink">{properties.length_m} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Provenance:</span>
                <span className="text-sage-700">OpenStreetMap</span>
              </div>
            </div>
          </div>
        )}

        {/* Asset Attributes */}
        {type === 'asset' && (
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-muted font-semibold">
              Civic Infrastructure
            </h3>
            <div className="space-y-2 p-3 rounded-lg border border-border bg-background font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-ink-muted">Category:</span>
                <span className="font-semibold text-ink uppercase">{properties.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Criticality:</span>
                <span className="font-semibold text-critical">High Civic Priority</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
