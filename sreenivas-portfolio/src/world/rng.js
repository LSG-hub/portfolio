/**
 * Deterministic pseudo-randomness.
 *
 * ⚠️ Math.random() must never appear anywhere in src/world/. The entire global
 * world depends on every visitor computing an identical state from the same
 * seed and clock; one unseeded call desynchronises everyone, silently, and it
 * cannot be retrofitted. See docs/tuk-world.md §2.1.
 *
 * The cursor is part of world state. `createRng` gives you an ergonomic handle
 * that advances locally; write `rng.cursor()` back into state at the end of
 * whatever changed it. Pure in, pure out.
 */

/** Hash a seed string to a uint32. xmur3. */
export function hashSeed(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

/** mulberry32 — one step. Returns [value in [0,1), nextCursor]. */
export function nextRandom(cursor) {
  const t = (cursor + 0x6d2b79f5) | 0;
  let r = t;
  r = Math.imul(r ^ (r >>> 15), r | 1);
  r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
  const value = ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  return [value, t >>> 0];
}

/**
 * Ergonomic handle over a cursor. Mutates only its own local copy — the world
 * stays pure as long as you write `cursor()` back into state.
 */
export function createRng(cursor) {
  let c = cursor >>> 0;

  const next = () => {
    const [v, nc] = nextRandom(c);
    c = nc;
    return v;
  };

  return {
    next,
    /** integer in [min, max] inclusive */
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    /** float in [min, max) */
    float: (min, max) => min + next() * (max - min),
    /** true with probability p */
    chance: (p) => next() < p,
    /** uniform element */
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    /** ±spread around base */
    jitter: (base, spread) => base + (next() * 2 - 1) * spread,
    cursor: () => c
  };
}

/**
 * A stable per-entity value: same id always yields the same number, without
 * touching or advancing world state. Used for NPC appearance (height, colour,
 * silhouette) so it's derivable anywhere, including in the renderer.
 */
export function stableUnit(id, salt = '') {
  const [v] = nextRandom(hashSeed(`${id}:${salt}`));
  return v;
}
