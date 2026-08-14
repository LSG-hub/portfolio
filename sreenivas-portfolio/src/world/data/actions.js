/**
 * What Tuk actually does. Every action is an animation, a duration, and a
 * resource delta.
 *
 * Durations obey the pacing rule (docs/tuk-world.md §3.3): something visible
 * completes every 10-25 seconds, so a two-minute visitor always sees change.
 * `bury` deliberately breaks that ceiling — it is the one action that isn't
 * about efficiency and should feel slow.
 */

export const ACTIONS = {
  gather: {
    verb: 'Gathering',
    seconds: 12,
    yields: { wood: 4 },
    where: 'forest'
  },
  quarry: {
    verb: 'Quarrying',
    seconds: 16,
    yields: { stone: 3 },
    where: 'ground'
  },
  mine: {
    verb: 'Mining',
    seconds: 24,
    yields: { ore: 2, stone: 1 },
    where: 'mountain',
    /** the trip out to the mountain is what makes the world feel like a place */
    travel: true
  },
  farm: {
    verb: 'Tending the field',
    seconds: 14,
    yields: { food: 4 },
    where: 'field'
  },
  hunt: {
    verb: 'Hunting',
    seconds: 18,
    yields: { food: 5 },
    where: 'forest'
  },
  build: {
    verb: 'Building',
    seconds: 20,
    yields: {},
    where: 'site'
  },
  repair: {
    verb: 'Repairing',
    seconds: 18,
    yields: {},
    where: 'site'
  },
  bury: {
    verb: 'Burying',
    seconds: 40,
    yields: {},
    where: 'graveyard'
  },
  rest: {
    verb: 'Resting',
    seconds: 10,
    yields: {},
    where: 'here'
  }
};

/** Which resource each gathering action produces most of — used when choosing. */
export const PRIMARY_YIELD = {
  gather: 'wood',
  quarry: 'stone',
  mine: 'ore',
  farm: 'food',
  hunt: 'food'
};

export const getAction = (type) => ACTIONS[type] || ACTIONS.rest;
