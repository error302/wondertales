import type { ConceptId, LearningAttempt, StorySession } from './types';

export type MasteryLevel = 'unattempted' | 'first_try' | 'after_hint' | 'not_yet';

/**
 * First-try success and hint-assisted success are reported separately:
 * they are not equivalent evidence of mastery.
 */
export function masteryForConcept(attempts: LearningAttempt[], conceptId: ConceptId): MasteryLevel {
  const relevant = attempts.filter((attempt) => attempt.conceptId === conceptId);
  if (relevant.length === 0) {
    return 'unattempted';
  }
  const firstCorrect = relevant.find((attempt) => attempt.correct);
  if (!firstCorrect) {
    return 'not_yet';
  }
  return firstCorrect.hintUsed ? 'after_hint' : 'first_try';
}

/** Completion requires a correct attempt for every required question id. */
export function hasCompletedQuestions(
  session: Pick<StorySession, 'attempts'>,
  requiredQuestionIds: string[],
): boolean {
  return requiredQuestionIds.every((questionId) =>
    session.attempts.some((attempt) => attempt.questionId === questionId && attempt.correct),
  );
}
