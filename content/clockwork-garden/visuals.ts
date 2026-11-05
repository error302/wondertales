import { rational, type Rational } from '../../lib/engine/rationals';

export interface WaterVisual {
  value: Rational;
  label: string;
}

/** Exact water amount shown by every choice illustration. Source of truth for fraction checks. */
export const VISUAL_FRACTIONS: Record<string, WaterVisual> = {
  'tank-quarter': { value: rational(1, 4), label: 'quarter tank' },
  'tank-half': { value: rational(1, 2), label: 'half tank' },
  'tank-full': { value: rational(1, 1), label: 'full tank' },
  'pipe-quarter': { value: rational(1, 4), label: 'quarter pipe' },
  'pipe-half': { value: rational(1, 2), label: 'half pipe' },
  'pipe-full': { value: rational(1, 1), label: 'full pipe' },
  'jug-quarter': { value: rational(1, 4), label: 'quarter jug' },
  'jug-half': { value: rational(1, 2), label: 'half jug' },
  'jug-full': { value: rational(1, 1), label: 'full jug' },
};

export function getVisualFraction(visualId: string): WaterVisual {
  const visual = VISUAL_FRACTIONS[visualId];
  if (!visual) {
    throw new Error(`Unknown water visual "${visualId}"`);
  }
  return visual;
}
