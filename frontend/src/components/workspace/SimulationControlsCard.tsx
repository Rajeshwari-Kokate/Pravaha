/**
 * SimulationControlsCard.tsx
 * Floating right panel for simulation configuration: storm presets,
 * rainfall intensity, rainfall duration, drainage capacity select, and run/reset buttons.
 */
import { useState, type FC } from 'react';
import { Sliders, Play, RotateCcw } from 'lucide-react';

interface Props {
  currentIntensity: number;
  isLoading: boolean;
  onSetCustomIntensity: (intensity: number) => void;
  onReset: () => void;
}

export const SimulationControlsCard: FC<Props> = ({
  currentIntensity,
  isLoading,
  onSetCustomIntensity,
  onReset,
}) => {
  const [localIntensity, setLocalIntensity] = useState(currentIntensity);
  const [durationHours, setDurationHours] = useState(3);
  const [capacityOption, setCapacityOption] = useState('default');
  const [activePreset, setActivePreset] = useState<string | null>('heavy');

  const presets = [
    {
      id: 'light',
      label: 'Light rain',
      intensity: 25,
      duration: 1,
      tooltip: 'Design storm: 25 mm/hr for 1 hr. Exploration scenario, not a forecast.',
    },
    {
      id: 'heavy',
      label: 'Heavy storm',
      intensity: 60,
      duration: 3,
      tooltip: 'Design storm: 60 mm/hr for 3 hrs. Exploration scenario, not a forecast.',
    },
    {
      id: 'cloudburst',
      label: 'Cloudburst',
      intensity: 110,
      duration: 1,
      tooltip: 'Design storm: 110 mm/hr for 1 hr. Extreme convective scenario, not a forecast.',
    },
  ];

  const handleSelectPreset = (p: typeof presets[0]) => {
    setActivePreset(p.id);
    setLocalIntensity(p.intensity);
    setDurationHours(p.duration);
    onSetCustomIntensity(p.intensity);
  };

  const handleIntensityChange = (val: number) => {
    setActivePreset(null);
    setLocalIntensity(val);
  };

  const handleRun = () => {
    onSetCustomIntensity(localIntensity);
  };

  const handleResetControls = () => {
    setActivePreset('heavy');
    setLocalIntensity(60);
    setDurationHours(3);
    setCapacityOption('default');
    onReset();
  };

  return (
    <div className="w-80 bg-surface/95 backdrop-blur-sm border border-border rounded-xl shadow-offset p-4 flex flex-col gap-4 text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sage-700" />
          <h2 className="font-display font-bold text-sm text-ink">Simulation Controls</h2>
        </div>
        {isLoading && (
          <span className="flex items-center gap-1 font-mono text-[10px] text-sage-700 animate-pulse font-semibold">
            <Play className="w-3 h-3" /> Running...
          </span>
        )}
      </div>

      {/* D4 Storm Presets */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-mono text-ink-muted uppercase tracking-wider font-semibold">
          Storm Presets
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {presets.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPreset(p)}
              title={p.tooltip}
              className={`px-2 py-1.5 rounded-lg border text-center transition-all flex flex-col items-center gap-0.5 ${
                activePreset === p.id
                  ? 'bg-sage-300 border-border text-ink font-bold shadow-sm'
                  : 'bg-background/80 border-border/80 text-ink-muted hover:text-ink hover:bg-pink/40'
              }`}
            >
              <span className="font-semibold text-[11px]">{p.label}</span>
              <span className="font-mono text-[9px] opacity-80">{p.intensity} mm/hr</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rainfall Intensity Slider */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-baseline">
          <label htmlFor="intensity-slider" className="font-semibold text-ink">
            Rainfall Intensity (mm/hr)
          </label>
          <span className="font-mono font-bold text-sage-700 text-sm">
            {localIntensity} mm/hr
          </span>
        </div>
        <input
          id="intensity-slider"
          type="range"
          min={0}
          max={150}
          step={5}
          value={localIntensity}
          onChange={e => handleIntensityChange(Number(e.target.value))}
          className="w-full accent-sage-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-ink-muted">
          <span>0</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
        </div>
      </div>

      {/* Rainfall Duration Slider */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-baseline">
          <label htmlFor="duration-slider" className="font-semibold text-ink">
            Rainfall Duration (hours)
          </label>
          <span className="font-mono font-bold text-sage-700 text-sm">
            {durationHours} {durationHours === 1 ? 'hr' : 'hrs'}
          </span>
        </div>
        <input
          id="duration-slider"
          type="range"
          min={1}
          max={12}
          step={1}
          value={durationHours}
          onChange={e => setDurationHours(Number(e.target.value))}
          className="w-full accent-sage-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-ink-muted">
          <span>0</span>
          <span>1</span>
          <span>3</span>
          <span>6</span>
          <span>12</span>
        </div>
      </div>

      {/* Drainage Capacity Select */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="drainage-capacity" className="font-semibold text-ink">
          Drainage Capacity
        </label>
        <select
          id="drainage-capacity"
          value={capacityOption}
          onChange={e => setCapacityOption(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs font-mono text-ink focus:outline-none focus:ring-2 focus:ring-sage-700"
        >
          <option value="default">Default (Dataset)</option>
          <option value="plus20">+20% Desilt / Upgraded</option>
          <option value="plus50">+50% Major Conveyance</option>
          <option value="minus20">-20% Silted / Partial Blockage</option>
        </select>
      </div>

      {/* Run Simulation & Reset Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <button
          type="button"
          id="run-simulation-btn"
          onClick={handleRun}
          disabled={isLoading}
          className="btn-primary flex-1 py-2 flex items-center justify-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run Simulation</span>
        </button>
        <button
          type="button"
          id="reset-simulation-btn"
          onClick={handleResetControls}
          disabled={isLoading}
          className="btn-secondary px-3 py-2 flex items-center justify-center gap-1.5"
          title="Reset to default baseline parameters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
