/**
 * SegmentMiniMap.tsx
 * Mini-map schematic visualizing the selected drainage segment, connected upstream
 * and downstream nodes, and status legend.
 */
import type { FC } from 'react';
import { MapPin } from 'lucide-react';

interface SegmentMiniMapProps {
  segmentId: string;
  fromNode: string;
  toNode: string;
  isOverloaded?: boolean;
}

export const SegmentMiniMap: FC<SegmentMiniMapProps> = ({
  segmentId = 'D-104',
  fromNode = 'N-23',
  toNode = 'N-24',
  isOverloaded = true,
}) => {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-surface shadow-offset text-xs select-none">
      <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
        <span className="font-display font-bold text-ink flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-sage-700" /> Segment Topology
        </span>
        <span className="font-mono text-[10px] text-ink-muted">{segmentId}</span>
      </div>

      <div className="relative w-full h-44 bg-background rounded-lg border border-border overflow-hidden flex items-center justify-center">
        {/* Vector Schematic SVG */}
        <svg viewBox="0 0 340 160" className="w-full h-full">
          {/* Background grid */}
          <pattern id="minimap-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" className="text-border/30" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#minimap-grid)" />

          {/* Other Segments (Background) */}
          <line x1="20" y1="30" x2="90" y2="70" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="250" y1="90" x2="320" y2="130" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="80" y1="130" x2="90" y2="70" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />

          {/* Connected Network (Upstream to N-23) */}
          <line x1="30" y1="70" x2="90" y2="70" stroke="#3A7F8F" strokeWidth="3" />
          <line x1="50" y1="110" x2="90" y2="70" stroke="#3A7F8F" strokeWidth="3" />

          {/* Connected Network (Downstream from N-24) */}
          <line x1="250" y1="90" x2="310" y2="90" stroke="#3A7F8F" strokeWidth="3" />

          {/* Selected Segment (Between N-23 and N-24) */}
          {/* Highlight casing */}
          <line
            x1="90"
            y1="70"
            x2="250"
            y2="90"
            stroke="#F6E2E9"
            strokeWidth="10"
            strokeLinecap="round"
            className="opacity-90"
          />
          {/* Main conduit line */}
          <line
            x1="90"
            y1="70"
            x2="250"
            y2="90"
            stroke={isOverloaded ? '#E0803A' : '#3A7F8F'}
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Node N-23 (From) */}
          <circle cx="90" cy="70" r="6" fill="#3A7F8F" stroke="#FEFAF3" strokeWidth="2" />
          <text x="90" y="58" textAnchor="middle" className="fill-ink text-[10px] font-mono font-bold">
            {fromNode}
          </text>

          {/* Node N-24 (To) */}
          <circle cx="250" cy="90" r="6" fill="#3A7F8F" stroke="#FEFAF3" strokeWidth="2" />
          <text x="250" y="110" textAnchor="middle" className="fill-ink text-[10px] font-mono font-bold">
            {toNode}
          </text>

          {/* Upstream / Downstream helper nodes */}
          <circle cx="30" cy="70" r="4" fill="#3A7F8F" />
          <circle cx="50" cy="110" r="4" fill="#3A7F8F" />
          <circle cx="310" cy="90" r="4" fill="#3A7F8F" />
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[10px] font-mono text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#E0803A]" /> Selected Segment
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#3A7F8F]" /> Connected Network
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#B3261E]" /> Over Capacity
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#CBD5E1]" /> Other Segments
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3A7F8F]" /> Node
        </span>
      </div>
    </div>
  );
};
