/**
 * Era table. Durations are REAL hours, not world days — see docs/tuk-world.md §3.2
 * for why the two clocks deliberately don't reconcile.
 *
 * Early eras are short so a new visitor sees change quickly; late eras are long
 * because that's where the content lives. Total ≈ 720h ≈ 30 days, then collapse.
 */

export const HOUR = 3600;

/**
 * One world day = one real hour.
 *
 * Chosen for legibility of the chronicle, not realism. At 8 minutes per day the
 * first era spanned 45 world days and the log read "Day 46" after six real
 * hours — arithmetically right, completely illegible. At one hour per day the
 * day number simply equals hours elapsed, a cycle runs to about day 720, and
 * the day/night rhythm is calm rather than frantic.
 *
 * The clocks still don't reconcile with human lifespans (§3.2) and never will
 * inside a 30-day arc. Nobody counts.
 */
export const DAY_SECONDS = 3600;

export const ERAS = [
  {
    id: 1,
    key: 'arrival',
    name: 'Arrival',
    hours: 6,
    actions: ['gather', 'rest'],
    structures: ['firepit'],
    palette: 'bare'
  },
  {
    id: 2,
    key: 'stone',
    name: 'Stone',
    hours: 24,
    actions: ['gather', 'quarry', 'hunt', 'rest'],
    structures: ['shelter', 'woodpile'],
    palette: 'stone'
  },
  {
    id: 3,
    key: 'settlement',
    name: 'Settlement',
    hours: 72,
    actions: ['gather', 'quarry', 'farm', 'hunt', 'rest'],
    structures: ['hut', 'field', 'pen'],
    palette: 'settlement'
  },
  {
    id: 4,
    key: 'village',
    name: 'Village',
    hours: 144,
    actions: ['gather', 'quarry', 'mine', 'farm', 'rest'],
    structures: ['well', 'smithy', 'granary', 'longhouse'],
    palette: 'village'
  },
  {
    id: 5,
    key: 'kingdom',
    name: 'Kingdom',
    hours: 168,
    actions: ['quarry', 'mine', 'farm', 'rest'],
    structures: ['wall', 'keep', 'market', 'chapel'],
    palette: 'kingdom'
  },
  {
    id: 6,
    key: 'industry',
    name: 'Industry',
    hours: 168,
    actions: ['mine', 'farm', 'rest'],
    structures: ['foundry', 'rail', 'chimney', 'workshop'],
    palette: 'industry'
  },
  {
    id: 7,
    key: 'futuristic',
    name: 'Futuristic',
    hours: 120,
    actions: ['mine', 'rest'],
    structures: ['spire', 'array', 'vault'],
    palette: 'future'
  },
  {
    id: 8,
    key: 'collapse',
    name: 'The Fall',
    hours: 18,
    actions: ['rest'],
    structures: [],
    palette: 'ash'
  }
];

/** Cumulative era boundaries in seconds from the cycle's start. */
export const ERA_BOUNDARIES = ERAS.reduce((acc, era) => {
  const prev = acc.length ? acc[acc.length - 1] : 0;
  acc.push(prev + era.hours * HOUR);
  return acc;
}, []);

/** Total seconds in one full cycle, collapse included. */
export const CYCLE_SECONDS = ERA_BOUNDARIES[ERA_BOUNDARIES.length - 1];

export const getEra = (id) => ERAS.find((e) => e.id === id) || ERAS[0];

/** Which era is active at `t` seconds into a cycle. */
export function eraAt(t) {
  for (let i = 0; i < ERA_BOUNDARIES.length; i += 1) {
    if (t < ERA_BOUNDARIES[i]) return ERAS[i].id;
  }
  return ERAS[ERAS.length - 1].id;
}

/** Seconds into the cycle at which `eraId` begins. */
export function eraStart(eraId) {
  const idx = ERAS.findIndex((e) => e.id === eraId);
  return idx <= 0 ? 0 : ERA_BOUNDARIES[idx - 1];
}
