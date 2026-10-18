# Engineering Methodology and Scientific Formulations (METHODOLOGY.md)

This document specifies the mathematical formulations, network algorithms, bottleneck ranking heuristics, and statistical susceptibility modeling employed across PRAVAHA.

## 1. Simplified Deterministic Hydrological and Drainage Modeling
PRAVAHA employs an engineering screening model designed for urban catchment screening and drainage bottleneck investigation. It is not an uncalibrated hydrodynamic 2D model (such as SWMM or TELEMAC-2D) and does not output dynamic flood wave velocity or physical flood depths in meters.

### 1.1 Runoff Generation: The Rational Method
For each contributing catchment or network junction node $i$, peak runoff flow rate $Q_i$ ($m^3/s$) is determined using the standard Rational Method:

$$Q_i = \frac{C_i \cdot I \cdot A_i}{3.6 \times 10^6}$$

Where:
- $C_i$: Dimensionless runoff coefficient based on prevailing surface cover (0.85 to 0.90 for paved/impervious urban surfaces; 0.20 to 0.35 for vegetated/open areas).
- $I$: Rainfall intensity in millimeters per hour ($mm/h$).
- $A_i$: Nodal catchment drainage area in square meters ($m^2$).
- $3.6 \times 10^6$: Unit conversion constant converting $mm \cdot m^2 / h$ to $m^3/s$.

### 1.2 Channel and Culvert Flow Capacity: Manning's Formula
For a drainage conduit segment $e = (u, v)$, nominal gravity conveyance capacity $Q_{nom}$ ($m^3/s$) is derived from Manning's equation for open channel flow:

$$Q_{nom} = \frac{1}{n} A_x R_h^{2/3} S_0^{1/2}$$

Where:
- $n$: Manning roughness coefficient (typically 0.015 for concrete culverts, 0.025 for masonry drains).
- $A_x$: Cross-sectional flow area ($m^2$).
- $R_h$: Hydraulic radius ($m$), calculated as $A_x / P_{wetted}$.
- $S_0$: Longitudinal hydraulic channel slope ($m/m$).

Effective capacity $Q_{eff}$ incorporates operational blockage (sediment, solid waste, siltation):

$$Q_{eff} = Q_{nom} \cdot (1 - B_e)$$

Where $B_e \in [0.0, 1.0]$ denotes the segment blockage factor.

### 1.3 Topological Flow Routing and Exceedance
Drainage conduits form a directed acyclic graph $G = (V, E)$. Flow is routed topologically from upstream headwaters to downstream outfalls:

$$\text{Demand}(v) = Q_v + \sum_{(u, v) \in E} \text{PassedFlow}(u, v)$$

When $\text{Demand}(v) > Q_{eff}(e)$, the segment experiences modeled capacity exceedance:

$$\text{Exceedance}(e) = \max(0, \text{Demand}(v) - Q_{eff}(e))$$
$$\text{Exceedance Ratio}(e) = \frac{\text{Demand}(v)}{Q_{eff}(e)}$$

Relative accumulation indicators are mapped to nodal buffer zones (hotspots) representing localized overland water ponding potential.

## 2. Candidate Bottleneck Prioritization Heuristic
Candidate drainage bottlenecks are ranked according to a multi-factor score $S(e) \in [0, 100]$:

$$S(e) = w_1 \cdot f_{exceed}(e) + w_2 \cdot f_{upstream}(e) + w_3 \cdot f_{criticality}(e) + w_4 \cdot f_{downstream}(e)$$

Where:
- $f_{exceed}$: Normalized exceedance ratio $(Demand / Q_{eff})$.
- $f_{upstream}$: Normalized count and area of contributing upstream nodes.
- $f_{criticality}$: Proximity factor to critical public infrastructure (hospitals, schools, major intersections).
- $f_{downstream}$: Downstream conveyance constraint penalty (choke points downstream).
- Weights $w_1, w_2, w_3, w_4$ sum to 1.0 and can be adjusted transparently in the workspace investigation tab.

## 3. Road Network Impact Assessment
Potentially affected road segments are determined through spatial intersection:
- Hotspot polygons around exceeding nodes are buffered by a calibrated radius (25 meters).
- Shapely spatial indexing (STRtree) identifies intersecting road centerlines.
- Segments are flagged with modeled water presence risk, allowing municipal teams to prioritize traffic management and clearing crews.

## 4. Tabular Susceptibility Model (Dataset Card)
For regional background context, a statistical model is trained on `flood_risk_dataset_india.csv`:
- Interpretable Baseline: L2-penalized Logistic Regression with scaled features.
- Comparison Model: Gradient Boosted Decision Trees (HistGradientBoostingClassifier).
- Train/Test Split: 80% training, 20% held-out test set with fixed random seed (42).
- Metrics evaluated: Precision, Recall, F1 Score, ROC AUC, Brier Calibration Score, Confusion Matrix.
- Purpose: Identifies statistical associations between regional environmental variables (rainfall, river discharge, elevation, soil type) and binary historical flood flags. It is explicitly separated from the physical drainage network simulation.
