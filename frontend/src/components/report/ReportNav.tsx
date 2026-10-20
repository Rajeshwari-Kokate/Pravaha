/**
 * ReportNav.tsx
 * Left section navigation for Investigation Report.
 */
import type { FC } from 'react';
import {
  FileText,
  Search,
  Building2,
  AlertTriangle,
  GitCompare,
  ClipboardList,
  BookOpen,
} from 'lucide-react';

export type ReportSectionId =
  | 'summary'
  | 'findings'
  | 'infrastructure'
  | 'bottlenecks'
  | 'scenarios'
  | 'inspection'
  | 'methodology';

interface ReportNavProps {
  activeSection: ReportSectionId;
  onSelectSection: (id: ReportSectionId) => void;
}

export const ReportNav: FC<ReportNavProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const sections: { id: ReportSectionId; label: string; icon: typeof FileText }[] = [
    { id: 'summary', label: 'Executive Summary', icon: FileText },
    { id: 'findings', label: 'Key Findings', icon: Search },
    { id: 'infrastructure', label: 'Affected Infrastructure', icon: Building2 },
    { id: 'bottlenecks', label: 'Bottleneck Analysis', icon: AlertTriangle },
    { id: 'scenarios', label: 'Scenario Comparison', icon: GitCompare },
    { id: 'inspection', label: 'Suggested Inspection Priorities', icon: ClipboardList },
    { id: 'methodology', label: 'Methodology and Assumptions', icon: BookOpen },
  ];

  return (
    <nav className="flex flex-col gap-1 w-full lg:w-64 shrink-0 print:hidden select-none" aria-label="Report sections">
      {sections.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelectSection(id)}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-left transition-all ${
            activeSection === id
              ? 'bg-sage-300 text-ink font-bold border border-border shadow-sm'
              : 'text-ink-muted hover:text-ink hover:bg-pink/40'
          }`}
        >
          <Icon className="w-3.5 h-3.5 text-sage-700 shrink-0" />
          <span className="truncate">{label}</span>
        </button>
      ))}
    </nav>
  );
};
