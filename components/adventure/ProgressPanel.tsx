import type { StorySession } from '../../lib/engine/types';

const FLAG_LABELS: Record<string, string> = {
  valve_open: 'Valve open',
  channel_filled: 'Channel filled',
  garden_restored: 'Garden restored',
};

export function ProgressPanel({
  session,
  sceneTitle,
}: {
  session: StorySession;
  sceneTitle: string;
}) {
  const tries = session.attempts.length;
  return (
    <section
      aria-label="Garden progress"
      className="flex flex-wrap items-center gap-2 rounded-2xl bg-garden-900 px-4 py-3 text-sm text-garden-50"
    >
      <span className="font-bold">{sceneTitle}</span>
      <span aria-hidden="true" className="opacity-50">
        •
      </span>
      {session.worldFlags.length === 0 ? (
        <span>The garden is waiting...</span>
      ) : (
        session.worldFlags.map((flag) => (
          <span key={flag} className="rounded-full bg-garden-700 px-3 py-1 font-semibold">
            ✓ {FLAG_LABELS[flag] ?? flag}
          </span>
        ))
      )}
      <span className="ml-auto opacity-80">
        {tries === 0 ? 'No tries yet' : `${tries} ${tries === 1 ? 'try' : 'tries'}`}
      </span>
    </section>
  );
}
