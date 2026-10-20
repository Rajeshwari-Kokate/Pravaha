/**
 * TimelineScrubber: interactive timeline bar showing hyetograph
 * rainfall and overloaded conduit count per step.
 */
import { type FC, useCallback } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import type { SimulationOutput } from '../../hooks/useSimulation';

interface TimelineScrubberProps {
  result: SimulationOutput | null;
  activeStep: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSeek: (step: number) => void;
}

function getSeverityColor(fr: number): string {
  if (fr < 0.75) return '#B8CFB3'; // sage-300
  if (fr < 1.0) return '#E8C468';  // moderate
  if (fr < 1.5) return '#E0803A';  // high
  return '#B3261E';                // critical
}

export const TimelineScrubber: FC<TimelineScrubberProps> = ({
  result,
  activeStep,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onSeek,
}) => {
  const tl = result?.timeline ?? [];
  const nSteps = tl.length;

  const maxQ = Math.max(...tl.map(s => s.rainfallMmHr), 1);

  const handleBarClick = useCallback(
    (step: number) => {
      onSeek(step);
    },
    [onSeek]
  );

  const active = tl[activeStep];

  return (
    <div className="flex flex-col gap-2.5">
      {/* Controls row */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          id="timeline-play-pause"
          onClick={isPlaying ? onPause : onPlay}
          disabled={nSteps === 0}
          aria-label={isPlaying ? 'Pause simulation playback' : 'Play simulation timeline'}
          className="p-1.5 rounded-lg bg-sage-500 hover:bg-sage-700 text-ink border border-ink disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:translate-x-[1px] active:translate-y-[1px]"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        <button
          type="button"
          id="timeline-reset"
          onClick={onReset}
          aria-label="Reset timeline to start"
          className="p-1.5 rounded-lg border border-border bg-background text-ink hover:bg-pink/40 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono text-ink">
          <Clock className="w-3.5 h-3.5 text-sage-700" />
          <span className="font-semibold">
            T+{active ? String(active.elapsedMinutes).padStart(2, '0') : '00'}m
          </span>
          {active && (
            <>
              <span className="text-border mx-1">|</span>
              <span className="text-sage-700 font-bold">
                {active.rainfallMmHr.toFixed(1)} mm/hr
              </span>
              <span className="text-border mx-1">|</span>
              <span className={active.overloadedCount > 0 ? 'text-critical font-bold' : 'text-sage-700'}>
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
          className="flex items-end gap-1 h-12 bg-background p-1.5 rounded-lg border border-border overflow-x-auto"
        >
          {tl.map((step, i) => {
            const rainHeight = Math.max((step.rainfallMmHr / maxQ) * 100, 10);
            const isActive = i === activeStep;
            const barColor = getSeverityColor(step.maxFlowRatio);

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleBarClick(i)}
                title={`Step ${i + 1}: ${step.rainfallMmHr.toFixed(1)} mm/hr, ${step.overloadedCount} overloaded`}
                className={`flex-1 min-w-[14px] flex flex-col justify-end items-center rounded-sm transition-all relative ${
                  isActive ? 'ring-2 ring-ink ring-offset-1' : 'opacity-80 hover:opacity-100'
                }`}
                style={{ height: '100%' }}
              >
                <div
                  className="w-full rounded-sm"
                  style={{
                    height: `${rainHeight}%`,
                    backgroundColor: barColor,
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
