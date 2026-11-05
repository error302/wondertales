import { describe, expect, it } from 'vitest';
import { isNarrationSupported, speak, stopSpeaking } from '../../lib/client/narration';

describe('narration', () => {
  it('reports unsupported outside a browser and never throws', () => {
    expect(isNarrationSupported()).toBe(false);
    expect(() => speak('Hello garden')).not.toThrow();
    expect(() => stopSpeaking()).not.toThrow();
  });
});
