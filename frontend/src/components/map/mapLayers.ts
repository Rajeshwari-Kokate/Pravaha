/**
 * mapLayers.ts
 * Helper functions and layer definitions for MapLibre map rendering,
 * including brand color tokens, dashed synthetic lines, and flowing animation.
 */
import type { Map } from 'maplibre-gl';

export const LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
export const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export const FALLBACK_STYLE: any = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#1C2620',
      },
    },
  ],
};

export const ACCUMULATION_RAMP = {
  low: '#B8CFB3',      // sage-300
  moderate: '#E8C468', // amber tint
  high: '#E0803A',     // orange
  veryHigh: '#B3261E', // critical red
};

export function setupMapSources(map: Map, data: {
  studyArea?: any;
  roads?: any;
  drainage?: any;
  assets?: any;
  hotspots?: any;
}) {
  if (data.studyArea && !map.getSource('study-src')) {
    map.addSource('study-src', { type: 'geojson', data: data.studyArea });
  }
  if (data.roads && !map.getSource('roads-src')) {
    map.addSource('roads-src', { type: 'geojson', data: data.roads });
  }
  if (data.drainage && !map.getSource('drainage-src')) {
    map.addSource('drainage-src', { type: 'geojson', data: data.drainage });
  }
  if (data.assets && !map.getSource('assets-src')) {
    map.addSource('assets-src', { type: 'geojson', data: data.assets });
  }
  if (data.hotspots && !map.getSource('hotspots-src')) {
    map.addSource('hotspots-src', { type: 'geojson', data: data.hotspots });
  }
}

export function addMapLayers(
  map: Map,
  isDark: boolean,
  layersVisibility: { drainage: boolean; roads: boolean; assets: boolean; hotspots: boolean },
  selectedFeatureId?: string | null
) {
  // 1. Study Area boundary
  if (map.getSource('study-src') && !map.getLayer('study-area-layer')) {
    map.addLayer({
      id: 'study-area-layer',
      type: 'line',
      source: 'study-src',
      paint: {
        'line-color': isDark ? '#84A282' : '#4F6B52',
        'line-width': 1.5,
        'line-dasharray': [4, 4],
        'line-opacity': 0.7,
      },
    });
  }

  // 2. Road Network
  if (map.getSource('roads-src') && !map.getLayer('roads-layer')) {
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
        'line-color': isDark ? '#3A4A40' : '#CBD5E1',
        'line-width': ['match', ['get', 'highway'], 'primary', 3.0, 'secondary', 2.2, 1.2],
        'line-opacity': 0.75,
      },
    });
  }

  // 3. Synthetic Drainage Network Highlight Casing
  if (map.getSource('drainage-src') && !map.getLayer('drainage-highlight-layer')) {
    map.addLayer({
      id: 'drainage-highlight-layer',
      type: 'line',
      source: 'drainage-src',
      filter: ['==', ['get', 'id'], selectedFeatureId || ''],
      paint: {
        'line-color': '#F6E2E9',
        'line-width': 9,
        'line-opacity': 0.85,
      },
    });
  }

  // 4. Synthetic Drainage Network Base (dashed lines)
  if (map.getSource('drainage-src') && !map.getLayer('drainage-layer')) {
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
        'line-dasharray': [3, 2],
        'line-width': ['match', ['get', 'channel_type'], 'trunk', 4.5, 'primary', 3.2, 2.2],
        'line-color': [
          'case',
          ['>', ['get', 'blockage_factor'], 0.4], '#B3261E', // critical
          ['>', ['get', 'blockage_factor'], 0.2], '#C98A1B', // warning
          isDark ? '#6FC0D0' : '#3A7F8F',                    // flowing water
        ],
      },
    });
  }

  // 5. Civic & Emergency Assets
  if (map.getSource('assets-src') && !map.getLayer('assets-layer')) {
    map.addLayer({
      id: 'assets-layer',
      type: 'circle',
      source: 'assets-src',
      layout: {
        visibility: layersVisibility.assets ? 'visible' : 'none',
      },
      paint: {
        'circle-radius': 5.5,
        'circle-stroke-width': 2,
        'circle-stroke-color': isDark ? '#1C2620' : '#FEFAF3',
        'circle-color': [
          'match',
          ['get', 'category'],
          'hospital', '#B3261E',
          'fire_station', '#E0803A',
          'substation', '#C98A1B',
          'transit', '#3A7F8F',
          '#84A282',
        ],
      },
    });
  }

  // 6. Modeled Hotspots Layer (Discrete sequential ramp)
  if (map.getSource('hotspots-src') && !map.getLayer('hotspots-layer')) {
    map.addLayer({
      id: 'hotspots-layer',
      type: 'circle',
      source: 'hotspots-src',
      layout: {
        visibility: layersVisibility.hotspots ? 'visible' : 'none',
      },
      paint: {
        'circle-radius': 14,
        'circle-color': [
          'case',
          ['>=', ['coalesce', ['get', 'accumulation'], 0], 80], ACCUMULATION_RAMP.veryHigh,
          ['>=', ['coalesce', ['get', 'accumulation'], 0], 50], ACCUMULATION_RAMP.high,
          ['>=', ['coalesce', ['get', 'accumulation'], 0], 25], ACCUMULATION_RAMP.moderate,
          ACCUMULATION_RAMP.low,
        ],
        'circle-opacity': 0.65,
        'circle-stroke-width': 1.5,
        'circle-stroke-color': isDark ? '#FEFAF3' : '#24302A',
      },
    });
  }
}
