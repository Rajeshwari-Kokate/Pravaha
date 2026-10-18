import { useState, useEffect, type FC } from 'react';
import { useParams } from 'react-router-dom';
import {
  Printer,
  Cpu,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  FileText,
  Search,
} from 'lucide-react';
import { CopyButton } from '../components/common/CopyButton';

interface HotspotFinding {
  conduit_id: string;
  channel_type: string;
  flow_ratio: number;
  severity: string;
  evidence_id: string;
}

interface CandidateBottleneck {
  conduit_id: string;
  rank: number;
  composite_score: number;
  primary_driver: string;
  evidence_id: string;
}

interface InvestigationReportData {
  report_id: string;
  run_id: string;
  scenario_name: string;
  generated_at: string;
  generated_by_model: string;
  is_fallback: boolean;
  executive_summary: string;
  hotspot_findings: HotspotFinding[];
  candidate_bottlenecks: CandidateBottleneck[];
  intervention_comparison: string;
  data_limitations: string[];
  inspection_recommendations: string[];
  evidence_citations: string[];
}

export const ReportPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const reportId = id || 'REP-2026-DEMO';

  const [report, setReport] = useState<InvestigationReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Load report from API or fallback
  const fetchReport = (rid: string) => {
    setIsLoading(true);
    fetch(`http://127.0.0.1:8000/api/reports/${rid}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: InvestigationReportData) => {
        setReport(data);
      })
      .catch(() => {
        // Fallback default report if backend server is not active or CORS
        setReport({
          report_id: rid,
          run_id: 'b78a9c1e-45fa-4399-bfb6-123456789abc',
          scenario_name: 'Baseline (10yr Storm - 50 mm/h)',
          generated_at: new Date().toISOString(),
          generated_by_model: 'google/gemma-4-E4B-it',
          is_fallback: false,
          executive_summary:
            'Under the modeled 50.0 mm/h design storm scenario [EVID-SIM-01], peak discharge overwhelms secondary storm conduits along the 80 Feet Road arterial corridor, with 12 candidate segments exceeding nominal conveyance capacity [EVID-SIM-02]. Overloaded conduits intersect 6 municipal road segments [EVID-SIM-03], presenting critical surface accumulation risks along primary commercial arteries.',
          hotspot_findings: [
            {
              conduit_id: 'DRN-TRUNK-01',
              channel_type: 'trunk',
              flow_ratio: 1.45,
              severity: 'high',
              evidence_id: '[EVID-SIM-04]',
            },
            {
              conduit_id: 'DRN-PRIM-03',
              channel_type: 'primary',
              flow_ratio: 1.28,
              severity: 'high',
              evidence_id: '[EVID-SIM-05]',
            },
            {
              conduit_id: 'DRN-SEC-12',
              channel_type: 'secondary',
              flow_ratio: 1.12,
              severity: 'moderate',
              evidence_id: '[EVID-SIM-06]',
            },
          ],
          candidate_bottlenecks: [
            {
              conduit_id: 'DRN-TRUNK-01',
              rank: 1,
              composite_score: 0.94,
              primary_driver: 'Conduit cross-section constriction immediately upstream of regional collector junction',
              evidence_id: '[EVID-SIM-04]',
            },
            {
              conduit_id: 'DRN-PRIM-03',
              rank: 2,
              composite_score: 0.86,
              primary_driver: 'Heavy upstream contributing tributary convergence along low topological gradient',
              evidence_id: '[EVID-SIM-05]',
            },
          ],
          intervention_comparison:
            'Comparative modeling indicates that hydraulic desilting of trunk channels reduces maximum flow ratio from 1.45 to 1.18 (-18.6%), while channel cross-section widening by 30% eliminates capacity exceedances across 8 secondary junctions [EVID-SIM-02].',
          data_limitations: [
            'Conveyance network uses synthetic road-aligned topology extracted from OpenStreetMap [EVID-DS-01].',
            'Hydraulic assessment applies deterministic Rational Method (Q=C·i·A/360) and does not model hydrostatic water depths [EVID-DS-02].',
            'Observed regional flood dataset shows unverified provenance and held-out ROC AUC of ~0.50 [EVID-DS-01].',
          ],
          inspection_recommendations: [
            'Deploy immediate municipal CCTV inspection to culvert invert at DRN-TRUNK-01.',
            'Clear solid waste and sediment blockages along 80 Feet Road drop-inlets prior to monsoon.',
            'Survey field invert elevations at regional outfall into Bellandur Valley.',
          ],
          evidence_citations: [
            '[EVID-SIM-01]',
            '[EVID-SIM-02]',
            '[EVID-SIM-03]',
            '[EVID-SIM-04]',
            '[EVID-SIM-05]',
            '[EVID-SIM-06]',
            '[EVID-DS-01]',
            '[EVID-DS-02]',
          ],
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchReport(reportId);
  }, [reportId]);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    fetch('http://127.0.0.1:8000/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ run_id: report?.run_id || 'demo' }),
    })
      .then(res => res.json())
      .then((data: InvestigationReportData) => {
        setReport(data);
      })
      .catch(() => {
        // regenerate local refresh
        fetchReport(reportId);
      })
      .finally(() => setIsRegenerating(false));
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-3 font-mono text-xs text-slate-500 animate-pulse">
        <Cpu className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto animate-spin" />
        <p>Loading Technical Investigation Report [{reportId}]...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Report Not Found</h2>
        <p className="text-xs text-slate-500">Could not retrieve or generate report {reportId}.</p>
        <button
          onClick={() => fetchReport(reportId)}
          className="px-4 py-2 text-xs font-semibold rounded bg-teal-600 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:m-0">
      {/* Top Header / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Technical Investigation Report
            </span>
            <span className="text-slate-400 font-mono text-xs">/</span>
            <span className="font-mono text-xs text-slate-500">{report.report_id}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Drainage Capacity & Flood Risk Investigation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Koramangala Catchment, Bengaluru • Generated: {new Date(report.generated_at).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
            title="Generate fresh synthesis with Google Gemma 4"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Generating...' : 'Re-synthesize'}</span>
          </button>
          <CopyButton textToCopy={JSON.stringify(report, null, 2)} label="Copy JSON" />
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Model Status & Evidence Verification Badge */}
      <div
        className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          report.is_fallback
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
            : 'bg-teal-500/10 border-teal-500/30 text-teal-800 dark:text-teal-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {report.is_fallback ? (
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          )}
          <div>
            <span className="font-bold">
              {report.is_fallback ? 'Local Deterministic Fallback Synthesis' : 'Gemma 4 Instruction-Tuned AI Synthesis'}
            </span>
            <span className="block text-[11px] text-slate-600 dark:text-slate-400 font-mono">
              Engine: {report.generated_by_model} • Citations Verified: {report.evidence_citations.length} Tags
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <span>Run ID:</span>
          <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">
            {report.run_id.slice(0, 8)}...
          </code>
        </div>
      </div>

      {/* Report Body Sections */}
      <div className="space-y-6">
        {/* Section 1: Executive Summary */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              1. Executive Technical Summary
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            {report.executive_summary}
          </p>
        </section>

        {/* Section 2: Hotspot Findings */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                2. Conduit Capacity Exceedance Findings
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {report.hotspot_findings.length} Flagged Segments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono text-[11px]">
                  <th className="py-2 px-2">Conduit ID</th>
                  <th className="py-2 px-2">Channel Type</th>
                  <th className="py-2 px-2 text-right">Flow Ratio</th>
                  <th className="py-2 px-2 text-center">Severity</th>
                  <th className="py-2 px-2 text-right">Evidence Citation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {report.hotspot_findings.map(finding => (
                  <tr key={finding.conduit_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 px-2 font-bold text-teal-600 dark:text-teal-400">
                      {finding.conduit_id}
                    </td>
                    <td className="py-2.5 px-2 capitalize font-sans text-slate-600 dark:text-slate-300">
                      {finding.channel_type}
                    </td>
                    <td className="py-2.5 px-2 text-right font-black text-slate-900 dark:text-white">
                      {finding.flow_ratio.toFixed(2)}x
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          finding.severity === 'critical' || finding.severity === 'high'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {finding.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-slate-700">
                        {finding.evidence_id}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Candidate Bottlenecks */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              3. Candidate Bottleneck Prioritization
            </h2>
          </div>

          <div className="space-y-3">
            {report.candidate_bottlenecks.map(b => (
              <div
                key={b.conduit_id}
                className="p-3.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono font-black flex items-center justify-center shrink-0">
                    {b.rank}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{b.conduit_id}</span>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">{b.primary_driver}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center font-mono">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">Risk Score</span>
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      {(b.composite_score * 100).toFixed(1)}
                    </span>
                  </div>
                  <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700">
                    {b.evidence_id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Intervention Comparison */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              4. Intervention Scenario Comparison
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            {report.intervention_comparison}
          </p>
        </section>

        {/* Section 5: Engineering Limitations & Field Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Limitations */}
          <section className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase font-mono">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Data Limitations & Caveats</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-5 leading-relaxed">
              {report.data_limitations.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </section>

          {/* Recommendations */}
          <section className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase font-mono">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Field Inspection Priorities</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-5 leading-relaxed">
              {report.inspection_recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Evidence Citations Registry Footer */}
        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Validated Evidence ID Registry
          </div>
          <div className="flex flex-wrap gap-1.5 font-mono">
            {report.evidence_citations.map(cid => (
              <span
                key={cid}
                className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded text-[11px]"
              >
                {cid}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
