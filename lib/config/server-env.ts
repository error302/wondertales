export interface ServerEnv {
  metaApiKey: string | null;
  metaModel: string;
  wonderGuideEnabled: boolean;
  dailyRequestCap: number;
}

const DEFAULT_MODEL = 'muse-spark-1.3';
const DEFAULT_DAILY_CAP = 50;

/**
 * Server-only configuration guard. Throws in the browser so secrets can never
 * be read from client bundles; import only from server routes/components.
 */
export function getServerEnv(env: Record<string, string | undefined> = process.env): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv must only be called on the server');
  }
  const cap = Number.parseInt(env.WONDERGUIDE_DAILY_REQUEST_CAP ?? '', 10);
  return {
    metaApiKey: env.META_API_KEY && env.META_API_KEY.length > 0 ? env.META_API_KEY : null,
    metaModel: env.META_MODEL && env.META_MODEL.length > 0 ? env.META_MODEL : DEFAULT_MODEL,
    wonderGuideEnabled: env.WONDERGUIDE_ENABLED === 'true',
    dailyRequestCap: Number.isFinite(cap) && cap > 0 ? cap : DEFAULT_DAILY_CAP,
  };
}

/** The AI provider is usable only when explicitly enabled and a key is configured. */
export function isAiConfigured(serverEnv: ServerEnv): boolean {
  return serverEnv.wonderGuideEnabled && serverEnv.metaApiKey !== null;
}
