/* 2017 · INSIDE THE MACHINE
   The reusable "model machine", built in real CSS 3D:
     FRONT view  = a stack of layer plates (attention band + weight dials on the front plate)
     SIDE view   = the same plates turned 78°, read as a network: columns of nodes, every line a weight.
   Later scenes reuse M.* for scaling, quantisation, MoE, censorship and fine-tuning. */
window.M = (function () {
  const FRONT = { rotationY: -24, rotationX: -12, x: -40, gap: 26, persp: 1900 };
  const SIDE = { rotationY: -84, rotationX: 0, x: -268, gap: 60, persp: 6000 }; // near-orthographic: upright, evenly spaced plates

  function rig(root, a, o) {
    const { x, y, w = 820, h = 660, sw = 500, sh = 440, layers = 12 } = o;
    const R = a.el('div', 'abs', '', root); a.at(R, x, y, w);
    R.style.height = h + 'px';
    const S = a.el('div', '', '', R);
    Object.assign(S.style, { position: 'absolute', left: (w - sw) / 2 + 'px', top: (h - sh) / 2 + 'px', width: sw + 'px', height: sh + 'px', transformStyle: 'preserve-3d' });
    const slabs = [];
    for (let i = layers - 1; i >= 0; i--) {
      const d = a.el('div', 'slab', '', S);
      Object.assign(d.style, { position: 'absolute', inset: 0, borderRadius: '6px', background: i ? '#1a1d24' : '#15181e',
        border: '1.5px solid rgba(236,232,223,.17)' });
      slabs[i] = d;
    }
    const m = { R, S, slabs, sw, sh, layers, view: 'front' };
    pose(m, FRONT);
    return m;
  }
  function pose(m, v) {
    gsap.set(m.R, { perspective: v.persp });
    gsap.set(m.S, { rotationY: v.rotationY, rotationX: v.rotationX, x: v.x });
    m.slabs.forEach((d, i) => gsap.set(d, { z: -i * v.gap }));
  }
  /** turn the rig to a view; returns the plate geometry of the target view (in stage px) */
  function turn(m, a, v, dur = 2.2) {
    const from = { persp: parseFloat(m.R.style.perspective) || 1900, rotationY: gsap.getProperty(m.S, 'rotationY'), rotationX: gsap.getProperty(m.S, 'rotationX'), x: gsap.getProperty(m.S, 'x'),
      z: m.slabs.map(d => gsap.getProperty(d, 'z')) };
    pose(m, v); const geo = measure(m);
    gsap.set(m.R, { perspective: from.persp });
    gsap.set(m.S, { rotationY: from.rotationY, rotationX: from.rotationX, x: from.x }); m.slabs.forEach((d, i) => gsap.set(d, { z: from.z[i] }));
    a.to(m.R, { perspective: v.persp, duration: dur, ease: 'power3.inOut' });
    a.to(m.S, { rotationY: v.rotationY, rotationX: v.rotationX, x: v.x, duration: dur, ease: 'power3.inOut' });
    m.slabs.forEach((d, i) => a.to(d, { z: -i * v.gap, duration: dur, ease: 'power3.inOut' }));
    return geo;
  }
  function measure(m) {
    const st = document.getElementById('stage').getBoundingClientRect(), k = st.width / 1920;
    return m.slabs.map(d => { const r = d.getBoundingClientRect();
      return { cx: (r.left + r.width / 2 - st.left) / k, top: (r.top - st.top) / k, bot: (r.bottom - st.top) / k }; });
  }
  /** front-plate content: attention band + dial grid */
  function frontFace(m) {
    const W = m.sw, Hh = m.sh, attnH = 150;
    const s = d3.select(m.slabs[0]).append('svg').attr('width', W).attr('height', Hh).style('position', 'absolute').style('left', 0).style('top', 0).attr('class', 'face');
    s.append('text').attr('x', 20).attr('y', 30).attr('fill', '#7d828c').attr('font-size', 14).attr('letter-spacing', 2).text('ATTENTION · words look at each other');
    s.append('line').attr('x1', 14).attr('x2', W - 14).attr('y1', attnH).attr('y2', attnH).attr('stroke', 'rgba(236,232,223,.12)');
    s.append('text').attr('x', 20).attr('y', attnH + 30).attr('fill', '#7d828c').attr('font-size', 14).attr('letter-spacing', 2).text('FEED-FORWARD · weights, shown as dials');
    const attn = s.append('g');
    const cols = 10, rows = 5, gx = (W - 50) / cols, gy = (Hh - attnH - 60) / rows, dials = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const ang = ((r * 7 + c * 13) % 17) / 17 * 270 - 135;
      const d = s.append('g').attr('transform', `translate(${25 + gx * (c + 0.5)},${attnH + 52 + gy * (r + 0.5)})`);
      d.append('circle').attr('r', 13).attr('fill', 'none').attr('stroke', 'rgba(143,193,255,.55)').attr('stroke-width', 1.4);
      d.append('line').attr('x2', 0).attr('y2', -9).attr('stroke', '#8fc1ff').attr('stroke-width', 1.8).attr('stroke-linecap', 'round').attr('transform', `rotate(${ang})`);
      dials.push(d);
    }
    return Object.assign(m, { face: s, attn, dials, attnH });
  }
  /** token vectors inside the attention band of the front plate */
  function columns(m, n) {
    m.attn.selectAll('*').remove();
    const span = m.sw - 60, step = Math.min(40, span / Math.max(n, 1)), x0 = 30 + (span - step * (n - 1)) / 2, y0 = 48;
    const xs = d3.range(n).map(k => x0 + step * k);
    for (let p = 0; p < n; p++) for (let q = 0; q < p; q++)
      m.attn.append('path').attr('d', `M${xs[p]},${y0 + 4} C${xs[p]},${y0 - 20} ${xs[q]},${y0 - 20} ${xs[q]},${y0 + 4}`)
        .attr('fill', 'none').attr('stroke', '#f2b84b').attr('stroke-opacity', 0.08).attr('stroke-width', 1.1);
    xs.forEach((x, k) => { for (let j = 0; j < 6; j++) m.attn.append('rect').attr('class', 'vec').attr('x', x - 6).attr('y', y0 + 10 + j * 13).attr('width', 12).attr('height', 10).attr('rx', 2)
      .attr('fill', d3.interpolateRgb('#2b3a55', '#8fc1ff')(((k * 31 + j * 17) % 11) / 11)); });
  }
  /** side-view network drawn over the turned plates. geo = plate geometry from turn(). */
  function network(root, a, m, geo, o = {}) {
    const nIn = o.nIn || 8, nH = o.nH || 6, nOut = o.nOut || 4;
    const s = a.svg(1920, 1080, root); s.attr('class', 'net');
    const L0 = geo[0], LN = geo[geo.length - 1];
    const colsX = [L0.cx - 100, ...geo.map(g => g.cx), LN.cx + 100];
    const last = colsX.length - 1;
    // one shared top/bottom so every row is perfectly horizontal and every column upright
    const T = d3.median(geo, g => g.top), Bm = d3.median(geo, g => g.bot);
    const span = (k) => k === 0 ? [T + 20, Bm - 20] : k === last ? [T + 70, Bm - 70] : [T + 40, Bm - 40];
    const cnt = (k) => k === 0 ? nIn : k === last ? nOut : nH;
    const nodes = colsX.map((x, k) => { const [t, b] = span(k), n = cnt(k); return d3.range(n).map(j => [x, t + (b - t) * (n === 1 ? 0.5 : j / (n - 1))]); });
    const eg = s.append('g'), ng = s.append('g');
    for (let k = 0; k < last; k++) nodes[k].forEach((p, i) => nodes[k + 1].forEach((q, j) =>
      eg.append('line').attr('class', `e e${k}`).attr('data-i', i).attr('data-j', j).attr('x1', p[0]).attr('y1', p[1]).attr('x2', q[0]).attr('y2', q[1])
        .attr('stroke', '#8fc1ff').attr('stroke-opacity', 0.13).attr('stroke-width', 1)));
    nodes.forEach((col, k) => col.forEach((p, j) => ng.append('circle').attr('class', `n n${k}`).attr('data-j', j).attr('cx', p[0]).attr('cy', p[1])
      .attr('r', k === 0 || k === last ? 10 : 8).attr('fill', '#0d0f14')
      .attr('stroke', k === last ? '#f2b84b' : '#8fc1ff').attr('stroke-width', 2)));
    const lab = (x, y, t) => s.append('text').attr('x', x).attr('y', y).attr('text-anchor', 'middle')
      .attr('fill', '#7d828c').attr('font-size', 15).attr('letter-spacing', 2).text(t);
    lab(colsX[0], span(0)[1] + 44, 'TOKENS IN');
    lab((colsX[1] + colsX[last - 1]) / 2, Math.max(...geo.map(g => g.bot)) + 40, `${geo.length} LAYERS SHOWN · GPT-3 HAS 96`);
    lab(colsX[last], span(last)[1] + 44, 'SCORES OUT');
    return Object.assign(m, { net: s, nodes, colsX });
  }
  /** one forward pass through the side-view network (left → right) */
  function flow(m, a, o = {}) {
    if (a.instant) return;
    const d = o.fast ? 0.07 : 0.16, K = m.nodes.length - 1;
    for (let k = 0; k < K; k++) {
      const es = m.net.selectAll('.e' + k).nodes().filter((e, n) => o.path ? o.path(k, +e.dataset.i, +e.dataset.j) : ((n * 7 + k * 3) % 5 < 2));
      a.fromTo(es, { attr: { 'stroke-opacity': 0.13, stroke: '#8fc1ff' } }, { attr: { 'stroke-opacity': 0.9, stroke: o.color || '#f2b84b' }, duration: d * 1.4, delay: k * d, yoyo: true, repeat: 1, ease: 'power1.inOut' });
      const ns = m.net.selectAll('.n' + (k + 1)).nodes();
      a.fromTo(ns, { attr: { fill: '#0d0f14' } }, { attr: { fill: o.color || '#f2b84b' }, duration: d * 1.4, delay: k * d + d, yoyo: true, repeat: 1 });
    }
  }
  /** which nodes "fire" (deterministic, so replays look identical) */
  function lit(m, kc, j) {
    const last = m.nodes.length - 1;
    if (kc === 0) return true;
    if (kc === last) return j === 1 || j === 2;
    return (j * 5 + kc) % 3 !== 0;
  }
  /** slow-motion pass: one layer at a time; lines light only between firing nodes, leaving a lit route */
  function slowPass(m, a, o = {}) {
    const per = o.per || 0.42, K = m.nodes.length - 1, col = o.color || '#f2b84b';
    const isLit = o.lit || ((kc, j) => lit(m, kc, j));
    a.fromTo(m.net.selectAll('.n0').nodes(), { attr: { fill: '#0d0f14' } }, { attr: { fill: col }, duration: 0.3, stagger: 0.03 });
    for (let k = 0; k < K; k++) {
      const es = m.net.selectAll('.e' + k).nodes().filter(e => { const i = +e.dataset.i, j = +e.dataset.j;
        return isLit(k, i) && isLit(k + 1, j) && (i + j + k) % 2 === 0; });
      a.fromTo(es, { attr: { 'stroke-opacity': 0.13, stroke: '#8fc1ff', 'stroke-width': 1 } }, { attr: { 'stroke-opacity': 0.75, stroke: col, 'stroke-width': 1.8 }, duration: per * 1.2, delay: k * per, ease: 'power2.out' });
      const ns = m.net.selectAll('.n' + (k + 1)).nodes().filter((n, j) => isLit(k + 1, j));
      a.fromTo(ns, { attr: { fill: '#0d0f14' } }, { attr: { fill: col }, duration: per, delay: k * per + per * 0.6 });
      if (o.onLayer) a.after((k * per + per * 0.6) * 1000, () => o.onLayer(k));
    }
    return K * per;
  }
  function resetNet(m) {
    m.net.selectAll('.e').attr('stroke-opacity', 0.13).attr('stroke', '#8fc1ff').attr('stroke-width', 1);
    m.net.selectAll('.n').attr('fill', '#0d0f14');
  }
  return { FRONT, SIDE, rig, pose, turn, measure, frontFace, columns, network, flow, lit, slowPass, resetNet };
})();

