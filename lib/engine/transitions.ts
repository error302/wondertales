import type { Question, StorySession, WorldFlag } from './types';
import { SCENES } from '../../content/clockwork-garden/scenes';

/** World rewards for correct answers. Each s5 distribution restores the garden further. */
const CORRECT_REWARDS: Record<string, WorldFlag[]> = {
  'q-half': ['channel_filled'],
  'q-two-quarters': ['valve_open'],
  'q-distribute-sun': ['garden_restored'],
  'q-distribute-berry': ['garden_restored'],
};

export function worldFlagsForCorrectAnswer(questionId: string): WorldFlag[] {
  return CORRECT_REWARDS[questionId] ?? [];
}

/** Mark the current scene complete and move to its successor, if one is authored. */
export function advanceScene(session: StorySession): StorySession {
  const current = SCENES.find((scene) => scene.id === session.currentSceneId);
  if (!current) {
    throw new Error(`Unknown scene "${session.currentSceneId}"`);
  }
  const completedSceneIds = session.completedSceneIds.includes(current.id)
    ? session.completedSceneIds
    : [...session.completedSceneIds, current.id];
  if (!current.nextSceneId) {
    return { ...session, completedSceneIds };
  }
  const next = SCENES.find((scene) => scene.id === current.nextSceneId);
  if (!next) {
    throw new Error(`Scene "${current.id}" points at unknown next scene "${current.nextSceneId}"`);
  }
  return { ...session, completedSceneIds, currentSceneId: next.id };
}

/** Move to a named scene (question branching), marking the current scene complete. */
export function gotoScene(session: StorySession, sceneId: string): StorySession {
  const current = SCENES.find((scene) => scene.id === session.currentSceneId);
  if (!current) {
    throw new Error(`Unknown scene "${session.currentSceneId}"`);
  }
  const next = SCENES.find((scene) => scene.id === sceneId);
  if (!next) {
    throw new Error(`Cannot go to unknown scene "${sceneId}"`);
  }
  const completedSceneIds = session.completedSceneIds.includes(current.id)
    ? session.completedSceneIds
    : [...session.completedSceneIds, current.id];
  return { ...session, completedSceneIds, currentSceneId: next.id };
}

/**
 * Branching after an answered question. Returns the next scene id, or null to
 * retry in place. A same-scene result (s5) advances to that scene's next question.
 */
export function sceneAfterAnswer(question: Question, correct: boolean): string | null {
  return correct ? question.onCorrectSceneId : question.onWrongSceneId;
}
