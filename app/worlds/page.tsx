'use client';

import Link from 'next/link';
import { StoryStage } from '../../components/adventure/StoryStage';
import { WORLDS } from '../../content/worlds';
import { setWorldId } from '../../lib/client/storage';

function Emblem({ worldId }: { worldId: string }) {
  if (worldId === 'clockwork-kingdom') {
    return (
      <svg viewBox="0 0 96 96" className="h-20 w-20" role="img" aria-label="Brass gear emblem">
        <circle cx="48" cy="48" r="26" fill="#e0a952" stroke="#7c4a1d" strokeWidth="5" />
        <circle cx="48" cy="48" r="10" fill="#fdf3e3" stroke="#7c4a1d" strokeWidth="5" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const x1 = 48 + Math.cos(angle) * 26;
          const y1 = 48 + Math.sin(angle) * 26;
          const x2 = 48 + Math.cos(angle) * 38;
          const y2 = 48 + Math.sin(angle) * 38;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7c4a1d" strokeWidth="8" strokeLinecap="round" />
          );
        })}
      </svg>
    );
  }
  if (worldId === 'enchanted-forest') {
    return (
      <svg viewBox="0 0 96 96" className="h-20 w-20" role="img" aria-label="Forest tree emblem">
        <ellipse cx="48" cy="82" rx="30" ry="10" fill="#66b154" />
        <rect x="43" y="52" width="10" height="26" rx="4" fill="#7c4a1d" />
        <circle cx="48" cy="34" r="24" fill="#2f7a3d" />
        <circle cx="38" cy="28" r="6" fill="#96cc85" />
        <circle cx="58" cy="40" r="4" fill="#96cc85" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20" role="img" aria-label="Ocean wave emblem">
      <circle cx="68" cy="24" r="12" fill="#e0a952" />
      <path d="M8 62 Q24 50 40 62 T72 62 T104 62 L104 88 L8 88 Z" fill="#3a9fcb" />
      <path d="M8 72 Q24 62 40 72 T72 72 T104 72 L104 88 L8 88 Z" fill="#22749a" />
    </svg>
  );
}

export default function WorldsPage() {
  return (
    <StoryStage eyebrow="Adventure universe" title="Choose your world">
      <div className="space-y-6">
        <p className="max-w-xl text-lg leading-relaxed">
          Every world teaches something different. Pick one to begin — your guide will meet
          you at the gate.
        </p>
        <ul className="grid gap-5 md:grid-cols-3">
          {WORLDS.map((world) => (
            <li
              key={world.id}
              className="flex flex-col items-center rounded-3xl bg-white p-6 text-center shadow-md"
            >
              <Emblem worldId={world.id} />
              <h2 className="mt-3 font-story text-xl font-bold text-garden-900">{world.name}</h2>
              <p className="mt-1 text-sm font-bold uppercase tracking-wide text-brass-700">
                {world.subject}
              </p>
              <p className="mt-2 flex-1 leading-relaxed">{world.purpose}</p>
              {world.adventureHref ? (
                <Link
                  href={world.adventureHref}
                  onClick={() => setWorldId(world.id)}
                  aria-label={`Enter ${world.name}`}
                  className="mt-4 inline-flex min-h-[48px] items-center rounded-full bg-fox px-6 font-bold text-white hover:bg-fox-deep"
                >
                  Enter this world
                </Link>
              ) : (
                <p className="mt-4 inline-flex min-h-[48px] items-center rounded-full bg-parchment px-6 font-bold text-garden-700">
                  Coming soon
                </p>
              )}
            </li>
          ))}
        </ul>
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center rounded-full border-2 border-garden-700 px-6 font-bold text-garden-800"
        >
          Back to the start
        </Link>
      </div>
    </StoryStage>
  );
}
