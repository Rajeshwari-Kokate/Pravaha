import { useEffect, useRef, useState, type FC } from 'react';
import { Map, type StyleSpecification } from 'maplibre-gl';
import { Search, AlertTriangle, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export interface SelectedFeature {
  type: 'drainage' | 'road' | 'asset' | 'hotspot';
  id: string;
  name?: string;
  properties: Record<string, any>;
  coordinates?: [number, number] | [number, number][];
}

interface MapLibreViewProps {
  layersVisibility: {
    drainage: boolean;
    roads: boolean;
    assets: boolean;
    hotspots: boolean;
  };
  selectedFeatureId?: string | null;
  onSelectFeature?: (feature: SelectedFeature | null) => void;
  hotspotsGeoJSON?: any;
  className?: string;
}

const LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const FALLBACK_STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#0f172a',
      },
    },
  ],
};

export const MapLibreView: FC<MapLibreViewProps> = ({
  layersVisibility,
  selectedFeatureId,
  onSelectFeature,
  hotspotsGeoJSON,
  className = '',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const { isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [tileError, setTileError] = useState(false);
  const [loadedData, setLoadedData] = useState<{
    drainage?: any;
    roads?: any;
    assets?: any;
    studyArea?: any;
  }>({});

  // 1. Fetch GeoJSON layers
  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const basePath = import.meta.env.BASE_URL || '/';
        const cleanBase = basePath.endsWith('/') ? basePath : `${basePath}/`;

        const [drainageRes, roadsRes, assetsRes, studyRes] = await Promise.all([
          fetch(`${cleanBase}data/drainage_network.geojson`),
          fetch(`${cleanBase}data/roads.geojson`),
          fetch(`${cleanBase}data/public_assets.geojson`),
          fetch(`${cleanBase}data/study_area.geojson`),
        ]);

        const [drainage, roads, assets, studyArea] = await Promise.all([
          drainageRes.json(),
          roadsRes.json(),
          assetsRes.json(),
          studyRes.json(),
        ]);

        setLoadedData({ drainage, roads, assets, studyArea });
      } catch (err) {
        console.error('Failed to load spatial GeoJSON data:', err);
      }
    };

    loadGeoData();
  }, []);

  // 2. Initialize Map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const initialStyle = isDark ? DARK_STYLE : LIGHT_STYLE;

    const map = new Map({
      container: mapContainer.current,
      style: initialStyle,
      center: [77.6255, 12.9340], // Koramangala, Bengaluru
      zoom: 14.2,
      minZoom: 12,
      maxZoom: 18,
      attributionControl: {
        compact: true,
        customAttribution: 'OpenStreetMap contributors, CARTO',
      },
    });

    map.on('error', (e: any) => {
      // Catch tile loading errors
      if (e.error?.message?.includes('tile') || e.error?.message?.includes('fetch')) {
        setTileError(true);
        if (!map.isStyleLoaded()) {
          map.setStyle(FALLBACK_STYLE);
        }
      }
    });

    map.on('load', () => {
      addCustomLayers(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 3. Switch map style on theme change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const targetStyle = isDark ? DARK_STYLE : LIGHT_STYLE;
    map.setStyle(targetStyle);

    map.once('style.load', () => {
      addCustomLayers(map);
    });
  }, [isDark]);

  // Helper to add GeoJSON vector sources and layers
  const addCustomLayers = (map: Map) => {
    if (!loadedData.drainage) return;

    // Remove existing if any
    const layerIds = [
      'drainage-highlight-layer',
      'drainage-layer',
      'roads-layer',
      'study-area-layer',
      'assets-layer',
      'hotspots-layer',
    ];
    const sourceIds = ['drainage-src', 'roads-src', 'assets-src', 'study-src', 'hotspots-src'];

    layerIds.forEach(id => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    sourceIds.forEach(id => {
      if (map.getSource(id)) map.removeSource(id);
    });

    // 1. Study Area
    if (loadedData.studyArea) {
      map.addSource('study-src', { type: 'geojson', data: loadedData.studyArea });
      map.addLayer({
        id: 'study-area-layer',
        type: 'line',
        source: 'study-src',
        paint: {
          'line-color': '#0d9488',
          'line-width': 1.5,
          'line-dasharray': [4, 4],
          'line-opacity': 0.6,
        },
      });
    }

    // 2. Road Network
    if (loadedData.roads) {
      map.addSource('roads-src', { type: 'geojson', data: loadedData.roads });
      map.addLayer({
        id: 'roads-layer',
        type: 'line',
        source: 'roads-src',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: layersVisibility.roads ? 'visible' : 'none',
        },
        paint: {
          'line-color': isDark ? '#475569' : '#94a3b8',
          'line-width': [
            'match',
            ['get', 'highway'],
            'primary', 3.5,
            'secondary', 2.5,
            'tertiary', 1.8,
            1.2
          ],
          'line-opacity': 0.7,
        },
      });
    }

    // 3. Synthetic Drainage Network
    map.addSource('drainage-src', { type: 'geojson', data: loadedData.drainage });

    // Highlight casing layer for selected segment
    map.addLayer({
      id: 'drainage-highlight-layer',
      type: 'line',
      source: 'drainage-src',
      filter: ['==', ['get', 'id'], selectedFeatureId || ''],
      paint: {
        'line-color': '#38bdf8',
        'line-width': 8,
        'line-opacity': 0.75,
      },
    });

    // Main dashed synthetic drainage lines
    map.addLayer({
      id: 'drainage-layer',
      type: 'line',
      source: 'drainage-src',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
        visibility: layersVisibility.drainage ? 'visible' : 'none',
      },
      paint: {
        // Distinct dashed line symbology for synthetic infrastructure
        'line-dasharray': [3, 2],
        'line-width': [
          'match',
          ['get', 'channel_type'],
          'trunk', 4.5,
          'primary', 3.2,
          2.2
        ],
        'line-color': [
          'case',
          ['>', ['get', 'blockage_factor'], 0.4], '#ef4444', // Red for critical blockage
          ['>', ['get', 'blockage_factor'], 0.2], '#f59e0b', // Amber for warning
          '#14b8a6' // Standard teal for normal conveyance
        ],
      },
    });

    // 4. Civic & Emergency Assets
    if (loadedData.assets) {
      map.addSource('assets-src', { type: 'geojson', data: loadedData.assets });
      map.addLayer({
        id: 'assets-layer',
        type: 'circle',
        source: 'assets-src',
        layout: {
          visibility: layersVisibility.assets ? 'visible' : 'none',
        },
        paint: {
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-color': [
            'match',
            ['get', 'category'],
            'hospital', '#dc2626',
            'fire_station', '#ea580c',
            'substation', '#eab308',
            'transit', '#0284c7',
            '#0d9488'
          ],
        },
      });
    }

    // 5. Hotspots layer (if available)
    if (hotspotsGeoJSON) {
      map.addSource('hotspots-src', { type: 'geojson', data: hotspotsGeoJSON });
      map.addLayer({
        id: 'hotspots-layer',
        type: 'circle',
        source: 'hotspots-src',
        layout: {
          visibility: layersVisibility.hotspots ? 'visible' : 'none',
        },
        paint: {
          'circle-radius': 14,
          'circle-color': '#dc2626',
          'circle-opacity': 0.45,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ef4444',
        },
      });
    }

    // Interactive Click Handler
    const clickableLayers = ['drainage-layer', 'roads-layer', 'assets-layer'];
    clickableLayers.forEach(layerId => {
      map.on('click', layerId, (e) => {
        if (!e.features || e.features.length === 0) return;
        const feat = e.features[0];
        const props = feat.properties as Record<string, any>;
        const geom = feat.geometry;

        const type =
          layerId === 'drainage-layer'
            ? 'drainage'
            : layerId === 'roads-layer'
            ? 'road'
            : 'asset';

        if (onSelectFeature) {
          onSelectFeature({
            type,
            id: props.id || 'UNKNOWN',
            name: props.name || props.id,
            properties: props,
            coordinates: geom.type === 'Point' ? (geom as any).coordinates : undefined,
          });
        }
      });

      map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
      });
    });
  };

  // Re-run layers when loadedData or layersVisibility updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('drainage-layer')) {
      map.setLayoutProperty('drainage-layer', 'visibility', layersVisibility.drainage ? 'visible' : 'none');
    }
    if (map.getLayer('roads-layer')) {
      map.setLayoutProperty('roads-layer', 'visibility', layersVisibility.roads ? 'visible' : 'none');
    }
    if (map.getLayer('assets-layer')) {
      map.setLayoutProperty('assets-layer', 'visibility', layersVisibility.assets ? 'visible' : 'none');
    }
    if (map.getLayer('hotspots-layer')) {
      map.setLayoutProperty('hotspots-layer', 'visibility', layersVisibility.hotspots ? 'visible' : 'none');
    }
  }, [layersVisibility]);

  // Update highlight on selectedFeatureId change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !map.getLayer('drainage-highlight-layer')) return;

    map.setFilter('drainage-highlight-layer', ['==', ['get', 'id'], selectedFeatureId || '']);
  }, [selectedFeatureId]);

  // Search feature handling
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const q = query.toLowerCase();
    const results: any[] = [];

    // Search drainage segments
    loadedData.drainage?.features?.forEach((f: any) => {
      if (f.properties.id?.toLowerCase().includes(q) || f.properties.channel_type?.toLowerCase().includes(q)) {
        results.push({ ...f.properties, _type: 'drainage', _geom: f.geometry });
      }
    });

    // Search roads
    loadedData.roads?.features?.forEach((f: any) => {
      if (f.properties.name?.toLowerCase().includes(q) || f.properties.id?.toLowerCase().includes(q)) {
        results.push({ ...f.properties, _type: 'road', _geom: f.geometry });
      }
    });

    // Search assets
    loadedData.assets?.features?.forEach((f: any) => {
      if (f.properties.name?.toLowerCase().includes(q) || f.properties.id?.toLowerCase().includes(q)) {
        results.push({ ...f.properties, _type: 'asset', _geom: f.geometry });
      }
    });

    setSearchResults(results.slice(0, 6));
  };

  const handleSelectSearchResult = (item: any) => {
    setSearchQuery(item.name || item.id);
    setSearchResults([]);

    const map = mapRef.current;
    if (!map) return;

    let targetCoords: [number, number] | null = null;
    if (item._geom.type === 'Point') {
      targetCoords = item._geom.coordinates;
    } else if (item._geom.type === 'LineString') {
      const midIdx = Math.floor(item._geom.coordinates.length / 2);
      targetCoords = item._geom.coordinates[midIdx];
    }

    if (targetCoords) {
      map.flyTo({ center: targetCoords, zoom: 15.5, speed: 1.2 });
    }

    if (onSelectFeature) {
      onSelectFeature({
        type: item._type,
        id: item.id,
        name: item.name || item.id,
        properties: item,
      });
    }
  };

  const resetView = () => {
    mapRef.current?.flyTo({
      center: [77.6255, 12.9340],
      zoom: 14.2,
      bearing: 0,
      pitch: 0,
      speed: 1.0,
    });
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Map container DOM */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Persistent Synthetic Network Indicator */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-700 shadow-sm backdrop-blur-sm text-[11px] font-mono text-slate-700 dark:text-slate-300">
        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
        <span className="font-semibold">Synthetic Drainage Network</span>
      </div>

      {/* Asset and Segment Search Bar */}
      <div className="absolute top-3 left-3 z-10 w-72">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search segment ID or road..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-teal-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        </div>

        {searchResults.length > 0 && (
          <ul className="mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {searchResults.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                    {item.name || item.id}
                  </span>
                  <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 uppercase">
                    {item._type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-6 right-3 z-10 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => mapRef.current?.zoomIn()}
          aria-label="Zoom in"
          className="p-2 rounded-md bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => mapRef.current?.zoomOut()}
          aria-label="Zoom out"
          className="p-2 rounded-md bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={resetView}
          aria-label="Reset map view"
          className="p-2 rounded-md bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Offline / Tile Fallback Notice */}
      {tileError && (
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 p-2.5 rounded-md bg-amber-50 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs shadow-md">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Basemap tiles unreachable. Vector infrastructure layers rendered on local canvas.</span>
        </div>
      )}
    </div>
  );
};
