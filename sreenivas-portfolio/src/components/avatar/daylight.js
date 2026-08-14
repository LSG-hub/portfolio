/**
 * The light in Tuk's room, as a continuous function of where he is in his day.
 *
 * ── Why this isn't CSS classes ──────────────────────────────────────────
 * It was: four classes, `is-dawn` through `is-night`, with
 * `transition: background 2600ms` on the surface. That transition never ran.
 * A gradient is a background-IMAGE, and background-image does not interpolate,
 * so every change was a hard cut between two frames no matter how long the
 * transition claimed to be.
 *
 * Cross-fading four stacked layers would have fixed the cut and still left the
 * light static for a minute at a time between steps. Sunrise isn't a state, it's
 * a slope, so the light is now a value sampled from a curve: seven keyframes,
 * linearly interpolated, wrapping at the end of the cycle back to dawn. Nothing
 * in the room is ever quite the colour it was ten seconds ago.
 *
 * Sampled at 4Hz by the routine, which sounds coarse and isn't: one step is
 * 1/1200th of the cycle, far below the threshold where a colour change reads as
 * a step rather than a drift.
 *
 * `at` positions are fractions of the 280-second day, chosen to line up with what
 * he's doing: dawn as he wakes on the pad, full daylight while he's at the desk,
 * dusk as he sits down in front of the television, night as he turns in.
 */

/**
 * Each keyframe carries the three gradient stops of the room's back plane, plus
 * the three light levels that have to move the OTHER way: as daylight drops, the
 * lamp, the screens and the window all have to respond, or the room reads as a
 * flat filter rather than a place with lights in it.
 */
const SKY = [
  { at: 0.00, top: [255, 246, 240, 0.42], mid: [253, 235, 226, 0.80], bot: [252, 238, 231, 0.93], lamp: 0.17, screen: 0.23, day: 0.50 },
  { at: 0.12, top: [255, 252, 246, 0.40], mid: [255, 248, 238, 0.76], bot: [255, 250, 242, 0.92], lamp: 0.10, screen: 0.18, day: 0.95 },
  { at: 0.40, top: [255, 255, 255, 0.40], mid: [255, 255, 252, 0.78], bot: [255, 255, 255, 0.92], lamp: 0.08, screen: 0.16, day: 1.00 },
  { at: 0.62, top: [255, 252, 244, 0.42], mid: [254, 246, 232, 0.78], bot: [254, 248, 236, 0.92], lamp: 0.12, screen: 0.20, day: 0.85 },
  { at: 0.74, top: [252, 240, 226, 0.46], mid: [248, 226, 203, 0.82], bot: [246, 226, 206, 0.94], lamp: 0.22, screen: 0.28, day: 0.42 },
  { at: 0.85, top: [240, 231, 233, 0.48], mid: [226, 216, 224, 0.84], bot: [221, 214, 224, 0.94], lamp: 0.27, screen: 0.33, day: 0.16 },
  { at: 0.93, top: [226, 224, 226, 0.50], mid: [206, 206, 214, 0.84], bot: [198, 198, 208, 0.95], lamp: 0.30, screen: 0.36, day: 0.05 },
  // Wraps to the first keyframe, so the last minute of the night slides into dawn
  // rather than snapping there when the cycle rolls over.
  { at: 1.00, top: [255, 246, 240, 0.42], mid: [253, 235, 226, 0.80], bot: [252, 238, 231, 0.93], lamp: 0.17, screen: 0.23, day: 0.50 }
];

const lerp = (a, b, t) => a + (b - a) * t;
const rgba = (c) => `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${c[3].toFixed(3)})`;
const mixStop = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)];

/**
 * Sample the light at a point in the day. `progress` is 0..1 through the cycle.
 * Returns a ready-to-apply CSS gradient plus the three light levels, which reach
 * the furniture as inherited custom properties.
 */
export function skyAt(progress) {
  const p = ((progress % 1) + 1) % 1;

  let i = 0;
  while (i < SKY.length - 2 && SKY[i + 1].at <= p) i += 1;
  const a = SKY[i];
  const b = SKY[i + 1];
  const t = b.at === a.at ? 0 : (p - a.at) / (b.at - a.at);

  return {
    gradient: `linear-gradient(to bottom, ${rgba(mixStop(a.top, b.top, t))} 0%, ${rgba(mixStop(a.mid, b.mid, t))} 55%, ${rgba(mixStop(a.bot, b.bot, t))} 100%)`,
    lamp: lerp(a.lamp, b.lamp, t).toFixed(3),
    screen: lerp(a.screen, b.screen, t).toFixed(3),
    day: lerp(a.day, b.day, t).toFixed(3)
  };
}

export default skyAt;
