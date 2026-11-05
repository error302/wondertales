import { describe, expect, it } from 'vitest';
import { QUESTIONS, getQuestion } from '../../content/clockwork-garden/questions';
import { SCENES } from '../../content/clockwork-garden/scenes';
import { createInitialSession, resolveChoice } from '../../lib/engine/reducer';
import { parseSessionStrict, validateStoryGraph } from '../../lib/engine/validation';

describe('parseSessionStrict', () => {
  it('round-trips a real played session', () => {
    const played = resolveChoice(createInitialSession(), getQuestion('q-half'), 'q-half-b', 1000)
      .session;
    const restored = parseSessionStrict(JSON.parse(JSON.stringify(played)));
    expect(restored).toEqual(played);
  });

  it('rejects corrupt and outdated values', () => {
    expect(parseSessionStrict(null)).toBeNull();
    expect(parseSessionStrict({})).toBeNull();
    expect(parseSessionStrict({ ...createInitialSession(), schemaVersion: 2 })).toBeNull();
    expect(parseSessionStrict({ ...createInitialSession(), currentSceneId: 's99' })).toBeNull();
    expect(parseSessionStrict({ ...createInitialSession(), worldFlags: ['flying'] })).toBeNull();
    expect(parseSessionStrict({ ...createInitialSession(), attempts: [{ bogus: true }] })).toBeNull();
  });
});

describe('validateStoryGraph', () => {
  it('accepts the authored graph', () => {
    expect(validateStoryGraph(SCENES, QUESTIONS)).toEqual([]);
  });

  it('rejects dangling scene and question references', () => {
    const badNext = SCENES.map((scene) =>
      scene.id === 's1' ? { ...scene, nextSceneId: 's99' } : scene,
    );
    expect(validateStoryGraph(badNext, QUESTIONS).length).toBeGreaterThan(0);
    const badQuestion = SCENES.map((scene) =>
      scene.id === 's2' ? { ...scene, questionIds: ['q-missing'] } : scene,
    );
    expect(validateStoryGraph(badQuestion, QUESTIONS).length).toBeGreaterThan(0);
  });
});
