import type { Question } from '../../lib/engine/types';
import { rational } from '../../lib/engine/rationals';

export const QUESTIONS: Question[] = [
  {
    id: 'q-half',
    conceptId: 'half',
    prompt: 'Which tank shows exactly one-half full of water?',
    options: [
      { id: 'q-half-a', label: 'The low tank', visualId: 'tank-quarter' },
      { id: 'q-half-b', label: 'The middle tank', visualId: 'tank-half' },
      { id: 'q-half-c', label: 'The full tank', visualId: 'tank-full' },
    ],
    correctChoiceId: 'q-half-b',
    misconceptionByChoice: {
      'q-half-a': 'quarter_is_half',
    },
    targetValue: rational(1, 2),
    onCorrectSceneId: 's3',
    onWrongSceneId: null,
  },
  {
    id: 'q-two-quarters',
    conceptId: 'two_quarters_equal_half',
    prompt: 'Milo says two little quarter buckets can fill the big half tank. Is Milo right?',
    options: [
      { id: 'q-two-quarters-yes', label: 'Yes — two quarters make one half', visualId: 'tank-half' },
      {
        id: 'q-two-quarters-no-quarter',
        label: 'No — two quarters make one quarter',
        visualId: 'tank-quarter',
      },
      {
        id: 'q-two-quarters-no-whole',
        label: 'No — two quarters make a whole tank',
        visualId: 'tank-full',
      },
    ],
    correctChoiceId: 'q-two-quarters-yes',
    misconceptionByChoice: {
      'q-two-quarters-no-quarter': 'two_quarters_not_half',
      'q-two-quarters-no-whole': 'two_quarters_not_half',
    },
    targetValue: rational(1, 2),
    onCorrectSceneId: 's5',
    onWrongSceneId: 's4',
  },
  {
    id: 'q-distribute-sun',
    conceptId: 'quarter',
    prompt:
      'Each sunflower needs exactly one quarter tank from the pipe run. Which pipe carries exactly one quarter?',
    options: [
      { id: 'q-distribute-sun-quarter', label: 'The low pipe', visualId: 'pipe-quarter' },
      { id: 'q-distribute-sun-half', label: 'The middle pipe', visualId: 'pipe-half' },
      { id: 'q-distribute-sun-full', label: 'The full pipe', visualId: 'pipe-full' },
    ],
    correctChoiceId: 'q-distribute-sun-quarter',
    misconceptionByChoice: {
      'q-distribute-sun-half': 'wrong_distribution',
      'q-distribute-sun-full': 'wrong_distribution',
    },
    targetValue: rational(1, 4),
    onCorrectSceneId: 's5',
    onWrongSceneId: null,
  },
  {
    id: 'q-distribute-berry',
    conceptId: 'quarter',
    prompt: 'The berry bushes share exactly one half tank from the jug run. Which jug pours exactly one half?',
    options: [
      { id: 'q-distribute-berry-quarter', label: 'The low jug', visualId: 'jug-quarter' },
      { id: 'q-distribute-berry-half', label: 'The middle jug', visualId: 'jug-half' },
      { id: 'q-distribute-berry-full', label: 'The full jug', visualId: 'jug-full' },
    ],
    correctChoiceId: 'q-distribute-berry-half',
    misconceptionByChoice: {
      'q-distribute-berry-quarter': 'quarter_is_half',
      'q-distribute-berry-full': 'wrong_distribution',
    },
    targetValue: rational(1, 2),
    onCorrectSceneId: 's6',
    onWrongSceneId: null,
  },
];

export const REQUIRED_QUESTION_IDS: string[] = QUESTIONS.map((question) => question.id);

export function getQuestion(id: string): Question {
  const question = QUESTIONS.find((candidate) => candidate.id === id);
  if (!question) {
    throw new Error(`Unknown question "${id}"`);
  }
  return question;
}
