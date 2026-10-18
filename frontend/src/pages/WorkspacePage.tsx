import { type FC } from 'react';
import { Layers, Activity, Play, RotateCcw, AlertTriangle } from 'lucide-react';

export const WorkspacePage: FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-100 dark:bg-[#070b12]">
      {/* Top utility bar */}
      <div className="h-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-teal-600 dark:text-teal-400">WORKSPACE</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium">Study Area: Koramangala Catchment (Bengaluru)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-amber-300/60 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-mono text-[10px]">
            <AlertTriangle className="w-3 h-3" />
            <span>Synthetic Network</span>
          </span>
        </div>
      </div>

      {/* Main 3-column / center map container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Layers and Scenarios */}
        <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 overflow-y-auto hidden md:block">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Layers & Scenarios
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Layers</span>
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-teal-600" />
                  <span>Synthetic Drainage Network</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-teal-600" />
                  <span>Road Infrastructure</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-teal-600" />
                  <span>Civic & Emergency Assets</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-teal-600" />
                  <span>Modeled Hotspot Polygons</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Map Area */}
        <div className="flex-1 relative flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-950 p-4">
          <div className="text-center space-y-3 p-6 max-w-sm rounded-md bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
            <Activity className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Map Viewport Initializing</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive MapLibre GL engine with asset query and hotspot overlay initializes in Phase 3.
            </p>
          </div>
        </div>

        {/* Right Panel: Feature Details & KPI Cards */}
        <div className="w-72 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 overflow-y-auto hidden lg:block">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Feature Inspector
            </span>
          </div>
          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Select an asset, drainage conduit, or road segment on the map to inspect properties and upstream contributing factors.
          </div>
        </div>
      </div>

      {/* Bottom Panel: Scrubber & Metrics */}
      <div className="h-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white transition-colors"
            aria-label="Play simulation timeline"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-2 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Reset simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 ml-2">
            Timeline: T+00m (Pre-storm)
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
          <span>Segments Exceeding Capacity: 0 / 142</span>
          <span>Affected Roads: 0 / 98</span>
        </div>
      </div>
    </div>
  );
};
