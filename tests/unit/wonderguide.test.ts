import { describe, expect, it } from 'vitest';
import {
  checkRateLimit,
  mockExplanation,
  parseWonderGuideRequest,
} from '../../lib/server/wonderguide';

describe('parseWonderGuideRequest', () => {
  it('accepts a diagnosed misconception with codes only', () => {
    const parsed = parseWonderGuideRequest({
      conceptId: 'half',
      misconceptionId: 'quarter_is_half',
      attemptCount: 2,
    });
    expect(parsed).toEqual({
      ok: true,
      request: { conceptId: 'half', misconceptionId: 'quarter_is_half', attemptCount: 2 },
    });
  });

  it('accepts a null misconception for generic retries', () => {
    const parsed = parseWonderGuideRequest({
      conceptId: 'quarter',
      misconceptionId: null,
      attemptCount: 1,
    });
    expect(parsed.ok).toBe(true);
  });

  it('rejects unknown codes, bad counts, and non-objects', () => {
    expect(parseWonderGuideRequest(null).ok).toBe(false);
    expect(parseWonderGuideRequest('half').ok).toBe(false);
    expect(
      parseWonderGuideRequest({ conceptId: 'nope', misconceptionId: null, attemptCount: 1 }).ok,
    ).toBe(false);
    expect(
      parseWonderGuideRequest({ conceptId: 'half', misconceptionId: 'nope', attemptCount: 1 }).ok,
    ).toBe(false);
    for (const attemptCount of [0, 51, 1.5, '2', null]) {
      expect(
        parseWonderGuideRequest({ conceptId: 'half', misconceptionId: null, attemptCount }).ok,
      ).toBe(false);
    }
  });
});

describe('mockExplanation', () => {
  it('is deterministic, capped, and grounded in the authored hint', () => {
    const request = { conceptId: 'half' as const, misconceptionId: 'quarter_is_half' as const, attemptCount: 1 };
    const first = mockExplanation(request);
    const second = mockExplanation(request);
    expect(first).toBe(second);
    expect(first.length).toBeGreaterThan(20);
    expect(first.length).toBeLessThanOrEqual(600);
    expect(first).toContain('one quarter is smaller than one half');
  });

  it('answers generic retries without a misconception', () => {
    const text = mockExplanation({ conceptId: 'quarter', misconceptionId: null, attemptCount: 3 });
    expect(text).toContain('four equal shares');
    expect(text).toContain('Try 3');
  });
});

describe('checkRateLimit', () => {
  it('allows up to the cap, then denies until the next day', () => {
    const store = new Map();
    expect(checkRateLimit('kid-device', '2026-11-05', 2, store)).toBe(true);
    expect(checkRateLimit('kid-device', '2026-11-05', 2, store)).toBe(true);
    expect(checkRateLimit('kid-device', '2026-11-05', 2, store)).toBe(false);
    expect(checkRateLimit('kid-device', '2026-11-06', 2, store)).toBe(true);
  });

  it('isolates clients and treats blank keys as local', () => {
    const store = new Map();
    expect(checkRateLimit('', '2026-11-05', 1, store)).toBe(true);
    expect(checkRateLimit('', '2026-11-05', 1, store)).toBe(false);
    expect(checkRateLimit('other', '2026-11-05', 1, store)).toBe(true);
  });
});
