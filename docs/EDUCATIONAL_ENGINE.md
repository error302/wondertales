# Educational Engine

## Content schema

```text
Scene     { id, title, summary, questionIds[], nextSceneId? }
Question  { id, conceptId, prompt, options[3], correctChoiceId,
            misconceptionByChoice, targetValue (exact rational),
            onCorrectSceneId, onWrongSceneId | null }
Hint      { speaker, dialogue (<=300 chars), teachingAction, animationCue }
Attempt   { questionId, conceptId, choiceId, correct,
            misconceptionId?, hintUsed, timestamp }
```

Every question maps to exactly one concept; every wrong choice maps to either a
diagnosed misconception or a generic retry. Every illustration is backed by an
exact fraction (`VISUAL_FRACTIONS`), and tests assert that only the correct
choice matches the question's target value.

## Concepts and misconceptions (Clockwork Garden)

| Concept | Misconception | Teaching move |
|---|---|---|
| half | quarter_is_half | Compare ¼ vs ½ side by side at true heights |
| two_quarters_equal_half | two_quarters_not_half | Pour both quarters; they reach the ½ line |
| quarter | wrong_distribution | Count parts; match water to the label |

## Mastery

`masteryForConcept` reports four levels: `unattempted`, `first_try`,
`after_hint`, `not_yet`. First-try success and hint-assisted success are stored
separately (`hintUsed` on every attempt) and displayed separately in the
celebration — they are not equivalent evidence. Completion requires a correct
attempt for every required question id.

## Feedback policy

- Correct: celebrate + show the exact fair share + name what it unlocked.
- Wrong: name nothing about the child; describe the water, show chosen vs
  needed at true proportions, give the authored hint, offer retry or (for the
  valve puzzle) a demonstration scene that loops back.
- No points, streaks, timers, or loss states anywhere.
