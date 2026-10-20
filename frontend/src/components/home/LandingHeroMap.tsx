import { useEffect, useRef, type FC } from 'react';
import { Map } from 'maplibre-gl';
import { useTheme } from '../../hooks/useTheme';
import { Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export const LandingHeroMap: FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new Map({
      container: mapContainer.current,
      style: isDark ? DARK_STYLE : LIGHT_STYLE,
      center: [77.6245, 12.9352], // Koramangala study area
      zoom: 13.8,
      minZoom: 12,
      maxZoom: 18,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', async () => {
      try {
        const basePath = import.meta.env.BASE_URL || '/';
        const cleanBase = basePath.endsWith('/') ? basePath : `${basePath}/`;

        const [drainageRes, studyRes] = await Promise.all([
          fetch(`${cleanBase}data/drainage_network.geojson`),
          fetch(`${cleanBase}data/study_area.geojson`),
        ]);

        if (drainageRes.ok) {
          const drainage = await drainageRes.json();
          if (!map.getSource('drainage')) {
            map.addSource('drainage', { type: 'geojson', data: drainage });
            map.addLayer({
              id: 'drainage-lines',
              type: 'line',
              source: 'drainage',
              paint: {
                'line-color': '#3A7F8F',
                'line-width': 3,
                'line-dasharray': [2, 2],
              },
            });
          }
        }

        if (studyRes.ok) {
          const study = await studyRes.json();
          if (!map.getSource('study-area')) {
            map.addSource('study-area', { type: 'geojson', data: study });
            map.addLayer({
              id: 'study-boundary',
              type: 'line',
              source: 'study-area',
              paint: {
                'line-color': '#84A282',
                'line-width': 1.5,
              },
            });
          }
        }
      } catch (err) {
        console.warn('Hero map data load note:', err);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [isDark]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleReset = () => {
    mapRef.current?.flyTo({ center: [77.6245, 12.9352], zoom: 13.8, duration: 600 });
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] rounded-2xl overflow-hidden border-[1.5px] border-[#24302A] dark:border-[#3A4A40] shadow-[4px_4px_0px_#24302A] dark:shadow-[4px_4px_0px_#0E1410] bg-white dark:bg-[#1C2620]">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Floating Demo Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#FEFAF3] dark:bg-[#25312A] border border-[#24302A] dark:border-[#3A4A40] shadow-[2px_2px_0px_#24302A] dark:shadow-[2px_2px_0px_#0E1410] text-[11px] font-mono font-bold text-[#24302A] dark:text-[#FEFAF3] pointer-events-none">
        <Layers className="w-3.5 h-3.5 text-[#3A7F8F]" />
        <span>Koramangala Demo Network</span>
      </div>

      {/* Map Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="p-1.5 rounded-lg border border-[#24302A] dark:border-[#3A4A40] bg-[#FEFAF3] dark:bg-[#25312A] text-[#24302A] dark:text-[#FEFAF3] shadow-[1px_1px_0px_#24302A] hover:bg-[#F6E2E9] active:translate-y-[1px] transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="p-1.5 rounded-lg border border-[#24302A] dark:border-[#3A4A40] bg-[#FEFAF3] dark:bg-[#25312A] text-[#24302A] dark:text-[#FEFAF3] shadow-[1px_1px_0px_#24302A] hover:bg-[#F6E2E9] active:translate-y-[1px] transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset map view"
          className="p-1.5 rounded-lg border border-[#24302A] dark:border-[#3A4A40] bg-[#FEFAF3] dark:bg-[#25312A] text-[#24302A] dark:text-[#FEFAF3] shadow-[1px_1px_0px_#24302A] hover:bg-[#F6E2E9] active:translate-y-[1px] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Legend strip at bottom */}
      <div className="absolute bottom-3 left-3 right-3 z-10 px-3 py-1.5 rounded-lg bg-[#FEFAF3]/95 dark:bg-[#25312A]/95 border border-[#24302A] dark:border-[#3A4A40] shadow-[2px_2px_0px_#24302A] dark:shadow-[2px_2px_0px_#0E1410] flex items-center justify-between text-[10px] font-mono text-[#55655B] dark:text-[#B9C7BD]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-[#3A7F8F] inline-block" />
            <span>Synthetic Conduits</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] border border-[#84A282] inline-block" />
            <span>Catchment Boundary</span>
          </span>
        </div>
        <span className="font-sans text-[11px] font-medium text-[#24302A] dark:text-[#FEFAF3]">
          Interactive Canvas
        </span>
      </div>
    </div>
  );
};
