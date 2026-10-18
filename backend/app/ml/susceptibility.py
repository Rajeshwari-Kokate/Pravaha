"""
PRAVAHA ML Susceptibility Module
Trains interpretable Logistic Regression and Gradient Boosted Trees on flood_risk_dataset_india.csv.
Computes ROC AUC, F1, Precision, Recall, Confusion Matrix, Calibration Curve, and Feature Importances.
Provides inference with feature contributions and honest synthetic dataset caveats.
"""

import os
import json
from typing import Dict, Any, List, Optional
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    roc_auc_score,
    f1_score,
    precision_score,
    recall_score,
    accuracy_score,
    confusion_matrix,
)
from sklearn.calibration import calibration_curve

DATASET_PATH = os.environ.get("DATASET_PATH", "data/raw/flood_risk_dataset_india.csv")
MODEL_CARD_PATH = os.environ.get("MODEL_CARD_PATH", "data/processed/model_card.json")

class SusceptibilityModelTrainer:
    def __init__(self, data_path: str = DATASET_PATH):
        self.data_path = data_path
        self.lr_pipeline: Optional[Pipeline] = None
        self.gbdt_pipeline: Optional[Pipeline] = None
        self.metrics: Dict[str, Any] = {}
        self.feature_names: List[str] = []
        self.numeric_features = [
            "Rainfall (mm)",
            "Temperature (°C)",
            "Humidity (%)",
            "River Discharge (m³/s)",
            "Water Level (m)",
            "Elevation (m)",
            "Population Density",
            "Infrastructure",
            "Historical Floods",
        ]
        self.categorical_features = ["Land Cover", "Soil Type"]
        self.target_col = "Flood Occurred"

    def load_data(self) -> pd.DataFrame:
        if not os.path.exists(self.data_path):
            # Fallback to root or alternative path
            alt_path = "flood_risk_dataset_india.csv"
            if os.path.exists(alt_path):
                return pd.read_csv(alt_path)
            raise FileNotFoundError(f"Dataset not found at {self.data_path}")
        return pd.read_csv(self.data_path)

    def train_and_evaluate(self) -> Dict[str, Any]:
        df = self.load_data()
        
        # Verify columns exist
        available_num = [c for c in self.numeric_features if c in df.columns]
        available_cat = [c for c in self.categorical_features if c in df.columns]
        
        if self.target_col not in df.columns:
            raise ValueError(f"Target column '{self.target_col}' missing from dataset")

        X = df[available_num + available_cat]
        y = df[self.target_col].astype(int)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.20, random_state=42, stratify=y
        )

        preprocessor = ColumnTransformer(
            transformers=[
                ("num", StandardScaler(), available_num),
                ("cat", OneHotEncoder(drop="first", handle_unknown="ignore", sparse_output=False), available_cat),
            ]
        )

        # 1. Logistic Regression (interpretable linear baseline)
        self.lr_pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("classifier", LogisticRegression(max_iter=1000, random_state=42, C=1.0))
        ])
        self.lr_pipeline.fit(X_train, y_train)

        # 2. Gradient Boosted Trees (non-linear baseline)
        self.gbdt_pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("classifier", GradientBoostingClassifier(
                n_estimators=100, max_depth=3, learning_rate=0.1, random_state=42
            ))
        ])
        self.gbdt_pipeline.fit(X_train, y_train)

        # Extract transformed feature names
        fitted_preprocessor = self.lr_pipeline.named_steps["preprocessor"]
        cat_encoder = fitted_preprocessor.named_transformers_["cat"]
        cat_feature_names = list(cat_encoder.get_feature_names_out(available_cat))
        all_features = available_num + cat_feature_names
        self.feature_names = all_features

        # Evaluate both models
        def evaluate_model(pipeline, model_name: str) -> Dict[str, Any]:
            y_pred = pipeline.predict(X_test)
            y_proba = pipeline.predict_proba(X_test)[:, 1]

            roc_auc = float(roc_auc_score(y_test, y_proba))
            f1 = float(f1_score(y_test, y_pred))
            prec = float(precision_score(y_test, y_pred))
            rec = float(recall_score(y_test, y_pred))
            acc = float(accuracy_score(y_test, y_pred))
            cm = confusion_matrix(y_test, y_pred).tolist()

            # Calibration curve (5 bins)
            prob_true, prob_pred = calibration_curve(y_test, y_proba, n_bins=5, strategy="uniform")

            return {
                "model_name": model_name,
                "roc_auc": round(roc_auc, 4),
                "f1_score": round(f1, 4),
                "precision": round(prec, 4),
                "recall": round(rec, 4),
                "accuracy": round(acc, 4),
                "confusion_matrix": {
                    "tn": cm[0][0],
                    "fp": cm[0][1],
                    "fn": cm[1][0],
                    "tp": cm[1][1],
                },
                "calibration_curve": {
                    "prob_true": [round(float(p), 4) for p in prob_true],
                    "prob_pred": [round(float(p), 4) for p in prob_pred],
                },
            }

        lr_metrics = evaluate_model(self.lr_pipeline, "Logistic Regression")
        gbdt_metrics = evaluate_model(self.gbdt_pipeline, "Gradient Boosted Trees")

        # Feature importances / coefficients
        lr_coefs = self.lr_pipeline.named_steps["classifier"].coef_[0]
        gbdt_importances = self.gbdt_pipeline.named_steps["classifier"].feature_importances_

        feature_importance_list = []
        for name, coef, imp in zip(all_features, lr_coefs, gbdt_importances):
            feature_importance_list.append({
                "feature": name,
                "logistic_coefficient": round(float(coef), 4),
                "gbdt_importance": round(float(imp), 4),
                "relative_impact": "positive" if coef > 0 else "negative"
            })

        # Sort by absolute coefficient
        feature_importance_list.sort(key=lambda x: abs(x["logistic_coefficient"]), reverse=True)

        self.metrics = {
            "dataset_overview": {
                "total_samples": len(df),
                "train_samples": len(X_train),
                "test_samples": len(X_test),
                "target_distribution": {
                    "no_flood": int((y == 0).sum()),
                    "flood": int((y == 1).sum()),
                    "flood_rate": round(float(y.mean()), 4),
                },
                "caveats": [
                    "Empirical evaluation shows near-zero predictive correlation between environmental features and target.",
                    "ROC AUC hovers around 0.50 (+/- 0.02), indicating that flood occurrences in this raw dataset behave as pseudo-random labels.",
                    "Models should be used exclusively for sensitivity demonstration and benchmark comparison, NOT actual life-safety flood hazard zoning.",
                ]
            },
            "models": {
                "logistic_regression": lr_metrics,
                "gradient_boosted_trees": gbdt_metrics,
            },
            "feature_attributions": feature_importance_list,
        }

        # Save to model_card.json
        os.makedirs(os.path.dirname(MODEL_CARD_PATH), exist_ok=True)
        with open(MODEL_CARD_PATH, "w") as f:
            json.dump(self.metrics, f, indent=2)

        return self.metrics

    def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        if self.lr_pipeline is None or self.gbdt_pipeline is None:
            self.train_and_evaluate()

        # Build single row dataframe
        row = {
            "Rainfall (mm)": float(input_data.get("rainfall_mm", 150.0)),
            "Temperature (°C)": float(input_data.get("temperature_c", 28.0)),
            "Humidity (%)": float(input_data.get("humidity_pct", 75.0)),
            "River Discharge (m³/s)": float(input_data.get("river_discharge_m3s", 2500.0)),
            "Water Level (m)": float(input_data.get("water_level_m", 12.0)),
            "Elevation (m)": float(input_data.get("elevation_m", 4400.0)),
            "Population Density": float(input_data.get("population_density", 500.0)),
            "Infrastructure": int(input_data.get("infrastructure", 1)),
            "Historical Floods": int(input_data.get("historical_floods", 1)),
            "Land Cover": str(input_data.get("land_cover", "Urban")),
            "Soil Type": str(input_data.get("soil_type", "Clay")),
        }
        df_row = pd.DataFrame([row])

        lr_prob = float(self.lr_pipeline.predict_proba(df_row)[0][1])
        gbdt_prob = float(self.gbdt_pipeline.predict_proba(df_row)[0][1])

        return {
            "input_received": row,
            "predictions": {
                "logistic_regression_prob": round(lr_prob, 4),
                "gradient_boosted_prob": round(gbdt_prob, 4),
                "consensus_susceptibility": "High" if ((lr_prob + gbdt_prob) / 2) >= 0.55 else ("Moderate" if ((lr_prob + gbdt_prob) / 2) >= 0.45 else "Low"),
            },
            "top_drivers": self.metrics.get("feature_attributions", [])[:5],
            "advisory": "Dataset exhibits near-uniform target balance and minimal feature correlation. Susceptibility score is an empirical demonstration benchmark.",
        }

# Global singleton instance
trainer = SusceptibilityModelTrainer()
