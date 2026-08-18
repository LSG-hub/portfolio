import { useEffect, useRef, useState } from 'react';
import { BEATS, BEAT_START, DAY_SECONDS } from './routine';
import { linesForVisit } from './dialogue';

/**
 * useRoutine — plays Tuk's day.
 *
 * Two-phase state machine per beat: TRAVEL until he arrives, then CHORE for the
 * beat's duration. Travel is off the clock on purpose, so a wider window (longer
 * walks) doesn't shorten the chores.
 *
 * Arrival is detected from `arrivals`, a counter the physics loop bumps. A
 * boolean can't do this job: at the instant a goal is posted the character
 * hasn't started moving, so "not travelling" and "arrived" are the same value
 * and the chore timer would start while he was still crossing the room.
 *
 * `zoneX(zone, offset)` returns null for a zone hidden at this breakpoint. Those
 * beats are skipped rather than left to strand him mid-room, and the search for
 * a playable beat is bounded — an unplayable list must not spin.
 *
 * The day pauses when the tab is hidden, and when he's out flying. Someone who
 * tabs away and comes back resumes where they left off rather than finding him
 * three days older.
 */

const TICK = 250;

/**
 * Dialogue pacing. Lines sit close together so a set plays as one thought:
 * spreading three of them evenly across a 56-second visit put 25 seconds between
 * them, which destroys a setup and a punchline and leaves most visitors with one
 * orphaned line.
 */
const LINE_LEAD = 1600;     // silence after arriving, before he says anything
const LINE_HOLD = 3800;     // how long a line stays up
const LINE_GAP = 5200;      // start-to-start, when the beat is long enough
const LINE_GAP_MIN = 3400;  // and the tightest it will compress to on a short one

export default function useRoutine({ goalRef, arrivals, zoneX, enabled = true }) {
  const [index, setIndex] = useState(() => {
    /**
     * `?beat=sweep` jumps straight to a beat, so tuning one chore doesn't mean
     * waiting out the four minutes before it comes round. Compiled out of
     * production by NODE_ENV substitution — the shipped bundle cannot contain it.
     */
    if (process.env.NODE_ENV === 'development') {
      const want = new URLSearchParams(window.location.search).get('beat');
      const found = BEATS.findIndex((b) => b.key === want);
      if (found >= 0) return found;
    }
    // His day starts when you arrive. See the entry note in routine.js for the
    // two worse answers this replaced.
    return 0;
  });

  const indexRef = useRef(index);
  const stageRef = useRef('travel'); // 'travel' | 'chore'
  const heldRef = useRef(0);
  const firstRef = useRef(true);

  indexRef.current = index;
  const beat = BEATS[index];

  /** Post the destination for whichever beat is current. */
  useEffect(() => {
    if (!enabled) return;

    let i = index;
    let x = null;
    for (let tries = 0; tries < BEATS.length; tries += 1) {
      x = zoneX(BEATS[i].zone, BEATS[i].at);
      if (x != null) break;
      i = (i + 1) % BEATS.length;
    }
    if (x == null) return;            // nothing playable — hold rather than spin
    if (i !== index) { setIndex(i); return; }

    // The first beat teleports him onto the charging pad rather than walking him
    // there: his day starts the moment the page opens, and nobody should watch him
    // cross the room to go to bed before he can get out of it.
    goalRef.current = {
      x,
      instant: firstRef.current,
      facing: BEATS[i].look || 1,
      lift: BEATS[i].lift || 0
    };
    firstRef.current = false;
    stageRef.current = 'travel';
    heldRef.current = 0;
  }, [index, enabled, goalRef, zoneX]);

  /**
   * Dialogue belongs to the ACTION, and fires on arrival at it.
   *
   * Keyed per beat rather than per stop, because a stop covers two or three
   * different things at the same furniture and they do not share a thought: the
   * kettle has something to say and the mug he then carries does not. Keying it
   * to the stop also let a waking line play while he was already back asleep.
   *
   * On arrival rather than on the beat changing, because the beat changes the
   * moment he sets off and he was talking to himself halfway across the room.
   * Within a stop he is already standing there, so the goal resolves instantly
   * and arrival still fires.
   */
  const [scene, setScene] = useState(0);
  const sceneRef = useRef(null);
  const spokenBeatRef = useRef(null);
  /**
   * Which dialogue set each action is on. Seeded at random rather than zero:
   * now that every visitor starts at the same beat, a zero seed would make the
   * opening lines byte-identical on every single page load. A random offset makes
   * the first thing he says vary between his two sets, and the 12% rare draw
   * occasionally beats both.
   */
  const visitsRef = useRef(
    BEATS.reduce((acc, b) => {
      acc[b.key] = Math.random() < 0.5 ? 0 : 1;
      return acc;
    }, {})
  );

  /** He got there — start counting the chore, and say whatever this one says. */
  useEffect(() => {
    if (stageRef.current === 'travel') {
      stageRef.current = 'chore';
      heldRef.current = 0;
    }
    if (spokenBeatRef.current !== beat.key) {
      spokenBeatRef.current = beat.key;
      const visit = visitsRef.current[beat.key] || 0;
      visitsRef.current[beat.key] = visit + 1;
      sceneRef.current = { lines: linesForVisit(beat.key, visit), secs: beat.secs };
      setScene((n) => n + 1);
    }
    // Fires on arrival; the beat is read, not watched.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivals]);

  const [speech, setSpeech] = useState(null);

  useEffect(() => {
    const cue = sceneRef.current;
    if (!scene || !cue || !cue.lines.length) return undefined;
    const { lines, secs } = cue;

    /**
     * Pace to the beat's own length so a set always finishes inside it. A fixed
     * gap overran the short actions and cut the last line off mid-thought; the
     * floor keeps the pauses long enough to read.
     */
    const room = secs * 1000 - LINE_LEAD - LINE_HOLD;
    const gap = lines.length > 1
      ? Math.min(LINE_GAP, Math.max(room / (lines.length - 1), LINE_GAP_MIN))
      : 0;

    const timers = lines.flatMap((text, i) => [
      window.setTimeout(() => setSpeech(text), LINE_LEAD + i * gap),
      window.setTimeout(() => setSpeech(null), LINE_LEAD + i * gap + LINE_HOLD)
    ]);
    return () => {
      timers.forEach(window.clearTimeout);
      setSpeech(null);
    };
  }, [scene]);

  /**
   * Continuous position through the day, 0..1. Published every tick so the light
   * can be sampled from a curve rather than switched between states: four CSS
   * classes cut between frames, because a gradient cannot be transitioned.
   *
   * 4Hz is plenty — one step is 1/1200th of the cycle, well under what reads as
   * a step rather than a drift. It holds still during travel and while the tab is
   * hidden, which is correct: his day is paused, so the sun should be too.
   */
  const [progress, setProgress] = useState(
    () => BEAT_START[index] / DAY_SECONDS
  );

  /** Advance the day. */
  useEffect(() => {
    if (!enabled) return undefined;
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (stageRef.current !== 'chore') return;
      heldRef.current += TICK;
      const i = indexRef.current;
      setProgress((BEAT_START[i] + heldRef.current / 1000) / DAY_SECONDS);
      if (heldRef.current >= BEATS[i].secs * 1000) {
        setIndex((n) => (n + 1) % BEATS.length);
      }
    }, TICK);
    return () => window.clearInterval(id);
  }, [enabled]);

  return { beat, beatIndex: index, speech, progress };
}
