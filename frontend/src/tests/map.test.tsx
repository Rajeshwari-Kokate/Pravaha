import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureDetailPanel } from '../components/workspace/FeatureDetailPanel';
import type { SelectedFeature } from '../components/map/MapLibreView';

describe('Phase 3 Map and Feature Detail Components', () => {
  it('renders empty placeholder when no feature is selected', () => {
    render(<FeatureDetailPanel feature={null} onClose={vi.fn()} />);
    expect(screen.getByText(/Select an asset or conduit on the map/i)).toBeDefined();
  });

  it('renders drainage conduit details with synthetic warning badge', () => {
    const mockDrainage: SelectedFeature = {
      type: 'drainage',
      id: 'DRN-TRUNK-01',
      name: 'Regional Valley Trunk Collector',
      properties: {
        id: 'DRN-TRUNK-01',
        channel_type: 'trunk',
        length_m: 850.4,
        nominal_capacity_m3s: 16.0,
        effective_capacity_m3s: 10.4,
        blockage_factor: 0.35,
        slope_pct: 0.8,
        from_node: 'J-100FT-80FT',
        to_node: 'J-BLK4-E',
      },
    };

    const onClose = vi.fn();
    render(<FeatureDetailPanel feature={mockDrainage} onClose={onClose} />);

    expect(screen.getByText('DRN-TRUNK-01')).toBeDefined();
    expect(screen.getByText('Synthetic Infrastructure Layer')).toBeDefined();
    expect(screen.getByText('16 m³/s')).toBeDefined();
    expect(screen.getByText('10.4 m³/s')).toBeDefined();
    expect(screen.getByText('35%')).toBeDefined();
    expect(screen.getByText('J-100FT-80FT')).toBeDefined();
    expect(screen.getByText('J-BLK4-E')).toBeDefined();

    const closeBtn = screen.getByRole('button', { name: /close feature details/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('renders civic asset details correctly', () => {
    const mockAsset: SelectedFeature = {
      type: 'asset',
      id: 'AST-HOSP-01',
      name: "St. John's Medical College Hospital",
      properties: {
        id: 'AST-HOSP-01',
        name: "St. John's Medical College Hospital",
        category: 'hospital',
      },
    };

    render(<FeatureDetailPanel feature={mockAsset} onClose={vi.fn()} />);
    expect(screen.getAllByText(/hospital/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('High Civic Priority')).toBeDefined();
  });
});
