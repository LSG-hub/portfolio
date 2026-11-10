/* ---------------- Is it just Gemini? (Question 1) ----------------
   Gemini's real reply is on screen; Gemini leaves to the left, ChatGPT rises from below, and the same email + prompt runs on
   GPT-6 Luna (a real reply streams in). Then three rows of 20 dots: how many of 20 real replies were safe to send, per model.
   All data REAL: window.MODELS (data/model-runs.js) and window.PLAIN. Class names are prefixed cg- / mdl-. */

window.Chat = (function () {
  const send = `<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="#0d0d0d" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  /** the ChatGPT web app, dark mode, at stage size */
  function build(root, a, o) {
    const w = a.at(a.el('div', 'cg-win abs', '', root), o.x, o.y, o.w);
    Object.assign(w.style, { height: o.h + 'px', borderRadius: '22px', background: '#212121', border: '1px solid rgba(255,255,255,.08)', overflow: 'hidden',
      boxShadow: '0 30px 80px rgba(0,0,0,.6)', fontFamily: 'var(--sans)', color: '#ececec', zIndex: 3 });
    const gy = Math.round(o.h * 0.3);
    w.innerHTML = `
      <div style="position:absolute;left:26px;top:22px;display:flex;align-items:center;gap:9px;font-size:19px"><span>ChatGPT</span><span style="color:#9b9b9b">${o.model}</span><span style="color:#9b9b9b;font-size:12px">▾</span></div>
      <div style="position:absolute;right:24px;top:18px;display:flex;align-items:center;gap:14px">
        <span style="font-size:14px;color:#ececec;border:1px solid #4a4a4a;border-radius:17px;padding:6px 13px">Share</span>
        <span style="width:32px;height:32px;border-radius:50%;background:#0b57d0;color:#fff;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center">A</span></div>
      <div class="cg-greet" style="position:absolute;left:0;right:0;top:${gy}px;text-align:center;font-size:30px;color:#ececec">What can I help with?</div>
      <div class="cg-user" style="position:absolute;right:56px;top:84px;max-width:560px;background:#303030;border-radius:22px;padding:12px 18px;opacity:0">
        <div>${Gem.chip(false)}</div><div style="font-size:17px;margin-top:10px">Reply to this email.</div></div>
      <div class="cg-tag mono" style="position:absolute;left:84px;top:204px;font-size:12px;letter-spacing:.16em;color:#9b9b9b;opacity:0">${o.tag}</div>
      <div class="cg-resp" style="position:absolute;left:84px;top:236px;width:960px;font-size:16.5px;line-height:1.55;color:#ececec"></div>
      <div class="cg-comp" style="position:absolute;left:${(o.w - 760) / 2}px;top:${gy + 70}px;width:760px;height:150px;border-radius:28px;background:#303030">
        <div class="cg-chip" style="position:absolute;left:16px;top:12px;opacity:0">${Gem.chip(true)}</div>
        <div class="cg-line" style="position:absolute;left:24px;top:72px;font-size:17px"><span class="cg-ph" style="color:#9b9b9b">Ask anything</span><span class="cg-in" style="color:#ececec"></span></div>
        <span class="cg-plus" style="position:absolute;left:12px;bottom:10px;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;color:#ececec">+</span>
        <span class="cg-send" style="position:absolute;right:12px;bottom:10px;width:36px;height:36px;border-radius:50%;background:#ececec;display:flex;align-items:center;justify-content:center;opacity:.3">${send}</span></div>
      <div style="position:absolute;left:0;right:0;bottom:16px;text-align:center;font-size:12.5px;color:#9b9b9b">ChatGPT can make mistakes. Check important info.</div>`;
    const q = (s) => w.querySelector(s);
    return { w, gy, greet: q('.cg-greet'), user: q('.cg-user'), tag: q('.cg-tag'), resp: q('.cg-resp'), comp: q('.cg-comp'), chip: q('.cg-chip'),
      line: q('.cg-line'), ph: q('.cg-ph'), input: q('.cg-in'), plus: q('.cg-plus'), send: q('.cg-send') };
  }
  return { build };
})();

Deck.scene({
  id: 'C.models', chapter: 'Q1', title: 'Is it just Gemini?', steps: 3,
  mount(root, a) {
    const M = window.MODELS, PL = window.PLAIN, md = (s) => s.replace(/\*\*(.+?)\*\*/g, '<b style="color:#fff">$1</b>');
    const R = { x: 395, y: 220, w: 1130, h: 720 };
    const h = a.at(a.el('div', 'h-md hide', 'Is it just <span class="amber">Gemini?</span>', root), 140, 92);
    a.reveal(h, { delay: 0.1 });
    // the email stays where C.plain left it: a small thumbnail top right
    const g = Gmail.build(root, a, { x: 1600, y: 66, z: 0.74 }); Gmail.opened(g); Case.marked(g); g.win.style.opacity = 0.9;
    gsap.set(g.win, { scale: 0.22 / 0.74, transformOrigin: '0 0' });  // same thumbnail as C.plain: a scaled picture, not a tiny zoom
    // Gemini, as it was after its real reply
    const G = Gem.build(root, a, R);
    gsap.set(G.greet, { opacity: 0 }); gsap.set([G.chip, G.send, G.comp.children[2]], { opacity: 0 });
    gsap.set(G.comp, { height: 64, top: R.h - 116 }); gsap.set(G.ph.parentNode, { top: 20 });
    gsap.set([G.user, G.resp], { opacity: 1 });
    G.respT.innerHTML = PL.excerpt.map((l, k) => `<div style="margin-top:${k ? 12 : 0}px">${md(l)}</div>`).join('');
    const gt = a.at(a.el('div', 'abs mono', `REAL REPLY · RUN ${PL.excerptRun} OF 20 · EXCERPT`, G.w), 80, 196);
    Object.assign(gt.style, { fontSize: '12px', letterSpacing: '.16em', color: '#8e918f' });
    a.reveal(G.w, { y: 30, delay: 0.2, d: 0.8 });
    // ChatGPT, waiting below (rises on click 1)
    const C = Chat.build(root, a, Object.assign({ model: 'GPT-6 Luna', tag: `REAL REPLY · GPT-6 LUNA · RUN ${M.gptRun} OF 20 · EXCERPT` }, R));
    C.w.style.opacity = 0;
    C.resp.innerHTML = M.gptExcerpt.map((l, k) => `<div class="cg-l" style="opacity:0;margin-top:${k ? 12 : 0}px">${md(l)}</div>`).join('');
    // the three rows of 20 real verdicts (click 2)
    const rows = a.at(a.el('div', 'abs', '', root), 0, 0); rows.id = 'mdl-rows';
    const kick = a.at(a.el('div', 'abs mono hide', 'SAFE TO SEND · SAME EMAIL · SAME PROMPT · 20 REAL RUNS EACH', root), 0, 286);
    Object.assign(kick.style, { width: '1920px', textAlign: 'center', fontSize: '18px', letterSpacing: '.22em', color: 'var(--amber)' }); kick.id = 'mdl-kick';
    M.rows.forEach((r, k) => {
      const y = 370 + k * 150;
      const lab = a.at(a.el('div', 'abs hide mdl-lab', `<span style="font-family:var(--serif);font-size:40px;color:var(--ink)">${r.name}</span>`, rows), 200, y - 8);
      lab.style.width = '420px';
      const dots = a.at(a.el('div', 'abs', r.verdicts.map(v => `<i class="mdl-dot" style="width:28px;height:28px;border-radius:50%;display:inline-block;margin-right:12px;opacity:0;background:${v ? 'var(--green)' : 'var(--red)'}"></i>`).join(''), rows), 640, y + 6);
      dots.style.whiteSpace = 'nowrap'; dots.classList.add('mdl-dots');
      const n = a.at(a.el('div', 'abs hide mdl-n', `<span class="mdl-v" style="font-family:var(--serif);font-size:64px;color:${r.safe ? 'var(--green)' : 'var(--red)'}">0</span><span class="mono" style="font-size:20px;color:var(--dim);margin-left:10px">/ 20</span>`, rows), 1480, y - 24);
      n.dataset.safe = r.safe; n.style.whiteSpace = 'nowrap';
    });
    const rule = a.at(a.el('div', 'abs mono hide', 'SAFE = PROMISES NO UNAPPROVED DISCOUNT AND STATES NOTHING IT COULD NOT KNOW · [PLACEHOLDERS] COUNT AS SAFE', root), 0, 806);
    Object.assign(rule.style, { width: '1920px', textAlign: 'center', fontSize: '14px', letterSpacing: '.12em', color: 'var(--dim)' }); rule.id = 'mdl-rule';
    const end = a.at(a.el('div', 'abs hide', 'Without instructions, you get the model’s habits.<br><span class="amber">Prompting is how you choose them.</span>', root), 0, 880);
    Object.assign(end.style, { width: '1920px', textAlign: 'center', fontFamily: 'var(--serif)', fontSize: '44px', lineHeight: 1.25, color: 'var(--ink)' }); end.id = 'mdl-end';
    const src = a.at(a.el('div', 'abs mono hide', `SOURCE · GEMINI 3.8 FLASH, GPT-5.6 LUNA, GPT-6 LUNA · 20 RUNS EACH · DEFAULT SETTINGS · ${M.date.toUpperCase()}`, root), 900, 1040);
    Object.assign(src.style, { width: '960px', textAlign: 'right', fontSize: '13px', letterSpacing: '.14em', color: 'var(--faint)' }); src.id = 'mdl-src';
    const cur = UI.cursor(root, a, 1900, 1100);
    Deck._cm = { G, C, g, cur, R };
  },
  step(i, a) {
    const { G, C, g, cur, R } = Deck._cm;
    if (i === 0) {
      // swap: Gemini leaves to the left with a slight tilt, ChatGPT rises from below
      a.to(G.w, { x: -1150, rotation: -7, opacity: 0, duration: 0.75, ease: 'power3.in' });
      a.fromTo(C.w, { opacity: 0, y: 420 }, { opacity: 1, y: 0, duration: 0.85, delay: 0.35, ease: 'power3.out' });
      // the same email travels from the thumbnail into ChatGPT's composer
      const pk = a.at(a.el('div', 'abs', Gem.chip(true), C.w.parentNode), 0, 0); pk.style.zIndex = 20; pk.style.opacity = 0;
      const to = { x: R.x + (R.w - 760) / 2 + 16, y: R.y + C.gy + 70 + 12 };
      a.fromTo(pk, { x: 1600, y: 100, opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.25, delay: 1.2 });
      a.to(pk, { x: to.x, y: to.y, duration: 0.8, delay: 1.4, ease: 'power3.inOut' });
      a.to(pk, { opacity: 0, duration: 0.15, delay: 2.2 });
      a.to(C.chip, { opacity: 1, duration: 0.15, delay: 2.2 });
      // the same words, typed and sent
      a.to(C.ph, { opacity: 0, display: 'none', duration: 0.15, delay: 2.3 });  // out of the line, so typing starts at the left edge
      a.type(C.input, 'Reply to this email.', 26, 2.4);
      a.to(C.send, { opacity: 1, duration: 0.2, delay: 2.6 });
      const s = { x: R.x + (R.w - 760) / 2 + 760 - 30, y: R.y + C.gy + 70 + 150 - 28 };
      cur.show(2.9); cur.move(s.x, s.y, 0.6, 2.9);
      cur.press(3.55); cur.hide(3.9);
      // the conversation view: greeting goes, the composer drops to the bottom, the reply streams in
      a.to([C.greet, C.chip, C.input, C.plus], { opacity: 0, duration: 0.25, delay: 3.7 });
      a.to(C.comp, { top: R.h - 104, height: 56, duration: 0.5, delay: 3.8, ease: 'power3.inOut' });
      a.to(C.line, { top: 17, left: 24, duration: 0.5, delay: 3.8, ease: 'power3.inOut' });
      a.to(C.input, { display: 'none', duration: 0.01, delay: 4.0 });
      a.to(C.ph, { opacity: 1, display: 'inline', duration: 0.2, delay: 4.2 });
      a.to(C.send, { opacity: 0.3, duration: 0.2, delay: 4.2 });
      a.fromTo(C.user, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, delay: 4.0, ease: 'power3.out' });
      a.to(C.resp.querySelectorAll('.cg-l'), { opacity: 1, duration: 0.35, stagger: 0.32, delay: 4.6 });
      a.to(C.tag, { opacity: 1, duration: 0.4, delay: 6.6 });
    }
    if (i === 1) {
      // three models, 20 real runs each: the verdicts fill in row by row
      a.to(C.w, { opacity: 0, y: -30, duration: 0.5 });
      a.reveal('#mdl-kick', { delay: 0.3 });
      document.querySelectorAll('#mdl-rows .mdl-lab').forEach((l, k) => a.reveal(l, { delay: 0.5 + k * 1.1 }));
      document.querySelectorAll('#mdl-rows .mdl-dots').forEach((d, k) =>
        a.fromTo(d.querySelectorAll('.mdl-dot'), { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.25, stagger: 0.035, delay: 0.7 + k * 1.1, ease: 'back.out(2)' }));
      document.querySelectorAll('#mdl-rows .mdl-n').forEach((n, k) => {
        a.reveal(n, { delay: 1.3 + k * 1.1, y: 0 });
        a.count(n.querySelector('.mdl-v'), +n.dataset.safe, { d: 0.6, delay: 1.3 + k * 1.1 });
      });
      a.reveal('#mdl-rule', { delay: 4.0 });
      a.reveal('#mdl-src', { delay: 4.0 });
    }
    if (i === 2) a.reveal('#mdl-end');
  },
});
