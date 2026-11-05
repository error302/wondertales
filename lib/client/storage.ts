'use client';

/** Typed on-device storage. Nothing here ever leaves the browser. */

export type CompanionId = 'Milo' | 'Nia';
export type AgeBand = '6-8' | '9-12';

export interface ChildProfile {
  displayName: string;
  ageBand: AgeBand;
}

const COMPANION_KEY = 'wondertales:companion:v1';
const WORLD_KEY = 'wondertales:world:v1';
const PROFILE_KEY = 'wondertales:profile:v1';
const AI_ENABLED_KEY = 'wondertales:ai-enabled:v1';
const SESSION_KEY = 'wondertales:clockwork-garden:session:v1';

const ALL_KEYS = [COMPANION_KEY, WORLD_KEY, PROFILE_KEY, AI_ENABLED_KEY, SESSION_KEY];

function read(key: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private browsing: the app still works; nothing is kept.
  }
}

export function getCompanion(): CompanionId | null {
  const value = read(COMPANION_KEY);
  return value === 'Milo' || value === 'Nia' ? value : null;
}

export function setCompanion(companion: CompanionId): void {
  write(COMPANION_KEY, companion);
}

export function getWorldId(): string | null {
  return read(WORLD_KEY);
}

export function setWorldId(worldId: string): void {
  write(WORLD_KEY, worldId);
}

export function getProfile(): ChildProfile | null {
  const raw = read(PROFILE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<ChildProfile>;
    if (typeof parsed.displayName !== 'string') {
      return null;
    }
    if (parsed.ageBand !== '6-8' && parsed.ageBand !== '9-12') {
      return null;
    }
    return { displayName: parsed.displayName.slice(0, 40), ageBand: parsed.ageBand };
  } catch {
    return null;
  }
}

export function setProfile(profile: ChildProfile): void {
  write(PROFILE_KEY, JSON.stringify(profile));
}

export function getAiEnabled(): boolean {
  return read(AI_ENABLED_KEY) === 'on';
}

export function setAiEnabled(enabled: boolean): void {
  write(AI_ENABLED_KEY, enabled ? 'on' : 'off');
}

export function clearAllWonderTalesData(): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    for (const key of ALL_KEYS) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Nothing stored; nothing to clear.
  }
}
