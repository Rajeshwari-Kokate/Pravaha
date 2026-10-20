/**
 * WorkspaceSettingsModal.tsx
 * Modal dialog for workspace display preferences, rain effect toggle,
 * theme toggle, and storage reset.
 */
import type { FC } from 'react';
import { X, Settings, CloudRain, Moon, Sun, Trash2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rainEffectEnabled: boolean;
  onToggleRainEffect: () => void;
}

export const WorkspaceSettingsModal: FC<Props> = ({
  isOpen,
  onClose,
  rainEffectEnabled,
  onToggleRainEffect,
}) => {
  const { isDark, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-offset p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-sage-700" />
            <h2 id="settings-modal-title" className="font-display font-bold text-base text-ink">
              Workspace Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border text-ink-muted hover:text-ink hover:bg-pink/40"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-xs">
          {/* Rain effect toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
            <div className="flex items-start gap-2.5">
              <CloudRain className="w-4 h-4 text-water shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-ink">Map Rain Overlay</span>
                <p className="text-[11px] text-ink-muted">
                  Displays subtle raindrop streaks over the map while simulation is running.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleRainEffect}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                rainEffectEnabled
                  ? 'bg-sage-500 text-ink border-ink'
                  : 'bg-surface text-ink-muted border-border'
              }`}
            >
              {rainEffectEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Theme selection */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
            <div className="flex items-start gap-2.5">
              {isDark ? <Moon className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" /> : <Sun className="w-4 h-4 text-amber shrink-0 mt-0.5" />}
              <div>
                <span className="font-semibold text-ink">Interface Theme</span>
                <p className="text-[11px] text-ink-muted">
                  Current theme: {isDark ? 'Dark Theme' : 'Light Theme (Cream)'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-secondary px-3 py-1.5 text-xs font-mono font-bold"
            >
              Switch Theme
            </button>
          </div>

          {/* Local storage clear */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
            <div className="flex items-start gap-2.5">
              <Trash2 className="w-4 h-4 text-critical shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-ink">Reset Stored Data</span>
                <p className="text-[11px] text-ink-muted">
                  Clear tour progress, simulation cache, and theme preference.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-2.5 py-1.5 rounded-lg border border-critical/50 text-critical hover:bg-critical/10 text-xs font-mono font-bold"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary px-4 py-1.5 text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
