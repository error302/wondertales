import { describe, expect, it } from 'vitest';
import { REQUIRED_QUESTION_IDS, getQuestion } from '../../content/clockwork-garden/questions';
import { hasCompletedQuestions, masteryForConcept } from '../../lib/engine/mastery';
import { createInitialSession, resolveChoice } from '../../lib/engine/reducer';
import { advanceScene, gotoScene, sceneAfterAnswer } from '../../lib/engine/transitions';

const HALF_QUESTION = getQuestion('q-half');

describe('resolveChoice', () => {
  it('starts a fresh session at s1 with AI hints off', () => {
    const session = createInitialSession();
    expect(session.currentSceneId).toBe('s1');
    expect(session.aiHintsEnabled).toBe(false);
    expect(session.attempts).toHaveLength(0);
  });

  it('records a correct answer and fills the channel', () => {
    const result = resolveChoice(createInitialSession(), HALF_QUESTION, 'q-half-b', 1000);
    expect(result.feedbackId).toBe('correct');
    expect(result.session.attempts).toHaveLength(1);
    expect(result.session.attempts[0]?.correct).toBe(true);
    expect(result.session.attempts[0]?.hintUsed).toBe(false);
    expect(result.session.worldFlags).toContain('channel_filled');
    expect(result.shouldOfferAiHint).toBe(false);
  });

  it('never offers an AI hint for a correct answer, even with AI enabled', () => {
    const session = { ...createInitialSession(), aiHintsEnabled: true };
    const result = resolveChoice(session, HALF_QUESTION, 'q-half-b', 1000);
    expect(result.feedbackId).toBe('correct');
    expect(result.shouldOfferAiHint).toBe(false);
  });

  it('diagnoses quarter_is_half without touching world state', () => {
    const result = resolveChoice(createInitialSession(), HALF_QUESTION, 'q-half-a', 1000);
    expect(result.feedbackId).toBe('quarter_is_half');
    expect(result.session.attempts[0]?.correct).toBe(false);
    expect(result.session.attempts[0]?.misconceptionId).toBe('quarter_is_half');
    expect(result.session.worldFlags).toHaveLength(0);
  });

  it('offers an AI hint for a diagnosed misconception only when AI is enabled', () => {
    const off = resolveChoice(createInitialSession(), HALF_QUESTION, 'q-half-a', 1000);
    expect(off.shouldOfferAiHint).toBe(false);
    const on = resolveChoice(
      { ...createInitialSession(), aiHintsEnabled: true },
      HALF_QUESTION,
      'q-half-a',
      1000,
    );
    expect(on.shouldOfferAiHint).toBe(true);
  });

  it('rejects unknown choice ids', () => {
    expect(() => resolveChoice(createInitialSession(), HALF_QUESTION, 'nope', 1000)).toThrow();
  });

  it('collapses duplicate fast clicks into one decision', () => {
    const first = resolveChoice(createInitialSession(), HALF_QUESTION, 'q-half-a', 1000);
    const second = resolveChoice(first.session, HALF_QUESTION, 'q-half-a', 1000);
    expect(second.feedbackId).toBe('duplicate_ignored');
    expect(second.session).toBe(first.session);
    expect(second.session.attempts).toHaveLength(1);
  });

  it('records a genuine second attempt after the click window', () => {
    const first = resolveChoice(createInitialSession(), HALF_QUESTION, 'q-half-a', 1000);
    const second = resolveChoice(first.session, HALF_QUESTION, 'q-half-a', 1000 + 600);
    expect(second.feedbackId).toBe('quarter_is_half');
    expect(second.session.attempts).toHaveLength(2);
  });

  it('marks retries as hint-assisted for mastery', () => {
    const first = resolveChoice(createInitialSession(), HALF_QUESTION, 'q-half-a', 1000);
    const second = resolveChoice(first.session, HALF_QUESTION, 'q-half-b', 2000);
    expect(second.session.attempts[1]?.hintUsed).toBe(true);
    expect(masteryForConcept(second.session.attempts, 'half')).toBe('after_hint');
  });

  it('distinguishes first-try mastery from no mastery', () => {
    const good = resolveChoice(createInitialSession(), HALF_QUESTION, 'q-half-b', 1000);
    expect(masteryForConcept(good.session.attempts, 'half')).toBe('first_try');
    const bad = resolveChoice(createInitialSession(), HALF_QUESTION, 'q-half-a', 1000);
    expect(masteryForConcept(bad.session.attempts, 'half')).toBe('not_yet');
    expect(masteryForConcept([], 'half')).toBe('unattempted');
  });

  it('completes only after a correct attempt', () => {
    const wrong = resolveChoice(createInitialSession(), HALF_QUESTION, 'q-half-a', 1000);
    expect(hasCompletedQuestions(wrong.session, ['q-half'])).toBe(false);
    const right = resolveChoice(wrong.session, HALF_QUESTION, 'q-half-b', 2000);
    expect(hasCompletedQuestions(right.session, ['q-half'])).toBe(true);
  });
});

describe('advanceScene', () => {
  it('moves s1 to s2 and completes s1', () => {
    const next = advanceScene(createInitialSession());
    expect(next.currentSceneId).toBe('s2');
    expect(next.completedSceneIds).toContain('s1');
  });

  it('walks s2 into s3 and holds at the terminal s6', () => {
    const atS2 = advanceScene(createInitialSession());
    const atS3 = advanceScene(atS2);
    expect(atS3.currentSceneId).toBe('s3');
    expect(atS3.completedSceneIds).toEqual(expect.arrayContaining(['s1', 's2']));
    const atS6 = { ...createInitialSession(), currentSceneId: 's6' };
    const again = advanceScene(atS6);
    expect(again.currentSceneId).toBe('s6');
    expect(again.completedSceneIds).toContain('s6');
  });

  it('loops s4 remediation back to the s3 valve', () => {
    const atS4 = { ...createInitialSession(), currentSceneId: 's4' };
    expect(advanceScene(atS4).currentSceneId).toBe('s3');
  });

  it('rejects unknown scenes', () => {
    const broken = { ...createInitialSession(), currentSceneId: 's99' };
    expect(() => advanceScene(broken)).toThrow();
  });
});

describe('gotoScene', () => {
  it('moves to a named scene and completes the current one', () => {
    const next = gotoScene(createInitialSession(), 's3');
    expect(next.currentSceneId).toBe('s3');
    expect(next.completedSceneIds).toContain('s1');
  });

  it('rejects unknown current or target scenes', () => {
    const broken = { ...createInitialSession(), currentSceneId: 's99' };
    expect(() => gotoScene(broken, 's2')).toThrow();
    expect(() => gotoScene(createInitialSession(), 's99')).toThrow();
  });

  it('walks the full graph: s1-s2-s3, s4 remediation, s5 pair, s6 celebration', () => {
    let session = createInitialSession();
    session = advanceScene(session);
    expect(session.currentSceneId).toBe('s2');
    session = gotoScene(session, sceneAfterAnswer(getQuestion('q-half'), true) as string);
    expect(session.currentSceneId).toBe('s3');
    session = gotoScene(session, sceneAfterAnswer(getQuestion('q-two-quarters'), false) as string);
    expect(session.currentSceneId).toBe('s4');
    session = advanceScene(session);
    expect(session.currentSceneId).toBe('s3');
    session = gotoScene(session, sceneAfterAnswer(getQuestion('q-two-quarters'), true) as string);
    expect(session.currentSceneId).toBe('s5');
    session = gotoScene(session, sceneAfterAnswer(getQuestion('q-distribute-sun'), true) as string);
    expect(session.currentSceneId).toBe('s5');
    session = gotoScene(session, sceneAfterAnswer(getQuestion('q-distribute-berry'), true) as string);
    expect(session.currentSceneId).toBe('s6');
    session = advanceScene(session);
    expect(session.currentSceneId).toBe('s6');
    expect(session.completedSceneIds).toEqual(expect.arrayContaining(['s1', 's2', 's3', 's4', 's5', 's6']));
  });
});

describe('sceneAfterAnswer', () => {
  it('sends correct answers forward and retries or remediates wrong ones', () => {
    const half = getQuestion('q-half');
    expect(sceneAfterAnswer(half, true)).toBe('s3');
    expect(sceneAfterAnswer(half, false)).toBeNull();
    const twoQuarters = getQuestion('q-two-quarters');
    expect(sceneAfterAnswer(twoQuarters, true)).toBe('s5');
    expect(sceneAfterAnswer(twoQuarters, false)).toBe('s4');
  });

  it('stays in s5 between its two distribution questions, then celebrates', () => {
    const sun = getQuestion('q-distribute-sun');
    expect(sceneAfterAnswer(sun, true)).toBe('s5');
    expect(sceneAfterAnswer(sun, false)).toBeNull();
    const berry = getQuestion('q-distribute-berry');
    expect(sceneAfterAnswer(berry, true)).toBe('s6');
    expect(sceneAfterAnswer(berry, false)).toBeNull();
  });
});

describe('world rewards and completion', () => {
  it('awards valve and garden flags for later questions', () => {
    const session = createInitialSession();
    const twoQuarters = resolveChoice(
      session,
      getQuestion('q-two-quarters'),
      'q-two-quarters-yes',
      1000,
    );
    expect(twoQuarters.session.worldFlags).toContain('valve_open');
    const sun = resolveChoice(
      twoQuarters.session,
      getQuestion('q-distribute-sun'),
      'q-distribute-sun-quarter',
      2000,
    );
    expect(sun.session.worldFlags).toContain('garden_restored');
  });

  it('completes only after every required question is correct', () => {
    const answers: Array<[string, string]> = [
      ['q-half', 'q-half-b'],
      ['q-two-quarters', 'q-two-quarters-yes'],
      ['q-distribute-sun', 'q-distribute-sun-quarter'],
      ['q-distribute-berry', 'q-distribute-berry-half'],
    ];
    let session = createInitialSession();
    let time = 1000;
    for (const [questionId, choiceId] of answers.slice(0, 3)) {
      session = resolveChoice(session, getQuestion(questionId), choiceId, time).session;
      time += 1000;
    }
    expect(hasCompletedQuestions(session, REQUIRED_QUESTION_IDS)).toBe(false);
    const [lastQuestion, lastChoice] = answers[3];
    session = resolveChoice(session, getQuestion(lastQuestion), lastChoice, time).session;
    expect(hasCompletedQuestions(session, REQUIRED_QUESTION_IDS)).toBe(true);
  });
});
