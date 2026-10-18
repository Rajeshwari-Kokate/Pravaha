import { type FC } from 'react';
import { useParams } from 'react-router-dom';
import { Printer, Cpu } from 'lucide-react';
import { CopyButton } from '../components/common/CopyButton';

export const ReportPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const reportId = id || 'REP-2026-DEMO-01';

  const sampleReportData = {
    report_id: reportId,
    timestamp: '2026-10-18T14:30:00Z',
    study_area: 'Koramangala Catchment, Bengaluru',
    rainfall_scenario: {
      intensity_mm_h: 65,
      duration_hours: 2.0,
      total_precipitation_mm: 130,
    },
    modeled_exceedance_segments: 28,
    affected_roads_count: 14,
    candidate_bottlenecks: [
      { id: 'DRN-SEG-042', exceedance_ratio: 1.84, score: 92.4, primary_factor: 'Conduit cross-section constriction' },
      { id: 'DRN-SEG-089', exceedance_ratio: 1.62, score: 86.1, primary_factor: 'Heavy upstream contributing tributary convergence' },
    ],
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:m-0">
      {/* Top Header / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Investigation Report
            </span>
            <span className="text-slate-400 font-mono text-xs">/</span>
            <span className="font-mono text-xs text-slate-500">{reportId}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Drainage Capacity and Flood Risk Analysis
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton textToCopy={JSON.stringify(sampleReportData, null, 2)} label="Copy JSON" />
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Body */}
      <div className="space-y-6">
        {/* Scenario Specs Card */}
        <div className="p-6 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              1. Scenario Configuration & Provenance
            </h2>
            <span className="font-mono text-xs text-slate-500">Seed: 42 (Deterministic)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Rainfall Intensity</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">65 mm/h</span>
            </div>
            <div>
              <span className="text-slate-500 block">Duration</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">2.0 Hours</span>
            </div>
            <div>
              <span className="text-slate-500 block">Conduit Network</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">Synthetic (Road-Aligned)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Elevation Reference</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Carto DEM & Valley Line</span>
            </div>
          </div>
        </div>

        {/* AI Synthesis Box */}
        <div className="p-6 rounded-md border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20 space-y-3">
          <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300">
            <Cpu className="w-4 h-4" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider">
              Technical Narrative (Gemma 4 Instruction-Tuned)
            </h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Under the modeled 65 mm/h design storm scenario, peak discharge overwhelms secondary storm conduits along the 80 Feet Road arterial corridor, with 28 candidate segments exceeding nominal conveyance capacity. The hydraulic routing heuristic identifies DRN-SEG-042 as the primary candidate bottleneck due to cross-section narrowing immediately upstream of the regional collector junction.
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-teal-700 dark:text-teal-400">
            <span>Model: google/gemma-4-E4B-it</span>
            <span>Verified Evidence IDs: [EVID-SIM-01, EVID-SIM-04]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
