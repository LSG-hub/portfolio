/* GLOBE · travel device between cities.
   G.scene(def) builds a complete "arrival" scene: the globe starts where the previous globe scene left it,
   flies to def.to on entry (no click needed), drops def.pins, and reveals a text card. Earlier pins stay lit (dim),
   so the map fills up as the story moves forward.
   Lower level: G.globe(root, a, opts) → { fly(view, dur), pin(p, opts), draw() } for custom scenes (e.g. the finale). */
window.G = (function () {
  const world = topojson.feature(WORLD, WORLD.objects.countries);
  const borders = topojson.mesh(WORLD, WORLD.objects.countries, (x, y) => x !== y);
  // detailed Bay Area coastline, faded in for close-ups (the simplified world map is too coarse there)
  const bay = window.BAY ? topojson.feature(BAY, BAY.objects.land) : null;
  const C = { // [lon, lat, label]
    sf: [-122.42, 37.77, 'San Francisco'], mv: [-122.08, 37.39, 'Mountain View'], mp: [-122.18, 37.45, 'Menlo Park'],
    dc: [-77.04, 38.9, 'Washington, DC'], tor: [-79.38, 43.65, 'Toronto'], par: [2.35, 48.86, 'Paris'], lon: [-0.13, 51.51, 'London'],
    hei: [8.67, 49.4, 'Heidelberg'], hz: [120.16, 30.27, 'Hangzhou'], bj: [116.4, 39.9, 'Beijing'], sh: [121.47, 31.23, 'Shanghai'],
    sz: [114.06, 22.54, 'Shenzhen'], hk: [114.17, 22.32, 'Hong Kong'], del: [77.21, 28.61, 'New Delhi'], blr: [77.59, 12.97, 'Bengaluru'],
    ad: [54.37, 24.45, 'Abu Dhabi'], ryd: [46.68, 24.71, 'Riyadh'], seo: [126.98, 37.57, 'Seoul'], tyo: [139.69, 35.69, 'Tokyo'],
  };
  const DEFAULT = [-40, 25, 1];
  const ll = (p) => (typeof p === 'string' ? C[p] : p.ll ? p.ll : C[p.city]);

  function globe(root, a, o = {}) {
    const cx = o.cx ?? 1300, cy = o.cy ?? 560, R = o.r ?? 400;
    const s = a.svg(1920, 1080, root); s.attr('class', 'globe');
    const proj = d3.geoOrthographic().translate([cx, cy]).clipAngle(90).precision(0.3);
    const path = d3.geoPath(proj);
    const defs = s.append('defs');
    const gr = defs.append('radialGradient').attr('id', 'gsh').attr('cx', '35%').attr('cy', '30%');
    gr.append('stop').attr('offset', '0%').attr('stop-color', '#1a2233');
    gr.append('stop').attr('offset', '100%').attr('stop-color', '#07090d');
    // soft-edged window: the globe may zoom past the frame but fades out before the ribbon and the text column
    const mk = defs.append('linearGradient').attr('id', 'gfadeV').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 1);
    [[0, 0], [0.07, 1], [0.78, 1], [0.89, 0]].forEach(([o, v]) => mk.append('stop').attr('offset', o).attr('stop-color', '#fff').attr('stop-opacity', v));
    const mh = defs.append('linearGradient').attr('id', 'gfadeH').attr('x1', 0).attr('y1', 0).attr('x2', 1).attr('y2', 0);
    [[0, 0], [0.18, 1], [1, 1]].forEach(([o, v]) => mh.append('stop').attr('offset', o).attr('stop-color', '#fff').attr('stop-opacity', v));
    const mask = defs.append('mask').attr('id', 'gmask').attr('maskUnits', 'userSpaceOnUse').attr('x', 0).attr('y', 0).attr('width', 1920).attr('height', 1080);
    mask.append('rect').attr('x', o.maskX ?? 760).attr('y', 0).attr('width', 1920 - (o.maskX ?? 760)).attr('height', 1080).attr('fill', 'url(#gfadeV)');
    const mask2 = defs.append('mask').attr('id', 'gmask2').attr('maskUnits', 'userSpaceOnUse').attr('x', 0).attr('y', 0).attr('width', 1920).attr('height', 1080);
    mask2.append('rect').attr('x', o.maskX ?? 760).attr('y', 0).attr('width', 1920 - (o.maskX ?? 760)).attr('height', 1080).attr('fill', 'url(#gfadeH)');
    const root2 = s.append('g').attr('mask', o.noMask ? null : 'url(#gmask2)').append('g').attr('mask', o.noMask ? null : 'url(#gmask)');
    const halo = root2.append('circle').attr('fill', 'none').attr('stroke', 'rgba(106,168,255,.18)').attr('stroke-width', 18);
    const sphere = root2.append('path').attr('fill', 'url(#gsh)').attr('stroke', 'rgba(236,232,223,.25)').attr('stroke-width', 1.2);
    const grat = root2.append('path').attr('fill', 'none').attr('stroke', 'rgba(236,232,223,.06)');
    const land = root2.append('path').attr('fill', '#232a36').attr('stroke', 'none');
    const landHi = root2.append('path').attr('fill', '#232a36').attr('stroke', 'rgba(236,232,223,.22)').attr('stroke-width', 1);
    const bord = root2.append('path').attr('fill', 'none').attr('stroke', 'rgba(236,232,223,.16)').attr('stroke-width', 0.7);
    const pg = root2.append('g');
    const graticule = d3.geoGraticule10();
    const view = { lon: (o.view || DEFAULT)[0], lat: (o.view || DEFAULT)[1], k: (o.view || DEFAULT)[2] };
    const pins = [];
    const plan = { lon: view.lon, lat: view.lat, k: view.k }; // where the last scheduled flight ends (for chaining)
    function draw() {
      proj.rotate([-view.lon, -view.lat]).scale(R * view.k);
      halo.attr('cx', cx).attr('cy', cy).attr('r', R * view.k + 9);
      sphere.attr('d', path({ type: 'Sphere' })); grat.attr('d', path(graticule));
      // close-up blend: past ~6× the coarse map hands over to the detailed coastline
      const z = Math.max(0, Math.min(1, (view.k - 6) / 8));
      land.attr('d', path(world)).attr('opacity', 1 - z); bord.attr('d', path(borders)).attr('opacity', 1 - z);
      landHi.attr('d', bay && z > 0 ? path(bay) : null).attr('opacity', z);
      const center = [view.lon, view.lat];
      pins.forEach(p => {
        const vis = d3.geoDistance(p.ll, center) < Math.PI / 2 - 0.05;
        const [x, y] = proj(p.ll);
        p.g.attr('transform', `translate(${x},${y})`).style('display', vis ? null : 'none');
      });
    }
    /** add a pin. p: city key | {city|ll, label, sub, color}. opts.dim → an earlier pin (small, no label) */
    function pin(p, opts = {}) {
      const L = ll(p), label = (typeof p === 'object' && p.label) || (L && L[2]) || '', sub = typeof p === 'object' ? p.sub : '';
      const color = (typeof p === 'object' && p.color) || '#f2b84b';
      const g = pg.append('g').attr('class', 'pin');
      const dy = opts.dy || 0, dx0 = opts.left ? -14 : 14, anc = opts.left ? 'end' : 'start';
      if (opts.mini) { // an earlier pin, labelled small (used in close-ups where neighbours matter)
        // stacked pins (same city): the first keeps the map dot; the rest get an inline dot beside their label
        if (dy) g.append('circle').attr('cx', opts.left ? dx0 - 5 : dx0 + 5).attr('cy', dy).attr('r', 5).attr('fill', color);
        else g.append('circle').attr('r', 6).attr('fill', color);
        const tx = dy ? (opts.left ? dx0 - 16 : dx0 + 16) : dx0;
        g.append('text').attr('x', tx).attr('y', 6 + dy).attr('text-anchor', anc).attr('fill', '#cfcac0').attr('font-size', 19).attr('font-family', 'var(--sans)').text(label);
        if (sub) g.append('text').attr('x', tx).attr('y', 26 + dy).attr('text-anchor', anc).attr('fill', '#8a909a').attr('font-size', 13).attr('letter-spacing', 1).text(sub);
      } else if (opts.dim) {
        g.append('circle').attr('r', 5).attr('fill', color).attr('fill-opacity', 0.55);
      } else {
        g.append('circle').attr('class', 'ring').attr('r', 9).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2);
        g.append('circle').attr('r', 7).attr('fill', color);
        const dx = opts.left ? -18 : 18, anchor = opts.left ? 'end' : 'start';
        g.append('text').attr('x', dx).attr('y', 6 + dy).attr('text-anchor', anchor).attr('fill', '#ece8df').attr('font-size', 22).attr('font-family', 'var(--sans)').text(label);
        if (sub) g.append('text').attr('x', dx).attr('y', 30 + dy).attr('text-anchor', anchor).attr('fill', '#9aa0aa').attr('font-size', 15).attr('letter-spacing', 1).text(sub);
      }
      const rec = { ll: [L[0], L[1]], g }; pins.push(rec); draw();
      return rec;
    }
    function tween(v, dur, delay, ease) {
      const st = { lon: plan.lon, lat: plan.lat, lk: Math.log(plan.k) };
      const tgt = { lon: v[0], lat: v[1], lk: Math.log(v[2]) };
      let d = tgt.lon - st.lon; while (d > 180) d -= 360; while (d < -180) d += 360; tgt.lon = st.lon + d; // short way round
      Object.assign(plan, { lon: v[0], lat: v[1], k: v[2] });
      return a.to(st, Object.assign({ duration: dur, delay, ease, onUpdate: () => { view.lon = st.lon; view.lat = st.lat; view.k = Math.exp(st.lk); draw(); } }, tgt));
    }
    /** fly to [lon,lat,k]; calls chain (each starts where the previous one ends). Zoom runs in log space,
        and a close-up (k > 6) never travels while zoomed in: leaving one zooms out first, entering one travels first. */
    function fly(v, dur = 2.6, delay = 0) {
      const from = [plan.lon, plan.lat, plan.k], to = [v[0], v[1], v[2] ?? plan.k];
      const far = d3.geoDistance([from[0], from[1]], [to[0], to[1]]) > 0.05;
      if (far && from[2] > 6) { tween([from[0], from[1], Math.max(to[2], 1.3)], dur * 0.4, delay, 'power2.in'); return tween(to, dur * 0.6, delay + dur * 0.4, 'power2.out'); }
      if (far && to[2] > 6) { tween([to[0], to[1], Math.min(from[2], 1.6)], dur * 0.45, delay, 'power2.inOut'); return tween(to, dur * 0.55, delay + dur * 0.45, 'power2.inOut'); }
      return tween(to, dur, delay, 'power2.inOut');
    }
    draw();
    return { svg: s, proj, view, pins, pin, fly, draw, cx, cy, R };
  }

  /** view [lon,lat,k] where the previous globe scene (in running order) ended */
  function prevView(id) {
    const i = Deck.scenes.findIndex(s => s.id === id);
    for (let j = i - 1; j >= 0; j--) if (Deck.scenes[j].globe) return Deck.scenes[j].globe.to;
    return DEFAULT;
  }
  /** pins dropped by globe scenes before this one */
  function prevPins(id) {
    const i = Deck.scenes.findIndex(s => s.id === id), out = [];
    for (let j = 0; j < i; j++) if (Deck.scenes[j].globe) out.push(...(Deck.scenes[j].globe.pins || []));
    return out;
  }

  /** arrival scene. def: {id, chapter, year, title, globe:{to:[lon,lat,k], pins:[...]}, kicker, head, body, source, steps?, step?, extra?(root,a,g)} */
  function scene(def) {
    return Deck.scene(Object.assign({
      steps: 0,
      mount(root, a) {
        const g = globe(root, a, { view: prevView(def.id), cx: def.cx, cy: def.cy, r: def.r });
        if (def.globe.labelPrev) { // close-up: earlier pins get small labels; pins sharing a city stack downwards
          const seen = {};
          prevPins(def.id).forEach(p => { const L = ll(p), key = L[0] + ',' + L[1]; const n = seen[key] = (seen[key] || 0) + 1;
            const rec = g.pin(p, { mini: true, left: p.left, dy: (n - 1) * 46 });
            a.fromTo(rec.g.node(), { opacity: 0 }, { opacity: 1, duration: 0.5, delay: (def.globe.dur || 2.6) * 0.8 }); });
        } else prevPins(def.id).forEach(p => g.pin(p, { dim: true }));
        g.fly(def.globe.to, def.globe.dur || 2.6, 0.2);
        (def.globe.pins || []).forEach((p, k) => {
          const rec = g.pin(p, { left: p.left });
          a.fromTo(rec.g.node(), { opacity: 0 }, { opacity: 1, duration: 0.5, delay: (def.globe.dur || 2.6) + 0.1 + k * 0.25 });
          a.fromTo(rec.g.select('.ring').node(), { attr: { r: 9 } }, { attr: { r: 26 }, opacity: 0, duration: 1.4, delay: (def.globe.dur || 2.6) + 0.1 + k * 0.25, ease: 'power2.out' });
        });
        const card = a.el('div', 'abs', '', root); a.at(card, 160, def.cardY ?? 330, def.cardW ?? 640);
        card.innerHTML = `<div class="kicker">${def.kicker || ''}</div>
          <div class="h-lg" style="margin-top:18px">${def.head || ''}</div>
          ${def.body ? `<div class="body-lg" style="margin-top:24px">${def.body}</div>` : ''}`;
        a.reveal(card, { delay: (def.globe.dur || 2.6) * 0.55 });
        if (def.source) L.source(root, def.source, 160, 958, 1500);
        Deck._g = g;
        if (def.extra) def.extra(root, a, g);
      },
    }, def));
  }
  return { C, world, borders, globe, scene, prevView, prevPins, DEFAULT };
})();
