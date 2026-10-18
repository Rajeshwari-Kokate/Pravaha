# Dataset Profile & Provenance Report (DATASET_REPORT.md)

This document details the exploratory profiling, statistical distributions, synthetic nature evaluation, and integrity audit of the input tabular dataset.

## 1. Provenance and File Metadata
- Target File: `data/raw/flood_risk_dataset_india.csv`
- Row Count: 10,000 records
- Column Count: 14 attributes
- Duplicate Rows: 0
- Total Missing Cells: 0
- License Status: Origin and licence unverified. No author or source metadata embedded in file headers.
- Operational Label: Labeled **'origin and licence unverified'** across all user interface views.

## 2. Integrity and Synthetic Data Evaluation
A rigorous empirical analysis of column distributions was conducted to determine whether this dataset represents observed empirical measurements or algorithmically generated synthetic data.

### Key Findings:
- **Indicator:** Rainfall distribution has mean extremely close to mathematical midpoint, typical of uniform pseudorandom generation.
- **Indicator:** Zero missing values across all 10,000 observations in 14 columns.
- **Indicator:** Target class 'Flood Occurred' is virtually 50/50 balanced (5057 vs 4943).
- **Indicator:** Categorical column 'Land Cover' displays near-uniform category distribution across ['Water Body', 'Desert', 'Forest', 'Agricultural', 'Urban'].
- **Indicator:** Categorical column 'Soil Type' displays near-uniform category distribution across ['Peat', 'Silt', 'Clay', 'Loam', 'Sandy'].

### Conclusion on Authenticity:
The uniform frequency distributions across continuous and categorical variables, perfect 50/50 target balance, and absence of sensor dropouts indicate that `flood_risk_dataset_india.csv` is an **algorithmically synthesized / simulated benchmark dataset** rather than real-world municipal telemetry.

**Strict Rule Enforced:** In accordance with Section 10, no real-world flood risk claims will be made from this dataset. It will be utilized strictly for statistical association modeling, parameter bounds, and regional educational breakdowns.

## 3. Column Specifications and Inferred Units

| Column Name | Inferred Type | Inferred Units | Missing Count | Sample Min | Sample Max | Mean / Modes |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `Latitude` | float64 | degrees N | 0 | 8.00 | 36.99 | 22.33 (std: 8.34) |
| `Longitude` | float64 | degrees E | 0 | 68.00 | 97.00 | 82.63 (std: 8.39) |
| `Rainfall (mm)` | float64 | millimeters (mm) | 0 | 0.01 | 299.97 | 150.02 (std: 86.03) |
| `Temperature (°C)` | float64 | degrees Celsius (°C) | 0 | 15.00 | 44.99 | 29.96 (std: 8.67) |
| `Humidity (%)` | float64 | percentage (%) | 0 | 20.00 | 100.00 | 59.75 (std: 23.14) |
| `River Discharge (m³/s)` | float64 | cubic meters per second (m³/s) | 0 | 0.04 | 4999.70 | 2515.72 (std: 1441.71) |
| `Water Level (m)` | float64 | meters (m) | 0 | 0.00 | 10.00 | 5.02 (std: 2.88) |
| `Elevation (m)` | float64 | meters above sea level (m) | 0 | 1.15 | 8846.89 | 4417.14 (std: 2530.25) |
| `Land Cover` | str | categorical classification | 0 | N/A | N/A | Top: {'Water Body': 2046, 'Desert': 2033} |
| `Soil Type` | str | categorical classification | 0 | N/A | N/A | Top: {'Peat': 2052, 'Silt': 2044} |
| `Population Density` | float64 | persons per square kilometer (inferred) | 0 | 2.29 | 9999.17 | 5021.47 (std: 2882.59) |
| `Infrastructure` | int64 | binary indicator (0 or 1) | 0 | 0.00 | 1.00 | 0.50 (std: 0.50) |
| `Historical Floods` | int64 | binary indicator (0 or 1) | 0 | 0.00 | 1.00 | 0.50 (std: 0.50) |
| `Flood Occurred` | int64 | binary label (0: No, 1: Yes) | 0 | 0.00 | 1.00 | 0.51 (std: 0.50) |

## 4. Target Class Balance ('Flood Occurred')

- Label 0 (No Flood): 4,943 (49.43%)
- Label 1 (Flood Occurred): 5,057 (50.57%)

## 5. Parameter Ranges for Scenario Defaults
The following empirical ranges from the dataset are used to ground slider bounds in the Scenario Laboratory:
- Rainfall Range: 0.0 mm to 300.0 mm (Median: 150.6 mm)
- Elevation Range: 1.2 m to 8846.9 m
- River Discharge: 0.0 m³/s to 4999.7 m³/s

