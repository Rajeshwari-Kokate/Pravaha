import { useState, useMemo, type FC } from 'react';
import { CloudRain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { runSimulation } from '../../lib/simulation';
import type { ConduitInput } from '../../lib/simulation';

const DEMO_CONDUITS: ConduitInput[] = [
  { id: 'TRUNK-01', fromNode: 'J1', toNode: 'J2', channelType: 'trunk', lengthM: 600, nominalCapacityM3s: 14, effectiveCapacityM3s: 9.8, blockageFactor: 0.30, coordinates: [[77.620, 12.935], [77.625, 12.935]] },
  { id: 'PRIM-01', fromNode: 'J2', toNode: 'J3', channelType: 'primary', lengthM: 450, nominalCapacityM3s: 8.5, effectiveCapacityM3s: 6.8, blockageFactor: 0.20, coordinates: [[77.625, 12.935], [77.630, 12.936]] },
  { id: 'PRIM-02', fromNode: 'J2', toNode: 'J4', channelType: 'primary', lengthM: 520, nominalCapacityM3s: 7.0, effectiveCapacityM3s: 5.6, blockageFactor: 0.20, coordinates: [[77.625, 12.935], [77.627, 12.940]] },
  { id: 'SEC-01', fromNode: 'J4', toNode: 'J5', channelType: 'secondary', lengthM: 350, nominalCapacityM3s: 4.2, effectiveCapacityM3s: 3.36, blockageFactor: 0.20, coordinates: [[77.627, 12.940], [77.632, 12.942]] },
  { id: 'SEC-02', fromNode: 'J3', toNode: 'OUT', channelType: 'secondary', lengthM: 400, nominalCapacityM3s: 5.5, effectiveCapacityM3s: 4.4, blockageFactor: 0.20, coordinates: [[77.630, 12.936], [77.635, 12.937]] },
  { id: 'ROADSIDE-01', fromNode: 'J1', toNode: 'J4', channelType: 'roadside', lengthM: 650, nominalCapacityM3s: 2.8, effectiveCapacityM3s: 1.82, blockageFactor: 0.35, coordinates: [[77.620, 12.935], [77.627, 12.940]] },
];

export const RainCordHero: FC = () => {
  // Intensity in mm/hr (10 to 140)
  const [rainfallMmHr, setRainfallMmHr] = useState<number>(50);

  // Live simulation execution using client-side TypeScript engine
  const simResult = useMemo(() => {
    return runSimulation(DEMO_CONDUITS, {
      scenarioName: `Interactive Rain Cord (${rainfallMmHr} mm/h)`,
      rainfallIntensityMmHr: rainfallMmHr,
      returnPeriodLabel: rainfallMmHr >= 135 ? '100yr' : rainfallMmHr >= 75 ? '25yr' : rainfallMmHr >= 50 ? '10yr' : '5yr',
      globalAreaHa: 50,
      globalRunoffCoeff: 0.70,
      durationSteps: 12,
      stepMinutes: 5,
    });
  }, [rainfallMmHr]);

  const overloadedCount = simResult.summaryOverloaded;
  const maxFlowRatio = simResult.summaryMaxFlowRatio;

  // Visual SVG coordinates mapping for demo topology
  const nodes = [
    { id: 'J1', x: 50, y: 130, label: 'J-100FT (Upstream)' },
    { id: 'J2', x: 180, y: 130, label: 'J-80FT Junction' },
    { id: 'J3', x: 310, y: 140, label: 'J-Koramangala 4B' },
    { id: 'J4', x: 230, y: 50, label: 'J-Sony World Cross' },
    { id: 'J5', x: 370, y: 40, label: 'J-Inner Ring Inflow' },
    { id: 'OUT', x: 440, y: 140, label: 'Outfall (Valley)' },
  ];

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-lg overflow-hidden">
      {/* Top Banner */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/40">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-600 dark:text-teal-400">
            Tactical Interactive Preview
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Pull the Rain Cord</span>
            <span className="text-xs font-normal text-slate-500 font-mono">(Live Client-Side Hydrodynamics)</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {([
            { label: '5yr (30mm)', val: 30 },
            { label: '10yr (50mm)', val: 50 },
            { label: '25yr (75mm)', val: 75 },
            { label: '100yr (135mm)', val: 135 },
          ] as const).map(preset => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setRainfallMmHr(preset.val)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                rainfallMmHr === preset.val
                  ? 'bg-teal-600 text-white font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Left: Tactile Rain Cord Slider & Live Metrics (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-teal-600" />
                  <span>Rainfall Intensity (i)</span>
                </span>
                <span className="font-mono text-base font-black text-slate-900 dark:text-white">
                  {rainfallMmHr} mm/h
                </span>
              </div>

              {/* Tactical Rain Cord Slider */}
              <input
                type="range"
                min={15}
                max={150}
                step={5}
                value={rainfallMmHr}
                onChange={e => setRainfallMmHr(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Light (15 mm/h)</span>
                <span>Design Storm (75 mm/h)</span>
                <span>Extreme (150 mm/h)</span>
              </div>
            </div>

            {/* Live Hydraulic KPI cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Overloaded Links</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className={`text-xl font-black font-mono ${
                    overloadedCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600'
                  }`}>
                    {overloadedCount}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ 6</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Peak Flow Ratio</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className={`text-xl font-black font-mono ${
                    maxFlowRatio >= 1.5 ? 'text-rose-600' : maxFlowRatio >= 1.0 ? 'text-amber-500' : 'text-emerald-600'
                  }`}>
                    {maxFlowRatio.toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>

            {/* Real-time Status Caption */}
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans bg-slate-50 dark:bg-slate-850 p-3 rounded border border-slate-100 dark:border-slate-800">
              {maxFlowRatio < 1.0 ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  ✓ Flow is within effective conveyance capacity across all primary conduits.
                </span>
              ) : maxFlowRatio < 1.5 ? (
                <span className="text-amber-700 dark:text-amber-400 font-medium">
                  ⚠ Capacity threshold reached on {overloadedCount} conduits. Surface surcharge begins at constriction nodes.
                </span>
              ) : (
                <span className="text-rose-700 dark:text-rose-400 font-medium">
                  🚨 Critical surcharge exceedance. Hydraulic backwater propagation along trunk corridor.
                </span>
              )}
            </div>
          </div>

          <Link
            to="/workspace"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <span>Investigate Full Koramangala Network in Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Right: Interactive SVG Mini-Map Schematic (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-lg p-4 border border-slate-800 flex flex-col justify-between relative overflow-hidden min-h-[280px]">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-800">
            <span>KORAMANGALA CATCHMENT SCHEMATIC</span>
            <span className="text-teal-400">SEED 42 DRAINAGE TOPOLOGY</span>
          </div>

          {/* SVG Network Schematic */}
          <svg className="w-full h-48 my-2" viewBox="0 0 480 180">
            {/* Draw Conduits */}
            {simResult.conduitResults.map(conduit => {
              const fromN = nodeMap.get(conduit.fromNode);
              const toN = nodeMap.get(conduit.toNode);
              if (!fromN || !toN) return null;

              const isOver = conduit.isOverloaded;
              const strokeColor = conduit.severity === 'critical'
                ? '#ef4444'
                : conduit.severity === 'high'
                ? '#f97316'
                : conduit.severity === 'moderate'
                ? '#eab308'
                : '#10b981';

              const strokeWidth = conduit.channelType === 'trunk' ? 5 : conduit.channelType === 'primary' ? 3.5 : 2.5;

              return (
                <g key={conduit.conduitId}>
                  <line
                    x1={fromN.x}
                    y1={fromN.y}
                    x2={toN.x}
                    y2={toN.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  {/* Flow label */}
                  <text
                    x={(fromN.x + toN.x) / 2}
                    y={(fromN.y + toN.y) / 2 - 6}
                    fill={isOver ? '#fca5a5' : '#94a3b8'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {conduit.conduitId} ({conduit.flowRatio.toFixed(1)}x)
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {nodes.map(node => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={5}
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth={2}
                />
                <text
                  x={node.x}
                  y={node.y + 14}
                  fill="#cbd5e1"
                  fontSize="8"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>

          {/* SVG Legend */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-emerald-500 rounded"></span> Normal (&lt;0.75x)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-amber-500 rounded"></span> Moderate
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-rose-500 rounded"></span> High/Critical (&gt;1.0x)
              </span>
            </div>
            <span>Formula: Q = C·i·A / 360</span>
          </div>
        </div>
      </div>
    </div>
  );
};
