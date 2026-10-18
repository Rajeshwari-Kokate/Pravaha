import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegionalFactorsView } from '../components/workspace/RegionalFactorsView';

describe('RegionalFactorsView Component', () => {
  const mockAggregates = {
    metadata: {
      source_file: 'flood_risk_dataset_india.csv',
      status: 'origin and licence unverified',
      total_records: 10000,
      synthetic_indicators: ['Rainfall distribution uniform.'],
    },
    by_land_cover: {
      Urban: { count: 1938, flood_rate: 0.515, mean_rainfall: 148.1, mean_elevation: 4419.7 },
      Agricultural: { count: 1978, flood_rate: 0.514, mean_rainfall: 149.2, mean_elevation: 4350.5 },
    },
    by_soil_type: {
      Clay: { count: 1978, flood_rate: 0.517, mean_discharge: 2553.8 },
      Loam: { count: 1972, flood_rate: 0.491, mean_discharge: 2503.4 },
    },
  };

  const mockModelCard = {
    dataset_overview: {
      total_samples: 10000,
      train_samples: 8000,
      test_samples: 2000,
      target_distribution: { no_flood: 4943, flood: 5057, flood_rate: 0.5057 },
      caveats: ['ROC AUC hovers around 0.50.'],
    },
    models: {
      logistic_regression: {
        roc_auc: 0.4982,
        f1_score: 0.501,
        precision: 0.504,
        recall: 0.498,
        accuracy: 0.502,
        confusion_matrix: { tn: 540, fp: 449, fn: 555, tp: 456 },
      },
      gradient_boosted_trees: {
        roc_auc: 0.4921,
        f1_score: 0.495,
        precision: 0.498,
        recall: 0.492,
        accuracy: 0.496,
        confusion_matrix: { tn: 535, fp: 454, fn: 560, tp: 451 },
      },
    },
    feature_attributions: [
      { feature: 'Rainfall (mm)', logistic_coefficient: 0.02, gbdt_importance: 0.15, relative_impact: 'positive' },
    ],
  };

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      if (url.includes('regional_aggregates.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockAggregates),
        });
      }
      if (url.includes('model_card.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockModelCard),
        });
      }
      return Promise.reject(new Error('Unknown url'));
    }));
  });

  it('renders advisory banner and tables once loaded', async () => {
    render(<RegionalFactorsView />);

    await waitFor(() => {
      expect(screen.getByText(/Data Provenance & Empirical Validation Advisory/i)).toBeDefined();
    });

    expect(screen.getByText('Distribution by Land Cover')).toBeDefined();
    expect(screen.getByText('Distribution by Soil Type')).toBeDefined();
    expect(screen.getByText('Urban')).toBeDefined();
    expect(screen.getByText('Clay')).toBeDefined();
  });

  it('displays evaluated model card metrics', async () => {
    render(<RegionalFactorsView />);

    await waitFor(() => {
      expect(screen.getByText(/0.4982/)).toBeDefined();
      expect(screen.getByText(/0.4921/)).toBeDefined();
    });
  });

  it('responds to slider adjustments and recomputes sensitivity', async () => {
    render(<RegionalFactorsView />);

    await waitFor(() => {
      expect(screen.getByText('Regional Susceptibility Sensitivity Explorer')).toBeDefined();
    });

    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThanOrEqual(3);

    // Adjust rainfall slider
    fireEvent.change(sliders[0], { target: { value: '250' } });
    expect(screen.getByText('250 mm')).toBeDefined();
  });
});
