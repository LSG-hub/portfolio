/**
 * Everything Tuk builds.
 *
 * ── On the cost curve ───────────────────────────────────────────────────────
 * Costs are a FIRST PASS and explicitly untuned (docs/tuk-world.md §13).
 *
 * The first draft was out by roughly two orders of magnitude: `gather` yields
 * 4 wood per 12s ≈ 1,200 wood/hour, so a 40-wood hut was two minutes of work
 * and every era finished all its structures within minutes of beginning. Costs
 * below are ~20× that draft so a building phase lasts minutes-to-hours instead
 * of seconds.
 *
 * ⚠️ But scaling costs is NOT the real answer, and it shouldn't be pushed much
 * further. An era is 24-168 hours; no sane cost makes building fill that. The
 * correct reading is that **eras are not meant to be filled with building** —
 * building is punctuation, and the substance is villagers, conversations,
 * deaths, and scenes. Tuk resting for hours is a CONTENT gap where those belong,
 * not a number that needs inflating. Resource consumption (villagers eating)
 * would additionally give gathering permanent purpose.
 *
 * `x` is a world-coordinate offset so the settlement grows outward rather than
 * stacking. Negative is west, positive east; the mountain sits east at ~1600.
 */

export const STRUCTURES = {
  firepit:   { label: 'a firepit',   era: 1, cost: { wood: 160 },                            seconds: 20,  x: 40,   h: 10 , shape: 'pit' },
  shelter:   { label: 'a shelter',   era: 2, cost: { wood: 480, stone: 120 },                seconds: 45,  x: -60,  h: 22 , shape: 'hut' },
  woodpile:  { label: 'a woodpile',  era: 2, cost: { wood: 600 },                            seconds: 25,  x: 110,  h: 14 , shape: 'pile' },
  hut:       { label: 'a hut',       era: 3, cost: { wood: 800, stone: 360 },                seconds: 60,  x: -170, h: 26 , shape: 'hut' },
  field:     { label: 'a field',     era: 3, cost: { wood: 240 },                            seconds: 40,  x: 250,  h: 6  , shape: 'field' },
  pen:       { label: 'a pen',       era: 3, cost: { wood: 520 },                            seconds: 35,  x: 330,  h: 16 , shape: 'pen' },
  well:      { label: 'a well',      era: 4, cost: { stone: 1000 },                          seconds: 70,  x: -20,  h: 18 , shape: 'well' },
  smithy:    { label: 'a smithy',    era: 4, cost: { stone: 1200, wood: 600, ore: 200 },     seconds: 90,  x: -280, h: 30 , shape: 'lodge' },
  granary:   { label: 'a granary',   era: 4, cost: { wood: 1400, stone: 400 },               seconds: 80,  x: 420,  h: 34 , shape: 'tower' },
  longhouse: { label: 'a longhouse', era: 4, cost: { wood: 1800, stone: 800 },               seconds: 100, x: -400, h: 32 , shape: 'lodge' },
  wall:      { label: 'the wall',    era: 5, cost: { stone: 3200 },                          seconds: 140, x: -520, h: 40 , shape: 'wall' },
  keep:      { label: 'the keep',    era: 5, cost: { stone: 4400, ore: 800 },                seconds: 200, x: 120,  h: 68 , shape: 'tower' },
  market:    { label: 'a market',    era: 5, cost: { wood: 2400, stone: 1200 },              seconds: 110, x: 520,  h: 28 , shape: 'lodge' },
  chapel:    { label: 'a chapel',    era: 5, cost: { stone: 2800, ore: 400 },                seconds: 130, x: -120, h: 48 , shape: 'spire' },
  foundry:   { label: 'a foundry',   era: 6, cost: { stone: 4000, ore: 2400 },               seconds: 180, x: 640,  h: 44 , shape: 'lodge' },
  rail:      { label: 'the rail',    era: 6, cost: { ore: 3600, wood: 2000 },                seconds: 160, x: 800,  h: 8  , shape: 'wall' },
  chimney:   { label: 'a chimney',   era: 6, cost: { stone: 5200, ore: 1200 },               seconds: 170, x: 700,  h: 78 , shape: 'chimney' },
  workshop:  { label: 'a workshop',  era: 6, cost: { wood: 2800, ore: 1800 },                seconds: 140, x: -620, h: 34 , shape: 'lodge' },
  spire:     { label: 'a spire',     era: 7, cost: { ore: 6400, stone: 4000 },               seconds: 240, x: 200,  h: 96 , shape: 'spire' },
  array:     { label: 'an array',    era: 7, cost: { ore: 5200 },                            seconds: 200, x: 900,  h: 40 , shape: 'dome' },
  vault:     { label: 'the vault',   era: 7, cost: { ore: 8000, stone: 6000 },               seconds: 280, x: -700, h: 36 , shape: 'lodge' }
};

/**
 * Silhouette families. Nine shapes cover twenty-one structures, drawn
 * procedurally — hand-authoring each one is content work for later.
 */
export const SHAPES = ['pit', 'hut', 'pile', 'field', 'pen', 'well', 'lodge', 'tower', 'wall', 'chimney', 'spire', 'dome'];

export const getStructure = (type) => STRUCTURES[type];

/** Can these resources pay for `type`? */
export function affordable(resources, type) {
  const s = STRUCTURES[type];
  if (!s) return false;
  return Object.entries(s.cost).every(([res, amount]) => (resources[res] || 0) >= amount);
}

/** Which resource is furthest short of paying for `type`, or null if affordable. */
export function biggestShortfall(resources, type) {
  const s = STRUCTURES[type];
  if (!s) return null;
  let worst = null;
  let worstGap = 0;
  Object.entries(s.cost).forEach(([res, amount]) => {
    const gap = amount - (resources[res] || 0);
    if (gap > worstGap) { worstGap = gap; worst = res; }
  });
  return worst;
}
