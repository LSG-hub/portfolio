import { hashSeed } from './rng';

/**
 * World state. This object IS the save file, and it is the entire input to
 * rendering — see docs/tuk-world.md §4.
 *
 * ⚠️ Bump SCHEMA_VERSION on any shape change, or older cached states will be
 * read as though they were the new shape.
 */

export const SCHEMA_VERSION = 1;

export const EMPTY_RESOURCES = { wood: 0, stone: 0, ore: 0, food: 0, knowledge: 0 };

/** Named spots in world coordinates. Tuk travels to whichever his action needs. */
export const PLACES = {
  here: null, // stay put
  forest: -320,
  ground: 0,
  field: 250,
  mountain: 1600,
  graveyard: -840,
  site: null // resolved from the structure being built
};

export function createWorld(seed = 'tuk-genesis-01') {
  return {
    version: SCHEMA_VERSION,
    seed,
    rngCursor: hashSeed(seed),

    /**
     * MONOTONIC seconds since the world's epoch. Never resets, across any number
     * of cycles. Cycle-relative time is `elapsed - cycleStart`.
     */
    elapsed: 0,
    cycleStart: 0,
    cycle: 1,
    era: 1,

    resources: { ...EMPTY_RESOURCES },

    tuk: {
      x: 0,
      action: null, // { type, startedAt, duration, structureId? }
      buried: 0 // cumulative across ALL cycles. Never resets. §8.3
    },

    structures: [],
    npcs: [],
    graves: [],
    ruins: [],
    chronicle: [],

    pendingBurials: 0,
    nextId: 1,
    seq: 1,
    queue: []
  };
}

/** Deterministic id minting — never use a random or time-based id. */
export function mintId(state, prefix) {
  const id = `${prefix}-${state.nextId}`;
  state.nextId += 1;
  return id;
}

/** Schedule an event. Ordering ties break on `seq`, so replay is identical. */
export function schedule(state, at, type, data = null) {
  state.queue.push({ at, seq: state.seq, type, data });
  state.seq += 1;
  state.queue.sort((a, b) => (a.at - b.at) || (a.seq - b.seq));
}

export function addChronicle(state, day, text) {
  state.chronicle.push({ at: state.elapsed, day, cycle: state.cycle, text });
}
