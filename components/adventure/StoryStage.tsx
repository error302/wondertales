import type { ReactNode } from 'react';
import Link from 'next/link';

export function StoryStage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-garden-100 via-parchment to-brass-100 font-ui text-ink">
      <a
        href="#story-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Skip to story
      </a>
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 pt-6 sm:px-6">
        <Link href="/" className="font-story text-xl font-bold tracking-tight text-garden-800">
          WonderTales
        </Link>
        <p className="text-sm font-semibold text-garden-700">{eyebrow}</p>
      </header>
      <main id="story-main" className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
        <h1 className="font-story text-3xl font-bold tracking-tight text-garden-900 sm:text-4xl">
          {title}
        </h1>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
