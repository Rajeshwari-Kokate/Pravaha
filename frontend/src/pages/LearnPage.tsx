import { useState, useEffect, type FC } from 'react';
import {
  CheckCircle,
  HelpCircle,
  Sliders,
  ShieldAlert,
  Search,
  Sparkles,
} from 'lucide-react';
import { rationalQ } from '../lib/simulation';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  summary: string;
  interactiveType: 'runoff' | 'manning' | 'blockage' | 'bottleneck' | 'limitations' | 'dataset';
  quiz: QuizQuestion[];
}

const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'How Rain Becomes Runoff',
    subtitle: 'Surface Imperviousness & The Rational Method',
    summary:
      'In an urban catchment, rain falling on roofs, roads, and concrete cannot infiltrate into the subsoil. Peak discharge rate Q is governed by the Rational Method: Q = C·i·A / 360, where C is the composite runoff coefficient.',
    interactiveType: 'runoff',
    quiz: [
      {
        question: 'Which surface material has the highest runoff coefficient (C)?',
        options: ['Forest canopy with leaf litter', 'Agricultural soil', 'Dense asphalt / paved concrete', 'Sandy permeable loam'],
        correctIndex: 2,
        explanation: 'Paved impervious surfaces have runoff coefficients C between 0.85 and 0.95 because nearly 90%+ of rainfall becomes surface runoff.',
      },
      {
        question: 'If rainfall intensity doubles, what happens to peak discharge Q in the Rational Method?',
        options: ['It remains unchanged', 'It doubles proportionally', 'It quadruples', 'It decreases'],
        correctIndex: 1,
        explanation: 'Q = C·i·A / 360 is directly linear with rainfall intensity i. Doubling rainfall intensity doubles peak runoff rate.',
      },
      {
        question: 'Why is the Rational Method best suited for small to medium catchments (<50 ha)?',
        options: [
          'It assumes uniform rainfall intensity across the whole catchment for the time of concentration',
          'It requires supercomputers',
          'It cannot compute decimal numbers',
          'It only works in deserts'
        ],
        correctIndex: 0,
        explanation: 'The Rational Method assumes uniform rainfall distribution and duration equal to the time of concentration, an assumption that breaks down across large river basins.',
      },
    ],
  },
  {
    id: 2,
    title: 'What Drainage Capacity Means',
    subtitle: 'Cross-Section Geometry & Manning Conveyance',
    summary:
      'A storm drain or culvert can only convey a finite discharge before water fills the barrel. Nominal capacity Q is determined by Manning’s equation: Q = (1/n) · A · R^(2/3) · S^(1/2). Channel width, depth, slope, and wall roughness determine whether a pipe can evacuate runoff.',
    interactiveType: 'manning',
    quiz: [
      {
        question: 'What does Manning’s roughness coefficient "n" represent?',
        options: [
          'The slope of the terrain',
          'Friction resistance of the channel boundary against flowing water',
          'The length of the conduit',
          'The height of the storm cloud'
        ],
        correctIndex: 1,
        explanation: 'Manning’s n quantifies boundary friction. Smooth concrete has low n (~0.013), while silted or weed-choked channels have high n (~0.035+), drastically reducing flow velocity.',
      },
      {
        question: 'If a conduit’s slope S decreases from 1.0% to 0.25%, what happens to flow velocity?',
        options: ['Velocity is halved', 'Velocity doubles', 'Velocity quadruples', 'Velocity remains identical'],
        correctIndex: 0,
        explanation: 'Velocity is proportional to S^(1/2). The square root of 0.25 is half that of 1.0, so flow velocity drops by 50%.',
      },
    ],
  },
  {
    id: 3,
    title: 'How a Blockage Creates an Upstream Problem',
    subtitle: 'Hydraulic Backwater & Tributary Surcharge',
    summary:
      'Solid waste, silt, and debris constrict the cross-sectional area of a conduit. When an downstream conduit becomes choked, water accumulates upstream, causing water levels to rise and surcharging secondary tributaries that would otherwise drain safely.',
    interactiveType: 'blockage',
    quiz: [
      {
        question: 'When a downstream trunk channel is 50% blocked by debris, which conduits are at greatest risk of overflowing?',
        options: [
          'Conduits at the far ocean outfall',
          'Directly upstream tributary conduits whose outflows are obstructed',
          'Only dry roads on hills',
          'None of them'
        ],
        correctIndex: 1,
        explanation: 'Downstream constrictions create backwater effects that impede upstream discharge, causing street drop-inlets upstream to surcharge and overflow first.',
      },
    ],
  },
  {
    id: 4,
    title: 'How Engineers Prioritise Inspection',
    subtitle: 'Multi-Factor Bottleneck Ranking',
    summary:
      'Municipal drainage authorities cannot inspect every culvert simultaneously. Engineers compute composite risk scores balancing flow exceedance ratio, blockage likelihood, downstream conduit convergence, and critical road intersections.',
    interactiveType: 'bottleneck',
    quiz: [
      {
        question: 'Why do engineers assign higher inspection priority to arterial trunk conduits over minor roadside ditches?',
        options: [
          'Trunk conduits are easier to walk through',
          'Trunk conduits convey cumulative discharge from dozens of sub-basins; failure floods entire districts',
          'Minor ditches are made of gold',
          'Trunk conduits never clog'
        ],
        correctIndex: 1,
        explanation: 'Trunk conduits have vast upstream contributing areas. If a trunk segment constricts, the overflow volume impacts arterial transport corridors and multiple downstream neighbourhoods.',
      },
    ],
  },
  {
    id: 5,
    title: 'Limits of Simplified Screening Models',
    subtitle: 'Screening vs 2D Hydrodynamic Modeling',
    summary:
      'PRAVAHA is an early-stage screening model. It provides rapid comparative insights into network capacity exceedances, but does not solve the 2D Saint-Venant shallow water equations. It does not output uncalibrated water surface elevations or pump curve dynamics.',
    interactiveType: 'limitations',
    quiz: [
      {
        question: 'What information does PRAVAHA provide that distinguishes it from a full 2D hydrodynamic simulation?',
        options: [
          'It provides exact millimeter water depth contours inside buildings',
          'It flags relative conduit conveyance exceedances and hotspot clusters rapidly without solving 2D momentum equations',
          'It controls real pump switches in Bengaluru',
          'It guarantees zero rainfall'
        ],
        correctIndex: 1,
        explanation: 'Screening models identify which conduits exceed nominal conveyance capacity under design rainfall, serving as tactical decision support for CCTV inspection and maintenance prioritization.',
      },
    ],
  },
  {
    id: 6,
    title: 'What the Flood Risk Dataset Can & Cannot Tell Us',
    subtitle: 'Statistical Independence & Synthetic Data Transparency',
    summary:
      'The raw tabular dataset (flood_risk_dataset_india.csv) exhibits uniform random distributions and zero predictive correlation with flood occurrences (held-out ROC AUC ~0.50). Engineers must recognize synthetic data artifacts and rely on physical hydraulic laws rather than black-box models.',
    interactiveType: 'dataset',
    quiz: [
      {
        question: 'Why does machine learning on flood_risk_dataset_india.csv yield a held-out ROC AUC of ~0.50?',
        options: [
          'The computer ran out of memory',
          'The features and target labels in this raw file were generated with pseudorandom uniform distributions with near-zero mutual information',
          'Python cannot calculate flood risk',
          'The dataset was encrypted'
        ],
        correctIndex: 1,
        explanation: 'Empirical statistical tests reveal equal class balance (50.6%) and uniform feature spreads, meaning machine learning algorithms perform at pure chance level (~0.50 ROC AUC).',
      },
    ],
  },
];

interface GlossaryEntry {
  term: string;
  category: string;
  definition: string;
  formula?: string;
  context: string;
}

const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    term: 'Rational Method',
    category: 'Hydrology',
    definition: 'A fundamental empirical formula used to determine peak runoff rate Q from small drainage catchments.',
    formula: 'Q = (C · i · A) / 360  [m³/s]',
    context: 'Assumes uniform rainfall intensity i (mm/h) across contributing area A (ha) with composite runoff coefficient C.',
  },
  {
    term: 'Runoff Coefficient (C)',
    category: 'Hydrology',
    definition: 'Dimensionless ratio representing the fraction of total rainfall that converts to surface runoff rather than infiltrating.',
    context: 'Ranges from ~0.20 for vegetated permeable parks up to 0.95 for asphalt roads and dense concrete rooftops.',
  },
  {
    term: 'Manning’s Roughness (n)',
    category: 'Hydraulics',
    definition: 'Empirical parameter quantifying boundary frictional resistance against open channel flow.',
    formula: 'V = (1/n) · R^(2/3) · S^(1/2)  [m/s]',
    context: 'Precast concrete conduits have n ≈ 0.013; silted, debris-filled unlined channels have n ≈ 0.035+.',
  },
  {
    term: 'Effective Capacity',
    category: 'Hydraulics',
    definition: 'Actual usable discharge capacity of a conduit accounting for sediment deposition and debris obstruction.',
    formula: 'Q_effective = Q_nominal · (1 - BlockageFactor)',
    context: 'A 40% blocked conduit (BlockageFactor = 0.40) only conveys 60% of its nominal hydraulic cross-section.',
  },
  {
    term: 'Flow Ratio',
    category: 'Screening',
    definition: 'Ratio of modeled peak inflow demand to effective conduit capacity.',
    formula: 'FlowRatio = Q_inflow / Q_effective',
    context: '<0.75: Nominal/Low; 0.75-1.00: Moderate; 1.00-1.50: High exceedance; >1.50: Critical surcharge.',
  },
  {
    term: 'Return Period (Recurrence Interval)',
    category: 'Hydrology',
    definition: 'Statistical likelihood of a storm event being equalled or exceeded in any given year.',
    context: 'A 10-year storm event has a 10% annual exceedance probability (AEP = 0.10).',
  },
  {
    term: 'CCTV Culvert Inspection',
    category: 'Municipal Engineering',
    definition: 'Robotic closed-circuit camera survey through stormwater conduits to detect structural cracks, siltation, and root intrusion.',
    context: 'Prioritized at candidate bottlenecks flagged by screening tools before monsoon onset.',
  },
];

export const LearnPage: FC = () => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'glossary'>('lessons');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [glossarySearch, setGlossarySearch] = useState('');

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pravaha-completed-lessons');
      if (stored) setCompletedLessons(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const markLessonComplete = (lid: number) => {
    if (!completedLessons.includes(lid)) {
      const updated = [...completedLessons, lid];
      setCompletedLessons(updated);
      localStorage.setItem('pravaha-completed-lessons', JSON.stringify(updated));
    }
  };

  const selectedLesson = LESSONS.find(l => l.id === selectedLessonId) || LESSONS[0];

  const filteredGlossary = GLOSSARY_ENTRIES.filter(
    e =>
      e.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      e.definition.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      e.category.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Educational & Technical Foundation
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Flood School & Engineering Glossary
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Master the mathematical principles, hydraulic limitations, and data science caveats behind urban drainage engineering.
          </p>
        </div>

        {/* Progress tracker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex items-center gap-3 shrink-0 shadow-sm font-mono text-xs">
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">School Progress</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {completedLessons.length} of {LESSONS.length} Lessons Completed
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Notice Box */}
      <div className="p-4 rounded-md border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Active Flood Advisory:</p>
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            If flooding is occurring in your area right now, contact local emergency services immediately (112 or local municipal control room).
            PRAVAHA is an educational and engineering decision-support tool, not an emergency warning alert system.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('lessons')}
          className={`px-5 py-2.5 border-b-2 font-bold transition-colors ${
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
          className={`px-5 py-2.5 border-b-2 font-bold transition-colors ${
            activeTab === 'glossary'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Engineering Glossary ({GLOSSARY_ENTRIES.length})
        </button>
      </div>

      {/* Tab 1: Interactive Lessons */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lessons Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-2">
              Curriculum Index
            </span>
            {LESSONS.map(lesson => {
              const isSelected = lesson.id === selectedLessonId;
              const isDone = completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-950 dark:text-teal-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] text-slate-400 block font-bold">
                      LESSON 0{lesson.id}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white block">{lesson.title}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{lesson.subtitle}</span>
                  </div>
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0 mt-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Lesson Main View (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              {/* Lesson Title Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 uppercase">
                  Lesson 0{selectedLesson.id}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedLesson.title}
                </h2>
                <p className="text-xs font-mono text-slate-500 mt-0.5">{selectedLesson.subtitle}</p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {selectedLesson.summary}
                </p>
              </div>

              {/* Interactive Widget per Lesson Type */}
              <div className="p-5 rounded-lg border border-teal-200 dark:border-teal-900 bg-teal-50/30 dark:bg-teal-950/15 space-y-4">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold text-xs uppercase font-mono">
                  <Sliders className="w-4 h-4" />
                  <span>Interactive Experiment</span>
                </div>

                {/* Lesson 1 Widget: Rational Q */}
                {selectedLesson.interactiveType === 'runoff' && (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
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
                          className="w-full accent-teal-600"
                        />
                        <span className="text-[10px] text-slate-400">
                          {cVal > 0.8 ? 'Paved / Asphalt' : cVal > 0.5 ? 'Suburban' : 'Permeable Park'}
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
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
                          className="w-full accent-teal-600"
                        />
                        <span className="text-[10px] text-slate-400">
                          {iVal >= 135 ? '100-Year Storm' : iVal >= 75 ? '25-Year Storm' : 'Moderate'}
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
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
                          className="w-full accent-teal-600"
                        />
                        <span className="text-[10px] text-slate-400">Catchment footprint</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded border border-teal-200 dark:border-teal-800 flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Calculated Peak Runoff Q:</span>
                      <span className="text-xl font-black text-teal-600 dark:text-teal-400">
                        {rationalQ(cVal, iVal, aVal).toFixed(2)} m³/s
                      </span>
                    </div>
                  </div>
                )}

                {/* Lesson 2 Widget: Manning equation */}
                {selectedLesson.interactiveType === 'manning' && (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between mb-1">
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
                          className="w-full accent-teal-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
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
                          className="w-full accent-teal-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
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
                          className="w-full accent-teal-600"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded border border-teal-200 dark:border-teal-800 flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Estimated Manning Capacity:</span>
                      <span className="text-xl font-black text-sky-600 dark:text-sky-400">
                        {((widthM * depthM * Math.pow((widthM * depthM) / (widthM + 2 * depthM), 2 / 3) * Math.sqrt(slopePct / 100)) / 0.015).toFixed(2)} m³/s
                      </span>
                    </div>
                  </div>
                )}

                {/* Lesson 3 Widget: Blockage Factor */}
                {selectedLesson.interactiveType === 'blockage' && (
                  <div className="space-y-4 text-xs font-mono">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Debris & Silt Blockage Factor:</span>
                        <span className="font-bold text-rose-600">{blockagePct}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={80}
                        step={5}
                        value={blockagePct}
                        onChange={e => setBlockagePct(Number(e.target.value))}
                        className="w-full accent-rose-600"
                      />
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Effective Conveyance Retained:</span>
                      <span className="text-xl font-black text-rose-600 dark:text-rose-400">
                        {(100 - blockagePct)}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Generic information for lessons 4, 5, 6 */}
                {(selectedLesson.interactiveType === 'bottleneck' ||
                  selectedLesson.interactiveType === 'limitations' ||
                  selectedLesson.interactiveType === 'dataset') && (
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                    Explore live factor weights and held-out statistical metrics directly in the{' '}
                    <span className="font-bold font-mono text-teal-600">/workspace</span> and{' '}
                    <span className="font-bold font-mono text-teal-600">/bottleneck</span> laboratories.
                  </div>
                )}
              </div>

              {/* Lesson Self-Check Quiz */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase font-mono">
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>Self-Check Quiz ({selectedLesson.quiz.length} Questions)</span>
                </div>

                <div className="space-y-4">
                  {selectedLesson.quiz.map((q, qIdx) => {
                    const key = `${selectedLesson.id}-${qIdx}`;
                    const selectedOpt = quizAnswers[key];
                    const isAnswered = selectedOpt !== undefined;
                    const isCorrect = selectedOpt === q.correctIndex;

                    return (
                      <div
                        key={qIdx}
                        className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-3 text-xs"
                      >
                        <p className="font-bold text-slate-900 dark:text-white font-sans">
                          {qIdx + 1}. {q.question}
                        </p>

                        <div className="space-y-1.5">
                          {q.options.map((opt, oIdx) => {
                            const isChosen = selectedOpt === oIdx;
                            let btnCls = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300';
                            if (isAnswered) {
                              if (oIdx === q.correctIndex) {
                                btnCls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold';
                              } else if (isChosen) {
                                btnCls = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={isAnswered}
                                onClick={() => {
                                  setQuizAnswers(prev => ({ ...prev, [key]: oIdx }));
                                }}
                                className={`w-full text-left p-2.5 rounded border text-xs transition-colors flex items-center justify-between ${btnCls}`}
                              >
                                <span>{opt}</span>
                                {isAnswered && oIdx === q.correctIndex && (
                                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {isAnswered && (
                          <div className={`p-2.5 rounded text-[11px] leading-relaxed ${
                            isCorrect ? 'bg-emerald-100/60 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200' : 'bg-rose-100/60 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200'
                          }`}>
                            <span className="font-bold">{isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}</span>
                            <span>{q.explanation}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => markLessonComplete(selectedLesson.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    <span>Mark Lesson Complete</span>
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Technical Glossary */}
      {activeTab === 'glossary' && (
        <div className="space-y-6">
          {/* Glossary Search Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={glossarySearch}
              onChange={e => setGlossarySearch(e.target.value)}
              placeholder="Search engineering terms, formulas, categories..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((entry, idx) => (
              <div
                key={idx}
                className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm font-sans">
                    {entry.term}
                  </h3>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 border border-slate-200 dark:border-slate-700">
                    {entry.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {entry.definition}
                </p>

                {entry.formula && (
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-teal-700 dark:text-teal-300">
                    {entry.formula}
                  </div>
                )}

                <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                  Context: {entry.context}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
