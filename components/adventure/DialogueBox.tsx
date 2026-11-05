'use client';

import { useState } from 'react';
import type { DialogueLine } from '../../lib/engine/types';
import { Milo } from '../characters/Milo';
import { Nia } from '../characters/Nia';

export function DialogueBox({
  lines,
  doneLabel,
  onDone,
}: {
  lines: DialogueLine[];
  doneLabel: string;
  onDone: () => void;
}) {
  const [index, setIndex] = useState(0);
  if (lines.length === 0) {
    return null;
  }
  const line = lines[Math.min(index, lines.length - 1)];
  const last = index >= lines.length - 1;
  return (
    <section aria-label="Story dialogue" className="rounded-3xl bg-white p-5 shadow-md sm:p-6">
      <div className="flex items-start gap-4">
        {line.speaker === 'Milo' && <Milo />}
        {line.speaker === 'Nia' && <Nia />}
        <div className={line.speaker === 'Narrator' ? 'w-full' : 'min-w-0 flex-1'}>
          <p className="text-sm font-bold uppercase tracking-wide text-garden-700">{line.speaker}</p>
          <p
            className={`mt-1 text-lg leading-relaxed text-ink ${
              line.speaker === 'Narrator' ? 'font-story italic' : ''
            }`}
          >
            {line.text}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-garden-800" aria-live="polite">
          Line {index + 1} of {lines.length}
        </p>
        {last ? (
          <button
            type="button"
            onClick={onDone}
            className="min-h-[48px] rounded-full bg-garden-700 px-6 font-bold text-white hover:bg-garden-600"
          >
            {doneLabel}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIndex((current) => current + 1)}
            className="min-h-[48px] rounded-full bg-brass-500 px-6 font-bold text-white hover:bg-brass-400"
          >
            Next
          </button>
        )}
      </div>
    </section>
  );
}
