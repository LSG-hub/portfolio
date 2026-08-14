/**
 * Tuk's day, as a playlist of beats.
 *
 * ── Why beats and not hours ──────────────────────────────────────────────
 * A day here lasts about five minutes, and that number is a content budget
 * rather than a feel: eighteen authored chores at a natural length add up to
 * roughly 300 seconds. Three minutes would need ten-second beats and he'd look
 * frantic; ten minutes would need thirty-three distinct chores and the
 * repetition would show before they could be written.
 *
 * Mapping 24 hours linearly onto five minutes was the first draft and it was
 * wrong: a six-hour night became 75 seconds of a sleeping robot — longer than a
 * median visit. So the day is an ordered list of beats and night gets two of
 * them, not a quarter of the loop.
 *
 * ── The rule that makes it read ─────────────────────────────────────────
 * COMPRESS THE DAY, NEVER HIS MOTION. `secs` here is real seconds of standing
 * still and doing a thing; his hop speed is untouched physics. Scale locomotion
 * with the clock instead and he zips about like an insect. The timelapse feel
 * comes from short beats between real-speed movement — exactly how stop-motion
 * works. Travel time is deliberately off the clock: a beat's timer only starts
 * once he has arrived.
 *
 * ── Entry ───────────────────────────────────────────────────────────────
 * There is no global sync. That was carried over from the Origins simulation,
 * where it earned its keep because the world accumulated; a repeating routine
 * accumulates nothing, so no visitor could ever tell whether they saw the same
 * beat as anyone else. It bought nothing and cost the first impression — one
 * arrival in eight landed on a sleeping robot.
 *
 * Instead each visitor enters at the beat matching their own local hour, so the
 * opening is never arbitrary, and the fast cycle takes over immediately. Anyone
 * arriving between midnight and 6am finds him asleep at the dock and wakes him
 * with their cursor, which turns the one dead beat into the reward for visiting
 * late.
 *
 * ── Stand BESIDE the thing, never on it ─────────────────────────────────
 * The rule every beat obeys, and the one that isn't obvious until you look: Tuk
 * is 52px wide and 58 tall in a room whose furniture is the same scale, so
 * standing at an object's own x puts that object directly behind his head. The
 * first draft had him "at" the kettle and the kettle became a hat; he covered
 * the plant he was watering and the dock he was sleeping on.
 *
 * So `at` places him CLEAR of the thing and `look` turns him toward it. Check
 * any new beat against the drawing's coordinates in RoomFurniture.jsx: his body
 * spans `at ± 26`, and anything inside that span is hidden.
 *
 * `at` is an offset in the zone's OWN pixels — zone SVGs are drawn 1:1, so 72
 * means "72px into the kitchen", the clear end of the counter. It may exceed the
 * zone's width to reach open floor between zones, which is what `sweep` does.
 *
 * `look` is -1 to face left, absent for right. Cursor proximity still wins — he
 * turns to you before he turns to the kettle.
 */

/**
 * `stop` groups consecutive beats at one piece of furniture. A stop is one
 * visit: he travels once, stays a notable while, works through two or three
 * poses, and speaks one dialogue set. Eighteen separate errands had him crossing
 * the room eighteen times a day, which read as pacing rather than living.
 *
 * `lift` raises him off the floor in the renderer only. 10px is the sofa: enough
 * that the cushion's front layer covers his legs, not enough to look like he is
 * standing on the furniture.
 */
export const BEATS = [
  // ── he wakes on the charging mat ──
  { key: 'wake',    stop: 'dock-am', hour: 6,  zone: 'dock',    at: 39,  secs: 12, face: 'sleepy',     gesture: 'rest',  head: 'still', lift: 7 },
  { key: 'rise',    stop: 'dock-am', hour: 6,  zone: 'dock',    at: 54,  secs: 10, face: 'happy',      gesture: 'cheer', head: 'perk' },
  { key: 'ready',   stop: 'dock-am', hour: 7,  zone: 'dock',    at: 54,  secs: 10, face: 'happy',      gesture: 'rest',  head: 'nod' },

  // ── kitchen ──
  { key: 'boil',    stop: 'kitchen', hour: 7,  zone: 'kitchen', at: 72,  look: -1, secs: 18, face: 'neutral', gesture: 'reach', head: 'tilt' },
  { key: 'pour',    stop: 'kitchen', hour: 8,  zone: 'kitchen', at: 72,  look: -1, secs: 14, face: 'happy',   gesture: 'chin',  head: 'still', prop: 'mug' },
  { key: 'sip',     stop: 'kitchen', hour: 8,  zone: 'kitchen', at: 84,  look: -1, secs: 16, face: 'happy',   gesture: 'rest',  head: 'still', prop: 'mug' },

  // ── the plant, and the light ──
  { key: 'water',   stop: 'window',  hour: 9,  zone: 'window',  at: 44,  secs: 18, face: 'happy',      gesture: 'reach', head: 'lean',  prop: 'can' },
  { key: 'gaze',    stop: 'window',  hour: 10, zone: 'window',  at: 62,  look: -1, secs: 14, face: 'neutral', gesture: 'rest', head: 'lean' },
  { key: 'tidy',    stop: 'window',  hour: 11, zone: 'window',  at: 62,  look: -1, secs: 12, face: 'happy',   gesture: 'reach', head: 'still' },

  // ── the desk. He reads the logs. ──
  { key: 'type',    stop: 'desk',    hour: 12, zone: 'desk',    at: 72,  look: -1, secs: 20, face: 'loading',    gesture: 'rest', head: 'nod' },
  { key: 'think',   stop: 'desk',    hour: 13, zone: 'desk',    at: 72,  look: -1, secs: 14, face: 'thinking',   gesture: 'chin', head: 'tilt' },
  { key: 'book',    stop: 'desk',    hour: 14, zone: 'desk',    at: 80,  secs: 10, face: 'neutral',    gesture: 'reach', head: 'still', prop: 'book' },
  { key: 'type2',   stop: 'desk',    hour: 15, zone: 'desk',    at: 72,  look: -1, secs: 12, face: 'determined', gesture: 'rest', head: 'nod' },

  // ── sweeps up, then sits down in front of the TV ──
  { key: 'sweep',   stop: 'lounge',  hour: 16, zone: 'lounge',  at: 245, secs: 18, face: 'neutral', gesture: 'sweep', head: 'still', prop: 'broom' },
  { key: 'tv',      stop: 'lounge',  hour: 18, zone: 'lounge',  at: 58,  secs: 24, face: 'happy',   gesture: 'rest',  head: 'tilt',  lift: 10 },
  { key: 'laugh',   stop: 'lounge',  hour: 19, zone: 'lounge',  at: 58,  secs: 14, face: 'heart',   gesture: 'cheer', head: 'perk',  lift: 10 },

  // ── back to the mat ──
  { key: 'yawn',    stop: 'dock-pm', hour: 22, zone: 'dock',    at: 54,  secs: 12, face: 'sleepy', gesture: 'shrug', head: 'still' },
  { key: 'sleep',   stop: 'dock-pm', hour: 23, zone: 'dock',    at: 39,  secs: 32, face: 'sleepy', gesture: 'rest',  head: 'still', lift: 7 }
];

/**
 * Cumulative start second of each beat, so a continuous position in the day can
 * be derived from "which beat, how far in". That fraction is what drives the
 * light: see daylight.js, where dawn, midday and dusk are placed to line up with
 * waking, the desk, and sitting down in front of the television.
 */
export const BEAT_START = BEATS.reduce((acc, b, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + BEATS[i - 1].secs);
  return acc;
}, []);

/** Total seconds a stop lasts. */
export const STOP_SECONDS = BEATS.reduce((acc, b) => {
  acc[b.stop] = (acc[b.stop] || 0) + b.secs;
  return acc;
}, {});

/** 280s of chores, plus travel: about five minutes a day. */
export const DAY_SECONDS = BEATS.reduce((total, b) => total + b.secs, 0);

/**
 * Where a visitor drops in. The last beat whose nominal hour has passed — so
 * 10am starts him at the desk and 3am finds him asleep, because no beat's hour
 * is under 3 and the list falls through to its end.
 */
export function entryIndexForHour(hour) {
  let index = BEATS.length - 1;
  for (let i = 0; i < BEATS.length; i += 1) {
    if (BEATS[i].hour <= hour) index = i;
  }
  return index;
}
