# AI Integration

## Truthful status: demo endpoint live, no AI provider integrated.

`POST /api/wonderguide` is a real server route serving deterministic demo
explanations labeled `mock-guide`. The UI calls it only when the grown-ups
toggle is on (default off), labels the panel "Demo explanations — no AI
connected", and falls back to authored hints on any failure. The adventure
remains 100% playable with zero endpoint calls.

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

## Shipped (M4-mock) and planned next

Shipped: allowlist validation (concept + misconception codes, attempt count
1–50; no free text, no PII), per-client daily cap from server env (default
50), capped deterministic explanations grounded in the authored hint for the
diagnosed misconception, honest `mock-guide` source label.

Planned next (needs approval before any live spend):

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
