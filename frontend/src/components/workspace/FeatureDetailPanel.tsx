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
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500">
        <Layers className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-xs font-medium">Select an asset or conduit on the map to inspect its hydraulic attributes.</p>
      </div>
    );
  }

  const { type, id, name, properties } = feature;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-teal-600 dark:text-teal-400 uppercase font-semibold">
            <span>{type}</span>
            <span>/</span>
            <span>{id}</span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{name || id}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close feature details"
          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-5 text-xs">
        {/* Synthetic Warning Badge for Drainage */}
        {type === 'drainage' && (
          <div className="p-2.5 rounded-md border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Synthetic Infrastructure Layer</span>
            </div>
            <p className="text-[11px] leading-tight text-amber-800 dark:text-amber-300">
              Conduit cross-section and flow capacity are deterministically generated from road centerlines (Seed 42).
              Not derived from municipal underground surveys.
            </p>
          </div>
        )}

        {/* Drainage Attributes */}
        {type === 'drainage' && (
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Hydraulic Parameters
            </h3>
            <div className="grid grid-cols-2 gap-3 p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Nominal Cap.</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {properties.nominal_capacity_m3s} m³/s
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Effective Cap.</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">
                  {properties.effective_capacity_m3s} m³/s
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Blockage</span>
                <span className={`font-bold ${properties.blockage_factor > 0.3 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                  {Math.round((properties.blockage_factor || 0) * 100)}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Length</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{properties.length_m} m</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Channel Type</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{properties.channel_type}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Hydraulic Slope</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{properties.slope_pct}%</span>
              </div>
            </div>

            {/* Topological Nodes */}
            <div className="space-y-1.5 pt-1">
              <span className="font-mono text-[10px] text-slate-400 uppercase">Graph Connectivity</span>
              <div className="p-2.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Inflow Node:</span>
                  <span className="text-slate-800 dark:text-slate-200">{properties.from_node}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Discharge Node:</span>
                  <span className="text-slate-800 dark:text-slate-200">{properties.to_node}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Road Attributes */}
        {type === 'road' && (
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Roadway Properties
            </h3>
            <div className="space-y-2 p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Hierarchy:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">{properties.highway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Segment Length:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{properties.length_m} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Provenance:</span>
                <span className="text-teal-600 dark:text-teal-400">OpenStreetMap</span>
              </div>
            </div>
          </div>
        )}

        {/* Asset Attributes */}
        {type === 'asset' && (
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Civic Infrastructure
            </h3>
            <div className="space-y-2 p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">{properties.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Criticality:</span>
                <span className="font-semibold text-red-600 dark:text-red-400">High Civic Priority</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
