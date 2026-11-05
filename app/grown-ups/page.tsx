'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StoryStage } from '../../components/adventure/StoryStage';
import { QUESTIONS, REQUIRED_QUESTION_IDS } from '../../content/clockwork-garden/questions';
import { getWorld } from '../../content/worlds';
import {
  clearAllWonderTalesData,
  getAiEnabled,
  getCompanion,
  getProfile,
  getWorldId,
  setAiEnabled,
  setProfile,
  type AgeBand,
  type ChildProfile,
} from '../../lib/client/storage';
import { hasCompletedQuestions, masteryForConcept } from '../../lib/engine/mastery';
import { createInitialSession } from '../../lib/engine/reducer';
import { parseSessionStrict } from '../../lib/engine/validation';
import type { ConceptId, StorySession } from '../../lib/engine/types';

const SESSION_KEY = 'wondertales:clockwork-garden:session:v1';

const CONCEPT_LABELS: Record<ConceptId, string> = {
  half: 'Finding one-half',
  quarter: 'Finding one-quarter',
  two_quarters_equal_half: 'Two quarters make one half',
};

function loadSession(): StorySession {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return createInitialSession();
    }
    return parseSessionStrict(JSON.parse(raw) as unknown) ?? createInitialSession();
  } catch {
    return createInitialSession();
  }
}

export default function GrownUpsPage() {
  const [profile, setProfileState] = useState<ChildProfile | null>(null);
  const [nameDraft, setNameDraft] = useState('');
  const [bandDraft, setBandDraft] = useState<AgeBand>('6-8');
  const [session, setSession] = useState<StorySession>(() => createInitialSession());
  const [companion, setCompanionState] = useState<string | null>(null);
  const [worldName, setWorldName] = useState<string | null>(null);
  const [aiEnabled, setAiEnabledState] = useState(false);
  const [savedNote, setSavedNote] = useState('');

  useEffect(() => {
    const stored = getProfile();
    setProfileState(stored);
    if (stored) {
      setNameDraft(stored.displayName);
      setBandDraft(stored.ageBand);
    }
    setSession(loadSession());
    setCompanionState(getCompanion());
    const worldId = getWorldId();
    setWorldName(worldId ? (getWorld(worldId)?.name ?? null) : null);
    setAiEnabledState(getAiEnabled());
  }, []);

  const saveProfile = () => {
    const next: ChildProfile = { displayName: nameDraft.trim().slice(0, 40), ageBand: bandDraft };
    setProfile(next);
    setProfileState(next);
    setSavedNote('Saved on this device.');
  };

  const toggleAi = () => {
    const next = !aiEnabled;
    setAiEnabled(next);
    setAiEnabledState(next);
  };

  const clearAll = () => {
    if (window.confirm('Remove all WonderTales data from this device? This cannot be undone.')) {
      clearAllWonderTalesData();
      setProfileState(null);
      setNameDraft('');
      setSession(createInitialSession());
      setCompanionState(null);
      setWorldName(null);
      setAiEnabledState(false);
      setSavedNote('All data removed from this device.');
    }
  };

  const concepts: ConceptId[] = Array.from(new Set(QUESTIONS.map((entry) => entry.conceptId)));
  const solved = REQUIRED_QUESTION_IDS.filter((id) =>
    session.attempts.some((attempt) => attempt.questionId === id && attempt.correct),
  ).length;
  const complete = hasCompletedQuestions(session, REQUIRED_QUESTION_IDS);

  return (
    <StoryStage eyebrow="For grown-ups" title="Learning dashboard">
      <div className="space-y-6">
        <p className="max-w-xl text-lg leading-relaxed">
          Everything below lives only in this browser. WonderTales has no accounts and
          sends nothing anywhere{aiEnabled ? ' — except demo hint previews when tapped' : ''}.
        </p>

        <section aria-label="Child profile" className="rounded-3xl bg-white p-5 shadow-md sm:p-6">
          <h2 className="font-story text-xl font-bold text-garden-900">Child profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-garden-800">First name or nickname</span>
              <input
                type="text"
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                maxLength={40}
                placeholder="e.g. Amara"
                className="mt-1 min-h-[48px] w-full rounded-2xl border-2 border-garden-200 px-4 font-semibold text-ink"
              />
            </label>
            <fieldset>
              <legend className="text-sm font-bold text-garden-800">Age band</legend>
              <div className="mt-1 flex gap-3">
                {(['6-8', '9-12'] as const).map((band) => (
                  <label
                    key={band}
                    className={`inline-flex min-h-[48px] flex-1 cursor-pointer items-center justify-center rounded-2xl border-2 px-4 font-bold ${
                      bandDraft === band
                        ? 'border-garden-700 bg-garden-700 text-white'
                        : 'border-garden-200 text-garden-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="age-band"
                      value={band}
                      checked={bandDraft === band}
                      onChange={() => setBandDraft(band)}
                      className="sr-only"
                    />
                    Ages {band}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={saveProfile}
              className="min-h-[48px] rounded-full bg-garden-700 px-6 font-bold text-white hover:bg-garden-600"
            >
              Save profile
            </button>
            {savedNote && (
              <p role="status" className="text-sm font-semibold text-garden-700">
                {savedNote}
              </p>
            )}
          </div>
          {profile && (
            <p className="mt-3 leading-relaxed">
              Playing as <strong>{profile.displayName || 'Unnamed explorer'}</strong> (ages{' '}
              {profile.ageBand})
              {companion ? `, guided by ${companion}` : ''}
              {worldName ? ` in ${worldName}` : ''}.
            </p>
          )}
        </section>

        <section aria-label="Learning progress" className="rounded-3xl bg-white p-5 shadow-md sm:p-6">
          <h2 className="font-story text-xl font-bold text-garden-900">Learning progress</h2>
          <p className="mt-2 leading-relaxed">
            {complete
              ? `Adventure complete: all ${REQUIRED_QUESTION_IDS.length} puzzles solved in ${session.attempts.length} tries.`
              : `${solved} of ${REQUIRED_QUESTION_IDS.length} puzzles solved · ${session.attempts.length} tries so far.`}
          </p>
          <ul className="mt-3 space-y-2">
            {concepts.map((conceptId) => (
              <li
                key={conceptId}
                className="flex items-center justify-between gap-3 rounded-2xl bg-parchment px-4 py-3"
              >
                <span className="font-semibold text-garden-900">{CONCEPT_LABELS[conceptId]}</span>
                <span className="text-sm font-bold text-garden-700">
                  {masteryForConcept(session.attempts, conceptId).replace('_', ' ')}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="AI preview" className="rounded-3xl bg-white p-5 shadow-md sm:p-6">
          <h2 className="font-story text-xl font-bold text-garden-900">WonderGuide preview</h2>
          <p className="mt-2 leading-relaxed">
            An opt-in hint companion. Today it serves clearly labeled demo explanations from
            this site&apos;s own server — no AI model is connected. The adventure is fully
            playable with it off.
          </p>
          <button
            type="button"
            role="switch"
            aria-checked={aiEnabled}
            onClick={toggleAi}
            className={`mt-4 inline-flex min-h-[48px] items-center rounded-full px-6 font-bold ${
              aiEnabled ? 'bg-garden-700 text-white' : 'bg-parchment text-garden-800'
            }`}
          >
            {aiEnabled ? 'Preview on' : 'Preview off'}
          </button>
        </section>

        <section aria-label="Privacy" className="rounded-3xl bg-garden-900 p-5 text-garden-50 sm:p-6">
          <h2 className="font-story text-xl font-bold">Privacy</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
            <li>No accounts, ads, analytics, or tracking.</li>
            <li>Profile, progress, and settings stay in this browser.</li>
            <li>Demo hint previews send only a concept code and try count — never a name.</li>
          </ul>
          <button
            type="button"
            onClick={clearAll}
            className="mt-4 inline-flex min-h-[48px] items-center rounded-full border-2 border-white px-6 font-bold text-white hover:bg-garden-700"
          >
            Remove all data from this device
          </button>
        </section>

        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center rounded-full border-2 border-garden-700 px-6 font-bold text-garden-800"
        >
          Back to the start
        </Link>
      </div>
    </StoryStage>
  );
}
