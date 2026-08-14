import { paletteAt } from '../data/palettes';
import { getStructure } from '../data/structures';
import { lifeStage, GARMENT_COLOURS } from '../data/people';
import { stableUnit } from '../rng';
import { getEra } from '../data/eras';
import { dayPhase } from '../simulate';

/**
 * Canvas renderer. Pure drawing — reads world state, writes pixels, returns
 * nothing. It never mutates state and never asks what time it is.
 *
 * ── Scale, not space ────────────────────────────────────────────────────────
 * A short strip contains a mountain range because the mountains are FAR AWAY.
 * Three layers drift at different rates, so a 70px palace reads as monumental
 * next to 40px peaks and 12px villagers. See docs/tuk-world.md §11.
 *
 * Terrain is generated from summed sines rather than stored: deterministic,
 * infinitely wide, and free.
 */

export const LAYERS = { far: 0.1, mid: 0.4, ground: 1 };

/** Deterministic hill profile. Height above the ground line at world x. */
function ridge(x, amp, freq, offset) {
  return (
    Math.sin((x + offset) * freq) * amp
    + Math.sin((x + offset) * freq * 2.7) * amp * 0.35
    + Math.sin((x + offset) * freq * 0.41) * amp * 0.6
  );
}

function drawSky(ctx, w, h, pal) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, pal.skyTop);
  g.addColorStop(1, pal.skyBottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/** Sun by day, moon by night, on the same arc. */
function drawCelestial(ctx, w, h, groundY, phase, pal) {
  const t = phase; // 0 midnight → 0.5 noon
  // Sun rides 0.25→0.75, moon the other half.
  const isDay = t > 0.22 && t < 0.78;
  const local = isDay ? (t - 0.22) / 0.56 : ((t + 0.78) % 1) / 0.44;
  const x = local * w;
  const y = groundY - Math.sin(local * Math.PI) * (groundY * 0.78) - 6;

  ctx.save();
  if (isDay) {
    ctx.fillStyle = '#E8B04B';
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = pal.glow;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    // stars
    ctx.globalAlpha = 0.5 * pal.darkness;
    ctx.fillStyle = '#FFF6E4';
    for (let i = 0; i < 40; i += 1) {
      const sx = stableUnit(`star-${i}`, 'x') * w;
      const sy = stableUnit(`star-${i}`, 'y') * groundY * 0.8;
      ctx.fillRect(sx, sy, 1.4, 1.4);
    }
  }
  ctx.restore();
}

function drawRidgeLayer(ctx, w, groundY, camX, drift, colour, amp, freq, offset, baseLift) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  const shift = camX * drift;
  for (let sx = 0; sx <= w; sx += 4) {
    const wx = sx + shift;
    const y = groundY - baseLift - Math.max(ridge(wx, amp, freq, offset), 0);
    ctx.lineTo(sx, y);
  }
  ctx.lineTo(w, groundY);
  ctx.closePath();
  ctx.fill();
}

function drawTrees(ctx, w, groundY, camX, pal, density) {
  if (density <= 0.02) return;
  const shift = camX * LAYERS.mid;
  const spacing = 34;
  const start = Math.floor(shift / spacing) - 1;
  ctx.fillStyle = pal.mid;

  for (let i = start; i < start + Math.ceil(w / spacing) + 3; i += 1) {
    if (stableUnit(`tree-${i}`, 'exists') > density) continue;
    const wx = i * spacing + stableUnit(`tree-${i}`, 'jitter') * 20;
    const sx = wx - shift;
    const hgt = 16 + stableUnit(`tree-${i}`, 'h') * 14;
    const lift = 8 + Math.max(ridge(wx, 14, 0.004, 900), 0);
    const baseY = groundY - lift;
    ctx.beginPath();
    ctx.moveTo(sx - hgt * 0.28, baseY);
    ctx.lineTo(sx, baseY - hgt);
    ctx.lineTo(sx + hgt * 0.28, baseY);
    ctx.closePath();
    ctx.fill();
  }
}

/** One structure silhouette, by shape family. */
function drawStructure(ctx, sx, groundY, def, progress, pal) {
  const h = def.h * (progress < 1 ? Math.max(progress, 0.08) : 1);
  const w = Math.max(def.h * 0.9, 14);
  const y = groundY - h;

  ctx.fillStyle = pal.ink;
  ctx.strokeStyle = pal.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();

  switch (def.shape) {
    case 'pit':
      ctx.arc(sx, groundY - 2, 8, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = pal.accent;
      ctx.beginPath();
      ctx.moveTo(sx - 4, groundY - 4);
      ctx.lineTo(sx, groundY - 4 - h);
      ctx.lineTo(sx + 4, groundY - 4);
      ctx.closePath();
      ctx.fill();
      return;
    case 'hut':
      ctx.moveTo(sx - w / 2, groundY);
      ctx.lineTo(sx - w / 2, y + h * 0.42);
      ctx.lineTo(sx, y);
      ctx.lineTo(sx + w / 2, y + h * 0.42);
      ctx.lineTo(sx + w / 2, groundY);
      break;
    case 'pile':
      ctx.moveTo(sx - w * 0.55, groundY);
      ctx.lineTo(sx - w * 0.3, y);
      ctx.lineTo(sx + w * 0.3, y);
      ctx.lineTo(sx + w * 0.55, groundY);
      break;
    case 'field':
      ctx.rect(sx - 46, groundY - h, 92, h);
      break;
    case 'pen':
      ctx.rect(sx - 26, groundY - 2, 52, 2);
      ctx.rect(sx - 26, y, 3, h);
      ctx.rect(sx + 23, y, 3, h);
      ctx.rect(sx - 26, y + h * 0.4, 52, 2.5);
      break;
    case 'well':
      ctx.rect(sx - 9, groundY - h * 0.45, 18, h * 0.45);
      ctx.rect(sx - 11, y, 22, 3);
      ctx.rect(sx - 1.5, y, 3, h * 0.6);
      break;
    case 'lodge':
      ctx.moveTo(sx - w * 0.7, groundY);
      ctx.lineTo(sx - w * 0.7, y + h * 0.3);
      ctx.lineTo(sx, y);
      ctx.lineTo(sx + w * 0.7, y + h * 0.3);
      ctx.lineTo(sx + w * 0.7, groundY);
      break;
    case 'tower':
      ctx.moveTo(sx - w * 0.34, groundY);
      ctx.lineTo(sx - w * 0.34, y + 6);
      ctx.lineTo(sx, y);
      ctx.lineTo(sx + w * 0.34, y + 6);
      ctx.lineTo(sx + w * 0.34, groundY);
      break;
    case 'wall':
      ctx.rect(sx - 70, y, 140, h);
      break;
    case 'chimney':
      ctx.moveTo(sx - 7, groundY);
      ctx.lineTo(sx - 4.5, y);
      ctx.lineTo(sx + 4.5, y);
      ctx.lineTo(sx + 7, groundY);
      break;
    case 'spire':
      ctx.moveTo(sx - w * 0.26, groundY);
      ctx.lineTo(sx, y);
      ctx.lineTo(sx + w * 0.26, groundY);
      break;
    case 'dome':
      ctx.arc(sx, groundY, w * 0.6, Math.PI, 0);
      break;
    default:
      ctx.rect(sx - w / 2, y, w, h);
  }

  ctx.closePath();
  if (progress < 1) {
    ctx.globalAlpha = 0.35;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
  } else {
    ctx.fill();
  }
}

/** A villager: head, body, one garment colour, scaled by life stage. */
function drawPerson(ctx, sx, groundY, npc, world, pal) {
  const frac = Math.min((world.elapsed - npc.bornAt) / npc.lifespan, 0.999);
  const stage = lifeStage(frac);
  const scale = stage.scale * (0.94 + stableUnit(npc.id, 'height') * 0.14);
  const bodyH = 13 * scale;
  const headR = 2.9 * scale;
  const colour = GARMENT_COLOURS[
    Math.floor(stableUnit(npc.id, 'garment') * GARMENT_COLOURS.length)
  ];
  const lean = stage.stoop * 6;

  ctx.strokeStyle = pal.ink;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(sx, groundY);
  ctx.lineTo(sx + lean, groundY - bodyH);
  ctx.stroke();

  ctx.fillStyle = colour;
  ctx.fillRect(sx - 2 * scale + lean * 0.5, groundY - bodyH * 0.62, 4 * scale, bodyH * 0.42);

  ctx.fillStyle = pal.ink;
  ctx.beginPath();
  ctx.arc(sx + lean, groundY - bodyH - headR * 0.7, headR, 0, Math.PI * 2);
  ctx.fill();

  if (stage.key === 'elder' && stableUnit(npc.id, 'stick') > 0.5) {
    ctx.beginPath();
    ctx.moveTo(sx + 4 * scale, groundY);
    ctx.lineTo(sx + 3 * scale, groundY - bodyH * 0.8);
    ctx.stroke();
  }
}

function drawGrave(ctx, sx, groundY, pal) {
  ctx.fillStyle = pal.ink;
  ctx.globalAlpha = 0.75;
  ctx.beginPath();
  ctx.moveTo(sx - 4, groundY);
  ctx.lineTo(sx - 4, groundY - 8);
  ctx.arc(sx, groundY - 8, 4, Math.PI, 0);
  ctx.lineTo(sx + 4, groundY);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
}

/**
 * Draw the whole world.
 * `camera` is { x, groundRatio } — x in world units at the viewport's left edge.
 */
export function renderWorld(ctx, world, camera, size) {
  const { width: w, height: h } = size;
  const era = getEra(world.era);
  const phase = dayPhase(world.elapsed);
  const pal = paletteAt(era.palette, phase);
  const groundY = Math.round(h * (camera.groundRatio || 0.8));
  const camX = camera.x;

  drawSky(ctx, w, h, pal);
  drawCelestial(ctx, w, h, groundY, phase, pal);

  // far mountains, then mid hills, then trees
  drawRidgeLayer(ctx, w, groundY, camX, LAYERS.far, pal.far, 42, 0.0016, 0, 12);
  drawRidgeLayer(ctx, w, groundY, camX, LAYERS.mid, pal.mid, 22, 0.0034, 1400, 4);
  drawTrees(ctx, w, groundY, camX, pal, pal.trees);

  // ground
  ctx.fillStyle = pal.ground;
  ctx.fillRect(0, groundY, w, h - groundY);
  ctx.strokeStyle = pal.ink;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, groundY + 0.5);
  ctx.lineTo(w, groundY + 0.5);
  ctx.stroke();
  ctx.globalAlpha = 1;

  const toScreen = (wx) => wx - camX;

  // ruins from previous cycles, faded, behind everything
  ctx.globalAlpha = 0.22;
  world.ruins.forEach((r) => {
    const def = getStructure(r.type);
    if (def) drawStructure(ctx, toScreen(r.x), groundY, def, 1, pal);
  });
  ctx.globalAlpha = 1;

  world.graves.forEach((g) => drawGrave(ctx, toScreen(g.x), groundY, pal));

  world.structures.forEach((s) => {
    const def = getStructure(s.type);
    if (!def) return;
    const progress = s.state === 'standing'
      ? 1
      : Math.min((world.elapsed - s.startedAt) / def.seconds, 0.99);
    drawStructure(ctx, toScreen(s.x), groundY, def, progress, pal);
  });

  world.npcs.forEach((n) => drawPerson(ctx, toScreen(n.x), groundY, n, world, pal));

  return { groundY, palette: pal };
}
