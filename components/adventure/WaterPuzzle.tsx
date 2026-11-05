import type { WaterVariant } from '../../lib/engine/water-visuals';

/**
 * A water vessel whose fill is exactly proportional to its level.
 * Markers sit at the true 1/2 and 1/4 positions: no deceptive water geometry.
 * Tanks and jugs fill vertically; pipes fill horizontally.
 */
export function WaterPuzzle({
  level,
  label,
  showMarkers = true,
  size = 'md',
  variant = 'tank',
}: {
  level: number;
  label: string;
  showMarkers?: boolean;
  size?: 'md' | 'lg';
  variant?: WaterVariant;
}) {
  const pct = Math.max(0, Math.min(1, level)) * 100;
  if (variant === 'pipe') {
    const dims = size === 'lg' ? 'h-36 w-56' : 'h-28 w-40';
    return (
      <div
        role="img"
        aria-label={label}
        className={`relative ${dims} overflow-hidden rounded-full border-4 border-pond-800 bg-pond-100`}
      >
        <div
          className="absolute inset-y-0 left-0 bg-pond-500 motion-safe:transition-[width] motion-safe:duration-700"
          style={{ width: `${pct}%` }}
        />
        {showMarkers && (
          <div aria-hidden="true">
            <div
              className="absolute inset-y-0 border-l-2 border-dashed border-pond-900"
              style={{ left: '50%' }}
            />
            <span className="absolute left-[calc(50%+3px)] top-1 rounded bg-white/80 px-1 text-[10px] font-bold text-pond-900">
              ½
            </span>
            <div
              className="absolute inset-y-0 border-l-2 border-dashed border-pond-900"
              style={{ left: '25%' }}
            />
            <span className="absolute left-[calc(25%+3px)] top-1 rounded bg-white/80 px-1 text-[10px] font-bold text-pond-900">
              ¼
            </span>
          </div>
        )}
      </div>
    );
  }
  const dims = size === 'lg' ? 'h-56 w-36' : 'h-40 w-24';
  const shape =
    variant === 'jug'
      ? 'rounded-b-full rounded-t-xl border-4 border-pond-800 bg-pond-100'
      : 'rounded-b-3xl rounded-t-lg border-4 border-pond-800 bg-pond-100';
  return (
    <div role="img" aria-label={label} className={`relative ${dims} overflow-hidden ${shape}`}>
      <div
        className="absolute inset-x-0 bottom-0 bg-pond-500 motion-safe:transition-[height] motion-safe:duration-700"
        style={{ height: `${pct}%` }}
      />
      {showMarkers && (
        <div aria-hidden="true">
          <div
            className="absolute inset-x-0 border-t-2 border-dashed border-pond-900"
            style={{ bottom: '50%' }}
          />
          <span
            className="absolute left-1 rounded bg-white/80 px-1 text-[10px] font-bold text-pond-900"
            style={{ bottom: 'calc(50% + 3px)' }}
          >
            ½
          </span>
          <div
            className="absolute inset-x-0 border-t-2 border-dashed border-pond-900"
            style={{ bottom: '25%' }}
          />
          <span
            className="absolute left-1 rounded bg-white/80 px-1 text-[10px] font-bold text-pond-900"
            style={{ bottom: 'calc(25% + 3px)' }}
          >
            ¼
          </span>
        </div>
      )}
    </div>
  );
}
