/**
 * SimulationControls: return period selector + custom intensity slider
 * + catchment parameter sliders. Wires into useSimulation hook setters.
 */
import { type FC, useState } from 'react';
import { Sliders, Play, RotateCcw, Info } from 'lucide-react';
import { RAINFALL_PRESETS, type ReturnPeriod } from '../../lib/simulation';

const RETURN_PERIODS: { label: string; value: ReturnPeriod }[] = [
  { label: '5yr',   value: '5yr'   },
  { label: '10yr',  value: '10yr'  },
  { label: '25yr',  value: '25yr'  },
  { label: '50yr',  value: '50yr'  },
  { label: '100yr', value: '100yr' },
];

interface Props {
  currentReturnPeriod: string;
  currentIntensity:    number;
  currentRunoffCoeff:  number;
  currentAreaHa:       number;
  isLoading:           boolean;
  onSetReturnPeriod:   (rp: ReturnPeriod) => void;
  onSetCustomIntensity:(v: number) => void;
  onSetRunoffCoeff:    (v: number) => void;
  onSetAreaHa:         (v: number) => void;
}

export const SimulationControls: FC<Props> = ({
  currentReturnPeriod,
  currentIntensity,
  currentRunoffCoeff,
  currentAreaHa,
  isLoading,
  onSetReturnPeriod,
  onSetCustomIntensity,
  onSetRunoffCoeff,
  onSetAreaHa,
}) => {
  const [customMode, setCustomMode] = useState(currentReturnPeriod === 'custom');
  const [localIntensity, setLocalIntensity] = useState(currentIntensity);
  const [localCoeff,     setLocalCoeff]     = useState(currentRunoffCoeff);
  const [localArea,      setLocalArea]      = useState(currentAreaHa);

  const handlePreset = (rp: ReturnPeriod) => {
    setCustomMode(false);
    setLocalIntensity(RAINFALL_PRESETS[rp]);
    onSetReturnPeriod(rp);
  };

  const handleCustomSlide = (v: number) => {
    setCustomMode(true);
    setLocalIntensity(v);
  };

  const handleCustomCommit = () => {
    onSetCustomIntensity(localIntensity);
  };

  const handleCoeffCommit = () => {
    onSetRunoffCoeff(localCoeff);
  };

  const handleAreaCommit = () => {
    onSetAreaHa(localArea);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Storm Parameters</h2>
        {isLoading && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-mono text-teal-600 dark:text-teal-400 animate-pulse">
            <Play className="w-3 h-3" /> Running
          </span>
        )}
      </div>

      {/* Return Period Presets */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
          Return Period Presets
        </label>
        <div className="flex flex-wrap gap-1.5">
          {RETURN_PERIODS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              id={`rp-btn-${value}`}
              onClick={() => handlePreset(value)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all
                ${currentReturnPeriod === value && !customMode
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-200 dark:shadow-teal-900'
                  : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-300'
                }`}
            >
              {label}
              <span className="ml-1 font-normal text-[9px] opacity-70">
                {RAINFALL_PRESETS[value]}mm
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Intensity Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="custom-intensity-slider"
            className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold"
          >
            Custom Intensity
          </label>
          <span className={`text-sm font-black font-mono tabular-nums ${
            customMode ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'
          }`}>
            {Math.round(localIntensity)} mm/hr
          </span>
        </div>
        <input
          id="custom-intensity-slider"
          type="range"
          min="1"
          max="200"
          step="1"
          value={localIntensity}
          onChange={e => handleCustomSlide(Number(e.target.value))}
          onMouseUp={handleCustomCommit}
          onTouchEnd={handleCustomCommit}
          className="w-full h-2 rounded-full accent-teal-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>1 mm/hr (drizzle)</span>
          <span>200 mm/hr (extreme)</span>
        </div>
      </div>

      {/* Runoff Coefficient */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 justify-between">
          <label
            htmlFor="runoff-coeff-slider"
            className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold"
          >
            Runoff Coefficient (C)
          </label>
          <span className="text-sm font-black font-mono tabular-nums text-slate-700 dark:text-slate-200">
            {localCoeff.toFixed(2)}
          </span>
        </div>
        <input
          id="runoff-coeff-slider"
          type="range"
          min="0.1"
          max="1.0"
          step="0.01"
          value={localCoeff}
          onChange={e => setLocalCoeff(Number(e.target.value))}
          onMouseUp={handleCoeffCommit}
          onTouchEnd={handleCoeffCommit}
          className="w-full h-2 rounded-full accent-teal-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>0.10 (porous)</span>
          <span>1.00 (impervious)</span>
        </div>
      </div>

      {/* Catchment Area */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 justify-between">
          <label
            htmlFor="area-ha-slider"
            className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold"
          >
            Catchment Area per Conduit
          </label>
          <span className="text-sm font-black font-mono tabular-nums text-slate-700 dark:text-slate-200">
            {Math.round(localArea)} ha
          </span>
        </div>
        <input
          id="area-ha-slider"
          type="range"
          min="5"
          max="500"
          step="5"
          value={localArea}
          onChange={e => setLocalArea(Number(e.target.value))}
          onMouseUp={handleAreaCommit}
          onTouchEnd={handleAreaCommit}
          className="w-full h-2 rounded-full accent-teal-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>5 ha</span>
          <span>500 ha</span>
        </div>
      </div>

      {/* Formula reminder */}
      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex gap-2">
        <Info className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 font-mono">
          Q = C * i * A / 360 [m3/s] <br />
          CPHEEO Rational Method (urban catchments under 100 ha)<br />
          Synthetic drainage network only.
        </p>
      </div>

      {/* Reset button */}
      <button
        type="button"
        id="reset-simulation"
        onClick={() => {
          handlePreset('10yr');
          setLocalCoeff(0.70);
          setLocalArea(50);
          onSetRunoffCoeff(0.70);
          onSetAreaHa(50);
        }}
        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2
                   rounded-lg border border-slate-300 dark:border-slate-700
                   text-xs font-semibold text-slate-600 dark:text-slate-400
                   hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset to Defaults
      </button>
    </div>
  );
};
