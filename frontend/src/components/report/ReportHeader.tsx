/**
 * ReportHeader.tsx
 * Header for investigation report with Pravaha mark, title,
 * Gemma generation subtitle, print-friendly PDF trigger, and JSON export.
 */
import type { FC } from 'react';
import { Download, Printer } from 'lucide-react';
import { PravahaLogo } from '../common/PravahaLogo';

interface ReportHeaderProps {
  reportId: string;
  generatedByModel: string;
  onExportJson: () => void;
}

export const ReportHeader: FC<ReportHeaderProps> = ({
  reportId,
  generatedByModel,
  onExportJson,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
      <div className="flex items-start gap-3">
        <PravahaLogo size={32} />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-ink">
              Investigation Report
            </h1>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-border bg-background text-ink-muted">
              {reportId}
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            Hydraulic narrative synthesized by {generatedByModel} from deterministic simulation data.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          title="Print or save as PDF"
          className="btn-secondary px-3.5 py-2 inline-flex items-center gap-2 text-xs font-semibold shadow-offset active:translate-x-[1px] active:translate-y-[1px]"
        >
          <Printer className="w-3.5 h-3.5 text-sage-700" />
          <span>Download PDF</span>
        </button>

        <button
          type="button"
          onClick={onExportJson}
          className="btn-primary px-3.5 py-2 inline-flex items-center gap-2 text-xs font-bold"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export JSON</span>
        </button>
      </div>
    </div>
  );
};
