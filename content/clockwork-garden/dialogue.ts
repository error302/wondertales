import type { DialogueLine } from '../../lib/engine/types';

export const DIALOGUE: Record<string, DialogueLine[]> = {
  s1: [
    {
      speaker: 'Narrator',
      text: 'Deep in the hills, gears hum softly beneath the flowers of the Clockwork Garden.',
    },
    {
      speaker: 'Milo',
      text: 'Oh no — the flowers are all droopy! And listen... the water pipes are groaning!',
    },
    {
      speaker: 'Nia',
      text: 'Then let us investigate carefully. The garden runs on water, and water must be shared fairly.',
    },
    {
      speaker: 'Milo',
      text: 'The Reservoir is just past the sunflower gate. Race you there — slowly, so Nia can win!',
    },
  ],
  s2: [
    {
      speaker: 'Narrator',
      text: 'The Reservoir sparkles. A great glass tank shows exactly how much water the garden holds.',
    },
    {
      speaker: 'Nia',
      text: 'See the lines on the tank? The upper line marks one-half. The lower line marks one-quarter.',
    },
    {
      speaker: 'Milo',
      text: 'Half... quarter... those words sound tricky! Which tank is exactly half full?',
    },
  ],
  s3: [
    {
      speaker: 'Narrator',
      text: 'Past the Reservoir stands a locked brass valve. Above it, a small tank is marked with one line: half.',
    },
    {
      speaker: 'Milo',
      text: 'I found the buckets! Two tiny ones! That must be... hmm. Are two tiny buckets enough for the big half tank?',
    },
    {
      speaker: 'Nia',
      text: 'Good wondering, Milo. You say two little quarter buckets can fill the big half tank. Shall we decide together — is Milo right?',
    },
  ],
  s4: [
    {
      speaker: 'Narrator',
      text: 'The channel sputters. The wrong pour rushes through, and the flowers droop a little lower.',
    },
    {
      speaker: 'Nia',
      text: 'No harm done — watch closely! One quarter bucket... pour! Two quarter buckets... pour! See? They reach exactly the halfway line.',
    },
    {
      speaker: 'Milo',
      text: 'Whoa. Two quarters really do make one half! Let me try the valve again!',
    },
  ],
  s5: [
    {
      speaker: 'Narrator',
      text: 'The valve swings open! Water races down two runs — one to the sunflowers, one to the berry bushes.',
    },
    {
      speaker: 'Nia',
      text: 'Each sunflower needs exactly one quarter tank from the pipe run. And the berry bushes share exactly one half tank from the jug run.',
    },
    {
      speaker: 'Milo',
      text: 'Pipes AND jugs? Good thing we practiced! Sunflowers first!',
    },
  ],
  s6: [
    {
      speaker: 'Narrator',
      text: 'Water flows everywhere it should. The Clockwork Garden bursts into bloom — gears humming, petals shining.',
    },
    {
      speaker: 'Milo',
      text: 'We did it! Half, quarter... and two quarters make one half! I will never forget that pour!',
    },
    {
      speaker: 'Nia',
      text: 'You reasoned it out, drop by drop. Shall we walk the garden once more?',
    },
  ],
};
