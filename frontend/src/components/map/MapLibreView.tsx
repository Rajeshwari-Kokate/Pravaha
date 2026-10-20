/**
 * MapLibreView.tsx
 * Interactive MapLibre GL map view with modular layers, flowing drainage animation,
 * tactile controls, and subtle rainfall overlay.
 */
import { useEffect, useRef, useState, type FC } from 'react';
import { Map } from 'maplibre-gl';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { LIGHT_STYLE, DARK_STYLE, FALLBACK_STYLE, setupMapSources, addMapLayers } from './mapLayers';
import { RainOverlay } from './RainOverlay';
import { MapZoomControls } from './MapZoomControls';

export interface SelectedFeature {
  type: 'drainage' | 'road' | 'asset' | 'hotspot';
  id: string;
  name?: string;
  properties: Record<string, any>;
  coordinates?: [number, number] | [number, number][];
}

interface MapLibreViewProps {
  layersVisibility: { drainage: boolean; roads: boolean; assets: boolean; hotspots: boolean };
  selectedFeatureId?: string | null;
  onSelectFeature?: (feature: SelectedFeature | null) => void;
  hotspotsGeoJSON?: any;
  isPlaying?: boolean;
  rainfallIntensityMmHr?: number;
  rainEffectEnabled?: boolean;
  conduitResults?: any[];
  className?: string;
}

export const MapLibreView: FC<MapLibreViewProps> = ({
  layersVisibility,
  selectedFeatureId,
  onSelectFeature,
  hotspotsGeoJSON,
  isPlaying = false,
  rainfallIntensityMmHr = 0,
  rainEffectEnabled = true,
  conduitResults = [],
  className = '',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const { isDark } = useTheme();
  const [tileError, setTileError] = useState(false);
  const [loadedData, setLoadedData] = useState<{ studyArea?: any; roads?: any; drainage?: any; assets?: any }>({});

  // 1. Fetch GeoJSON layers
  useEffect(() => {
    const basePath = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
    Promise.all([
      fetch(`${basePath}data/study_area.geojson`).then(r => r.json()).catch(() => null),
      fetch(`${basePath}data/roads.geojson`).then(r => r.json()).catch(() => null),
      fetch(`${basePath}data/drainage_network.geojson`).then(r => r.json()).catch(() => null),
      fetch(`${basePath}data/public_assets.geojson`).then(r => r.json()).catch(() => null),
    ]).then(([studyArea, roads, drainage, assets]) => {
      setLoadedData({ studyArea, roads, drainage, assets });
    });
  }, []);

  const [webglError, setWebglError] = useState(false);

  // 2. Initialize Map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    try {
      const map = new Map({
        container: mapContainer.current,
        style: isDark ? DARK_STYLE : LIGHT_STYLE,
        center: [77.6255, 12.9340],
        zoom: 14.2,
        minZoom: 12,
        maxZoom: 18,
        attributionControl: { compact: true, customAttribution: 'OpenStreetMap contributors, CARTO' },
      });

      map.on('error', (e: any) => {
        if (e.error?.message?.includes('tile') || e.error?.message?.includes('fetch')) {
          setTileError(true);
          if (!map.isStyleLoaded()) map.setStyle(FALLBACK_STYLE);
        }
      });

      const initLayers = () => {
        setupMapSources(map, { ...loadedData, hotspots: hotspotsGeoJSON });
        addMapLayers(map, isDark, layersVisibility, selectedFeatureId);
      };

      map.on('load', initLayers);
      mapRef.current = map;
    } catch (err) {
      console.warn('MapLibre WebGL unavailable in current environment:', err);
      setWebglError(true);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);
  // 3. Switch style on theme change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(isDark ? DARK_STYLE : LIGHT_STYLE);
    map.once('style.load', () => {
      setupMapSources(map, { ...loadedData, hotspots: hotspotsGeoJSON });
      addMapLayers(map, isDark, layersVisibility, selectedFeatureId);
    });
  }, [isDark]);
  // 4. Update sources when loadedData or hotspots update
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    setupMapSources(map, { ...loadedData, hotspots: hotspotsGeoJSON });
    addMapLayers(map, isDark, layersVisibility, selectedFeatureId);
  }, [loadedData, hotspotsGeoJSON]);
  // 5. Visibility updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    (['drainage', 'roads', 'assets', 'hotspots'] as const).forEach(key => {
      const id = `${key}-layer`;
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', layersVisibility[key] ? 'visible' : 'none');
      }
    });
  }, [layersVisibility]);

  // 6. Selected feature highlight
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !map.getLayer('drainage-highlight-layer')) return;
    map.setFilter('drainage-highlight-layer', ['==', ['get', 'id'], selectedFeatureId || '']);
  }, [selectedFeatureId]);

  // 7. Click & hover handlers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const clickHandler = (e: any) => {
      if (!e.features?.length) return;
      const feat = e.features[0];
      const type = feat.layer.id === 'drainage-layer' ? 'drainage' : feat.layer.id === 'roads-layer' ? 'road' : 'asset';
      onSelectFeature?.({
        type,
        id: feat.properties.id || 'UNKNOWN',
        name: feat.properties.name || feat.properties.id,
        properties: feat.properties,
        coordinates: feat.geometry.type === 'Point' ? feat.geometry.coordinates : undefined,
      });
    };

    ['drainage-layer', 'roads-layer', 'assets-layer'].forEach(id => {
      map.on('click', id, clickHandler);
    });
    return () => {
      ['drainage-layer', 'roads-layer', 'assets-layer'].forEach(id => {
        map.off('click', id, clickHandler);
      });
    };
  }, [onSelectFeature]);

  // 8. D1: Flowing pipes animation loop
  useEffect(() => {
    const map = mapRef.current;
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!map || prefersReducedMotion || !isPlaying) return;

    let animFrame: number | undefined;
    let step = 0;
    const interval = setInterval(() => {
      if (!map.isStyleLoaded() || !map.getLayer('drainage-layer')) return;
      step = (step + 1) % 4;
      const patterns = [[4, 2], [3, 3], [2, 4], [1, 5]];
      map.setPaintProperty('drainage-layer', 'line-dasharray', patterns[step]);
    }, 180);

    return () => {
      clearInterval(interval);
      if (animFrame !== undefined) cancelAnimationFrame(animFrame);
      if (map.isStyleLoaded() && map.getLayer('drainage-layer')) {
        map.setPaintProperty('drainage-layer', 'line-dasharray', [3, 2]);
      }
    };
  }, [isPlaying]);

  // 9. D1: Line color shifts when utilization passes 100%
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !map.getLayer('drainage-layer') || conduitResults.length === 0) return;

    const overloaded = conduitResults.filter(c => c.isOverloaded || c.flowRatio >= 1.0).map(c => c.conduitId);
    const critical = conduitResults.filter(c => c.flowRatio >= 1.5).map(c => c.conduitId);

    if (overloaded.length > 0) {
      map.setPaintProperty('drainage-layer', 'line-color', [
        'case',
        ['in', ['get', 'id'], ['literal', critical]], '#B3261E',
        ['in', ['get', 'id'], ['literal', overloaded]], '#C98A1B',
        isDark ? '#6FC0D0' : '#3A7F8F',
      ]);
    }
  }, [conduitResults, isDark]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {webglError ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-background p-6 text-center text-xs">
          <div className="p-5 rounded-xl border border-border bg-surface shadow-offset max-w-md flex flex-col items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber" />
            <h3 className="font-display font-bold text-sm text-ink">WebGL Acceleration Unavailable</h3>
            <p className="text-ink-muted leading-relaxed">
              Basemap tiles require WebGL2. Simulation controls, hydraulic modeling, conduit tables, and timeline scrubber remain fully interactive.
            </p>
          </div>
        </div>
      ) : (
        <div ref={mapContainer} className="w-full h-full" />
      )}
      <RainOverlay isPlaying={isPlaying} intensityMmHr={rainfallIntensityMmHr} enabled={rainEffectEnabled} />

      {/* Synthetic Indicator */}
      <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border shadow-offset text-xs font-mono text-ink">
        <span className="w-2 h-2 rounded-full bg-water animate-pulse" />
        <span className="font-semibold">Synthetic Drainage Network</span>
      </div>

      {/* Map Zoom / Reset controls */}
      <MapZoomControls
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onResetView={() => mapRef.current?.flyTo({ center: [77.6255, 12.9340], zoom: 14.2 })}
      />

      {tileError && (
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 p-3 rounded-lg bg-surface border border-amber text-ink text-xs shadow-offset">
          <AlertTriangle className="w-4 h-4 text-amber shrink-0" />
          <span>Basemap tiles unreachable. Vector infrastructure rendered on local canvas.</span>
        </div>
      )}
    </div>
  );
};
