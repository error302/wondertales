import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-garden-100 via-parchment to-brass-100 font-ui text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 pt-6 sm:px-6">
        <p className="font-story text-xl font-bold tracking-tight text-garden-800">WonderTales</p>
        <a
          href="#grownups"
          className="inline-flex min-h-[48px] items-center rounded-full border-2 border-garden-700 px-5 font-bold text-garden-800"
        >
          For grown-ups
        </a>
      </header>
      <main id="main" className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
        <div className="mt-10 grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-base font-semibold text-garden-700">
              The Clockwork Garden · a complete adventure
            </p>
            <h1 className="mt-3 font-story text-4xl font-bold leading-tight tracking-tight text-garden-900 sm:text-5xl">
              An adventure where understanding changes the world.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed">
              Join Milo the fox and Nia the turtle to wake a sleeping garden. Every water puzzle
              you solve makes the world bloom — and mistakes just show you something new.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/adventure"
                className="inline-flex min-h-[56px] items-center rounded-full bg-fox px-8 text-lg font-bold text-white hover:bg-fox-deep"
              >
                Play the adventure
              </Link>
              <p className="text-sm font-semibold text-garden-800">
                Ages 7–10 · about 10 minutes · no sign-up
              </p>
            </div>
          </div>
          <div aria-hidden="true" className="mx-auto w-full max-w-sm">
            <svg
              viewBox="0 0 320 260"
              className="w-full rounded-t-[2.5rem] rounded-b-3xl border-4 border-garden-800 bg-pond-100 shadow-lg"
            >
              <circle cx="258" cy="48" r="26" fill="#e0a952" />
              <ellipse cx="60" cy="230" rx="120" ry="60" fill="#96cc85" />
              <ellipse cx="270" cy="235" rx="110" ry="55" fill="#66b154" />
              <rect x="118" y="70" width="84" height="130" rx="10" fill="#dff3fa" stroke="#224a61" strokeWidth="5" />
              <rect x="125" y="135" width="70" height="58" fill="#3a9fcb" />
              <line x1="118" y1="135" x2="202" y2="135" stroke="#224a61" strokeWidth="3" strokeDasharray="7 5" />
              <line x1="118" y1="167" x2="202" y2="167" stroke="#224a61" strokeWidth="3" strokeDasharray="7 5" />
              <rect x="40" y="150" width="8" height="60" rx="4" fill="#33752d" />
              <circle cx="44" cy="140" r="8" fill="#d18a34" />
              <circle cx="34" cy="146" r="8" fill="#d18a34" />
              <circle cx="54" cy="146" r="8" fill="#d18a34" />
              <circle cx="44" cy="148" r="6" fill="#8f5424" />
              <rect x="272" y="150" width="8" height="60" rx="4" fill="#33752d" />
              <circle cx="276" cy="140" r="8" fill="#b4552d" />
              <circle cx="266" cy="146" r="8" fill="#b4552d" />
              <circle cx="286" cy="146" r="8" fill="#b4552d" />
              <circle cx="276" cy="148" r="6" fill="#7c3a1d" />
            </svg>
          </div>
        </div>

        <section aria-label="How the garden teaches" className="mt-14">
          <h2 className="font-story text-2xl font-bold text-garden-900">How the garden teaches</h2>
          <ol className="mt-5 grid gap-5 md:grid-cols-3">
            <li className="rounded-bl-lg rounded-br-3xl rounded-tl-3xl rounded-tr-lg bg-white p-5 shadow">
              <p className="font-story text-3xl font-bold text-brass-500">1</p>
              <h3 className="mt-2 font-bold">Explore the reservoir</h3>
              <p className="mt-1 leading-relaxed">
                See halves and quarters as real water in a real tank, with true water lines.
              </p>
            </li>
            <li className="rounded-bl-3xl rounded-br-lg rounded-tl-lg rounded-tr-3xl bg-white p-5 shadow">
              <p className="font-story text-3xl font-bold text-brass-500">2</p>
              <h3 className="mt-2 font-bold">Decide what pours</h3>
              <p className="mt-1 leading-relaxed">
                Choose the water the garden needs. Your reasoning picks the path — not luck.
              </p>
            </li>
            <li className="rounded-3xl rounded-tr-lg bg-white p-5 shadow">
              <p className="font-story text-3xl font-bold text-brass-500">3</p>
              <h3 className="mt-2 font-bold">Watch the world answer</h3>
              <p className="mt-1 leading-relaxed">
                Channels fill or splash over, flowers wake, and Nia explains what happened.
              </p>
            </li>
          </ol>
        </section>

        <section
          id="grownups"
          aria-label="For grown-ups"
          className="mt-12 rounded-3xl bg-garden-900 p-6 text-garden-50 sm:p-8"
        >
          <h2 className="font-story text-2xl font-bold">For grown-ups</h2>
          <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            <li>
              <strong>No accounts, ads, or tracking.</strong> The story runs fully in the browser.
            </li>
            <li>
              <strong>Progress stays on this device.</strong> Nothing is uploaded anywhere.
            </li>
            <li>
              <strong>AI is optional and off.</strong> The whole adventure plays with zero AI calls.
            </li>
            <li>
              <strong>Kind by design.</strong> Wrong answers bloom into explanations, never shame.
            </li>
          </ul>
        </section>

        <footer className="mt-10 text-sm font-semibold text-garden-800">
          <p>WonderTales · one complete adventure, polished before anything else.</p>
        </footer>
      </main>
    </div>
  );
}
