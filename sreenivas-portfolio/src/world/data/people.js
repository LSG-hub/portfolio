/**
 * Villagers. Name pools, roles, and the lifespan curve.
 *
 * Lifespans are REAL hours, not world years — the two clocks don't reconcile
 * (docs/tuk-world.md §3.2). What matters is that a villager lives long enough
 * to be recognised and short enough to be mourned inside one era.
 */

export const NAMES = [
  'Mira', 'Aldo', 'Sena', 'Bek', 'Oria', 'Tamas', 'Nel', 'Idris',
  'Vessa', 'Corin', 'Hana', 'Odo', 'Lirra', 'Payan', 'Sefa', 'Torv',
  'Anwe', 'Renn', 'Kessa', 'Marek', 'Ilva', 'Doran', 'Sula', 'Efen',
  'Nyra', 'Halvi', 'Prem', 'Zosia', 'Awan', 'Rue', 'Kito', 'Vela'
];

export const ROLES = [
  'forager', 'mason', 'farmer', 'hunter', 'smith', 'miner',
  'weaver', 'cooper', 'herder', 'scribe', 'carter', 'baker'
];

/** Roles that only make sense once an era has the buildings for them. */
export const ROLE_ERA = {
  forager: 2, hunter: 2, farmer: 3, herder: 3,
  mason: 4, smith: 4, cooper: 4, weaver: 4,
  miner: 4, baker: 4, carter: 5, scribe: 5
};

/** Real hours a villager lives, before jitter. */
export const LIFESPAN_HOURS = { min: 30, max: 70 };

/** How many villagers the settlement supports in each era. */
export const POPULATION_CAP = { 1: 0, 2: 1, 3: 4, 4: 9, 5: 14, 6: 16, 7: 12, 8: 2 };

/**
 * Three silhouette tiers. A visitor watches someone move through all three and
 * vanish into a stone while Tuk's silhouette never changes — that contrast is
 * the premise delivered visually, and it costs three sprite variants.
 * See docs/tuk-world.md §8.1.
 */
export const LIFE_STAGES = [
  { key: 'child', until: 0.18, scale: 0.6,  stoop: 0,    speed: 1.25 },
  { key: 'adult', until: 0.78, scale: 1.0,  stoop: 0,    speed: 1.0 },
  { key: 'elder', until: 1.0,  scale: 0.9,  stoop: 0.14, speed: 0.7 }
];

/** Which stage an NPC is in, given how much of its life has elapsed. */
export function lifeStage(fraction) {
  return LIFE_STAGES.find((s) => fraction < s.until) || LIFE_STAGES[LIFE_STAGES.length - 1];
}

/** Garment colours — muted, drawn to sit inside the site's warm palette. */
export const GARMENT_COLOURS = [
  '#8C5A3C', '#6B6358', '#7C6A4E', '#5F6B58',
  '#8B7E6F', '#6E5A56', '#7A6E52', '#5C5A4E'
];

export const SILHOUETTES = ['bare', 'hat', 'scarf', 'tied'];
