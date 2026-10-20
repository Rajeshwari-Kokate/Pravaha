# PRAVAHA Interface Redesign Progress Tracking

## Checklist of Work Packages

- [x] **R0: Audit & Baseline**
  - [x] Take baseline before-screenshots of all routes in `docs/redesign/before/`
  - [x] Create `docs/REDESIGN.md` with Parts B to E verbatim + Part F checklist
  - [x] Create / update `docs/SPEC.md` pointing design system to `docs/REDESIGN.md` and removing old palette & custom cursor
  - [x] Delete custom cursor component, listeners, styles, tests, and documentation

- [x] **R1: Tokens & Base Components**
  - [x] Install self-hosted fonts (`@fontsource/bricolage-grotesque`, `@fontsource/dm-sans`, `@fontsource/jetbrains-mono`)
  - [x] Configure CSS variables and Tailwind tokens for brand palette (cream, pink, sage-300, sage-500, etc.) in light & dark themes
  - [x] Automated contrast-check script verifying WCAG AA for all text/background pairs
  - [x] Base components restyled with 1.5px borders, flat 3px 3px 0 offset shadow, 8px radius buttons, 12-16px card radius, no pill shapes

- [x] **R2: Shell**
  - [x] Slim left sidebar, top bar, header, mobile menu, footer, theme toggle
  - [x] Brand mark recolored to new palette
  - [x] Search modal and storage preference banner restyled

- [x] **R3: Landing Page (/)**
  - [x] New hero with real interactive MapLibre map of demonstration network
  - [x] Workflow row ("Analyse scenarios", "Identify risk areas", "Plan informed actions")
  - [x] Methodology summary, limitations, FAQ, preloader recolored

- [x] **R4: Workspace (/workspace)**
  - [x] Layout with slim sidebar, top bar, demo area label
  - [x] Map overlay: "Layers" panel
  - [x] Right panel: "Simulation Controls" with storm presets, sliders, run/reset
  - [x] Bottom area: "Simulation Results (Summary)" with KPI tiles, legend, bottom tabs, timeline scrubber
  - [x] Flowing pipes animation and rain effect toggle

- [x] **R5: Scenario Comparison & Segment Detail**
  - [x] Scenario Comparison page (`/scenarios`) with side-by-side maps, parameters, comparison metrics card
  - [x] Segment Detail drawer/page (`/bottleneck` & segment view) with water gauge, flow profile, elevation profile, bottleneck ranking factors

- [x] **R6: Report, Methodology, Learn, Contact, Privacy, Terms, 404**
  - [x] Investigation report (`/reports/:id`) with Gemma evidence tags, print layout ("Download PDF"), export JSON
  - [x] Methodology page (`/methodology`) with sub-navigation and genuine data provenance table
  - [x] Learn, Contact, Privacy, Terms, 404 pages restyled

- [x] **R7: Playful, Useful Interactions & Polish**
  - [x] Guided tour (5 steps, skippable, localStorage)
  - [x] Empty and loading SVG states
  - [x] Honest celebration stamp on scenario comparison
  - [x] Flood school lesson completion stamps

NEXT STEP: R8 Responsive, Accessibility & Theme Polish
- [ ] **R8: Responsive, Accessibility & Theme Polish**
  - [ ] Responsive pass at 1440, 1024, 768, 390 px
  - [ ] Keyboard navigation and focus rings
  - [ ] Reduced motion compliance (`prefers-reduced-motion`)
  - [ ] Contrast checks in both themes
  - [ ] Capture after-screenshots in `docs/redesign/after/` (light and dark)
- [ ] **R9: Verification & Final Commit**
  - [ ] Run full test suites: Vitest (46/46) and Pytest (80/80)
  - [ ] Run full production build (`npm run build`)
  - [ ] Final verification and commit

NEXT STEP: R0 Audit & Baseline
