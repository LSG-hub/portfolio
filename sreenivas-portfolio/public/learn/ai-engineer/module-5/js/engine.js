/* OPEN · deck engine
   Scenes register with Deck.scene({...}). Each scene:
     id, chapter ('0','CO','1'...'10','E'), title, year (number or [from,to]) for the ribbon,
     optional (bool), dc (bool: director's-cut scene, outside main flow), dcFrom (scene ids that open it),
     steps (number of clicks after mount), mount(root, api), step(i, api)  (i = 0..steps-1)
   Navigation is deterministic: going back remounts the scene and replays steps instantly. */
(function () {
  const W = 1920, H = 1080;
  // chapters are years ('2015'…'2026'), plus '0' opening, 'F' part 2, 'E' epilogue, 'DC' director's cut
  const ERA = (y) => '';
  // Cut 3: chapters get added here as the new running order takes shape
  const CH_NAMES = { '0': 'Prompt Engineering', 'DC': "Director's cut" };
  const ERA_NUM = {};
  function chLabel(ch) {
    if (/^\d{4}$/.test(ch)) return { num: ch, name: ERA(+ch) };
    if (ERA_NUM[ch]) return { num: ERA_NUM[ch], name: CH_NAMES[ch] };
    return { num: '', name: CH_NAMES[ch] || '' };
  }
  const params = new URLSearchParams(location.search);
  const FOLLOWER = params.has('follow');          // presenter preview iframes: render state only
  const PREVIEW_OFFSET = +(params.get('offset') || 0); // 0 = current, 1 = next scene preview
  const STILL = params.has('still');               // screenshot mode: every mount renders its finished state

  const registry = [];
  const Deck = (window.Deck = {
    scenes: registry, notes: {}, chNames: CH_NAMES, chLabel,
    scene(def) { registry.push(def); return def; },
  });

  let order = [], idx = 0, beat = 0, skipOptional = false, dcStack = [];
  let stage, sceneEl, live = []; // tracked tweens / timers for cleanup + instant replay
  let instant = false;
  const chan = 'BroadcastChannel' in window ? new BroadcastChannel('m5-cut3-deck') : null;

  /* ---------------- api given to scenes ---------------- */
  const api = {
    get instant() { return instant; },
    W, H,
    el(tag, cls, html, parent) {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (html != null) e.innerHTML = html;
      (parent || sceneEl).appendChild(e);
      return e;
    },
    at(e, x, y, w) { Object.assign(e.style, { position: 'absolute', left: x + 'px', top: y + 'px' }); if (w) e.style.width = w + 'px'; return e; },
    svg(w = W, h = H, parent) {
      const s = d3.select(parent || sceneEl).append('svg').attr('width', w).attr('height', h)
        .attr('viewBox', `0 0 ${w} ${h}`).style('position', 'absolute').style('left', 0).style('top', 0).style('overflow', 'visible');
      return s;
    },
    track(t) { live.push(t); if (instant && t && t.progress) t.progress(1); return t; },
    to(t, v) { return api.track(gsap.to(t, v)); },
    from(t, v) { return api.track(gsap.from(t, v)); },
    fromTo(t, a, b) { return api.track(gsap.fromTo(t, a, b)); },
    set(t, v) { return gsap.set(t, v); },
    tl(v) { return api.track(gsap.timeline(v)); },
    /** looping ambient animation: skipped in instant mode until settled, always killed on unmount */
    loop(fn, ms) { const id = setInterval(fn, ms); live.push({ kill: () => clearInterval(id) }); return id; },
    after(ms, fn) { if (instant) { fn(); return; } const id = setTimeout(fn, ms); live.push({ kill: () => clearTimeout(id) }); },
    /** fade+rise reveal helper (no blur: text stays sharp the whole time, and blur compresses badly on Meet) */
    reveal(t, o = {}) { return api.fromTo(t, { opacity: 0, y: o.y ?? 24 },
      { opacity: 1, y: 0, duration: o.d ?? 0.9, delay: o.delay ?? 0, stagger: o.stagger ?? 0, ease: 'power3.out' }); },
    dimOut(t, to = 0.18, d = 0.6) { return api.to(t, { opacity: to, duration: d, ease: 'power2.out' }); },
    /** typewriter into element */
    type(e, text, cps = 38, delay = 0) {
      e.textContent = '';
      if (instant) { e.textContent = text; return; }
      e.classList.add('caret');
      const st = { n: 0 };
      return api.to(st, { n: text.length, duration: text.length / cps, delay, ease: 'none',
        onUpdate: () => { e.textContent = text.slice(0, Math.round(st.n)); },
        onComplete: () => { e.textContent = text; e.classList.remove('caret'); } });
    },
    /** count a number up inside element */
    count(e, to, o = {}) {
      const fmt = o.fmt || (v => Math.round(v).toLocaleString('en-US'));
      if (instant) { e.textContent = fmt(to); return; }
      const st = { v: o.from || 0 };
      return api.to(st, { v: to, duration: o.d ?? 1.6, delay: o.delay ?? 0, ease: o.ease || 'power2.out', onUpdate: () => { e.textContent = fmt(st.v); } });
    },
    fam: (k) => getComputedStyle(document.documentElement).getPropertyValue('--' + k).trim() || '#ccc',
  };
  Deck.api = api;

  /* ---------------- stage scaling ---------------- */
  function fit() {
    const s = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  }

  /* ---------------- ordering ---------------- */
  function sortRegistry() {
    const O = window.ORDER || [], pos = new Map(O.map((id, i) => [id, i]));
    const key = (s) => { if (pos.has(s.id)) return pos.get(s.id);
      // unknown id: after the last listed scene of the same chapter
      let k = -1; registry.forEach(r => { if (r.chapter === s.chapter && pos.has(r.id)) k = Math.max(k, pos.get(r.id)); }); return k + 0.5; };
    const idx = new Map(registry.map((s, i) => [s, i]));
    registry.sort((a, b) => (key(a) - key(b)) || (idx.get(a) - idx.get(b)));
    // the ribbon is a progress bar: its marker may never move backwards along the running order
    let run = -Infinity;
    registry.forEach(s => { if (s.dc || s.year == null) return;
      const [a, b] = Array.isArray(s.year) ? s.year : [s.year, s.year];
      const e = Math.max(b, run); s._ry = [Math.min(a, e), e]; run = e; });
  }
  function buildOrder() {
    // when a running order is given, only listed scenes play; unlisted drafts stay registered but hidden
    const O = new Set(window.ORDER || []);
    order = registry.filter(s => !s.dc && !(skipOptional && s.optional) && (!O.size || O.has(s.id)));
  }
  const cur = () => (dcStack.length ? dcStack[dcStack.length - 1].scene : order[idx]);

  /* ---------------- chrome (chapter label + ribbon) ---------------- */
  const Y0 = 2019, Y1 = 2027;
  function buildRibbon() {
    const r = document.getElementById('ribbon');
    r.innerHTML = '<div class="track"></div><div class="span"></div><div class="marker"></div>';
    for (let y = Y0; y <= 2026; y++) {
      const p = ((y - Y0) / (Y1 - Y0)) * 100;
      const t = document.createElement('div'); t.className = 'tick'; t.style.left = p + '%'; r.appendChild(t);
      const l = document.createElement('div'); l.className = 'yr'; l.dataset.y = y; l.style.left = p + '%'; l.textContent = y; r.appendChild(l);
    }
  }
  function updateChrome(s) {
    const c = document.getElementById('chrome-chapter');
    const lb = chLabel(s.dc ? 'DC' : s.chapter);
    c.innerHTML = (lb.num ? `<span class="num">${lb.num}</span>` : '') + `<span>${lb.name}</span>` + (s.optional ? '<span class="opt">optional</span>' : '');
    c.classList.toggle('hidden', !!s.noChrome);
    document.getElementById('dc-badge').classList.toggle('on', !!dcStack.length);
    const r = document.getElementById('ribbon');
    r.classList.toggle('hidden', !!s.noChrome || s.year == null);
    if (s.year != null) {
      const [a, b] = s._ry || (Array.isArray(s.year) ? s.year : [s.year, s.year]);
      const pa = ((a - Y0) / (Y1 - Y0)) * 100, pb = ((b - Y0) / (Y1 - Y0)) * 100;
      r.querySelector('.marker').style.left = pb + '%';
      const sp = r.querySelector('.span'); sp.style.left = pa + '%'; sp.style.width = Math.max(0, pb - pa) + '%';
      r.querySelectorAll('.yr').forEach(l => l.classList.toggle('on', +l.dataset.y >= Math.floor(a) && +l.dataset.y <= Math.floor(b)));
    }
  }

  /* ---------------- mounting ---------------- */
  function killLive() { live.forEach(t => { try { t.kill && t.kill(); } catch (e) {} }); live = []; }
  function mount(s, toBeat, fast) {
    killLive();
    sceneEl.innerHTML = '';
    sceneEl.className = '';
    sceneEl.removeAttribute('style'); // a scene may set its own background; never let it leak into the next
    instant = !!fast || STILL;
    try { s.mount && s.mount(sceneEl, api); } catch (e) { console.error('mount', s.id, e); }
    for (let i = 0; i < toBeat; i++) { try { s.step && s.step(i, api); } catch (e) { console.error('step', s.id, i, e); } }
    instant = false;
    beat = toBeat;
    updateChrome(s);
    if (!fast && !FOLLOWER && !STILL) gsap.fromTo(sceneEl, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out' });
    else sceneEl.style.opacity = 1;
    broadcast();
    if (!FOLLOWER) history.replaceState(null, '', `#${encodeURIComponent(s.id)}/${beat}`);
  }

  /* ---------------- navigation ---------------- */
  function next() {
    const s = cur();
    if (beat < (s.steps || 0)) { s.step(beat, api); beat++; broadcast(); history.replaceState(null, '', `#${encodeURIComponent(s.id)}/${beat}`); return; }
    if (dcStack.length) { closeDC(); return; }
    if (idx < order.length - 1) { idx++; mount(order[idx], 0); }
  }
  function prev() {
    const s = cur();
    if (beat > 0) { mount(s, beat - 1, true); return; }
    if (dcStack.length) { closeDC(); return; }
    if (idx > 0) { idx--; const p = order[idx]; mount(p, p.steps || 0, true); }
  }
  function gotoId(id, b = 0) {
    buildOrder();
    if (!order.length) return;
    let i = order.findIndex(s => s.id === id);
    if (i < 0) { // optional scene hidden by skip mode, or DC scene
      const s = registry.find(s => s.id === id);
      if (s && s.dc) { openDC(s); return; }
      if (s && s.optional) { skipOptional = false; buildOrder(); i = order.findIndex(x => x.id === id); }
    }
    if (i < 0) i = 0;
    dcStack = []; idx = i; mount(order[idx], Math.min(b, order[idx].steps || 0), b > 0);
  }
  function openDC(s) {
    if (!s) return;
    dcStack.push({ scene: s, ret: { idx, beat } });
    mount(s, 0);
  }
  function closeDC() {
    const top = dcStack.pop();
    if (!top) return;
    idx = top.ret.idx;
    mount(order[idx], top.ret.beat, true);
  }
  function dcForCurrent() {
    const s = cur();
    return registry.filter(d => d.dc && (d.dcFrom || []).includes(s.id));
  }

  /* ---------------- sync with presenter ---------------- */
  function broadcast() {
    if (subsLocal) subsLocal.sync(cur().id, beat);
    if (!chan || FOLLOWER) return;
    const s = cur();
    const nextScene = dcStack.length ? order[dcStack[dcStack.length - 1].ret.idx] : order[idx + 1];
    chan.postMessage({ type: 'state', id: s.id, beat, steps: s.steps || 0, index: idx, total: order.length,
      next: nextScene ? nextScene.id : null, skip: skipOptional, dc: dcStack.length > 0,
      dcAvail: dcForCurrent().map(d => ({ id: d.id, title: d.title })) });
  }
  if (chan) chan.onmessage = (ev) => {
    const m = ev.data || {};
    if (FOLLOWER) {
      if (m.type === 'state') {
        let id = m.id, b = m.beat;
        if (PREVIEW_OFFSET === 1) { id = m.next; b = 0; if (!id) { sceneEl.innerHTML = '<div class="center h-sm dim">End</div>'; return; } }
        const s = registry.find(x => x.id === id);
        if (s) { killLive(); sceneEl.innerHTML = ''; instant = true; try { s.mount(sceneEl, api); for (let i = 0; i < b; i++) s.step(i, api); } catch (e) {} instant = false; updateChrome(s); }
      }
      return;
    }
    if (m.type === 'subs') { lastPresenterSubs = Date.now(); if (subsView) subsView.show(m.words); return; }
    if (m.type === 'subsOpt') { lastPresenterSubs = Date.now(); if (subsLocal) { subsLocal.stop(); subsLocal = null; } if (subsView) subsView.apply(m.opt); return; }
    if (m.type === 'cmd') {
      if (m.cmd === 'next') next(); else if (m.cmd === 'prev') prev();
      else if (m.cmd === 'goto') gotoId(m.id, m.beat || 0);
      else if (m.cmd === 'dc') openDC(registry.find(s => s.id === m.id));
      else if (m.cmd === 'closedc') closeDC();
      else if (m.cmd === 'skip') toggleSkip();
      else if (m.cmd === 'black') document.getElementById('blackout').classList.toggle('on');
      else if (m.cmd === 'hello') broadcast();
      else if (m.cmd === 'home') gotoId(order[0].id);
    }
  };

  /* ---------------- UI helpers ---------------- */
  function toast(t) { const e = document.getElementById('toast'); e.textContent = t; e.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(() => e.classList.remove('on'), 1600); }
  function toggleSkip() {
    const s = cur(); skipOptional = !skipOptional; buildOrder();
    let i = order.indexOf(s); if (i < 0) { i = Math.min(idx, order.length - 1); }
    idx = i; toast(skipOptional ? 'Optional scenes: SKIPPED' : 'Optional scenes: SHOWN'); broadcast();
  }
  function picker(show) {
    const p = document.getElementById('picker');
    if (!show) { p.classList.remove('on'); return; }
    let html = '<div style="color:#7d828c;font-size:13px">Click a scene · Esc to close · 0 or ⌘← back to the start · O toggles optional scenes · D opens director\'s cut · B black screen · S subtitles · P presenter</div>';
    let lastCh = null;
    registry.forEach(s => {
      const ch = s.dc ? 'DC' : s.chapter;
      if (ch !== lastCh) { const lb = chLabel(ch); html += `<h3>${lb.num ? lb.num + ' · ' : ''}${lb.name}</h3>`; lastCh = ch; }
      html += `<a href="#" data-id="${s.id}" class="${s.optional ? 'opt' : ''} ${cur() === s ? 'cur' : ''}">${s.id} · ${s.title}</a>`;
    });
    p.innerHTML = html; p.classList.add('on');
    p.querySelectorAll('a').forEach(a => a.onclick = (e) => { e.preventDefault(); picker(false); gotoId(a.dataset.id); });
  }

  /* ---------------- keyboard / input ---------------- */
  function onKey(e) {
    if (FOLLOWER) return;
    const k = e.key;
    if (document.getElementById('picker').classList.contains('on')) { if (k === 'Escape' || k === 'g') picker(false); return; }
    if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k) && !(e.metaKey || e.ctrlKey)) { e.preventDefault(); prev(); }
    else if (k === 'Home' || k === '0' || (k === 'ArrowLeft' && (e.metaKey || e.ctrlKey))) { e.preventDefault(); gotoId(order[0].id); toast('Back to the start'); }
    else if (k === 'End') gotoId(order[order.length - 1].id);
    else if (k === 'g' || k === 'G') picker(true);
    else if (k === 'o' || k === 'O') toggleSkip();
    else if (k === 'd' || k === 'D') { const list = dcForCurrent(); if (list.length) openDC(list[0]); else toast("No director's cut for this scene"); }
    else if (k === 'Escape') { if (dcStack.length) closeDC(); }
    else if (k === 'b' || k === 'B' || k === '.') document.getElementById('blackout').classList.toggle('on');
    else if (k === 'f' || k === 'F') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
    else if (k === 'n' || k === 'N') toggleGrain();
    else if (k === 'p' || k === 'P') window.open('presenter.html', 'm5-cut3-presenter', 'width=1400,height=900');
    else if (k === 's' || k === 'S') toggleSubs();
  }

  /* ---------------- live subtitles ---------------- */
  // The presenter window normally runs the mic and sends the words; the deck only draws them. S toggles them anywhere.
  // With no presenter open, the deck runs its own mic + script follower (started by S or the first click, as Safari needs a gesture).
  let subsView = null, subsLocal = null, lastPresenterSubs = 0;
  const presenterAlive = () => Date.now() - lastPresenterSubs < 7000;
  function toggleSubs() {
    if (!subsView) return;
    const vis = !subsView.opt.visible;
    subsView.apply({ visible: vis }); toast(vis ? 'Subtitles: ON' : 'Subtitles: OFF');
    if (chan) chan.postMessage({ type: 'subsCtl', visible: vis });
    if (presenterAlive()) return;
    if (vis) startLocalSubs(); else if (subsLocal) { subsLocal.stop(); subsLocal = null; subsView.show(null); }
  }
  function startLocalSubs() {
    if (subsLocal || presenterAlive() || !window.Subs || !subsView || !subsView.opt.visible) return;
    let F = null, sid = null, sb = 0;
    let qT = null;
    const show = () => { subsView.show(F.line()); clearTimeout(qT); if (F.chunkDone()) qT = setTimeout(() => subsView.show(F.line(true)), 1100); };
    const mic = Subs.Mic((words) => { if (F && F.feed(words)) show(); }, (st, msg) => { if (st === 'blocked' || st === 'unsupported') toast('Subtitles: ' + msg); });
    subsLocal = {
      sync(id, b) {
        if (id !== sid) { sid = id; sb = b; F = Subs.Follower(((Deck.notes || {})[id] || {}).say || ''); F.anchor(b, true); subsView.show(F.line(true)); }
        else if (b !== sb) { F.anchor(b, b < sb); sb = b; subsView.show(F.line(true)); }
      },
      stop() { mic.stop(); },
    };
    subsLocal.sync(cur().id, beat); mic.start();
  }

  /* ---------------- grain ---------------- */
  // film grain is OFF by default: random noise compresses badly over Google Meet and softens text. N toggles it.
  let grainTimer = null;
  function toggleGrain() {
    const c = document.getElementById('grain');
    if (grainTimer) { clearInterval(grainTimer); grainTimer = null; c.style.display = 'none'; toast('Grain: OFF'); return; }
    c.style.display = ''; grainTimer = grain(); toast('Grain: ON');
  }
  function grain() {
    const c = document.getElementById('grain'); const ctx = c.getContext('2d');
    c.width = 480; c.height = 270;
    const frames = [];
    for (let f = 0; f < 6; f++) {
      const img = ctx.createImageData(c.width, c.height);
      for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
      frames.push(img);
    }
    let f = 0; return setInterval(() => { ctx.putImageData(frames[f++ % frames.length], 0, 0); }, 90);
  }

  /* ---------------- boot ---------------- */
  Deck.start = async function () {
    if (!registry.length) { setTimeout(Deck.start, 120); return; } // scene files not registered yet: try again shortly
    stage = document.getElementById('stage'); sceneEl = document.getElementById('scene');
    fetch('data/notes.json', { cache: 'no-store' }).then(r => r.json()).then(n => { Deck.notes = n; }).catch(() => {}); // never block the first frame
    sortRegistry();
    buildRibbon(); fit(); addEventListener('resize', fit);
    document.getElementById('grain').style.display = 'none';
    if (!FOLLOWER && window.Subs && !STILL) {
      subsView = Subs.View(stage);
      const kick = () => setTimeout(startLocalSubs, 50); // after a presenter has had a chance to announce itself
      addEventListener('keydown', kick, { once: true }); addEventListener('pointerdown', kick, { once: true });
    }
    if (!FOLLOWER) addEventListener('keydown', onKey);
    stage.addEventListener('click', (e) => { if (!FOLLOWER && e.target.closest('#stage')) next(); });
    buildOrder();
    if (FOLLOWER) { if (chan) chan.postMessage({ type: 'cmd', cmd: 'hello' }); return; }
    const h = decodeURIComponent(location.hash.slice(1)).split('/');
    if (h[0]) gotoId(h[0], +h[1] || 0); else mount(order[0], 0);
    // typing a #id/beat into the address bar jumps there (replaceState never fires this)
    addEventListener('hashchange', () => { const [id, b] = decodeURIComponent(location.hash.slice(1)).split('/'); if (id) gotoId(id, +b || 0); });
  };
})();
