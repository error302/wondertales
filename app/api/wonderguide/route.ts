import { NextResponse } from 'next/server';
import { getServerEnv } from '../../../lib/config/server-env';
import {
  checkRateLimit,
  mockExplanation,
  parseWonderGuideRequest,
} from '../../../lib/server/wonderguide';

/**
 * WonderGuide hint endpoint. Mock-first: serves deterministic demo
 * explanations until a live provider is configured and approved.
 * No free text is accepted; no PII is read or returned.
 */
export async function POST(request: Request) {
  const env = getServerEnv();
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  const parsed = parseWonderGuideRequest(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const forwarded = request.headers.get('x-forwarded-for');
  const clientKey = forwarded?.split(',')[0]?.trim() || 'local';
  const today = new Date().toISOString().slice(0, 10);
  if (!checkRateLimit(clientKey, today, env.dailyRequestCap)) {
    return NextResponse.json(
      { error: 'Daily hint budget used up. The garden will wait for tomorrow.' },
      { status: 429 },
    );
  }
  return NextResponse.json({
    explanation: mockExplanation(parsed.request),
    source: 'mock-guide',
    misconceptionId: parsed.request.misconceptionId,
  });
}
