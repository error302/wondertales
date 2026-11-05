export interface World {
  id: string;
  name: string;
  subject: string;
  purpose: string;
  /** Null while the world's first adventure is still being built. */
  adventureHref: string | null;
}

export const WORLDS: World[] = [
  {
    id: 'clockwork-kingdom',
    name: 'The Clockwork Kingdom',
    subject: 'Mathematics & logic',
    purpose: 'Reason about halves and quarters to wake a garden of water-driven machines.',
    adventureHref: '/companions',
  },
  {
    id: 'enchanted-forest',
    name: 'The Enchanted Forest',
    subject: 'Science & ecology',
    purpose: 'Follow food chains and habitats to heal a whispering forest. Coming soon.',
    adventureHref: null,
  },
  {
    id: 'ocean-of-discovery',
    name: 'The Ocean of Discovery',
    subject: 'Marine science & geography',
    purpose: 'Navigate currents and islands to map a sparkling sea. Coming soon.',
    adventureHref: null,
  },
];

export function getWorld(id: string): World | null {
  return WORLDS.find((world) => world.id === id) ?? null;
}
