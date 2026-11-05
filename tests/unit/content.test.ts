import { describe, expect, it } from 'vitest';
import { DIALOGUE } from '../../content/clockwork-garden/dialogue';
import { AUTHORED_HINTS } from '../../content/clockwork-garden/hints';
import { QUESTIONS, REQUIRED_QUESTION_IDS } from '../../content/clockwork-garden/questions';
import { SCENES } from '../../content/clockwork-garden/scenes';
import { getVisualFraction } from '../../content/clockwork-garden/visuals';
import { eq } from '../../lib/engine/rationals';
import { validateQuestion, validateStoryGraph } from '../../lib/engine/validation';

describe('authored content', () => {
  it('gives every question exactly one canonical correct choice', () => {
    expect(QUESTIONS.length).toBe(4);
    for (const question of QUESTIONS) {
      expect(validateQuestion(question)).toEqual([]);
    }
  });

  it('backs every illustration with an exact fraction; only the correct choice matches the target', () => {
    for (const question of QUESTIONS) {
      for (const option of question.options) {
        const visual = getVisualFraction(option.visualId);
        expect(eq(visual.value, question.targetValue)).toBe(option.id === question.correctChoiceId);
      }
    }
  });

  it('wires a valid six-scene story graph with every question required', () => {
    expect(SCENES).toHaveLength(6);
    expect(validateStoryGraph(SCENES, QUESTIONS)).toEqual([]);
    expect(REQUIRED_QUESTION_IDS).toHaveLength(4);
    const gardenWakes = SCENES.find((scene) => scene.id === 's5');
    expect(gardenWakes?.questionIds).toHaveLength(2);
  });

  it('covers every misconception with a short, approved character hint', () => {
    const hints = Object.values(AUTHORED_HINTS);
    expect(hints.length).toBe(3);
    for (const hint of hints) {
      expect(['Milo', 'Nia']).toContain(hint.speaker);
      expect(hint.dialogue.length).toBeGreaterThan(10);
      expect(hint.dialogue.length).toBeLessThanOrEqual(300);
    }
  });

  it('gives every scene dialogue and valid links', () => {
    const sceneIds = new Set(SCENES.map((scene) => scene.id));
    expect(sceneIds.size).toBe(SCENES.length);
    for (const scene of SCENES) {
      const lines = DIALOGUE[scene.id] ?? [];
      expect(lines.length).toBeGreaterThan(0);
      for (const line of lines) {
        expect(line.text.length).toBeGreaterThan(0);
        expect(['Milo', 'Nia', 'Narrator']).toContain(line.speaker);
      }
      for (const questionId of scene.questionIds) {
        expect(QUESTIONS.some((question) => question.id === questionId)).toBe(true);
      }
      if (scene.nextSceneId) {
        expect(sceneIds.has(scene.nextSceneId)).toBe(true);
      }
    }
  });
});
