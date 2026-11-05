import type { Scene } from '../../lib/engine/types';

/** Authored six-scene graph. s4 loops back to s3: remediation always returns to the valve. */
export const SCENES: Scene[] = [
  {
    id: 's1',
    title: 'Garden Awakens',
    summary: 'Milo and Nia discover the thirsty mechanical plants.',
    questionIds: [],
    nextSceneId: 's2',
  },
  {
    id: 's2',
    title: 'Reservoir',
    summary: 'The water tank shows clearly marked half and quarter levels.',
    questionIds: ['q-half'],
    nextSceneId: 's3',
  },
  {
    id: 's3',
    title: 'Two Small Buckets',
    summary: 'A locked valve needs exactly half a tank.',
    questionIds: ['q-two-quarters'],
    nextSceneId: 's4',
  },
  {
    id: 's4',
    title: 'The Overflow',
    summary: 'A wrong pour shows itself; Nia demonstrates why.',
    questionIds: [],
    nextSceneId: 's3',
  },
  {
    id: 's5',
    title: 'The Garden Wakes',
    summary: 'Two water distributions restore the garden zones.',
    questionIds: ['q-distribute-sun', 'q-distribute-berry'],
    nextSceneId: 's6',
  },
  {
    id: 's6',
    title: 'Celebration',
    summary: 'The garden flourishes; recap and replay.',
    questionIds: [],
  },
];

export function getScene(id: string): Scene {
  const scene = SCENES.find((candidate) => candidate.id === id);
  if (!scene) {
    throw new Error(`Unknown scene "${id}"`);
  }
  return scene;
}
