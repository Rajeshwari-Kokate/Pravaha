# PRAVAHA: Urban Flood Intelligence and Drainage Investigation

PRAVAHA is an urban flood intelligence and drainage investigation website engineered to evaluate rainfall scenarios, analyze drainage capacity bottlenecks, inspect affected civic infrastructure, and synthesize evidence-grounded reports.

Built with a restrained engineering aesthetic and strict WCAG AA contrast, PRAVAHA pairs a deterministic hydraulic network simulation with real-time scenario comparison, interactive engineering lessons, and Google Gemma 4 technical narrative generation.

---

## Key Capabilities

1. Interactive Catchment Exploration: Inspect drainage segments, street hierarchies, and critical public assets on an interactive MapLibre GL map.
2. Deterministic Hydrological Engine: Formulates runoff generation via the Rational Method and routes conveyance topologically through a directed network graph.
3. Candidate Bottleneck Analysis: Ranks drainage segments by multi-factor scores, combining capacity exceedance, upstream area, and civic asset proximity.
4. Scenario Laboratory: Interactively configure storm intensity, duration, and conduit blockage factors to compare baseline and intervention outcomes.
5. Evidence-Linked Reporting: Formulates structured engineering reports citing explicit computation evidence identifiers, integrated with Google Gemma 4.
6. Flood School: Six interactive educational modules covering runoff coefficients, drainage conveyance, upstream surcharge propagation, inspection heuristics, model limitations, and tabular risk analysis.

---

## Architectural Architecture

- Frontend: React 18/19, TypeScript, Vite, Tailwind CSS, MapLibre GL JS, Turf.js, Lucide icons.
- Backend: Python 3.10+, FastAPI, Pydantic, NetworkX, NumPy, Shapely, pandas, scikit-learn, SQLite.
- AI Integration: Google Gemma 4 (`google/gemma-4-E4B-it`) via OpenAI-compatible API interface.
- Geospatial Layer: OpenStreetMap urban infrastructure coupled with synthetic, road-aligned stormwater conduit networks.

---

## Quickstart

### 1. Environment Setup
```bash
# Clone the repository
git clone <repo-url>
cd Pravaha

# Set up Python virtual environment
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### 2. Prepare Data and Train Models
```bash
python backend/scripts/profile_dataset.py
python backend/scripts/prepare_spatial_data.py
```

### 3. Run Backend
```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Documentation Links

- [System Decisions (docs/DECISIONS.md)](docs/DECISIONS.md)
- [Data Provenance (docs/DATA_PROVENANCE.md)](docs/DATA_PROVENANCE.md)
- [Scientific Methodology (docs/METHODOLOGY.md)](docs/METHODOLOGY.md)
- [Deployment Guide (docs/DEPLOYMENT.md)](docs/DEPLOYMENT.md)
- [Dataset Profile (docs/DATASET_REPORT.md)](docs/DATASET_REPORT.md)

---

## Notice and Operating Scope

PRAVAHA is an analytical screening and engineering decision-support tool. It is not an operational flood early warning system. Simulated accumulation indicators and candidate bottlenecks must not be construed as real-time field measurements or municipal alerts. In an active storm emergency, follow official municipal alerts and contact local disaster management services immediately.
