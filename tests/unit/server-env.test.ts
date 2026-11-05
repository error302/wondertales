import { describe, expect, it } from 'vitest';
import { getServerEnv, isAiConfigured } from '../../lib/config/server-env';

describe('server env guard', () => {
  it('defaults to AI off with no key', () => {
    const env = getServerEnv({});
    expect(env.metaApiKey).toBeNull();
    expect(env.wonderGuideEnabled).toBe(false);
    expect(env.dailyRequestCap).toBe(50);
    expect(env.metaModel).toBe('muse-spark-1.3');
    expect(isAiConfigured(env)).toBe(false);
  });

  it('parses caps and requires both flag and key', () => {
    expect(getServerEnv({ WONDERGUIDE_DAILY_REQUEST_CAP: '12' }).dailyRequestCap).toBe(12);
    expect(getServerEnv({ WONDERGUIDE_DAILY_REQUEST_CAP: 'junk' }).dailyRequestCap).toBe(50);
    expect(isAiConfigured(getServerEnv({ WONDERGUIDE_ENABLED: 'true' }))).toBe(false);
    expect(
      isAiConfigured(getServerEnv({ WONDERGUIDE_ENABLED: 'true', META_API_KEY: 'test-key' })),
    ).toBe(true);
  });
});
