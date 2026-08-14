import { createRng } from './rng';
import {
  createWorld, mintId, schedule, addChronicle, PLACES, EMPTY_RESOURCES
} from './state';
import {
  ERAS, ERA_BOUNDARIES, CYCLE_SECONDS, DAY_SECONDS, HOUR, getEra, eraAt
} from './data/eras';
import { getAction, PRIMARY_YIELD } from './data/actions';
import { getStructure, affordable, biggestShortfall } from './data/structures';
import { NAMES, ROLES, ROLE_ERA, LIFESPAN_HOURS, POPULATION_CAP } from './data/people';

/**
 * The simulation.
 *
 * EVENT-DRIVEN, not fixed-timestep. A 0.25s step across a 30-day cycle would be
 * ten million iterations on page load; jumping event to event is ~170,000, which
 * runs in milliseconds. Rendering interpolates the in-flight action between events.
 *
 * `state.elapsed` is MONOTONIC seconds since the world's epoch and never resets,
 * across any number of cycles. Everything cycle-relative derives from
 * `elapsed - cycleStart`. An earlier draft reset elapsed on collapse and it made
 * multi-cycle advancement incoherent — don't reintroduce that.
 *
 * Pure with respect to the outside world: no Math.random, no Date.now, no DOM.
 * Time arrives as an argument. See docs/tuk-world.md §2.
 */

export const timeInCycle = (state) => state.elapsed - state.cycleStart;

/** Day within the current cycle. Cosmetic (§3.2). */
export const dayNumber = (state) => Math.floor(timeInCycle(state) / DAY_SECONDS) + 1;

/** 0 = midnight, 0.5 = noon. */
export const dayPhase = (elapsed) => (elapsed % DAY_SECONDS) / DAY_SECONDS;

export const isNight = (elapsed) => {
  const p = dayPhase(elapsed);
  return p < 0.22 || p > 0.78;
};

// ── helpers ─────────────────────────────────────────────────────────────────

function pickName(state, rng) {
  const taken = new Set(state.npcs.map((n) => n.name));
  const free = NAMES.filter((n) => !taken.has(n));
  // Generations reuse names once the previous holder is gone. That's realistic,
  // and it lands hard when Tuk mentions burying two people with the same name.
  return rng.pick(free.length ? free : NAMES);
}

function pickRole(rng, eraId) {
  const allowed = ROLES.filter((r) => (ROLE_ERA[r] || 99) <= eraId);
  return rng.pick(allowed.length ? allowed : ['forager']);
}

function nextStructure(state) {
  const era = getEra(state.era);
  const built = new Set(state.structures.map((s) => s.type));
  return era.structures.find((t) => !built.has(t)) || null;
}

function actionForResource(state, resource, rng) {
  const era = getEra(state.era);
  const direct = era.actions.filter((a) => PRIMARY_YIELD[a] === resource);
  if (direct.length) return rng.pick(direct);
  const anyGather = era.actions.filter((a) => PRIMARY_YIELD[a]);
  return anyGather.length ? rng.pick(anyGather) : 'rest';
}

// ── deciding what Tuk does next ──────────────────────────────────────────────

/**
 * Priority: bury the dead, then build what's affordable, then gather toward
 * whatever the next build is short of, then rest.
 *
 * Burial coming first is a design statement, not an optimisation.
 */
function chooseAction(state, rng) {
  if (state.pendingBurials > 0) return { type: 'bury' };

  const target = nextStructure(state);
  if (target) {
    if (affordable(state.resources, target)) return { type: 'build', build: target };
    const short = biggestShortfall(state.resources, target);
    if (short) return { type: actionForResource(state, short, rng) };
  }

  /**
   * Nothing left to build in this era, so he stops gathering entirely.
   *
   * He accumulates only in service of a goal. Two earlier attempts got this
   * wrong: gathering at 85% banked 4,000+ wood in two idle hours, and damping to
   * 30% still banked 2,300 — over a six-hour era there are ~2,000 actions, so no
   * probability is low enough. Hoarding made the next era instantly affordable
   * and turned pacing into burst-then-nothing.
   *
   * ⚠️ The consequence is that an era whose structures run out early has Tuk
   * resting for the remainder, which reads as idle. That is a CONTENT gap, not a
   * sim bug: every era needs enough to build to fill its duration. See
   * docs/tuk-world.md §13. Resource consumption — villagers eating — is probably
   * the proper long-term fix, since it gives gathering permanent purpose.
   */
  return { type: 'rest' };
}

function startAction(state, rng) {
  const choice = chooseAction(state, rng);
  const action = getAction(choice.type);

  let duration = action.seconds;
  let structureId = null;

  if (choice.type === 'build' && choice.build) {
    const def = getStructure(choice.build);
    duration = def.seconds;
    structureId = mintId(state, 'st');
    state.structures.push({
      id: structureId,
      type: choice.build,
      x: def.x,
      startedAt: state.elapsed,
      builtAt: null,
      state: 'building'
    });
    state.tuk.x = def.x;
  } else {
    const spot = PLACES[action.where];
    if (spot !== null && spot !== undefined) state.tuk.x = spot;
  }

  state.tuk.action = { type: choice.type, startedAt: state.elapsed, duration, structureId };
  schedule(state, state.elapsed + duration, 'tuk:done');
}

// ── events ───────────────────────────────────────────────────────────────────

function onTukDone(state, rng) {
  const done = state.tuk.action;
  if (!done) { startAction(state, rng); return; }

  const action = getAction(done.type);
  Object.entries(action.yields).forEach(([res, amount]) => {
    state.resources[res] = (state.resources[res] || 0) + amount;
  });

  if (done.type === 'build' && done.structureId) {
    const s = state.structures.find((x) => x.id === done.structureId);
    if (s) {
      s.state = 'standing';
      s.builtAt = state.elapsed;
      const def = getStructure(s.type);
      Object.entries(def.cost).forEach(([res, amount]) => {
        state.resources[res] = Math.max((state.resources[res] || 0) - amount, 0);
      });
      state.resources.knowledge += 1;
      addChronicle(state, dayNumber(state), `${def.label} was finished.`);
    }
  }

  if (done.type === 'bury' && state.pendingBurials > 0) state.pendingBurials -= 1;

  state.tuk.action = null;
  startAction(state, rng);
}

function scheduleArrivals(state, rng) {
  const room = (POPULATION_CAP[state.era] || 0) - state.npcs.length;
  if (room <= 0) return;
  const window = getEra(state.era).hours * HOUR;
  for (let i = 0; i < room; i += 1) {
    schedule(state, state.elapsed + rng.float(0.05, 0.85) * window, 'npc:arrive');
  }
}

function onEraNext(state, rng) {
  const nextEra = state.era + 1;
  if (nextEra > ERAS.length) return;

  state.era = nextEra;
  addChronicle(state, dayNumber(state), `The ${getEra(nextEra).name} era began.`);

  if (nextEra < ERAS.length) {
    schedule(state, state.cycleStart + ERA_BOUNDARIES[nextEra - 1], 'era:next');
  } else {
    schedule(state, state.cycleStart + CYCLE_SECONDS, 'cycle:reset');
  }

  scheduleArrivals(state, rng);
}

function onNpcArrive(state, rng) {
  if (state.npcs.length >= (POPULATION_CAP[state.era] || 0)) return;

  const id = mintId(state, 'n');
  const name = pickName(state, rng);
  const isFirstEver = state.cycle === 1 && state.graves.length === 0 && state.npcs.length === 0;
  const role = isFirstEver ? 'wanderer' : pickRole(rng, state.era);
  const lifespan = rng.float(LIFESPAN_HOURS.min, LIFESPAN_HOURS.max) * HOUR;

  state.npcs.push({
    id, name, role,
    bornAt: state.elapsed,
    lifespan,
    x: rng.float(-360, 360),
    firstEver: isFirstEver
  });

  addChronicle(
    state,
    dayNumber(state),
    isFirstEver
      ? `A wanderer arrived from the east and stayed. Tuk called him ${name}.`
      : `${name} the ${role} joined the settlement.`
  );

  schedule(state, state.elapsed + lifespan, 'npc:die', { id });
}

function onNpcDie(state, rng, data) {
  const idx = state.npcs.findIndex((n) => n.id === (data && data.id));
  if (idx === -1) return;

  const npc = state.npcs[idx];
  state.npcs.splice(idx, 1);

  state.graves.push({
    id: mintId(state, 'g'),
    name: npc.name,
    role: npc.role,
    bornAt: npc.bornAt,
    diedAt: state.elapsed,
    cycle: state.cycle,
    x: PLACES.graveyard - state.graves.length * 22
  });

  state.tuk.buried += 1;
  state.pendingBurials += 1;

  addChronicle(
    state,
    dayNumber(state),
    npc.firstEver
      ? `${npc.name} died old. Tuk buried the first friend he ever had.`
      : `${npc.name} the ${npc.role} died. Tuk buried them.`
  );

  if (state.npcs.length < (POPULATION_CAP[state.era] || 0)) {
    schedule(state, state.elapsed + rng.float(1, 6) * HOUR, 'npc:arrive');
  }
}

function onCycleReset(state, rng) {
  // Memory survives; materials don't. See docs/tuk-world.md §5.
  state.ruins = state.ruins.concat(
    state.structures
      .filter((s) => s.state === 'standing')
      .map((s) => ({ type: s.type, x: s.x, cycle: state.cycle }))
  );

  addChronicle(
    state,
    dayNumber(state),
    'Everything they built came apart. Tuk was the only thing left standing.'
  );

  const keptKnowledge = state.resources.knowledge;

  state.cycle += 1;
  state.cycleStart = state.elapsed;
  state.era = 1;
  state.structures = [];
  state.npcs = [];
  state.pendingBurials = 0;
  state.resources = { ...EMPTY_RESOURCES, knowledge: keptKnowledge };
  state.tuk.action = null;
  state.tuk.x = 0;

  addChronicle(state, 1, `Cycle ${state.cycle}. He began again.`);

  schedule(state, state.cycleStart + ERA_BOUNDARIES[0], 'era:next');
  startAction(state, rng);
}

// ── the loop ─────────────────────────────────────────────────────────────────

function applyEvent(state, event, rng) {
  switch (event.type) {
    case 'tuk:done':    return onTukDone(state, rng);
    case 'era:next':    return onEraNext(state, rng);
    case 'npc:arrive':  return onNpcArrive(state, rng);
    case 'npc:die':     return onNpcDie(state, rng, event.data);
    case 'cycle:reset': return onCycleReset(state, rng);
    default:            return undefined;
  }
}

const EVENT_GUARD = 8_000_000;

/**
 * Advance to `target` seconds since the epoch. Mutates and returns state.
 * Deterministic: identical (seed, target) always produces an identical world.
 */
export function advanceTo(state, target) {
  const rng = createRng(state.rngCursor);
  let guard = 0;

  while (state.queue.length && state.queue[0].at <= target) {
    if (guard > EVENT_GUARD) {
      throw new Error('advanceTo: event guard tripped — likely a zero-duration action loop');
    }
    guard += 1;

    const event = state.queue.shift();
    state.elapsed = event.at;
    applyEvent(state, event, rng);
  }

  state.elapsed = Math.max(state.elapsed, target);
  state.era = eraAt(timeInCycle(state));
  state.rngCursor = rng.cursor();
  state.events = guard;
  return state;
}

/** Seed the queue and start Tuk's first action. */
export function bootstrap(state) {
  const rng = createRng(state.rngCursor);
  schedule(state, ERA_BOUNDARIES[0], 'era:next');
  startAction(state, rng);
  state.rngCursor = rng.cursor();
  return state;
}

/**
 * The whole world, from a seed and a wall-clock elapsed time.
 * The single entry point every view uses.
 */
export function worldAt(seed, elapsedSeconds) {
  const state = bootstrap(createWorld(seed));
  return advanceTo(state, Math.max(elapsedSeconds, 0));
}

/** Progress 0..1 through the in-flight action, for the renderer to interpolate. */
export function actionProgress(state) {
  const a = state.tuk.action;
  if (!a || !a.duration) return 0;
  return Math.min(Math.max((state.elapsed - a.startedAt) / a.duration, 0), 1);
}
