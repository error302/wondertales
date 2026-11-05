import { AUTHORED_HINTS } from '../../content/clockwork-garden/hints';
import type { ConceptId, MisconceptionId } from '../engine/types';

export interface WonderGuideRequest {
  conceptId: ConceptId;
  misconceptionId: MisconceptionId | null;
  attemptCount: number;
}

export type ParsedWonderGuideRequest =
  | { ok: true; request: WonderGuideRequest }
  | { ok: false; error: string };

const CONCEPT_IDS: readonly ConceptId[] = ['half', 'quarter', 'two_quarters_equal_half'];
const MISCONCEPTION_IDS: readonly MisconceptionId[] = [
  'quarter_is_half',
  'two_quarters_not_half',
  'wrong_distribution',
];

/**
 * Strict allowlist validation. Only codes cross the wire — never free text,
 * names, or any other child-provided content.
 */
export function parseWonderGuideRequest(value: unknown): ParsedWonderGuideRequest {
  if (typeof value !== 'object' || value === null) {
    return { ok: false, error: 'Request must be a JSON object.' };
  }
  const candidate = value as Record<string, unknown>;
  if (!CONCEPT_IDS.includes(candidate.conceptId as ConceptId)) {
    return { ok: false, error: 'Unknown conceptId.' };
  }
  const misconceptionId = candidate.misconceptionId ?? null;
  if (misconceptionId !== null && !MISCONCEPTION_IDS.includes(misconceptionId as MisconceptionId)) {
    return { ok: false, error: 'Unknown misconceptionId.' };
  }
  if (
    typeof candidate.attemptCount !== 'number' ||
    !Number.isInteger(candidate.attemptCount) ||
    candidate.attemptCount < 1 ||
    candidate.attemptCount > 50
  ) {
    return { ok: false, error: 'attemptCount must be an integer from 1 to 50.' };
  }
  return {
    ok: true,
    request: {
      conceptId: candidate.conceptId as ConceptId,
      misconceptionId: misconceptionId as MisconceptionId | null,
      attemptCount: candidate.attemptCount,
    },
  };
}

const CONCEPT_RECAP: Record<ConceptId, string> = {
  half: 'One half means the water reaches exactly the higher line — two equal halves fill the tank.',
  quarter: 'One quarter is one of four equal shares — a smaller pour than one half.',
  two_quarters_equal_half: 'Two quarter buckets poured together reach exactly the half line.',
};

/**
 * Deterministic demo explanation. Clearly labeled `mock-guide` at the API
 * boundary: this is authored text, not model output.
 */
export function mockExplanation(request: WonderGuideRequest): string {
  const hint = request.misconceptionId ? AUTHORED_HINTS[request.misconceptionId].dialogue : null;
  const patience =
    request.attemptCount <= 1
      ? 'Good first try — let us think it through together.'
      : `Try ${request.attemptCount}: you are getting closer with every pour.`;
  const parts = [
    patience,
    hint,
    `Remember: ${CONCEPT_RECAP[request.conceptId]}`,
    'Point at each vessel and ask: does its water reach the needed line?',
  ].filter((part): part is string => typeof part === 'string' && part.length > 0);
  return parts.join(' ').slice(0, 600);
}

type RateStore = Map<string, { day: string; count: number }>;
const defaultStore: RateStore = new Map();

/** Fixed-window daily budget per client key. Returns true when allowed. */
export function checkRateLimit(
  clientKey: string,
  day: string,
  cap: number,
  store: RateStore = defaultStore,
): boolean {
  const key = clientKey.length > 0 ? clientKey : 'local';
  const entry = store.get(key);
  if (!entry || entry.day !== day) {
    store.set(key, { day, count: 1 });
    return true;
  }
  if (entry.count >= cap) {
    return false;
  }
  entry.count += 1;
  return true;
}
