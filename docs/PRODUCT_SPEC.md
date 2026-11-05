# Product Spec — WonderTales: The Clockwork Garden

**Promise:** every adventure teaches something, and every decision shapes the story.

## Audience

Children ~7–10. Grown-ups (parents, teachers) get a plain-language summary on
the landing page. English only; content is data-driven (`content/`) so
localization means translating typed records, not rewriting UI.

## Screens (shipped)

1. **Welcome** (`/`): identity, illustrated hero, Play action, how-it-teaches,
   grown-ups section. No sign-up, no empty states.
2. **Story player** (`/adventure`): scene illustration and title, dialogue with
   Milo/Nia, 3 meaningful choices per puzzle, kind feedback, progress bar,
   celebration recap. Large touch targets (min 48px), skip link, focus ring,
   reduced-motion respected.
3. **Celebration**: what was learned per concept (first-try vs learned-with-help
   reported separately), puzzles solved, tries, achievements, replay, next step.

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

World select, character select, parent dashboard route, narration audio,
additional adventures, AI companion. See README Limitations and the roadmap in
HACKATHON_SUBMISSION.md.
