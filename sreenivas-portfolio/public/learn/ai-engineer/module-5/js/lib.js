/* Shared slide furniture for the App Builder KT deck.
   Two layers on every slide: the plain story (headline + panel) for everyone, and an
   "Under the hood" strip at the bottom for engineers. */
window.L = (function () {
  const A = () => Deck.api;
  const C = { amber: '#f2b84b', green: '#5fd39a', red: '#ff6b5e', blue: '#6aa8ff', violet: '#a07bff', teal: '#3fd6c0',
    ink: '#ece8df', ink2: '#b9b6ae', dim: '#7d828c', faint: '#4a4f59', panel: '#12151c', line: 'rgba(236,232,223,.22)', bg: '#0d0f14' };

  function head(root, kicker, title) {
    const k = A().at(A().el('div', 'kicker', kicker, root), 160, 96);
    const t = A().at(A().el('div', 'h-md', title, root), 160, 136, 1560);
    return { k, t };
  }
  function kicker(root, text, x, y) { return A().at(A().el('div', 'kicker', text, root), x, y); }

  /** right-hand explanation; create in mount, set() per click (cross-fades, replay-safe) */
  function panel(root, x = 1386, y = 300, w = 470) {
    const el = A().at(A().el('div', 'panel', '', root), x, y, w);
    return {
      el,
      set(k, title, body, col) {
        const html = `<div class="kicker" style="color:${col || 'var(--amber)'}">${k}</div><div class="t">${title}</div><div class="body">${body}</div>`;
        if (A().instant) { el.innerHTML = html; return; }
        A().to(el, { opacity: 0, duration: 0.2 });
        A().after(220, () => { el.innerHTML = html; });
        A().to(el, { opacity: 1, duration: 0.4, delay: 0.25 });
      },
    };
  }

  /** the engineers' strip at the bottom of every slide; set() per click */
  function uth(root, text) {
    const el = A().at(A().el('div', 'uth', '', root), 160, 952, 1600);
    const o = {
      el,
      set(t) {
        const html = `<b>UNDER THE HOOD</b> · ${t}`;
        if (A().instant) { el.innerHTML = html; return; }
        A().to(el, { opacity: 0, duration: 0.15 });
        A().after(170, () => { el.innerHTML = html; });
        A().to(el, { opacity: 1, duration: 0.3, delay: 0.2 });
      },
    };
    if (text) el.innerHTML = `<b>UNDER THE HOOD</b> · ${text}`;
    return o;
  }

  /** a component box in an svg; returns its group with geometry */
  function box(svg, x, y, w, h, title, o = {}) {
    const g = svg.append('g').attr('class', 'bx');
    const r = g.append('rect').attr('x', x).attr('y', y).attr('width', w).attr('height', h).attr('rx', o.rx ?? 14)
      .attr('fill', o.fill || C.panel).attr('stroke', o.stroke || C.line).attr('stroke-width', o.sw || 2);
    if (o.dash) r.attr('stroke-dasharray', o.dash);
    const ty = o.sub ? y + h / 2 - 4 : y + h / 2 + 8;
    const t = g.append('text').attr('x', x + w / 2).attr('y', ty).attr('text-anchor', 'middle').attr('fill', o.col || C.ink)
      .attr('font-size', o.size || 22).style('font-family', o.font || 'var(--sans)').text(title);
    let s = null;
    if (o.sub) s = g.append('text').attr('x', x + w / 2).attr('y', ty + 28).attr('text-anchor', 'middle').attr('fill', C.dim)
      .attr('font-size', o.subSize || 15).style('font-family', 'var(--mono)').text(o.sub);
    return Object.assign(g, { x, y, w, h, cx: x + w / 2, cy: y + h / 2, r, t, s });
  }
  /** curved connector between two points; returns the path node */
  function link(svg, p0, p1, o = {}) {
    const mx = (p0[0] + p1[0]) / 2;
    const d = o.straight ? `M${p0[0]},${p0[1]} L${p1[0]},${p1[1]}`
      : o.vertical ? `M${p0[0]},${p0[1]} C${p0[0]},${(p0[1] + p1[1]) / 2} ${p1[0]},${(p0[1] + p1[1]) / 2} ${p1[0]},${p1[1]}`
      : `M${p0[0]},${p0[1]} C${mx},${p0[1]} ${mx},${p1[1]} ${p1[0]},${p1[1]}`;
    const p = svg.append('path').attr('d', d).attr('fill', 'none').attr('stroke', o.stroke || C.line).attr('stroke-width', o.w || 2.5);
    if (o.dash) p.attr('stroke-dasharray', o.dash);
    return p.node();
  }
  /** a dot that travels along paths in order, lighting each; ends hidden unless keep */
  function packet(svg, paths, o = {}) {
    const a = A(), col = o.color || C.amber, T = o.dur || 0.8, d0 = o.delay || 0;
    const dot = svg.append('circle').attr('r', o.r || 9).attr('fill', col).style('opacity', 0).node();
    const st = { t: 0 };
    paths.forEach((p, k) => {
      const L0 = p.getTotalLength();
      if (o.light !== false) a.to(p, { attr: { stroke: col }, duration: 0.3, delay: d0 + k * T });
      a.fromTo(st, { t: 0 }, { t: 1, duration: T, delay: d0 + k * T, ease: 'none', immediateRender: false,
        onUpdate: () => { const q = p.getPointAtLength(st.t * L0); dot.setAttribute('cx', q.x); dot.setAttribute('cy', q.y); } });
    });
    a.to(dot, { opacity: 1, duration: 0.15, delay: d0 });
    if (!o.keep) a.to(dot, { opacity: 0, duration: 0.25, delay: d0 + paths.length * T });
    return dot;
  }
  /** small pill label inside an svg */
  function pill(svg, x, y, text, o = {}) {
    const g = svg.append('g');
    const t = g.append('text').attr('x', x).attr('y', y + 5).attr('text-anchor', o.anchor || 'middle').attr('fill', o.col || C.ink)
      .attr('font-size', o.size || 14).style('font-family', 'var(--mono)').text(text);
    const w = (o.w || text.length * (o.size || 14) * 0.62) + 22, h = (o.size || 14) + 14;
    const x0 = o.anchor === 'start' ? x - 11 : o.anchor === 'end' ? x - w + 11 : x - w / 2;
    // solid base first: lines drawn to a pill's centre stop cleanly at its edge instead of showing through
    g.insert('rect', 'text').attr('x', x0).attr('y', y - h / 2).attr('width', w).attr('height', h).attr('rx', h / 2).attr('fill', C.bg);
    g.insert('rect', 'text').attr('x', x0).attr('y', y - h / 2).attr('width', w).attr('height', h).attr('rx', h / 2)
      .attr('fill', o.fill || 'rgba(242,184,75,.10)').attr('stroke', o.stroke || 'rgba(242,184,75,.5)');
    return g;
  }
  return { C, head, kicker, panel, uth, box, link, packet, pill };
})();
