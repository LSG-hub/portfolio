/**
 * Era palettes.
 *
 * Anchored to the site's own tokens — cream ground, terracotta accent, ink
 * silhouettes — so the world never looks bolted on. Later eras cool and grey as
 * the forest recedes and industry arrives; the Fall goes to ash.
 *
 * `night` is blended toward as the day clock rotates. On portfolio pages that
 * blend happens INSIDE the canvas only; the page theme stays cream (§3.4).
 */

const NIGHT = {
  skyTop: '#171A22',
  skyBottom: '#2C3040',
  far: '#20242F',
  mid: '#191D26',
  ground: '#12151C',
  ink: '#0E1014',
  glow: '#F2C98A'
};

export const PALETTES = {
  bare: {
    skyTop: '#F7EFE2', skyBottom: '#FAF6EE',
    far: '#D8CBB4', mid: '#C6B79C', ground: '#B8A98D',
    ink: '#1A1814', accent: '#A8451F', trees: 0.15
  },
  stone: {
    skyTop: '#F4EBDC', skyBottom: '#FAF6EE',
    far: '#D2C6B0', mid: '#B9AE92', ground: '#AC9E82',
    ink: '#1A1814', accent: '#A8451F', trees: 0.55
  },
  settlement: {
    skyTop: '#F5EEDF', skyBottom: '#FBF7F0',
    far: '#CFC5AF', mid: '#A9B48E', ground: '#A29472',
    ink: '#1A1814', accent: '#A8451F', trees: 0.8
  },
  village: {
    skyTop: '#F3EDE0', skyBottom: '#FAF6EE',
    far: '#C8BFAA', mid: '#9FAC86', ground: '#988B6C',
    ink: '#1A1814', accent: '#A8451F', trees: 0.7
  },
  kingdom: {
    skyTop: '#EFE8DC', skyBottom: '#F7F2E8',
    far: '#BEB6A4', mid: '#96A180', ground: '#8C8064',
    ink: '#1A1814', accent: '#A8451F', trees: 0.5
  },
  industry: {
    skyTop: '#E4DFD6', skyBottom: '#EDE8DE',
    far: '#ADA79B', mid: '#8B8C7C', ground: '#7A7462',
    ink: '#141310', accent: '#A8451F', trees: 0.2
  },
  future: {
    skyTop: '#E2E4E4', skyBottom: '#EFF0EE',
    far: '#A8AEB0', mid: '#88908E', ground: '#767B74',
    ink: '#121414', accent: '#A8451F', trees: 0.08
  },
  ash: {
    skyTop: '#D9D4CC', skyBottom: '#E3DED6',
    far: '#A29C93', mid: '#8A857C', ground: '#726D66',
    ink: '#171512', accent: '#A8451F', trees: 0.02
  }
};

export const getPalette = (key) => PALETTES[key] || PALETTES.bare;

/** Blend two hex colours. t=0 → a, t=1 → b. */
export function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const r = Math.round((pa >> 16) + (((pb >> 16) - (pa >> 16)) * t));
  const g = Math.round(((pa >> 8) & 255) + ((((pb >> 8) & 255) - ((pa >> 8) & 255)) * t));
  const bl = Math.round((pa & 255) + (((pb & 255) - (pa & 255)) * t));
  return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0')}`;
}

/**
 * How dark it is: 0 at midday, 1 at midnight. Smoothed so dawn and dusk are
 * gradual rather than a switch.
 */
export function darkness(phase) {
  // phase 0 = midnight, 0.5 = noon
  const d = Math.cos(phase * Math.PI * 2) * 0.5 + 0.5; // 1 at midnight, 0 at noon
  return d * d * (3 - 2 * d); // smoothstep
}

/** The era palette, blended toward night by the day clock. */
export function paletteAt(eraKey, phase) {
  const day = getPalette(eraKey);
  const t = darkness(phase);
  return {
    skyTop: mix(day.skyTop, NIGHT.skyTop, t),
    skyBottom: mix(day.skyBottom, NIGHT.skyBottom, t),
    far: mix(day.far, NIGHT.far, t),
    mid: mix(day.mid, NIGHT.mid, t),
    ground: mix(day.ground, NIGHT.ground, t),
    ink: mix(day.ink, NIGHT.ink, t),
    accent: day.accent,
    glow: NIGHT.glow,
    trees: day.trees,
    darkness: t
  };
}
