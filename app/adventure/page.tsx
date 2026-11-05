'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChoicePanel } from '../../components/adventure/ChoicePanel';
import { DialogueBox } from '../../components/adventure/DialogueBox';
import { FeedbackPanel } from '../../components/adventure/FeedbackPanel';
import { ProgressPanel } from '../../components/adventure/ProgressPanel';
import { StoryStage } from '../../components/adventure/StoryStage';
import { WaterPuzzle } from '../../components/adventure/WaterPuzzle';
import { DIALOGUE } from '../../content/clockwork-garden/dialogue';
import { AUTHORED_HINTS, GENERIC_RETRY_HINT } from '../../content/clockwork-garden/hints';
import { QUESTIONS, REQUIRED_QUESTION_IDS, getQuestion } from '../../content/clockwork-garden/questions';
import { getScene } from '../../content/clockwork-garden/scenes';
import { getAiEnabled, getCompanion } from '../../lib/client/storage';
import { hasCompletedQuestions, masteryForConcept, type MasteryLevel } from '../../lib/engine/mastery';
import { createInitialSession, resolveChoice, type FeedbackId } from '../../lib/engine/reducer';
import { advanceScene, gotoScene, sceneAfterAnswer } from '../../lib/engine/transitions';
import { parseSessionStrict } from '../../lib/engine/validation';
import { levelForVisual, variantForVisual } from '../../lib/engine/water-visuals';
import type { ConceptId, Question, StorySession } from '../../lib/engine/types';

type Phase = 'dialogue' | 'question' | 'feedback' | 'complete';

interface LastAnswer {
  questionId: string;
  choiceId: string;
  feedbackId: FeedbackId;
}

const SESSION_STORAGE_KEY = 'wondertales:clockwork-garden:session:v1';

const DONE_LABELS: Record<string, string> = {
  s1: 'Enter the Reservoir',
  s2: 'Look at the tanks',
  s3: 'Try the valve',
  s4: 'Try the valve again',
  s5: 'Share the water',
  s6: 'Celebrate',
};

const SUCCESS_COPY: Record<string, { title: string; speaker: string; message: string; next: string }> = {
  'q-half': {
    title: 'The channel fills!',
    speaker: 'Milo',
    message: 'Exactly half! Water rushes through the channel and the first flowers lift their heads.',
    next: 'Follow the channel',
  },
  'q-two-quarters': {
    title: 'The valve swings open!',
    speaker: 'Milo',
    message: 'Two quarters really do make one half! The valve clicks open and water races toward the garden.',
    next: 'Open the garden gates',
  },
  'q-distribute-sun': {
    title: 'Sunflowers watered!',
    speaker: 'Nia',
    message: 'Exactly one quarter for each sunflower — a fair share for every plant. Now the berry bushes are thirsty.',
    next: 'Water the berry bushes',
  },
  'q-distribute-berry': {
    title: 'The garden blooms!',
    speaker: 'Narrator',
    message: 'Exactly one half for the berry bushes. Water flows everywhere it should!',
    next: 'Celebrate',
  },
};

const CONCEPT_LABELS: Record<ConceptId, string> = {
  half: 'Finding one-half',
  quarter: 'Finding one-quarter',
  two_quarters_equal_half: 'Two quarters make one half',
};

function masteryLabel(level: MasteryLevel): string {
  switch (level) {
    case 'first_try':
      return 'First try — brilliant!';
    case 'after_hint':
      return 'Learned with a little help';
    case 'not_yet':
      return 'Still sprouting';
    case 'unattempted':
      return 'Not yet explored';
  }
}

function loadSession(): StorySession {
  if (typeof window === 'undefined') {
    return createInitialSession();
  }
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return createInitialSession();
    }
    return parseSessionStrict(JSON.parse(raw) as unknown) ?? createInitialSession();
  } catch {
    return createInitialSession();
  }
}

/** First question in a scene without a correct attempt yet, or null when done. */
function firstUnansweredQuestionId(session: StorySession, sceneId: string): string | null {
  const scene = getScene(sceneId);
  for (const questionId of scene.questionIds) {
    const solved = session.attempts.some(
      (attempt) => attempt.questionId === questionId && attempt.correct,
    );
    if (!solved) {
      return questionId;
    }
  }
  return null;
}

function successCopy(questionId: string): { title: string; speaker: string; message: string; next: string } {
  const copy = SUCCESS_COPY[questionId];
  if (!copy) {
    throw new Error(`Missing success copy for question "${questionId}"`);
  }
  return copy;
}

export default function AdventurePage() {
  const [session, setSession] = useState<StorySession>(() => createInitialSession());
  const [phase, setPhase] = useState<Phase>('dialogue');
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [lastAnswer, setLastAnswer] = useState<LastAnswer | null>(null);
  const [companion, setCompanionState] = useState<string | null>(null);
  const [aiEnabled, setAiEnabledState] = useState(false);
  const [guideStatus, setGuideStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [guideText, setGuideText] = useState('');
  const loadedStored = useRef(false);

  // Load stored progress after mount so the server and client render the same first paint.
  useEffect(() => {
    setSession(loadSession());
    setCompanionState(getCompanion());
    setAiEnabledState(getAiEnabled());
    loadedStored.current = true;
  }, []);

  useEffect(() => {
    setGuideStatus('idle');
    setGuideText('');
  }, [lastAnswer]);

  useEffect(() => {
    if (!loadedStored.current) {
      return;
    }
    try {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Private browsing: the adventure still plays; progress just is not kept.
    }
  }, [session]);

  const scene = getScene(session.currentSceneId);
  const lines = DIALOGUE[scene.id] ?? [];
  const question: Question | null = questionId ? getQuestion(questionId) : null;
  const answeredQuestion: Question | null = lastAnswer ? getQuestion(lastAnswer.questionId) : null;

  const handleDialogueDone = () => {
    const pending = firstUnansweredQuestionId(session, scene.id);
    if (pending) {
      setQuestionId(pending);
      setLastAnswer(null);
      setPhase('question');
      return;
    }
    if (!scene.nextSceneId) {
      setSession((current) => advanceScene(current));
      setPhase('complete');
      return;
    }
    setSession((current) => advanceScene(current));
    setQuestionId(null);
    setPhase('dialogue');
  };

  const handleChoose = (choiceId: string) => {
    if (!question || phase !== 'question') {
      return;
    }
    const result = resolveChoice(session, question, choiceId, Date.now());
    if (result.feedbackId === 'duplicate_ignored') {
      return;
    }
    setSession(result.session);
    setLastAnswer({ questionId: question.id, choiceId, feedbackId: result.feedbackId });
    setPhase('feedback');
  };

  const handleCorrectContinue = () => {
    if (!answeredQuestion || !lastAnswer || lastAnswer.feedbackId !== 'correct') {
      return;
    }
    const next = sceneAfterAnswer(answeredQuestion, true);
    if (next === session.currentSceneId) {
      const following = firstUnansweredQuestionId(session, scene.id);
      if (!following) {
        setSession((current) => advanceScene(current));
        setQuestionId(null);
        setPhase('dialogue');
        return;
      }
      setQuestionId(following);
      setLastAnswer(null);
      setPhase('question');
      return;
    }
    if (next === null) {
      // Authored data always routes correct answers onward; retry in place if not.
      setLastAnswer(null);
      setPhase('question');
      return;
    }
    setSession((current) => gotoScene(current, next));
    setQuestionId(null);
    setLastAnswer(null);
    setPhase('dialogue');
  };

  const handleWrongContinue = () => {
    if (!answeredQuestion || !lastAnswer || lastAnswer.feedbackId === 'correct') {
      return;
    }
    const next = sceneAfterAnswer(answeredQuestion, false);
    if (next === null) {
      setLastAnswer(null);
      setPhase('question');
      return;
    }
    setSession((current) => gotoScene(current, next));
    setQuestionId(null);
    setLastAnswer(null);
    setPhase('dialogue');
  };

  const handleAskGuide = async () => {
    if (!answeredQuestion || guideStatus === 'loading') {
      return;
    }
    setGuideStatus('loading');
    try {
      const attemptCount = session.attempts.filter(
        (attempt) => attempt.questionId === answeredQuestion.id,
      ).length;
      const misconceptionId =
        lastAnswer &&
        lastAnswer.feedbackId !== 'correct' &&
        lastAnswer.feedbackId !== 'incorrect' &&
        lastAnswer.feedbackId !== 'duplicate_ignored'
          ? lastAnswer.feedbackId
          : null;
      const response = await fetch('/api/wonderguide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId: answeredQuestion.conceptId,
          misconceptionId,
          attemptCount: Math.max(1, attemptCount),
        }),
      });
      if (!response.ok) {
        setGuideStatus('error');
        return;
      }
      const data = (await response.json()) as { explanation?: unknown };
      if (typeof data.explanation !== 'string' || data.explanation.length === 0) {
        setGuideStatus('error');
        return;
      }
      setGuideText(data.explanation.slice(0, 600));
      setGuideStatus('done');
    } catch {
      setGuideStatus('error');
    }
  };

  const handleStartOver = () => {
    if (window.confirm('Start the adventure over? Your garden progress will reset.')) {
      try {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // Nothing stored; starting fresh anyway.
      }
      setSession(createInitialSession());
      setQuestionId(null);
      setLastAnswer(null);
      setPhase('dialogue');
    }
  };

  if (phase === 'complete') {
    const concepts: ConceptId[] = Array.from(new Set(QUESTIONS.map((entry) => entry.conceptId)));
    const tries = session.attempts.length;
    const allSolved = hasCompletedQuestions(session, REQUIRED_QUESTION_IDS);
    return (
      <StoryStage eyebrow="Adventure complete" title="The Clockwork Garden blooms!">
        <div className="space-y-6">
          <ProgressPanel session={session} sceneTitle="Celebration" companion={companion} />
          <section
            aria-label="What you learned"
            className="rounded-3xl bg-white p-5 shadow-md sm:p-6"
          >
            <h2 className="font-story text-xl font-bold text-garden-900">What you learned</h2>
            <ul className="mt-3 space-y-2">
              {concepts.map((conceptId) => (
                <li
                  key={conceptId}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-parchment px-4 py-3"
                >
                  <span className="font-semibold text-garden-900">{CONCEPT_LABELS[conceptId]}</span>
                  <span className="text-sm font-bold text-garden-700">
                    {masteryLabel(masteryForConcept(session.attempts, conceptId))}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 leading-relaxed">
              {allSolved
                ? `You solved all ${REQUIRED_QUESTION_IDS.length} water puzzles in ${tries} ${
                    tries === 1 ? 'try' : 'tries'
                  }. The garden is yours, gardener.`
                : 'You reached the celebration! Replay any puzzle to keep practicing.'}
            </p>
          </section>
          <FeedbackPanel
            tone="success"
            title="You did it, gardener!"
            speaker="Nia"
            message="Half, quarter — and two quarters make one half! You reasoned it out, drop by drop."
            primary={{ label: 'Play again', onClick: handleStartOver }}
          />
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="inline-flex min-h-[48px] items-center rounded-full border-2 border-garden-700 px-6 font-bold text-garden-800"
            >
              Back to the garden gate
            </Link>
            <p className="text-sm font-semibold text-garden-800">
              Next adventure: coming soon.
            </p>
          </div>
        </div>
      </StoryStage>
    );
  }

  const wrongCopy =
    lastAnswer &&
    lastAnswer.feedbackId !== 'correct' &&
    lastAnswer.feedbackId !== 'duplicate_ignored'
      ? lastAnswer.feedbackId
      : null;
  const hint =
    wrongCopy && wrongCopy !== 'incorrect' ? AUTHORED_HINTS[wrongCopy] : GENERIC_RETRY_HINT;
  const chosenOption = answeredQuestion
    ? (answeredQuestion.options.find((option) => option.id === lastAnswer?.choiceId) ?? null)
    : null;
  const neededOption = answeredQuestion
    ? (answeredQuestion.options.find((option) => option.id === answeredQuestion.correctChoiceId) ?? null)
    : null;
  const wrongBranches = answeredQuestion ? sceneAfterAnswer(answeredQuestion, false) !== null : false;

  return (
    <StoryStage eyebrow={`Scene ${scene.id} · The Clockwork Garden`} title={scene.title}>
      <div className="space-y-6">
        <ProgressPanel session={session} sceneTitle={scene.title} companion={companion} />
        {phase === 'dialogue' && (
          <DialogueBox
            key={scene.id}
            lines={lines}
            doneLabel={DONE_LABELS[scene.id] ?? 'Continue'}
            onDone={handleDialogueDone}
          />
        )}
        {phase === 'question' && question && (
          <ChoicePanel question={question} disabled={false} onChoose={handleChoose} />
        )}
        {phase === 'feedback' && answeredQuestion && lastAnswer?.feedbackId === 'correct' && (
          <FeedbackPanel
            tone="success"
            title={successCopy(answeredQuestion.id).title}
            speaker={successCopy(answeredQuestion.id).speaker}
            message={successCopy(answeredQuestion.id).message}
            visual={
              neededOption ? (
                <WaterPuzzle
                  level={levelForVisual(neededOption.visualId)}
                  variant={variantForVisual(neededOption.visualId)}
                  size="lg"
                  label={`${neededOption.label} showing the exact fair share`}
                />
              ) : undefined
            }
            primary={{ label: successCopy(answeredQuestion.id).next, onClick: handleCorrectContinue }}
          />
        )}
        {phase === 'feedback' && answeredQuestion && wrongCopy && chosenOption && neededOption && (
          <FeedbackPanel
            tone="oops"
            title={wrongBranches ? 'The channel sputters...' : "Let's look closer..."}
            speaker={hint.speaker}
            message={hint.dialogue}
            visual={
              <div className="flex flex-wrap items-end justify-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <WaterPuzzle
                    level={levelForVisual(chosenOption.visualId)}
                    variant={variantForVisual(chosenOption.visualId)}
                    label={`Your pour: ${chosenOption.label}`}
                  />
                  <p className="text-sm font-semibold">Your pour</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <WaterPuzzle
                    level={levelForVisual(neededOption.visualId)}
                    variant={variantForVisual(neededOption.visualId)}
                    label={`Needed: ${neededOption.label}`}
                  />
                  <p className="text-sm font-semibold">Needed</p>
                </div>
              </div>
            }
            primary={
              wrongBranches
                ? { label: 'See what happened', onClick: handleWrongContinue }
                : { label: 'Try again', onClick: handleWrongContinue }
            }
          />
        )}
        {phase === 'feedback' && answeredQuestion && wrongCopy && aiEnabled && (
          <section
            aria-label="WonderGuide preview"
            className="rounded-3xl bg-white p-5 shadow-md sm:p-6"
          >
            <h2 className="font-story text-xl font-bold text-garden-900">WonderGuide preview</h2>
            <p className="mt-1 text-sm font-semibold text-garden-700">
              Demo explanations from this site — no AI connected.
            </p>
            {guideStatus === 'done' ? (
              <p role="status" className="mt-3 text-lg leading-relaxed">
                {guideText}
              </p>
            ) : guideStatus === 'error' ? (
              <p role="status" className="mt-3 text-lg leading-relaxed">
                WonderGuide is resting right now — the hint above still shows the way.
              </p>
            ) : (
              <button
                type="button"
                onClick={handleAskGuide}
                disabled={guideStatus === 'loading'}
                className="mt-3 inline-flex min-h-[48px] items-center rounded-full bg-brass-700 px-6 font-bold text-white hover:bg-brass-800 disabled:opacity-60"
              >
                {guideStatus === 'loading' ? 'Thinking...' : 'Ask WonderGuide'}
              </button>
            )}
          </section>
        )}
      </div>
    </StoryStage>
  );
}
