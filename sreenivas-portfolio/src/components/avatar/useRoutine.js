import { useEffect, useRef, useState } from 'react';
import { BEATS, entryIndexForHour } from './routine';

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
 * The day pauses when the tab is hidden. Someone who tabs away and comes back
 * resumes where they left off rather than finding him three days older.
 */

const TICK = 250;

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
    return entryIndexForHour(new Date().getHours());
  });

  const indexRef = useRef(index);
  const stageRef = useRef('travel'); // 'travel' | 'chore'
  const heldRef = useRef(0);
  const firstRef = useRef(true);

  indexRef.current = index;

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

    // The first beat teleports: nobody should watch him walk in before his day
    // starts, and at 3am he must already be at the dock, asleep.
    goalRef.current = { x, instant: firstRef.current, facing: BEATS[i].look || 1 };
    firstRef.current = false;
    stageRef.current = 'travel';
    heldRef.current = 0;
  }, [index, enabled, goalRef, zoneX]);

  /** He got there — start counting the chore. */
  useEffect(() => {
    if (stageRef.current === 'travel') {
      stageRef.current = 'chore';
      heldRef.current = 0;
    }
  }, [arrivals]);

  /** Advance the day. */
  useEffect(() => {
    if (!enabled) return undefined;
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (stageRef.current !== 'chore') return;
      heldRef.current += TICK;
      if (heldRef.current >= BEATS[indexRef.current].secs * 1000) {
        setIndex((n) => (n + 1) % BEATS.length);
      }
    }, TICK);
    return () => window.clearInterval(id);
  }, [enabled]);

  return { beat: BEATS[index], beatIndex: index };
}
