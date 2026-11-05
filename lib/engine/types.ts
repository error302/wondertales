import type { Rational } from './rationals';

export type ConceptId = 'half' | 'quarter' | 'two_quarters_equal_half';

export type MisconceptionId = 'quarter_is_half' | 'two_quarters_not_half' | 'wrong_distribution';

export type WorldFlag = 'valve_open' | 'channel_filled' | 'garden_restored';

export type SpeakerId = 'Milo' | 'Nia' | 'Narrator';

export interface LearningAttempt {
  questionId: string;
  conceptId: ConceptId;
  choiceId: string;
  correct: boolean;
  misconceptionId?: MisconceptionId;
  hintUsed: boolean;
  timestamp: number;
}

export interface StorySession {
  schemaVersion: 1;
  currentSceneId: string;
  worldFlags: WorldFlag[];
  attempts: LearningAttempt[];
  completedSceneIds: string[];
  aiHintsEnabled: boolean;
}

export interface QuestionOption {
  id: string;
  label: string;
  visualId: string;
}

export interface Question {
  id: string;
  conceptId: ConceptId;
  prompt: string;
  options: QuestionOption[];
  correctChoiceId: string;
  misconceptionByChoice: Partial<Record<string, MisconceptionId>>;
  /** Exact water amount the correct option must show. */
  targetValue: Rational;
  /** Scene to enter after a correct answer. */
  onCorrectSceneId: string;
  /** Scene to enter after a wrong answer; null retries in place. */
  onWrongSceneId: string | null;
}

export interface DialogueLine {
  speaker: SpeakerId;
  text: string;
}

export interface Scene {
  id: string;
  title: string;
  summary: string;
  questionIds: string[];
  nextSceneId?: string;
}

export interface AuthoredHint {
  speaker: Exclude<SpeakerId, 'Narrator'>;
  dialogue: string;
  teachingAction: string;
  animationCue: string;
}
