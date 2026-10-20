import type { FC } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MapZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export const MapZoomControls: FC<MapZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
}) => {
  const btnCls =
    'p-2 rounded-lg bg-surface border border-border text-ink hover:bg-pink shadow-offset transition-all active:translate-x-[1px] active:translate-y-[1px]';

  return (
    <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-1.5">
      <button type="button" onClick={onZoomIn} aria-label="Zoom in" className={btnCls}>
        <ZoomIn className="w-4 h-4" />
      </button>
      <button type="button" onClick={onZoomOut} aria-label="Zoom out" className={btnCls}>
        <ZoomOut className="w-4 h-4" />
      </button>
      <button type="button" onClick={onResetView} aria-label="Reset map view" className={btnCls}>
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
