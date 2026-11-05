import type { ReactNode } from 'react';

export function FeedbackPanel({
  tone,
  title,
  message,
  speaker,
  visual,
  primary,
  secondary,
}: {
  tone: 'success' | 'oops';
  title: string;
  message: string;
  speaker?: string;
  visual?: ReactNode;
  primary: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
}) {
  const success = tone === 'success';
  return (
    <section
      role="status"
      aria-live="polite"
      className={`rounded-3xl p-5 shadow-md sm:p-6 ${
        success ? 'bg-garden-700 text-white' : 'bg-white text-ink'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl font-black ${
            success ? 'bg-white text-garden-700' : 'bg-brass-200 text-brass-900'
          }`}
        >
          {success ? '✓' : '!'}
        </span>
        <div>
          <h2 className="font-story text-xl font-bold">{title}</h2>
          {speaker && (
            <p className={`text-sm font-semibold ${success ? 'text-garden-100' : 'text-garden-700'}`}>
              {speaker}
            </p>
          )}
        </div>
      </div>
      <p className="mt-3 text-lg leading-relaxed">{message}</p>
      {visual && <div className="mt-4">{visual}</div>}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={primary.onClick}
          className={`min-h-[48px] rounded-full px-6 font-bold ${
            success ? 'bg-white text-garden-800 hover:bg-garden-50' : 'bg-garden-700 text-white hover:bg-garden-600'
          }`}
        >
          {primary.label}
        </button>
        {secondary && (
          <button
            type="button"
            onClick={secondary.onClick}
            className={`min-h-[48px] rounded-full border-2 px-6 font-bold ${
              success
                ? 'border-white text-white hover:bg-garden-600'
                : 'border-garden-700 text-garden-800 hover:bg-garden-50'
            }`}
          >
            {secondary.label}
          </button>
        )}
      </div>
    </section>
  );
}
