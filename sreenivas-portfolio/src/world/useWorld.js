import { useCallback, useEffect, useRef, useState } from 'react';
import { createWorld } from './state';
import { advanceTo, bootstrap } from './simulate';
import { realElapsedSeconds } from './clock';
import { CYCLE_SECONDS, ERA_BOUNDARIES } from './data/eras';

/**
 * useWorld — owns the world state and the clock driving it.
 *
 * ── Two things worth understanding before editing ──────────────────────────
 *
 * 1. THE WORLD IS ADVANCED INCREMENTALLY, NOT REBUILT.
 *    `worldAt(seed, t)` from scratch is ~120ms for a full cycle. Calling that on
 *    every React update would burn most of a frame budget. Instead the state
 *    object persists in a ref and `advanceTo` processes only new events — which
 *    is nearly free. A full rebuild happens only when the seed changes or time
 *    moves BACKWARDS (scrubbing), because the sim cannot run in reverse.
 *
 * 2. REACT RE-RENDERS ON A COUNTER, NOT ON THE WORLD OBJECT.
 *    The state object mutates in place, so its identity never changes and React
 *    would never see an update. A `version` counter ticks ~10×/s to drive
 *    re-renders, while the ref stays current every frame for a canvas renderer
 *    to read at 60fps. Read fields off the returned `world` directly.
 *
 * Development controls are gated on NODE_ENV, which CRA replaces at build time —
 * so a production bundle cannot contain them at all. That's a compile-time
 * guarantee, not a runtime check. There is deliberately no URL-parameter
 * override either, so no shared link can desync someone's view of the world.
 */

const DEV = process.env.NODE_ENV === 'development';
const UI_HZ = 10; // React updates per second; the ref updates every frame

export function useWorld({ seed: initialSeed = 'tuk-genesis-01' } = {}) {
  const [seed, setSeed] = useState(initialSeed);
  const [version, setVersion] = useState(0);

  // dev-only clock controls
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);

  const worldRef = useRef(null);
  const elapsedRef = useRef(0);
  const buildMsRef = useRef(0);

  /** Rebuild from the epoch. Needed on seed change or any backwards jump. */
  const rebuild = useCallback((toElapsed) => {
    const t0 = performance.now();
    const fresh = bootstrap(createWorld(seed));
    advanceTo(fresh, Math.max(toElapsed, 0));
    buildMsRef.current = performance.now() - t0;
    worldRef.current = fresh;
    elapsedRef.current = Math.max(toElapsed, 0);
  }, [seed]);

  // Seed the world. In production it starts wherever the real clock says.
  useEffect(() => {
    rebuild(DEV ? 0 : realElapsedSeconds());
    setVersion((v) => v + 1);
  }, [rebuild]);

  useEffect(() => {
    let raf = null;
    let last = performance.now();
    let sinceUi = 0;

    const frame = (now) => {
      const dtReal = Math.min((now - last) / 1000, 0.25);
      last = now;

      if (DEV) {
        if (!paused) {
          elapsedRef.current += dtReal * speed;
          if (worldRef.current) advanceTo(worldRef.current, elapsedRef.current);
        }
      } else {
        elapsedRef.current = realElapsedSeconds(Date.now());
        if (worldRef.current) advanceTo(worldRef.current, elapsedRef.current);
      }

      sinceUi += dtReal;
      if (sinceUi >= 1 / UI_HZ) {
        sinceUi = 0;
        setVersion((v) => v + 1);
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [speed, paused]);

  // ── dev controls ──────────────────────────────────────────────────────────

  const jumpTo = useCallback((seconds) => {
    if (!DEV) return;
    const target = Math.max(seconds, 0);
    // The sim cannot run backwards, so any rewind is a full rebuild.
    if (!worldRef.current || target < worldRef.current.elapsed) rebuild(target);
    else {
      advanceTo(worldRef.current, target);
      elapsedRef.current = target;
    }
    elapsedRef.current = target;
    setVersion((v) => v + 1);
  }, [rebuild]);

  const step = useCallback((seconds = 60) => jumpTo(elapsedRef.current + seconds), [jumpTo]);

  const jumpToEra = useCallback((eraId) => {
    const cycleOffset = eraId <= 1 ? 0 : ERA_BOUNDARIES[eraId - 2];
    const base = worldRef.current ? worldRef.current.cycleStart : 0;
    jumpTo(base + cycleOffset + 60);
  }, [jumpTo]);

  const jumpToCycle = useCallback((cycleIndex) => {
    jumpTo(Math.max(cycleIndex - 1, 0) * CYCLE_SECONDS + 60);
  }, [jumpTo]);

  const reseed = useCallback((next) => {
    if (!DEV) return;
    setSeed(next);
    setSpeed(1);
    setPaused(false);
  }, []);

  return {
    world: worldRef.current,
    elapsed: elapsedRef.current,
    version,
    dev: {
      enabled: DEV,
      seed,
      speed,
      paused,
      buildMs: buildMsRef.current,
      setSpeed: DEV ? setSpeed : () => {},
      togglePause: DEV ? () => setPaused((p) => !p) : () => {},
      step,
      jumpTo,
      jumpToEra,
      jumpToCycle,
      reseed
    }
  };
}

export default useWorld;
