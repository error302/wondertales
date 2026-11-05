import type { AuthoredHint, MisconceptionId } from '../../lib/engine/types';

/** Approved offline hints. Also the fallback when WonderGuide is unavailable. */
export const AUTHORED_HINTS: Record<MisconceptionId, AuthoredHint> = {
  quarter_is_half: {
    speaker: 'Nia',
    dialogue:
      'Look closely: one quarter is smaller than one half. The half line sits higher! Which tank reaches it?',
    teachingAction: 'compare_quarter_to_half',
    animationCue: 'show_quarter_beside_half',
  },
  two_quarters_not_half: {
    speaker: 'Nia',
    dialogue:
      'Let us pour both quarter buckets together. See how they reach the halfway line? Two quarters make one half!',
    teachingAction: 'compare_quarters_to_half',
    animationCue: 'pour_two_quarters',
  },
  wrong_distribution: {
    speaker: 'Nia',
    dialogue:
      'Let us count the parts together. Each plant needs its fair share — match the water to the label.',
    teachingAction: 'match_water_to_label',
    animationCue: 'highlight_requirement',
  },
};

export const GENERIC_RETRY_HINT: AuthoredHint = {
  speaker: 'Nia',
  dialogue: 'Good try — look at the water lines once more. You can do this!',
  teachingAction: 'encourage_retry',
  animationCue: 'none',
};
