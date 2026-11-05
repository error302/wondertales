# WonderTales — The Clockwork Garden

**An adventure where understanding changes the world.**

WonderTales is a story-driven learning adventure for children approximately 7–10 years old.
In the Clockwork Garden, children's fraction reasoning has visible, causal consequences:
water levels rise, valves open, and flowers wake. A wrong answer is never punished —
the world shows *why*, a character explains kindly, and the child retries.

The complete core story runs with **zero AI calls**. Meta's model (Muse Spark) is an
optional, server-side, opt-in explanation companion that never decides correctness,
progression, or world state.

## Status

| Milestone | Deliverable | State |
|---|---|---|
| M0 — Foundation (Oct 29) | Standalone repo, Next.js + TS strict + Tailwind, landing page, scenes 1–2, deterministic engine, unit tests | Done |
| M1 — Story logic (Oct 30) | Six-scene graph, all dialogues/questions, full reducer coverage | Done |
| M2 — Playable (Nov 5) | Full s1–s6 story wiring, all 4 questions, s4 remediation loop, on-device persistence, responsive + story-path e2e | Done |
| M2.1 — Universe (Nov 5) | World select, guide select, grown-ups dashboard, journey e2e | Done |
| M4-mock — Guide API (Nov 5) | Server-side WonderGuide demo endpoint: allowlist validation, daily cap, honest mock label | Done |
| M3 — Visual polish (Nov 1) | Character bible, water animation, garden transformations, a11y pass | Planned |
| M4 — WonderGuide (Nov 2) | Mock + Meta server provider, validation, fallbacks, toggle, rate limits | Planned |
| M5 — Release candidate (Nov 3) | Deployment (after approval), Playwright, screenshots, demo capture | Planned |
| M6 — Submission (Nov 4) | Smoke test, demo URL, video, submission before 9 PM ET | Planned |

## Quickstart

```bash
cd wondertales
npm install
npm run dev      # http://localhost:3000 — landing page, Play opens /adventure
```

No API keys, no accounts, no network access needed after install.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` / `npm run start` | Production build / serve |
| `npm run lint` | Next.js ESLint |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run test` | Vitest unit suite |
| `npm run check:no-secrets` | Fails if a live env file is tracked or a secret pattern appears in source |

Release gates (all must pass): `lint`, `typecheck`, `test`, `build`, `test:e2e`,
`check:no-secrets`. Story-path specs: `tests/e2e/adventure.spec.ts` plays s1–s6
including the s4 remediation loop and reload persistence.

## Architecture

```text
Browser (public, no secrets)
  Landing / Adventure
  Story renderer + accessible interactions
  Deterministic World + Learning state reducer        <- the authority
     |
     | bounded hint request, no PII (M4)
     v
Next.js server route /api/wonderguide (M4)
  Validation + budgets + Meta client + safe fallback
```

The Causal Learning Engine joins two deterministic representations: **world state**
(water levels, valves, plants) and **learning state** (attempts, misconceptions,
mastery). One pure function, `resolveChoice(session, question, choiceId)`, updates
both. Fractions use exact rational arithmetic (`lib/engine/rationals.ts`) — never
float comparison. First-try success and hint-assisted success are recorded
separately and never treated as equivalent evidence.

```text
wondertales/
  app/                  landing, adventure, layout, styles
  components/           adventure UI + Milo/Nia character art (fixed palette)
  content/              typed authored scenes, dialogue, questions, hints
  lib/engine/           types, rationals, reducer, transitions, mastery, validation
  lib/config/           server-only env guard (throws in the browser)
  tests/unit/           Vitest: engine, content, validation, env
  scripts/              no-secret check
```

## Safeguards

- Secrets live only in `.env.local` (git-ignored, entered via editor/hosting UI).
  `.env.example` carries empty placeholders. `npm run check:no-secrets` enforces this.
- No `NEXT_PUBLIC_` secret exists anywhere; the server env guard throws in browsers.
- AI hints are off by default and the adventure is fully playable without them.
- No free-text input, no accounts, no tracking, no PII collection.
- All water visuals use true proportional fill with accurate ½ and ¼ markers.

## Limitations (M2.1 + M4-mock)

- One playable adventure (Clockwork Garden, in the Clockwork Kingdom). The
  Enchanted Forest and Ocean of Discovery are honest coming-soon cards.
- Progress, profile, guide, and settings persist on-device (localStorage,
  schema-validated); no accounts or sync.
- WonderGuide is a server-side demo endpoint (`mock-guide` label, allowlist
  validation, daily cap). No AI provider is integrated; no live API spend
  without approval.
- Screenshots live in `.screenshots/` (git-ignored).
