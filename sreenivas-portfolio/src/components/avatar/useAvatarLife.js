import { useEffect, useRef, useState } from 'react';

/**
 * useAvatarLife — ambient locomotion for Tuk.
 *
 * The world is derived from the real DOM: every element tagged
 * `data-avatar-platform` contributes its top edge as a standable surface. The
 * character does not walk on a painted floor, it stands on your actual cards.
 *
 * Three design decisions worth knowing:
 *
 * 1. HE HOPS, HE DOESN'T WALK. Stub legs and detached hands make a gait look
 *    wrong. Hopping is cuter, cheaper, and delivers squash-and-stretch — the
 *    one Kindchenschema feature you get from motion rather than drawing.
 *
 * 2. HOPS ARE BALLISTIC, NOT FIXED. A constant launch velocity caps his rise
 *    at v²/2g, which silently strands him on any platform whose neighbour is
 *    further up than that — he sat on the floor forever. Each hop now solves
 *    for the velocity that actually reaches the chosen target. This is also the
 *    math a directed `goToSection()` needs.
 *
 * 3. THE LOOP NEVER TOUCHES REACT STATE. Position and squash are written
 *    straight to the DOM. Only `phase`, `noticing` and `greeting` — which
 *    change rarely — go through setState. A 60fps setState would re-render the
 *    whole subtree every frame.
 *
 * Two refs, two jobs: `actorRef` carries translation, `bodyRef` carries
 * scale (facing + squash). Keeping them separate means anything else parented
 * to the actor — a speech bubble, say — doesn't get mirrored or squashed.
 *
 * Coordinates are relative to `containerRef`, so there is no scroll math.
 */

const GRAVITY = 1500;        // px/s²
const HOP_VY = -430;         // px/s default launch, for level or downhill hops
const MAX_VY = 780;          // ceiling on launch speed — rise caps near 200px
const MAX_VX = 240;          // ceiling on horizontal speed
const APEX_CLEARANCE = 22;   // clear the target's edge by this much
const EDGE_PAD = 16;         // stay this far from a platform's ends
const REST_MIN = 750;        // ms between hops
const REST_MAX = 2600;
const NOTICE_RADIUS = 170;   // px — cursor proximity that makes him look up
const GREET_MS = 2600;       // how long a hello lasts
const GREET_DEBOUNCE = 300;  // ignore cursor jitter at the boundary

export function useAvatarLife({ containerRef, actorRef, bodyRef, footprint = 64 }) {
  const [phase, setPhase] = useState('grounded');
  const [noticing, setNoticing] = useState(false);
  /**
   * Fires on the RISING EDGE of proximity, so the caller can show a fresh
   * greeting each approach. Debounced only enough to survive cursor jitter at
   * the radius boundary — not rationed.
   */
  const [greeting, setGreeting] = useState(0);
  const [platformCount, setPlatformCount] = useState(0);

  const sim = useRef({
    x: 0, y: 0, vx: 0, vy: 0,
    grounded: true, facing: 1, squash: 1,
    restTimer: 1000, platforms: [], bounds: { w: 0, h: 0 },
    cursor: { x: -9999, y: -9999 }, started: false, lastGreet: 0
  });

  const phaseRef = useRef('grounded');
  const noticeRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const actor = actorRef.current;
    const body = bodyRef.current;
    if (!container || !actor || !body) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = sim.current;
    const halfW = footprint / 2;
    const bodyH = Math.round((footprint * 67) / 60);
    const timers = [];

    const setPhaseOnce = (p) => {
      if (phaseRef.current !== p) { phaseRef.current = p; setPhase(p); }
    };

    /** Harvest standable surfaces from the real DOM. */
    const measure = () => {
      const cRect = container.getBoundingClientRect();
      const platforms = [];
      container.querySelectorAll('[data-avatar-platform]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < footprint) return; // too narrow to stand on
        platforms.push({
          left: r.left - cRect.left,
          right: r.right - cRect.left,
          top: r.top - cRect.top
        });
      });
      platforms.sort((a, b) => a.top - b.top);
      s.platforms = platforms;
      s.bounds = { w: cRect.width, h: cRect.height };
      setPlatformCount(platforms.length);

      if (!s.started && platforms.length) {
        const p = platforms[0];
        s.x = (p.left + p.right) / 2;
        s.y = p.top;
        s.grounded = true;
        s.started = true;
      }
    };

    const render = () => {
      actor.style.transform =
        `translate(${(s.x - halfW).toFixed(2)}px, ${(s.y - bodyH).toFixed(2)}px)`;
      body.style.transform =
        `scaleX(${s.facing}) scaleY(${s.squash.toFixed(3)})`;
      // Published as an attribute rather than React state so the speech bubble
      // can flip sides in CSS without a re-render on every direction change.
      const f = s.facing < 0 ? '-1' : '1';
      if (actor.dataset.facing !== f) actor.dataset.facing = f;
    };

    measure();
    render();

    if (reduce) {
      setPhaseOnce('grounded');
      return () => {};
    }

    const onPointer = (e) => {
      const cRect = container.getBoundingClientRect();
      s.cursor = { x: e.clientX - cRect.left, y: e.clientY - cRect.top };
    };

    /**
     * Solve for a launch that lands on (tx, ty).
     * Upward: rise high enough to clear the target, then derive flight time.
     * Level or downward: use the default launch and solve the fall for time.
     */
    const launchToward = (tx, ty) => {
      const dy = s.y - ty; // positive when the target is above us
      let vy;
      let flight;

      if (dy > 0) {
        const rise = dy + APEX_CLEARANCE;
        vy = -Math.min(Math.sqrt(2 * GRAVITY * rise), MAX_VY);
        const toApex = Math.abs(vy) / GRAVITY;
        const actualRise = (vy * vy) / (2 * GRAVITY);
        const dropToTarget = Math.max(actualRise - dy, 0);
        flight = toApex + Math.sqrt((2 * dropToTarget) / GRAVITY);
      } else {
        vy = HOP_VY;
        // y + vy t + ½gt² = ty  →  positive root
        const drop = -dy; // how far below us the target is
        const disc = vy * vy + 2 * GRAVITY * drop;
        flight = (-vy + Math.sqrt(Math.max(disc, 0))) / GRAVITY;
      }

      const vx = Math.max(Math.min((tx - s.x) / Math.max(flight, 0.05), MAX_VX), -MAX_VX);
      return { vx, vy };
    };

    const chooseHop = () => {
      const here = s.platforms.find(
        (p) => Math.abs(p.top - s.y) < 2 && s.x >= p.left && s.x <= p.right
      );

      // Prefer somewhere he can actually get to.
      const maxRise = (MAX_VY * MAX_VY) / (2 * GRAVITY) - APEX_CLEARANCE;
      const reachable = s.platforms.filter((p) => p !== here && s.y - p.top < maxRise);
      const travel = reachable.length > 0 && Math.random() < 0.55;

      let target;
      if (travel) {
        const p = reachable[Math.floor(Math.random() * reachable.length)];
        const span = Math.max(p.right - p.left - EDGE_PAD * 2, 1);
        target = { x: p.left + EDGE_PAD + Math.random() * span, y: p.top };
      } else if (here) {
        // wander along this platform, away from whichever edge is closer
        const room = { l: s.x - here.left, r: here.right - s.x };
        const dir = Math.min(room.l, room.r) > 90
          ? (Math.random() < 0.5 ? -1 : 1)
          : (room.r > room.l ? 1 : -1);
        const step = 60 + Math.random() * 90;
        target = {
          x: Math.min(Math.max(s.x + dir * step, here.left + EDGE_PAD), here.right - EDGE_PAD),
          y: here.top
        };
      } else {
        target = { x: s.x + (Math.random() < 0.5 ? -80 : 80), y: s.y };
      }

      const { vx, vy } = launchToward(target.x, target.y);
      s.vx = vx;
      s.vy = vy;
      if (Math.abs(vx) > 8) s.facing = Math.sign(vx);
      s.grounded = false;
      s.squash = 1.14; // stretch on launch
      setPhaseOnce('airborne');
    };

    let raf = null;
    let last = performance.now();
    let reMeasure = 0;

    const step = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      reMeasure += dt;
      if (reMeasure > 0.5) { reMeasure = 0; measure(); }

      if (s.grounded) {
        s.restTimer -= dt * 1000;
        s.squash += (1 - s.squash) * Math.min(dt * 12, 1);
        if (s.restTimer <= 0) {
          s.restTimer = REST_MIN + Math.random() * (REST_MAX - REST_MIN);
          chooseHop();
        }
      } else {
        const prevY = s.y;
        s.vy += GRAVITY * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        const stretch = 1 + Math.min(Math.abs(s.vy) / 1500, 0.16);
        s.squash += (stretch - s.squash) * Math.min(dt * 10, 1);

        if (s.x < halfW) { s.x = halfW; s.vx = Math.abs(s.vx); s.facing = 1; }
        if (s.x > s.bounds.w - halfW) { s.x = s.bounds.w - halfW; s.vx = -Math.abs(s.vx); s.facing = -1; }

        if (s.vy > 0) {
          const landed = s.platforms.find(
            (p) => prevY <= p.top + 1 && s.y >= p.top
              && s.x > p.left + EDGE_PAD && s.x < p.right - EDGE_PAD
          );
          if (landed) {
            s.y = landed.top;
            s.vy = 0; s.vx = 0;
            s.grounded = true;
            s.squash = 0.74; // impact
            s.restTimer = REST_MIN + Math.random() * (REST_MAX - REST_MIN);
            setPhaseOnce('landing');
            timers.push(window.setTimeout(() => setPhaseOnce('grounded'), 160));
          }
        }

        if (s.y > s.bounds.h + 120) {
          const home = s.platforms.find((p) => s.x > p.left + EDGE_PAD && s.x < p.right - EDGE_PAD)
            || s.platforms[s.platforms.length - 1]
            || s.platforms[0];
          if (home) {
            s.x = Math.min(Math.max(s.x, home.left + EDGE_PAD + 1), home.right - EDGE_PAD - 1);
            s.y = home.top;
            s.vy = 0; s.vx = 0;
            s.grounded = true;
            s.squash = 1;
            setPhaseOnce('grounded');
          }
        }
      }

      // cursor proximity
      const dx = s.cursor.x - s.x;
      const dy = s.cursor.y - (s.y - bodyH / 2);
      const near = Math.hypot(dx, dy) < NOTICE_RADIUS;
      if (near !== noticeRef.current) {
        noticeRef.current = near;
        setNoticing(near);
        if (near && now - s.lastGreet > GREET_MS + GREET_DEBOUNCE) {
          s.lastGreet = now;
          setGreeting(now); // timestamp doubles as "pick a new line"
        }
      }
      if (near && s.grounded && Math.abs(dx) > 12) {
        s.facing = Math.sign(dx);
      }

      render();
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    window.addEventListener('resize', measure);
    window.addEventListener('pointermove', onPointer, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      timers.forEach(window.clearTimeout);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [containerRef, actorRef, bodyRef, footprint]);

  return { phase, noticing, greeting, platformCount, greetMs: GREET_MS };
}

export default useAvatarLife;
