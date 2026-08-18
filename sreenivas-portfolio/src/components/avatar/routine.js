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
 * ── Entry: HIS DAY STARTS WHEN YOU ARRIVE ───────────────────────────────
 * Opening the page wakes him. Every visitor gets the same deliberate opening and
 * then the whole arc in order: up off the pad, kettle, plant, desk, sweeping,
 * evening on the sofa, back to bed.
 *
 * Two earlier answers were both worse. A global clock shared by all visitors was
 * carried over from the Origins simulation, where it earned its keep because that
 * world accumulated; a repeating routine accumulates nothing, so nobody could
 * tell, and it cost the opening. Entering at the visitor's own local hour was
 * better but still wrong twice over: hours 0 to 5 all land on `sleep`, the longest
 * beat in the day, so anyone arriving after midnight opened the page on a
 * motionless robot — and matching their clock is invisible anyway. No visitor can
 * perceive that 3pm put him at his desk, so the whole arc was being spent on
 * something nobody could see.
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
  // Shorter and with a head motion, because this is now the FIRST thing every
  // visitor sees: twelve static seconds of a groggy robot is a slow hello.
  { key: 'wake',    stop: 'dock-am', zone: 'dock',    at: 39,  secs: 8,  face: 'sleepy',     gesture: 'rest',  head: 'perk',  lift: 7 },
  { key: 'rise',    stop: 'dock-am', zone: 'dock',    at: 54,  secs: 10, face: 'happy',      gesture: 'cheer', head: 'perk' },
  { key: 'ready',   stop: 'dock-am', zone: 'dock',    at: 54,  secs: 10, face: 'happy',      gesture: 'rest',  head: 'nod' },

  // ── kitchen ──
  { key: 'boil',    stop: 'kitchen', zone: 'kitchen', at: 72,  look: -1, secs: 18, face: 'neutral', gesture: 'reach', head: 'tilt' },
  { key: 'pour',    stop: 'kitchen', zone: 'kitchen', at: 72,  look: -1, secs: 14, face: 'happy',   gesture: 'chin',  head: 'still', prop: 'mug' },
  { key: 'sip',     stop: 'kitchen', zone: 'kitchen', at: 84,  look: -1, secs: 16, face: 'happy',   gesture: 'rest',  head: 'still', prop: 'mug' },

  // ── the plant, and the light ──
  { key: 'water',   stop: 'window',  zone: 'window',  at: 44,  secs: 18, face: 'happy',      gesture: 'reach', head: 'lean',  prop: 'can' },
  { key: 'gaze',    stop: 'window',  zone: 'window',  at: 62,  look: -1, secs: 14, face: 'neutral', gesture: 'rest', head: 'lean' },
  { key: 'tidy',    stop: 'window',  zone: 'window',  at: 62,  look: -1, secs: 12, face: 'happy',   gesture: 'reach', head: 'still' },

  // ── the desk. He reads the logs. ──
  { key: 'type',    stop: 'desk',    zone: 'desk',    at: 72,  look: -1, secs: 20, face: 'loading',    gesture: 'rest', head: 'nod' },
  { key: 'think',   stop: 'desk',    zone: 'desk',    at: 72,  look: -1, secs: 14, face: 'thinking',   gesture: 'chin', head: 'tilt' },
  { key: 'book',    stop: 'desk',    zone: 'desk',    at: 80,  secs: 10, face: 'neutral',    gesture: 'reach', head: 'still', prop: 'book' },
  { key: 'type2',   stop: 'desk',    zone: 'desk',    at: 72,  look: -1, secs: 12, face: 'determined', gesture: 'rest', head: 'nod' },

  // ── sweeps up, then sits down in front of the TV ──
  { key: 'sweep',   stop: 'lounge',  zone: 'lounge',  at: 245, secs: 18, face: 'neutral', gesture: 'sweep', head: 'still', prop: 'broom' },
  { key: 'tv',      stop: 'lounge',  zone: 'lounge',  at: 58,  secs: 24, face: 'happy',   gesture: 'rest',  head: 'tilt',  lift: 10 },
  { key: 'laugh',   stop: 'lounge',  zone: 'lounge',  at: 58,  secs: 14, face: 'heart',   gesture: 'cheer', head: 'perk',  lift: 10 },

  // ── back to the mat ──
  { key: 'yawn',    stop: 'dock-pm', zone: 'dock',    at: 54,  secs: 12, face: 'sleepy', gesture: 'shrug', head: 'still' },
  { key: 'sleep',   stop: 'dock-pm', zone: 'dock',    at: 39,  secs: 32, face: 'sleepy', gesture: 'rest',  head: 'still', lift: 7 }
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
