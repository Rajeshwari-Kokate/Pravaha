/**
 * MethodologyPage.tsx
 * Methodology view matching master prompt:
 * Left sub-navigation: Data Sources, Simulation Approach, Drainage Network Model,
 * Bottleneck Analysis, Dataset and Model Card, Limitations, Future Work.
 * Data Sources table strictly derived from DATA_PROVENANCE.md and DATASET_REPORT.md.
 */
import { useState, type FC } from 'react';
import { Database, GitBranch, Layers, Sliders, ShieldAlert, Compass, Sparkles } from 'lucide-react';

export const MethodologyPage: FC = () => {
  const [activeTab, setActiveTab] = useState<
    'sources' | 'simulation' | 'drainage' | 'bottleneck' | 'modelcard' | 'limitations' | 'future'
  >('sources');

  const navItems = [
    { id: 'sources' as const, label: 'Data Sources', icon: Database },
    { id: 'simulation' as const, label: 'Simulation Approach', icon: Compass },
    { id: 'drainage' as const, label: 'Drainage Network Model', icon: GitBranch },
    { id: 'bottleneck' as const, label: 'Bottleneck Analysis', icon: Sliders },
    { id: 'modelcard' as const, label: 'Dataset & Model Card', icon: Layers },
    { id: 'limitations' as const, label: 'Limitations', icon: ShieldAlert },
    { id: 'future' as const, label: 'Future Work', icon: Sparkles },
  ];

  // REAL Data Sources from docs/DATA_PROVENANCE.md
  const dataSources = [
    {
      dataset: 'Road Network and Civic Assets',
      source: 'OpenStreetMap contributors via Overpass API',
      description: 'Road centerlines and critical civic infrastructure (hospitals, fire stations, substations) in Koramangala Catchment',
      licence: 'Open Database License (ODbL) 1.0',
    },
    {
      dataset: 'Synthetic Drainage Network',
      source: 'Deterministic Model (Seed 42)',
      description: 'Conduit centerlines aligned to road centerlines directed toward Bellandur valley low points with synthetic capacities',
      licence: 'Internal Demonstration Model (CC BY 4.0)',
    },
    {
      dataset: 'Regional Flood Risk Dataset',
      source: 'Tabular Dataset (flood_risk_dataset_india.csv)',
      description: '10,000 multi-variable flood observations across India used for regional susceptibility ML benchmarking',
      licence: 'Origin and licence unverified (Research demonstration)',
    },
    {
      dataset: 'Basemap Tiles',
      source: 'CARTO (Positron & Dark Matter)',
      description: 'Raster and vector basemap tiles with OpenStreetMap boundary references',
      licence: 'OpenStreetMap contributors / CARTO Free Tier',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="pb-3 border-b border-border">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-ink">
          Methodology
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Hydraulic formulations, network algorithms, data provenance, and engineering limitations.
        </p>
      </div>

      {/* Main 2-Column: Left Sub-navigation + Right Section Content */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sub-Navigation */}
        <nav className="w-full lg:w-60 shrink-0 flex flex-col gap-1 select-none" aria-label="Methodology sections">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-left transition-all ${
                activeTab === id
                  ? 'bg-sage-300 text-ink font-bold border border-border shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-pink/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-sage-700 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Right Section Content */}
        <div className="flex-1 w-full bg-surface p-6 sm:p-8 rounded-xl border border-border shadow-offset text-xs text-ink space-y-6">
          {/* Tab 1: Data Sources Table */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold font-display text-ink">Data Sources</h2>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  This project uses publicly available and open datasets. All data is used for demonstration and research purposes only.
                </p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-background font-mono text-[10px] text-ink-muted uppercase border-b border-border">
                    <tr>
                      <th className="p-3">Dataset</th>
                      <th className="p-3">Source</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Licence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {dataSources.map((row, i) => (
                      <tr key={i} className="hover:bg-cream dark:hover:bg-background/80">
                        <td className="p-3 font-bold text-ink whitespace-nowrap">{row.dataset}</td>
                        <td className="p-3 font-mono text-sage-700 whitespace-nowrap">{row.source}</td>
                        <td className="p-3 text-ink-muted leading-normal">{row.description}</td>
                        <td className="p-3 font-mono text-[11px] whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-background border border-border text-ink-muted">
                            {row.licence}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Simulation Approach */}
          {activeTab === 'simulation' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold font-display text-ink">Simulation Approach</h2>
              <p className="text-xs text-ink leading-relaxed">
                Catchment runoff generation implements the standard Rational Method formula:
              </p>
              <div className="p-3.5 rounded-lg border border-border bg-background font-mono text-xs font-bold text-sage-900 dark:text-cream">
                Q = (C × i × A) / 360  [m³/s]
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-ink-muted leading-relaxed">
                <li><strong className="text-ink">Q</strong>: Peak storm runoff rate in cubic meters per second (m³/s).</li>
                <li><strong className="text-ink">C</strong>: Dimensionless composite runoff coefficient (0.70 baseline for high-density urban areas).</li>
                <li><strong className="text-ink">i</strong>: Rainfall intensity in millimeters per hour (mm/hr).</li>
                <li><strong className="text-ink">A</strong>: Contributing subcatchment area in hectares (ha).</li>
              </ul>
            </div>
          )}

          {/* Tab 3: Drainage Network Model */}
          {activeTab === 'drainage' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold font-display text-ink">Drainage Network Model</h2>
              <p className="text-xs text-ink-muted leading-relaxed">
                The drainage network is modeled as a directed acyclic graph (DAG) directed downstream toward the Bellandur valley line. Runoff propagates in topological order:
              </p>
              <div className="p-3.5 rounded-lg border border-border bg-background font-mono text-xs">
                Q_effective = Nominal_Capacity × (1 - Blockage_Factor)
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                When upstream inflow exceeds effective capacity, the segment surcharges and excess flow is tagged as surface accumulation at the terminal node.
              </p>
            </div>
          )}

          {/* Tab 4: Bottleneck Analysis */}
          {activeTab === 'bottleneck' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold font-display text-ink">Bottleneck Analysis</h2>
              <p className="text-xs text-ink-muted leading-relaxed">
                Conduits are scored and ranked using linear multi-criteria weights across flow exceedance ratio, physical blockage factor, downstream topological dependency, and channel hierarchy.
              </p>
            </div>
          )}

          {/* Tab 5: Dataset & Model Card */}
          {activeTab === 'modelcard' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold font-display text-ink">Dataset & Model Card</h2>
              <p className="text-xs text-ink-muted leading-relaxed">
                Regional susceptibility models (Logistic Regression and Gradient Boosted Decision Trees) were evaluated on 10,000 rows with an 80/20 train/test split. Both models achieved ROC AUC scores hovering around 0.49 to 0.50 (chance level), confirming that the regional dataset lacks strong predictive signal and should be treated as synthetic demonstration data only.
              </p>
            </div>
          )}

          {/* Tab 6: Limitations */}
          {activeTab === 'limitations' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold font-display text-ink">Limitations</h2>
              <ul className="list-disc pl-5 space-y-2 text-xs text-ink leading-relaxed">
                <li>Drainage alignments and dimensions are synthetically generated from OpenStreetMap road alignments.</li>
                <li>Digital elevation models (DEM) were unavailable at fine scale; an assumed uniform hydraulic slope of 0.8% was applied.</li>
                <li>Simulations do not model pressurized pipe flow or dynamic backwater wave equations.</li>
              </ul>
            </div>
          )}

          {/* Tab 7: Future Work */}
          {activeTab === 'future' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold font-display text-ink">Future Work</h2>
              <ul className="list-disc pl-5 space-y-2 text-xs text-ink leading-relaxed">
                <li>Integration of municipal GIS underground stormwater survey layers when released into open data portals.</li>
                <li>High-resolution LiDAR digital surface models for fine-grained street gutter routing.</li>
                <li>Full dynamic Saint-Venant hydraulic wave routing for multi-timestep unsteady simulations.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
