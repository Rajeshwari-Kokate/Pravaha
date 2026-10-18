import { useState, type FC } from 'react';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { MapLibreView, type SelectedFeature } from '../components/map/MapLibreView';
import { FeatureDetailPanel } from '../components/workspace/FeatureDetailPanel';
import { KpiCards } from '../components/workspace/KpiCards';
import { TimelineScrubber } from '../components/workspace/TimelineScrubber';
import { SimulationControls } from '../components/workspace/SimulationControls';
import { useSimulation } from '../hooks/useSimulation';

export const WorkspacePage: FC = () => {
  const [layersVisibility, setLayersVisibility] = useState({
    drainage: true,
    roads:    true,
    assets:   true,
    hotspots: true,
  });

  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);
  const [leftPanelTab, setLeftPanelTab]       = useState<'layers' | 'controls'>('controls');

  const toggleLayer = (layerKey: keyof typeof layersVisibility) => {
    setLayersVisibility(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const sim = useSimulation();
  const totalConduits = sim.result?.conduitResults.length ?? 0;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-100 dark:bg-[#070b12]">

      {/* Top Utility Bar */}
      <div className="h-10 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 flex items-center justify-between text-xs z-30">
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-teal-600 dark:text-teal-400">WORKSPACE</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">
            Koramangala Catchment, Bengaluru
          </span>
        </div>
        <div className="flex items-center gap-3">
          {sim.result && (
            <span className="font-mono text-[10px] text-slate-500">
              Scenario: <strong className="text-slate-700 dark:text-slate-300">{sim.result.scenarioName}</strong>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-amber-300/60 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-mono text-[10px]">
            <AlertTriangle className="w-3 h-3" />
            <span>Synthetic Drainage</span>
          </span>
        </div>
      </div>

      {/* Main 3-Column */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Left Panel */}
        <div className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col z-20 hidden md:flex">

          {/* Tab switcher */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold uppercase tracking-wider">
            <button
              type="button"
              id="left-tab-controls"
              onClick={() => setLeftPanelTab('controls')}
              className={`flex-1 py-2 transition-colors ${
                leftPanelTab === 'controls'
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Controls
            </button>
            <button
              type="button"
              id="left-tab-layers"
              onClick={() => setLeftPanelTab('layers')}
              className={`flex-1 py-2 transition-colors ${
                leftPanelTab === 'layers'
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Layers
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {leftPanelTab === 'controls' ? (
              <SimulationControls
                currentReturnPeriod={sim.params.returnPeriodLabel}
                currentIntensity={sim.params.rainfallIntensityMmHr}
                currentRunoffCoeff={sim.params.globalRunoffCoeff}
                currentAreaHa={sim.params.globalAreaHa}
                isLoading={sim.isLoading}
                onSetReturnPeriod={sim.setReturnPeriod}
                onSetCustomIntensity={sim.setCustomIntensity}
                onSetRunoffCoeff={sim.setRunoffCoeff}
                onSetAreaHa={sim.setAreaHa}
              />
            ) : (
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Vector Data Layers
                </span>
                <div className="space-y-1.5 text-xs">
                  {([
                    { key: 'drainage', label: 'Synthetic Drainage', dot: 'border-t-2 border-dashed border-teal-500 w-3 h-1', activeCls: 'border-teal-500/40 bg-teal-50/50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200' },
                    { key: 'roads',    label: 'OSM Road Network',   dot: 'w-3 h-0.5 bg-slate-400',                            activeCls: 'border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200' },
                    { key: 'assets',   label: 'Civic Assets',       dot: 'w-2 h-2 rounded-full bg-red-500',                   activeCls: 'border-indigo-400/40 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200' },
                    { key: 'hotspots', label: 'Modeled Hotspots',   dot: 'w-2 h-2 rounded-full bg-red-500 opacity-60',        activeCls: 'border-red-400/40 bg-red-50/50 dark:bg-red-950/30 text-red-900 dark:text-red-200' },
                  ] as const).map(({ key, label, dot, activeCls }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleLayer(key as keyof typeof layersVisibility)}
                      className={`w-full flex items-center justify-between p-2 rounded-md border text-left transition-colors ${
                        layersVisibility[key as keyof typeof layersVisibility]
                          ? activeCls
                          : 'border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={dot} />
                        <span className="font-medium">{label}</span>
                      </div>
                      {layersVisibility[key as keyof typeof layersVisibility]
                        ? <Eye className="w-3.5 h-3.5" />
                        : <EyeOff className="w-3.5 h-3.5" />
                      }
                    </button>
                  ))}
                </div>

                {/* Catchment info */}
                <div className="p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[11px] font-mono space-y-1 text-slate-600 dark:text-slate-400 mt-4">
                  <div className="flex justify-between">
                    <span>Total Conduits:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{totalConduits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overloaded:</span>
                    <span className={`font-semibold ${sim.result?.summaryOverloaded ? 'text-red-600' : 'text-emerald-600'}`}>
                      {sim.result?.summaryOverloaded ?? '--'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outfall Axis:</span>
                    <span className="font-semibold text-teal-600">Bellandur Valley</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Map */}
        <div className="flex-1 h-full relative flex flex-col">
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

      {/* Bottom: KPI + Timeline */}
      <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30">
        {/* KPI Strip */}
        <div className="px-4 pt-3 pb-2">
          <KpiCards
            result={sim.result}
            isLoading={sim.isLoading}
            totalConduits={totalConduits}
          />
        </div>

        {/* Timeline scrubber */}
        <div className="px-4 pb-3 border-t border-slate-100 dark:border-slate-800 pt-2">
          <TimelineScrubber
            result={sim.result}
            activeStep={sim.activeStep}
            isPlaying={sim.isPlaying}
            onPlay={sim.play}
            onPause={sim.pause}
            onReset={sim.reset}
            onSeek={sim.seekStep}
          />
        </div>
      </div>
    </div>
  );
};
