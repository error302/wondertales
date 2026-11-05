import { describe, expect, it } from 'vitest';
import { levelForVisual, variantForVisual, type WaterVariant } from '../../lib/engine/water-visuals';

const CASES: Array<[string, number, WaterVariant]> = [
  ['tank-quarter', 0.25, 'tank'],
  ['tank-half', 0.5, 'tank'],
  ['tank-full', 1, 'tank'],
  ['pipe-quarter', 0.25, 'pipe'],
  ['pipe-half', 0.5, 'pipe'],
  ['pipe-full', 1, 'pipe'],
  ['jug-quarter', 0.25, 'jug'],
  ['jug-half', 0.5, 'jug'],
  ['jug-full', 1, 'jug'],
];

describe('water visuals', () => {
  it('maps every authored visual to its true level and vessel', () => {
    expect(CASES).toHaveLength(9);
    for (const [visualId, level, variant] of CASES) {
      expect(levelForVisual(visualId)).toBe(level);
      expect(variantForVisual(visualId)).toBe(variant);
    }
  });

  it('throws on unknown visuals', () => {
    expect(() => levelForVisual('nope')).toThrow();
    expect(() => variantForVisual('nope')).toThrow();
  });
});
