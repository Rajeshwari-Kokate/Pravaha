import { useState, type FC } from 'react';
import { Sliders } from 'lucide-react';
import { rationalQ } from '../../lib/simulation';
import type { Lesson } from '../../data/floodSchoolData';

interface LessonInteractiveProps {
  lesson: Lesson;
}

export const LessonInteractive: FC<LessonInteractiveProps> = ({ lesson }) => {
  // Lesson 1 Interactive state
  const [cVal, setCVal] = useState(0.85);
  const [iVal, setIVal] = useState(50);
  const [aVal, setAVal] = useState(50);

  // Lesson 2 Interactive state
  const [widthM, setWidthM] = useState(2.0);
  const [depthM, setDepthM] = useState(1.5);
  const [slopePct, setSlopePct] = useState(0.5);

  // Lesson 3 Interactive state
  const [blockagePct, setBlockagePct] = useState(35);

  return (
    <div className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-cream dark:bg-surface-dark space-y-4">
      <div className="flex items-center gap-2 text-sage-900 dark:text-sage-300 font-bold text-xs uppercase font-mono">
        <Sliders className="w-4 h-4 text-sage-700 dark:text-sage-300" />
        <span>Interactive Hydraulic Experiment</span>
      </div>

      {/* Lesson 1: Rational Method Runoff */}
      {lesson.interactiveType === 'runoff' && (
        <div className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between text-ink dark:text-cream mb-1">
                <span>Runoff Coeff (C):</span>
                <span className="font-bold">{cVal}</span>
              </div>
              <input
                type="range"
                min={0.20}
                max={0.95}
                step={0.05}
                value={cVal}
                onChange={e => setCVal(Number(e.target.value))}
                className="w-full accent-sage-500"
              />
              <span className="text-[10px] text-ink-muted dark:text-muted-dark">
                {cVal > 0.8 ? 'Paved / Asphalt' : cVal > 0.5 ? 'Suburban' : 'Permeable Park'}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-ink dark:text-cream mb-1">
                <span>Rainfall (i):</span>
                <span className="font-bold">{iVal} mm/h</span>
              </div>
              <input
                type="range"
                min={10}
                max={150}
                step={5}
                value={iVal}
                onChange={e => setIVal(Number(e.target.value))}
                className="w-full accent-sage-500"
              />
              <span className="text-[10px] text-ink-muted dark:text-muted-dark">
                {iVal >= 135 ? '100-Year Storm' : iVal >= 75 ? '25-Year Storm' : 'Moderate'}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-ink dark:text-cream mb-1">
                <span>Area (A):</span>
                <span className="font-bold">{aVal} ha</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={aVal}
                onChange={e => setAVal(Number(e.target.value))}
                className="w-full accent-sage-500"
              />
              <span className="text-[10px] text-ink-muted dark:text-muted-dark">Catchment footprint</span>
            </div>
          </div>

          <div className="p-3 bg-surface dark:bg-bg-dark rounded-lg border border-border-light dark:border-border-dark flex items-center justify-between">
            <span className="text-ink-muted dark:text-muted-dark">Calculated Peak Runoff Q:</span>
            <span className="text-xl font-bold text-water font-mono">
              {rationalQ(cVal, iVal, aVal).toFixed(2)} m³/s
            </span>
          </div>
        </div>
      )}

      {/* Lesson 2: Manning equation */}
      {lesson.interactiveType === 'manning' && (
        <div className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between mb-1 text-ink dark:text-cream">
                <span>Width:</span>
                <span className="font-bold">{widthM} m</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={5.0}
                step={0.5}
                value={widthM}
                onChange={e => setWidthM(Number(e.target.value))}
                className="w-full accent-sage-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-ink dark:text-cream">
                <span>Depth:</span>
                <span className="font-bold">{depthM} m</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3.0}
                step={0.25}
                value={depthM}
                onChange={e => setDepthM(Number(e.target.value))}
                className="w-full accent-sage-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-ink dark:text-cream">
                <span>Slope (S):</span>
                <span className="font-bold">{slopePct}%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={2.0}
                step={0.1}
                value={slopePct}
                onChange={e => setSlopePct(Number(e.target.value))}
                className="w-full accent-sage-500"
              />
            </div>
          </div>
          <div className="p-3 bg-surface dark:bg-bg-dark rounded-lg border border-border-light dark:border-border-dark flex items-center justify-between">
            <span className="text-ink-muted dark:text-muted-dark">Estimated Manning Capacity:</span>
            <span className="text-xl font-bold text-water font-mono">
              {((widthM * depthM * Math.pow((widthM * depthM) / (widthM + 2 * depthM), 2 / 3) * Math.sqrt(slopePct / 100)) / 0.015).toFixed(2)} m³/s
            </span>
          </div>
        </div>
      )}

      {/* Lesson 3: Blockage Factor */}
      {lesson.interactiveType === 'blockage' && (
        <div className="space-y-4 text-xs font-mono">
          <div>
            <div className="flex justify-between mb-1 text-ink dark:text-cream">
              <span>Debris and Silt Blockage Factor:</span>
              <span className="font-bold text-critical">{blockagePct}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              step={5}
              value={blockagePct}
              onChange={e => setBlockagePct(Number(e.target.value))}
              className="w-full accent-critical"
            />
          </div>
          <div className="p-3 bg-surface dark:bg-bg-dark rounded-lg border border-border-light dark:border-border-dark flex items-center justify-between">
            <span className="text-ink-muted dark:text-muted-dark">Effective Conveyance Retained:</span>
            <span className="text-xl font-bold text-amber font-mono">
              {100 - blockagePct}%
            </span>
          </div>
        </div>
      )}

      {/* Generic info for lessons 4, 5, 6 */}
      {(lesson.interactiveType === 'bottleneck' ||
        lesson.interactiveType === 'limitations' ||
        lesson.interactiveType === 'dataset') && (
        <div className="text-xs text-ink dark:text-cream leading-relaxed">
          Inspect factor weights, empirical correlations, and synthetic benchmarks in the{' '}
          <span className="font-mono font-bold text-sage-700 dark:text-sage-300">/workspace</span> and{' '}
          <span className="font-mono font-bold text-sage-700 dark:text-sage-300">/bottleneck</span> laboratories.
        </div>
      )}
    </div>
  );
};
