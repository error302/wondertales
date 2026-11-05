# Hackathon Submission Pack

> Status note (Nov 5, 2026): the published Meta Global AI Developer Hackathon
> deadline was Nov 4, 2026, 9:00 PM ET. No submission-portal access was
> available in this session, so nothing was submitted and no late-submission
> claim is made. These materials are ready to paste if the owner confirms the
> portal state and authorizes submission.

## Project title

WonderTales — The Clockwork Garden

## Short description

A story-driven learning adventure where children's fraction reasoning visibly
changes the world: water rises, valves open, and gardens bloom. Fully playable
offline; wrong answers bloom into kind explanations, never punishment.

## Problem

Early math apps drill symbols in isolation; story apps rarely teach. Children
7–10 need concrete, consequential fraction experiences where mistakes are safe.

## Solution

A causal learning engine joins world state and learning state in one pure
transition: every puzzle answer moves water, story, and mastery together. The
Clockwork Garden ships one complete six-scene adventure (4 puzzles, a
remediation loop, celebration recap) with exact-fraction visuals and
first-try vs hint-assisted mastery reporting.

## Technical architecture

Next.js 15 + React 19 + TypeScript strict + Tailwind; zero runtime deps beyond
Next/React. Authored typed content (`content/`), pure engine (`lib/engine/`),
thin UI state machine, localStorage persistence with strict schema validation.
See ARCHITECTURE.md.

## Meta AI usage (honest)

No Meta model is integrated at submission time. The product runs 100% on
authored content with zero AI calls, and says so in the UI. M4 (planned,
mock-first) adds an opt-in, server-side WonderGuide companion on Meta's model
for supplemental misconception explanations only — never correctness,
branching, or world state. Env guard, request caps, and validation design are
specified in AI_INTEGRATION.md.

## Links

- Repo: https://github.com/error302/wondertales
- Demo URL: pending deployment approval (local: `npm run dev`, http://localhost:3000)

## Demo script (3 minutes)

1. Landing: identity, Play, grown-ups summary (0:20).
2. s1–s2: dialogue, reservoir puzzle — answer wrong first, show kind feedback
   with chosen-vs-needed water, retry (1:00).
3. s3–s4: valve puzzle wrong → Overflow demonstration → retry → valve opens (0:50).
4. s5–s6: pipe + jug distributions, celebration recap with mastery (0:40).
5. Reload mid-adventure to show on-device resume (0:10).

## Setup / reproduction

`npm install`, `npm run dev`; gates: `lint`, `typecheck`, `test`, `build`,
`test:e2e`, `check:no-secrets` — all green this session (see TESTING.md).

## Screenshots

`.screenshots/` holds landing/dialogue/question/feedback/s5/celebration at
390×844, 768×1024, 1440×900 (local evidence, git-ignored).

## Limitations and roadmap

One adventure; no world/character select, parent route, narration, or AI yet.
Next: M3 visual polish + a11y pass, M4 mock-first WonderGuide, M5 deployment,
then content expansion (Enchanted Forest, Ocean of Discovery) and Swahili.
