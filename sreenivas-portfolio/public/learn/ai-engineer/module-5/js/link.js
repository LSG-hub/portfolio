/* Connectors from a prompt line to the part of a reply it changed: the 5.1/5.2 "this line did that" device, reusable.
   Link.layer(root, a) adds a full-stage SVG on top; Link.draw(a, layer, from, targets, colour, delay) draws a curve from the
   right edge of `from` to each target (positions are read when it runs, so call it once things have landed). A target that
   wraps over lines is aimed at its first line. With `edge` (a card), each curve stops at the card's left edge at the
   target's height instead of crossing the text. `from` may also be a point { x, cy } (stage coordinates), for a line that
   should leave from the edge of a box rather than the end of its text. Link.clear(a, layer) fades the current curves out.
   Prefixed lk-. */
window.Link = (function () {
  const NS = 'http://www.w3.org/2000/svg';
  function layer(root, a) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('width', 1920); s.setAttribute('height', 1080); s.setAttribute('viewBox', '0 0 1920 1080');
    Object.assign(s.style, { position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 15, overflow: 'visible' });
    root.appendChild(s);
    return s;
  }
  // stage coordinates of an element's first line box (an inline span that wraps reports its first line here)
  function first(el) {
    const st = document.getElementById('stage').getBoundingClientRect(), k = st.width / 1920, r = el.getClientRects()[0] || el.getBoundingClientRect();
    return { x: (r.left - st.left) / k, w: r.width / k, cy: (r.top + r.height / 2 - st.top) / k };
  }
  function draw(a, s, from, targets, colour, delay = 0, edge = null) {
    const f = from.nodeType ? first(from) : { x: from.x, w: 0, cy: from.cy }, x1 = f.x + f.w + (from.nodeType ? 10 : 0), y1 = f.cy, ex = edge ? UI.pos(edge).x - 8 : null;
    [].concat(targets).filter(t => t && t.getClientRects().length).forEach((t, k) => {
      const p = first(t), back = ex == null && p.x + p.w / 2 < x1;   // a target to the left of the line: come in from its right edge
      const x2 = ex != null ? ex : back ? p.x + p.w + 6 : p.x - 6, y2 = p.cy, bend = Math.max(60, Math.abs(x2 - x1) * 0.45);
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', `M${x1},${y1} C${x1 + bend},${y1} ${back ? x2 + bend : x2 - bend},${y2} ${x2},${y2}`);
      path.setAttribute('class', 'lk-p'); path.setAttribute('fill', 'none'); path.setAttribute('stroke', colour);
      path.setAttribute('stroke-width', 2.5); path.setAttribute('stroke-linecap', 'round');
      s.appendChild(path);
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('class', 'lk-p'); dot.setAttribute('cx', x2); dot.setAttribute('cy', y2); dot.setAttribute('r', 5); dot.setAttribute('fill', colour);
      s.appendChild(dot);
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      a.fromTo(path, { strokeDashoffset: len, opacity: 0.95 }, { strokeDashoffset: 0, duration: 0.7, delay: delay + k * 0.12, ease: 'power2.inOut' });
      a.fromTo(dot, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.25, delay: delay + 0.6 + k * 0.12, svgOrigin: `${x2} ${y2}` });
    });
  }
  function clear(a, s) {
    const old = [...s.querySelectorAll('.lk-p')];
    a.to(old, { opacity: 0, duration: 0.3 });
    a.after(320, () => old.forEach(e => e.remove()));
  }
  return { layer, draw, clear, first };
})();
