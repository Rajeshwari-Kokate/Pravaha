# PRAVAHA System Specification

## Overview
PRAVAHA (Sanskrit for *Flow* / *Current*) is an urban flood intelligence, drainage network modeling, and infrastructure screening platform designed for the Koramangala catchment in Bengaluru, Karnataka, India.

## Design System & Interface
> [!IMPORTANT]
> The interface design system, palette, typography, component styling, and layout patterns have been updated.
> Refer to [REDESIGN.md](file:///Users/rajeshwari/Desktop/Pravaha/docs/REDESIGN.md) for the authoritative design language specification, color tokens, and package implementation plan.

### Key Design Principles:
1. **Color System**: Fixed brand palette (pink `#F6E2E9`, cream `#FEFAF3`, sage-300 `#B8CFB3`, sage-500 `#84A282`, derived tokens ink `#24302A`, sage-700, sage-900, water `#3A7F8F`, amber `#C98A1B`, critical `#B3261E`).
2. **Typography**: Self-hosted fonts via `@fontsource` (Bricolage Grotesque for headings, DM Sans for body, JetBrains Mono for metrics/code).
3. **Cursor**: Standard browser native cursors only. No custom cursor component or listeners.
4. **Interactions**: Friendly engineering software with flat offset shadows (`3px 3px 0`), 12-16px card radius, 8px rectangular button radius (never pill-shaped), and WCAG AA contrast compliance.
5. **Data Rigor**: Clear labelling for simulated vs. synthetic data. No fabricated data, no emoji, no AI badges, and no em dashes.

## Core Capabilities
1. **Hydraulic Simulation**: Rational method ($Q = \frac{C \cdot I \cdot A}{360}$) with kinematic wave routing through the directed conduit network.
2. **Multi-Factor Bottleneck Scoring**:
   - Upstream Accumulation Factor (35%)
   - Capacity Deficit Factor (30%)
   - Roadway Proximity Factor (20%)
   - Downstream Backwater Risk Factor (15%)
3. **Regional Susceptibility Scoring**: Random Forest ML model using 10 geomorphological and infrastructural factors.
4. **Google Gemma 4 Technical Reports**: Strict evidence-grounded reports with citation tags and deterministic fallbacks.
5. **Operator Controls**: Constant-time passcode verification for administration and municipal contacts.
