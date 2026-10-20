/**
 * WorkspaceHelpModal.tsx
 * Modal dialog providing quick engineering guidance on interpreting
 * hydraulic modeling results and restarting the guided tour.
 */
import type { FC } from 'react';
import { X, HelpCircle, Compass, AlertTriangle, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRestartTour?: () => void;
}

export const WorkspaceHelpModal: FC<Props> = ({
  isOpen,
  onClose,
  onRestartTour,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg bg-surface border border-border rounded-xl shadow-offset p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sage-700" />
            <h2 id="help-modal-title" className="font-display font-bold text-base text-ink">
              Workspace Guide & Methodology
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border text-ink-muted hover:text-ink hover:bg-pink/40"
            aria-label="Close help"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3 text-xs text-ink leading-relaxed">
          <div className="p-3 rounded-lg border border-border bg-background flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-bold text-sage-900 dark:text-cream">
              <Compass className="w-4 h-4 text-sage-700" />
              <span>How to interpret the simulation</span>
            </div>
            <p className="text-ink-muted">
              The engine applies the Rational Method (Q = C × i × A / 360) across catchment segments. When inflow exceeds effective conduit capacity, conduits are flagged as over capacity and relative flood accumulation hotspots are mapped.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-amber/40 bg-amber/10 flex flex-col gap-1 text-ink">
            <div className="flex items-center gap-1.5 font-bold text-amber">
              <AlertTriangle className="w-4 h-4 text-amber shrink-0" />
              <span>Synthetic vs Observed Data</span>
            </div>
            <p className="text-xs">
              Drainage network alignments and conduit dimensions are synthetic approximations generated from road topographies and valley paths for demonstration purposes. Observed data uses solid lines, while synthetic data is rendered with dashed lines.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-border bg-background flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-bold text-ink">
              <Layers className="w-4 h-4 text-sage-700" />
              <span>Hydraulic Severity Ramp</span>
            </div>
            <p className="text-ink-muted">
              Capacity exceedance is rated sequentially: Sage-300 (Low &lt;75%), Amber (Moderate 75-100%), Orange (High 100-150%), and Critical Red (&gt;150% with hatch pattern).
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between">
          {onRestartTour ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onRestartTour();
              }}
              className="btn-secondary px-3 py-1.5 text-xs font-semibold"
            >
              Restart Guided Tour
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            className="btn-primary px-4 py-1.5 text-xs font-bold"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
