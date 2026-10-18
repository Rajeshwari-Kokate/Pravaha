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
