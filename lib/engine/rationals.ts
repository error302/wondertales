/** Exact rational arithmetic for fraction concepts. Never compare fractions with floats. */

export interface Rational {
  n: number;
  d: number;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const rest = x % y;
    x = y;
    y = rest;
  }
  return x;
}

export function rational(n: number, d: number): Rational {
  if (!Number.isInteger(n) || !Number.isInteger(d)) {
    throw new Error('Rational parts must be integers');
  }
  if (d === 0) {
    throw new Error('Denominator must not be zero');
  }
  const sign = d < 0 ? -1 : 1;
  const divisor = gcd(n, d);
  return { n: (sign * n) / divisor, d: Math.abs(d) / divisor };
}

export function add(a: Rational, b: Rational): Rational {
  return rational(a.n * b.d + b.n * a.d, a.d * b.d);
}

export function eq(a: Rational, b: Rational): boolean {
  return a.n === b.n && a.d === b.d;
}

export const ONE_QUARTER = rational(1, 4);
export const ONE_HALF = rational(1, 2);
