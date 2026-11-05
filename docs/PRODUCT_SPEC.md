# Product Spec — WonderTales: The Clockwork Garden

**Promise:** every adventure teaches something, and every decision shapes the story.

## Audience

Children ~7–10. Grown-ups (parents, teachers) get a plain-language summary on
the landing page. English only; content is data-driven (`content/`) so
localization means translating typed records, not rewriting UI.

## Screens (shipped)

1. **Welcome** (`/`): identity, illustrated hero, Play action, how-it-teaches,
   grown-ups section. No sign-up, no empty states.
2. **Adventure universe** (`/worlds`): three worlds with distinct emblems,
   subjects, and purposes. Clockwork Kingdom is playable; Forest and Ocean are
   honest coming-soon cards, never fake buttons.
3. **Guide select** (`/companions`): pick Milo or Nia as your traveling guide.
   Shown in the adventure progress bar and celebration; stored on-device.
4. **Story player** (`/adventure`): scene illustration and title, dialogue with
   Milo/Nia, 3 meaningful choices per puzzle, kind feedback, progress bar with
   guide chip, opt-in WonderGuide preview panel, celebration recap. Large touch
   targets (min 48px), skip link, focus ring, reduced-motion respected.
5. **Celebration**: what was learned per concept (first-try vs learned-with-help
   reported separately), puzzles solved, tries, achievements, replay, next step.
6. **Grown-ups dashboard** (`/grown-ups`): child profile (name, age band),
   learning progress per concept, WonderGuide preview toggle (default off),
   privacy notes, remove-all-data. Everything stays in the browser.

## The adventure (complete, playable start to finish)

Six scenes, four puzzles, one remediation loop:

1. Garden Awakens — meet Milo and Nia, learn the garden is thirsty.
2. Reservoir — puzzle: which tank shows exactly one-half?
3. Two Small Buckets — puzzle: do two quarter buckets fill the half tank?
   Wrong answers branch to The Overflow, where Nia demonstrates the pour,
   then loop back to retry. Correct answers open the valve.
4. The Garden Wakes — two distribution puzzles (pipes, jugs) restoring zones.
5. Celebration — recap and replay.

Wrong answers are never punished: the world shows *why*, a character explains,
and the child retries. No timers, no lives, no loss states.

## Not built (honest gaps)

Narration audio, Forest and Ocean adventures, live AI provider. See README
Limitations and the roadmap in HACKATHON_SUBMISSION.md.
