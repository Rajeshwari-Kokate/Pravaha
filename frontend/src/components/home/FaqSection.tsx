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
      'Our empirical dataset profiling revealed that flood_risk_dataset_india.csv possesses synthetic uniform pseudorandom characteristics: equal 50.6% class balance, uniform continuous distributions across all geographic coordinates and rainfall numbers, and near-zero correlation between predictors and flood occurrences. PRAVAHA reports this held-out ROC AUC transparently rather than claiming fictitious predictive power.',
  },
  {
    question: 'How was the Koramangala synthetic drainage network generated?',
    answer:
      'The network was algorithmically synthesized by extracting road centerlines from OpenStreetMap around Koramangala (Bengaluru), snapping drop-inlets to road intersections, assigning gravitational flow slopes toward the Bellandur Valley depression, and sizing cross-sections (trunk, primary, secondary, roadside) deterministically with seed 42.',
  },
  {
    question: 'How does Google Gemma 4 generate technical investigation reports?',
    answer:
      'PRAVAHA constructs a strict facts-only Evidence Registry from the simulation run (such as peak discharge, overloaded conduit IDs, and road intersections). Google Gemma 4 synthesizes this into an executive narrative with mandatory evidence citation tags (for example [EVID-SIM-01]). If an invalid citation or ungrounded water depth claim is detected, our code-level validator rejects it.',
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
    <section className="space-y-5 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#4F6B52] dark:text-[#B8CFB3]">
          <HelpCircle className="w-4 h-4" />
          <span>Engineering FAQ</span>
        </div>
        <h2 className="text-2xl font-bold font-heading text-[#24302A] dark:text-[#FEFAF3]">
          Frequently Answered Technical Questions
        </h2>
        <p className="text-xs text-[#55655B] dark:text-[#B9C7BD] max-w-lg mx-auto">
          Scientific principles, dataset provenance disclosures, and modeling boundaries explained.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border-[1.5px] border-[#24302A] dark:border-[#3A4A40] rounded-xl bg-white dark:bg-[#25312A] shadow-[2px_2px_0px_#24302A] dark:shadow-[2px_2px_0px_#0E1410] overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FEFAF3] dark:hover:bg-[#1C2620] transition-colors"
              >
                <span className="font-heading font-bold text-sm text-[#24302A] dark:text-[#FEFAF3]">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#4F6B52] dark:text-[#B8CFB3] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-xs text-[#55655B] dark:text-[#B9C7BD] leading-relaxed border-t border-[#24302A]/10 dark:border-[#3A4A40]">
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
