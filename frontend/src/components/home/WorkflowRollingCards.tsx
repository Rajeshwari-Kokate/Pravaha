import { useRef, type FC } from 'react';
import { Sliders, Cpu, GitCompare, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WorkflowStep {
  step: string;
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  icon: typeof Sliders;
  details: string[];
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: '01',
    title: 'Configure Storm Scenario',
    description: 'Select recurrence presets (5yr to 100yr) or dial custom rainfall intensities. Adjust antecedent moisture and simulate segment debris blockages.',
    actionText: 'Explore Scenarios Lab',
    actionLink: '/scenarios',
    icon: Sliders,
    details: [
      '5 standard return periods (30 to 135 mm/h)',
      'Segment-level blockage factor injections (0-80%)',
      'Instant parameter assumption validation preview',
    ],
  },
  {
    step: '02',
    title: 'Execute Hydraulic Simulation',
    description: 'Topological propagation routes hydrograph timesteps along the Koramangala network graph, detecting capacity exceedance and affected road intersections.',
    actionText: 'Open Flood Workspace',
    actionLink: '/workspace',
    icon: Cpu,
    details: [
      'Deterministic Rational Method (Q = C·i·A / 360)',
      '12-step triangular hyetograph timeline progression',
      'Dynamic spatial hotspot polygon clustering',
    ],
  },
  {
    step: '03',
    title: 'Investigate Bottlenecks & Compare',
    description: 'Analyze multi-factor bottleneck rankings with custom weight sliders. Model engineering interventions (desilting vs widening) with live delta metrics.',
    actionText: 'View Bottleneck Lab',
    actionLink: '/bottleneck',
    icon: GitCompare,
    details: [
      '5 user-exposed factor weights for transparent scoring',
      'Simulate hydraulic desilting or bypass channels',
      'Side-by-side KPI diffing and per-conduit deltas',
    ],
  },
];

export const WorkflowRollingCards: FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Systematic Methodology
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Three-Stage Flood Investigation Pipeline
          </h2>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            aria-label="Previous workflow step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            aria-label="Next workflow step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontally Rolling Container with Scroll-Snap */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg"
        tabIndex={0}
        role="region"
        aria-label="Workflow cards carousel"
      >
        {WORKFLOW_STEPS.map(step => {
          const Icon = step.icon;
          return (
            <div
              key={step.step}
              className="w-[320px] sm:w-[380px] shrink-0 snap-start rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    STAGE {step.step}
                  </span>
                  <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                    {step.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block mb-2">
                    Key Capabilities
                  </span>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                    {step.details.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-teal-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to={step.actionLink}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  <span>{step.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
