import React, { useCallback, useEffect, useRef } from 'react';
import { drawFramed } from '../../utils/photoExport';
import PhotoGuide from './PhotoGuide';

/**
 * Drag to move, scroll or pinch to zoom. The canvas is the photo exactly as it
 * will be exported, only smaller, so there is no separate preview to drift from it.
 *
 * `framing` is owned by the parent (it drives the export); this component only
 * proposes new values through onChange.
 */
const PhotoFramer = ({ image, framing, onChange, preset, minScale, maxScale }) => {
  const canvasRef = useRef(null);
  const pointers = useRef(new Map());
  const pinch = useRef(null);

  const clampScale = useCallback((s) => Math.min(maxScale, Math.max(minScale, s)), [minScale, maxScale]);

  // Redraw at the device's pixel density whenever the framing or the box size changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const paint = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      drawFramed(canvas.getContext('2d'), image, framing, canvas.width, canvas.height);
    };
    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [image, framing]);

  /** Zoom about a point given in frame units, so the spot under the finger stays put. */
  const zoomAt = useCallback(
    (factor, px, py, from = framing) => {
      const scale = clampScale(from.scale * factor);
      const k = scale / from.scale;
      return { scale, cx: px + (from.cx - px) * k, cy: py + (from.cy - py) * k };
    },
    [framing, clampScale]
  );

  const toFrame = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.width, width: rect.width };
  };

  const onPointerDown = (e) => {
    canvasRef.current.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, toFrame(e));
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), start: framing };
    }
  };

  const onPointerMove = (e) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const next = toFrame(e);
    pointers.current.set(e.pointerId, next);

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      onChange(zoomAt(dist / pinch.current.dist, mid.x, mid.y, pinch.current.start));
      return;
    }
    onChange({ ...framing, cx: framing.cx + next.x - prev.x, cy: framing.cy + next.y - prev.y });
  };

  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  // React attaches wheel listeners as passive, which can't stop the page scrolling.
  useEffect(() => {
    const canvas = canvasRef.current;
    const onWheel = (e) => {
      e.preventDefault();
      const p = toFrame(e);
      onChange(zoomAt(Math.exp(-e.deltaY * 0.0015), p.x, p.y));
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, [zoomAt, onChange]);

  const nudge = (dx, dy) => onChange({ ...framing, cx: framing.cx + dx, cy: framing.cy + dy });
  const onKeyDown = (e) => {
    const step = e.shiftKey ? 0.05 : 0.01;
    const keys = {
      ArrowLeft: () => nudge(-step, 0),
      ArrowRight: () => nudge(step, 0),
      ArrowUp: () => nudge(0, -step),
      ArrowDown: () => nudge(0, step),
      '+': () => onChange(zoomAt(1.05, 0.5, preset.heightMm / preset.widthMm / 2)),
      '=': () => onChange(zoomAt(1.05, 0.5, preset.heightMm / preset.widthMm / 2)),
      '-': () => onChange(zoomAt(1 / 1.05, 0.5, preset.heightMm / preset.widthMm / 2))
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };

  return (
    <div className="photo-stage">
      <canvas
        ref={canvasRef}
        className="photo-stage-canvas photo-framer-canvas"
        tabIndex={0}
        role="img"
        aria-label="Your photo, framed. Drag to move it, scroll or pinch to zoom, or use the arrow keys and plus and minus."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      />
      <PhotoGuide preset={preset} />
    </div>
  );
};

export default PhotoFramer;
