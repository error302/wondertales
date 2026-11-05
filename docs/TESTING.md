# Testing

## Release gates (all must pass)

| Command | What it checks | Last result |
|---|---|---|
| `npm run lint` | Next.js ESLint | PASS, no warnings |
| `npm run typecheck` | `tsc --noEmit`, strict | PASS |
| `npm run test` | Vitest unit suite, 45 tests | 45/45 PASS |
| `npm run build` | Production build, 6 routes + API | PASS |
| `npm run test:e2e` | Playwright, 6 specs | 6/6 PASS |
| `npm run check:no-secrets` | No tracked secrets | PASS |

## Unit coverage

- `engine.test.ts` (22): reducer correctness, misconception diagnosis, AI-hint
  gating, duplicate-click collapse, hint-assisted mastery split, scene
  transitions incl. the s4 remediation loop and a full s1–s6 walk.
- `content.test.ts` (5): exactly one correct choice per question, exact-fraction
  illustration backing, valid six-scene graph, hint length/speaker rules,
  dialogue validity per scene.
- `water-visuals.test.ts` (2): all 9 visuals map to true levels and vessels.
- `validation.test.ts` (4), `rationals.test.ts` (3), `server-env.test.ts` (2).

## End-to-end coverage

- `adventure.spec.ts`: full playthrough s1–s6 with a wrong answer (remediation
  branch), both s5 distributions, celebration assertions, and a zero
  console-error/pageerror budget; plus a reload-persistence test.
- `journey.spec.ts`: worlds to companions to adventure with guide chip,
  grown-ups profile save, AI toggle, WonderGuide explanation; plus API
  accept/reject checks.
- `responsive.spec.ts`: no horizontal overflow on all five pages at 375px
  and 1280px.

## Browser verification (this session, real Chromium)

Full story captured and visually inspected at 390×844, 768×1024, and
1440×900: landing, dialogue, question, wrong-answer feedback, s5 pipe puzzle,
celebration — plus worlds, companions, grown-ups dashboard, and the
WonderGuide panel. No overflow, no clipped text, no console errors.
Screenshots in `.screenshots/` (git-ignored local evidence).

## Known gaps

Single-engine (Chromium) only — no WebKit/Firefox run yet. No CI workflow yet,
so gates are enforced manually. Keyboard-only and screen-reader passes are
partial (skip link, roles, labels, and focus ring exist; full pass at M3).
