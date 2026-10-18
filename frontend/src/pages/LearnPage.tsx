import { useState, type FC } from 'react';
import { ShieldAlert } from 'lucide-react';

export const LearnPage: FC = () => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'glossary'>('lessons');

  const lessonList = [
    { id: 1, title: 'How Rain Becomes Runoff', desc: 'Surface type, runoff coefficients, and the Rational Method formula.' },
    { id: 2, title: 'What Drainage Capacity Means', desc: 'Hydraulic cross-section, slope, and demand versus capacity.' },
    { id: 3, title: 'How a Blockage Creates an Upstream Problem', desc: 'Backwater accumulation and tributary surcharge propagation.' },
    { id: 4, title: 'How Engineers Prioritise Inspection', desc: 'Multi-factor bottleneck ranking and civic vulnerability weighting.' },
    { id: 5, title: 'Limits of Simplified Screening Models', desc: 'What screening tools can and cannot evaluate in an urban basin.' },
    { id: 6, title: 'What the Flood Risk Dataset Can and Cannot Tell Us', desc: 'Statistical association versus hydraulic causation on tabular records.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Emergency Banner */}
      <div>
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Educational Layer
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Flood School & Technical Glossary
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          Interactive lessons utilizing live model code to explore urban runoff dynamics, conduit constraints, and bottleneck analysis.
        </p>
      </div>

      {/* Emergency Notice Box */}
      <div className="p-4 rounded-md border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold">If flooding is happening in your area right now:</p>
          <p className="leading-relaxed">
            Follow instructions issued by local municipal authorities and contact local disaster management and emergency services immediately.
            PRAVAHA is an educational and engineering decision-support tool, not an emergency warning or alert dissemination system.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('lessons')}
          className={`px-4 py-2 border-b-2 font-semibold transition-colors ${
            activeTab === 'lessons'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Interactive Lessons (6)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('glossary')}
          className={`px-4 py-2 border-b-2 font-semibold transition-colors ${
            activeTab === 'glossary'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Engineering Glossary
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'lessons' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessonList.map(lesson => (
            <div
              key={lesson.id}
              className="p-6 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-teal-600 dark:text-teal-400">
                  Lesson 0{lesson.id}
                </span>
                <span className="font-mono text-[11px] text-slate-400">Self-Check: 4 Questions</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{lesson.title}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{lesson.desc}</p>
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500">Progress: Not started</span>
                <button
                  type="button"
                  className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs"
                >
                  Start Lesson
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <h3 className="font-mono text-sm font-bold text-teal-600 dark:text-teal-400">Candidate Bottleneck</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              A drainage conduit identified by the routing heuristic where peak inflow demand exceeds effective conveyance capacity, flagged for priority physical inspection.
            </p>
          </div>
          <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <h3 className="font-mono text-sm font-bold text-teal-600 dark:text-teal-400">Modeled Hotspot</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              A spatial node or cell where simulated runoff accumulation exceeds drainage disposal rates, representing a candidate area of overland water ponding.
            </p>
          </div>
          <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <h3 className="font-mono text-sm font-bold text-teal-600 dark:text-teal-400">Synthetic Network</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              An algorithmic drainage topology generated deterministically from road alignments and regional slope, used for demonstration when municipal GIS data is unavailable.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
