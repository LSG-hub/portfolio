import { worldAt, advanceTo, bootstrap, timeInCycle, dayPhase, isNight } from './simulate';
import { createWorld } from './state';
import { createRng, hashSeed, stableUnit } from './rng';
import { CYCLE_SECONDS, ERA_BOUNDARIES, HOUR, ERAS } from './data/eras';

const DAY = 24 * HOUR;

/**
 * Determinism is the property the entire global world rests on. If these fail,
 * every visitor is looking at a different Tuk. Treat a failure here as a stop-work.
 */
describe('rng', () => {
  it('is stable for a given seed', () => {
    const a = createRng(hashSeed('abc'));
    const b = createRng(hashSeed('abc'));
    const seqA = [a.next(), a.next(), a.next()];
    const seqB = [b.next(), b.next(), b.next()];
    expect(seqA).toEqual(seqB);
  });

  it('differs between seeds', () => {
    const a = createRng(hashSeed('abc'));
    const b = createRng(hashSeed('abd'));
    expect(a.next()).not.toEqual(b.next());
  });

  it('stays inside range', () => {
    const r = createRng(hashSeed('range'));
    for (let i = 0; i < 500; i += 1) {
      const v = r.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      expect(r.int(3, 7)).toBeGreaterThanOrEqual(3);
    }
  });

  it('derives stable per-entity values without touching world state', () => {
    expect(stableUnit('n-12', 'height')).toEqual(stableUnit('n-12', 'height'));
    expect(stableUnit('n-12', 'height')).not.toEqual(stableUnit('n-13', 'height'));
  });
});

describe('determinism', () => {
  it('produces identical worlds from identical inputs', () => {
    const a = worldAt('seed-one', 3 * DAY);
    const b = worldAt('seed-one', 3 * DAY);
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b));
  });

  it('produces different worlds from different seeds', () => {
    const a = worldAt('seed-one', 3 * DAY);
    const b = worldAt('seed-two', 3 * DAY);
    expect(JSON.stringify(a)).not.toEqual(JSON.stringify(b));
  });

  it('reaches the same state whether advanced in one jump or many', () => {
    const target = 2 * DAY;

    const oneJump = worldAt('stepwise', target);

    const stepped = bootstrap(createWorld('stepwise'));
    for (let t = HOUR; t <= target; t += HOUR) advanceTo(stepped, t);

    // `events` counts work done per advanceTo call, so it legitimately differs.
    delete oneJump.events;
    delete stepped.events;
    expect(JSON.stringify(stepped)).toEqual(JSON.stringify(oneJump));
  });
});

describe('progression', () => {
  it('starts bare and gathers before it builds', () => {
    const early = worldAt('progress', 60);
    expect(early.cycle).toBe(1);
    expect(early.era).toBe(1);
    expect(early.tuk.action).not.toBeNull();
    expect(early.graves).toHaveLength(0);
  });

  it('advances through eras on schedule', () => {
    const inStone = worldAt('progress', ERA_BOUNDARIES[0] + HOUR);
    expect(inStone.era).toBe(2);

    const inSettlement = worldAt('progress', ERA_BOUNDARIES[1] + HOUR);
    expect(inSettlement.era).toBe(3);
  });

  it('builds structures and records them', () => {
    const w = worldAt('progress', 3 * DAY);
    const standing = w.structures.filter((s) => s.state === 'standing');
    expect(standing.length).toBeGreaterThan(0);
    expect(w.chronicle.some((c) => c.text.includes('finished'))).toBe(true);
  });

  it('never lets a resource go negative', () => {
    const w = worldAt('progress', 10 * DAY);
    Object.values(w.resources).forEach((v) => expect(v).toBeGreaterThanOrEqual(0));
  });
});

describe('the premise', () => {
  it('brings a wanderer, then buries him', () => {
    const w = worldAt('mortality', 5 * DAY);
    expect(w.chronicle.some((c) => c.text.includes('wanderer arrived'))).toBe(true);
    expect(w.tuk.buried).toBeGreaterThan(0);
    expect(w.graves.length).toBeGreaterThan(0);
  });

  it('gives every grave a name and a death', () => {
    const w = worldAt('mortality', 8 * DAY);
    w.graves.forEach((g) => {
      expect(typeof g.name).toBe('string');
      expect(g.name.length).toBeGreaterThan(0);
      expect(g.diedAt).toBeGreaterThan(0);
    });
  });

  it('keeps the buried count across a collapse, and loses the buildings', () => {
    const before = worldAt('cycles', CYCLE_SECONDS - HOUR);
    const after = worldAt('cycles', CYCLE_SECONDS + 2 * HOUR);

    expect(after.cycle).toBe(2);
    expect(after.tuk.buried).toBeGreaterThanOrEqual(before.tuk.buried);
    expect(after.graves.length).toBeGreaterThanOrEqual(before.graves.length);
    expect(after.ruins.length).toBeGreaterThan(0);
    expect(after.structures.filter((s) => s.state === 'standing').length)
      .toBeLessThan(before.structures.filter((s) => s.state === 'standing').length);
  });

  it('carries knowledge forward but dumps the materials', () => {
    const after = worldAt('cycles', CYCLE_SECONDS + 60);

    expect(after.cycle).toBe(2);
    expect(after.resources.knowledge).toBeGreaterThan(0);
    // A surviving stockpile would be in the thousands; a minute of fresh
    // gathering is a couple of dozen. (Comparing against the pre-collapse figure
    // is meaningless — the Fall era's only action is `rest`, so the stockpile is
    // already spent by then.)
    expect(after.resources.wood).toBeLessThan(200);
    expect(after.structures.filter((s) => s.state === 'standing')).toHaveLength(0);
  });

  it('does not hoard when there is nothing left to build', () => {
    // Era 1 has one structure and six hours. Earlier drafts gathered through the
    // idle remainder and banked thousands of wood, making era 2 instantly
    // affordable and pacing burst-then-nothing.
    const idle = worldAt('hoarding', ERA_BOUNDARIES[0] - 60);
    expect(idle.resources.wood).toBeLessThan(60);
    expect(idle.tuk.action.type).toBe('rest');
  });
});

describe('time', () => {
  it('keeps elapsed monotonic across cycles', () => {
    const w = worldAt('time', CYCLE_SECONDS + DAY);
    expect(w.elapsed).toBeGreaterThan(CYCLE_SECONDS);
    expect(timeInCycle(w)).toBeLessThan(CYCLE_SECONDS);
    expect(timeInCycle(w)).toBeGreaterThanOrEqual(0);
  });

  it('cycles day and night', () => {
    expect(dayPhase(0)).toBeCloseTo(0);
    expect(isNight(0)).toBe(true);
    expect(isNight(1800)).toBe(false); // midday of a one-hour day
  });

  it('numbers chronicle days legibly — day count tracks hours elapsed', () => {
    const w = worldAt('legible', 6 * HOUR);
    const eraStart = w.chronicle.find((c) => c.text.includes('Stone era'));
    expect(eraStart).toBeDefined();
    // Era 1 is six hours, so the Stone era must begin around day 6-7, not day 46.
    expect(eraStart.day).toBeLessThan(10);
  });
});

describe('performance', () => {
  it('simulates a full 30-day cycle fast enough for page load', () => {
    const started = Date.now();
    const w = worldAt('perf', CYCLE_SECONDS);
    const ms = Date.now() - started;

    // Generous ceiling — this is the check that the event-driven design was
    // necessary. A fixed 0.25s timestep would be ~10M iterations here.
    expect(ms).toBeLessThan(4000);
    expect(w.events).toBeGreaterThan(1000);
  });
});

describe('data integrity', () => {
  it('has one era table entry per id, in order', () => {
    ERAS.forEach((era, i) => expect(era.id).toBe(i + 1));
  });

  it('never schedules an action with no duration', () => {
    const w = worldAt('durations', 4 * DAY);
    expect(w.tuk.action.duration).toBeGreaterThan(0);
  });
});
