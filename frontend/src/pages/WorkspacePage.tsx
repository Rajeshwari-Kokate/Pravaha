import { useState, type FC } from 'react';
import { Layers, AlertTriangle, Play, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { MapLibreView, type SelectedFeature } from '../components/map/MapLibreView';
import { FeatureDetailPanel } from '../components/workspace/FeatureDetailPanel';

export const WorkspacePage: FC = () => {
  const [layersVisibility, setLayersVisibility] = useState({
    drainage: true,
    roads: true,
    assets: true,
    hotspots: true,
  });

  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);

  const toggleLayer = (layerKey: keyof typeof layersVisibility) => {
    setLayersVisibility(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-100 dark:bg-[#070b12]">
      {/* Top Utility Bar */}
      <div className="h-10 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-teal-600 dark:text-teal-400">WORKSPACE</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">
            Demonstration Catchment: Koramangala (Bengaluru)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-amber-300/60 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-mono text-[10px]">
            <AlertTriangle className="w-3 h-3" />
            <span>Synthetic Drainage Layer</span>
          </span>
        </div>
      </div>

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: Layers and Controls */}
        <div className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col z-20 overflow-y-auto hidden md:flex">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Layer Controls
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Vector Data Layers
              </span>

              {/* Layer Toggles */}
              <div className="space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => toggleLayer('drainage')}
                  className={`w-full flex items-center justify-between p-2 rounded-md border text-left transition-colors ${
                    layersVisibility.drainage
                      ? 'border-teal-500/40 bg-teal-50/50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 border-t-2 border-dashed border-teal-500" />
                    <span className="font-medium">Synthetic Drainage</span>
                  </div>
                  {layersVisibility.drainage ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => toggleLayer('roads')}
                  className={`w-full flex items-center justify-between p-2 rounded-md border text-left transition-colors ${
                    layersVisibility.roads
                      ? 'border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-slate-400 dark:bg-slate-500" />
                    <span className="font-medium">OSM Road Network</span>
                  </div>
                  {layersVisibility.roads ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => toggleLayer('assets')}
                  className={`w-full flex items-center justify-between p-2 rounded-md border text-left transition-colors ${
                    layersVisibility.assets
                      ? 'border-indigo-400/40 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="font-medium">Civic & Emergency Assets</span>
                  </div>
                  {layersVisibility.assets ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => toggleLayer('hotspots')}
                  className={`w-full flex items-center justify-between p-2 rounded-md border text-left transition-colors ${
                    layersVisibility.hotspots
                      ? 'border-red-400/40 bg-red-50/50 dark:bg-red-950/30 text-red-900 dark:text-red-200'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 opacity-60" />
                    <span className="font-medium">Modeled Hotspots</span>
                  </div>
                  {layersVisibility.hotspots ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Catchment Info */}
            <div className="p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[11px] font-mono space-y-1 text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Catchment Area:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">10.45 km²</span>
              </div>
              <div className="flex justify-between">
                <span>Total Conduits:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">14 Segments</span>
              </div>
              <div className="flex justify-between">
                <span>Outfall Axis:</span>
                <span className="font-semibold text-teal-600">Bellandur Valley</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Map Area */}
        <div className="flex-1 h-full relative">
          <MapLibreView
            layersVisibility={layersVisibility}
            selectedFeatureId={selectedFeature?.id}
            onSelectFeature={setSelectedFeature}
          />
        </div>

        {/* Right Panel: Feature Details */}
        <div className="w-80 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-20 hidden lg:block">
          <FeatureDetailPanel
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        </div>
      </div>

      {/* Bottom Timeline & KPI Scrubber */}
      <div className="h-14 shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 flex items-center justify-between text-xs z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-1.5 rounded-md bg-teal-600 hover:bg-teal-700 text-white transition-colors"
            aria-label="Play simulation timeline"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Reset simulation timeline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            Timeline: T+00m (Pre-storm baseline)
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-5 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
          <div>
            <span>Exceedance: </span>
            <span className="font-bold text-teal-600 dark:text-teal-400">0 of 14 Conduits</span>
          </div>
          <div>
            <span>Affected Roads: </span>
            <span className="font-bold text-teal-600 dark:text-teal-400">0 of 11 Corridors</span>
          </div>
        </div>
      </div>
    </div>
  );
};
