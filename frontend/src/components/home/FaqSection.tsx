import { useState, type FC } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How does PRAVAHA model urban runoff without full 2D hydrodynamic depth calculations?',
    answer:
      'PRAVAHA utilizes the deterministic Rational Method (Q = C·i·A / 360) coupled with a topological NetworkX directed graph. It calculates peak flow demand against nominal Manning capacity per conduit segment. While it identifies capacity exceedance ratios and hotspots where water surcharges onto street networks, it does not solve the 2D Shallow Water Equations for millimeter water surface elevations.',
  },
  {
    question: 'Why does the Indian Flood Risk Dataset have a held-out ROC AUC of ~0.50?',
    answer:
      'Our rigorous empirical dataset profiling in Phase 2 revealed that flood_risk_dataset_india.csv possesses synthetic uniform pseudorandom characteristics: equal 50.6% class balance, uniform continuous distributions across all geographic coordinates and rainfall numbers, and near-zero correlation between predictors and flood occurrences. PRAVAHA reports this held-out ROC AUC transparently rather than claiming fictitious predictive power.',
  },
  {
    question: 'How was the Koramangala synthetic drainage network generated?',
    answer:
      'The network was algorithmically synthesized by extracting road centerlines from OpenStreetMap around Koramangala (Bengaluru), snapping drop-inlets to road intersections, assigning gravitational flow slopes toward the Bellandur Valley depression, and sizing cross-sections (trunk, primary, secondary, roadside) deterministically with seed 42.',
  },
  {
    question: 'How does Google Gemma 4 generate technical investigation reports?',
    answer:
      'PRAVAHA constructs a strict facts-only Evidence Registry from the simulation run (e.g., peak discharge, overloaded conduit IDs, road intersections). Google Gemma 4 (google/gemma-4-E4B-it) synthesizes this into an executive narrative with mandatory evidence citation tags (e.g. [EVID-SIM-01]). If an invalid citation or ungrounded water depth claim is detected, our code-level validator rejects it.',
  },
  {
    question: 'Can PRAVAHA be calibrated for other Indian municipal corporations?',
    answer:
      'Yes. The architecture supports arbitrary GeoJSON subcatchments, local rainfall intensity-duration-frequency (IDF) curves, and municipal culvert inventories. Once real SWD (Storm Water Drain) invert levels are uploaded, the graph engine executes identical deterministic capacity routing without architectural changes.',
  },
];

export const FaqSection: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          <HelpCircle className="w-4 h-4" />
          <span>Engineering FAQ</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Frequently Answered Technical Questions
        </h2>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Scientific principles, dataset provenance disclosures, and modeling boundaries explained.
        </p>
      </div>

      <div className="space-y-3 pt-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none"
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-teal-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/30">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
