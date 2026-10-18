# Data Provenance and Lineage (DATA_PROVENANCE.md)

This document tracks every geospatial layer, tabular dataset, and synthetic model used in PRAVAHA. It records data origins, licenses, coordinate reference systems (CRS), spatial extents, and explicit flags for synthetic elements.

## 1. Study Area Definition
- Geographic Focus: Koramangala Drainage Catchment, Bengaluru, Karnataka, India
- Bounding Box (WGS 84, EPSG:4326):
  - Minimum Longitude: 77.6050 E
  - Minimum Latitude: 12.9150 N
  - Maximum Longitude: 77.6450 E
  - Maximum Latitude: 12.9550 N
- Projected Coordinate Reference System for Lengths and Areas: EPSG:32643 (UTM Zone 43N)

## 2. Road Network and Infrastructure Assets
- Source: OpenStreetMap contributors via Overpass API
- Source URL: https://overpass-api.de/api/interpreter
- Download Date: October 2026 (cached and reproducible via `backend/scripts/prepare_spatial_data.py`)
- License: Open Database License (ODbL) 1.0
- Features Extracted:
  - Highway types: primary, secondary, tertiary, residential, service
  - Critical public assets: hospitals, fire stations, power substations, transit stations, schools
- Geometry Format: GeoJSON, EPSG:4326
- Known Limitations: Attribute completeness (lane counts, road elevations) varies; minor alleys may be simplified.

## 3. Synthetic Drainage Network
- Provenance: Deterministic synthetic generation via `backend/scripts/prepare_spatial_data.py` (Fixed Seed: 42)
- Underlying Logic: Drainage centerlines follow road right-of-ways with gravity flow directed toward regional low points (Bellandur valley axis).
- Attribute Schema:
  - `id`: Unique segment identifier (e.g., `DRN-001`)
  - `length_m`: Calculated segment length in meters (EPSG:32643)
  - `nominal_capacity_m3s`: Design conveyance capacity in cubic meters per second
  - `slope_pct`: Estimated hydraulic slope percentage
  - `blockage_factor`: Value between 0.0 (clear) and 1.0 (fully obstructed)
  - `is_synthetic`: Always true
- Labeling Constraint: Marked with dashed line symbology and persistent "Synthetic" badges throughout the user interface.

## 4. Flood Risk Tabular Dataset (`flood_risk_dataset_india.csv`)
- File Location: `data/raw/flood_risk_dataset_india.csv` (gitignored in raw form)
- Record Count: 10,001 lines (10,000 observations, 1 header row)
- Columns Present:
  - `Latitude`, `Longitude`: Spatial coordinates
  - `Rainfall (mm)`: Total precipitation in millimeters
  - `Temperature (°C)`: Ambient temperature
  - `Humidity (%)`: Relative humidity
  - `River Discharge (m³/s)`: River volumetric flow
  - `Water Level (m)`: Surface water stage
  - `Elevation (m)`: Topographic elevation
  - `Land Cover`: Categorical (e.g., Water Body, Forest, Agricultural, Urban, Desert)
  - `Soil Type`: Categorical (e.g., Clay, Peat, Loam, Sandy)
  - `Population Density`: Persons per unit area
  - `Infrastructure`: Binary indicator (0 or 1)
  - `Historical Floods`: Binary indicator (0 or 1)
  - `Flood Occurred`: Binary target indicator (0 or 1)
- Provenance & License Status: Origin and license unverified. Column statistical distributions are profiled in `docs/DATASET_REPORT.md`.
- Usage Policy:
  - Labeled "origin and licence unverified" across all user interface views.
  - Used for regional tabular aggregations and statistical susceptibility baseline modeling only.
  - Never presented as observed flood records or municipal telemetry.

## 5. Map Tiles
- Default Basemap: Carto Positron (Light) and Carto Dark Matter (Dark) via free public tile endpoints, with OpenStreetMap vector fallback.
- Attribution: OpenStreetMap contributors, CartoDB.
- Offline and Failure Behavior: The user interface monitors tile load events. If tile servers are unreachable, vector layers (drainage, roads, hotspots) continue rendering against a neutral engineering background with an explanatory notification banner.
