/**
 * The world's clock.
 *
 * This is the ONLY place allowed to ask what time it is. The simulation itself
 * receives time as an argument and never reads a clock — that's what makes every
 * visitor's world identical. See docs/tuk-world.md §2.1.
 */

/**
 * When the world began. A fixed constant, because it is what makes the world
 * shared: every visitor measures from the same instant.
 *
 * ⚠️ Changing this rewrites history for everyone. Set it once at launch.
 */
export const WORLD_EPOCH_MS = Date.UTC(2026, 7, 14, 0, 0, 0); // 2026-08-14T00:00:00Z

/**
 * Seconds of world time that have elapsed.
 *
 * TODO before launch: take the timestamp from the server rather than the
 * visitor's machine. Clock skew and people changing their system time would
 * otherwise desync their view of a world that is supposed to be shared. One
 * endpoint returning a timestamp, or the `Date` header of a request already
 * being made. Local time is fine for development.
 */
export function realElapsedSeconds(nowMs = Date.now()) {
  return Math.max((nowMs - WORLD_EPOCH_MS) / 1000, 0);
}

/**
 * Development speed multipliers.
 *
 * ×100 sounds fast but takes 7.2 hours to play the 30-day arc, so the larger
 * multipliers exist to make a full cycle watchable — ×10000 runs it in about
 * four minutes. For anything other than watching a stretch, scrub instead:
 * rebuilding the world from scratch takes ~120ms, so jumping is instant.
 */
export const SPEEDS = [1, 2, 5, 10, 100, 1000, 10000];
