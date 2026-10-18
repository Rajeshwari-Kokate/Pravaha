import { describe, it, expect } from 'vitest';
import { rationalQ, severity } from '../lib/simulation';

describe('TypeScript - Python Hydrological Parity Suite', () => {
  // Python golden fixtures from tests/fixtures/golden_simulation.py
  const RATIONAL_Q_FIXTURES = [
    { c: 0.70, i: 50.0,  a: 50.0,  expectedQ: 4.861 },
    { c: 0.90, i: 100.0, a: 10.0,  expectedQ: 2.500 },
    { c: 0.50, i: 30.0,  a: 100.0, expectedQ: 4.167 },
    { c: 1.00, i: 135.0, a: 50.0,  expectedQ: 18.750 },
  ];

  it('matches Python Rational Method Q = C * i * A / 360 golden fixtures within 0.1% tolerance', () => {
    for (const fixture of RATIONAL_Q_FIXTURES) {
      const q = rationalQ(fixture.c, fixture.i, fixture.a);
      const diff = Math.abs(q - fixture.expectedQ);
      const pctDiff = (diff / fixture.expectedQ) * 100;
      expect(pctDiff).toBeLessThan(0.1);
    }
  });

  it('matches severity classification thresholds exactly', () => {
    expect(severity(0.0)).toBe('low');
    expect(severity(0.74)).toBe('low');
    expect(severity(0.75)).toBe('moderate');
    expect(severity(0.99)).toBe('moderate');
    expect(severity(1.00)).toBe('high');
    expect(severity(1.49)).toBe('high');
    expect(severity(1.50)).toBe('critical');
    expect(severity(3.50)).toBe('critical');
  });

  it('handles zero rainfall and zero runoff coefficients identically to Python engine', () => {
    expect(rationalQ(0.0, 50.0, 50.0)).toBe(0.0);
    expect(rationalQ(0.7, 0.0, 50.0)).toBe(0.0);
    expect(rationalQ(0.7, 50.0, 0.0)).toBe(0.0);
  });
});
