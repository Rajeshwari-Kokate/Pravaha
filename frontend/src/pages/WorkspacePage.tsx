/**
 * WorkspacePage.tsx
 * Master hydraulic flood engineering workspace:
 * Slim sidebar, top bar, MapLibre map with flowing pipes & rain overlay,
 * floating Layers panel, Simulation Controls card, Feature details drawer,
 * and bottom Simulation Results summary.
 */
import { useState, useEffect, type FC } from 'react';
import { Sliders } from 'lucide-react';
import { MapLibreView, type SelectedFeature } from '../components/map/MapLibreView';
import { WorkspaceSidebar } from '../components/workspace/WorkspaceSidebar';
import { WorkspaceTopBar } from '../components/workspace/WorkspaceTopBar';
import { LayersPanel } from '../components/workspace/LayersPanel';
import { SimulationControlsCard } from '../components/workspace/SimulationControlsCard';
import { SimulationResultsPanel } from '../components/workspace/SimulationResultsPanel';
import { FeatureDetailPanel } from '../components/workspace/FeatureDetailPanel';
import { WorkspaceSettingsModal } from '../components/workspace/WorkspaceSettingsModal';
import { WorkspaceHelpModal } from '../components/workspace/WorkspaceHelpModal';
import { GuidedTour } from '../components/workspace/GuidedTour';
import { useSimulation } from '../hooks/useSimulation';

export const WorkspacePage: FC = () => {
  const [layersVisibility, setLayersVisibility] = useState({
    drainage: true,
    roads: true,
    assets: true,
    hotspots: true,
  });

  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [rainEffectEnabled, setRainEffectEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('pravaha-tour-dismissed');
      if (!dismissed) {
        setTourOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleLayer = (layerKey: keyof typeof layersVisibility) => {
    setLayersVisibility(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const sim = useSimulation();
  const totalConduits = sim.result?.conduitResults.length ?? 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-ink">
      {/* 1. Slim Left Navigation Sidebar */}
      <WorkspaceSidebar
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <WorkspaceTopBar
          scenarioName={sim.result?.scenarioName}
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        />

        {/* Workspace Canvas Area: Map + Floating Panels */}
        <div className="flex-1 relative flex overflow-hidden">
          {/* Center MapLibre Map */}
          <div className="flex-1 h-full relative">
            <MapLibreView
              layersVisibility={layersVisibility}
              selectedFeatureId={selectedFeature?.id}
              onSelectFeature={setSelectedFeature}
              isPlaying={sim.isPlaying}
              rainfallIntensityMmHr={sim.params.rainfallIntensityMmHr}
              rainEffectEnabled={rainEffectEnabled}
              conduitResults={sim.result?.conduitResults}
            />

            {/* Top-Left Floating Layers Panel */}
            <LayersPanel
              layersVisibility={layersVisibility}
              onToggleLayer={toggleLayer}
            />

            {/* Mobile Controls Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileControlsOpen(prev => !prev)}
              className="md:hidden absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border shadow-offset text-xs font-bold text-ink"
            >
              <Sliders className="w-4 h-4 text-sage-700" />
              <span>Controls</span>
            </button>

            {/* Simulation Controls Panel (Always visible desktop, toggleable mobile) */}
            <div
              className={`absolute top-4 right-4 z-20 transition-all ${
                mobileControlsOpen ? 'block' : 'hidden md:block'
              }`}
            >
              <SimulationControlsCard
                currentIntensity={sim.params.rainfallIntensityMmHr}
                isLoading={sim.isLoading}
                onSetCustomIntensity={sim.setCustomIntensity}
                onReset={sim.reset}
              />
            </div>
          </div>

          {/* Right Feature Details Drawer (if selected) */}
          {selectedFeature && (
            <div className="w-80 shrink-0 z-30 h-full shadow-offset">
              <FeatureDetailPanel
                feature={selectedFeature}
                onClose={() => setSelectedFeature(null)}
              />
            </div>
          )}
        </div>

        {/* 3. Bottom Simulation Results Summary & Tabs */}
        <SimulationResultsPanel
          result={sim.result}
          _isLoading={sim.isLoading}
          totalConduits={totalConduits}
          activeStep={sim.activeStep}
          isPlaying={sim.isPlaying}
          onPlay={sim.play}
          onPause={sim.pause}
          onReset={sim.reset}
          onSeek={sim.seekStep}
          onSelectConduitId={(id) => {
            const conduit = sim.result?.conduitResults.find(c => c.conduitId === id);
            if (conduit) {
              setSelectedFeature({
                id: conduit.conduitId,
                type: 'drainage',
                name: `Conduit ${conduit.conduitId}`,
                properties: { ...conduit },
              });
            }
          }}
          selectedId={selectedFeature?.id}
        />
      </div>

      {/* Settings Modal */}
      <WorkspaceSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        rainEffectEnabled={rainEffectEnabled}
        onToggleRainEffect={() => setRainEffectEnabled(prev => !prev)}
      />

      {/* Help & Guide Modal */}
      <WorkspaceHelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        onRestartTour={() => {
          localStorage.removeItem('pravaha-tour-dismissed');
          setHelpOpen(false);
          setTourOpen(true);
        }}
      />

      {/* 5-Step Guided Tour */}
      <GuidedTour
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
      />
    </div>
  );
};
