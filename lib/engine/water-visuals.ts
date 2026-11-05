import { getVisualFraction } from '../../content/clockwork-garden/visuals';

export type WaterVariant = 'tank' | 'pipe' | 'jug';

/** Fill level 0..1 for any authored water visual. Unknown ids throw. */
export function levelForVisual(visualId: string): number {
  const visual = getVisualFraction(visualId);
  return visual.value.n / visual.value.d;
}

/** Vessel shape for any authored water visual. Unknown ids throw. */
export function variantForVisual(visualId: string): WaterVariant {
  getVisualFraction(visualId);
  if (visualId.startsWith('tank-')) {
    return 'tank';
  }
  if (visualId.startsWith('pipe-')) {
    return 'pipe';
  }
  if (visualId.startsWith('jug-')) {
    return 'jug';
  }
  throw new Error(`Water visual "${visualId}" has no vessel variant`);
}
