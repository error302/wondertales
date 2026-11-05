import { describe, expect, it } from 'vitest';
import { ONE_HALF, ONE_QUARTER, add, eq, rational } from '../../lib/engine/rationals';

describe('exact rational arithmetic', () => {
  it('proves 1/4 + 1/4 = 1/2 without floating point', () => {
    expect(eq(add(ONE_QUARTER, ONE_QUARTER), ONE_HALF)).toBe(true);
  });

  it('normalizes equivalent fractions', () => {
    expect(eq(rational(2, 4), ONE_HALF)).toBe(true);
    expect(eq(add(ONE_HALF, ONE_QUARTER), rational(3, 4))).toBe(true);
  });

  it('rejects a zero denominator', () => {
    expect(() => rational(1, 0)).toThrow();
  });
});
