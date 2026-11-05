import type { ConceptId, MisconceptionId, Question, Scene, StorySession, WorldFlag } from './types';
import { SCENES } from '../../content/clockwork-garden/scenes';

const CONCEPTS: readonly ConceptId[] = ['half', 'quarter', 'two_quarters_equal_half'];
const WORLD_FLAGS: readonly WorldFlag[] = ['valve_open', 'channel_filled', 'garden_restored'];
const MISCONCEPTIONS: readonly MisconceptionId[] = [
  'quarter_is_half',
  'two_quarters_not_half',
  'wrong_distribution',
];

/** Authoring-time check: every question must have exactly one canonical correct choice. */
export function validateQuestion(question: Question): string[] {
  const errors: string[] = [];
  const ids = question.options.map((option) => option.id);
  if (new Set(ids).size !== ids.length) {
    errors.push(`Question "${question.id}" has duplicate choice ids`);
  }
  if (!ids.includes(question.correctChoiceId)) {
    errors.push(`Question "${question.id}" has a correctChoiceId outside its options`);
  }
  for (const [choiceId, misconception] of Object.entries(question.misconceptionByChoice)) {
    if (!ids.includes(choiceId)) {
      errors.push(`Question "${question.id}" maps unknown choice "${choiceId}" to a misconception`);
    }
    if (misconception && !MISCONCEPTIONS.includes(misconception)) {
      errors.push(`Question "${question.id}" maps choice "${choiceId}" to unknown misconception`);
    }
  }
  if (question.correctChoiceId in question.misconceptionByChoice) {
    errors.push(`Question "${question.id}" maps its correct choice to a misconception`);
  }
  if (
    !Number.isInteger(question.targetValue.n) ||
    !Number.isInteger(question.targetValue.d) ||
    question.targetValue.d <= 0
  ) {
    errors.push(`Question "${question.id}" has an invalid targetValue`);
  }
  const sceneIds = SCENES.map((scene) => scene.id);
  if (!sceneIds.includes(question.onCorrectSceneId)) {
    errors.push(`Question "${question.id}" points at unknown scene "${question.onCorrectSceneId}"`);
  }
  if (question.onWrongSceneId !== null && !sceneIds.includes(question.onWrongSceneId)) {
    errors.push(`Question "${question.id}" points at unknown scene "${question.onWrongSceneId}"`);
  }
  return errors;
}

/** Restore-time check: corrupt or outdated persisted sessions fail safe to null. */
export function parseSessionStrict(value: unknown): StorySession | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const candidate = value as Record<string, unknown>;
  if (candidate.schemaVersion !== 1) {
    return null;
  }
  if (typeof candidate.currentSceneId !== 'string' || !SCENES.some((s) => s.id === candidate.currentSceneId)) {
    return null;
  }
  if (
    !Array.isArray(candidate.worldFlags) ||
    !candidate.worldFlags.every((flag) => WORLD_FLAGS.includes(flag as WorldFlag))
  ) {
    return null;
  }
  if (
    !Array.isArray(candidate.completedSceneIds) ||
    !candidate.completedSceneIds.every((id) => typeof id === 'string')
  ) {
    return null;
  }
  if (typeof candidate.aiHintsEnabled !== 'boolean') {
    return null;
  }
  if (!Array.isArray(candidate.attempts)) {
    return null;
  }
  for (const entry of candidate.attempts) {
    if (typeof entry !== 'object' || entry === null) {
      return null;
    }
    const attempt = entry as Record<string, unknown>;
    if (typeof attempt.questionId !== 'string' || typeof attempt.choiceId !== 'string') {
      return null;
    }
    if (!CONCEPTS.includes(attempt.conceptId as ConceptId)) {
      return null;
    }
    if (typeof attempt.correct !== 'boolean' || typeof attempt.hintUsed !== 'boolean') {
      return null;
    }
    if (typeof attempt.timestamp !== 'number' || !Number.isFinite(attempt.timestamp)) {
      return null;
    }
    if (
      attempt.misconceptionId !== undefined &&
      !MISCONCEPTIONS.includes(attempt.misconceptionId as MisconceptionId)
    ) {
      return null;
    }
  }
  return value as StorySession;
}

/** Story-graph check: every link resolves and every question is reachable. */
export function validateStoryGraph(scenes: Scene[], questions: Question[]): string[] {
  const errors: string[] = [];
  const sceneIds = scenes.map((scene) => scene.id);
  if (new Set(sceneIds).size !== sceneIds.length) {
    errors.push('Duplicate scene ids in story graph');
  }
  const questionIds = new Set(questions.map((question) => question.id));
  for (const scene of scenes) {
    if (scene.nextSceneId && !sceneIds.includes(scene.nextSceneId)) {
      errors.push(`Scene "${scene.id}" points at unknown next scene "${scene.nextSceneId}"`);
    }
    for (const questionId of scene.questionIds) {
      if (!questionIds.has(questionId)) {
        errors.push(`Scene "${scene.id}" references unknown question "${questionId}"`);
      }
    }
  }
  for (const question of questions) {
    if (!scenes.some((scene) => scene.questionIds.includes(question.id))) {
      errors.push(`Question "${question.id}" is not referenced by any scene`);
    }
  }
  return errors;
}
