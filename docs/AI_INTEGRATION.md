# AI Integration

## Truthful status: no AI provider is integrated.

The adventure is 100% authored content and runs fully offline with zero AI
calls. Nothing in the product claims otherwise: the landing page states "AI is
optional and off."

## What exists today (M4 preparation, no behavior)

- `lib/config/server-env.ts`: server-only env guard. Throws in the browser.
  Reads `META_API_KEY` (empty), `META_MODEL` (default `muse-spark-1.3`),
  `WONDERGUIDE_ENABLED` (default false), `WONDERGUIDE_DAILY_REQUEST_CAP`
  (default 50).
- `.env.example`: empty placeholders only. `.env.local` is git-ignored and absent.
- `reducer.shouldOfferAiHint`: true only for a diagnosed misconception when
  `session.aiHintsEnabled` is true. The flag defaults to false and has no UI
  toggle, so it is never true in practice.
- `scripts/check-no-secrets.mjs`: fails the release if a live env file is
  tracked or a secret pattern appears in source.

## Planned design (M4, mock-first, needs approval before any live spend)

- Server route `/api/wonderguide` only; the browser never sees credentials.
- Bounded input: misconception id + concept id + attempt count. No free text
  from the child, no PII, ever.
- Structured JSON output with schema validation; any validation failure falls
  back to the authored hint for that misconception.
- AI output may only add a supplemental explanation. It can never decide
  correctness, branching, world state, or mastery — the deterministic engine
  remains the sole authority.
- Daily per-device request cap, graceful offline degradation, opt-in toggle
  defaulting to off, grown-ups disclosure.

## Safety rules (binding when M4 lands)

Age-appropriate system instructions, input allowlists, output validation,
restricted-topic refusal with a kind redirect, no open chat surface, no PII
collection, no client-side keys.
