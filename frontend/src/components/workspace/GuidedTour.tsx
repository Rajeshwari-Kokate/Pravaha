import { useState, useEffect, useCallback, type FC } from 'react';
import { Layers, Sliders, Play, BarChart3, GitCompare, X, ChevronRight, ChevronLeft } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  icon: typeof Layers;
  position: 'top-left' | 'top-right' | 'bottom-center' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    title: '1. Layers Overlay',
    description: 'Toggle drainage conduits, road network overlays, and key civil infrastructure on the interactive map.',
    icon: Layers,
    position: 'top-left',
  },
  {
    title: '2. Storm Presets & Controls',
    description: 'Choose quick design storms (Light rain, Heavy storm, Cloudburst) or configure manual rainfall intensity and duration.',
    icon: Sliders,
    position: 'top-right',
  },
  {
    title: '3. Run Simulation',
    description: 'Click "Run Simulation" to execute the Rational Method flow engine and compute hydraulic conveyance in real time.',
    icon: Play,
    position: 'top-right',
  },
  {
    title: '4. KPI Tiles & Asset Data',
    description: 'Review potential flood hotspots, over-capacity segments, affected roads, and the timeline scrubber at the bottom.',
    icon: BarChart3,
    position: 'bottom-center',
  },
  {
    title: '5. Scenario Comparison',
    description: 'Compare baseline storm outcomes against desilting and structural widening interventions in the Scenarios view.',
    icon: GitCompare,
    position: 'center',
  },
];

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedTour: FC<GuidedTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      localStorage.setItem('pravaha-tour-dismissed', 'true');
      onClose();
    }
  }, [currentStep, onClose]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    localStorage.setItem('pravaha-tour-dismissed', 'true');
    onClose();
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSkip();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, handleSkip]);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      {/* Subtle backdrop */}
      <div className="absolute inset-0 bg-ink/30 dark:bg-black/50 backdrop-blur-[1px] pointer-events-auto" onClick={handleSkip} />

      {/* Tour Card */}
      <div
        role="dialog"
        aria-label="Workspace Guided Tour"
        className="relative pointer-events-auto w-full max-w-md bg-surface dark:bg-surface-dark border-2 border-ink dark:border-border-dark rounded-2xl shadow-tactile p-6 space-y-5 text-ink dark:text-cream"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg border border-border-light dark:border-border-dark bg-cream dark:bg-bg-dark flex items-center justify-center text-sage-700 dark:text-sage-300">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-sage-700 dark:text-sage-300 block">
                Workspace Tour ({currentStep + 1} / {TOUR_STEPS.length})
              </span>
              <h2 className="text-sm font-bold font-sans">
                {step.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSkip}
            aria-label="Skip tour"
            className="p-1 rounded text-ink-muted hover:text-ink dark:text-muted-dark dark:hover:text-cream"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-xs text-ink-muted dark:text-muted-dark leading-relaxed font-sans">
          {step.description}
        </p>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5 pt-1">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStep
                  ? 'w-6 bg-sage-500'
                  : 'w-1.5 bg-border-light dark:bg-border-dark'
              }`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-border-light dark:border-border-dark text-xs">
          <button
            type="button"
            onClick={handleSkip}
            className="text-[11px] font-mono text-ink-muted hover:text-ink dark:text-muted-dark dark:hover:text-cream underline underline-offset-2"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="btn-secondary px-3 py-1.5 font-bold flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="btn-primary px-4 py-1.5 font-bold flex items-center gap-1"
            >
              <span>{currentStep === TOUR_STEPS.length - 1 ? 'Get Started' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
