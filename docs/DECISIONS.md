# Architecture and Design Decisions (DECISIONS.md)

This log records technical, architectural, and design decisions made during the design and implementation of PRAVAHA. In accordance with project instructions, when choices arose, reasonable engineering options were selected and documented here.

## Decision 1: Demonstration Study Area Selection
- Context: An urban study area in India was required with reproducible OpenStreetMap coverage, clear urban road hierarchy, and documented monsoon drainage vulnerability.
- Decision: Selected the Koramangala and Bellandur drainage catchment in South Bengaluru, Karnataka (centered around 12.9352 N, 77.6245 E).
- Rationale: Koramangala is one of the most studied urban drainage basins in peninsular India. It possesses dense OpenStreetMap road coverage, critical civic assets (hospitals, schools, transit junctions), and clear topographically driven storm runoff challenges. A bounded bounding box [77.605, 12.915, 77.645, 12.955] provides a clean, fast demonstration area (approximately 4.4 km by 4.4 km) that loads quickly on mobile and desktop without sacrificing spatial fidelity.

## Decision 2: Synthetic Drainage Network Generation
- Context: High-resolution municipal underground stormwater and culvert GIS shapefiles are rarely published in the public domain for Indian municipalities due to administrative and security limitations.
- Decision: A deterministic, fixed-seed generator (`backend/scripts/prepare_spatial_data.py`) derives the drainage graph directly from the real road network centerline geometry and inferred downhill gradient toward the natural valley line.
- Rationale: Real road alignments serve as the primary right-of-way for municipal storm drains in Indian cities. By snapping drainage nodes to road intersections and orienting edges downstream toward lower elevations, the graph behaves realistically for topological routing. Crucially, all synthetic edges are given a distinct dashed line styling and an explicit "Synthetic" tag in the UI to prevent any misunderstanding.

## Decision 3: Frontend Client Routing on GitHub Pages
- Context: PRAVAHA frontend builds as a single page application (SPA) deployed to static hosting such as GitHub Pages. Direct navigation to deep routes (`/workspace`, `/scenarios`, `/methodology`) on standard static hosts can trigger HTTP 404 errors if not routed through `index.html`.
- Decision: Utilized HTML5 history routing with a dedicated `404.html` redirect script fallback (standard single-page app pattern on GitHub Pages) and configurable `VITE_BASE_PATH`.
- Rationale: Ensures clean URLs without hash fragments (`/workspace` rather than `/#/workspace`) while maintaining static hosting compatibility.

## Decision 4: Deterministic Simulation Model Formulation
- Context: SECTION 11 mandates a deterministic simplified flood and drainage simulation running without LLM involvement, routing runoff in topological order, and calculating relative accumulation.
- Decision: Implemented the Rational Method for catchment runoff: Q = C * I * A, where C is the composite runoff coefficient based on land cover, I is rainfall intensity (mm/h), and A is contributing nodal area. Edge flow capacity is computed using Manning's equation for open/covered gravity drains: Q_cap = (1/n) * A_x * R^(2/3) * S^(1/2), where effective capacity accounts for blockage factor: Q_eff = Q_cap * (1 - blockage).
- Rationale: The Rational Method is universally recognized by municipal stormwater manuals (including the Central Public Health and Environmental Engineering Organisation, CPHEEO, of India) for urban catchments under 100 hectares. It provides exact mathematical determinism and rapid multi-timestep execution.

## Decision 5: Client-Side Formula Mirror for Hero and Lessons
- Context: The hero interaction ("Pull the rain cord") and Flood School lessons require instantaneous feedback on slider drag without incurring network latency or backend dependency.
- Decision: A lightweight TypeScript mirror of the exact Rational runoff and capacity formula was built for the frontend, verified against Python golden test fixtures.
- Rationale: Guarantees zero latency on user drag and ensures offline resilience for educational lessons, while the backend remains the authoritative source for full network simulations and reports.

## Decision 6: Google Gemma 4 Model Integration
- Context: SECTION 14 requires integration of Google Gemma 4 (instruction-tuned) via an OpenAI-compatible HTTP interface to produce evidence-linked reports without hallucinating depths or field measurements.
- Decision: Selected `google/gemma-4-E4B-it` as the default model identifier, with configuration support for local Ollama, llama.cpp, or vLLM deployments via `GEMMA_BASE_URL`.
- Rationale: E4B provides high reasoning fidelity within a 4-billion parameter footprint that runs comfortably on modern laptops, providing reproducible JSON generation with strict evidence-ID validation.

## Decision 7: Elimination of Em Dashes
- Context: SECTION 2 prohibits em dashes anywhere in website copy, README, or documentation.
- Decision: Audited all generated copy, markdown documentation, and docstrings to enforce standard colons, commas, semicolons, and periods.

## Decision 8: Automated Verification and Headless Driver Handling
- Context: During Phase 1 browser verification, the system browser daemon reported a driver timeout on `open_browser_url`.
- Decision: The Vite development server was validated directly via HTTP request (`HTTP/1.1 200 OK`), TypeScript compilation was verified with strict compiler flags (`tsc -b`), and the production bundle was built and verified (`vite build`). As agreed with the operator, headless and curl automated testing will verify web endpoints alongside automated unit test suites.

## Decision 9: PyPI Package Mirror Fallback
- Context: Direct outbound HTTPS connections to `pypi.org` and `files.pythonhosted.org` timed out due to regional network routing constraints in the execution environment.
- Decision: In compliance with SECTION 0 ("If a download, API or package fails, use the documented fallback and record it. Never fake data to hide a failure"), pip was configured with a documented high-speed public mirror (`https://pypi.tuna.tsinghua.edu.cn/simple`). All required dependencies (`fastapi`, `pydantic`, `networkx`, `numpy`, `shapely`, `pandas`, `scikit-learn`, `httpx`, `pytest`) were verified and installed cleanly.
## Decision 10: Phase 4 Simulation Engine Design

- Context: Phase 4 required a deterministic, graph-based flood routing engine with SQLite persistence, golden test fixtures, and a full pytest suite.
- Decision: Implemented `FloodSimulationEngine` in `backend/app/simulation/engine.py` using a NetworkX `DiGraph`. Topological sort (upstream-to-downstream) ensures single-pass propagation without iteration. Overflow from overloaded conduits propagates as additional surface-runoff load to downstream nodes. Hotspot polygons use a greedy distance-based clustering (400 m merge radius) with a 150 m buffer. Road intersections use exact 2D line-segment intersection tests (no spatial index needed at this scale). Timeline uses a triangular hyetograph centred at the midpoint step. All results are serialised as Pydantic v2 JSON and persisted to `data/simulations.db` via SQLite.
- Rationale: NetworkX topological sort is exact for DAGs and eliminates iterative convergence errors. The Rational Method (Q = C*i*A/360) is mandated by CPHEEO for urban catchments under 100 ha. Greedy clustering is O(n^2) but sufficient for the current 20-conduit synthetic network. The SQLite store provides a zero-dependency persistence layer suitable for the demo environment.

## Decision 11: Test Path Resolution

- Context: `test_data_integrity.py` used CWD-relative paths, causing failures when pytest is invoked from `backend/` rather than the repo root.
## Decision 12: Interface Redesign Protocol & Custom Cursor Elimination
- Context: Master redesign prompt requested a warm, tactile, friendly engineering interface based on the provided dashboard mockup and Color Hunt palette (pink, cream, sage-300, sage-500, ink, water, amber, critical). Also required complete elimination of custom cursor.
- Decision: Removed `SiteCursor.tsx` and all listeners/DOM wrappers. Adopted native browser cursors exclusively. Established unified CSS custom properties and Tailwind tokens for light and dark themes with WCAG AA compliance. Baseline before-screenshots captured across all 10 routes in `docs/redesign/before/`.
- Rationale: Native cursors eliminate pointer lag, improve accessibility, and align with engineering software expectations.

## Decision 13: Dedicated Full-Viewport Workspace Architecture & WebGL Fallback
- Context: Package R4 redesign mandates a dedicated engineering dashboard for `/workspace` matching the mockup (slim left sidebar with brand mark, top bar with demo area label, top-left floating layers panel, top-right floating simulation controls with storm presets, bottom KPI tiles with accumulation ramp legend and bottom tabs). In addition, headless and low-power devices can throw WebGL errors when running MapLibre.
- Decision: Rendered `/workspace` as a dedicated full-viewport dashboard shell that conditionally omits the standard landing website header and marketing footer. Added a try-catch safeguard around MapLibre map initialization with a graceful 2D vector fallback state. Implemented animated flowing dashed lines whose speed and colors shift to amber and critical styles upon 100% capacity exceedance, alongside a Canvas raindrop overlay tied to rainfall intensity and user settings.
- Rationale: Eliminates redundant double navigation bars on the workspace, prevents interface crashing in non-accelerated environments, and adheres to strict tactile design guidelines with files modularized under 250 lines.

## Decision 14: Scenario Comparison Layout, D3 Water Gauge & Profile Charts
- Context: Package R5 requires a side-by-side scenario comparison page (`/scenarios`) with accumulation scales and metrics card with honest celebration stamps, plus a dedicated segment detail view (`/bottleneck`) with a cross-section water gauge (D3), flow vs capacity profile chart, and topology mini-map.
- Decision: Rebuilt `/scenarios` with dual scenario map cards ("Baseline Scenario" and "After Intervention") showing relative accumulation scales and computed change metrics. Built `WaterGauge.tsx` rendering an interactive pipe cross-section with ripple animation and overflow surcharge alerts. Built `SegmentFlowProfileChart.tsx` comparing simulated inflow against nominal capacity along distance, with an honest disclaimer regarding missing DEM tiles.
- Rationale: Provides direct visual evidence of structural interventions while staying grounded in deterministic hydraulic simulation data without em dashes or unverified claims.

