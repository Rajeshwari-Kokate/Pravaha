/**
 * LayersPanel.tsx
 * Floating overlay panel over the top-left of the map for toggling
 * spatial layers and basemap styles.
 */
import { useState, type FC } from 'react';
import { Layers, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface LayersPanelProps {
  layersVisibility: {
    drainage: boolean;
    roads: boolean;
    assets: boolean;
    hotspots: boolean;
  };
  onToggleLayer: (layer: keyof LayersPanelProps['layersVisibility']) => void;
}

export const LayersPanel: FC<LayersPanelProps> = ({
  layersVisibility,
  onToggleLayer,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { isDark, toggleTheme } = useTheme();

  const layersList = [
    {
      key: 'drainage' as const,
      label: 'Drainage Network',
      dotCls: 'border-t-2 border-dashed border-water w-3 h-1',
      active: layersVisibility.drainage,
      note: 'Synthetic',
    },
    {
      key: 'roads' as const,
      label: 'Road Network',
      dotCls: 'w-3 h-0.5 bg-ink-muted',
      active: layersVisibility.roads,
    },
    {
      key: 'hotspots' as const,
      label: 'Simulated Flooding',
      dotCls: 'w-2.5 h-2.5 rounded-full bg-critical',
      active: layersVisibility.hotspots,
    },
    {
      key: 'assets' as const,
      label: 'Key Infrastructure',
      dotCls: 'w-2.5 h-2.5 rounded-full bg-sage-500',
      active: layersVisibility.assets,
    },
  ];

  return (
    <div className="absolute top-4 left-4 z-20 w-64 bg-surface/95 backdrop-blur-sm border border-border rounded-xl shadow-offset select-none transition-all">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-ink border-b border-border/60 hover:bg-pink/30 rounded-t-xl transition-colors"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-sage-700" />
          <span className="font-display tracking-tight text-sm">Layers</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-ink-muted" /> : <ChevronDown className="w-4 h-4 text-ink-muted" />}
      </button>

      {isOpen && (
        <div className="p-3 flex flex-col gap-2.5 text-xs">
          {/* Layer toggles */}
          <div className="flex flex-col gap-1.5">
            {layersList.map(layer => (
              <button
                key={layer.key}
                type="button"
                onClick={() => onToggleLayer(layer.key)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg border text-left transition-all ${
                  layer.active
                    ? 'border-border bg-sage-300/30 text-ink font-medium'
                    : 'border-border/60 bg-background/50 text-ink-muted hover:text-ink'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={layer.dotCls} />
                  <span>{layer.label}</span>
                  {layer.note && (
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-background border border-border text-ink-muted">
                      {layer.note}
                    </span>
                  )}
                </div>
                {layer.active ? <Eye className="w-3.5 h-3.5 text-sage-700" /> : <EyeOff className="w-3.5 h-3.5 text-ink-muted" />}
              </button>
            ))}

            {/* Surface Elevation (Disabled / honest unavailable state) */}
            <div
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg border border-border/40 bg-background/30 text-ink-muted opacity-70 cursor-not-allowed"
              title="Digital Elevation Model data currently unavailable for this catchment"
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 border-t border-dotted border-ink-muted" />
                <span>Surface Elevation</span>
              </div>
              <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-background border border-border">
                No DEM
              </span>
            </div>
          </div>

          {/* Base Map Select */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
            <span className="text-ink-muted font-medium">Base Map:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => isDark && toggleTheme()}
                className={`px-2 py-0.5 rounded border text-[11px] font-mono transition-all ${
                  !isDark
                    ? 'bg-sage-500 text-ink font-bold border-ink'
                    : 'bg-background border-border text-ink-muted hover:text-ink'
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => !isDark && toggleTheme()}
                className={`px-2 py-0.5 rounded border text-[11px] font-mono transition-all ${
                  isDark
                    ? 'bg-sage-500 text-ink font-bold border-ink'
                    : 'bg-background border-border text-ink-muted hover:text-ink'
                }`}
              >
                Dark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
