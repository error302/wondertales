import type { MisconceptionId, Question, StorySession, WorldFlag } from './types';
import { worldFlagsForCorrectAnswer } from './transitions';

export type FeedbackId = 'correct' | 'incorrect' | 'duplicate_ignored' | MisconceptionId;

export interface ResolveChoiceResult {
  session: StorySession;
  feedbackId: FeedbackId;
  shouldOfferAiHint: boolean;
}

/** Repeat taps of the same choice inside this window collapse into one decision. */
export const DUPLICATE_CLICK_WINDOW_MS = 500;

export function createInitialSession(): StorySession {
  return {
    schemaVersion: 1,
    currentSceneId: 's1',
    worldFlags: [],
    attempts: [],
    completedSceneIds: [],
    aiHintsEnabled: false,
  };
}

/**
 * Pure state transition for one answered question. Total for valid inputs:
 * unknown choice ids throw, duplicate fast clicks are ignored, and an AI hint
 * is only ever offered as supplemental explanation for a diagnosed misconception.
 */
export function resolveChoice(
  session: StorySession,
  question: Question,
  choiceId: string,
  now: number = Date.now(),
): ResolveChoiceResult {
  const option = question.options.find((candidate) => candidate.id === choiceId);
  if (!option) {
    throw new Error(`Unknown choice "${choiceId}" for question "${question.id}"`);
  }

  const last = session.attempts[session.attempts.length - 1];
  if (
    last &&
    last.questionId === question.id &&
    last.choiceId === choiceId &&
    now - last.timestamp < DUPLICATE_CLICK_WINDOW_MS
  ) {
    return { session, feedbackId: 'duplicate_ignored', shouldOfferAiHint: false };
  }

  const correct = choiceId === question.correctChoiceId;
  const misconceptionId = correct ? undefined : question.misconceptionByChoice[choiceId];
  // A retry always follows a remediation moment, so any repeat attempt counts as hint-assisted.
  const hintUsed = session.attempts.some((attempt) => attempt.questionId === question.id);
  const attempt = {
    questionId: question.id,
    conceptId: question.conceptId,
    choiceId,
    correct,
    ...(misconceptionId ? { misconceptionId } : {}),
    hintUsed,
    timestamp: now,
  };

  let worldFlags: WorldFlag[];
  if (correct) {
    worldFlags = Array.from(new Set([...session.worldFlags, ...worldFlagsForCorrectAnswer(question.id)]));
  } else {
    worldFlags = [...session.worldFlags];
  }

  return {
    session: { ...session, worldFlags, attempts: [...session.attempts, attempt] },
    feedbackId: correct ? 'correct' : (misconceptionId ?? 'incorrect'),
    shouldOfferAiHint: !correct && misconceptionId !== undefined && session.aiHintsEnabled,
  };
}
