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
const GOAL_TOLERANCE = 9;    // px — close enough to call it arrived
const GOAL_REST = 140;       // ms between hops on a directed journey — brisk
const NOTICE_RADIUS = 170;   // px — cursor proximity that makes him look up
const GREET_MS = 2600;       // how long a hello lasts
const GREET_DEBOUNCE = 300;  // ignore cursor jitter at the boundary

/**
 * ── The hovercraft ──────────────────────────────────────────────────────
 * He boards when the cursor LINGERS on him, follows it until you CLICK, and
 * never leaves the air he's allowed to occupy. Each of those three is a fix for
 * something that was wrong first time round; the constants below say why.
 *
 * Takeoff radius, much tighter than the notice radius. Boarding is a decision,
 * so it wants the cursor roughly ON him; 170px means "I can see you", which is
 * right for a wave and far too eager for launching a vehicle.
 */
const FLY_RADIUS = 100;
const FLY_ENTER_MS = 650;    // cursor has to stay close this long

/**
 * A CLICK ends the flight, or lifting your finger on a touch screen. Not
 * distance: he flies to the cursor, so "the cursor is far away" stops being true
 * the moment he starts chasing, and he would circle forever. Not stillness
 * either, which punishes you for pausing to read.
 *
 * The idle timeout below is only a safety net for someone who wanders off with
 * the pointer parked on him, not the intended way down.
 */
const FLY_IDLE_MS = 9000;
const FLY_CHASE = 3.4;       // lerp rate; the lag is what reads as trying to catch it
const FLY_OFF_Y = 28;        // his feet below the pointer, so it sits at his screen
const FLY_BOB = 3.2;         // px of idle hover

/**
 * He must never sink into his own floor. His target is below the pointer, and a
 * pointer near the bottom of the window therefore aims underground: unclamped, he
 * dove 20px through the floor and rose again every time the cursor moved down,
 * which reads exactly like hopping on and off the ground while hovering.
 */
/**
 * ── The camera ──────────────────────────────────────────────────────────
 * The room is a fixed-width world, so on a narrow screen it is wider than the
 * viewport and has to be panned, dino-game style, to keep him in view. This is
 * what lets a phone see the whole house — and every beat and every line — instead
 * of the three zones that used to survive the breakpoints.
 *
 * He is kept out of the outer fifth of the screen rather than pinned to the
 * centre: centring means the room slides under every hop, which reads as the
 * world lurching rather than a camera following him.
 */
const CAM_DEAD_ZONE = 0.2;   // fraction of the viewport kept clear at each edge
const CAM_EASE = 3.4;        // lerp rate; slower than he moves, so it trails

const FLY_CLEARANCE = 14;
const FLY_HEADROOM = 10;     // keep his head inside the viewport too

/**
 * Catching the cursor is how a flight ENDS, and it is a game you can lose by
 * holding still. He closes about 95% of the gap in a second, so keeping him
 * chasing means keeping the pointer moving; slow down and he gets you.
 *
 * The minimum flight time matters: the cursor is already on him at takeoff, which
 * is what boarded him, so without it he would catch it on the first frame every
 * time and never leave the ground.
 */
const FLY_MIN_MS = 1400;
/**
 * Touch has two gestures on one pair of events, and they need telling apart.
 * A press-and-drag should end when you let go — that is the model. But a TAP is
 * a down and an up about a hundred milliseconds apart, so treating every release
 * as "let go" made a tap board him and land him again inside a blink, which
 * reads as a glitch rather than an interaction.
 *
 * Under this threshold the release is ignored: he boards and stays, catches your
 * finger a moment later, celebrates and takes himself home. Over it, you were
 * dragging, and letting go means what it says.
 */
const TAP_MS = 400;
const CATCH_RADIUS = 26;
const CELEBRATE_MS = 1500;

export function useAvatarLife({
  containerRef,
  actorRef,
  bodyRef,
  footprint = 64,
  /**
   * Launch speed for level hops, and so the hop's height: rise is vy²/2g.
   * The default clears 62px, which is right in an open world and far too big
   * inside a 100px-tall ribbon — pass a gentler value there.
   */
  hopVy = HOP_VY,
  /**
   * Directed movement. The caller posts `{ x, instant }` and the loop hops there,
   * then bumps `arrivals`. A ref rather than a callback so the loop reads it
   * without re-running this effect, and arrival is a counter rather than a
   * boolean because a boolean can't distinguish "not moving yet" from "done".
   */
  goalRef = null,
  /**
   * Idle drifting. Off automatically whenever someone is directing him: once he
   * arrives his goal clears, and ambient hops would then carry him away from the
   * kettle he walked over to use. Standing still through a chore is correct —
   * breathing, blinking and the gesture's own animation carry the life.
   */
  wander = !goalRef,
  /** Opt in to the hovercraft. Off by default so the labs keep him on the ground. */
  fly = false
}) {
  const [phase, setPhase] = useState('grounded');
  const [noticing, setNoticing] = useState(false);
  /**
   * Fires on the RISING EDGE of proximity, so the caller can show a fresh
   * greeting each approach. Debounced only enough to survive cursor jitter at
   * the radius boundary — not rationed.
   */
  const [greeting, setGreeting] = useState(0);
  const [platformCount, setPlatformCount] = useState(0);
  /** Increments once each time a directed move completes. */
  const [arrivals, setArrivals] = useState(0);
  /**
   * 'chase' | 'caught' | 'return' | null. A phase rather than a boolean because
   * the caller has to pose and speak differently in each: chasing, celebrating,
   * and heading home are three different characters.
   */
  const [flightPhase, setFlightPhase] = useState(null);
  const flightRef = useRef(null);

  const sim = useRef({
    x: 0, y: 0, vx: 0, vy: 0,
    grounded: true, facing: 1, squash: 1,
    restTimer: 1000, platforms: [], bounds: { w: 0, h: 0 },
    cursor: { x: -9999, y: -9999 }, started: false, lastGreet: 0,
    goal: null, adopted: null, goalFacing: 1, lastMove: 0, rearm: true,
    viewTop: 0, viewLeft: 0, viewportW: 0, floorTop: 0, flyStart: 0, caughtAt: 0,
    cam: 0, viewW: 0, touchAt: 0,
    /**
     * Whether anyone has told him where to stand yet. False only while a caller
     * with a goalRef owes him a position; without one, `measure` places him and he
     * counts as placed from the start.
     *
     * This exists because the first placement used to be a race. measure() drops
     * him in the middle of the floor, and the teleport meant to correct that was
     * gated on a flag inside useRoutine — which StrictMode's double mount consumed
     * before the loop had run a single frame, so the surviving goal was an ordinary
     * walk and he strolled across the room to go to bed, asleep. The physics
     * decides now: the first directed placement is ALWAYS instant, and he is not
     * drawn at all until it has happened.
     */
    placed: !goalRef,
    /**
     * Height above his standing surface, eased. Render-only: the simulation still
     * has him on the floor.
     *
     * This is how sitting works, and why it needed no new artwork. Sit him at the
     * cushion's own height and he reads as standing ON the sofa. Lift him just
     * 10px instead and his legs fall inside the band the sofa's front layer
     * covers, so the cushion hides them and he reads as sunk into the seat. Doing
     * it in the renderer rather than the physics also avoids making the seat a
     * landable platform, which would have caught him every time he hopped past
     * the sofa on his way somewhere else.
     */
    lift: 0, targetLift: 0,
    mode: 'ground', nearMs: 0, farMs: 0, bob: 0, bobY: 0,
    home: { x: 0, y: 0 }
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
    /**
     * Distance from the top of his SVG to his FEET — not to the bottom of the
     * viewBox. His leg strokes end at y=63 of 67 and a round cap adds ~1, so
     * treating the viewBox bottom as his soles left him hovering ~3px above every
     * surface: not obviously broken, just subtly untethered.
     */
    const bodyH = Math.round((footprint * (67 - 3)) / 60);
    /**
     * How far a level hop can actually carry him: flight time × top speed.
     * Derived rather than hardcoded, because asking for a longer step than this
     * only clamps vx and undershoots — the two numbers have to agree, and they
     * silently disagreed once hop height became configurable.
     */
    const hopReach = ((-2 * hopVy) / GRAVITY) * MAX_VX;
    const timers = [];

    /**
     * Dev-only handle on the live simulation. Motion bugs are invisible to
     * sampling from outside — a bounce lasting three frames hides between
     * 200ms probes — so the internals have to be readable frame by frame.
     * Compiled out of production by NODE_ENV substitution.
     */
    if (process.env.NODE_ENV === 'development') window.__tuk = s;

    const setPhaseOnce = (p) => {
      if (phaseRef.current !== p) { phaseRef.current = p; setPhase(p); }
    };
    const setPhaseFlight = (v) => {
      if (flightRef.current !== v) { flightRef.current = v; setFlightPhase(v); }
    };

    /** Harvest standable surfaces from the real DOM. */
    const measure = () => {
      const host = containerRef.current;
      if (!host) return;
      const cRect = host.getBoundingClientRect();
      const platforms = [];
      host.querySelectorAll('[data-avatar-platform]').forEach((el) => {
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
      // The world's width is cRect; the WINDOW onto it is the parent's. The camera
      // needs both, and they differ only on screens narrower than the room.
      s.viewW = host.parentElement ? host.parentElement.clientWidth : cRect.width;
      /**
       * Flight limits, in the same container-relative space as everything else.
       * These describe the WINDOW, not the container, and that distinction is the
       * whole point: the container used to be a full-width strip, and is now a
       * 110px corner widget. Clamping flight to it caged him in the corner.
       */
      s.viewTop = -cRect.top;
      s.viewLeft = -cRect.left;
      s.viewportW = document.documentElement.clientWidth;
      if (platforms.length) s.floorTop = platforms[platforms.length - 1].top;
      setPlatformCount(platforms.length);

      if (!s.started && platforms.length) {
        const p = platforms[0];
        s.x = (p.left + p.right) / 2;
        s.y = p.top;
        s.grounded = true;
        s.started = true;
        return;
      }

      /**
       * Re-seat a standing character on the surface he is actually on. `s.y` was
       * previously derived only at first measure, so a window resize or a
       * responsive breakpoint moved the floor while he kept standing at the old
       * height — in mid-air until his next hop happened to correct it.
       *
       * Matched on the smallest change in height, not on x, so a character
       * standing on an upper shelf stays on that shelf instead of teleporting.
       */
      // Not while he's airborne under his own power: re-seating him mid-flight
      // hauls him back to the floor twice a second and he never gets off the ground.
      if (s.started && s.grounded && s.mode === 'ground' && platforms.length) {
        const seat = platforms.reduce(
          (best, p) => (Math.abs(p.top - s.y) < Math.abs(best.top - s.y) ? p : best),
          platforms[0]
        );
        s.y = seat.top;
        s.x = Math.min(Math.max(s.x, seat.left + EDGE_PAD), seat.right - EDGE_PAD);
      }
    };

    /**
     * Reads the refs every frame rather than closing over the nodes captured at
     * mount. That matters: a structural edit to the JSX can make React reuse the
     * old actor element for a different sibling and hand the ref a brand new
     * node, while this effect — whose deps haven't changed — keeps writing
     * transforms into the element it captured. The character then sits
     * unpositioned while something else silently carries his coordinates.
     * Re-reading is free and makes the loop self-healing.
     */
    const render = () => {
      const actorNow = actorRef.current;
      const bodyNow = bodyRef.current;
      if (!actorNow || !bodyNow) return;

      // The camera goes on the container, which is why the rest of the simulation
      // needs no changes: every coordinate here is measured relative to this same
      // element, so the pan cancels out of all of them.
      const host = containerRef.current;
      if (host) host.style.transform = `translateX(${(-s.cam).toFixed(2)}px)`;

      // Never show him standing somewhere nobody chose. A single frame in the
      // middle of the room reads as a glitch even when the next frame fixes it.
      const wanted = s.placed ? 'visible' : 'hidden';
      if (actorNow.style.visibility !== wanted) actorNow.style.visibility = wanted;

      actorNow.style.transform =
        `translate(${(s.x - halfW).toFixed(2)}px, ${(s.y - bodyH - s.lift + s.bobY).toFixed(2)}px)`;
      bodyNow.style.transform =
        `scaleX(${s.facing}) scaleY(${s.squash.toFixed(3)})`;
      // Published as an attribute rather than React state so the speech bubble
      // can flip sides in CSS without a re-render on every direction change.
      const f = s.facing < 0 ? '-1' : '1';
      if (actorNow.dataset.facing !== f) actorNow.dataset.facing = f;
    };

    measure();
    render();

    if (reduce) {
      setPhaseOnce('grounded');
      return () => {};
    }

    const onPointer = (e) => {
      const host = containerRef.current;
      if (!host) return;
      const cRect = host.getBoundingClientRect();
      s.cursor = { x: e.clientX - cRect.left, y: e.clientY - cRect.top };
      s.lastMove = performance.now();
    };

    /** Pointer left the window entirely: end the flight rather than wait it out. */
    const onLeave = () => {
      s.cursor = { x: -9999, y: -9999 };
      if (s.mode !== 'ground') land();
    };

    /**
     * A click puts him down. On a touch screen the equivalent is lifting your
     * finger, and there he boards on touch-down rather than on a dwell, because a
     * tap is already deliberate and there is no hover to linger with.
     */
    const onDown = (e) => {
      /**
       * Seed the pointer position here, not only on move. A tap fires no
       * pointermove at all, so on touch the chase target was still the stale
       * off-screen cursor: he boarded, flew at nothing, and never caught the
       * finger that summoned him.
       */
      const host = containerRef.current;
      if (host) {
        const r = host.getBoundingClientRect();
        s.cursor = { x: e.clientX - r.left, y: e.clientY - r.top };
        s.lastMove = performance.now();
      }

      if (s.mode !== 'ground') { land(); return; }
      if (e.pointerType !== 'touch') return;
      if (Math.hypot(s.cursor.x - s.x, s.cursor.y - (s.y - bodyH / 2)) < FLY_RADIUS) {
        board();
        s.touchAt = performance.now();
      }
    };

    const onUp = (e) => {
      if (e.pointerType !== 'touch' || s.mode === 'ground') return;
      if (performance.now() - s.touchAt > TAP_MS) land();
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
        vy = hopVy;
        // y + vy t + ½gt² = ty  →  positive root
        const drop = -dy; // how far below us the target is
        const disc = vy * vy + 2 * GRAVITY * drop;
        flight = (-vy + Math.sqrt(Math.max(disc, 0))) / GRAVITY;
      }

      const vx = Math.max(Math.min((tx - s.x) / Math.max(flight, 0.05), MAX_VX), -MAX_VX);
      return { vx, vy };
    };

    /** Board the hovercraft from wherever he is standing. */
    const board = () => {
      if (!fly || s.mode !== 'ground') return;
      s.home = { x: s.x, y: s.y };
      s.mode = 'fly';
      s.grounded = false;
      s.lastMove = performance.now();
      s.flyStart = performance.now();
      s.bob = 0;
      s.targetLift = 0;
      setPhaseFlight('chase');
    };

    /**
     * Head home. `rearm` is cleared so he cannot board again until the cursor has
     * left his radius: come down with the pointer still resting on him and the
     * dwell test passes on the very next frame, which is a robot that yo-yos off
     * the floor for as long as you hold still.
     */
    const land = () => {
      if (s.mode === 'ground' || s.mode === 'return') return;
      s.mode = 'return';
      s.rearm = false;
      setPhaseFlight('return');
      const floor = s.platforms[s.platforms.length - 1];
      if (floor) s.home.y = floor.top;
    };

    /** The surface he is standing on, if any. */
    const platformHere = () => s.platforms.find(
      (p) => Math.abs(p.top - s.y) < 2 && s.x >= p.left && s.x <= p.right
    );

    /**
     * Take on a directed destination. `instant` teleports — used for the very
     * first placement, so a visitor never watches him cross the room before his
     * day starts.
     */
    const adoptGoal = (req) => {
      s.adopted = req;
      const here = platformHere() || s.platforms[0];
      if (!here) return;
      const x = Math.min(Math.max(req.x, here.left + EDGE_PAD), here.right - EDGE_PAD);

      s.goalFacing = req.facing || 1;
      s.targetLift = req.lift || 0;

      if (req.instant || !s.placed) {
        s.x = x;
        s.y = here.top;
        s.vx = 0; s.vy = 0;
        s.grounded = true;
        s.goal = null;
        s.facing = s.goalFacing;
        s.placed = true;
        setArrivals((n) => n + 1);
        return;
      }
      s.placed = true;
      s.goal = x;
      if (s.grounded) s.restTimer = Math.min(s.restTimer, GOAL_REST);
    };

    /** One hop of a directed journey, or arrival. */
    const hopToGoal = () => {
      const here = platformHere();
      const dx = s.goal - s.x;
      if (!here || Math.abs(dx) <= GOAL_TOLERANCE) {
        s.goal = null;
        // Turn to whatever he came here to use. Cursor proximity still overrides
        // this — he looks at you before he looks at the kettle.
        s.facing = s.goalFacing || 1;
        s.restTimer = REST_MIN;
        setArrivals((n) => n + 1);
        return;
      }
      const reach = Math.min(Math.abs(dx), hopReach * 0.92);
      const tx = Math.min(
        Math.max(s.x + Math.sign(dx) * reach, here.left + EDGE_PAD),
        here.right - EDGE_PAD
      );
      const { vx, vy } = launchToward(tx, here.top);
      s.vx = vx;
      s.vy = vy;
      if (Math.abs(vx) > 8) s.facing = Math.sign(vx);
      s.grounded = false;
      s.squash = 1.14;
      setPhaseOnce('airborne');
    };

    /** Ambient wandering: pick somewhere plausible and hop at it. */
    const chooseHop = () => {
      const here = platformHere();

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
        const stride = hopReach * (0.42 + Math.random() * 0.5);
        target = {
          x: Math.min(Math.max(s.x + dir * stride, here.left + EDGE_PAD), here.right - EDGE_PAD),
          y: here.top
        };
      } else {
        target = { x: s.x + (Math.random() < 0.5 ? -1 : 1) * hopReach * 0.6, y: s.y };
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

      // A destination posted by the caller outranks ambient wandering.
      const req = goalRef && goalRef.current;
      if (req && req !== s.adopted) adoptGoal(req);

      // Sitting down and standing up, eased so it reads as a movement.
      s.lift += (s.targetLift - s.lift) * Math.min(dt * 7, 1);

      /**
       * Pan to keep him on screen. Nothing to do when the room fits, which is why
       * desktop is untouched: `span` is zero there and the camera stays at rest.
       */
      const span = s.bounds.w - s.viewW;
      if (span > 1) {
        const dead = s.viewW * CAM_DEAD_ZONE;
        const onScreen = s.x - s.cam;
        let want = s.cam;
        if (onScreen < dead) want = s.x - dead;
        else if (onScreen > s.viewW - dead) want = s.x - (s.viewW - dead);
        want = Math.min(Math.max(want, 0), span);
        s.cam += (want - s.cam) * Math.min(dt * CAM_EASE, 1);
      } else if (s.cam !== 0) {
        s.cam += (0 - s.cam) * Math.min(dt * CAM_EASE, 1);
        if (Math.abs(s.cam) < 0.5) s.cam = 0;
      }

      /**
       * Cursor proximity, resolved BEFORE anything moves — takeoff, catching and
       * landing all depend on where the pointer is and how long it has been there,
       * so this cannot live at the end of the frame the way it used to.
       */
      const dx = s.cursor.x - s.x;
      const dy = s.cursor.y - (s.y - bodyH / 2);
      const dist = Math.hypot(dx, dy);
      const near = dist < NOTICE_RADIUS;   // close enough to look up and wave
      const onHim = dist < FLY_RADIUS;     // close enough to mean it
      if (onHim) {
        s.nearMs += dt * 1000;
      } else {
        s.nearMs = 0;
        s.rearm = true;
      }

      if (near !== noticeRef.current) {
        noticeRef.current = near;
        setNoticing(near);
        if (near && now - s.lastGreet > GREET_MS + GREET_DEBOUNCE) {
          s.lastGreet = now;
          setGreeting(now); // timestamp doubles as "pick a new line"
        }
      }
      if (near && s.grounded && s.mode === 'ground' && Math.abs(dx) > 12) {
        s.facing = Math.sign(dx);
      }

      // Board once the cursor has dwelt on him, and only if it has left since he
      // last came down.
      if (s.grounded && s.rearm && s.nearMs > FLY_ENTER_MS) board();

      /**
       * Flight bypasses the ground simulation entirely: no gravity, no hops, no
       * goals. Three phases, because they are three different characters —
       * chasing the cursor, celebrating having caught it, and heading home.
       */
      if (s.mode !== 'ground') {
        const k = Math.min(dt * FLY_CHASE, 1);
        // The air he is allowed to occupy: feet clear of the floor by more than
        // the hover bob, head inside the window, body inside the width.
        const lowest = (s.floorTop || 0) - FLY_CLEARANCE - FLY_BOB;
        const highest = (s.viewTop || 0) + bodyH + FLY_HEADROOM;
        const clampY = (v) => Math.min(Math.max(v, highest), lowest);
        // The whole window is his while airborne — he is chasing a cursor that can
        // be anywhere, so the walls are the window's, not his widget's.
        const flyLeft = s.viewLeft + halfW;
        const flyRight = s.viewLeft + (s.viewportW || s.bounds.w) - halfW;
        const clampX = (v) => Math.min(Math.max(v, flyLeft), Math.max(flyRight, flyLeft));

        if (s.mode === 'fly') {
          const tx = clampX(s.cursor.x);
          const ty = clampY(s.cursor.y + FLY_OFF_Y);
          s.x = clampX(s.x + (tx - s.x) * k);
          s.y = clampY(s.y + (ty - s.y) * k);
          if (Math.abs(tx - s.x) > 14) s.facing = Math.sign(tx - s.x);

          const gap = Math.hypot(s.cursor.x - s.x, s.cursor.y - (s.y - bodyH / 2));
          if (now - s.flyStart > FLY_MIN_MS && gap < CATCH_RADIUS) {
            s.mode = 'caught';
            s.caughtAt = now;
            setPhaseFlight('caught');
          } else if (now - s.lastMove > FLY_IDLE_MS) {
            land();  // safety net for a pointer parked on him and abandoned
          }
        } else if (s.mode === 'caught') {
          // Holds where he caught it; the pose and the line do the celebrating.
          if (now - s.caughtAt > CELEBRATE_MS) land();
        } else {
          const tx = clampX(s.home.x);
          s.x += (tx - s.x) * k;
          s.y += (s.home.y - s.y) * k;   // home IS the floor, so no clamp here
          if (Math.abs(tx - s.x) > 14) s.facing = Math.sign(tx - s.x);
          if (Math.hypot(s.home.x - s.x, s.home.y - s.y) < 5) {
            s.x = s.home.x;
            s.y = s.home.y;
            s.bobY = 0;
            s.mode = 'ground';
            s.grounded = true;
            s.restTimer = REST_MIN;
            setPhaseFlight(null);
          }
        }

        s.bob += dt;
        s.bobY = s.mode === 'ground' ? 0 : Math.sin(s.bob * 2.6) * FLY_BOB;
        s.squash += (1 - s.squash) * Math.min(dt * 8, 1);
        render();
        raf = requestAnimationFrame(step);
        return;
      }

      if (s.grounded) {
        s.restTimer -= dt * 1000;
        s.squash += (1 - s.squash) * Math.min(dt * 12, 1);
        if (s.restTimer <= 0) {
          if (s.goal !== null) {
            hopToGoal();
          } else if (wander) {
            s.restTimer = REST_MIN + Math.random() * (REST_MAX - REST_MIN);
            chooseHop();
          } else {
            s.restTimer = GOAL_REST; // check again shortly for a new destination
          }
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
            // Mid-journey he barely pauses; idling he takes his time.
            s.restTimer = s.goal !== null
              ? GOAL_REST
              : REST_MIN + Math.random() * (REST_MAX - REST_MIN);
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

      render();
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    window.addEventListener('resize', measure);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      timers.forEach(window.clearTimeout);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [containerRef, actorRef, bodyRef, footprint, hopVy, goalRef, wander, fly]);

  return {
    phase,
    noticing,
    greeting,
    platformCount,
    arrivals,
    flightPhase,
    flying: flightPhase !== null,
    greetMs: GREET_MS
  };
}

export default useAvatarLife;
