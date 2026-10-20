export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  summary: string;
  interactiveType: 'runoff' | 'manning' | 'blockage' | 'bottleneck' | 'limitations' | 'dataset';
  quiz: QuizQuestion[];
}

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'How Rain Becomes Runoff',
    subtitle: 'Surface Imperviousness and The Rational Method',
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
          'It only works in deserts',
        ],
        correctIndex: 0,
        explanation: 'The Rational Method assumes uniform rainfall distribution and duration equal to the time of concentration, an assumption that breaks down across large river basins.',
      },
    ],
  },
  {
    id: 2,
    title: 'What Drainage Capacity Means',
    subtitle: 'Cross-Section Geometry and Manning Conveyance',
    summary:
      'A storm drain or culvert can only convey a finite discharge before water fills the barrel. Nominal capacity Q is determined by Manning equation: Q = (1/n) · A · R^(2/3) · S^(1/2). Channel width, depth, slope, and wall roughness determine whether a pipe can evacuate runoff.',
    interactiveType: 'manning',
    quiz: [
      {
        question: 'What does Manning roughness coefficient "n" represent?',
        options: [
          'The slope of the terrain',
          'Friction resistance of the channel boundary against flowing water',
          'The length of the conduit',
          'The height of the storm cloud',
        ],
        correctIndex: 1,
        explanation: 'Manning n quantifies boundary friction. Smooth concrete has low n (~0.013), while silted or weed-choked channels have high n (~0.035+), drastically reducing flow velocity.',
      },
      {
        question: 'If a conduit slope S decreases from 1.0% to 0.25%, what happens to flow velocity?',
        options: ['Velocity is halved', 'Velocity doubles', 'Velocity quadruples', 'Velocity remains identical'],
        correctIndex: 0,
        explanation: 'Velocity is proportional to S^(1/2). The square root of 0.25 is half that of 1.0, so flow velocity drops by 50%.',
      },
    ],
  },
  {
    id: 3,
    title: 'How a Blockage Creates an Upstream Problem',
    subtitle: 'Hydraulic Backwater and Tributary Surcharge',
    summary:
      'Solid waste, silt, and debris constrict the cross-sectional area of a conduit. When a downstream conduit becomes choked, water accumulates upstream, causing water levels to rise and surcharging secondary tributaries that would otherwise drain safely.',
    interactiveType: 'blockage',
    quiz: [
      {
        question: 'When a downstream trunk channel is 50% blocked by debris, which conduits are at greatest risk of overflowing?',
        options: [
          'Conduits at the far ocean outfall',
          'Directly upstream tributary conduits whose outflows are obstructed',
          'Only dry roads on hills',
          'None of them',
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
          'Trunk conduits never clog',
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
          'It guarantees zero rainfall',
        ],
        correctIndex: 1,
        explanation: 'Screening models identify which conduits exceed nominal conveyance capacity under design rainfall, serving as tactical decision support for CCTV inspection and maintenance prioritization.',
      },
    ],
  },
  {
    id: 6,
    title: 'What the Flood Risk Dataset Can and Cannot Tell Us',
    subtitle: 'Statistical Independence and Synthetic Data Transparency',
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
          'The dataset was encrypted',
        ],
        correctIndex: 1,
        explanation: 'Empirical statistical tests reveal equal class balance (50.6%) and uniform feature spreads, meaning machine learning algorithms perform at pure chance level (~0.50 ROC AUC).',
      },
    ],
  },
];

export interface GlossaryEntry {
  term: string;
  category: string;
  definition: string;
  formula?: string;
  context: string;
}

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
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
    term: 'Manning Roughness (n)',
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
