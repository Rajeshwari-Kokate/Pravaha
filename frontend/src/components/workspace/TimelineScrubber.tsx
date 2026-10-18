/**
 * TimelineScrubber: interactive timeline bar showing hyetograph
 * rainfall and overloaded conduit count per step.
 */
import { type FC, useCallback } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import type { SimulationOutput } from '../../hooks/useSimulation';

interface TimelineScrubberProps {
  result:      SimulationOutput | null;
  activeStep:  number;
  isPlaying:   boolean;
  onPlay:      () => void;
  onPause:     () => void;
  onReset:     () => void;
  onSeek:      (step: number) => void;
}

function severityBg(fr: number): string {
  if (fr < 0.75) return 'bg-emerald-500';
  if (fr < 1.0)  return 'bg-amber-500';
  if (fr < 1.5)  return 'bg-orange-500';
  return 'bg-red-500';
}

export const TimelineScrubber: FC<TimelineScrubberProps> = ({
  result, activeStep, isPlaying, onPlay, onPause, onReset, onSeek,
}) => {
  const tl     = result?.timeline ?? [];
  const nSteps = tl.length;

  const maxQ     = Math.max(...tl.map(s => s.rainfallMmHr), 1);
  const maxFrAll = Math.max(...tl.map(s => s.maxFlowRatio), 0.01);

  const handleBarClick = useCallback((step: number) => {
    onSeek(step);
  }, [onSeek]);

  const active = tl[activeStep];

  return (
    <div className="flex flex-col gap-2">
      {/* Controls row */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          id="timeline-play-pause"
          onClick={isPlaying ? onPause : onPlay}
          disabled={nSteps === 0}
          aria-label={isPlaying ? 'Pause simulation playback' : 'Play simulation timeline'}
          className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          id="timeline-reset"
          onClick={onReset}
          aria-label="Reset timeline to start"
          className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700
                     text-slate-600 dark:text-slate-400
                     hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-700 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold">
            T+{active ? String(active.elapsedMinutes).padStart(2, '0') : '00'}m
          </span>
          {active && (
            <>
              <span className="text-slate-400 mx-1">|</span>
              <span className="text-teal-600 dark:text-teal-400 font-bold">
                {active.rainfallMmHr.toFixed(1)} mm/hr
              </span>
              <span className="text-slate-400 mx-1">|</span>
              <span className={active.overloadedCount > 0 ? 'text-red-500' : 'text-emerald-500'}>
                {active.overloadedCount} overloaded
              </span>
            </>
          )}
        </div>
      </div>

      {/* Bar chart scrubber */}
      {nSteps > 0 && (
        <div
          role="group"
          aria-label="Simulation timeline scrubber"
          className="flex items-end gap-px h-10"
        >
          {tl.map((step, i) => {
            const rainHeight  = (step.rainfallMmHr / maxQ) * 100;
            const isActive    = i === activeStep;
            const frRatio     = maxFrAll > 0 ? step.maxFlowRatio / maxFrAll : 0;

            return (
              <button
                key={step.step}
                type="button"
                onClick={() => handleBarClick(i)}
                aria-label={`Step ${i}: T+${step.elapsedMinutes}min, ${step.rainfallMmHr}mm/hr`}
                aria-pressed={isActive}
                className={`flex-1 flex flex-col-reverse items-center justify-start
                            min-w-0 rounded-sm transition-all cursor-pointer
                            focus-visible:outline-2 focus-visible:outline-teal-500
                            ${isActive ? 'ring-1 ring-teal-500 ring-offset-1 dark:ring-offset-slate-900' : ''}`}
                style={{ height: '100%' }}
              >
                {/* Rainfall bar (blue) */}
                <div
                  className={`w-full rounded-sm transition-all duration-300 ${
                    isActive ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  style={{ height: `${rainHeight}%`, minHeight: 2 }}
                />
                {/* Flow-ratio indicator dot */}
                {step.maxFlowRatio >= 1.0 && (
                  <div
                    className={`w-1 h-1 rounded-full mb-0.5 ${severityBg(step.maxFlowRatio)}`}
                    style={{ opacity: 0.7 + 0.3 * frRatio }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {nSteps === 0 && (
        <div className="h-10 flex items-center">
          <span className="text-xs text-slate-400 font-mono animate-pulse">
            Running simulation...
          </span>
        </div>
      )}
    </div>
  );
};
