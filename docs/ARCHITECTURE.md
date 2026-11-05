# Architecture

Next.js 15 App Router + React 19 + TypeScript strict + Tailwind 3. No runtime
dependencies beyond Next/React. No database, no backend services, no tracking.

## Layers

```text
app/            routes: / (landing), /adventure (story player)
components/     adventure UI (ChoicePanel, DialogueBox, FeedbackPanel,
                ProgressPanel, StoryStage, WaterPuzzle) + Milo/Nia SVG art
content/        typed authored data: scenes, dialogue, questions, hints, visuals
lib/engine/     pure logic: types, rationals, reducer, transitions,
                mastery, validation, water-visuals
lib/config/     server-only env guard (throws in the browser)
tests/unit/     Vitest suite (38 tests)
tests/e2e/      Playwright: responsive overflow + full story playthrough
scripts/        check-no-secrets gate
```

## Authority and data flow

One pure function, `resolveChoice(session, question, choiceId)`, updates world
state (water levels, valves, plants) and learning state (attempts,
misconceptions, mastery) together. The UI (`app/adventure/page.tsx`) is a thin
state machine over four phases — dialogue, question, feedback, complete — and
never decides correctness itself.

- Correctness and branching come from authored `Question` records
  (`correctChoiceId`, `onCorrectSceneId`, `onWrongSceneId`).
- Scene movement uses `advanceScene` (linear links) and `gotoScene` (branching).
- Fractions use exact rational arithmetic; floats are display-only.
- Sessions persist to localStorage under a versioned key and are restored
  through `parseSessionStrict`, which fails safe to a fresh session.

## Tradeoffs

- Local-first over accounts: zero PII collection, zero infra cost, works
  offline. Cost: no cross-device sync (a future opt-in).
- Authored content over generated: every line of dialogue, hint, and feedback
  is reviewed text in `content/`. AI (M4) will only ever add supplemental
  explanations, never correctness, progression, or world state.
- Inline SVG over image assets: zero asset pipeline, always crisp, themeable
  via Tailwind tokens. Cost: richer illustration needs an asset pass (M3).
