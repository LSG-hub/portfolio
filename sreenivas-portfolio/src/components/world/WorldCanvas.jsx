import React, { useEffect, useMemo, useRef } from 'react';
import TukAvatar from '../avatar/TukAvatar';
import { renderWorld } from '../../world/render/draw';
import '../../styles/components/world-canvas.css';

/**
 * The world, drawn.
 *
 * Canvas for terrain, structures and villagers — cheap, batched, and it can hold
 * a mountain range in a short strip. Tuk himself stays the SVG component, so he
 * keeps his twelve faces and the whole expression system, composited on top as a
 * DOM element.
 *
 * ── Why the split in update rates ───────────────────────────────────────────
 * The world state object mutates in place, so the rAF loop reads it directly and
 * redraws at 60fps with no React involvement. Tuk's face and gesture come
 * through props and change at the hook's ~10Hz — fine, since expressions change
 * slowly. His screen position is written straight to the node every frame.
 *
 * Travel is smoothed here, not in the sim: `tuk.x` jumps the moment an action
 * starts (he's suddenly "at the mountain"), so the renderer eases the drawn
 * position toward it. Render-only, so determinism is untouched.
 */

const GROUND_RATIO = 0.78;
const TUK_SIZE = 52;
const FOLLOW = 0.42; // keep him this far from the left edge
const EASE = 2.6; // travel smoothing, world units per second per unit of distance

/** What his face and hands do while working. */
const ACTION_POSE = {
  gather:  { face: 'neutral',    gesture: 'reach',  head: 'still' },
  quarry:  { face: 'determined', gesture: 'reach',  head: 'still' },
  mine:    { face: 'determined', gesture: 'reach',  head: 'lean'  },
  farm:    { face: 'neutral',    gesture: 'chin',   head: 'lean'  },
  hunt:    { face: 'determined', gesture: 'point',  head: 'lean'  },
  build:   { face: 'happy',      gesture: 'reach',  head: 'nod'   },
  repair:  { face: 'determined', gesture: 'reach',  head: 'nod'   },
  bury:    { face: 'sad',        gesture: 'rest',   head: 'still' },
  rest:    { face: 'sleepy',     gesture: 'rest',   head: 'still' },
  travel:  { face: 'neutral',    gesture: 'reach',  head: 'still' }
};

const WorldCanvas = ({ world, version, height = 320 }) => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const tukRef = useRef(null);
  const camRef = useRef({ x: 0 });
  const drawnXRef = useRef(null);
  const travellingRef = useRef(false);

  const pose = useMemo(() => {
    if (!world || !world.tuk.action) return ACTION_POSE.rest;
    if (travellingRef.current) return ACTION_POSE.travel;
    return ACTION_POSE[world.tuk.action.type] || ACTION_POSE.rest;
    // version drives recomputation; the world object identity never changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, world]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const tuk = tukRef.current;
    if (!wrap || !canvas || !tuk) return undefined;

    const ctx = canvas.getContext('2d');
    let raf = null;
    let last = performance.now();
    let size = { width: 0, height: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      size = { width: Math.round(rect.width), height: Math.round(rect.height) };
      canvas.width = size.width * dpr;
      canvas.height = size.height * dpr;
      canvas.style.width = `${size.width}px`;
      canvas.style.height = `${size.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      if (world && size.width) {
        // ease the drawn position toward wherever the sim put him
        const targetX = world.tuk.x;
        if (drawnXRef.current === null) drawnXRef.current = targetX;
        const gap = targetX - drawnXRef.current;
        drawnXRef.current += gap * Math.min(dt * EASE, 1);
        travellingRef.current = Math.abs(gap) > 24;

        // camera follows, also eased, so arriving doesn't whip the view
        const wantCam = drawnXRef.current - size.width * FOLLOW;
        camRef.current.x += (wantCam - camRef.current.x) * Math.min(dt * 3, 1);

        const { groundY } = renderWorld(
          ctx,
          world,
          { x: camRef.current.x, groundRatio: GROUND_RATIO },
          size
        );

        const sx = drawnXRef.current - camRef.current.x;
        const bodyH = Math.round((TUK_SIZE * 67) / 60);
        tuk.style.transform =
          `translate(${(sx - TUK_SIZE / 2).toFixed(1)}px, ${(groundY - bodyH).toFixed(1)}px)`
          + ` scaleX(${gap < -6 ? -1 : 1})`;
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [world]);

  return (
    <div className="wcanvas" ref={wrapRef} style={{ height }}>
      <canvas ref={canvasRef} className="wcanvas-surface" aria-hidden="true" />
      <div className="wcanvas-actor" ref={tukRef}>
        <TukAvatar
          face={pose.face}
          gesture={pose.gesture}
          head={pose.head}
          size={TUK_SIZE}
          title="Tuk"
        />
      </div>
    </div>
  );
};

export default WorldCanvas;
