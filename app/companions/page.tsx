'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StoryStage } from '../../components/adventure/StoryStage';
import { Milo } from '../../components/characters/Milo';
import { Nia } from '../../components/characters/Nia';
import { getCompanion, setCompanion, type CompanionId } from '../../lib/client/storage';

const GUIDES: Array<{ id: CompanionId; trait: string }> = [
  { id: 'Milo', trait: 'Curious and quick — first to splash into every puzzle.' },
  { id: 'Nia', trait: 'Patient and wise — always ready with a kind explanation.' },
];

export default function CompanionsPage() {
  const [companion, setCompanionState] = useState<CompanionId | null>(null);

  useEffect(() => {
    setCompanionState(getCompanion());
  }, []);

  const choose = (id: CompanionId) => {
    setCompanion(id);
    setCompanionState(id);
  };

  return (
    <StoryStage eyebrow="Choose your guide" title="Who travels with you?">
      <div className="space-y-6">
        <p className="max-w-xl text-lg leading-relaxed">
          Your guide cheers you on and explains what the water is doing. Both friends appear
          in the story — this just picks who walks beside you.
        </p>
        <ul className="grid gap-5 sm:grid-cols-2">
          {GUIDES.map((guide) => {
            const selected = companion === guide.id;
            return (
              <li key={guide.id}>
                <button
                  type="button"
                  onClick={() => choose(guide.id)}
                  aria-pressed={selected}
                  aria-label={`Choose ${guide.id} as your guide`}
                  className={`flex min-h-[48px] w-full flex-col items-center rounded-3xl border-4 bg-white p-6 text-center shadow-md ${
                    selected ? 'border-garden-700' : 'border-transparent hover:border-garden-300'
                  }`}
                >
                  {guide.id === 'Milo' ? <Milo size={96} /> : <Nia size={96} />}
                  <span className="mt-3 font-story text-xl font-bold text-garden-900">
                    {guide.id}
                  </span>
                  <span className="mt-1 leading-relaxed">{guide.trait}</span>
                  <span className="mt-3 text-sm font-bold text-garden-700">
                    {selected ? '✓ Your guide' : 'Tap to choose'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/adventure"
            aria-label="Begin the adventure"
            className="inline-flex min-h-[56px] items-center rounded-full bg-fox px-8 text-lg font-bold text-white hover:bg-fox-deep"
          >
            {companion ? `Begin with ${companion}` : 'Begin the adventure'}
          </Link>
          <Link
            href="/worlds"
            className="inline-flex min-h-[48px] items-center rounded-full border-2 border-garden-700 px-6 font-bold text-garden-800"
          >
            Back to worlds
          </Link>
        </div>
      </div>
    </StoryStage>
  );
}
