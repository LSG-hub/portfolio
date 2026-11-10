/* A chapter opener, the I.open / R.open shape: black, the roadmap's definition rising on its own, then (one click each)
   its parts as amber chips, and a line that hands over to the first test. With `question`, the slide starts on the big
   question and the definition rises as the question steps back. With `cell`, the slide opens on the prompt strip exactly as
   the last chapter left it: the last piece ticks green, the next one lights, and the camera dives into that cell, which
   gives way to the definition. With `wall` (a question number), the slide opens on the opening wall rebuilt exactly, with the
   four questions over it (the ones already answered dimmed and ticked); that question lights, the rest and the wall fall
   away, and it glides into the big question. Class names are prefixed op-. */

/* The opening wall, rebuilt exactly and dimmed, with the four questions over it (the ones already answered ticked). Question
   n lights; the others and the wall fall away; it glides to the centre of the stage. Returns when the big question should
   take over (seconds). Used by the question openers and by W.open. */
window.WallIn = function (root, a, n) {
  const o = { wall: n };
  // the opening wall, as it was, dimmed; the four questions over it; this one lights and glides to the centre
  const W = WallCard.scatter(root, a);
  W.wall.style.opacity = 0;
  a.to(W.wall, { opacity: 0.12, duration: 0.6 });
  const qs = a.el('div', 'center', WallCard.QS.map((t, k) => `<div class="h-lg op-wq" style="position:relative;color:${k % 2 ? 'var(--amber)' : 'var(--ink)'};max-width:1760px;font-size:62px;text-wrap:balance;margin:${k ? 40 : 0}px 0 0;text-shadow:0 0 40px #000">${t}${k < o.wall - 1 ? '<span class="mono op-tick" style="position:absolute;left:-74px;top:50%;margin-top:-22px;width:44px;height:44px;border-radius:50%;border:2px solid var(--green);color:var(--green);font-size:24px;line-height:40px;text-align:center;text-shadow:none">✓</span>' : ''}</div>`).join(''), root);
  qs.style.zIndex = 5;
  const rows = [...qs.children], me = rows[o.wall - 1], p = UI.pos(me);
  rows.forEach((r, k) => gsap.set(r, { opacity: k < o.wall - 1 ? 0.3 : k === o.wall - 1 ? 0.55 : 0.3 }));
  a.fromTo(rows, { y: 24 }, { y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
  a.fromTo(qs.querySelectorAll('.op-tick'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, stagger: 0.15, delay: 0.5, ease: 'back.out(2)' });
  a.to(me, { opacity: 1, scale: 1.04, duration: 0.5, delay: 1.0 });
  a.to(rows.filter(r => r !== me), { opacity: 0, duration: 0.45, delay: 1.7 });
  a.to(W.wall, { opacity: 0, duration: 0.8, delay: 1.7 });
  // glide the question to the centre of the stage, where it resolves into the big question
  a.to(me, { x: 960 - p.cx, y: 540 + 40 - p.cy, scale: 1, duration: 0.9, delay: 1.9, ease: 'power3.inOut' });
  a.to(me, { opacity: 0, scale: 1.1, duration: 0.45, delay: 2.75 });
  return 2.7;
};

window.Opener = function (o) {
  const steps = (o.question ? 1 : 0) + (o.chips ? 1 : 0) + (o.end ? 1 : 0);
  return Deck.scene({
    id: o.id, chapter: o.chapter, section: o.section, title: o.title, steps, noChrome: true,
    mount(root, a) {
      if (o.cell == null) root.style.background = '#000';
      let dly = 0.2, qDelay = 0.2;
      if (o.wall) qDelay = WallIn(root, a, o.wall);
      if (o.cell != null) {
        // the strip, as the previous chapter left it; then a dive into this chapter's cell
        const strip = BriefMap.build(root, a, { y: 420, done: o.prev.done, now: o.prev.now });
        gsap.set(strip.querySelectorAll('.bm-cell, .bm-k'), { opacity: 1 });
        const lit = strip.querySelectorAll('.bm-now'), cells = strip.querySelectorAll('.bm-cell'), me = cells[o.cell];
        gsap.set(lit, { borderColor: '#f2b84b', boxShadow: '0 0 0 4px rgba(242,184,75,.18), 0 0 40px rgba(242,184,75,.35)' });
        a.to(lit, { borderColor: '#5fd39a', boxShadow: '0 0 0 0 rgba(0,0,0,0)', duration: 0.4, delay: 0.3 });
        a.to(me, { borderColor: '#f2b84b', borderStyle: 'solid', backgroundColor: '#12151c', boxShadow: '0 0 0 4px rgba(242,184,75,.18), 0 0 40px rgba(242,184,75,.35)', duration: 0.4, delay: 0.7 });
        const CW = (1600 - 14 * 8) / 9, cx = o.cell * (CW + 14) + CW / 2;
        strip.style.transformOrigin = `${cx}px 64px`;
        a.to([...cells].filter(c => c !== me).concat([strip.querySelector('.bm-k')]), { opacity: 0, duration: 0.5, delay: 1.2 });
        a.to(strip, { x: 960 - (160 + cx), y: 540 - 484, scale: 8, duration: 1.1, delay: 1.3, ease: 'power3.in' });
        a.to(me, { opacity: 0, duration: 0.3, delay: 2.1 });
        dly = 2.2;
      }
      if (o.question) {
        const q = a.el('div', 'center op-q', `<div class="kicker" style="margin-bottom:28px">${o.question[0]}</div>
          <div style="font-family:var(--serif);font-size:84px;line-height:1.08;max-width:1500px;text-wrap:balance">${o.question[1]}</div>`, root);
        if (o.wall) { gsap.set(q.children[0], { opacity: 0 }); a.fromTo(q.children[1], { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.6, delay: qDelay, ease: 'power3.out' }); a.reveal(q.children[0], { delay: qDelay + 0.2 }); }
        else a.reveal(q.children, { stagger: 0.25, delay: 0.2 });
      }
      const d = a.at(a.el('div', 'abs op-def' + (o.question ? ' hide' : ''), `<div class="kicker" style="margin-bottom:20px">${o.kicker}</div>
        <div style="font-family:var(--serif);font-size:${o.size || 56}px;line-height:1.16;color:var(--ink);text-wrap:balance">${o.def}</div>
        <div class="mono" style="margin-top:18px;font-size:14px;letter-spacing:.14em;color:var(--dim)">AI ENGINEER ROADMAP · ${o.kicker.split(' ')[0]}</div>`, root), 260, o.defY || 280, 1400);
      if (!o.question) a.reveal(d.children, { stagger: 0.25, delay: dly });
      if (o.chips) {
        const chips = a.at(a.el('div', 'abs', o.chips.map(([t, ex], k) => `<div class="op-chip hide" style="display:inline-block;vertical-align:top;margin:0 22px 22px 0;padding:18px 26px;border-radius:14px;border:1px solid var(--amber)">
          <div style="font-family:var(--serif);font-size:36px;color:var(--ink);white-space:nowrap"><span class="mono amber" style="font-size:18px;margin-right:14px">${k + 1}</span>${t}</div>
          ${ex ? `<div class="mono" style="margin-top:8px;font-size:18px;color:var(--ink-2);white-space:nowrap">${ex}</div>` : ''}</div>`).join(''), root), 260, o.chipY || 640, 1500);
        chips.classList.add('op-chips');
      }
      if (o.end) {
        const e = a.at(a.el('div', 'abs hide op-end', o.end, root), 260, o.endY || 900, 1500);
        Object.assign(e.style, { fontFamily: 'var(--serif)', fontSize: '42px', color: 'var(--ink)' });
      }
    },
    step(i, a) {
      let k = i;
      if (o.question) {
        if (k === 0) {
          a.to('.op-q', { y: -380, scale: 0.6, opacity: 0.35, duration: 0.8, ease: 'power3.inOut' });
          a.reveal('.op-def', { delay: 0.5 });
          return;
        }
        k--;
      }
      if (o.chips && k === 0) {
        a.reveal('.op-chip', { stagger: 0.3 });
        a.to('.op-def .op-h', { color: '#f2b84b', duration: 0.4, stagger: 0.3, delay: 0.2 });
        return;
      }
      a.reveal('.op-end');
    },
  });
};
